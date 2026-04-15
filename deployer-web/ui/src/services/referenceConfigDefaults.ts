/**
 * Reference Configuration Defaults
 * 
 * Extracts default configuration values from reference-config.yaml
 * to use as defaults when users select components.
 * 
 * This ensures that all predefined configurations from the reference
 * are preserved as defaults in the UI.
 */

/**
 * Default configurations extracted from reference-config.yaml
 * Organized by component originalName
 */
export const REFERENCE_CONFIG_DEFAULTS: Record<string, any> = {
  // Analytics Engine
  analyticsengine: {
    size: 'small',
    installation_options: {
      sparkAdvEnabled: true,
      jobAutoDeleteEnabled: true,
      kernelCullTime: 30,
      imagePullParallelism: '40',
      imagePullCompletions: '20',
      kernelCleanupSchedule: '*/30 * * * *',
      jobCleanupSchedule: '*/30 * * * *',
      skipSelinuxRelabeling: false,
      mountCustomizationsFromCchome: false,
      maxDriverCpuCores: 5,
      maxExecutorCpuCores: 5,
      maxDriveMemory: '50g',
      maxExecutorMemory: '50g',
      maxNumWorkers: 50,
      localDirScaleFactor: 10
    }
  },

  // Cognos Analytics
  ca: {
    size: 'small',
    instances: [
      {
        name: 'ca-instance',
        metastore_ref: 'ca-metastore'
      }
    ]
  },

  // Db2 OLTP
  db2: {
    size: 'small',
    instances: [
      {
        name: 'ca-metastore',
        metadata_size_gb: 20,
        data_size_gb: 20,
        backup_size_gb: 20,
        transactionlog_size_gb: 20
      }
    ]
  },

  // Db2 Data Management Console
  dmc: {
    instances: [
      {
        name: 'data-management-console',
        description: 'Data Management Console',
        size: 'medium',
        storage_size_gb: 50
      }
    ]
  },

  // Decision Optimization
  dods: {
    size: 'small'
  },

  // Data Privacy
  dp: {
    size: 'small'
  },

  // Data Virtualization
  dv: {
    size: 'small',
    instances: [
      {
        name: 'data-virtualization'
      }
    ]
  },

  // EDB Postgres
  edb_cp4d: {
    instances: [
      {
        name: 'instance1',
        version: '15.4'
      }
    ]
  },

  // AI Factsheets
  factsheet: {
    size: 'small'
  },

  // Execution Engine for Apache Hadoop
  hee: {
    size: 'small'
  },

  // IBM Knowledge Catalog
  wkc: {
    size: 'small',
    installation_options: {
      enableKnowledgeGraph: false,
      enableDataQuality: false,
      useFDB: false
    }
  },

  // IBM Knowledge Catalog - Premium
  ikc_premium: {
    size: 'small',
    installation_options: {
      enableDataQuality: false,
      enableKnowledgeGraph: false,
      useFDB: false,
      enableAISearch: false,
      enableSemanticAutomation: false,
      enableSemanticEnrichment: true,
      enableSemanticEmbedding: false,
      enableTextToSql: false,
      enableModelsOn: 'cpu',
      customModelTextToSQL: 'granite-3-3-8b-instruct'
    }
  },

  // IBM Knowledge Catalog - Standard
  ikc_standard: {
    size: 'small',
    installation_options: {
      enableKnowledgeGraph: false,
      useFDB: false,
      enableAISearch: false,
      enableSemanticAutomation: false,
      enableSemanticEnrichment: true,
      enableSemanticEmbedding: false,
      enableTextToSql: false,
      enableModelsOn: 'cpu',
      customModelTextToSQL: 'granite-3-3-8b-instruct'
    }
  },

  // MANTA Automated Lineage
  mantaflow: {
    size: 'small'
  },

  // IBM Match 360
  match360: {
    installation_options: {
      scaleConfig: 'x-small',
      onboard_timeout: 300,
      ccs_http_timeout: 2000
    }
  },

  // Planning Analytics
  'planning-analytics': {
    instances: [
      {
        name: 'pa-instance',
        size: 'small',
        mysql_size_gb: 20,
        couchdb_size_gb: 20,
        mongo_size_gb: 20,
        redis_size_gb: 20
      }
    ]
  },

  // Product Master
  productmaster: {
    size: 'small'
  },

  // Data Replication
  replication: {
    size: 'small',
    installation_options: {
      replication_license_type: 'IDRC'
    }
  },

  // RStudio Server
  rstudio: {
    size: 'small'
  },

  // Voice Gateway
  'voice-gateway': {
    replicas: 1
  },

  // Watson Assistant
  'watson-assistant': {
    size: 'small',
    installation_options: {
      size: 'Production',
      bigpv: false,
      analytics: true,
      watsonxAiType: 'embedded',
      syomModels: [],
      ootbModels: []
    }
  },

  // Watson Discovery
  'watson-discovery': {
    instances: [
      {
        name: 'wd-instance',
        description: 'Watson Discovery instance'
      }
    ],
    installation_options: {
      discovery_deployment_type: 'Production'
    }
  },

  // Watson OpenScale
  'watson-openscale': {
    size: 'small'
  },

  // Watson Speech
  'watson-speech': {
    stt_size: 'xsmall',
    tts_size: 'xsmall',
    installation_options: {
      tags: {
        sttRuntime: true,
        sttAsync: false,
        sttCustomization: false,
        ttsRuntime: true,
        ttsCustomization: false
      },
      scaleConfig: {
        stt: {
          size: 'xsmall'
        },
        tts: {
          size: 'xsmall'
        }
      },
      sttModels: [
        'enUsBroadbandModel',
        'enUsNarrowbandModel',
        'enUsShortFormNarrowbandModel',
        'enUsTelephony',
        'enUsMultimedia'
      ],
      ttsVoices: [
        'enUSAllisonV3Voice',
        'enUSLisaV3Voice',
        'enUSMichaelV3Voice'
      ]
    }
  },

  // watsonx.ai
  watsonx_ai: {
    installation_options: {
      tuning_disabled: true,
      liteInstall: false
    },
    models: [] // Models are added separately with state: removed by default
  },

  // watsonx.data
  watsonx_data: {
    installation_options: {
      enable_lite_milvus: false,
      scaleConfig: 'small'
    }
  },

  // watsonx.data integration
  watsonx_dataintegration: {
    installation_options: {
      enableBatchBulkETL: true,
      enableRealtimeStreaming: true,
      enableDataObservability: true,
      enableUnstructuredDataIntegration: true,
      enableReplication: true
    }
  },

  // watsonx.data intelligence
  watsonx_dataintelligence: {
    installation_options: {
      enableAISearch: false,
      enableContentLinkingForTextToSql: false,
      enableDataGovernanceCatalog: true,
      enableDataLineage: true,
      enableDataProduct: true,
      enableDataQuality: false,
      enableGenerativeAICapabilities: true,
      enableKnowledgeGraph: true,
      enableModelsOn: 'cpu',
      enableSemanticEmbedding: false,
      enableSemanticEnrichment: true,
      enableTextToSql: false
    }
  },

  // watsonx.data Premium
  watsonx_data_premium: {
    installation_options: {
      wxd_premium_enable_models_on: 'gpu',
      licenseType: 'premium'
    }
  },

  // watsonx.governance
  watsonx_governance: {
    installation_options: {
      installType: 'all',
      enableFactsheet: true,
      enableOpenpages: true,
      enableOpenscale: true
    }
  },

  // watsonx Orchestrate
  watsonx_orchestrate: {
    instances: [
      {
        name: 'wxo-instance',
        description: 'watsonx Orchestrate instance'
      }
    ],
    installation_options: {
      installMode: 'agentic',
      watsonxAI: {
        watsonxaiifm: true,
        syomModels: [],
        ootbModels: []
      }
    }
  },

  // watsonx Code Assistant
  wca: {
    installation_options: {
      similarity_feature: {
        enabled: false
      },
      rag_enabled: {
        enabled: true
      }
    }
  },

  // Watson Machine Learning
  wml: {
    size: 'small'
  },

  // Watson Machine Learning Accelerator
  'wml-accelerator': {
    replicas: 1,
    size: 'small'
  },

  // Watson Studio Pipelines
  'ws-pipelines': {
    installation_options: {
      rbsimage: 'rbs-ext'
    }
  },

  // Watson Studio Runtimes
  'ws-runtimes': {
    installation_options: {
      kinds: [
        'ibm-cpd-ws-runtime-241-pygpu',
        'ibm-cpd-ws-runtime-251-pyggu',
        'ibm-cpd-ws-runtime-241-r',
        'ibm-cpd-ws-runtime-251-r'
      ]
    }
  },

  // DataStage Enterprise
  'datastage-ent': {},

  // DataStage Enterprise Plus
  'datastage-ent-plus': {},

  // Data Lineage
  datalineage: {
    size: 'small'
  },

  // SPSS Modeler
  spss: {},

  // Simple components (state only)
  bigsql: {},
  dashboard: {},
  datagate: {},
  dataproduct: {},
  db2wh: {},
  dpra: {},
  mongodb: {},
  openpages: {},
  streamsets: {},
  syntheticdata: {},
  udp: {},
  'wca-ansible': {},
  'wca-z': {},
  'wca-z-ce': {},
  ws: {}
};

/**
 * Get default configuration for a component
 * @param originalName Component's originalName (backend name)
 * @returns Default configuration object or empty object if not found
 */
export function getComponentDefaults(originalName: string): Record<string, any> {
  return REFERENCE_CONFIG_DEFAULTS[originalName] || {};
}

/**
 * Merge user configuration with defaults
 * User values take precedence over defaults
 */
export function mergeWithDefaults(
  originalName: string,
  userConfig: Record<string, any>
): Record<string, any> {
  const defaults = getComponentDefaults(originalName);
  
  // Deep merge: user config overrides defaults
  return {
    ...defaults,
    ...userConfig,
    // Handle nested objects specially
    installation_options: {
      ...defaults.installation_options,
      ...userConfig.installation_options
    },
    instances: userConfig.instances || defaults.instances,
    // For models: only use user-selected models, don't merge with defaults
    // (defaults have all models as "removed", we only want user's selections)
    models: userConfig.models && userConfig.models.length > 0 ? userConfig.models : undefined
  };
}

// Made with Bob