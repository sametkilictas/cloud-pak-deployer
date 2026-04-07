/**
 * Mock Component Data
 * Realistic Cloud Pak for Data component definitions for the mock UI
 */

import { Component } from '@/types';

export const MOCK_COMPONENTS: Component[] = [
  {
    id: 'watson-ml',
    name: 'Watson Machine Learning',
    originalName: 'wml',
    description: 'Build, train, and deploy machine learning models at scale',
    category: 'AI & Machine Learning',
    restrictions: [],
    externalDependencies: [
      {
        name: 'Node Feature Discovery Operator',
        type: 'operator',
        installBehavior: 'must_exist',
        notes: ['Required for hardware feature detection']
      }
    ],
    serviceDependencies: [
      {
        name: 'Watson Studio',
        type: 'service',
        relationship: 'required',
        notes: ['Watson Studio provides the development environment']
      }
    ],
    componentDependencies: [
      {
        name: 'Common core services',
        type: 'component',
        originalName: 'ccs',
        installBehavior: 'auto_installed'
      },
      {
        name: 'OpenSearch',
        type: 'component',
        originalName: 'opencontent_opensearch',
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
            { value: 'small', label: 'Small (Development)' },
            { value: 'medium', label: 'Medium (Production)' },
            { value: 'large', label: 'Large (Enterprise)' }
          ],
          defaultValue: 'small',
          helperText: 'Select the deployment size based on your workload'
        }
      ]
    },
    state: 'removed',
    version: '5.3.0'
  },
  {
    id: 'watson-studio',
    name: 'Watson Studio',
    originalName: 'ws',
    description: 'Collaborative data science and machine learning platform',
    category: 'AI & Machine Learning',
    restrictions: [],
    externalDependencies: [],
    serviceDependencies: [],
    componentDependencies: [
      {
        name: 'Common core services',
        type: 'component',
        originalName: 'ccs',
        installBehavior: 'auto_installed'
      }
    ],
    configSchema: {
      fields: []
    },
    state: 'removed',
    version: '5.3.0'
  },
  {
    id: 'watson-openscale',
    name: 'Watson OpenScale',
    originalName: 'watson-openscale',
    description: 'Monitor and manage AI models for trust and transparency',
    category: 'AI & Machine Learning',
    restrictions: [],
    externalDependencies: [],
    serviceDependencies: [
      {
        name: 'Watson Machine Learning',
        type: 'service',
        relationship: 'optional',
        notes: ['Enhances model monitoring capabilities']
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
  },
  {
    id: 'watsonx-ai',
    name: 'watsonx.ai',
    originalName: 'watsonx_ai',
    description: 'Foundation models and generative AI platform',
    category: 'AI & Machine Learning',
    restrictions: [],
    externalDependencies: [
      {
        name: 'Node Feature Discovery Operator',
        type: 'operator',
        installBehavior: 'must_exist'
      },
      {
        name: 'NVIDIA GPU Operator',
        type: 'operator',
        installBehavior: 'must_exist',
        conditional: true,
        condition: 'GPU support enabled'
      },
      {
        name: 'Red Hat OpenShift AI',
        type: 'platform_software',
        installBehavior: 'must_exist'
      }
    ],
    serviceDependencies: [],
    componentDependencies: [
      {
        name: 'Common core services',
        type: 'component',
        originalName: 'ccs',
        installBehavior: 'auto_installed'
      },
      {
        name: 'Inference foundation models',
        type: 'component',
        originalName: 'watsonx_ai_ifm',
        installBehavior: 'auto_installed'
      }
    ],
    configSchema: {
      fields: [
        {
          name: 'tuning_disabled',
          label: 'Disable Model Tuning',
          type: 'boolean',
          required: false,
          defaultValue: true,
          helperText: 'Disable fine-tuning capabilities to reduce resource usage'
        },
        {
          name: 'liteInstall',
          label: 'Lite Installation',
          type: 'boolean',
          required: false,
          defaultValue: false,
          helperText: 'Install minimal set of models'
        }
      ]
    },
    state: 'removed',
    version: '5.3.0'
  },
  {
    id: 'watsonx-data',
    name: 'watsonx.data',
    originalName: 'watsonx_data',
    description: 'Open lakehouse for data and AI workloads',
    category: 'Data Management',
    restrictions: [],
    externalDependencies: [],
    serviceDependencies: [],
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
          name: 'scaleConfig',
          label: 'Scale Configuration',
          type: 'select',
          required: true,
          options: [
            { value: 'small', label: 'Small' },
            { value: 'medium', label: 'Medium' },
            { value: 'large', label: 'Large' }
          ],
          defaultValue: 'small'
        },
        {
          name: 'enable_lite_milvus',
          label: 'Enable Lite Milvus',
          type: 'boolean',
          required: false,
          defaultValue: false,
          helperText: 'Enable lightweight vector database'
        }
      ]
    },
    state: 'removed',
    version: '5.3.0'
  },
  {
    id: 'watsonx-governance',
    name: 'watsonx.governance',
    originalName: 'watsonx_governance',
    description: 'AI governance and risk management',
    category: 'Governance',
    restrictions: [],
    externalDependencies: [],
    serviceDependencies: [
      {
        name: 'Watson OpenScale',
        type: 'service',
        relationship: 'optional'
      },
      {
        name: 'AI Factsheets',
        type: 'service',
        relationship: 'optional'
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
          name: 'installType',
          label: 'Installation Type',
          type: 'select',
          required: true,
          options: [
            { value: 'all', label: 'All Components' },
            { value: 'factsheet', label: 'Factsheet Only' },
            { value: 'openscale', label: 'OpenScale Only' }
          ],
          defaultValue: 'all'
        },
        {
          name: 'enableFactsheet',
          label: 'Enable AI Factsheets',
          type: 'boolean',
          required: false,
          defaultValue: true
        },
        {
          name: 'enableOpenscale',
          label: 'Enable OpenScale',
          type: 'boolean',
          required: false,
          defaultValue: true
        }
      ]
    },
    state: 'removed',
    version: '5.3.0'
  },
  {
    id: 'ikc-premium',
    name: 'IBM Knowledge Catalog Premium',
    originalName: 'ikc_premium',
    description: 'Enterprise data catalog with AI-powered capabilities',
    category: 'Governance',
    restrictions: [
      'Cannot be installed in the same IBM Software Hub instance as IBM Knowledge Catalog',
      'Cannot be installed in the same IBM Software Hub instance as IBM Knowledge Catalog Standard'
    ],
    externalDependencies: [
      {
        name: 'Node Feature Discovery Operator',
        type: 'operator',
        installBehavior: 'must_exist'
      },
      {
        name: 'NVIDIA GPU Operator',
        type: 'operator',
        installBehavior: 'must_exist'
      },
      {
        name: 'Red Hat OpenShift AI',
        type: 'platform_software',
        installBehavior: 'must_exist'
      }
    ],
    serviceDependencies: [
      {
        name: 'IBM Knowledge Catalog',
        type: 'service',
        relationship: 'required',
        installBehavior: 'auto_installed'
      }
    ],
    componentDependencies: [
      {
        name: 'Common core services',
        type: 'component',
        originalName: 'ccs',
        installBehavior: 'auto_installed'
      },
      {
        name: 'Neo4j',
        type: 'component',
        originalName: 'ibm_neo4j',
        installBehavior: 'auto_installed',
        conditional: true,
        condition: 'semantic search enabled'
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
        },
        {
          name: 'enableSemanticEnrichment',
          label: 'Enable Semantic Enrichment',
          type: 'boolean',
          required: false,
          defaultValue: true
        },
        {
          name: 'enableAISearch',
          label: 'Enable AI Search',
          type: 'boolean',
          required: false,
          defaultValue: false
        }
      ]
    },
    state: 'removed',
    version: '5.3.0'
  },
  {
    id: 'ikc-standard',
    name: 'IBM Knowledge Catalog Standard',
    originalName: 'ikc_standard',
    description: 'Standard data catalog for data governance',
    category: 'Governance',
    restrictions: [
      'Cannot be installed in the same IBM Software Hub instance as IBM Knowledge Catalog',
      'Cannot be installed in the same IBM Software Hub instance as IBM Knowledge Catalog Premium'
    ],
    externalDependencies: [
      {
        name: 'Node Feature Discovery Operator',
        type: 'operator',
        installBehavior: 'must_exist'
      },
      {
        name: 'NVIDIA GPU Operator',
        type: 'operator',
        installBehavior: 'must_exist'
      },
      {
        name: 'Red Hat OpenShift AI',
        type: 'platform_software',
        installBehavior: 'must_exist'
      }
    ],
    serviceDependencies: [
      {
        name: 'IBM Knowledge Catalog',
        type: 'service',
        relationship: 'required',
        installBehavior: 'auto_installed'
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
  },
  {
    id: 'datastage-ent-plus',
    name: 'DataStage Enterprise Plus',
    originalName: 'datastage-ent-plus',
    description: 'Enterprise data integration with advanced features',
    category: 'Integration',
    restrictions: [],
    externalDependencies: [],
    serviceDependencies: [],
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
          label: 'Instance Size',
          type: 'select',
          required: false,
          options: [
            { value: 'small', label: 'Small' },
            { value: 'medium', label: 'Medium' },
            { value: 'large', label: 'Large' }
          ],
          defaultValue: 'medium'
        }
      ]
    },
    state: 'removed',
    version: '5.3.0'
  },
  {
    id: 'cognos-analytics',
    name: 'Cognos Analytics',
    originalName: 'ca',
    description: 'Business intelligence and analytics platform',
    category: 'Analytics',
    restrictions: [],
    externalDependencies: [
      {
        name: 'Content store',
        type: 'external_system',
        installBehavior: 'must_exist',
        notes: ['Can be an integrated Db2 database or an external relational database']
      },
      {
        name: 'SMTP server',
        type: 'external_system',
        installBehavior: 'must_exist',
        notes: ['Required only for email notification feature']
      }
    ],
    serviceDependencies: [],
    componentDependencies: [
      {
        name: 'Common core services',
        type: 'component',
        originalName: 'ccs',
        installBehavior: 'auto_installed'
      },
      {
        name: 'OpenSearch',
        type: 'component',
        originalName: 'opencontent_opensearch',
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
  },
  {
    id: 'db2',
    name: 'Db2',
    originalName: 'db2',
    description: 'Enterprise-grade relational database',
    category: 'Data Management',
    restrictions: [],
    externalDependencies: [],
    serviceDependencies: [],
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
          label: 'Database Size',
          type: 'select',
          required: true,
          options: [
            { value: 'small', label: 'Small' },
            { value: 'medium', label: 'Medium' },
            { value: 'large', label: 'Large' }
          ],
          defaultValue: 'small'
        },
        {
          name: 'metadata_size_gb',
          label: 'Metadata Storage (GB)',
          type: 'number',
          required: false,
          min: 10,
          max: 1000,
          defaultValue: 20
        },
        {
          name: 'data_size_gb',
          label: 'Data Storage (GB)',
          type: 'number',
          required: false,
          min: 10,
          max: 10000,
          defaultValue: 20
        }
      ]
    },
    state: 'removed',
    version: '5.3.0'
  },
  {
    id: 'data-virtualization',
    name: 'Data Virtualization',
    originalName: 'dv',
    description: 'Query data across multiple sources without moving it',
    category: 'Data Management',
    restrictions: [],
    externalDependencies: [],
    serviceDependencies: [],
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
];

// Helper function to get component by ID
export const getComponentById = (id: string): Component | undefined => {
  return MOCK_COMPONENTS.find(c => c.id === id);
};

// Helper function to get components by category
export const getComponentsByCategory = (category: string): Component[] => {
  return MOCK_COMPONENTS.filter(c => c.category === category);
};

// Get all unique categories
export const COMPONENT_CATEGORIES = Array.from(
  new Set(MOCK_COMPONENTS.map(c => c.category))
);

// Made with Bob
