# Phase 2.19: Component Schema Enhancement Plan

## Overview
Systematically enhance all component schemas to include ALL configuration options from reference-config.yaml.

## Analysis Summary

### Components by Configuration Complexity

#### Level 1: Simple (state only)
- bigsql, dashboard, datagate, dataproduct, db2wh, dpra, mongodb, openpages, spss, streamsets, syntheticdata, udp, wca-ansible, wca-z, wca-z-ce

#### Level 2: Size + State
- datalineage, factsheet, hee, mantaflow, rstudio, watson-openscale, wml, productmaster

#### Level 3: Size + Instances
- ca, dv, planning-analytics

#### Level 4: Size + installation_options
- analyticsengine, dp, replication, wkc

#### Level 5: installation_options (complex)
- match360, watson-assistant, watson-discovery, watsonx_data, watsonx_dataintegration, watsonx_dataintelligence, watsonx_data_premium, watsonx_governance, watsonx_orchestrate, wca, ikc_premium, ikc_standard, ws-pipelines, ws-runtimes

#### Level 6: Instances + installation_options
- db2, dmc, edb_cp4d

#### Level 7: Special Cases
- watson-speech (stt_size, tts_size, installation_options with tags, scaleConfig, models, voices)
- watsonx_ai (installation_options + models array with 50+ models)
- datastage-ent-plus (instances with scale options)
- voice-gateway (replicas)
- wml-accelerator (replicas + size)
- ws (no additional config)

## Configuration Fields Inventory

### Common Fields (All Components)
```yaml
name: string (originalName)
description: string
state: "installed" | "removed"
```

### Size Field
```yaml
size: "small" | "medium" | "large"
```

### Replicas Field
```yaml
replicas: number (1-10)
```

### Instances Array
```yaml
instances:
  - name: string
    description: string (optional)
    size: string (optional)
    storage_class: string (optional)
    storage_size_gb: number (optional)
    # Component-specific fields
```

### Installation Options (Component-Specific)

#### analyticsengine
```yaml
installation_options:
  sparkAdvEnabled: boolean
  jobAutoDeleteEnabled: boolean
  kernelCullTime: number
  imagePullParallelism: string
  imagePullCompletions: string
  kernelCleanupSchedule: string (cron)
  jobCleanupSchedule: string (cron)
  skipSelinuxRelabeling: boolean
  mountCustomizationsFromCchome: boolean
  maxDriverCpuCores: number
  maxExecutorCpuCores: number
  maxDriveMemory: string
  maxExecutorMemory: string
  maxNumWorkers: number
  localDirScaleFactor: number
```

#### match360
```yaml
installation_options:
  scaleConfig: "x-small" | "small" | "medium" | "large"
  onboard_timeout: number
  ccs_http_timeout: number
```

#### replication
```yaml
installation_options:
  replication_license_type: "IDRC" | other
```

#### watson-assistant
```yaml
installation_options:
  size: "Production" | "Development"
  bigpv: boolean
  analytics: boolean
  watsonxAiType: "embedded" | "external"
  syomModels: array
  ootbModels: array
```

#### watson-discovery
```yaml
installation_options:
  discovery_deployment_type: "Production" | "Development"
```

#### watson-speech
```yaml
stt_size: "xsmall" | "small" | "medium" | "large"
tts_size: "xsmall" | "small" | "medium" | "large"
installation_options:
  tags:
    sttRuntime: boolean
    sttAsync: boolean
    sttCustomization: boolean
    ttsRuntime: boolean
    ttsCustomization: boolean
  scaleConfig:
    stt:
      size: string
    tts:
      size: string
  sttModels: array of model names
  ttsVoices: array of voice names
```

#### watsonx_ai
```yaml
installation_options:
  tuning_disabled: boolean
  liteInstall: boolean
models:
  - model_id: string
    state: "installed" | "removed"
    model_install_parameters: (optional)
      shards: number
      nodeSelector:
        kubernetes.io/hostname: string
```

#### watsonx_data
```yaml
installation_options:
  enable_lite_milvus: boolean
  scaleConfig: "small" | "medium" | "large"
```

#### watsonx_dataintegration
```yaml
installation_options:
  enableBatchBulkETL: boolean
  enableRealtimeStreaming: boolean
  enableDataObservability: boolean
  enableUnstructuredDataIntegration: boolean
  enableReplication: boolean
```

#### watsonx_dataintelligence
```yaml
installation_options:
  enableAISearch: boolean
  enableContentLinkingForTextToSql: boolean
  enableDataGovernanceCatalog: boolean
  enableDataLineage: boolean
  enableDataProduct: boolean
  enableDataQuality: boolean
  enableGenerativeAICapabilities: boolean
  enableKnowledgeGraph: boolean
  enableModelsOn: "cpu" | "gpu"
  enableSemanticEmbedding: boolean
  enableSemanticEnrichment: boolean
  enableTextToSql: boolean
```

#### watsonx_data_premium
```yaml
installation_options:
  wxd_premium_enable_models_on: "cpu" | "gpu"
  licenseType: "premium" | "standard"
```

#### watsonx_governance
```yaml
installation_options:
  installType: "all" | "factsheet" | "openpages" | "openscale"
  enableFactsheet: boolean
  enableOpenpages: boolean
  enableOpenscale: boolean
```

#### watsonx_orchestrate
```yaml
instances:
  - name: string
    description: string
installation_options:
  installMode: "agentic" | "standard"
  watsonxAI:
    watsonxaiifm: boolean
    syomModels: array
    ootbModels: array
```

#### wca
```yaml
installation_options:
  similarity_feature:
    enabled: boolean
  rag_enabled:
    enabled: boolean
```

#### wkc
```yaml
installation_options:
  enableKnowledgeGraph: boolean
  enableDataQuality: boolean
  useFDB: boolean
```

#### ikc_premium / ikc_standard
```yaml
installation_options:
  enableDataQuality: boolean (premium only)
  enableKnowledgeGraph: boolean
  useFDB: boolean
  enableAISearch: boolean
  enableSemanticAutomation: boolean
  enableSemanticEnrichment: boolean
  enableSemanticEmbedding: boolean
  enableTextToSql: boolean
  enableModelsOn: "cpu" | "gpu"
  customModelTextToSQL: string
```

#### ws-pipelines
```yaml
installation_options:
  rbsimage: "rbs-ext" | other
```

#### ws-runtimes
```yaml
installation_options:
  kinds: array of runtime kinds
```

### Instance-Specific Fields

#### ca instances
```yaml
- name: string
  metastore_ref: string
```

#### db2 instances
```yaml
- name: string
  metadata_size_gb: number
  data_size_gb: number
  backup_size_gb: number
  transactionlog_size_gb: number
```

#### dmc instances
```yaml
- name: string
  description: string
  size: string
  storage_size_gb: number
```

#### dv instances
```yaml
- name: string
```

#### edb_cp4d instances
```yaml
- name: string
  version: string
  type: string (optional)
  members: number (optional)
  size_gb: number (optional)
  resource_request_cpu: string (optional)
  resource_request_memory: string (optional)
  resource_limit_cpu: string (optional)
  resource_limit_memory: string (optional)
```

#### planning-analytics instances
```yaml
- name: string
  size: string
  mysql_size_gb: number
  couchdb_size_gb: number
  mongo_size_gb: number
  redis_size_gb: number
```

#### datastage-ent-plus instances
```yaml
- name: string
  description: string
  size: string
  storage_class: string
  storage_size_gb: number
  scale_px_runtime:
    replicas: number
    cpu_request: string
    cpu_limit: number
    memory_request: string
    memory_limit: string
  scale_px_compute:
    replicas: number
    cpu_request: number
    cpu_limit: number
    memory_request: string
    memory_limit: string
```

## Implementation Strategy

### Phase 1: Update Existing Schemas (18 components with schemas)
1. analyticsengine - add all installation_options
2. ca - verify instances structure
3. db2 - verify instances structure
4. datastage-ent - add instances support
5. datastage-ent-plus - add instances with scale options
6. dods - verify size
7. dv - verify instances structure
8. planning-analytics - verify instances structure
9. spss - verify (simple)
10. watson-assistant - add all installation_options
11. watson-discovery - add all installation_options
12. watson-openscale - verify size
13. watson-speech - ALREADY COMPLETE
14. watsonx_ai - verify installation_options and models
15. wkc - add all installation_options
16. wml - verify size
17. ws - verify (simple)
18. openpages - verify (simple)

### Phase 2: Create New Schemas (37 components without schemas)
Priority order based on usage frequency:
1. watsonx_data, watsonx_governance, watsonx_orchestrate
2. ikc_premium, ikc_standard
3. watsonx_dataintegration, watsonx_dataintelligence, watsonx_data_premium
4. wca, wca-ansible, wca-z
5. ws-pipelines, ws-runtimes
6. voice-gateway, wml-accelerator
7. All remaining components

### Phase 3: Testing
1. Test each schema in UI
2. Verify config generation
3. Validate against reference-config.yaml
4. Test all field types and validations

## Success Criteria
- [ ] All 55 components have complete schemas
- [ ] All configuration fields from reference-config.yaml are available in UI
- [ ] All schemas use correct originalName as keys
- [ ] All field validations work correctly
- [ ] Generated config.yaml matches reference structure
- [ ] All tests pass

## Next Steps
1. Start with Phase 1: Update existing 18 schemas
2. Create comprehensive schemas for high-priority components
3. Test incrementally
4. Document any deviations or special cases