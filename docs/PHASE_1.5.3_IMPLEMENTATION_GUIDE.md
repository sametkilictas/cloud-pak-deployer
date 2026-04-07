# Phase 1.5.3 Implementation Guide
## Adding 20 High-Priority Components

### Overview
This document provides the complete implementation guide for adding 20 high-priority Cloud Pak for Data components to the mockComponents.ts file.

### Component Mapping

| # | Component ID | Display Name | Original Name | Category | YAML Line | Priority |
|---|--------------|--------------|---------------|----------|-----------|----------|
| 1 | watson-assistant | Watson Assistant | watson-assistant | AI & Machine Learning | 1469 | High |
| 2 | watson-discovery | Watson Discovery | watson-discovery | AI & Machine Learning | 1181 | High |
| 3 | watsonx-orchestrate | watsonx Orchestrate | watsonx_orchestrate | AI & Machine Learning | 2223 | High |
| 4 | datastage-ent | DataStage Enterprise | datastage-ent | Integration | N/A | High |
| 5 | db2wh | Db2 Warehouse | db2wh | Data Management | 532 | High |
| 6 | decision-optimization | Decision Optimization | dods | Analytics | 555 | High |
| 7 | data-privacy | Data Privacy | dp | Governance | 311 | High |
| 8 | manta-lineage | MANTA Automated Lineage | mantaflow | Governance | 908 | High |
| 9 | match-360 | IBM Match 360 | match360 | Data Management | N/A | High |
| 10 | planning-analytics | Planning Analytics | planning-analytics | Analytics | 1032 | High |
| 11 | data-replication | Data Replication | replication | Integration | 375 | High |
| 12 | spss-modeler | SPSS Modeler | spss | Analytics | 1097 | High |
| 13 | voice-gateway | Voice Gateway | voice-gateway | AI & Machine Learning | 1160 | High |
| 14 | watsonx-code-assistant | watsonx Code Assistant | wca | AI & Machine Learning | N/A | High |
| 15 | wca-ansible | watsonx Code Assistant for Ansible | wca-ansible | AI & Machine Learning | N/A | High |
| 16 | wca-z | watsonx Code Assistant for Z | wca-z | AI & Machine Learning | N/A | High |
| 17 | analytics-engine | Analytics Engine | analyticsengine | Analytics | 190 | High |
| 18 | db2-bigsql | Db2 Big SQL | bigsql | Data Management | N/A | High |
| 19 | cognos-dashboards | Cognos Dashboards | dashboard | Analytics | 240 | High |
| 20 | data-gate | Db2 Data Gate | datagate | Data Management | 267 | High |

### Implementation Strategy

Due to the large size of adding 20 components at once (~2000 lines), we'll implement in batches:

**Batch 1 (5 components):** Core AI/ML components
- Watson Assistant
- Watson Discovery  
- watsonx Orchestrate
- Voice Gateway
- watsonx Code Assistant

**Batch 2 (5 components):** Data Management
- Db2 Warehouse
- Match 360
- Db2 Big SQL
- Data Gate
- Data Replication

**Batch 3 (5 components):** Analytics
- Decision Optimization
- Planning Analytics
- SPSS Modeler
- Analytics Engine
- Cognos Dashboards

**Batch 4 (5 components):** Governance & Integration
- Data Privacy
- MANTA Automated Lineage
- DataStage Enterprise
- wca-ansible
- wca-z

### Component Templates

#### Template 1: Watson Assistant (Complex Conditional Dependencies)

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
      {
        name: 'Multicloud Object Gateway',
        type: 'platform_software',
        install_behavior: 'must_exist'
      },
      {
        name: 'Red Hat OpenShift Serverless Knative Eventing',
        type: 'platform_software',
        install_behavior: 'must_exist'
      }
    ],
    conditional: [
      {
        condition: {
          expression: 'conversational skills or conversational search features are used'
        },
        requires: [
          {
            name: 'Node Feature Discovery Operator',
            type: 'operator',
            install_behavior: 'must_exist'
          },
          {
            name: 'NVIDIA GPU Operator',
            type: 'operator',
            install_behavior: 'must_exist'
          },
          {
            name: 'Red Hat OpenShift AI',
            type: 'platform_software',
            install_behavior: 'must_exist'
          }
        ]
      }
    ]
  },
  service_dependencies: {
    required: [],
    optional: [
      {
        name: 'Watson Discovery',
        type: 'service',
        notes: ['Enables adding a search skill when conversational search is not used.']
      }
    ],
    conditional: [
      {
        condition: {
          expression: 'conversational search is used'
        },
        requires: [
          {
            name: 'Watson Discovery',
            type: 'service'
          }
        ],
        notes: ['The source says Watson Discovery or Elasticsearch.']
      }
    ]
  },
  component_dependencies: {
    auto_installed: [
      {
        name: 'Cloud Native PostgreSQL',
        type: 'component',
        original_name: 'postgresql',
        install_behavior: 'auto_installed'
      },
      {
        name: 'etcd',
        type: 'component',
        original_name: 'opencontent_etcd',
        install_behavior: 'auto_installed'
      },
      {
        name: 'OpenSearch',
        type: 'component',
        original_name: 'opencontent_opensearch',
        install_behavior: 'auto_installed'
      },
      {
        name: 'Redis',
        type: 'component',
        original_name: 'ibm_redis_cp',
        install_behavior: 'auto_installed'
      },
      {
        name: 'Watson data governor',
        type: 'component',
        original_name: 'data_governor',
        install_behavior: 'auto_installed'
      },
      {
        name: 'Watson Gateway',
        type: 'component',
        original_name: 'watson_gateway',
        install_behavior: 'auto_installed'
      }
    ],
    conditional: [
      {
        condition: {
          expression: 'GPU features are enabled for conversational skills and conversational search'
        },
        installs: [
          {
            name: 'Common core services',
            type: 'component',
            original_name: 'ccs',
            install_behavior: 'auto_installed'
          },
          {
            name: 'Inference foundation models',
            type: 'component',
            original_name: 'watsonx_ai_ifm',
            install_behavior: 'auto_installed'
          }
        ]
      }
    ]
  },
  version_constraints: [],
  notes: [],
  references: [],
  // Backward compatibility
  externalDependencies: [
    {
      name: 'Multicloud Object Gateway',
      type: 'platform_software',
      installBehavior: 'must_exist'
    }
  ],
  serviceDependencies: [
    {
      name: 'Watson Discovery',
      type: 'service',
      relationship: 'optional'
    }
  ],
  componentDependencies: [
    {
      name: 'Cloud Native PostgreSQL',
      type: 'component',
      originalName: 'postgresql',
      installBehavior: 'auto_installed'
    }
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

#### Template 2: Db2 Warehouse (Simple Service Dependencies)

```typescript
{
  id: 'db2wh',
  name: 'Db2 Warehouse',
  originalName: 'db2wh',
  original_name: 'db2wh',
  description: 'Enterprise data warehouse for analytics workloads',
  category: 'Data Management',
  restrictions: [],
  external_dependencies: {
    required: [],
    conditional: []
  },
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
    auto_installed: [
      {
        name: 'Db2U',
        type: 'component',
        original_name: 'db2u',
        install_behavior: 'auto_installed'
      }
    ],
    conditional: []
  },
  version_constraints: [],
  notes: [],
  references: [],
  // Backward compatibility
  externalDependencies: [],
  serviceDependencies: [],
  componentDependencies: [
    {
      name: 'Db2U',
      type: 'component',
      originalName: 'db2u',
      installBehavior: 'auto_installed'
    }
  ],
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

#### Template 3: Decision Optimization (Required Services)

```typescript
{
  id: 'decision-optimization',
  name: 'Decision Optimization',
  originalName: 'dods',
  original_name: 'dods',
  description: 'Prescriptive analytics for optimal decision-making',
  category: 'Analytics',
  restrictions: [],
  external_dependencies: {
    required: [],
    conditional: []
  },
  service_dependencies: {
    required: [
      {
        name: 'Watson Studio',
        type: 'service',
        install_behavior: 'must_exist'
      },
      {
        name: 'Watson Machine Learning',
        type: 'service',
        install_behavior: 'must_exist'
      }
    ],
    optional: [],
    conditional: []
  },
  component_dependencies: {
    auto_installed: [],
    conditional: []
  },
  version_constraints: [],
  notes: [],
  references: [],
  // Backward compatibility
  externalDependencies: [],
  serviceDependencies: [
    {
      name: 'Watson Studio',
      type: 'service',
      relationship: 'required'
    },
    {
      name: 'Watson Machine Learning',
      type: 'service',
      relationship: 'required'
    }
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

### Implementation Checklist

**Batch 1: Core AI/ML (5 components)**
- [ ] Watson Assistant - Complex conditional GPU dependencies
- [ ] Watson Discovery - MCG and conditional GPU requirements
- [ ] watsonx Orchestrate - Agentic AI with Watson Assistant integration
- [ ] Voice Gateway - MCG and conditional GPU for enrichment
- [ ] watsonx Code Assistant - GPU requirements for code generation

**Batch 2: Data Management (5 components)**
- [ ] Db2 Warehouse - Simple Db2U dependency
- [ ] Match 360 - Complex scale configuration
- [ ] Db2 Big SQL - Hadoop integration requirements
- [ ] Data Gate - z/OS and Db2 Connect requirements
- [ ] Data Replication - License type configuration

**Batch 3: Analytics (5 components)**
- [ ] Decision Optimization - WS and WML requirements
- [ ] Planning Analytics - Multiple database dependencies
- [ ] SPSS Modeler - Basic analytics component
- [ ] Analytics Engine - Apache Spark powered
- [ ] Cognos Dashboards - CCS, OpenSearch, Redis

**Batch 4: Governance & Integration (5 components)**
- [ ] Data Privacy - Governance component
- [ ] MANTA Automated Lineage - Lineage tracking
- [ ] DataStage Enterprise - ETL without advanced features
- [ ] wca-ansible - Ansible code assistance
- [ ] wca-z - Z mainframe code assistance

### Testing Strategy

After each batch:
1. Run `npm run build` to verify TypeScript compilation
2. Check dev server for any runtime errors
3. Verify components appear in UI component selection page
4. Test category filtering works correctly
5. Verify dependency information displays properly

### Success Criteria

- ✅ All 20 components added to mockComponents.ts
- ✅ TypeScript compilation passes with no errors
- ✅ All components visible in UI
- ✅ Category distribution correct:
  - AI & Machine Learning: 7 components
  - Data Management: 5 components
  - Analytics: 5 components
  - Governance: 2 components
  - Integration: 1 component
- ✅ Total component count: 32 (12 existing + 20 new)
- ✅ Component coverage: 52% (32/62)

### Next Steps After Completion

1. Proceed to Phase 1.5.4: Add 22 medium-priority components
2. Update component coverage metrics
3. Test dependency resolution with larger component set
4. Verify UI performance with 32 components

---

**Document Status:** Ready for Implementation  
**Estimated Time:** 2-3 hours for all 20 components  
**Dependencies:** Phase 1.5.2 complete ✅