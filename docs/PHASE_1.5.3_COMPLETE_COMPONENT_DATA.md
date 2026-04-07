# Phase 1.5.3: Complete Component Implementation Data
## All 20 High-Priority Components - Ready for Implementation

This document contains the complete, production-ready implementation data for all 20 high-priority components. Each component is fully specified with all YAML attributes and can be directly added to mockComponents.ts.

---

## Implementation Summary

**Total Components to Add:** 20  
**Current Components:** 12  
**Total After Implementation:** 32  
**Component Coverage:** 52% (32/62)

**Category Distribution:**
- AI & Machine Learning: 7 components (Watson Assistant, Watson Discovery, watsonx Orchestrate, Voice Gateway, watsonx Code Assistant, wca-ansible, wca-z)
- Data Management: 5 components (Db2 Warehouse, Match 360, Db2 Big SQL, Data Gate, Data Replication)
- Analytics: 5 components (Decision Optimization, Planning Analytics, SPSS Modeler, Analytics Engine, Cognos Dashboards)
- Governance: 2 components (Data Privacy, MANTA Automated Lineage)
- Integration: 1 component (DataStage Enterprise)

---

## Component Implementation Data

### 1. Watson Assistant (watson-assistant)

**Category:** AI & Machine Learning  
**YAML Line:** 1469  
**Complexity:** High (Complex conditional GPU dependencies)

```typescript
{
  id: 'watson-assistant',
  name: 'Watson Assistant',
  originalName: 'watson-assistant',
  original_name: 'watson-assistant',
  description: 'Build conversational interfaces with AI-powered virtual agents',
  category: 'AI & Machine Learning',
  restrictions: [],
  external_dependencies: {
    required: [
      { name: 'Multicloud Object Gateway', type: 'platform_software', install_behavior: 'must_exist' },
      { name: 'Red Hat OpenShift Serverless Knative Eventing', type: 'platform_software', install_behavior: 'must_exist' }
    ],
    conditional: [
      {
        condition: { expression: 'conversational skills or conversational search features are used' },
        requires: [
          { name: 'Node Feature Discovery Operator', type: 'operator', install_behavior: 'must_exist' },
          { name: 'NVIDIA GPU Operator', type: 'operator', install_behavior: 'must_exist' },
          { name: 'Red Hat OpenShift AI', type: 'platform_software', install_behavior: 'must_exist' }
        ]
      }
    ]
  },
  service_dependencies: {
    required: [],
    optional: [{ name: 'Watson Discovery', type: 'service', notes: ['Enables adding a search skill when conversational search is not used.'] }],
    conditional: [
      {
        condition: { expression: 'conversational search is used' },
        requires: [{ name: 'Watson Discovery', type: 'service' }],
        notes: ['The source says Watson Discovery or Elasticsearch.']
      }
    ]
  },
  component_dependencies: {
    auto_installed: [
      { name: 'Cloud Native PostgreSQL', type: 'component', original_name: 'postgresql', install_behavior: 'auto_installed' },
      { name: 'etcd', type: 'component', original_name: 'opencontent_etcd', install_behavior: 'auto_installed' },
      { name: 'OpenSearch', type: 'component', original_name: 'opencontent_opensearch', install_behavior: 'auto_installed' },
      { name: 'Redis', type: 'component', original_name: 'ibm_redis_cp', install_behavior: 'auto_installed' },
      { name: 'Watson data governor', type: 'component', original_name: 'data_governor', install_behavior: 'auto_installed' },
      { name: 'Watson Gateway', type: 'component', original_name: 'watson_gateway', install_behavior: 'auto_installed' }
    ],
    conditional: [
      {
        condition: { expression: 'GPU features are enabled for conversational skills and conversational search' },
        installs: [
          { name: 'Common core services', type: 'component', original_name: 'ccs', install_behavior: 'auto_installed' },
          { name: 'Inference foundation models', type: 'component', original_name: 'watsonx_ai_ifm', install_behavior: 'auto_installed' }
        ]
      }
    ]
  },
  version_constraints: [],
  notes: [],
  references: [],
  externalDependencies: [{ name: 'Multicloud Object Gateway', type: 'platform_software', installBehavior: 'must_exist' }],
  serviceDependencies: [{ name: 'Watson Discovery', type: 'service', relationship: 'optional' }],
  componentDependencies: [{ name: 'Cloud Native PostgreSQL', type: 'component', originalName: 'postgresql', installBehavior: 'auto_installed' }],
  configSchema: {
    fields: [
      {
        name: 'size',
        label: 'Deployment Size',
        type: 'select',
        required: true,
        options: [
          { value: 'small', label: 'Small' },
          { value: 'medium', label: 'Medium' },
          { value: 'large', label: 'Large' }
        ],
        defaultValue: 'small'
      }
    ]
  },
  state: 'removed',
  version: '5.3.0'
}
```

### 2. Watson Discovery (watson-discovery)

**Category:** AI & Machine Learning  
**YAML Line:** 1181  
**Complexity:** Medium (MCG and conditional GPU)

```typescript
{
  id: 'watson-discovery',
  name: 'Watson Discovery',
  originalName: 'watson-discovery',
  original_name: 'watson-discovery',
  description: 'AI-powered enterprise search and text analytics',
  category: 'AI & Machine Learning',
  restrictions: [],
  external_dependencies: {
    required: [{ name: 'Multicloud Object Gateway', type: 'platform_software', install_behavior: 'must_exist' }],
    conditional: [
      {
        condition: { expression: 'advanced features are used' },
        requires: [
          { name: 'Node Feature Discovery Operator', type: 'operator', install_behavior: 'must_exist' },
          { name: 'NVIDIA GPU Operator', type: 'operator', install_behavior: 'must_exist' },
          { name: 'Red Hat OpenShift AI', type: 'platform_software', install_behavior: 'must_exist' }
        ]
      }
    ]
  },
  service_dependencies: { required: [], optional: [], conditional: [] },
  component_dependencies: {
    auto_installed: [
      { name: 'Cloud Native PostgreSQL', type: 'component', original_name: 'postgresql', install_behavior: 'auto_installed' },
      { name: 'etcd', type: 'component', original_name: 'opencontent_etcd', install_behavior: 'auto_installed' },
      { name: 'OpenSearch', type: 'component', original_name: 'opencontent_opensearch', install_behavior: 'auto_installed' }
    ],
    conditional: []
  },
  version_constraints: [],
  notes: [],
  references: [],
  externalDependencies: [{ name: 'Multicloud Object Gateway', type: 'platform_software', installBehavior: 'must_exist' }],
  serviceDependencies: [],
  componentDependencies: [{ name: 'Cloud Native PostgreSQL', type: 'component', originalName: 'postgresql', installBehavior: 'auto_installed' }],
  configSchema: {
    fields: [
      {
        name: 'deployment_type',
        label: 'Deployment Type',
        type: 'select',
        required: true,
        options: [
          { value: 'Development', label: 'Development' },
          { value: 'Production', label: 'Production' }
        ],
        defaultValue: 'Production'
      }
    ]
  },
  state: 'removed',
  version: '5.3.0'
}
```

### 3. watsonx Orchestrate (watsonx-orchestrate)

**Category:** AI & Machine Learning  
**YAML Line:** 2223  
**Complexity:** Medium (Agentic AI with Watson Assistant integration)

```typescript
{
  id: 'watsonx-orchestrate',
  name: 'watsonx Orchestrate',
  originalName: 'watsonx_orchestrate',
  original_name: 'watsonx_orchestrate',
  description: 'AI-powered automation and agentic workflows',
  category: 'AI & Machine Learning',
  restrictions: [],
  external_dependencies: {
    required: [
      { name: 'Node Feature Discovery Operator', type: 'operator', install_behavior: 'must_exist' },
      { name: 'NVIDIA GPU Operator', type: 'operator', install_behavior: 'must_exist' },
      { name: 'Red Hat OpenShift AI', type: 'platform_software', install_behavior: 'must_exist' }
    ],
    conditional: []
  },
  service_dependencies: {
    required: [],
    optional: [],
    conditional: [
      {
        condition: { expression: 'agentic mode is installed' },
        installs: [{ name: 'Watson Assistant', type: 'service', install_behavior: 'auto_installed' }]
      }
    ]
  },
  component_dependencies: {
    auto_installed: [{ name: 'Common core services', type: 'component', original_name: 'ccs', install_behavior: 'auto_installed' }],
    conditional: []
  },
  version_constraints: [],
  notes: [],
  references: [],
  externalDependencies: [
    { name: 'Node Feature Discovery Operator', type: 'operator', installBehavior: 'must_exist' },
    { name: 'NVIDIA GPU Operator', type: 'operator', installBehavior: 'must_exist' }
  ],
  serviceDependencies: [{ name: 'Watson Assistant', type: 'service', relationship: 'optional', notes: ['Auto-installed in agentic mode'] }],
  componentDependencies: [{ name: 'Common core services', type: 'component', originalName: 'ccs', installBehavior: 'auto_installed' }],
  configSchema: {
    fields: [
      {
        name: 'installMode',
        label: 'Installation Mode',
        type: 'select',
        required: true,
        options: [
          { value: 'agentic', label: 'Agentic (with Watson Assistant)' },
          { value: 'standard', label: 'Standard' }
        ],
        defaultValue: 'agentic'
      }
    ]
  },
  state: 'removed',
  version: '5.3.0'
}
```

### 4. Voice Gateway (voice-gateway)

**Category:** AI & Machine Learning  
**YAML Line:** 1160  
**Complexity:** Low (Simple MCG with conditional GPU)

```typescript
{
  id: 'voice-gateway',
  name: 'Voice Gateway',
  originalName: 'voice-gateway',
  original_name: 'voice-gateway',
  description: 'Voice-enabled conversational AI integration',
  category: 'AI & Machine Learning',
  restrictions: [],
  external_dependencies: {
    required: [{ name: 'Multicloud Object Gateway', type: 'platform_software', install_behavior: 'must_exist' }],
    conditional: [
      {
        condition: { expression: 'enrichment features are used' },
        requires: [
          { name: 'Node Feature Discovery Operator', type: 'operator', install_behavior: 'must_exist' },
          { name: 'NVIDIA GPU Operator', type: 'operator', install_behavior: 'must_exist' },
          { name: 'Red Hat OpenShift AI', type: 'platform_software', install_behavior: 'must_exist' }
        ]
      }
    ]
  },
  service_dependencies: { required: [], optional: [], conditional: [] },
  component_dependencies: {
    auto_installed: [{ name: 'Cloud Native PostgreSQL', type: 'component', original_name: 'postgresql', install_behavior: 'auto_installed' }],
    conditional: []
  },
  version_constraints: [],
  notes: [],
  references: [],
  externalDependencies: [{ name: 'Multicloud Object Gateway', type: 'platform_software', installBehavior: 'must_exist' }],
  serviceDependencies: [],
  componentDependencies: [{ name: 'Cloud Native PostgreSQL', type: 'component', originalName: 'postgresql', installBehavior: 'auto_installed' }],
  configSchema: {
    fields: [
      {
        name: 'replicas',
        label: 'Number of Replicas',
        type: 'number',
        required: false,
        min: 1,
        max: 10,
        defaultValue: 1
      }
    ]
  },
  state: 'removed',
  version: '5.3.0'
}
```

### 5. watsonx Code Assistant (watsonx-code-assistant)

**Category:** AI & Machine Learning  
**YAML Line:** N/A (from reference-config.yaml)  
**Complexity:** Low (GPU requirements for code generation)

```typescript
{
  id: 'watsonx-code-assistant',
  name: 'watsonx Code Assistant',
  originalName: 'wca',
  original_name: 'wca',
  description: 'AI-powered code generation and assistance',
  category: 'AI & Machine Learning',
  restrictions: [],
  external_dependencies: {
    required: [
      { name: 'Node Feature Discovery Operator', type: 'operator', install_behavior: 'must_exist' },
      { name: 'NVIDIA GPU Operator', type: 'operator', install_behavior: 'must_exist' },
      { name: 'Red Hat OpenShift AI', type: 'platform_software', install_behavior: 'must_exist' }
    ],
    conditional: []
  },
  service_dependencies: { required: [], optional: [], conditional: [] },
  component_dependencies: {
    auto_installed: [{ name: 'Common core services', type: 'component', original_name: 'ccs', install_behavior: 'auto_installed' }],
    conditional: []
  },
  version_constraints: [],
  notes: [],
  references: [],
  externalDependencies: [
    { name: 'Node Feature Discovery Operator', type: 'operator', installBehavior: 'must_exist' },
    { name: 'NVIDIA GPU Operator', type: 'operator', installBehavior: 'must_exist' }
  ],
  serviceDependencies: [],
  componentDependencies: [{ name: 'Common core services', type: 'component', originalName: 'ccs', installBehavior: 'auto_installed' }],
  configSchema: {
    fields: [
      {
        name: 'similarity_feature',
        label: 'Enable Similarity Feature',
        type: 'boolean',
        required: false,
        defaultValue: false
      },
      {
        name: 'rag_enabled',
        label: 'Enable RAG',
        type: 'boolean',
        required: false,
        defaultValue: true
      }
    ]
  },
  state: 'removed',
  version: '5.3.0'
}
```

### 6. Db2 Warehouse (db2wh)

**Category:** Data Management  
**YAML Line:** 532  
**Complexity:** Low (Simple Db2U dependency)

```typescript
{
  id: 'db2wh',
  name: 'Db2 Warehouse',
  originalName: 'db2wh',
  original_name: 'db2wh',
  description: 'Enterprise data warehouse for analytics workloads',
  category: 'Data Management',
  restrictions: [],
  external_dependencies: { required: [], conditional: [] },
  service_dependencies: {
    required: [],
    optional: [
      {
        name: 'Db2 Data Management Console',
        type: 'service',
        notes: ['Provides a graphical user interface for SQL execution and a runtime monitoring interface.']
      }
    ],
    conditional: []
  },
  component_dependencies: {
    auto_installed: [{ name: 'Db2U', type: 'component', original_name: 'db2u', install_behavior: 'auto_installed' }],
    conditional: []
  },
  version_constraints: [],
  notes: [],
  references: [],
  externalDependencies: [],
  serviceDependencies: [],
  componentDependencies: [{ name: 'Db2U', type: 'component', originalName: 'db2u', installBehavior: 'auto_installed' }],
  configSchema: {
    fields: [
      {
        name: 'size',
        label: 'Database Size',
        type: 'select',
        required: true,
        options: [
          { value: 'small', label: 'Small' },
          { value: 'medium', label: 'Medium' },
          { value: 'large', label: 'Large' }
        ],
        defaultValue: 'small'
      }
    ]
  },
  state: 'removed',
  version: '5.3.0'
}
```

### 7. Decision Optimization (decision-optimization)

**Category:** Analytics  
**YAML Line:** 555  
**Complexity:** Low (Required WS and WML services)

```typescript
{
  id: 'decision-optimization',
  name: 'Decision Optimization',
  originalName: 'dods',
  original_name: 'dods',
  description: 'Prescriptive analytics for optimal decision-making',
  category: 'Analytics',
  restrictions: [],
  external_dependencies: { required: [], conditional: [] },
  service_dependencies: {
    required: [
      { name: 'Watson Studio', type: 'service', install_behavior: 'must_exist' },
      { name: 'Watson Machine Learning', type: 'service', install_behavior: 'must_exist' }
    ],
    optional: [],
    conditional: []
  },
  component_dependencies: { auto_installed: [], conditional: [] },
  version_constraints: [],
  notes: [],
  references: [],
  externalDependencies: [],
  serviceDependencies: [
    { name: 'Watson Studio', type: 'service', relationship: 'required' },
    { name: 'Watson Machine Learning', type: 'service', relationship: 'required' }
  ],
  componentDependencies: [],
  configSchema: {
    fields: [
      {
        name: 'size',
        label: 'Deployment Size',
        type: 'select',
        required: true,
        options: [
          { value: 'small', label: 'Small' },
          { value: 'medium', label: 'Medium' }
        ],
        defaultValue: 'small'
      }
    ]
  },
  state: 'removed',
  version: '5.3.0'
}
```

### 8. Data Privacy (data-privacy)

**Category:** Governance  
**YAML Line:** 311  
**Complexity:** Low (Requires IKC or IKC Premium)

```typescript
{
  id: 'data-privacy',
  name: 'Data Privacy',
  originalName: 'dp',
  original_name: 'dp',
  description: 'Data privacy and protection management',
  category: 'Governance',
  restrictions: [],
  external_dependencies: { required: [], conditional: [] },
  service_dependencies: {
    required: [
      { name: 'IBM Knowledge Catalog', type: 'service', install_behavior: 'must_exist' },
      { name: 'IBM Knowledge Catalog Premium', type: 'service', install_behavior: 'must_exist' }
    ],
    optional: [],
    conditional: []
  },
  component_dependencies: { auto_installed: [], conditional: [] },
  version_constraints: [],
  notes: ['At least one of the listed services must already be installed.'],
  references: [],
  externalDependencies: [],
  serviceDependencies: [{ name: 'IBM Knowledge Catalog', type: 'service', relationship: 'required' }],
  componentDependencies: [],
  configSchema: {
    fields: [
      {
        name: 'size',
        label: 'Deployment Size',
        type: 'select',
        required: true,
        options: [
          { value: 'small', label: 'Small' },
          { value: 'medium', label: 'Medium' }
        ],
        defaultValue: 'small'
      }
    ]
  },
  state: 'removed',
  version: '5.3.0'
}
```

### 9. MANTA Automated Lineage (manta-lineage)

**Category:** Governance  
**YAML Line:** 908  
**Complexity:** Low (Basic component)

```typescript
{
  id: 'manta-lineage',
  name: 'MANTA Automated Lineage',
  originalName: 'mantaflow',
  original_name: 'mantaflow',
  description: 'Automated data lineage tracking and visualization',
  category: 'Governance',
  restrictions: [],
  external_dependencies: { required: [], conditional: [] },
  service_dependencies: { required: [], optional: [], conditional: [] },
  component_dependencies: {
    auto_installed: [{ name: 'Common core services', type: 'component', original_name: 'ccs', install_behavior: 'auto_installed' }],
    conditional: []
  },
  version_constraints: [],
  notes: [],
  references: [],
  externalDependencies: [],
  serviceDependencies: [],
  componentDependencies: [{ name: 'Common core services', type: 'component', originalName: 'ccs', installBehavior: 'auto_installed' }],
  configSchema: {
    fields: [
      {
        name: 'size',
        label: 'Deployment Size',
        type: 'select',
        required: true,
        options: [
          { value: 'small', label: 'Small' },
          { value: 'medium', label: 'Medium' }
        ],
        defaultValue: 'small'
      }
    ]
  },
  state: 'removed',
  version: '5.3.0'
}
```

### 10. Match 360 (match-360)

**Category:** Data Management  
**YAML Line:** N/A (from reference-config.yaml)  
**Complexity:** Low (Scale configuration)

```typescript
{
  id: 'match-360',
  name: 'IBM Match 360',
  originalName: 'match360',
  original_name: 'match360',
  description: 'Master data management and entity resolution',
  category: 'Data Management',
  restrictions: [],
  external_dependencies: { required: [], conditional: [] },
  service_dependencies: { required: [], optional: [], conditional: [] },
  component_dependencies: {
    auto_installed: [{ name: 'Common core services', type: 'component', original_name: 'ccs', install_behavior: 'auto_installed' }],
    conditional: []
  },
  version_constraints: [],
  notes: [],
  references: [],
  externalDependencies: [],
  serviceDependencies: [],
  componentDependencies: [{ name: 'Common core services', type: 'component', originalName: 'ccs', installBehavior: 'auto_installed' }],
  configSchema: {
    fields: [
      {
        name: 'scaleConfig',
        label: 'Scale Configuration',
        type: 'select',
        required: true,
        options: [
          { value: 'x-small', label: 'Extra Small' },
          { value: 'small', label: 'Small' },
          { value: 'medium', label: 'Medium' }
        ],
        defaultValue: 'x-small'
      }
    ]
  },
  state: 'removed',
  version: '5.3.0'
}
```

### 11. Planning Analytics (planning-analytics)

**Category:** Analytics  
**YAML Line:** 1032  
**Complexity:** Medium (Multiple database dependencies)

```typescript
{
  id: 'planning-analytics',
  name: 'Planning Analytics',
  originalName: 'planning-analytics',
  original_name: 'planning-analytics',
  description: 'Financial planning and analysis platform',
  category: 'Analytics',
  restrictions: [],
  external_dependencies: { required: [], conditional: [] },
  service_dependencies: { required: [], optional: [], conditional: [] },
  component_dependencies: {
    auto_installed: [{ name: 'Common core services', type: 'component', original_name: 'ccs', install_behavior: 'auto_installed' }],
    conditional: []
  },
  version_constraints: [],
  notes: [],
  references: [],
  externalDependencies: [],
  serviceDependencies: [],
  componentDependencies: [{ name: 'Common core services', type: 'component', originalName: 'ccs', installBehavior: 'auto_installed' }],
  configSchema: {
    fields: [
      {
        name: 'size',
        label: 'Instance Size',
        type: 'select',
        required: true,
        options: [
          { value: 'small', label: 'Small' },
          { value: 'medium', label: 'Medium' },
          { value: 'large', label: 'Large' }
        ],
        defaultValue: 'small'
      }
    ]
  },
  state: 'removed',
  version: '5.3.0'
}
```

### 12. Data Replication (data-replication)

**Category:** Integration  
**YAML Line:** 375  
**Complexity:** Low (CCS and OpenSearch)

```typescript
{
  id: 'data-replication',
  name: 'Data Replication',
  originalName: 'replication',
  original_name: 'replication',
  description: 'Real-time data replication and synchronization',
  category: 'Integration',
  restrictions: [],
  external_dependencies: { required: [], conditional: [] },
  service_dependencies: { required: [], optional: [], conditional: [] },
  component_dependencies: {
    auto_installed: [
      { name: 'Common core services', type: 'component', original_name: 'ccs', install_behavior: 'auto_installed' },
      { name: 'OpenSearch', type: 'component', original_name: 'opencontent_opensearch', install_behavior: 'auto_installed' }
    ],
    conditional: []
  },
  version_constraints: [],
  notes: [],
  references: [],
  externalDependencies: [],
  serviceDependencies: [],
  componentDependencies: [
    { name: 'Common core services', type: 'component', originalName: 'ccs', installBehavior: 'auto_installed' },
    { name: 'OpenSearch', type: 'component', originalName: 'opencontent_opensearch', installBehavior: 'auto_installed' }
  ],
  configSchema: {
    fields: [
      {
        name: 'size',
        label: 'Deployment Size',
        type: 'select',
        required: true,
        options: [
          { value: 'small', label: 'Small' },
          { value: 'medium', label: 'Medium' }
        ],
        defaultValue: 'small'
      },
      {
        name: 'replication_license_type',
        label: 'License Type',
        type: 'select',
        required: true,
        options: [
          { value: 'IDRC', label: 'IDRC' },
          { value: 'Standard', label: 'Standard' }
        ],
        defaultValue: 'IDRC'
      }
    ]
  },
  state: 'removed',
  version: '5.3.0'
}
```

### 13. SPSS Modeler (spss-modeler)

**Category:** Analytics  
**YAML Line:** 1097  
**Complexity:** Low (Basic analytics component)

```typescript
{
  id: 'spss-modeler',
  name: 'SPSS Modeler',
  originalName: 'spss',
  original_name: 'spss',
  description: 'Predictive analytics and statistical modeling',
  category: 'Analytics',
  restrictions: [],
  external_dependencies: { required: [], conditional: [] },
  service_dependencies: { required: [], optional: [], conditional: [] },
  component_dependencies: {
    auto_installed: [{ name: 'Common core services', type: 'component', original_name: 'ccs', install_behavior: 'auto_installed' }],
    conditional: []
  },
  version_constraints: [],
  notes: [],
  references: [],
  externalDependencies: [],
  serviceDependencies: [],
  componentDependencies: [{ name: 'Common core services', type: 'component', originalName: 'ccs', installBehavior: 'auto_installed' }],
  configSchema: {
    fields: []
  },
  state: 'removed',
  version: '5.3.0'
}
```

### 14. Analytics Engine (analytics-engine)

**Category:** Analytics  
**YAML Line:** 190  
**Complexity:** Low (Apache Spark powered)

```typescript
{
  id: 'analytics-engine',
  name: 'Analytics Engine',
  originalName: 'analyticsengine',
  original_name: 'analyticsengine',
  description: 'Analytics Engine powered by Apache Spark',
  category: 'Analytics',
  restrictions: [],
  external_dependencies: { required: [], conditional: [] },
  service_dependencies: { required: [], optional: [], conditional: [] },
  component_dependencies: { auto_installed: [], conditional: [] },
  version_constraints: [],
  notes: [],
  references: [],
  externalDependencies: [],
  serviceDependencies: [],
  componentDependencies: [],
  configSchema: {
    fields: [
      {
        name: 'size',
        label: 'Deployment Size',
        type: 'select',
        required: true,
        options: [
          { value: 'small', label: 'Small' },
          { value: 'medium', label: 'Medium' },
          { value: 'large', label: 'Large' }
        ],
        defaultValue: 'small'
      }
    ]
  },
  state: 'removed',
  version: '5.3.0'
}
```

### 15. Db2 Big SQL (db2-bigsql)

**Category:** Data Management  
**YAML Line:** N/A (from reference-config.yaml)  
**Complexity:** Low (Basic component)

```typescript
{
  id: 'db2-bigsql',
  name: 'Db2 Big SQL',
  originalName: 'bigsql',
  original_name: 'bigsql',
  description: 'SQL-on-Hadoop query engine',
  category: 'Data Management',
  restrictions: [],
  external_dependencies: { required: [], conditional: [] },
  service_dependencies: { required: [], optional: [], conditional: [] },
  component_dependencies: {
    auto_installed: [{ name: 'Common core services', type: 'component', original_name: 'ccs', install_behavior: 'auto_installed' }],
    conditional: []
  },
  version_constraints: [],
  notes: [],
  references: [],
  externalDependencies: [],
  serviceDependencies: [],
  componentDependencies: [{ name: 'Common core services', type: 'component', originalName: 'ccs', installBehavior: 'auto_installed' }],
  configSchema: {
    fields: []
  },
  state: 'removed',
  version: '5.3.0'
}
```

### 16. Cognos Dashboards (cognos-dashboards)

**Category:** Analytics  
**YAML Line:** 240  
**Complexity:** Low (CCS, OpenSearch, Redis)

```typescript
{
  id: 'cognos-dashboards',
  name: 'Cognos Dashboards',
  originalName: 'dashboard',
  original_name: 'dashboard',
  description: 'Interactive business intelligence dashboards',
  category: 'Analytics',
  restrictions: [],
  external_dependencies: { required: [], conditional: [] },
  service_dependencies: { required: [], optional: [], conditional: [] },
  component_dependencies: {
    auto_installed: [
      { name: 'Common core services', type: 'component', original_name: 'ccs', install_behavior: 'auto_installed' },
      { name: 'OpenSearch', type: 'component', original_name: 'opencontent_opensearch', install_behavior: 'auto_installed' },
      { name: 'Redis', type: 'component', original_name: 'ibm_redis_cp', install_behavior: 'auto_installed' }
    ],
    conditional: []
  },
  version_constraints: [],
  notes: [],
  references: [],
  externalDependencies: [],
  serviceDependencies: [],
  componentDependencies: [
    { name: 'Common core services', type: 'component', originalName: 'ccs', installBehavior: 'auto_installed' },
    { name: 'OpenSearch', type: 'component', originalName: 'opencontent_opensearch', installBehavior: 'auto_installed' },
    { name: 'Redis', type: 'component', originalName: 'ibm_redis_cp', installBehavior: 'auto_installed' }
  ],
  configSchema: {
    fields: []
  },
  state: 'removed',
  version: '5.3.0'
}
```

### 17. Data Gate (data-gate)

**Category:** Data Management  
**YAML Line:** 267  
**Complexity:** High (z/OS and Db2 Connect requirements)

```typescript
{
  id: 'data-gate',
  name: 'Db2 Data Gate',
  originalName: 'datagate',
  original_name: 'datagate',
  description: 'Db2 for z/OS data access and integration',
  category: 'Data Management',
  restrictions: [],
  external_dependencies: {
    required: [
      { name: 'IBM z/OS', type: 'external_system', notes: ['Version 2.4 or later; product code 5650-ZOS.'] },
      { name: 'Db2 Connect Unlimited Edition license', type: 'license', notes: ['Required to establish a JDBC connection to Db2 for z/OS.'] },
      { name: 'Db2 for z/OS', type: 'external_system', notes: ['Supported versions: V12 with required APAR fixes and Function Level 505 or higher, or V13.'] },
      { name: 'Distributed data facility secure port with AT-TLS', type: 'network_requirement' }
    ],
    conditional: [
      {
        condition: { expression: 'remote Db2 target database is used' },
        requires: [{ name: 'Db2 for Linux, UNIX, and Windows', type: 'external_system', notes: ['Version 12.1 or higher.'] }]
      }
    ]
  },
  service_dependencies: {
    required: [
      { name: 'Db2', type: 'service', install_behavior: 'must_exist' },
      { name: 'Db2 Warehouse', type: 'service', install_behavior: 'must_exist' }
    ],
    optional: [{ name: 'IBM Knowledge Catalog', type: 'service', notes: ['Automatically publishes metadata about Data Gate tables to catalogs.'] }],
    conditional: []
  },
  component_dependencies: { auto_installed: [], conditional: [] },
  version_constraints: [],
  notes: [],
  references: [],
  externalDependencies: [
    { name: 'IBM z/OS', type: 'external_system', installBehavior: 'must_exist' },
    { name: 'Db2 Connect Unlimited Edition license', type: 'license', installBehavior: 'must_exist' }
  ],
  serviceDependencies: [
    { name: 'Db2', type: 'service', relationship: 'required' },
    { name: 'Db2 Warehouse', type: 'service', relationship: 'required' }
  ],
  componentDependencies: [],
  configSchema: {
    fields: []
  },
  state: 'removed',
  version: '5.3.0'
}
```

### 18. DataStage Enterprise (datastage-ent)

**Category:** Integration  
**YAML Line:** 398  
**Complexity:** Low (CCS and OpenSearch)

```typescript
{
  id: 'datastage-ent',
  name: 'DataStage Enterprise',
  originalName: 'datastage-ent',
  original_name: 'datastage-ent',
  description: 'Enterprise data integration and ETL',
  category: 'Integration',
  restrictions: [],
  external_dependencies: { required: [], conditional: [] },
  service_dependencies: {
    required: [],
    optional: [{ name: 'Orchestration Pipelines', type: 'service', notes: ['Enables conversion of DataStage sequence jobs to pipelines.'] }],
    conditional: []
  },
  component_dependencies: {
    auto_installed: [
      { name: 'Common core services', type: 'component', original_name: 'ccs', install_behavior: 'auto_installed' },
      { name: 'OpenSearch', type: 'component', original_name: 'opencontent_opensearch', install_behavior: 'auto_installed' }
    ],
    conditional: []
  },
  version_constraints: [],
  notes: [],
  references: [],
  externalDependencies: [],
  serviceDependencies: [],
  componentDependencies: [
    { name: 'Common core services', type: 'component', originalName: 'ccs', installBehavior: 'auto_installed' },
    { name: 'OpenSearch', type: 'component', originalName: 'opencontent_opensearch', installBehavior: 'auto_installed' }
  ],
  configSchema: {
    fields: []
  },
  state: 'removed',
  version: '5.3.0'
}
```

### 19. watsonx Code Assistant for Ansible (wca-ansible)

**Category:** AI & Machine Learning  
**YAML Line:** N/A (from reference-config.yaml)  
**Complexity:** Low (GPU requirements)

```typescript
{
  id: 'wca-ansible',
  name: 'watsonx Code Assistant for Ansible',
  originalName: 'wca-ansible',
  original_name: 'wca-ansible',
  description: 'AI-powered Ansible playbook generation',
  category: 'AI & Machine Learning',
  restrictions: [],
  external_dependencies: {
    required: [
      { name: 'Node Feature Discovery Operator', type: 'operator', install_behavior: 'must_exist' },
      { name: 'NVIDIA GPU Operator', type: 'operator', install_behavior: 'must_exist' },
      { name: 'Red Hat OpenShift AI', type: 'platform_software', install_behavior: 'must_exist' }
    ],
    conditional: []
  },
  service_dependencies: { required: [], optional: [], conditional: [] },
  component_dependencies: {
    auto_installed: [{ name: 'Common core services', type: 'component', original_name: 'ccs', install_behavior: 'auto_installed' }],
    conditional: []
  },
  version_constraints: [],
  notes: [],
  references: [],
  externalDependencies: [
    { name: 'Node Feature Discovery Operator', type: 'operator', installBehavior: 'must_exist' },
    { name: 'NVIDIA GPU Operator', type: 'operator', installBehavior: 'must_exist' }
  ],
  serviceDependencies: [],
  componentDependencies: [{ name: 'Common core services', type: 'component', originalName: 'ccs', installBehavior: 'auto_installed' }],
  configSchema: {
    fields: []
  },
  state: 'removed',
  version: '5.3.0'
}
```

### 20. watsonx Code Assistant for Z (wca-z)

**Category:** AI & Machine Learning  
**YAML Line:** N/A (from reference-config.yaml)  
**Complexity:** Low (GPU requirements)

```typescript
{
  id: 'wca-z',
  name: 'watsonx Code Assistant for Z',
  originalName: 'wca-z',
  original_name: 'wca-z',
  description: 'AI-powered mainframe code assistance',
  category: 'AI & Machine Learning',
  restrictions: [],
  external_dependencies: {
    required: [
      { name: 'Node Feature Discovery Operator', type: 'operator', install_behavior: 'must_exist' },
      { name: 'NVIDIA GPU Operator', type: 'operator', install_behavior: 'must_exist' },
      { name: 'Red Hat OpenShift AI', type: 'platform_software', install_behavior: 'must_exist' }
    ],
    conditional: []
  },
  service_dependencies: { required: [], optional: [], conditional: [] },
  component_dependencies: {
    auto_installed: [{ name: 'Common core services', type: 'component', original_name: 'ccs', install_behavior: 'auto_installed' }],
    conditional: []
  },
  version_constraints: [],
  notes: [],
  references: [],
  externalDependencies: [
    { name: 'Node Feature Discovery Operator', type: 'operator', installBehavior: 'must_exist' },
    { name: 'NVIDIA GPU Operator', type: 'operator', installBehavior: 'must_exist' }
  ],
  serviceDependencies: [],
  componentDependencies: [{ name: 'Common core services', type: 'component', originalName: 'ccs', installBehavior: 'auto_installed' }],
  configSchema: {
    fields: []
  },
  state: 'removed',
  version: '5.3.0'
}
```

---

## Implementation Instructions

### Step 1: Backup Current File
```bash
cd deployer-web/ui
cp src/constants/mockComponents.ts src/constants/mockComponents.ts.backup
```

### Step 2: Add Components
Add each component object from above to the `MOCK_COMPONENTS` array in mockComponents.ts, after the existing 12 components and before the closing bracket `]`.

### Step 3: Verify Syntax
Ensure proper comma placement between components:
- Each component object should end with a comma except the last one
- Maintain consistent indentation (2 spaces)

### Step 4: Test Build
```bash
npm run build
```

### Step 5: Verify UI
- Check dev server at http://localhost:5173
- Verify all 32 components appear in component selection page
- Test category filtering
- Verify dependency information displays correctly

---

## Success Criteria

- ✅ All 20 components added to mockComponents.ts
- ✅ TypeScript compilation passes with no errors
- ✅ Total component count: 32 (12 existing + 20 new)
- ✅ Component coverage: 52% (32/62)
- ✅ All components visible in UI
- ✅ Category distribution correct:
  - AI & Machine Learning: 11 components (4 existing + 7 new)
  - Data Management: 8 components (3 existing + 5 new)
  - Analytics: 6 components (1 existing + 5 new)
  - Governance: 5 components (3 existing + 2 new)
  - Integration: 2 components (1 existing + 1 new)

---

**Document Status:** Complete and Ready for Implementation  
**Total Lines:** ~2000 lines of component data  
**Estimated Implementation Time:** 30-45 minutes (copy/paste + testing)  
**Next Phase:** Phase 1.5.4 - Add 22 medium-priority components