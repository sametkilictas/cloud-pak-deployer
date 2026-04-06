# Cloud Pak Deployer UI - Implementation Guide

This document provides implementation details for dependency resolution, configuration management, authentication, testing, and deployment.

## Table of Contents

1. [Dependency Resolution Algorithm](#1-dependency-resolution-algorithm)
2. [Configuration Management](#2-configuration-management)
3. [Authentication & Security](#3-authentication--security)
4. [Mock UI Implementation](#4-mock-ui-implementation)
5. [Testing Strategy](#5-testing-strategy)
6. [Deployment Pipeline](#6-deployment-pipeline)
7. [Implementation Phases](#7-implementation-phases)

---

## 1. Dependency Resolution Algorithm

### 1.1 Core Algorithm Implementation

```typescript
// services/dependency/DependencyResolver.ts

export class DependencyResolver {
  private dependencyData: DependencyData;
  private graph: Map<string, DependencyNode>;
  
  constructor(dependencyData: DependencyData) {
    this.dependencyData = dependencyData;
    this.graph = new Map();
    this.buildGraph();
  }
  
  /**
   * Build the complete dependency graph from YAML data
   */
  private buildGraph() {
    this.dependencyData.services.forEach(service => {
      const node: DependencyNode = {
        id: service.name,
        name: service.name,
        type: 'service',
        selected: false,
        autoSelected: false,
        required: false,
        dependencies: {
          required: [],
          optional: [],
          conditional: []
        },
        restrictions: service.restrictions
      };
      
      // Add required service dependencies
      service.service_dependencies.required.forEach(dep => {
        node.dependencies.required.push({
          targetId: dep.name,
          type: 'requires',
          reason: dep.notes?.join('; ') || 'Required service dependency'
        });
      });
      
      // Add optional service dependencies
      service.service_dependencies.optional.forEach(dep => {
        node.dependencies.optional.push({
          targetId: dep.name,
          type: 'optional',
          reason: dep.notes?.join('; ') || 'Optional enhancement'
        });
      });
      
      // Add conditional service dependencies
      service.service_dependencies.conditional.forEach(cond => {
        cond.installs?.forEach(dep => {
          node.dependencies.conditional.push({
            targetId: dep.name,
            type: 'installs',
            condition: cond.condition.expression,
            reason: cond.notes?.join('; ') || 'Conditional dependency'
          });
        });
      });
      
      // Add auto-installed component dependencies
      service.component_dependencies.auto_installed.forEach(comp => {
        node.dependencies.required.push({
          targetId: comp.name,
          type: 'requires',
          reason: `Auto-installed component: ${comp.original_name}`
        });
      });
      
      // Add conditional component dependencies
      service.component_dependencies.conditional.forEach(cond => {
        cond.installs.forEach(comp => {
          node.dependencies.conditional.push({
            targetId: comp.name,
            type: 'installs',
            condition: cond.condition.expression,
            reason: cond.notes?.join('; ') || 'Conditional component'
          });
        });
      });
      
      this.graph.set(service.name, node);
    });
  }
  
  /**
   * Resolve all dependencies for selected components
   */
  resolveDependencies(
    selectedComponents: Set<string>,
    configOptions: Record<string, any> = {}
  ): ResolutionResult {
    const resolved = new Set<string>(selectedComponents);
    const autoSelected = new Set<string>();
    const conflicts: Conflict[] = [];
    const explanations = new Map<string, string[]>();
    
    // Process each selected component
    selectedComponents.forEach(componentId => {
      this.resolveComponentDependencies(
        componentId,
        resolved,
        autoSelected,
        explanations,
        configOptions
      );
    });
    
    // Check for conflicts
    conflicts.push(...this.detectConflicts(resolved));
    
    return {
      resolved: Array.from(resolved),
      autoSelected: Array.from(autoSelected),
      conflicts,
      explanations: Object.fromEntries(explanations)
    };
  }
  
  /**
   * Recursively resolve dependencies for a component
   */
  private resolveComponentDependencies(
    componentId: string,
    resolved: Set<string>,
    autoSelected: Set<string>,
    explanations: Map<string, string[]>,
    configOptions: Record<string, any>,
    depth: number = 0
  ) {
    // Prevent infinite recursion
    if (depth > 10) {
      console.warn('Max dependency depth reached for', componentId);
      return;
    }
    
    const node = this.graph.get(componentId);
    if (!node) return;
    
    // Process required dependencies
    node.dependencies.required.forEach(dep => {
      if (!resolved.has(dep.targetId)) {
        resolved.add(dep.targetId);
        autoSelected.add(dep.targetId);
        
        // Add explanation
        if (!explanations.has(dep.targetId)) {
          explanations.set(dep.targetId, []);
        }
        explanations.get(dep.targetId)!.push(
          `Required by ${componentId}: ${dep.reason}`
        );
        
        // Recursively resolve
        this.resolveComponentDependencies(
          dep.targetId,
          resolved,
          autoSelected,
          explanations,
          configOptions,
          depth + 1
        );
      }
    });
    
    // Process conditional dependencies
    node.dependencies.conditional.forEach(dep => {
      if (this.evaluateCondition(dep.condition!, configOptions, componentId)) {
        if (!resolved.has(dep.targetId)) {
          resolved.add(dep.targetId);
          autoSelected.add(dep.targetId);
          
          if (!explanations.has(dep.targetId)) {
            explanations.set(dep.targetId, []);
          }
          explanations.get(dep.targetId)!.push(
            `Conditionally required by ${componentId}: ${dep.reason} (${dep.condition})`
          );
          
          this.resolveComponentDependencies(
            dep.targetId,
            resolved,
            autoSelected,
            explanations,
            configOptions,
            depth + 1
          );
        }
      }
    });
  }
  
  /**
   * Evaluate conditional expressions
   */
  private evaluateCondition(
    condition: string,
    configOptions: Record<string, any>,
    componentId: string
  ): boolean {
    // GPU-related conditions
    if (condition.toLowerCase().includes('gpu')) {
      return configOptions[`${componentId}_gpu_enabled`] === true ||
             configOptions.global_gpu_enabled === true;
    }
    
    // Data quality conditions
    if (condition.toLowerCase().includes('data quality')) {
      return configOptions[`${componentId}_data_quality`] === true;
    }
    
    // Gen AI conditions
    if (condition.toLowerCase().includes('gen ai') || 
        condition.toLowerCase().includes('generative ai')) {
      return configOptions[`${componentId}_gen_ai_enabled`] === true;
    }
    
    // Semantic search conditions
    if (condition.toLowerCase().includes('semantic search') ||
        condition.toLowerCase().includes('relationship explorer')) {
      return configOptions[`${componentId}_semantic_search`] === true;
    }
    
    // Default to false for unknown conditions
    return false;
  }
  
  /**
   * Detect conflicts between selected components
   */
  private detectConflicts(resolved: Set<string>): Conflict[] {
    const conflicts: Conflict[] = [];
    
    resolved.forEach(componentId => {
      const node = this.graph.get(componentId);
      if (!node) return;
      
      node.restrictions.forEach(restriction => {
        // Parse restriction text to find conflicting components
        const conflictMatch = restriction.match(
          /Cannot be installed in the same.*as (.+)/i
        );
        
        if (conflictMatch) {
          const conflictingComponent = conflictMatch[1].trim();
          
          // Check if conflicting component is in resolved set
          resolved.forEach(otherComponent => {
            if (otherComponent.toLowerCase().includes(conflictingComponent.toLowerCase())) {
              conflicts.push({
                component1: componentId,
                component2: otherComponent,
                reason: restriction,
                severity: 'error'
              });
            }
          });
        }
      });
    });
    
    // Remove duplicate conflicts
    return conflicts.filter((conflict, index, self) =>
      index === self.findIndex(c =>
        (c.component1 === conflict.component1 && c.component2 === conflict.component2) ||
        (c.component1 === conflict.component2 && c.component2 === conflict.component1)
      )
    );
  }
  
  /**
   * Get dependency chain for a component
   */
  getDependencyChain(componentId: string): string[] {
    const chain: string[] = [];
    const visited = new Set<string>();
    
    const traverse = (id: string) => {
      if (visited.has(id)) return;
      visited.add(id);
      
      const node = this.graph.get(id);
      if (!node) return;
      
      chain.push(id);
      
      node.dependencies.required.forEach(dep => {
        traverse(dep.targetId);
      });
    };
    
    traverse(componentId);
    return chain;
  }
  
  /**
   * Get optional dependencies for a component
   */
  getOptionalDependencies(componentId: string): DependencyInfo[] {
    const node = this.graph.get(componentId);
    if (!node) return [];
    
    return node.dependencies.optional.map(dep => ({
      id: dep.targetId,
      name: this.graph.get(dep.targetId)?.name || dep.targetId,
      reason: dep.reason,
      type: 'optional'
    }));
  }
  
  /**
   * Validate that all external dependencies are met
   */
  validateExternalDependencies(
    selectedComponents: Set<string>
  ): ValidationResult {
    const missingDependencies: ExternalDependency[] = [];
    const warnings: string[] = [];
    
    selectedComponents.forEach(componentId => {
      const service = this.dependencyData.services.find(s => s.name === componentId);
      if (!service) return;
      
      service.external_dependencies.required.forEach(dep => {
        if (dep.install_behavior === 'must_exist') {
          // These must be pre-installed
          warnings.push(
            `${componentId} requires ${dep.name} to be pre-installed on the cluster`
          );
        }
      });
    });
    
    return {
      valid: missingDependencies.length === 0,
      missingDependencies,
      warnings
    };
  }
}

// Usage in Component Store
export const useComponentStore = create<ComponentStore>((set, get) => ({
  components: [],
  selectedComponents: new Set(),
  autoSelectedComponents: new Set(),
  dependencyGraph: { nodes: [], edges: [] },
  conflicts: [],
  resolver: null,
  
  loadComponents: async () => {
    // Load dependency data from YAML
    const dependencyData = await loadDependencyData();
    const resolver = new DependencyResolver(dependencyData);
    
    set({ resolver });
  },
  
  selectComponent: (componentId: string) => {
    const { resolver, selectedComponents } = get();
    if (!resolver) return;
    
    const newSelected = new Set(selectedComponents);
    newSelected.add(componentId);
    
    // Resolve dependencies
    const result = resolver.resolveDependencies(newSelected);
    
    set({
      selectedComponents: new Set(result.resolved),
      autoSelectedComponents: new Set(result.autoSelected),
      conflicts: result.conflicts,
      dependencyGraph: buildGraphVisualization(result)
    });
  },
  
  deselectComponent: (componentId: string) => {
    const { resolver, selectedComponents, autoSelectedComponents } = get();
    
    // Cannot deselect auto-selected components
    if (autoSelectedComponents.has(componentId)) {
      return;
    }
    
    const newSelected = new Set(selectedComponents);
    newSelected.delete(componentId);
    
    if (resolver) {
      const result = resolver.resolveDependencies(newSelected);
      
      set({
        selectedComponents: new Set(result.resolved),
        autoSelectedComponents: new Set(result.autoSelected),
        conflicts: result.conflicts,
        dependencyGraph: buildGraphVisualization(result)
      });
    }
  }
}));
```

---

## 2. Configuration Management

### 2.1 Configuration Generator

```typescript
// services/config/ConfigGenerator.ts

export class ConfigGenerator {
  /**
   * Generate config.yaml from selected components and user inputs
   */
  generateConfig(
    selectedComponents: Set<string>,
    componentConfigs: Record<string, any>,
    globalConfig: GlobalConfig,
    referenceConfig: CloudPakConfig
  ): CloudPakConfig {
    // Start with reference config as template
    const config: CloudPakConfig = JSON.parse(JSON.stringify(referenceConfig));
    
    // Update global config
    config.global_config = {
      ...config.global_config,
      ...globalConfig
    };
    
    // Update cartridges based on selections
    config.cp4d[0].cartridges = config.cp4d[0].cartridges.map(cartridge => {
      const isSelected = selectedComponents.has(cartridge.name);
      const userConfig = componentConfigs[cartridge.name];
      
      return {
        ...cartridge,
        state: isSelected ? 'installed' : 'removed',
        ...(userConfig || {})
      };
    });
    
    return config;
  }
  
  /**
   * Convert config object to YAML string
   */
  toYAML(config: CloudPakConfig): string {
    return yaml.dump(config, {
      indent: 2,
      lineWidth: -1,
      noRefs: true
    });
  }
  
  /**
   * Validate configuration
   */
  validateConfig(config: CloudPakConfig): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Validate global config
    if (!config.global_config.env_id) {
      errors.push('Environment ID is required');
    }
    
    // Validate CP4D config
    if (!config.cp4d || config.cp4d.length === 0) {
      errors.push('At least one CP4D configuration is required');
    }
    
    // Validate selected cartridges
    const installedCartridges = config.cp4d[0].cartridges.filter(
      c => c.state === 'installed'
    );
    
    if (installedCartridges.length === 0) {
      warnings.push('No cartridges selected for installation');
    }
    
    // Validate entitlements
    if (!config.cp4d[0].cp4d_entitlement || config.cp4d[0].cp4d_entitlement.length === 0) {
      errors.push('At least one entitlement is required');
    }
    
    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }
}
```

### 2.2 Configuration Store

```typescript
// stores/configStore.ts

export const useConfigStore = create<ConfigStore>((set, get) => ({
  configuration: null,
  isDirty: false,
  validationErrors: {},
  generator: new ConfigGenerator(),
  
  initializeConfig: async () => {
    // Load reference config
    const referenceConfig = await loadReferenceConfig();
    set({ configuration: referenceConfig });
  },
  
  updateGlobalConfig: (config: Partial<GlobalConfig>) => {
    set(state => ({
      configuration: {
        ...state.configuration!,
        global_config: {
          ...state.configuration!.global_config,
          ...config
        }
      },
      isDirty: true
    }));
  },
  
  updateComponentConfig: (componentId: string, config: any) => {
    set(state => {
      const cartridges = state.configuration!.cp4d[0].cartridges.map(c =>
        c.name === componentId ? { ...c, ...config } : c
      );
      
      return {
        configuration: {
          ...state.configuration!,
          cp4d: [{
            ...state.configuration!.cp4d[0],
            cartridges
          }]
        },
        isDirty: true
      };
    });
  },
  
  generateYAML: () => {
    const { configuration, generator } = get();
    if (!configuration) return '';
    
    return generator.toYAML(configuration);
  },
  
  validateConfiguration: () => {
    const { configuration, generator } = get();
    if (!configuration) return false;
    
    const result = generator.validateConfig(configuration);
    
    set({
      validationErrors: result.errors.reduce((acc, error) => {
        acc[error] = [error];
        return acc;
      }, {} as Record<string, string[]>)
    });
    
    return result.valid;
  },
  
  saveConfiguration: async (name: string) => {
    const { configuration } = get();
    if (!configuration) return;
    
    // Save to local storage
    const saved = JSON.parse(localStorage.getItem('saved_configs') || '{}');
    saved[name] = {
      config: configuration,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('saved_configs', JSON.stringify(saved));
    
    set({ isDirty: false });
  },
  
  loadConfiguration: async (name: string) => {
    const saved = JSON.parse(localStorage.getItem('saved_configs') || '{}');
    const config = saved[name];
    
    if (config) {
      set({
        configuration: config.config,
        isDirty: false
      });
    }
  },
  
  exportConfiguration: () => {
    const { configuration, generator } = get();
    if (!configuration) return;
    
    const yaml = generator.toYAML(configuration);
    const blob = new Blob([yaml], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `config-${Date.now()}.yaml`;
    a.click();
    URL.revokeObjectURL(url);
  },
  
  importConfiguration: async (file: File) => {
    const text = await file.text();
    const config = yaml.load(text) as CloudPakConfig;
    
    set({
      configuration: config,
      isDirty: false
    });
  }
}));
```

---

## 3. Authentication & Security

### 3.1 OpenShift OAuth Integration

```typescript
// services/auth/AuthService.ts

export class AuthService {
  private apiClient: ApiClient;
  
  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }
  
  /**
   * Authenticate to OpenShift cluster
   */
  async login(ocLoginCommand: string): Promise<LoginResult> {
    // Validate command format
    if (!ocLoginCommand.trim().startsWith('oc login')) {
      throw new Error('Invalid command. Must start with "oc login"');
    }
    
    // Call backend API
    const response = await this.apiClient.ocLogin(ocLoginCommand);
    
    if (response.code === 0) {
      // Extract token from command if present
      const tokenMatch = ocLoginCommand.match(/--token[=\s]+([^\s]+)/);
      if (tokenMatch) {
        const token = tokenMatch[1];
        localStorage.setItem('oc_token', token);
      }
      
      // Verify connection
      const connected = await this.apiClient.checkConnection();
      
      if (connected) {
        return {
          success: true,
          message: 'Successfully connected to OpenShift cluster'
        };
      } else {
        return {
          success: false,
          message: 'Login succeeded but connection verification failed'
        };
      }
    } else {
      return {
        success: false,
        message: response.error || 'Login failed'
      };
    }
  }
  
  /**
   * Check if user is authenticated
   */
  async checkAuth(): Promise<boolean> {
    const token = localStorage.getItem('oc_token');
    if (!token) return false;
    
    return await this.apiClient.checkConnection();
  }
  
  /**
   * Logout
   */
  logout() {
    localStorage.removeItem('oc_token');
  }
  
  /**
   * Get cluster information
   */
  async getClusterInfo(): Promise<ClusterInfo | null> {
    try {
      // This would call an API endpoint to get cluster details
      // For now, return mock data
      return {
        name: 'OpenShift Cluster',
        version: '4.14',
        apiUrl: 'https://api.cluster.example.com:6443'
      };
    } catch {
      return null;
    }
  }
}
```

### 3.2 Auth Store

```typescript
// stores/authStore.ts

export const useAuthStore = create<AuthStore>((set, get) => ({
  isAuthenticated: false,
  clusterInfo: null,
  token: null,
  error: null,
  authService: new AuthService(apiClient),
  
  login: async (command: string) => {
    const { authService } = get();
    
    try {
      set({ error: null });
      const result = await authService.login(command);
      
      if (result.success) {
        const clusterInfo = await authService.getClusterInfo();
        set({
          isAuthenticated: true,
          clusterInfo,
          error: null
        });
      } else {
        set({
          isAuthenticated: false,
          error: result.message
        });
      }
    } catch (error) {
      set({
        isAuthenticated: false,
        error: (error as Error).message
      });
    }
  },
  
  checkConnection: async () => {
    const { authService } = get();
    const isAuth = await authService.checkAuth();
    
    if (isAuth) {
      const clusterInfo = await authService.getClusterInfo();
      set({
        isAuthenticated: true,
        clusterInfo
      });
    } else {
      set({
        isAuthenticated: false,
        clusterInfo: null
      });
    }
    
    return isAuth;
  },
  
  logout: () => {
    const { authService } = get();
    authService.logout();
    set({
      isAuthenticated: false,
      clusterInfo: null,
      token: null
    });
  }
}));
```

### 3.3 Protected Route Component

```typescript
// components/common/ProtectedRoute.tsx

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, checkConnection } = useAuthStore();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    const verify = async () => {
      const isAuth = await checkConnection();
      if (!isAuth) {
        navigate('/login');
      }
      setIsChecking(false);
    };
    
    verify();
  }, []);
  
  if (isChecking) {
    return <Loading />;
  }
  
  return isAuthenticated ? <>{children}</> : null;
};
```

---

## 4. Mock UI Implementation

### 4.1 Mock UI Structure

The mock UI will demonstrate all major capabilities with simulated data and interactions.

**Key Features:**
1. Complete user journey from authentication to deployment
2. Interactive component selection with working dependency resolution
3. Dynamic form generation for component configuration
4. Visual dependency graph rendering
5. Configuration preview showing generated config.yaml
6. Simulated deployment progress with log streaming
7. All major screens, modals, and user interactions
8. Responsive design for desktop and tablet
9. Full IBM Carbon Design System styling

### 4.2 Mock Data Setup

```typescript
// constants/mockData.ts

export const MOCK_COMPONENTS: Component[] = [
  {
    id: 'watson-ml',
    name: 'Watson Machine Learning',
    originalName: 'wml',
    description: 'Build, train, and deploy machine learning models',
    category: 'AI & Machine Learning',
    restrictions: [],
    externalDependencies: [
      {
        name: 'Node Feature Discovery Operator',
        type: 'operator',
        installBehavior: 'must_exist'
      }
    ],
    serviceDependencies: [
      {
        name: 'Watson Studio',
        type: 'service',
        relationship: 'required'
      }
    ],
    componentDependencies: [
      {
        name: 'Common core services',
        type: 'component',
        originalName: 'ccs',
        installBehavior: 'auto_installed'
      }
    ],
    configSchema: {
      fields: [
        {
          name: 'size',
          label: 'Size',
          type: 'select',
          required: true,
          options: [
            { value: 'small', label: 'Small' },
            { value: 'medium', label: 'Medium' },
            { value: 'large', label: 'Large' }
          ],
          defaultValue: 'small'
        }
      ],
      zodSchema: z.object({
        size: z.enum(['small', 'medium', 'large'])
      })
    },
    state: 'removed'
  },
  // ... more components
];

export const MOCK_DEPLOYMENT_LOGS: LogEntry[] = [
  {
    timestamp: '2026-04-06T10:00:00Z',
    level: 'info',
    message: 'Starting deployment process...'
  },
  {
    timestamp: '2026-04-06T10:00:05Z',
    level: 'info',
    message: 'Validating configuration...'
  },
  // ... more logs
];
```

### 4.3 Mock API Responses

```typescript
// services/api/mockClient.ts

export class MockApiClient {
  private deploymentStatus: DeploymentStatus = {
    deployer_active: false
  };
  
  async deploy(request: DeployRequest): Promise<DeployResponse> {
    // Simulate deployment start
    this.deploymentStatus = {
      deployer_active: true,
      deployer_stage: 'validate',
      percentage_completed: 0,
      completion_state: null
    };
    
    // Simulate progress updates
    this.simulateProgress();
    
    return {
      status: 'started',
      message: 'Deployment started successfully'
    };
  }
  
  async getDeployerStatus(): Promise<DeploymentStatus> {
    return this.deploymentStatus;
  }
  
  private simulateProgress() {
    const stages: DeploymentStage[] = [
      'validate',
      'prepare',
      'provision-infra',
      'configure-infra',
      'install-cloud-pak',
      'configure-cloud-pak',
      'deploy-assets',
      'smoke-tests'
    ];
    
    let currentStage = 0;
    let percentage = 0;
    
    const interval = setInterval(() => {
      percentage += 5;
      
      if (percentage >= 100) {
        this.deploymentStatus = {
          deployer_active: false,
          deployer_stage: 'smoke-tests',
          percentage_completed: 100,
          completion_state: 'Successful',
          cp4d_url: 'https://cpd-cpd.apps.cluster.example.com',
          cp4d_user: 'admin',
          cp4d_password: 'password123'
        };
        clearInterval(interval);
      } else {
        currentStage = Math.floor(percentage / 12.5);
        this.deploymentStatus = {
          deployer_active: true,
          deployer_stage: stages[currentStage],
          percentage_completed: percentage,
          completion_state: null
        };
      }
    }, 2000);
  }
}
```

---

## 5. Testing Strategy

### 5.1 Unit Testing

```typescript
// __tests__/services/DependencyResolver.test.ts

describe('DependencyResolver', () => {
  let resolver: DependencyResolver;
  
  beforeEach(() => {
    const mockData = loadMockDependencyData();
    resolver = new DependencyResolver(mockData);
  });
  
  test('should resolve required dependencies', () => {
    const selected = new Set(['watson-ml']);
    const result = resolver.resolveDependencies(selected);
    
    expect(result.resolved).toContain('watson-ml');
    expect(result.resolved).toContain('watson-studio');
    expect(result.autoSelected).toContain('watson-studio');
  });
  
  test('should detect conflicts', () => {
    const selected = new Set(['ikc-premium', 'ikc-standard']);
    const result = resolver.resolveDependencies(selected);
    
    expect(result.conflicts.length).toBeGreaterThan(0);
    expect(result.conflicts[0].severity).toBe('error');
  });
  
  test('should handle conditional dependencies', () => {
    const selected = new Set(['watson-ml']);
    const config = { 'watson-ml_gpu_enabled': true };
    const result = resolver.resolveDependencies(selected, config);
    
    expect(result.resolved).toContain('gpu-operator');
  });
});
```

### 5.2 Integration Testing

```typescript
// __tests__/integration/ComponentSelection.test.tsx

describe('Component Selection Flow', () => {
  test('should select component and auto-select dependencies', async () => {
    render(<ComponentSelectionPage />);
    
    // Select Watson ML
    const wmlCard = screen.getByText('Watson Machine Learning');
    fireEvent.click(wmlCard);
    
    // Verify Watson Studio is auto-selected
    await waitFor(() => {
      const wsCard = screen.getByText('Watson Studio');
      expect(wsCard).toHaveClass('auto-selected');
    });
  });
  
  test('should show conflict warning', async () => {
    render(<ComponentSelectionPage />);
    
    // Select conflicting components
    fireEvent.click(screen.getByText('IBM Knowledge Catalog Premium'));
    fireEvent.click(screen.getByText('IBM Knowledge Catalog Standard'));
    
    // Verify conflict modal appears
    await waitFor(() => {
      expect(screen.getByText(/conflict detected/i)).toBeInTheDocument();
    });
  });
});
```

### 5.3 End-to-End Testing

```typescript
// e2e/deployment-flow.spec.ts

test('complete deployment flow', async ({ page }) => {
  // Login
  await page.goto('/');
  await page.fill('[data-testid="oc-login-input"]', 'oc login https://...');
  await page.click('[data-testid="connect-button"]');
  
  // Wait for component selection page
  await page.waitForSelector('[data-testid="component-grid"]');
  
  // Select components
  await page.click('[data-testid="component-watson-ml"]');
  await page.click('[data-testid="continue-button"]');
  
  // Configure components
  await page.selectOption('[data-testid="wml-size"]', 'small');
  await page.click('[data-testid="deploy-button"]');
  
  // Verify deployment started
  await page.waitForSelector('[data-testid="deployment-progress"]');
  expect(await page.textContent('[data-testid="deployment-stage"]')).toContain('validate');
});
```

---

## 6. Deployment Pipeline

### 6.1 Build Configuration

```typescript
// vite.config.ts

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          carbon: ['@carbon/react', '@carbon/icons-react'],
          charts: ['react-force-graph']
        }
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:32080',
        changeOrigin: true
      }
    }
  }
});
```

### 6.2 Docker Configuration

```dockerfile
# Dockerfile for production build

FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 6.3 CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml

name: Build and Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test
      - run: npm run test:e2e
  
  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v3
        with:
          name: build
          path: build/
  
  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/download-artifact@v3
      - name: Deploy to OpenShift
        run: |
          oc login ${{ secrets.OC_SERVER }} --token=${{ secrets.OC_TOKEN }}
          oc start-build cloud-pak-deployer-ui --from-dir=build/
```

---

## 7. Implementation Phases

### Phase 1: Foundation (Weeks 1-2)
- [ ] Set up project structure with Vite + React + TypeScript
- [ ] Install and configure IBM Carbon Design System
- [ ] Set up Zustand stores
- [ ] Implement API client with Axios
- [ ] Create basic routing structure
- [ ] Implement authentication page and flow

### Phase 2: Component Selection (Weeks 3-4)
- [ ] Parse dependency YAML data
- [ ] Implement DependencyResolver class
- [ ] Create component catalog UI
- [ ] Implement component cards with selection
- [ ] Build dependency graph visualization
- [ ] Implement conflict detection
- [ ] Add search and filtering

### Phase 3: Configuration Management (Weeks 5-6)
- [ ] Implement ConfigGenerator class
- [ ] Create dynamic form generator
- [ ] Build configuration accordion UI
- [ ] Implement YAML preview panel
- [ ] Add save/load configuration
- [ ] Implement export/import functionality
- [ ] Add validation logic

### Phase 4: Deployment & Monitoring (Weeks 7-8)
- [ ] Implement WebSocket manager
- [ ] Create deployment progress UI
- [ ] Build log viewer component
- [ ] Implement real-time status polling
- [ ] Add pause/cancel deployment
- [ ] Create success/failure modals
- [ ] Implement log download

### Phase 5: Mock UI (Week 9)
- [ ] Create mock data for all components
- [ ] Implement mock API client
- [ ] Build complete mock user journey
- [ ] Add simulated deployment progress
- [ ] Test all user interactions
- [ ] Ensure responsive design

### Phase 6: Testing & Polish (Week 10)
- [ ] Write unit tests for all services
- [ ] Write integration tests for key flows
- [ ] Write E2E tests with Playwright
- [ ] Perform accessibility audit
- [ ] Optimize performance
- [ ] Fix bugs and polish UI

### Phase 7: Documentation & Deployment (Week 11)
- [ ] Write user documentation
- [ ] Create developer documentation
- [ ] Set up CI/CD pipeline
- [ ] Deploy to staging environment
- [ ] Perform UAT
- [ ] Deploy to production

---

## Success Criteria

1. **Functional Requirements:**
   - ✓ Users can authenticate to OpenShift cluster
   - ✓ Users can select Cloud Pak components
   - ✓ Dependencies are automatically resolved
   - ✓ Conflicts are detected and prevented
   - ✓ Configuration can be customized
   - ✓ Deployment can be initiated and monitored
   - ✓ Logs are streamed in real-time
   - ✓ Credentials are provided after deployment

2. **Non-Functional Requirements:**
   - ✓ UI follows IBM Carbon Design System
   - ✓ Application is responsive (desktop/tablet)
   - ✓ WCAG 2.1 AA accessibility compliance
   - ✓ Page load time < 3 seconds
   - ✓ 90%+ test coverage
   - ✓ Zero critical security vulnerabilities

3. **User Experience:**
   - ✓ Intuitive navigation
   - ✓ Clear error messages
   - ✓ Helpful tooltips and guidance
   - ✓ Smooth animations and transitions
   - ✓ Professional appearance

---

*End of Implementation Guide*