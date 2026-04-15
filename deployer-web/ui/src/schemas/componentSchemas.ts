/**
 * Component Configuration Schemas
 * 
 * This file defines the configuration schemas for all Cloud Pak for Data components.
 * Each schema describes the form fields, validation rules, and default values for
 * configuring a specific component.
 * 
 * Schemas are used by the ConfigurationForm component to dynamically generate
 * configuration forms based on the selected components.
 */

import { ComponentConfigSchema, FormFieldSchema, FormSectionSchema } from '../types/configuration.types';
import { 
  ALPHANUMERIC_HYPHEN, 
  LOWERCASE_ALPHANUMERIC, 
  K8S_NAME, 
  VALIDATION_MESSAGES 
} from '../types/configuration.types';

// ============================================================================
// Helper Functions for Common Fields
// ============================================================================

/**
 * Creates a standard size field for components that support sizing
 */
const createSizeField = (required: boolean = false): FormFieldSchema => ({
  name: 'size',
  label: 'Size',
  type: 'select',
  required,
  defaultValue: 'small',
  options: [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' }
  ],
  helpText: 'Select the deployment size based on your workload requirements',
  validation: {
    required: required ? VALIDATION_MESSAGES.REQUIRED : undefined
  }
});

/**
 * Creates a standard replicas field for components that support scaling
 */
const createReplicasField = (defaultValue: number = 1): FormFieldSchema => ({
  name: 'replicas',
  label: 'Replicas',
  type: 'number',
  required: false,
  defaultValue,
  min: 1,
  max: 10,
  helpText: 'Number of replicas for high availability',
  validation: {
    min: { value: 1, message: 'Must be at least 1' },
    max: { value: 10, message: 'Cannot exceed 10' }
  }
});

/**
 * Creates a standard storage class field
 */
const createStorageClassField = (required: boolean = false): FormFieldSchema => ({
  name: 'storage_class',
  label: 'Storage Class',
  type: 'text',
  required,
  placeholder: 'e.g., managed-nfs-storage',
  helpText: 'Kubernetes storage class for persistent volumes',
  validation: {
    required: required ? VALIDATION_MESSAGES.REQUIRED : undefined,
    pattern: { value: K8S_NAME, message: VALIDATION_MESSAGES.K8S_NAME }
  }
});

/**
 * Creates a standard storage size field
 */
const createStorageSizeField = (
  name: string,
  label: string,
  defaultValue: number = 20
): FormFieldSchema => ({
  name,
  label,
  type: 'number',
  required: false,
  defaultValue,
  min: 1,
  max: 1000,
  unit: 'GB',
  helpText: `Storage size in GB (default: ${defaultValue}GB)`,
  validation: {
    min: { value: 1, message: 'Must be at least 1GB' },
    max: { value: 1000, message: 'Cannot exceed 1000GB' }
  }
});

/**
 * Creates instance name field
 */
const createInstanceNameField = (defaultName: string): FormFieldSchema => ({
  name: 'name',
  label: 'Instance Name',
  type: 'text',
  required: true,
  defaultValue: defaultName,
  placeholder: defaultName,
  helpText: 'Unique name for this instance',
  validation: {
    required: VALIDATION_MESSAGES.REQUIRED,
    pattern: { value: LOWERCASE_ALPHANUMERIC, message: VALIDATION_MESSAGES.LOWERCASE_ALPHANUMERIC }
  }
});

/**
 * Creates instance description field
 */
const createInstanceDescriptionField = (defaultDescription: string): FormFieldSchema => ({
  name: 'description',
  label: 'Description',
  type: 'text',
  required: false,
  defaultValue: defaultDescription,
  placeholder: defaultDescription,
  helpText: 'Optional description for this instance'
});

// ============================================================================
// Component Schemas
// ============================================================================

/**
 * Watson Studio (ws) Schema
 */
export const WS_SCHEMA: ComponentConfigSchema = {
  componentName: 'ws',
  displayName: 'Watson Studio',
  sections: [
    {
      id: 'basic',
      title: 'Basic Configuration',
      description: 'Core Watson Studio settings',
      fields: [
        {
          name: 'state',
          label: 'State',
          type: 'select',
          required: true,
          defaultValue: 'installed',
          options: [
            { value: 'installed', label: 'Installed' },
            { value: 'removed', label: 'Removed' }
          ],
          helpText: 'Installation state of the component'
        }
      ]
    }
  ],
  supportsInstances: false,
  supportsModels: false
};

/**
 * Watson Machine Learning (wml) Schema
 */
export const WML_SCHEMA: ComponentConfigSchema = {
  componentName: 'wml',
  displayName: 'Watson Machine Learning',
  sections: [
    {
      id: 'basic',
      title: 'Basic Configuration',
      description: 'Watson Machine Learning deployment settings',
      fields: [
        createSizeField(false),
        {
          name: 'state',
          label: 'State',
          type: 'select',
          required: true,
          defaultValue: 'installed',
          options: [
            { value: 'installed', label: 'Installed' },
            { value: 'removed', label: 'Removed' }
          ]
        }
      ]
    }
  ],
  supportsInstances: false,
  supportsModels: false
};

/**
 * Analytics Engine (analyticsengine) Schema
 */
export const ANALYTICS_ENGINE_SCHEMA: ComponentConfigSchema = {
  componentName: 'analyticsengine',
  displayName: 'Analytics Engine Powered by Apache Spark',
  sections: [
    {
      id: 'basic',
      title: 'Basic Configuration',
      fields: [
        createSizeField(false),
        {
          name: 'state',
          label: 'State',
          type: 'select',
          required: true,
          defaultValue: 'installed',
          options: [
            { value: 'installed', label: 'Installed' },
            { value: 'removed', label: 'Removed' }
          ]
        }
      ]
    },
    {
      id: 'advanced',
      title: 'Advanced Options',
      description: 'Spark configuration and resource limits',
      collapsible: true,
      defaultCollapsed: true,
      fields: [
        {
          name: 'sparkAdvEnabled',
          label: 'Enable Spark Advanced Features',
          type: 'boolean',
          required: false,
          defaultValue: true,
          helpText: 'Enable advanced Spark features'
        },
        {
          name: 'jobAutoDeleteEnabled',
          label: 'Auto-delete Jobs',
          type: 'boolean',
          required: false,
          defaultValue: true,
          helpText: 'Automatically delete completed jobs'
        },
        {
          name: 'kernelCullTime',
          label: 'Kernel Cull Time',
          type: 'number',
          required: false,
          defaultValue: 30,
          min: 1,
          max: 120,
          unit: 'minutes',
          helpText: 'Time before idle kernels are culled'
        },
        {
          name: 'maxDriverCpuCores',
          label: 'Max Driver CPU Cores',
          type: 'number',
          required: false,
          defaultValue: 5,
          min: 1,
          max: 32
        },
        {
          name: 'maxExecutorCpuCores',
          label: 'Max Executor CPU Cores',
          type: 'number',
          required: false,
          defaultValue: 5,
          min: 1,
          max: 32
        },
        {
          name: 'maxNumWorkers',
          label: 'Max Number of Workers',
          type: 'number',
          required: false,
          defaultValue: 50,
          min: 1,
          max: 100
        }
      ]
    }
  ],
  supportsInstances: false,
  supportsModels: false
};

/**
 * Db2 OLTP (db2) Schema
 */
export const DB2_SCHEMA: ComponentConfigSchema = {
  componentName: 'db2',
  displayName: 'Db2 OLTP',
  sections: [
    {
      id: 'basic',
      title: 'Basic Configuration',
      fields: [
        createSizeField(false),
        {
          name: 'state',
          label: 'State',
          type: 'select',
          required: true,
          defaultValue: 'installed',
          options: [
            { value: 'installed', label: 'Installed' },
            { value: 'removed', label: 'Removed' }
          ]
        }
      ]
    }
  ],
  supportsInstances: true,
  instanceSchema: {
    sections: [
      {
        id: 'instance-basic',
        title: 'Instance Configuration',
        fields: [
          createInstanceNameField('db2-instance'),
          createInstanceDescriptionField('Db2 OLTP instance'),
          createStorageSizeField('metadata_size_gb', 'Metadata Storage', 20),
          createStorageSizeField('data_size_gb', 'Data Storage', 20),
          createStorageSizeField('backup_size_gb', 'Backup Storage', 20),
          createStorageSizeField('transactionlog_size_gb', 'Transaction Log Storage', 20)
        ]
      }
    ]
  },
  supportsModels: false
};

/**
 * Cognos Analytics (ca) Schema
 */
export const CA_SCHEMA: ComponentConfigSchema = {
  componentName: 'ca',
  displayName: 'Cognos Analytics',
  sections: [
    {
      id: 'basic',
      title: 'Basic Configuration',
      fields: [
        createSizeField(false),
        {
          name: 'state',
          label: 'State',
          type: 'select',
          required: true,
          defaultValue: 'installed',
          options: [
            { value: 'installed', label: 'Installed' },
            { value: 'removed', label: 'Removed' }
          ]
        }
      ]
    }
  ],
  supportsInstances: true,
  instanceSchema: {
    sections: [
      {
        id: 'instance-basic',
        title: 'Instance Configuration',
        fields: [
          createInstanceNameField('ca-instance'),
          {
            name: 'metastore_ref',
            label: 'Metastore Reference',
            type: 'text',
            required: true,
            defaultValue: 'ca-metastore',
            helpText: 'Reference to the Db2 metastore instance',
            validation: {
              required: VALIDATION_MESSAGES.REQUIRED,
              pattern: { value: LOWERCASE_ALPHANUMERIC, message: VALIDATION_MESSAGES.LOWERCASE_ALPHANUMERIC }
            }
          }
        ]
      }
    ]
  },
  supportsModels: false
};

/**
 * DataStage Enterprise (datastage-ent) Schema
 */
export const DATASTAGE_ENT_SCHEMA: ComponentConfigSchema = {
  componentName: 'datastage-ent',
  displayName: 'DataStage Enterprise',
  sections: [
    {
      id: 'basic',
      title: 'Basic Configuration',
      fields: [
        {
          name: 'state',
          label: 'State',
          type: 'select',
          required: true,
          defaultValue: 'installed',
          options: [
            { value: 'installed', label: 'Installed' },
            { value: 'removed', label: 'Removed' }
          ]
        }
      ]
    }
  ],
  supportsInstances: false,
  supportsModels: false
};

/**
 * DataStage Enterprise Plus (datastage-ent-plus) Schema
 */
export const DATASTAGE_ENT_PLUS_SCHEMA: ComponentConfigSchema = {
  componentName: 'datastage-ent-plus',
  displayName: 'DataStage Enterprise Plus',
  sections: [
    {
      id: 'basic',
      title: 'Basic Configuration',
      fields: [
        {
          name: 'state',
          label: 'State',
          type: 'select',
          required: true,
          defaultValue: 'installed',
          options: [
            { value: 'installed', label: 'Installed' },
            { value: 'removed', label: 'Removed' }
          ]
        }
      ]
    }
  ],
  supportsInstances: true,
  instanceSchema: {
    sections: [
      {
        id: 'instance-basic',
        title: 'Instance Configuration',
        fields: [
          createInstanceNameField('ds-instance'),
          createInstanceDescriptionField('DataStage instance'),
          createSizeField(false),
          createStorageClassField(false),
          createStorageSizeField('storage_size_gb', 'Storage Size', 60)
        ]
      }
    ]
  },
  supportsModels: false
};

/**
 * Data Virtualization (dv) Schema
 */
export const DV_SCHEMA: ComponentConfigSchema = {
  componentName: 'dv',
  displayName: 'Data Virtualization',
  sections: [
    {
      id: 'basic',
      title: 'Basic Configuration',
      fields: [
        createSizeField(false),
        {
          name: 'state',
          label: 'State',
          type: 'select',
          required: true,
          defaultValue: 'installed',
          options: [
            { value: 'installed', label: 'Installed' },
            { value: 'removed', label: 'Removed' }
          ]
        }
      ]
    }
  ],
  supportsInstances: true,
  instanceSchema: {
    sections: [
      {
        id: 'instance-basic',
        title: 'Instance Configuration',
        fields: [
          createInstanceNameField('data-virtualization')
        ]
      }
    ]
  },
  supportsModels: false
};

/**
 * Watson Assistant (watson-assistant) Schema
 */
export const WATSON_ASSISTANT_SCHEMA: ComponentConfigSchema = {
  componentName: 'watson-assistant',
  displayName: 'Watson Assistant',
  sections: [
    {
      id: 'basic',
      title: 'Basic Configuration',
      fields: [
        createSizeField(false),
        {
          name: 'state',
          label: 'State',
          type: 'select',
          required: true,
          defaultValue: 'installed',
          options: [
            { value: 'installed', label: 'Installed' },
            { value: 'removed', label: 'Removed' }
          ]
        }
      ]
    },
    {
      id: 'advanced',
      title: 'Installation Options',
      collapsible: true,
      defaultCollapsed: true,
      fields: [
        {
          name: 'size',
          label: 'Deployment Size',
          type: 'select',
          required: false,
          defaultValue: 'Production',
          options: [
            { value: 'Development', label: 'Development' },
            { value: 'Production', label: 'Production' }
          ]
        },
        {
          name: 'analytics',
          label: 'Enable Analytics',
          type: 'boolean',
          required: false,
          defaultValue: true
        },
        {
          name: 'watsonxAiType',
          label: 'WatsonX AI Type',
          type: 'select',
          required: false,
          defaultValue: 'embedded',
          options: [
            { value: 'embedded', label: 'Embedded' },
            { value: 'external', label: 'External' }
          ]
        }
      ]
    }
  ],
  supportsInstances: true,
  instanceSchema: {
    sections: [
      {
        id: 'instance-basic',
        title: 'Instance Configuration',
        fields: [
          createInstanceNameField('wa-instance'),
          createInstanceDescriptionField('Watson Assistant instance')
        ]
      }
    ]
  },
  supportsModels: false
};

/**
 * Watson Discovery (watson-discovery) Schema
 */
export const WATSON_DISCOVERY_SCHEMA: ComponentConfigSchema = {
  componentName: 'watson-discovery',
  displayName: 'Watson Discovery',
  sections: [
    {
      id: 'basic',
      title: 'Basic Configuration',
      fields: [
        {
          name: 'state',
          label: 'State',
          type: 'select',
          required: true,
          defaultValue: 'installed',
          options: [
            { value: 'installed', label: 'Installed' },
            { value: 'removed', label: 'Removed' }
          ]
        }
      ]
    },
    {
      id: 'advanced',
      title: 'Installation Options',
      collapsible: true,
      defaultCollapsed: true,
      fields: [
        {
          name: 'discovery_deployment_type',
          label: 'Deployment Type',
          type: 'select',
          required: false,
          defaultValue: 'Production',
          options: [
            { value: 'Development', label: 'Development' },
            { value: 'Production', label: 'Production' }
          ]
        }
      ]
    }
  ],
  supportsInstances: true,
  instanceSchema: {
    sections: [
      {
        id: 'instance-basic',
        title: 'Instance Configuration',
        fields: [
          createInstanceNameField('wd-instance'),
          createInstanceDescriptionField('Watson Discovery instance')
        ]
      }
    ]
  },
  supportsModels: false
};

/**
 * Watson OpenScale (watson-openscale) Schema
 */
export const WATSON_OPENSCALE_SCHEMA: ComponentConfigSchema = {
  componentName: 'watson-openscale',
  displayName: 'Watson OpenScale',
  sections: [
    {
      id: 'basic',
      title: 'Basic Configuration',
      fields: [
        createSizeField(false),
        {
          name: 'state',
          label: 'State',
          type: 'select',
          required: true,
          defaultValue: 'installed',
          options: [
            { value: 'installed', label: 'Installed' },
            { value: 'removed', label: 'Removed' }
          ]
        }
      ]
    }
  ],
  supportsInstances: false,
  supportsModels: false
};

/**
 * watsonx.ai Schema
 */
export const WATSONX_AI_SCHEMA: ComponentConfigSchema = {
  componentName: 'watsonx_ai',
  displayName: 'watsonx.ai',
  sections: [
    {
      id: 'basic',
      title: 'Basic Configuration',
      fields: [
        {
          name: 'state',
          label: 'State',
          type: 'select',
          required: true,
          defaultValue: 'installed',
          options: [
            { value: 'installed', label: 'Installed' },
            { value: 'removed', label: 'Removed' }
          ]
        }
      ]
    },
    {
      id: 'advanced',
      title: 'Installation Options',
      collapsible: true,
      defaultCollapsed: true,
      fields: [
        {
          name: 'tuning_disabled',
          label: 'Disable Tuning',
          type: 'boolean',
          required: false,
          defaultValue: true,
          helpText: 'Disable model tuning capabilities'
        },
        {
          name: 'liteInstall',
          label: 'Lite Install',
          type: 'boolean',
          required: false,
          defaultValue: false,
          helpText: 'Install minimal components only'
        }
      ]
    }
  ],
  supportsInstances: false,
  supportsModels: true,
  modelSchema: {
    sections: [
      {
        id: 'model-basic',
        title: 'Model Configuration',
        fields: [
          {
            name: 'model_id',
            label: 'Model ID',
            type: 'text',
            required: true,
            placeholder: 'e.g., granite-3-8b-instruct',
            helpText: 'Unique identifier for the foundation model',
            validation: {
              required: VALIDATION_MESSAGES.REQUIRED,
              pattern: { value: ALPHANUMERIC_HYPHEN, message: VALIDATION_MESSAGES.ALPHANUMERIC_HYPHEN }
            }
          },
          {
            name: 'state',
            label: 'State',
            type: 'select',
            required: true,
            defaultValue: 'installed',
            options: [
              { value: 'installed', label: 'Installed' },
              { value: 'removed', label: 'Removed' }
            ]
          }
        ]
      }
    ]
  }
};

/**
 * IBM Knowledge Catalog (wkc) Schema
 */
export const WKC_SCHEMA: ComponentConfigSchema = {
  componentName: 'wkc',
  displayName: 'IBM Knowledge Catalog',
  sections: [
    {
      id: 'basic',
      title: 'Basic Configuration',
      fields: [
        createSizeField(false),
        {
          name: 'state',
          label: 'State',
          type: 'select',
          required: true,
          defaultValue: 'installed',
          options: [
            { value: 'installed', label: 'Installed' },
            { value: 'removed', label: 'Removed' }
          ]
        }
      ]
    },
    {
      id: 'features',
      title: 'Feature Configuration',
      collapsible: true,
      defaultCollapsed: true,
      fields: [
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
        },
        {
          name: 'useFDB',
          label: 'Use FoundationDB',
          type: 'boolean',
          required: false,
          defaultValue: false
        }
      ]
    }
  ],
  supportsInstances: false,
  supportsModels: false
};

/**
 * Planning Analytics (planning-analytics) Schema
 */
export const PLANNING_ANALYTICS_SCHEMA: ComponentConfigSchema = {
  componentName: 'planning-analytics',
  displayName: 'Planning Analytics',
  sections: [
    {
      id: 'basic',
      title: 'Basic Configuration',
      fields: [
        {
          name: 'state',
          label: 'State',
          type: 'select',
          required: true,
          defaultValue: 'installed',
          options: [
            { value: 'installed', label: 'Installed' },
            { value: 'removed', label: 'Removed' }
          ]
        }
      ]
    }
  ],
  supportsInstances: true,
  instanceSchema: {
    sections: [
      {
        id: 'instance-basic',
        title: 'Instance Configuration',
        fields: [
          createInstanceNameField('pa-instance'),
          createSizeField(false),
          createStorageSizeField('mysql_size_gb', 'MySQL Storage', 20),
          createStorageSizeField('couchdb_size_gb', 'CouchDB Storage', 20),
          createStorageSizeField('mongo_size_gb', 'MongoDB Storage', 20),
          createStorageSizeField('redis_size_gb', 'Redis Storage', 20)
        ]
      }
    ]
  },
  supportsModels: false
};

/**
 * OpenPages (openpages) Schema
 */
export const OPENPAGES_SCHEMA: ComponentConfigSchema = {
  componentName: 'openpages',
  displayName: 'OpenPages',
  sections: [
    {
      id: 'basic',
      title: 'Basic Configuration',
      fields: [
        {
          name: 'state',
          label: 'State',
          type: 'select',
          required: true,
          defaultValue: 'installed',
          options: [
            { value: 'installed', label: 'Installed' },
            { value: 'removed', label: 'Removed' }
          ]
        }
      ]
    }
  ],
  supportsInstances: false,
  supportsModels: false
};

/**
 * SPSS Modeler (spss) Schema
 */
export const SPSS_SCHEMA: ComponentConfigSchema = {
  componentName: 'spss',
  displayName: 'SPSS Modeler',
  sections: [
    {
      id: 'basic',
      title: 'Basic Configuration',
      fields: [
        {
          name: 'state',
          label: 'State',
          type: 'select',
          required: true,
          defaultValue: 'installed',
          options: [
            { value: 'installed', label: 'Installed' },
            { value: 'removed', label: 'Removed' }
          ]
        }
      ]
    }
  ],
  supportsInstances: false,
  supportsModels: false
};

/**
 * Decision Optimization (dods) Schema
 */
export const DODS_SCHEMA: ComponentConfigSchema = {
  componentName: 'dods',
  displayName: 'Decision Optimization',
  sections: [
    {
      id: 'basic',
      title: 'Basic Configuration',
      fields: [
        createSizeField(false),
        {
          name: 'state',
          label: 'State',
          type: 'select',
          required: true,
          defaultValue: 'installed',
          options: [
            { value: 'installed', label: 'Installed' },
            { value: 'removed', label: 'Removed' }
          ]
        }
      ]
    }
  ],
  supportsInstances: false,
  supportsModels: false
};

/**
 * Watson Speech (watson-speech) Schema
 * Supports Speech-to-Text (STT) and Text-to-Speech (TTS)
 */
export const WATSON_SPEECH_SCHEMA: ComponentConfigSchema = {
  componentName: 'watson-speech',
  displayName: 'Watson Speech (STT and TTS)',
  sections: [
    {
      id: 'basic',
      title: 'Basic Configuration',
      fields: [
        {
          name: 'stt_size',
          label: 'Speech-to-Text Size',
          type: 'select',
          required: false,
          defaultValue: 'xsmall',
          options: [
            { value: 'xsmall', label: 'X-Small' },
            { value: 'small', label: 'Small' },
            { value: 'medium', label: 'Medium' },
            { value: 'large', label: 'Large' }
          ],
          helpText: 'Size for Speech-to-Text service'
        },
        {
          name: 'tts_size',
          label: 'Text-to-Speech Size',
          type: 'select',
          required: false,
          defaultValue: 'xsmall',
          options: [
            { value: 'xsmall', label: 'X-Small' },
            { value: 'small', label: 'Small' },
            { value: 'medium', label: 'Medium' },
            { value: 'large', label: 'Large' }
          ],
          helpText: 'Size for Text-to-Speech service'
        },
        {
          name: 'state',
          label: 'State',
          type: 'select',
          required: true,
          defaultValue: 'installed',
          options: [
            { value: 'installed', label: 'Installed' },
            { value: 'removed', label: 'Removed' }
          ]
        }
      ]
    },
    {
      id: 'installation_options',
      title: 'Installation Options',
      description: 'Advanced configuration for Watson Speech services',
      collapsible: true,
      defaultCollapsed: true,
      fields: [
        {
          name: 'tags.sttRuntime',
          label: 'STT Runtime',
          type: 'boolean',
          required: false,
          defaultValue: true,
          helpText: 'Enable Speech-to-Text runtime'
        },
        {
          name: 'tags.sttAsync',
          label: 'STT Async',
          type: 'boolean',
          required: false,
          defaultValue: false,
          helpText: 'Enable asynchronous Speech-to-Text'
        },
        {
          name: 'tags.sttCustomization',
          label: 'STT Customization',
          type: 'boolean',
          required: false,
          defaultValue: false,
          helpText: 'Enable Speech-to-Text customization'
        },
        {
          name: 'tags.ttsRuntime',
          label: 'TTS Runtime',
          type: 'boolean',
          required: false,
          defaultValue: true,
          helpText: 'Enable Text-to-Speech runtime'
        },
        {
          name: 'tags.ttsCustomization',
          label: 'TTS Customization',
          type: 'boolean',
          required: false,
          defaultValue: false,
          helpText: 'Enable Text-to-Speech customization'
        },
        {
          name: 'scaleConfig.stt.size',
          label: 'STT Scale Config Size',
          type: 'select',
          required: false,
          defaultValue: 'xsmall',
          options: [
            { value: 'xsmall', label: 'X-Small' },
            { value: 'small', label: 'Small' },
            { value: 'medium', label: 'Medium' },
            { value: 'large', label: 'Large' }
          ],
          helpText: 'Scale configuration for STT'
        },
        {
          name: 'scaleConfig.tts.size',
          label: 'TTS Scale Config Size',
          type: 'select',
          required: false,
          defaultValue: 'xsmall',
          options: [
            { value: 'xsmall', label: 'X-Small' },
            { value: 'small', label: 'Small' },
            { value: 'medium', label: 'Medium' },
            { value: 'large', label: 'Large' }
          ],
          helpText: 'Scale configuration for TTS'
        },
        {
          name: 'sttModels',
          label: 'STT Models',
          type: 'array',
          required: false,
          defaultValue: ['enUsBroadbandModel', 'enUsNarrowbandModel'],
          helpText: 'Speech-to-Text models to install',
          arrayItemType: 'select',
          options: [
            { value: 'enUsBroadbandModel', label: 'US English Broadband' },
            { value: 'enUsNarrowbandModel', label: 'US English Narrowband' },
            { value: 'enUsShortFormNarrowbandModel', label: 'US English Short Form' },
            { value: 'enUsTelephony', label: 'US English Telephony' },
            { value: 'enUsMultimedia', label: 'US English Multimedia' }
          ]
        },
        {
          name: 'ttsVoices',
          label: 'TTS Voices',
          type: 'array',
          required: false,
          defaultValue: ['enUSAllisonV3Voice', 'enUSLisaV3Voice'],
          helpText: 'Text-to-Speech voices to install',
          arrayItemType: 'select',
          options: [
            { value: 'enUSAllisonV3Voice', label: 'Allison (US English)' },
            { value: 'enUSLisaV3Voice', label: 'Lisa (US English)' },
            { value: 'enUSMichaelV3Voice', label: 'Michael (US English)' }
          ]
        }
      ]
    }
  ],
  supportsInstances: false,
  supportsModels: false
};

// ============================================================================
// Schema Registry
// ============================================================================

/**
 * Central registry of all component schemas
 * Maps component names to their configuration schemas
 */
export const COMPONENT_SCHEMAS: Record<string, ComponentConfigSchema> = {
  // Core Components
  'ws': WS_SCHEMA,
  'wml': WML_SCHEMA,
  'analyticsengine': ANALYTICS_ENGINE_SCHEMA,
  'db2': DB2_SCHEMA,
  'ca': CA_SCHEMA,
  'datastage-ent': DATASTAGE_ENT_SCHEMA,
  'datastage-ent-plus': DATASTAGE_ENT_PLUS_SCHEMA,
  'dv': DV_SCHEMA,
  'watson-assistant': WATSON_ASSISTANT_SCHEMA,
  'watson-discovery': WATSON_DISCOVERY_SCHEMA,
  'watson-openscale': WATSON_OPENSCALE_SCHEMA,
  'watson-speech': WATSON_SPEECH_SCHEMA, // ← Fixed: was 'watson-speech-services'
  'watsonx_ai': WATSONX_AI_SCHEMA,
  'wkc': WKC_SCHEMA,
  'planning-analytics': PLANNING_ANALYTICS_SCHEMA,
  'openpages': OPENPAGES_SCHEMA,
  'spss': SPSS_SCHEMA,
  'dods': DODS_SCHEMA,
  
  // Additional components can be added here
  // For components without specific schemas, a default schema will be used
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get the configuration schema for a component
 * Returns a default schema if no specific schema is defined
 */
export const getComponentSchema = (componentName: string): ComponentConfigSchema => {
  return COMPONENT_SCHEMAS[componentName] || createDefaultSchema(componentName);
};

/**
 * Check if a component has a specific schema defined
 */
export const hasComponentSchema = (componentName: string): boolean => {
  return componentName in COMPONENT_SCHEMAS;
};

/**
 * Create a default schema for components without specific schemas
 */
const createDefaultSchema = (componentName: string): ComponentConfigSchema => ({
  componentName,
  displayName: componentName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
  sections: [
    {
      id: 'basic',
      title: 'Basic Configuration',
      fields: [
        {
          name: 'state',
          label: 'State',
          type: 'select',
          required: true,
          defaultValue: 'installed',
          options: [
            { value: 'installed', label: 'Installed' },
            { value: 'removed', label: 'Removed' }
          ],
          helpText: 'Installation state of the component'
        }
      ]
    }
  ],
  supportsInstances: false,
  supportsModels: false
});

/**
 * Get default configuration values for a component
 */
export const getDefaultComponentConfig = (componentName: string): Record<string, any> => {
  const schema = getComponentSchema(componentName);
  const config: Record<string, any> = {};
  
  schema.sections.forEach(section => {
    section.fields.forEach(field => {
      if (field.defaultValue !== undefined) {
        config[field.name] = field.defaultValue;
      }
    });
  });
  
  return config;
};

/**
 * Validate a field value against its schema
 */
export const validateField = (
  field: FormFieldSchema,
  value: any
): { valid: boolean; error?: string } => {
  // Required validation
  if (field.required && (value === undefined || value === null || value === '')) {
    return { valid: false, error: field.validation?.required || VALIDATION_MESSAGES.REQUIRED };
  }
  
  // Pattern validation
  if (field.validation?.pattern && typeof value === 'string') {
    if (!field.validation.pattern.value.test(value)) {
      return { valid: false, error: field.validation.pattern.message };
    }
  }
  
  // Min/Max validation for numbers
  if (field.type === 'number' && typeof value === 'number') {
    if (field.validation?.min && value < field.validation.min.value) {
      return { valid: false, error: field.validation.min.message };
    }
    if (field.validation?.max && value > field.validation.max.value) {
      return { valid: false, error: field.validation.max.message };
    }
  }
  
  return { valid: true };
};

// Made with Bob
