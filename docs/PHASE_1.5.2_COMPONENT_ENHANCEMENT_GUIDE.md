# Phase 1.5.2: Component Enhancement Implementation Guide

## Overview

This document provides the complete implementation guide for enhancing the existing 12 components in `deployer-web/ui/src/constants/mockComponents.ts` with full YAML attributes from `references/ibm_software_hub_requirements_normalized_operational.yaml`.

## Objective

Transform existing simplified component definitions into CloudPakComponentEnhanced format with complete dependency structures, restrictions, notes, and documentation references.

## Component Mapping

| # | UI Component ID | YAML Service Name | Original Name | YAML Lines |
|---|-----------------|-------------------|---------------|------------|
| 1 | watson-ml | Watson Machine Learning | wml | 1215-1255 |
| 2 | watson-studio | Watson Studio | ws | 1350-1378 |
| 3 | watson-openscale | Watson OpenScale | watson-openscale | 1256-1292 |
| 4 | watsonx-ai | watsonx.ai | watsonx_ai | 1405-1468 |
| 5 | watsonx-data | watsonx.data | watsonx_data | 1914-1940 |
| 6 | watsonx-governance | watsonx.governance | watsonx_governance | 2162-2222 |
| 7 | ikc-premium | IBM Knowledge Catalog Premium | ikc_premium | 674-734 |
| 8 | ikc-standard | IBM Knowledge Catalog Standard | ikc_standard | 735-787 |
| 9 | datastage-ent-plus | DataStage | datastage-ent-plus | 398-424 |
| 10 | cognos-analytics | Cognos Analytics | ca | 205-239 |
| 11 | db2 | Db2 | db2 | 459-481 |
| 12 | data-virtualization | Data Virtualization | dv | 425-458 |

## Implementation Strategy

### Step 1: Add Missing Type Import

Update the import statement in mockComponents.ts:

```typescript
import { Component, CloudPakComponentEnhanced } from '@/types';
```

### Step 2: Change Array Type

```typescript
export const MOCK_COMPONENTS: CloudPakComponentEnhanced[] = [
```

### Step 3: Enhance Each Component

For each component, add the following fields based on YAML data:

1. **original_name** - The deployer component name
2. **external_dependencies** - Structured external dependencies
3. **service_dependencies** - Structured service dependencies  
4. **component_dependencies** - Structured component dependencies
5. **version_constraints** - Version-specific behaviors
6. **notes** - Installation notes and warnings
7. **references** - Documentation URLs

## Component Enhancement Templates

### 1. Watson Machine Learning (watson-ml)

**YAML Reference:** Lines 1215-1255

```typescript
{
  id: 'watson-ml',
  name: 'Watson Machine Learning',
  originalName: 'wml',
  original_name: 'wml',
  description: 'Build, train, and deploy machine learning models at scale',
  category: 'AI & Machine Learning',
  restrictions: [],
  
  // Keep existing simplified arrays for backward compatibility
  externalDependencies: [...existing...],
  serviceDependencies: [...existing...],
  componentDependencies: [...existing...],
  
  // Add enhanced structures
  external_dependencies: {
    required: [],
    conditional: [
      {
        condition: {
          expression: 'deep learning or models that require GPUs are used'
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
          }
        ]
      }
    ]
  },
  
  service_dependencies: {
    required: [],
    optional: [],
    conditional: [
      {
        condition: {
          expression: 'deep learning is used'
        },
        requires: [
          {
            name: 'Scheduling service',
            type: 'shared_cluster_component'
          }
        ]
      }
    ]
  },
  
  component_dependencies: {
    auto_installed: [
      {
        name: 'Common core services',
        type: 'component',
        original_name: 'ccs',
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
      }
    ],
    conditional: []
  },
  
  version_constraints: [],
  notes: [],
  references: [],
  
  configSchema: {...existing...},
  state: 'removed',
  version: '5.3.0'
}
```

### 2. Watson Studio (watson-studio)

**YAML Reference:** Lines 1350-1378

```typescript
{
  id: 'watson-studio',
  name: 'Watson Studio',
  originalName: 'ws',
  original_name: 'ws',
  description: 'Collaborative data science and machine learning platform',
  category: 'AI & Machine Learning',
  restrictions: [],
  
  externalDependencies: [],
  serviceDependencies: [],
  componentDependencies: [...existing...],
  
  external_dependencies: {
    required: [],
    conditional: []
  },
  
  service_dependencies: {
    required: [
      {
        name: 'Data Refinery',
        type: 'service',
        install_behavior: 'auto_installed'
      },
      {
        name: 'Watson Studio Runtimes',
        type: 'service',
        install_behavior: 'auto_installed'
      }
    ],
    optional: [],
    conditional: []
  },
  
  component_dependencies: {
    auto_installed: [
      {
        name: 'Common core services',
        type: 'component',
        original_name: 'ccs',
        install_behavior: 'auto_installed'
      },
      {
        name: 'OpenSearch',
        type: 'component',
        original_name: 'opencontent_opensearch',
        install_behavior: 'auto_installed'
      }
    ],
    conditional: []
  },
  
  version_constraints: [],
  notes: [],
  references: [],
  
  configSchema: {...existing...},
  state: 'removed',
  version: '5.3.0'
}
```

### 3. Watson OpenScale (watson-openscale)

**YAML Reference:** Lines 1256-1292

```typescript
{
  id: 'watson-openscale',
  name: 'Watson OpenScale',
  originalName: 'watson-openscale',
  original_name: 'watson-openscale',
  description: 'Monitor and manage AI models for trust and transparency',
  category: 'AI & Machine Learning',
  restrictions: [],
  
  externalDependencies: [],
  serviceDependencies: [...existing...],
  componentDependencies: [...existing...],
  
  external_dependencies: {
    required: [],
    conditional: [
      {
        condition: {
          expression: 'external database is used'
        },
        requires: [
          {
            name: 'Db2 Enterprise Server Edition',
            type: 'external_system',
            notes: ['Version 11.5 or later']
          }
        ]
      }
    ]
  },
  
  service_dependencies: {
    required: [
      {
        name: 'Db2',
        type: 'service'
      },
      {
        name: 'Db2 Warehouse',
        type: 'service'
      },
      {
        name: 'EDB Postgres',
        type: 'service'
      }
    ],
    optional: [
      {
        name: 'Watson Studio',
        type: 'service',
        notes: ['Enables AutoAI models, Jupyter Notebooks, and a demo environment']
      },
      {
        name: 'Watson Machine Learning',
        type: 'service',
        notes: ['Enables deployed models for bias/drift checks and automatic payload logging']
      }
    ],
    conditional: []
  },
  
  component_dependencies: {
    auto_installed: [],
    conditional: []
  },
  
  version_constraints: [],
  notes: [
    'At least one supported integrated database instance is required when connecting to an integrated database'
  ],
  references: [],
  
  configSchema: {...existing...},
  state: 'removed',
  version: '5.3.0'
}
```

### 4. watsonx.ai (watsonx-ai)

**YAML Reference:** Lines 1405-1468

```typescript
{
  id: 'watsonx-ai',
  name: 'watsonx.ai',
  originalName: 'watsonx_ai',
  original_name: 'watsonx_ai',
  description: 'Foundation models and generative AI platform',
  category: 'AI & Machine Learning',
  restrictions: [],
  
  externalDependencies: [...existing...],
  serviceDependencies: [],
  componentDependencies: [...existing...],
  
  external_dependencies: {
    required: [
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
    ],
    conditional: []
  },
  
  service_dependencies: {
    required: [],
    optional: [
      {
        name: 'watsonx.governance',
        type: 'service',
        notes: ['Enables governance of generative AI assets']
      }
    ],
    conditional: [
      {
        condition: {
          expression: 'full watsonx.ai service is installed'
        },
        installs: [
          {
            name: 'Watson Studio',
            type: 'service',
            install_behavior: 'auto_installed'
          },
          {
            name: 'Watson Machine Learning',
            type: 'service',
            install_behavior: 'auto_installed'
          }
        ]
      }
    ]
  },
  
  component_dependencies: {
    auto_installed: [],
    conditional: [
      {
        condition: {
          expression: 'full watsonx.ai service is installed'
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
          },
          {
            name: 'OpenSearch',
            type: 'component',
            original_name: 'opencontent_opensearch',
            install_behavior: 'auto_installed'
          }
        ]
      },
      {
        condition: {
          expression: 'watsonx.ai lightweight engine is installed'
        },
        installs: [
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
  
  configSchema: {...existing...},
  state: 'removed',
  version: '5.3.0'
}
```

### 5. watsonx.data (watsonx-data)

**YAML Reference:** Lines 1914-1940

```typescript
{
  id: 'watsonx-data',
  name: 'watsonx.data',
  originalName: 'watsonx_data',
  original_name: 'watsonx_data',
  description: 'Open lakehouse for data and AI workloads',
  category: 'Data Management',
  restrictions: [],
  
  externalDependencies: [],
  serviceDependencies: [],
  componentDependencies: [...existing...],
  
  external_dependencies: {
    required: [],
    conditional: [
      {
        condition: {
          expression: 'Milvus indexes that require GPUs are used'
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
          }
        ]
      }
    ]
  },
  
  service_dependencies: {
    required: [
      {
        name: 'Analytics Engine powered by Apache Spark',
        type: 'service',
        install_behavior: 'auto_installed'
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
  
  configSchema: {...existing...},
  state: 'removed',
  version: '5.3.0'
}
```

### 6. watsonx.governance (watsonx-governance)

**YAML Reference:** Lines 2162-2222

```typescript
{
  id: 'watsonx-governance',
  name: 'watsonx.governance',
  originalName: 'watsonx_governance',
  original_name: 'watsonx_governance',
  description: 'AI governance and risk management',
  category: 'Governance',
  restrictions: [],
  
  externalDependencies: [],
  serviceDependencies: [...existing...],
  componentDependencies: [...existing...],
  
  external_dependencies: {
    required: [],
    conditional: []
  },
  
  service_dependencies: {
    required: [
      {
        name: 'Watson Machine Learning',
        type: 'service',
        install_behavior: 'auto_installed'
      },
      {
        name: 'Db2',
        type: 'service'
      },
      {
        name: 'Db2 Warehouse',
        type: 'service'
      },
      {
        name: 'EDB Postgres',
        type: 'service'
      }
    ],
    optional: [
      {
        name: 'Cognos Analytics',
        type: 'service',
        notes: ['Enables reports and dashboards']
      },
      {
        name: 'watsonx.ai',
        type: 'service',
        notes: ['Enables building and deploying generative AI assets']
      }
    ],
    conditional: []
  },
  
  component_dependencies: {
    auto_installed: [
      {
        name: 'Common core services',
        type: 'component',
        original_name: 'ccs',
        install_behavior: 'auto_installed'
      },
      {
        name: 'Db2 as a service',
        type: 'component',
        original_name: 'db2aaservice',
        install_behavior: 'auto_installed'
      },
      {
        name: 'Db2U',
        type: 'component',
        original_name: 'db2u',
        install_behavior: 'auto_installed'
      },
      {
        name: 'Inference foundation models',
        type: 'component',
        original_name: 'watsonx_ai_ifm',
        install_behavior: 'auto_installed'
      },
      {
        name: 'OpenSearch',
        type: 'component',
        original_name: 'opencontent_opensearch',
        install_behavior: 'auto_installed'
      },
      {
        name: 'RabbitMQ',
        type: 'component',
        original_name: 'opencontent_rabbitmq',
        install_behavior: 'auto_installed'
      },
      {
        name: 'Redis',
        type: 'component',
        original_name: 'ibm_redis_cp',
        install_behavior: 'auto_installed'
      }
    ],
    conditional: []
  },
  
  version_constraints: [],
  notes: [
    'At least one supported integrated database instance is required for watsonx.governance Model Management when using an integrated database'
  ],
  references: [],
  
  configSchema: {...existing...},
  state: 'removed',
  version: '5.3.0'
}
```

### 7. IBM Knowledge Catalog Premium (ikc-premium)

**YAML Reference:** Lines 674-734

```typescript
{
  id: 'ikc-premium',
  name: 'IBM Knowledge Catalog Premium',
  originalName: 'ikc_premium',
  original_name: 'ikc_premium',
  description: 'Enterprise data catalog with AI-powered capabilities',
  category: 'Governance',
  restrictions: [
    'Cannot be installed in the same IBM Software Hub instance as IBM Knowledge Catalog',
    'Cannot be installed in the same IBM Software Hub instance as IBM Knowledge Catalog Standard'
  ],
  
  externalDependencies: [...existing...],
  serviceDependencies: [...existing...],
  componentDependencies: [...existing...],
  
  external_dependencies: {
    required: [
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
    ],
    conditional: []
  },
  
  service_dependencies: {
    required: [
      {
        name: 'IBM Knowledge Catalog',
        type: 'service',
        install_behavior: 'auto_installed'
      }
    ],
    optional: [
      {
        name: 'Data Privacy',
        type: 'service'
      },
      {
        name: 'IBM Manta Data Lineage',
        type: 'service'
      },
      {
        name: 'MANTA Automated Data Lineage',
        type: 'service'
      }
    ],
    conditional: [
      {
        condition: {
          expression: 'data quality feature is installed'
        },
        installs: [
          {
            name: 'DataStage Enterprise',
            type: 'service',
            install_behavior: 'auto_installed'
          }
        ]
      }
    ]
  },
  
  component_dependencies: {
    auto_installed: [],
    conditional: [
      {
        condition: {
          expression: 'gen AI based features are enabled'
        },
        installs: [
          {
            name: 'Inference foundation models',
            type: 'component',
            original_name: 'watsonx_ai_ifm',
            install_behavior: 'auto_installed'
          }
        ]
      },
      {
        condition: {
          expression: 'relationship explorer and semantic search feature is enabled'
        },
        installs: [
          {
            name: 'Neo4j',
            type: 'component',
            original_name: 'ibm_neo4j',
            install_behavior: 'auto_installed'
          },
          {
            name: 'FoundationDB',
            type: 'component',
            original_name: 'opencontent_fdb',
            install_behavior: 'auto_installed'
          }
        ],
        notes: ['The source states one of these dependencies is installed']
      }
    ]
  },
  
  version_constraints: [],
  notes: [],
  references: [],
  
  configSchema: {...existing...},
  state: 'removed',
  version: '5.3.0'
}
```

### 8. IBM Knowledge Catalog Standard (ikc-standard)

**YAML Reference:** Lines 735-787

```typescript
{
  id: 'ikc-standard',
  name: 'IBM Knowledge Catalog Standard',
  originalName: 'ikc_standard',
  original_name: 'ikc_standard',
  description: 'Standard data catalog for data governance',
  category: 'Governance',
  restrictions: [
    'Cannot be installed in the same IBM Software Hub instance as IBM Knowledge Catalog',
    'Cannot be installed in the same IBM Software Hub instance as IBM Knowledge Catalog Premium'
  ],
  
  externalDependencies: [...existing...],
  serviceDependencies: [...existing...],
  componentDependencies: [...existing...],
  
  external_dependencies: {
    required: [
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
    ],
    conditional: []
  },
  
  service_dependencies: {
    required: [
      {
        name: 'IBM Knowledge Catalog',
        type: 'service',
        install_behavior: 'auto_installed'
      }
    ],
    optional: [
      {
        name: 'IBM Manta Data Lineage',
        type: 'service'
      },
      {
        name: 'MANTA Automated Data Lineage',
        type: 'service'
      }
    ],
    conditional: []
  },
  
  component_dependencies: {
    auto_installed: [],
    conditional: [
      {
        condition: {
          expression: 'gen AI based features are enabled'
        },
        installs: [
          {
            name: 'Inference foundation models',
            type: 'component',
            original_name: 'watsonx_ai_ifm',
            install_behavior: 'auto_installed'
          }
        ]
      },
      {
        condition: {
          expression: 'relationship explorer and semantic search feature is enabled'
        },
        installs: [
          {
            name: 'Neo4j',
            type: 'component',
            original_name: 'ibm_neo4j',
            install_behavior: 'auto_installed'
          },
          {
            name: 'FoundationDB',
            type: 'component',
            original_name: 'opencontent_fdb',
            install_behavior: 'auto_installed'
          }
        ],
        notes: ['The source states one of these dependencies is installed']
      }
    ]
  },
  
  version_constraints: [],
  notes: [],
  references: [],
  
  configSchema: {...existing...},
  state: 'removed',
  version: '5.3.0'
}
```

### 9. DataStage Enterprise Plus (datastage-ent-plus)

**YAML Reference:** Lines 398-424

```typescript
{
  id: 'datastage-ent-plus',
  name: 'DataStage Enterprise Plus',
  originalName: 'datastage-ent-plus',
  original_name: 'datastage-ent-plus',
  description: 'Enterprise data integration with advanced features',
  category: 'Integration',
  restrictions: [],
  
  externalDependencies: [],
  serviceDependencies: [],
  componentDependencies: [...existing...],
  
  external_dependencies: {
    required: [],
    conditional: []
  },
  
  service_dependencies: {
    required: [],
    optional: [
      {
        name: 'Orchestration Pipelines',
        type: 'service',
        notes: ['Enables conversion of DataStage sequence jobs to pipelines']
      }
    ],
    conditional: []
  },
  
  component_dependencies: {
    auto_installed: [
      {
        name: 'Common core services',
        type: 'component',
        original_name: 'ccs',
        install_behavior: 'auto_installed'
      },
      {
        name: 'OpenSearch',
        type: 'component',
        original_name: 'opencontent_opensearch',
        install_behavior: 'auto_installed'
      }
    ],
    conditional: []
  },
  
  version_constraints: [],
  notes: [],
  references: [],
  
  configSchema: {...existing...},
  state: 'removed',
  version: '5.3.0'
}
```

### 10. Cognos Analytics (cognos-analytics)

**YAML Reference:** Lines 205-239

```typescript
{
  id: 'cognos-analytics',
  name: 'Cognos Analytics',
  originalName: 'ca',
  original_name: 'ca',
  description: 'Business intelligence and analytics platform',
  category: 'Analytics',
  restrictions: [],
  
  externalDependencies: [...existing...],
  serviceDependencies: [],
  componentDependencies: [...existing...],
  
  external_dependencies: {
    required: [
      {
        name: 'Content store',
        type: 'external_system',
        notes: ['Can be an integrated Db2 database or an external relational database']
      },
      {
        name: 'Audit database',
        type: 'external_system',
        notes: ['Audit records can optionally be stored in the content store']
      },
      {
        name: 'SMTP server',
        type: 'external_system',
        notes: ['Required only for email notification feature']
      }
    ],
    conditional: []
  },
  
  service_dependencies: {
    required: [],
    optional: [],
    conditional: []
  },
  
  component_dependencies: {
    auto_installed: [
      {
        name: 'Common core services',
        type: 'component',
        original_name: 'ccs',
        install_behavior: 'auto_installed'
      },
      {
        name: 'OpenSearch',
        type: 'component',
        original_name: 'opencontent_opensearch',
        install_behavior: 'auto_installed'
      }
    ],
    conditional: []
  },
  
  version_constraints: [],
  notes: [],
  references: [],
  
  configSchema: {...existing...},
  state: 'removed',
  version: '5.3.0'
}
```

### 11. Db2 (db2)

**YAML Reference:** Lines 459-481

```typescript
{
  id: 'db2',
  name: 'Db2',
  originalName: 'db2',
  original_name: 'db2',
  description: 'Enterprise-grade relational database',
  category: 'Data Management',
  restrictions: [],
  
  externalDependencies: [],
  serviceDependencies: [],
  componentDependencies: [...existing...],
  
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
        notes: ['Provides a graphical user interface for SQL execution and a runtime monitoring interface']
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
  
  configSchema: {...existing...},
  state: 'removed',
  version: '5.3.0'
}
```

### 12. Data Virtualization (data-virtualization)

**YAML Reference:** Lines 425-458

```typescript
{
  id: 'data-virtualization',
  name: 'Data Virtualization',
  originalName: 'dv',
  original_name: 'dv',
  description: 'Query data across multiple sources without moving it',
  category: 'Data Management',
  restrictions: [],
  
  externalDependencies: [],
  serviceDependencies: [],
  componentDependencies: [...existing...],
  
  external_dependencies: {
    required: [],
    conditional: []
  },
  
  service_dependencies: {
    required: [
      {
        name: 'Db2 Data Management Console',
        type: 'service',
        install_behavior: 'auto_installed'
      }
    ],
    optional: [],
    conditional: []
  },
  
  component_dependencies: {
    auto_installed: [
      {
        name: 'Common core services',
        type: 'component',
        original_name: 'ccs',
        install_behavior: 'auto_installed'
      },
      {
        name: 'Db2U',
        type: 'component',
        original_name: 'db2u',
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
      }
    ],
    conditional: []
  },
  
  version_constraints: [],
  notes: [],
  references: [],
  
  configSchema: {...existing...},
  state: 'removed',
  version: '5.3.0'
}
```

## Implementation Checklist

- [ ] Update import statement to include CloudPakComponentEnhanced
- [ ] Change MOCK_COMPONENTS array type
- [ ] Enhance watson-ml with full YAML data
- [ ] Enhance watson-studio with full YAML data
- [ ] Enhance watson-openscale with full YAML data
- [ ] Enhance watsonx-ai with full YAML data
- [ ] Enhance watsonx-data with full YAML data
- [ ] Enhance watsonx-governance with full YAML data
- [ ] Enhance ikc-premium with full YAML data
- [ ] Enhance ikc-standard with full YAML data
- [ ] Enhance datastage-ent-plus with full YAML data
- [ ] Enhance cognos-analytics with full YAML data
- [ ] Enhance db2 with full YAML data
- [ ] Enhance data-virtualization with full YAML data
- [ ] Test UI to ensure backward compatibility
- [ ] Verify no TypeScript errors
- [ ] Update documentation

## Testing Strategy

After implementing enhancements:

1. **Type Check:** Run `npm run type-check` to verify no TypeScript errors
2. **Build Test:** Run `npm run build` to ensure successful compilation
3. **UI Test:** Load component selection page and verify:
   - All 12 components display correctly
   - Component cards show proper information
   - Dependency graph renders without errors
   - Selection/deselection works
   - No console errors

## Success Criteria

- [ ] All 12 components have enhanced dependency structures
- [ ] original_name field added to all components
- [ ] external_dependencies, service_dependencies, component_dependencies properly structured
- [ ] version_constraints, notes, references arrays added (even if empty)
- [ ] No TypeScript compilation errors
- [ ] UI continues to function correctly
- [ ] Backward compatibility maintained

## Next Steps After Completion

Once Phase 1.5.2 is complete:
1. Proceed to Phase 1.5.3: Add 20 high-priority components
2. Use the same enhancement pattern for new components
3. Continue building toward 100% component coverage (62/62)

---

**Document Version:** 1.0  
**Last Updated:** 2026-04-06  
**Status:** Ready for Implementation