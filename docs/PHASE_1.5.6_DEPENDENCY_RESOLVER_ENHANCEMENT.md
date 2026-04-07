# Phase 1.5.6: Enhanced Dependency Resolver Implementation

## Overview
This phase enhances the DependencyResolver to support conditional dependencies, external dependencies, and advanced conflict detection based on the complete YAML structure from `ibm_software_hub_requirements_normalized_operational.yaml`.

## Duration
2 days

## Current State Analysis

### Existing DependencyResolver Capabilities
- ✅ Basic required dependency resolution
- ✅ Optional dependency tracking
- ✅ Simple conditional dependency structure
- ✅ Dependency graph building
- ✅ Installation order calculation
- ✅ Circular dependency detection

### Missing Capabilities
- ❌ Conditional dependency evaluation (expression parsing)
- ❌ External dependency validation (operators, storage)
- ❌ Service dependency resolution
- ❌ Component dependency auto-installation
- ❌ Version constraint handling
- ❌ Conflict detection based on restrictions
- ❌ Install behavior enforcement

## Implementation Tasks

### Task 1: Enhanced Type Support (2 hours)

**File:** `deployer-web/ui/src/services/dependency/DependencyResolver.ts`

Add support for CloudPakComponentEnhanced type:

```typescript
import { 
  CloudPakComponent,
  CloudPakComponentEnhanced,
  DependencyGraph, 
  DependencyNode, 
  DependencyEdge,
  Conflict,
  ResolutionResult,
  ConditionalExternalDependency,
  ConditionalServiceDependency,
  ConditionalComponentDependency
} from '../../types';
```

### Task 2: Conditional Expression Evaluator (4 hours)

Create new file: `deployer-web/ui/src/services/dependency/ConditionalEvaluator.ts`

```typescript
/**
 * Conditional Expression Evaluator
 * Evaluates conditional dependency expressions
 */

export interface EvaluationContext {
  selectedComponents: Set<string>;
  componentVersions: Map<string, string>;
  platformVersion?: string;
  installationOptions?: Record<string, any>;
}

export class ConditionalEvaluator {
  /**
   * Evaluate a conditional expression
   * Examples:
   * - "component:watson-studio is selected"
   * - "version >= 5.3.0"
   * - "component:wml is selected AND version >= 5.3.0"
   */
  evaluate(expression: string, context: EvaluationContext): boolean {
    // Parse and evaluate expression
    const tokens = this.tokenize(expression);
    return this.evaluateTokens(tokens, context);
  }

  private tokenize(expression: string): string[] {
    // Split expression into tokens
    return expression
      .replace(/\(/g, ' ( ')
      .replace(/\)/g, ' ) ')
      .split(/\s+/)
      .filter(t => t.length > 0);
  }

  private evaluateTokens(tokens: string[], context: EvaluationContext): boolean {
    // Handle logical operators (AND, OR, NOT)
    // Handle component selection checks
    // Handle version comparisons
    // Handle custom conditions
    
    // Simple implementation for common patterns
    const expr = tokens.join(' ');
    
    // Pattern: "component:X is selected"
    const componentMatch = expr.match(/component:(\S+)\s+is\s+selected/);
    if (componentMatch) {
      const componentId = componentMatch[1];
      return context.selectedComponents.has(componentId);
    }
    
    // Pattern: "version >= X.X.X"
    const versionMatch = expr.match(/version\s*(>=|<=|>|<|==)\s*(\d+\.\d+\.\d+)/);
    if (versionMatch && context.platformVersion) {
      const operator = versionMatch[1];
      const targetVersion = versionMatch[2];
      return this.compareVersions(context.platformVersion, operator, targetVersion);
    }
    
    // Default: return false for unparseable expressions
    console.warn('Unable to evaluate expression:', expr);
    return false;
  }

  private compareVersions(current: string, operator: string, target: string): boolean {
    const parseVersion = (v: string) => v.split('.').map(Number);
    const currentParts = parseVersion(current);
    const targetParts = parseVersion(target);
    
    for (let i = 0; i < 3; i++) {
      const c = currentParts[i] || 0;
      const t = targetParts[i] || 0;
      
      if (c !== t) {
        switch (operator) {
          case '>=': return c >= t;
          case '<=': return c <= t;
          case '>': return c > t;
          case '<': return c < t;
          case '==': return c === t;
        }
      }
    }
    
    return operator === '>=' || operator === '<=' || operator === '==';
  }
}
```

### Task 3: Enhanced Dependency Resolution (6 hours)

Update `DependencyResolver.ts` with new methods:

```typescript
export class DependencyResolver {
  private components: Map<string, CloudPakComponentEnhanced>;
  private conditionalEvaluator: ConditionalEvaluator;

  constructor(components: CloudPakComponentEnhanced[]) {
    this.components = new Map(components.map(c => [c.id, c]));
    this.conditionalEvaluator = new ConditionalEvaluator();
  }

  /**
   * Enhanced dependency resolution with conditional logic
   */
  resolveDependenciesEnhanced(
    selectedIds: string[],
    context?: Partial<EvaluationContext>
  ): ResolutionResult {
    const resolved = new Set<string>(selectedIds);
    const autoSelected = new Set<string>();
    const conflicts: Conflict[] = [];
    const explanations: Record<string, string[]> = {};
    const externalDeps = new Set<string>();
    const queue = [...selectedIds];

    // Build evaluation context
    const evalContext: EvaluationContext = {
      selectedComponents: resolved,
      componentVersions: new Map(),
      platformVersion: context?.platformVersion || '5.3.0',
      installationOptions: context?.installationOptions || {}
    };

    // Initialize explanations
    selectedIds.forEach(id => {
      explanations[id] = ['User selected'];
    });

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const component = this.components.get(currentId);
      if (!component) continue;

      // Process service dependencies
      this.processServiceDependencies(
        component,
        resolved,
        autoSelected,
        queue,
        explanations,
        evalContext
      );

      // Process component dependencies
      this.processComponentDependencies(
        component,
        resolved,
        autoSelected,
        queue,
        explanations,
        evalContext
      );

      // Process external dependencies
      this.processExternalDependencies(
        component,
        externalDeps,
        explanations,
        evalContext
      );

      // Check for conflicts
      this.checkComponentConflicts(
        component,
        resolved,
        conflicts
      );
    }

    return {
      resolved: Array.from(resolved),
      autoSelected: Array.from(autoSelected),
      conflicts,
      explanations,
      externalDependencies: Array.from(externalDeps)
    };
  }

  /**
   * Process service dependencies (required, optional, conditional)
   */
  private processServiceDependencies(
    component: CloudPakComponentEnhanced,
    resolved: Set<string>,
    autoSelected: Set<string>,
    queue: string[],
    explanations: Record<string, string[]>,
    context: EvaluationContext
  ): void {
    // Required service dependencies
    component.serviceDependencies
      .filter(dep => dep.relationship === 'required')
      .forEach(dep => {
        const depComponent = this.findComponentByName(dep.name);
        if (depComponent && !resolved.has(depComponent.id)) {
          resolved.add(depComponent.id);
          autoSelected.add(depComponent.id);
          queue.push(depComponent.id);
          
          if (!explanations[depComponent.id]) {
            explanations[depComponent.id] = [];
          }
          explanations[depComponent.id].push(
            `Required service dependency of ${component.name}`
          );
        }
      });

    // Conditional service dependencies
    component.serviceDependencies
      .filter(dep => dep.relationship === 'conditional')
      .forEach(dep => {
        if (dep.condition) {
          const shouldInclude = this.conditionalEvaluator.evaluate(
            dep.condition,
            context
          );
          
          if (shouldInclude) {
            const depComponent = this.findComponentByName(dep.name);
            if (depComponent && !resolved.has(depComponent.id)) {
              resolved.add(depComponent.id);
              autoSelected.add(depComponent.id);
              queue.push(depComponent.id);
              
              if (!explanations[depComponent.id]) {
                explanations[depComponent.id] = [];
              }
              explanations[depComponent.id].push(
                `Conditional dependency of ${component.name} (${dep.condition})`
              );
            }
          }
        }
      });
  }

  /**
   * Process component dependencies (auto-installed, conditional)
   */
  private processComponentDependencies(
    component: CloudPakComponentEnhanced,
    resolved: Set<string>,
    autoSelected: Set<string>,
    queue: string[],
    explanations: Record<string, string[]>,
    context: EvaluationContext
  ): void {
    // Auto-installed component dependencies
    component.componentDependencies
      .filter(dep => dep.installBehavior === 'auto_installed')
      .forEach(dep => {
        const depComponent = this.findComponentByOriginalName(dep.originalName);
        if (depComponent && !resolved.has(depComponent.id)) {
          resolved.add(depComponent.id);
          autoSelected.add(depComponent.id);
          queue.push(depComponent.id);
          
          if (!explanations[depComponent.id]) {
            explanations[depComponent.id] = [];
          }
          explanations[depComponent.id].push(
            `Auto-installed component dependency of ${component.name}`
          );
        }
      });
  }

  /**
   * Process external dependencies (operators, storage, etc.)
   */
  private processExternalDependencies(
    component: CloudPakComponentEnhanced,
    externalDeps: Set<string>,
    explanations: Record<string, string[]>,
    context: EvaluationContext
  ): void {
    component.externalDependencies.forEach(dep => {
      const depKey = `${dep.type}:${dep.name}`;
      externalDeps.add(depKey);
      
      if (!explanations[depKey]) {
        explanations[depKey] = [];
      }
      explanations[depKey].push(
        `External ${dep.type} required by ${component.name}`
      );
    });
  }

  /**
   * Check for conflicts based on component restrictions
   */
  private checkComponentConflicts(
    component: CloudPakComponentEnhanced,
    resolved: Set<string>,
    conflicts: Conflict[]
  ): void {
    component.restrictions.forEach(restriction => {
      // Parse restriction patterns
      // Example: "Cannot be installed with component X"
      // Example: "Requires OpenShift version >= 4.12"
      
      const conflictMatch = restriction.match(/Cannot be installed with (.+)/i);
      if (conflictMatch) {
        const conflictingName = conflictMatch[1].trim();
        const conflictingComponent = this.findComponentByName(conflictingName);
        
        if (conflictingComponent && resolved.has(conflictingComponent.id)) {
          conflicts.push({
            type: 'incompatible',
            components: [component.id, conflictingComponent.id],
            message: restriction,
            severity: 'error'
          });
        }
      }
    });
  }

  /**
   * Find component by service name
   */
  private findComponentByName(name: string): CloudPakComponentEnhanced | undefined {
    return Array.from(this.components.values()).find(
      c => c.name.toLowerCase() === name.toLowerCase()
    );
  }

  /**
   * Find component by original name (from YAML)
   */
  private findComponentByOriginalName(originalName: string): CloudPakComponentEnhanced | undefined {
    return Array.from(this.components.values()).find(
      c => c.originalName === originalName
    );
  }

  /**
   * Get detailed dependency explanation for a component
   */
  getDependencyExplanation(componentId: string, selectedIds: string[]): {
    direct: string[];
    transitive: string[];
    external: string[];
    conflicts: string[];
  } {
    const component = this.components.get(componentId);
    if (!component) {
      return { direct: [], transitive: [], external: [], conflicts: [] };
    }

    const direct: string[] = [];
    const transitive: string[] = [];
    const external: string[] = [];
    const conflicts: string[] = [];

    // Analyze direct dependencies
    component.serviceDependencies
      .filter(dep => dep.relationship === 'required')
      .forEach(dep => {
        direct.push(`Requires service: ${dep.name}`);
      });

    component.componentDependencies
      .filter(dep => dep.installBehavior === 'auto_installed')
      .forEach(dep => {
        direct.push(`Auto-installs component: ${dep.name}`);
      });

    // Analyze external dependencies
    component.externalDependencies.forEach(dep => {
      external.push(`Requires ${dep.type}: ${dep.name}`);
    });

    // Analyze restrictions
    component.restrictions.forEach(restriction => {
      conflicts.push(restriction);
    });

    return { direct, transitive, external, conflicts };
  }
}
```

### Task 4: Update ResolutionResult Type (1 hour)

**File:** `deployer-web/ui/src/types/component.types.ts`

Add external dependencies to ResolutionResult:

```typescript
export interface ResolutionResult {
  resolved: string[];
  autoSelected: string[];
  conflicts: Conflict[];
  explanations: Record<string, string[]>;
  externalDependencies?: string[]; // NEW
}
```

### Task 5: Update Component Store (2 hours)

**File:** `deployer-web/ui/src/stores/componentStore.ts`

Update to use enhanced resolver:

```typescript
// Add new state
interface ComponentStore {
  // ... existing state
  externalDependencies: Set<string>;
  dependencyExplanations: Map<string, {
    direct: string[];
    transitive: string[];
    external: string[];
    conflicts: string[];
  }>;
  
  // ... existing actions
  getComponentExplanation: (componentId: string) => {
    direct: string[];
    transitive: string[];
    external: string[];
    conflicts: string[];
  };
}

// Update selectComponent to use enhanced resolution
selectComponent: (componentId: string) => {
  const { selectedComponents, resolver } = get();

  if (!resolver) {
    console.error('Resolver not initialized');
    return;
  }

  const newSelected = new Set(selectedComponents);
  newSelected.add(componentId);

  // Use enhanced resolution
  const result = resolver.resolveDependenciesEnhanced(
    Array.from(newSelected),
    {
      platformVersion: '5.3.0',
      installationOptions: {}
    }
  );

  const graph = resolver.buildDependencyGraph(result.resolved);

  set({
    selectedComponents: new Set(result.resolved),
    autoSelectedComponents: new Set(result.autoSelected),
    conflicts: result.conflicts,
    explanations: result.explanations,
    externalDependencies: new Set(result.externalDependencies || []),
    dependencyGraph: graph
  });
},

// Add new getter
getComponentExplanation: (componentId: string) => {
  const { resolver, selectedComponents } = get();
  if (!resolver) {
    return { direct: [], transitive: [], external: [], conflicts: [] };
  }
  return resolver.getDependencyExplanation(
    componentId,
    Array.from(selectedComponents)
  );
}
```

## Testing Strategy

### Unit Tests
Create `deployer-web/ui/src/services/dependency/__tests__/ConditionalEvaluator.test.ts`:

```typescript
import { ConditionalEvaluator, EvaluationContext } from '../ConditionalEvaluator';

describe('ConditionalEvaluator', () => {
  let evaluator: ConditionalEvaluator;
  let context: EvaluationContext;

  beforeEach(() => {
    evaluator = new ConditionalEvaluator();
    context = {
      selectedComponents: new Set(['watson-studio', 'watson-ml']),
      componentVersions: new Map(),
      platformVersion: '5.3.0'
    };
  });

  test('evaluates component selection', () => {
    expect(
      evaluator.evaluate('component:watson-studio is selected', context)
    ).toBe(true);
    
    expect(
      evaluator.evaluate('component:watson-discovery is selected', context)
    ).toBe(false);
  });

  test('evaluates version comparisons', () => {
    expect(
      evaluator.evaluate('version >= 5.2.0', context)
    ).toBe(true);
    
    expect(
      evaluator.evaluate('version >= 5.4.0', context)
    ).toBe(false);
  });
});
```

### Integration Tests
Test complete dependency resolution with real component data.

## Success Criteria

- ✅ Conditional dependencies are correctly evaluated
- ✅ External dependencies are tracked and reported
- ✅ Service dependencies trigger component selection
- ✅ Component dependencies are auto-installed
- ✅ Conflicts are detected based on restrictions
- ✅ Dependency explanations are comprehensive
- ✅ All existing tests pass
- ✅ New unit tests achieve >80% coverage

## Files to Create/Modify

### New Files
1. `deployer-web/ui/src/services/dependency/ConditionalEvaluator.ts`
2. `deployer-web/ui/src/services/dependency/__tests__/ConditionalEvaluator.test.ts`
3. `deployer-web/ui/src/services/dependency/__tests__/DependencyResolver.enhanced.test.ts`

### Modified Files
1. `deployer-web/ui/src/services/dependency/DependencyResolver.ts`
2. `deployer-web/ui/src/stores/componentStore.ts`
3. `deployer-web/ui/src/types/component.types.ts`

## Next Phase
Phase 1.5.7 will update UI components to visualize these enhanced dependency features.

---
Made with Bob