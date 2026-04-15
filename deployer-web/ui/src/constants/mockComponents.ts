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
  },
  {
    id: 'watson-assistant',
    name: 'Watson Assistant',
    originalName: 'watson-assistant',
    description: 'Build conversational interfaces with AI-powered virtual agents',
    category: 'AI & Machine Learning',
    restrictions: [],
    externalDependencies: [
      {
        name: 'Multicloud Object Gateway',
        type: 'platform_software',
        installBehavior: 'must_exist'
      },
      {
        name: 'Red Hat OpenShift Serverless Knative Eventing',
        type: 'platform_software',
        installBehavior: 'must_exist'
      },
      {
        name: 'Node Feature Discovery Operator',
        type: 'operator',
        installBehavior: 'must_exist',
        conditional: true,
        condition: 'conversational skills or conversational search features are used'
      },
      {
        name: 'NVIDIA GPU Operator',
        type: 'operator',
        installBehavior: 'must_exist',
        conditional: true,
        condition: 'conversational skills or conversational search features are used'
      },
      {
        name: 'Red Hat OpenShift AI',
        type: 'platform_software',
        installBehavior: 'must_exist',
        conditional: true,
        condition: 'conversational skills or conversational search features are used'
      }
    ],
    serviceDependencies: [
      {
        name: 'Watson Discovery',
        type: 'service',
        relationship: 'optional',
        notes: ['Enables adding a search skill when conversational search is not used']
      }
    ],
    componentDependencies: [
      {
        name: 'Cloud Native PostgreSQL',
        type: 'component',
        originalName: 'postgresql',
        installBehavior: 'auto_installed'
      },
      {
        name: 'etcd',
        type: 'component',
        originalName: 'opencontent_etcd',
        installBehavior: 'auto_installed'
      },
      {
        name: 'OpenSearch',
        type: 'component',
        originalName: 'opencontent_opensearch',
        installBehavior: 'auto_installed'
      },
      {
        name: 'Redis',
        type: 'component',
        originalName: 'ibm_redis_cp',
        installBehavior: 'auto_installed'
      },
      {
        name: 'Watson data governor',
        type: 'component',
        originalName: 'data_governor',
        installBehavior: 'auto_installed'
      },
      {
        name: 'Watson Gateway',
        type: 'component',
        originalName: 'watson_gateway',
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
    id: 'watson-discovery',
    name: 'Watson Discovery',
    originalName: 'watson-discovery',
    description: 'AI-powered enterprise search and text analytics',
    category: 'AI & Machine Learning',
    restrictions: [],
    externalDependencies: [
      {
        name: 'Multicloud Object Gateway',
        type: 'platform_software',
        installBehavior: 'must_exist'
      },
      {
        name: 'Node Feature Discovery Operator',
        type: 'operator',
        installBehavior: 'must_exist',
        conditional: true,
        condition: 'advanced features are used'
      },
      {
        name: 'NVIDIA GPU Operator',
        type: 'operator',
        installBehavior: 'must_exist',
        conditional: true,
        condition: 'advanced features are used'
      },
      {
        name: 'Red Hat OpenShift AI',
        type: 'platform_software',
        installBehavior: 'must_exist',
        conditional: true,
        condition: 'advanced features are used'
      }
    ],
    serviceDependencies: [],
    componentDependencies: [
      {
        name: 'Cloud Native PostgreSQL',
        type: 'component',
        originalName: 'postgresql',
        installBehavior: 'auto_installed'
      },
      {
        name: 'etcd',
        type: 'component',
        originalName: 'opencontent_etcd',
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
  },
  {
    id: 'watsonx-orchestrate',
    name: 'watsonx Orchestrate',
    originalName: 'watsonx_orchestrate',
    description: 'AI-powered automation and agentic workflows',
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
        name: 'Watson Assistant',
        type: 'service',
        relationship: 'optional',
        notes: ['Auto-installed in agentic mode']
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
  },
  {
    id: 'voice-gateway',
    name: 'Voice Gateway',
    originalName: 'voice-gateway',
    description: 'Voice-enabled conversational AI integration',
    category: 'AI & Machine Learning',
    restrictions: [],
    externalDependencies: [
      {
        name: 'Multicloud Object Gateway',
        type: 'platform_software',
        installBehavior: 'must_exist'
      },
      {
        name: 'Node Feature Discovery Operator',
        type: 'operator',
        installBehavior: 'must_exist',
        conditional: true,
        condition: 'enrichment features are used'
      },
      {
        name: 'NVIDIA GPU Operator',
        type: 'operator',
        installBehavior: 'must_exist',
        conditional: true,
        condition: 'enrichment features are used'
      },
      {
        name: 'Red Hat OpenShift AI',
        type: 'platform_software',
        installBehavior: 'must_exist',
        conditional: true,
        condition: 'enrichment features are used'
      }
    ],
    serviceDependencies: [],
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
  },
  {
    id: 'watsonx-code-assistant',
    name: 'watsonx Code Assistant',
    originalName: 'wca',
    description: 'AI-powered code generation and assistance',
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
        installBehavior: 'must_exist'
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
      }
    ],
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
  },
  {
    id: 'wca-ansible',
    name: 'watsonx Code Assistant for Ansible',
    originalName: 'wca-ansible',
    description: 'AI-powered Ansible playbook generation',
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
        installBehavior: 'must_exist'
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
      }
    ],
    configSchema: {
      fields: []
    },
    state: 'removed',
    version: '5.3.0'
  },
  {
    id: 'wca-z',
    name: 'watsonx Code Assistant for Z',
    originalName: 'wca-z',
    description: 'AI-powered mainframe code assistance',
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
        installBehavior: 'must_exist'
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
      }
    ],
    configSchema: {
      fields: []
    },
    state: 'removed',
    version: '5.3.0'
  },
  {
    id: 'db2wh',
    name: 'Db2 Warehouse',
    originalName: 'db2wh',
    description: 'Enterprise data warehouse for analytics workloads',
    category: 'Data Management',
    restrictions: [],
    externalDependencies: [],
    serviceDependencies: [
      {
        name: 'Db2 Data Management Console',
        type: 'service',
        relationship: 'optional',
        notes: ['Provides a graphical user interface for SQL execution and a runtime monitoring interface']
      }
    ],
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
  },
  {
    id: 'match-360',
    name: 'IBM Match 360',
    originalName: 'match360',
    description: 'Master data management and entity resolution',
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
  },
  {
    id: 'db2-bigsql',
    name: 'Db2 Big SQL',
    originalName: 'bigsql',
    description: 'SQL-on-Hadoop query engine',
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
      fields: []
    },
    state: 'removed',
    version: '5.3.0'
  },
  {
    id: 'data-gate',
    name: 'Db2 Data Gate',
    originalName: 'datagate',
    description: 'Db2 for z/OS data access and integration',
    category: 'Data Management',
    restrictions: [],
    externalDependencies: [
      {
        name: 'IBM z/OS',
        type: 'external_system',
        installBehavior: 'must_exist',
        notes: ['Version 2.4 or later; product code 5650-ZOS']
      },
      {
        name: 'Db2 Connect Unlimited Edition license',
        type: 'license',
        installBehavior: 'must_exist',
        notes: ['Required to establish a JDBC connection to Db2 for z/OS']
      },
      {
        name: 'Db2 for z/OS',
        type: 'external_system',
        installBehavior: 'must_exist',
        notes: ['Supported versions: V12 with required APAR fixes and Function Level 505 or higher, or V13']
      }
    ],
    serviceDependencies: [
      {
        name: 'Db2',
        type: 'service',
        relationship: 'required'
      },
      {
        name: 'Db2 Warehouse',
        type: 'service',
        relationship: 'required'
      },
      {
        name: 'IBM Knowledge Catalog',
        type: 'service',
        relationship: 'optional',
        notes: ['Automatically publishes metadata about Data Gate tables to catalogs']
      }
    ],
    componentDependencies: [],
    configSchema: {
      fields: []
    },
    state: 'removed',
    version: '5.3.0'
  },
  {
    id: 'data-replication',
    name: 'Data Replication',
    originalName: 'replication',
    description: 'Real-time data replication and synchronization',
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
  },
  {
    id: 'decision-optimization',
    name: 'Decision Optimization',
    originalName: 'dods',
    description: 'Prescriptive analytics for optimal decision-making',
    category: 'Analytics',
    restrictions: [],
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
  },
  {
    id: 'planning-analytics',
    name: 'Planning Analytics',
    originalName: 'planning-analytics',
    description: 'Financial planning and analysis platform',
    category: 'Analytics',
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
    id: 'spss-modeler',
    name: 'SPSS Modeler',
    originalName: 'spss',
    description: 'Predictive analytics and statistical modeling',
    category: 'Analytics',
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
    id: 'analytics-engine',
    name: 'Analytics Engine',
    originalName: 'analyticsengine',
    description: 'Analytics Engine powered by Apache Spark',
    category: 'Analytics',
    restrictions: [],
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
  },
  {
    id: 'cognos-dashboards',
    name: 'Cognos Dashboards',
    originalName: 'dashboard',
    description: 'Interactive business intelligence dashboards',
    category: 'Analytics',
    restrictions: [],
    externalDependencies: [],
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
      },
      {
        name: 'Redis',
        type: 'component',
        originalName: 'ibm_redis_cp',
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
    id: 'data-privacy',
    name: 'Data Privacy',
    originalName: 'dp',
    description: 'Data privacy and protection management',
    category: 'Governance',
    restrictions: [],
    externalDependencies: [],
    serviceDependencies: [
      {
        name: 'IBM Knowledge Catalog',
        type: 'service',
        relationship: 'required',
        notes: ['At least one of IBM Knowledge Catalog or IBM Knowledge Catalog Premium must be installed']
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
  },
  {
    id: 'manta-lineage',
    name: 'MANTA Automated Lineage',
    originalName: 'mantaflow',
    description: 'Automated data lineage tracking and visualization',
    category: 'Governance',
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
    id: 'datastage-ent',
    name: 'DataStage Enterprise',
    originalName: 'datastage-ent',
    description: 'Enterprise data integration and ETL',
    category: 'Integration',
    restrictions: [],
    externalDependencies: [],
    serviceDependencies: [
      {
        name: 'Orchestration Pipelines',
        type: 'service',
        relationship: 'optional',
        notes: ['Enables conversion of DataStage sequence jobs to pipelines']
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
      fields: []
    },
    state: 'removed',
    version: '5.3.0'
  },
  {
    id: 'ai-factsheets',
    name: 'AI Factsheets',
    originalName: 'factsheet',
    description: 'AI model documentation and governance',
    category: 'Governance',
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
    id: 'data-product-hub',
    name: 'Data Product Hub',
    originalName: 'dataproduct',
    description: 'Manage and share data products across the organization',
    category: 'Data Management',
    restrictions: [],
    externalDependencies: [],
    serviceDependencies: [
      {
        name: 'Analytics Engine powered by Apache Spark',
        type: 'service',
        relationship: 'required',
        installBehavior: 'auto_installed'
      },
      {
        name: 'Data Refinery',
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
        name: 'OpenSearch',
        type: 'component',
        originalName: 'opencontent_opensearch',
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
    id: 'data-refinery',
    name: 'Data Refinery',
    originalName: 'datarefinery',
    description: 'Data preparation and transformation tool',
    category: 'Data Management',
    restrictions: [],
    externalDependencies: [],
    serviceDependencies: [],
    componentDependencies: [],
    configSchema: {
      fields: []
    },
    state: 'removed',
    version: '5.3.0',
    disabled: true,
    disabledReason: 'Not available in current Cloud Pak for Data version'
  },
  {
    id: 'ibm-knowledge-catalog',
    name: 'IBM Knowledge Catalog',
    originalName: 'wkc',
    description: 'Enterprise data catalog for data governance',
    category: 'Governance',
    restrictions: [
      'Cannot be installed in the same IBM Software Hub instance as IBM Knowledge Catalog Premium',
      'Cannot be installed in the same IBM Software Hub instance as IBM Knowledge Catalog Standard'
    ],
    externalDependencies: [],
    serviceDependencies: [
      {
        name: 'Analytics Engine powered by Apache Spark',
        type: 'service',
        relationship: 'required',
        installBehavior: 'auto_installed'
      },
      {
        name: 'Data Refinery',
        type: 'service',
        relationship: 'required',
        installBehavior: 'auto_installed'
      },
      {
        name: 'Data Privacy',
        type: 'service',
        relationship: 'optional'
      },
      {
        name: 'IBM Manta Data Lineage',
        type: 'service',
        relationship: 'optional'
      },
      {
        name: 'MANTA Automated Data Lineage',
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
          name: 'enableKnowledgeGraph',
          label: 'Enable Knowledge Graph',
          type: 'boolean',
          required: false,
          defaultValue: false
        },
        {
          name: 'enableDataQuality',
          label: 'Enable Data Quality',
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
    id: 'orchestration-pipelines',
    name: 'Orchestration Pipelines',
    originalName: 'ws-pipelines',
    description: 'Workflow orchestration and pipeline management',
    category: 'Integration',
    restrictions: [],
    externalDependencies: [],
    serviceDependencies: [],
    componentDependencies: [],
    configSchema: {
      fields: [
        {
          name: 'rbsimage',
          label: 'RBS Image',
          type: 'select',
          required: false,
          options: [
            { value: 'rbs-ext', label: 'RBS Extended' },
            { value: 'rbs-standard', label: 'RBS Standard' }
          ],
          defaultValue: 'rbs-ext'
        }
      ]
    },
    state: 'removed',
    version: '5.3.0'
  },
  {
    id: 'watson-studio-runtimes',
    name: 'Watson Studio Runtimes',
    originalName: 'ws-runtimes',
    description: 'Runtime environments for Watson Studio notebooks',
    category: 'AI & Machine Learning',
    restrictions: [],
    externalDependencies: [],
    serviceDependencies: [],
    componentDependencies: [],
    configSchema: {
      fields: []
    },
    state: 'removed',
    version: '5.3.0'
  },
  {
    id: 'watsonx-data-premium',
    name: 'watsonx.data Premium',
    originalName: 'watsonx_data_premium',
    description: 'Premium lakehouse features with GPU acceleration',
    category: 'Data Management',
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
      }
    ],
    configSchema: {
      fields: [
        {
          name: 'wxd_premium_enable_models_on',
          label: 'Enable Models On',
          type: 'select',
          required: true,
          options: [
            { value: 'gpu', label: 'GPU' },
            { value: 'cpu', label: 'CPU' }
          ],
          defaultValue: 'gpu'
        },
        {
          name: 'licenseType',
          label: 'License Type',
          type: 'select',
          required: true,
          options: [
            { value: 'premium', label: 'Premium' },
            { value: 'standard', label: 'Standard' }
          ],
          defaultValue: 'premium'
        }
      ]
    },
    state: 'removed',
    version: '5.3.0'
  },
  {
    id: 'watsonx-data-integration',
    name: 'watsonx.data integration',
    originalName: 'watsonx_dataintegration',
    description: 'Data integration capabilities for watsonx.data',
    category: 'Integration',
    restrictions: [],
    externalDependencies: [],
    serviceDependencies: [],
    componentDependencies: [],
    configSchema: {
      fields: [
        {
          name: 'enableBatchBulkETL',
          label: 'Enable Batch/Bulk ETL',
          type: 'boolean',
          required: false,
          defaultValue: true
        },
        {
          name: 'enableRealtimeStreaming',
          label: 'Enable Real-time Streaming',
          type: 'boolean',
          required: false,
          defaultValue: true
        },
        {
          name: 'enableDataObservability',
          label: 'Enable Data Observability',
          type: 'boolean',
          required: false,
          defaultValue: true
        },
        {
          name: 'enableUnstructuredDataIntegration',
          label: 'Enable Unstructured Data Integration',
          type: 'boolean',
          required: false,
          defaultValue: true
        },
        {
          name: 'enableReplication',
          label: 'Enable Replication',
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
    id: 'watsonx-data-intelligence',
    name: 'watsonx.data intelligence',
    originalName: 'watsonx_dataintelligence',
    description: 'AI-powered data intelligence and governance',
    category: 'Data Management',
    restrictions: [],
    externalDependencies: [],
    serviceDependencies: [],
    componentDependencies: [],
    configSchema: {
      fields: [
        {
          name: 'enableAISearch',
          label: 'Enable AI Search',
          type: 'boolean',
          required: false,
          defaultValue: false
        },
        {
          name: 'enableDataGovernanceCatalog',
          label: 'Enable Data Governance Catalog',
          type: 'boolean',
          required: false,
          defaultValue: true
        },
        {
          name: 'enableDataLineage',
          label: 'Enable Data Lineage',
          type: 'boolean',
          required: false,
          defaultValue: true
        },
        {
          name: 'enableDataProduct',
          label: 'Enable Data Product',
          type: 'boolean',
          required: false,
          defaultValue: true
        },
        {
          name: 'enableGenerativeAICapabilities',
          label: 'Enable Generative AI',
          type: 'boolean',
          required: false,
          defaultValue: true
        },
        {
          name: 'enableKnowledgeGraph',
          label: 'Enable Knowledge Graph',
          type: 'boolean',
          required: false,
          defaultValue: true
        },
        {
          name: 'enableSemanticEnrichment',
          label: 'Enable Semantic Enrichment',
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
    id: 'db2-data-management-console',
    name: 'Db2 Data Management Console',
    originalName: 'dmc',
    description: 'Web-based console for Db2 database management',
    category: 'Data Management',
    restrictions: [],
    externalDependencies: [],
    serviceDependencies: [],
    componentDependencies: [],
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
          defaultValue: 'medium'
        },
        {
          name: 'storage_size_gb',
          label: 'Storage Size (GB)',
          type: 'number',
          required: false,
          min: 10,
          max: 500,
          defaultValue: 50
        }
      ]
    },
    state: 'removed',
    version: '5.3.0'
  },
  {
    id: 'edb-postgres',
    name: 'EDB Postgres',
    originalName: 'edb_cp4d',
    description: 'Enterprise-grade PostgreSQL database',
    category: 'Data Management',
    restrictions: [],
    externalDependencies: [
      {
        name: 'EDB Postgres license key',
        type: 'license',
        installBehavior: 'must_exist',
        notes: ['Secret edb-postgres-license-key must be created in the vault before deploying']
      }
    ],
    serviceDependencies: [],
    componentDependencies: [],
    configSchema: {
      fields: [
        {
          name: 'version',
          label: 'PostgreSQL Version',
          type: 'select',
          required: true,
          options: [
            { value: '15.4', label: '15.4' },
            { value: '14.9', label: '14.9' }
          ],
          defaultValue: '15.4'
        }
      ]
    },
    state: 'removed',
    version: '5.3.0'
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    originalName: 'mongodb',
    description: 'NoSQL document database for Cloud Pak for Data',
    category: 'Data Management',
    restrictions: [],
    externalDependencies: [],
    serviceDependencies: [],
    componentDependencies: [],
    configSchema: {
      fields: []
    },
    state: 'removed',
    version: '5.3.0'
  },
  {
    id: 'informix',
    name: 'Informix',
    originalName: 'informix',
    description: 'IBM Informix database for embedded and IoT applications',
    category: 'Data Management',
    restrictions: [],
    externalDependencies: [],
    serviceDependencies: [],
    componentDependencies: [],
    configSchema: {
      fields: []
    },
    state: 'removed',
    version: '5.3.0',
    disabled: true,
    disabledReason: 'Not supported in Cloud Pak for Data'
  },
  {
    id: 'ibm-streamsets',
    name: 'IBM StreamSets',
    originalName: 'streamsets',
    description: 'Real-time data streaming and integration',
    category: 'Integration',
    restrictions: [],
    externalDependencies: [],
    serviceDependencies: [],
    componentDependencies: [],
    configSchema: {
      fields: []
    },
    state: 'removed',
    version: '5.3.0'
  },
  {
    id: 'unstructured-data-integration',
    name: 'Data Integration for Unstructured Data',
    originalName: 'udp',
    description: 'Process and integrate unstructured data sources',
    category: 'Integration',
    restrictions: [],
    externalDependencies: [],
    serviceDependencies: [],
    componentDependencies: [],
    configSchema: {
      fields: []
    },
    state: 'removed',
    version: '5.3.0'
  },
  {
    id: 'ibm-manta-data-lineage',
    name: 'IBM MANTA Data Lineage',
    originalName: 'datalineage',
    description: 'Enterprise data lineage and impact analysis',
    category: 'Governance',
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
    id: 'watson-speech-services',
    name: 'Watson Speech Services',
    originalName: 'watson-speech',
    description: 'Speech-to-text and text-to-speech services',
    category: 'AI & Machine Learning',
    restrictions: [],
    externalDependencies: [
      {
        name: 'Multicloud Object Gateway',
        type: 'platform_software',
        installBehavior: 'must_exist'
      },
      {
        name: 'Node Feature Discovery Operator',
        type: 'operator',
        installBehavior: 'must_exist',
        conditional: true,
        condition: 'GPU acceleration enabled'
      },
      {
        name: 'NVIDIA GPU Operator',
        type: 'operator',
        installBehavior: 'must_exist',
        conditional: true,
        condition: 'GPU acceleration enabled'
      }
    ],
    serviceDependencies: [],
    componentDependencies: [],
    configSchema: {
      fields: [
        {
          name: 'stt_size',
          label: 'Speech-to-Text Size',
          type: 'select',
          required: true,
          options: [
            { value: 'xsmall', label: 'Extra Small' },
            { value: 'small', label: 'Small' },
            { value: 'medium', label: 'Medium' }
          ],
          defaultValue: 'xsmall'
        },
        {
          name: 'tts_size',
          label: 'Text-to-Speech Size',
          type: 'select',
          required: true,
          options: [
            { value: 'xsmall', label: 'Extra Small' },
            { value: 'small', label: 'Small' },
            { value: 'medium', label: 'Medium' }
          ],
          defaultValue: 'xsmall'
        }
      ]
    },
    state: 'removed',
    version: '5.3.0'
  },
  {
    id: 'rstudio-server',
    name: 'RStudio Server',
    originalName: 'rstudio',
    description: 'RStudio Server with R 3.6 for data science',
    category: 'Development Tools',
    restrictions: [],
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
    id: 'anaconda-repository',
    name: 'Anaconda Repository',
    originalName: 'anaconda',
    description: 'Python package management and distribution',
    category: 'Development Tools',
    restrictions: [],
    externalDependencies: [],
    serviceDependencies: [],
    componentDependencies: [],
    configSchema: {
      fields: []
    },
    state: 'removed',
    version: '5.3.0',
    disabled: true,
    disabledReason: 'Infrastructure component, not user-installable'
  },
  {
    id: 'synthetic-data-generator',
    name: 'Synthetic Data Generator',
    originalName: 'syntheticdata',
    description: 'Generate synthetic test data for development',
    category: 'Data Management',
    restrictions: [],
    externalDependencies: [],
    serviceDependencies: [],
    componentDependencies: [],
    configSchema: {
      fields: []
    },
    state: 'removed',
    version: '5.3.0'
  },
  {
    id: 'openpages',
    name: 'OpenPages',
    originalName: 'openpages',
    description: 'Governance, risk, and compliance platform',
    category: 'Governance',
    restrictions: [],
    externalDependencies: [],
    serviceDependencies: [],
    componentDependencies: [],
    configSchema: {
      fields: []
    },
    state: 'removed',
    version: '5.3.0'
  },
  {
    id: 'data-privacy-risk-assessment',
    name: 'Data Privacy Risk Assessment',
    originalName: 'dpra',
    description: 'Privacy risk assessment and compliance',
    category: 'Governance',
    restrictions: [],
    externalDependencies: [],
    serviceDependencies: [
      {
        name: 'Data Privacy',
        type: 'service',
        relationship: 'required'
      }
    ],
    componentDependencies: [],
    configSchema: {
      fields: []
    },
    state: 'removed',
    version: '5.3.0'
  },
  {
    id: 'execution-engine-hadoop',
    name: 'Execution Engine for Apache Hadoop',
    originalName: 'hee',
    description: 'Execute Spark jobs on external Hadoop clusters',
    category: 'Analytics',
    restrictions: [],
    externalDependencies: [
      {
        name: 'Execution Engine for Apache Hadoop RPM installation',
        type: 'external_system',
        installBehavior: 'must_exist',
        notes: ['Must be installed on a Hadoop cluster']
      },
      {
        name: 'Same-network Hadoop cluster',
        type: 'external_system',
        installBehavior: 'must_exist',
        notes: ['The Hadoop cluster must be in the same network as the IBM Software Hub deployment']
      }
    ],
    serviceDependencies: [
      {
        name: 'Watson Studio',
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
  },
  {
    id: 'product-master',
    name: 'Product Master',
    originalName: 'productmaster',
    description: 'Master data management for product information',
    category: 'Data Management',
    restrictions: [],
    externalDependencies: [
      {
        name: 'Db2 instance secret',
        type: 'external_system',
        installBehavior: 'must_exist',
        notes: ['Db2 instance secret must be set up before installation']
      }
    ],
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
    id: 'wca-z-code-explanation',
    name: 'watsonx Code Assistant for Z Code Explanation',
    originalName: 'wca-z-ce',
    description: 'AI-powered mainframe code explanation and documentation',
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
        installBehavior: 'must_exist'
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
      }
    ],
    configSchema: {
      fields: []
    },
    state: 'removed',
    version: '5.3.0',
    disabled: true,
    disabledReason: 'Coming soon in future release'
  },
  {
    id: 'wca-z-agentic',
    name: 'watsonx Code Assistant for Z Agentic',
    originalName: 'wca-z-agentic',
    description: 'Agentic AI for mainframe code development',
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
        installBehavior: 'must_exist'
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
      }
    ],
    configSchema: {
      fields: []
    },
    state: 'removed',
    version: '5.3.0',
    disabled: true,
    disabledReason: 'Coming soon in future release'
  },
  {
    id: 'wca-z-code-generation',
    name: 'watsonx Code Assistant for Z Code Generation',
    originalName: 'wca-z-codegen',
    description: 'AI-powered mainframe code generation',
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
        installBehavior: 'must_exist'
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
      }
    ],
    configSchema: {
      fields: []
    },
    state: 'removed',
    version: '5.3.0',
    disabled: true,
    disabledReason: 'Coming soon in future release'
  },
  {
    id: 'wca-z-understand',
    name: 'watsonx Code Assistant for Z Understand',
    originalName: 'wca-z-understand',
    description: 'AI-powered mainframe code understanding and analysis',
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
        installBehavior: 'must_exist'
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
      }
    ],
    configSchema: {
      fields: []
    },
    state: 'removed',
    version: '5.3.0',
    disabled: true,
    disabledReason: 'Coming soon in future release'
  },
  {
    id: 'ibm-rpa',
    name: 'IBM Robotic Process Automation',
    originalName: 'rpa',
    description: 'Automate repetitive business processes with RPA',
    category: 'Integration',
    restrictions: [],
    externalDependencies: [],
    serviceDependencies: [],
    componentDependencies: [],
    configSchema: {
      fields: []
    },
    state: 'removed',
    version: '5.3.0',
    disabled: true,
    disabledReason: 'Not supported in Cloud Pak for Data'
  },
  {
    id: 'watson-ml-accelerator',
    name: 'Watson Machine Learning Accelerator',
    originalName: 'wml-accelerator',
    description: 'GPU-accelerated machine learning training and inference',
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
      }
    ],
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
        },
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
    id: 'scheduler',
    name: 'Scheduler',
    originalName: 'scheduler',
    description: 'Job scheduling and workflow automation',
    category: 'Integration',
    restrictions: [],
    externalDependencies: [],
    serviceDependencies: [],
    componentDependencies: [],
    configSchema: {
      fields: []
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
