# Phase 2.13: Schema Enhancement - Implementation Plan

## Overview

**Goal:** Achieve 80%+ configuration field coverage for all 63 components  
**Duration:** 3-4 days  
**Status:** Planning Complete - Ready to Implement

## Implementation Schedule

### Day 1: Priority 1 - High-Impact Components (8 schemas)

#### Morning Session (4 hours)
1. **watson-speech** - Complex STT/TTS configuration
   - stt_size, tts_size fields
   - installation_options with nested tags, scaleConfig
   - sttModels array, ttsVoices array
   
2. **watsonx_data** - Data platform configuration
   - installation_options: enable_lite_milvus, scaleConfig
   
3. **watsonx_dataintegration** - Integration options
   - installation_options: 5 boolean flags
   
4. **watsonx_dataintelligence** - Intelligence features
   - installation_options: 12 configuration options

#### Afternoon Session (4 hours)
5. **watsonx_governance** - Governance configuration
   - installation_options: installType, 3 enable flags
   
6. **watsonx_orchestrate** - Orchestration setup
   - instances array
   - installation_options: installMode, nested watsonxAI config
   
7. **ikc_premium** - Premium catalog features
   - size field
   - installation_options: 10 configuration options
   
8. **ikc_standard** - Standard catalog features
   - size field
   - installation_options: 8 configuration options

**Day 1 Deliverable:** 8 new schemas, test with Configuration Page

---

### Day 2: Priority 2 - Medium-Impact Components (9 schemas)

#### Morning Session (4 hours)
9. **dmc** (Db2 Data Management Console)
   - instances array with size and storage_size_gb
   
10. **edb_cp4d** (EDB Postgres)
    - instances array with version, type, members, size_gb
    - Resource limits: cpu/memory request/limit
    
11. **match360** (IBM Match 360)
    - installation_options: scaleConfig, timeouts
    
12. **replication** (Data Replication)
    - size field
    - installation_options: replication_license_type

#### Afternoon Session (4 hours)
13. **voice-gateway** (Voice Gateway)
    - replicas field
    
14. **wca** (watsonx Code Assistant)
    - installation_options with nested objects
    
15. **wml-accelerator** (Watson Machine Learning Accelerator)
    - replicas, size fields
    
16. **ws-pipelines** (Orchestration Pipelines)
    - installation_options: rbsimage
    
17. **ws-runtimes** (Watson Studio Runtimes)
    - installation_options: kinds array

**Day 2 Deliverable:** 9 new schemas, cumulative 17 schemas added

---

### Day 3: Priority 3 - Enhance Existing + Remaining Components

#### Morning Session (4 hours)

**Enhance Existing Schemas:**

18. **analyticsengine** - Add 8 missing fields
    - imagePullParallelism, imagePullCompletions
    - kernelCleanupSchedule, jobCleanupSchedule
    - skipSelinuxRelabeling, mountCustomizationsFromCchome
    - maxDriveMemory, maxExecutorMemory
    - localDirScaleFactor

19. **watson-assistant** - Add optional fields
    - noobaa_account_secret, noobaa_cert_secret

20. **watson-discovery** - Add optional fields
    - noobaa_account_secret, noobaa_cert_secret

21. **watsonx_ai** - Add optional fields
    - model_install_parameters (shards, nodeSelector)

#### Afternoon Session (4 hours)

**Add Basic Schemas for Remaining Components:**

22. **bigsql** - Basic schema with state
23. **dashboard** - Basic schema with state
24. **datagate** - Basic schema with state
25. **datalineage** - Basic schema with size, state
26. **dataproduct** - Basic schema with state
27. **db2wh** - Basic schema with state
28. **dp** (Data Privacy) - Basic schema with size, state
29. **dpra** - Basic schema with state
30. **factsheet** - Basic schema with size, state
31. **hee** - Basic schema with size, state
32. **mantaflow** - Basic schema with size, state
33. **mongodb** - Basic schema with state
34. **rstudio** - Basic schema with size, state
35. **streamsets** - Basic schema with state
36. **syntheticdata** - Basic schema with state
37. **udp** - Basic schema with state
38. **wca-ansible** - Basic schema with state
39. **wca-z** - Basic schema with state
40. **wca-z-ce** - Basic schema with state
41. **productmaster** - Basic schema with size, state

**Day 3 Deliverable:** 4 enhanced + 20 new basic schemas

---

### Day 4: Testing, Validation & Documentation

#### Morning Session (4 hours)
- Test all new schemas in Configuration Page
- Verify form rendering for all components
- Test YAML generation with all fields
- Validate import/export with complete configurations
- Check field validation and error messages

#### Afternoon Session (4 hours)
- Performance testing with all 63 schemas
- Cross-browser testing
- Update documentation
- Create schema reference guide
- Final build and validation

**Day 4 Deliverable:** Fully tested and documented schema system

---

## Implementation Details

### Schema Template Structure

```typescript
export const COMPONENT_NAME_SCHEMA: ComponentConfigSchema = {
  componentName: 'component-name',
  displayName: 'Component Display Name',
  sections: [
    {
      id: 'basic',
      title: 'Basic Configuration',
      fields: [
        // state, size, replicas, etc.
      ]
    },
    {
      id: 'instances',
      title: 'Instances',
      description: 'Configure component instances',
      collapsible: true,
      fields: [
        // instance configuration
      ]
    },
    {
      id: 'installation_options',
      title: 'Installation Options',
      description: 'Advanced installation settings',
      collapsible: true,
      defaultCollapsed: true,
      fields: [
        // installation_options fields
      ]
    }
  ],
  supportsInstances: true/false,
  supportsModels: true/false
};
```

### Field Type Mapping

| YAML Type | UI Field Type | Notes |
|-----------|---------------|-------|
| boolean | boolean | Checkbox |
| string | text | Text input |
| number | number | Number input with min/max |
| enum | select | Dropdown with options |
| array | array | Dynamic array input |
| object | nested | Nested field group |

### Validation Rules

- Required fields marked with `required: true`
- Pattern validation for K8s names
- Min/max validation for numbers
- Custom validation for complex fields

---

## Success Criteria

### Coverage Metrics
- ✅ All 63 components have specific schemas
- ✅ 80%+ of reference-config.yaml fields available in UI
- ✅ All installation_options supported
- ✅ All instances configurations supported
- ✅ All size/replicas fields supported

### Functional Requirements
- ✅ All schemas render correctly in Configuration Page
- ✅ Form validation works for all fields
- ✅ YAML generation includes all configured fields
- ✅ Import/Export preserves all field values
- ✅ No performance degradation with 63 schemas

### Quality Requirements
- ✅ Build passes without errors
- ✅ No TypeScript errors
- ✅ All fields have help text
- ✅ Consistent UI/UX across all schemas
- ✅ Documentation complete

---

## Risk Mitigation

### Potential Issues
1. **Performance:** 63 schemas may slow down form rendering
   - Mitigation: Use React.memo, lazy loading, virtualization
   
2. **Complexity:** Nested objects in installation_options
   - Mitigation: Create reusable nested field components
   
3. **Validation:** Complex validation rules
   - Mitigation: Use Zod schemas, clear error messages
   
4. **Testing:** Time-consuming to test all schemas
   - Mitigation: Automated tests, focus on critical paths

---

## Next Steps

1. ✅ Plan approved - Option A selected
2. 🔄 Begin Day 1 implementation
3. ⏳ Daily progress updates
4. ⏳ Final testing and validation
5. ⏳ Documentation and handoff

---

**Status:** Ready to Begin  
**Start Date:** April 13, 2026  
**Target Completion:** April 16, 2026  
**Owner:** Development Team