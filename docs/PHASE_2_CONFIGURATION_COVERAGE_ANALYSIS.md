# Phase 2: Configuration Coverage Analysis

## Executive Summary

This document analyzes the configuration coverage between the reference-config.yaml file and the UI component schemas to ensure all configuration options are available in the Configuration Page.

**Date:** April 10, 2026  
**Status:** Analysis Complete - Action Items Identified

## Current State

### Component Schemas Implemented
- **Total Schemas:** 17 specific schemas + 1 default schema
- **Coverage:** 17/63 components (27%)
- **Default Schema Fallback:** Available for remaining 46 components

### Specific Schemas Available
1. ws (Watson Studio)
2. wml (Watson Machine Learning)
3. analyticsengine (Analytics Engine)
4. db2 (Db2 OLTP)
5. ca (Cognos Analytics)
6. datastage-ent (DataStage Enterprise)
7. datastage-ent-plus (DataStage Enterprise Plus)
8. dv (Data Virtualization)
9. watson-assistant (Watson Assistant)
10. watson-discovery (Watson Discovery)
11. watson-openscale (Watson OpenScale)
12. watsonx_ai (watsonx.ai)
13. wkc (IBM Knowledge Catalog)
14. planning-analytics (Planning Analytics)
15. openpages (OpenPages)
16. spss (SPSS Modeler)
17. dods (Decision Optimization)

## Configuration Fields Analysis

### Fields from reference-config.yaml

#### Common Fields (All Components)
- ✅ `state` - Available in all schemas (installed/removed)
- ⚠️ `description` - Only in some schemas
- ⚠️ `size` - Only in some schemas (small/medium/large)

#### Component-Specific Fields

##### 1. analyticsengine (Lines 83-102)
- ✅ `size` - Implemented
- ✅ `state` - Implemented
- ✅ `installation_options` - Partially implemented
  - ✅ `sparkAdvEnabled` - Implemented
  - ✅ `jobAutoDeleteEnabled` - Implemented
  - ✅ `kernelCullTime` - Implemented
  - ❌ `imagePullParallelism` - **MISSING**
  - ❌ `imagePullCompletions` - **MISSING**
  - ❌ `kernelCleanupSchedule` - **MISSING**
  - ❌ `jobCleanupSchedule` - **MISSING**
  - ❌ `skipSelinuxRelabeling` - **MISSING**
  - ❌ `mountCustomizationsFromCchome` - **MISSING**
  - ✅ `maxDriverCpuCores` - Implemented
  - ✅ `maxExecutorCpuCores` - Implemented
  - ❌ `maxDriveMemory` - **MISSING**
  - ❌ `maxExecutorMemory` - **MISSING**
  - ✅ `maxNumWorkers` - Implemented
  - ❌ `localDirScaleFactor` - **MISSING**

##### 2. ca (Cognos Analytics) (Lines 108-114)
- ✅ `size` - Implemented
- ✅ `state` - Implemented
- ✅ `instances` - Implemented
  - ✅ `name` - Implemented
  - ✅ `metastore_ref` - Implemented

##### 3. db2 (Db2 OLTP) (Lines 161-170)
- ✅ `size` - Implemented
- ✅ `state` - Implemented
- ✅ `instances` - Implemented
  - ✅ `name` - Implemented
  - ✅ `metadata_size_gb` - Implemented
  - ✅ `data_size_gb` - Implemented
  - ✅ `backup_size_gb` - Implemented
  - ✅ `transactionlog_size_gb` - Implemented

##### 4. dmc (Db2 Data Management Console) (Lines 176-183)
- ❌ **NO SCHEMA** - Uses default
- ❌ `instances` - **MISSING**
  - ❌ `name` - **MISSING**
  - ❌ `description` - **MISSING**
  - ❌ `size` - **MISSING**
  - ❌ `storage_size_gb` - **MISSING**

##### 5. dv (Data Virtualization) (Lines 199-204)
- ✅ `size` - Implemented
- ✅ `state` - Implemented
- ✅ `instances` - Implemented
  - ✅ `name` - Implemented

##### 6. edb_cp4d (EDB Postgres) (Lines 208-220)
- ❌ **NO SCHEMA** - Uses default
- ❌ `instances` - **MISSING**
  - ❌ `name` - **MISSING**
  - ❌ `version` - **MISSING**
  - ❌ `type` - **MISSING**
  - ❌ `members` - **MISSING**
  - ❌ `size_gb` - **MISSING**
  - ❌ `resource_request_cpu` - **MISSING**
  - ❌ `resource_request_memory` - **MISSING**
  - ❌ `resource_limit_cpu` - **MISSING**
  - ❌ `resource_limit_memory` - **MISSING**

##### 7. match360 (IBM Match 360) (Lines 237-243)
- ❌ **NO SCHEMA** - Uses default
- ❌ `installation_options` - **MISSING**
  - ❌ `scaleConfig` - **MISSING**
  - ❌ `onboard_timeout` - **MISSING**
  - ❌ `ccs_http_timeout` - **MISSING**

##### 8. planning-analytics (Lines 253-262)
- ✅ Schema exists
- ✅ `instances` - Implemented
  - ✅ `name` - Implemented
  - ✅ `size` - Implemented
  - ✅ `mysql_size_gb` - Implemented
  - ✅ `couchdb_size_gb` - Implemented
  - ✅ `mongo_size_gb` - Implemented
  - ✅ `redis_size_gb` - Implemented

##### 9. replication (Data Replication) (Lines 264-269)
- ❌ **NO SCHEMA** - Uses default
- ❌ `size` - **MISSING**
- ❌ `installation_options` - **MISSING**
  - ❌ `replication_license_type` - **MISSING**

##### 10. voice-gateway (Voice Gateway) (Lines 292-295)
- ❌ **NO SCHEMA** - Uses default
- ❌ `replicas` - **MISSING**

##### 11. watson-assistant (Lines 297-313)
- ✅ Schema exists
- ✅ `size` - Implemented
- ✅ `state` - Implemented
- ⚠️ `noobaa_account_secret` - **MISSING** (commented in ref config)
- ⚠️ `noobaa_cert_secret` - **MISSING** (commented in ref config)
- ✅ `instances` - Implemented (commented in ref config)
- ✅ `installation_options` - Partially implemented
  - ✅ `size` - Implemented
  - ✅ `bigpv` - Implemented
  - ✅ `analytics` - Implemented
  - ✅ `watsonxAiType` - Implemented
  - ✅ `syomModels` - Implemented
  - ✅ `ootbModels` - Implemented

##### 12. watson-discovery (Lines 315-324)
- ✅ Schema exists
- ✅ `state` - Implemented
- ⚠️ `noobaa_account_secret` - **MISSING** (commented in ref config)
- ⚠️ `noobaa_cert_secret` - **MISSING** (commented in ref config)
- ✅ `instances` - Implemented
  - ✅ `name` - Implemented
  - ✅ `description` - Implemented
- ✅ `installation_options` - Implemented
  - ✅ `discovery_deployment_type` - Implemented

##### 13. watson-speech (Watson Speech) (Lines 331-359)
- ❌ **NO SCHEMA** - Uses default
- ❌ `stt_size` - **MISSING**
- ❌ `tts_size` - **MISSING**
- ❌ `installation_options` - **MISSING**
  - ❌ `tags` (sttRuntime, sttAsync, etc.) - **MISSING**
  - ❌ `scaleConfig` (stt/tts sizes) - **MISSING**
  - ❌ `sttModels` (array) - **MISSING**
  - ❌ `ttsVoices` (array) - **MISSING**

##### 14. watsonx_ai (Lines 361-498)
- ✅ Schema exists
- ✅ `state` - Implemented
- ✅ `installation_options` - Implemented
  - ✅ `tuning_disabled` - Implemented
  - ✅ `liteInstall` - Implemented
- ✅ `models` - Implemented (array of 67 models)
  - ✅ `model_id` - Implemented
  - ✅ `state` - Implemented
  - ⚠️ `model_install_parameters` - **MISSING** (commented in ref config)

##### 15. watsonx_data (Lines 500-505)
- ❌ **NO SCHEMA** - Uses default
- ❌ `installation_options` - **MISSING**
  - ❌ `enable_lite_milvus` - **MISSING**
  - ❌ `scaleConfig` - **MISSING**

##### 16. watsonx_dataintegration (Lines 507-515)
- ❌ **NO SCHEMA** - Uses default
- ❌ `installation_options` - **MISSING**
  - ❌ `enableBatchBulkETL` - **MISSING**
  - ❌ `enableRealtimeStreaming` - **MISSING**
  - ❌ `enableDataObservability` - **MISSING**
  - ❌ `enableUnstructuredDataIntegration` - **MISSING**
  - ❌ `enableReplication` - **MISSING**

##### 17. watsonx_dataintelligence (Lines 517-532)
- ❌ **NO SCHEMA** - Uses default
- ❌ `installation_options` - **MISSING** (12 boolean/string options)

##### 18. watsonx_data_premium (Lines 534-539)
- ❌ **NO SCHEMA** - Uses default
- ❌ `installation_options` - **MISSING**
  - ❌ `wxd_premium_enable_models_on` - **MISSING**
  - ❌ `licenseType` - **MISSING**

##### 19. watsonx_governance (Lines 541-548)
- ❌ **NO SCHEMA** - Uses default
- ❌ `installation_options` - **MISSING**
  - ❌ `installType` - **MISSING**
  - ❌ `enableFactsheet` - **MISSING**
  - ❌ `enableOpenpages` - **MISSING**
  - ❌ `enableOpenscale` - **MISSING**

##### 20. watsonx_orchestrate (Lines 550-561)
- ❌ **NO SCHEMA** - Uses default
- ❌ `instances` - **MISSING**
- ❌ `installation_options` - **MISSING**
  - ❌ `installMode` - **MISSING**
  - ❌ `watsonxAI` (nested object) - **MISSING**

##### 21. wca (watsonx Code Assistant) (Lines 563-570)
- ❌ **NO SCHEMA** - Uses default
- ❌ `installation_options` - **MISSING**
  - ❌ `similarity_feature.enabled` - **MISSING**
  - ❌ `rag_enabled.enabled` - **MISSING**

##### 22. ikc_premium (Lines 593-607)
- ❌ **NO SCHEMA** - Uses default
- ❌ `size` - **MISSING**
- ❌ `installation_options` - **MISSING** (10 options)

##### 23. ikc_standard (Lines 609-622)
- ❌ **NO SCHEMA** - Uses default
- ❌ `size` - **MISSING**
- ❌ `installation_options` - **MISSING** (8 options)

##### 24. wml-accelerator (Lines 629-633)
- ❌ **NO SCHEMA** - Uses default
- ❌ `replicas` - **MISSING**
- ❌ `size` - **MISSING**

##### 25. ws-pipelines (Lines 639-643)
- ❌ **NO SCHEMA** - Uses default
- ❌ `installation_options` - **MISSING**
  - ❌ `rbsimage` - **MISSING**

##### 26. ws-runtimes (Lines 645-653)
- ❌ **NO SCHEMA** - Uses default
- ❌ `installation_options` - **MISSING**
  - ❌ `kinds` (array) - **MISSING**

## Summary Statistics

### Schema Coverage
- **Components with specific schemas:** 17/63 (27%)
- **Components using default schema:** 46/63 (73%)

### Field Coverage (Estimated)
- **Fully covered components:** ~10/63 (16%)
- **Partially covered components:** ~7/63 (11%)
- **Minimally covered (default only):** ~46/63 (73%)

### Critical Missing Fields
1. **installation_options** - Missing for 20+ components
2. **instances** - Missing for 10+ components
3. **size** - Missing for 15+ components
4. **replicas** - Missing for 5+ components
5. **Component-specific advanced options** - Missing for most components

## Action Items

### Priority 1: High-Impact Components (Immediate)
These components have complex configurations and are frequently used:

1. **watson-speech** - Add schema with stt/tts configuration
2. **watsonx_data** - Add schema with installation_options
3. **watsonx_dataintegration** - Add schema with 5 boolean options
4. **watsonx_dataintelligence** - Add schema with 12 options
5. **watsonx_governance** - Add schema with 4 options
6. **watsonx_orchestrate** - Add schema with instances and installation_options
7. **ikc_premium** - Add schema with 10 installation_options
8. **ikc_standard** - Add schema with 8 installation_options

### Priority 2: Medium-Impact Components
These components have moderate configuration needs:

9. **dmc** - Add schema with instances configuration
10. **edb_cp4d** - Add schema with instances and resource limits
11. **match360** - Add schema with installation_options
12. **replication** - Add schema with license type
13. **voice-gateway** - Add schema with replicas
14. **wca** - Add schema with nested installation_options
15. **wml-accelerator** - Add schema with replicas and size
16. **ws-pipelines** - Add schema with rbsimage option
17. **ws-runtimes** - Add schema with kinds array

### Priority 3: Complete Existing Schemas
Enhance existing schemas with missing fields:

18. **analyticsengine** - Add 8 missing installation_options fields
19. **watson-assistant** - Add noobaa secrets (optional)
20. **watson-discovery** - Add noobaa secrets (optional)
21. **watsonx_ai** - Add model_install_parameters (optional)

### Priority 4: Remaining Components
Add basic schemas for remaining 25+ components with at least:
- state field
- description field (if applicable)
- size field (if applicable)

## Implementation Strategy

### Phase 2.13: Schema Enhancement (Recommended)
**Duration:** 3-4 days  
**Goal:** Achieve 80%+ field coverage

#### Day 1: Priority 1 Components (8 schemas)
- Create schemas for watsonx family components
- Create schemas for IKC variants
- Test with Configuration Page

#### Day 2: Priority 2 Components (9 schemas)
- Create schemas for remaining high-value components
- Add instances and installation_options support
- Test complex configurations

#### Day 3: Priority 3 - Enhance Existing (4 schemas)
- Complete analyticsengine schema
- Add optional fields to watson components
- Verify all fields render correctly

#### Day 4: Testing & Validation
- Test all new schemas in Configuration Page
- Verify YAML generation includes all fields
- Test import/export with complete configurations
- Update documentation

### Alternative: Incremental Approach
- Implement schemas as needed based on user feedback
- Current default schema provides basic functionality
- Can be enhanced over time

## Recommendations

### Immediate Action (Before Phase 3)
1. ✅ **Document current state** - This document
2. 🔄 **Decide on approach:**
   - Option A: Implement Phase 2.13 (3-4 days) for comprehensive coverage
   - Option B: Proceed to Phase 3, enhance schemas incrementally
   - Option C: Implement Priority 1 only (1-2 days), defer rest

### Long-term Strategy
1. **Schema Generator Tool** - Create utility to generate schemas from reference-config.yaml
2. **Schema Validation** - Add automated tests to ensure schema completeness
3. **Documentation** - Document all configuration options with examples
4. **User Feedback** - Collect feedback on which configurations are most important

## Conclusion

The current Configuration Page implementation provides:
- ✅ Basic configuration for all 63 components (via default schema)
- ✅ Advanced configuration for 17 high-priority components
- ✅ State management (installed/removed) for all components
- ⚠️ Limited advanced options for 46 components

**Recommendation:** Implement Phase 2.13 to achieve comprehensive configuration coverage before moving to Phase 3. This ensures users can configure all aspects of their deployment through the UI.

**Alternative:** If time is critical, proceed to Phase 3 with current schemas and enhance incrementally based on user needs.

---

**Document Status:** Complete  
**Next Review:** After decision on implementation approach  
**Owner:** Development Team