# Phase 1.5.4: Medium Priority Components Implementation Guide

## Overview

**Objective:** Add 22 medium-priority Cloud Pak components to reach 87% coverage (54/62 components)

**Current Status:**
- Components before Phase 1.5.4: 32
- Components to add: 22
- Total after Phase 1.5.4: 54
- Coverage: 87% (54/62)

**Timeline:** 2 days

---

## Components Already Added (Excluded from Phase 1.5.4)

From the medium-priority list, these were already added in Phase 1.5.3:
- ✅ Cognos Dashboards (dashboard)
- ✅ Data Privacy (dp)
- ✅ Data Replication (replication)
- ✅ Decision Optimization (dods)
- ✅ MANTA Automated Lineage (mantaflow)
- ✅ Planning Analytics (planning-analytics)
- ✅ SPSS Modeler (spss)
- ✅ watsonx Code Assistant for Ansible (wca-ansible)
- ✅ watsonx Code Assistant for Z (wca-z)

---

## 22 Medium-Priority Components to Add

### Batch 1: Data & Analytics Services (6 components)

1. **AI Factsheets** (factsheet)
   - Category: Governance
   - YAML Line: 577
   - Dependencies: CCS
   - Size: small

2. **Data Product Hub** (dataproduct)
   - Category: Data Management
   - YAML Line: 331
   - Dependencies: Analytics Engine, Data Refinery (auto-installed)
   - Components: CCS, OpenSearch

3. **Data Refinery** (datarefinery)
   - Category: Data Management
   - YAML Line: 360
   - Dependencies: None
   - Basic service

4. **IBM Knowledge Catalog** (wkc)
   - Category: Governance
   - YAML Line: 1395
   - Dependencies: CCS
   - Size: small
   - Note: Base version (not Premium or Standard)

5. **Orchestration Pipelines** (ws-pipelines)
   - Category: Integration
   - YAML Line: Already in reference-config.yaml
   - Dependencies: None
   - Basic service

6. **Watson Studio Runtimes** (ws-runtimes)
   - Category: AI & Machine Learning
   - YAML Line: Already in reference-config.yaml
   - Dependencies: None
   - Runtime configurations

### Batch 2: watsonx Platform Services (3 components)

7. **watsonx.data Premium** (watsonx_data_premium)
   - Category: Data Management
   - YAML Line: From reference-config.yaml
   - Dependencies: GPU operators
   - Premium features

8. **watsonx.data integration** (watsonx_dataintegration)
   - Category: Integration
   - YAML Line: From reference-config.yaml
   - Dependencies: None
   - Integration capabilities

9. **watsonx.data intelligence** (watsonx_dataintelligence)
   - Category: Data Management
   - YAML Line: From reference-config.yaml
   - Dependencies: None
   - Intelligence features

### Batch 3: Database & Storage Services (4 components)

10. **Db2 Data Management Console** (dmc)
    - Category: Data Management
    - YAML Line: 502
    - Dependencies: None
    - Size: medium

11. **EDB Postgres** (edb_cp4d)
    - Category: Data Management
    - YAML Line: From reference-config.yaml
    - Dependencies: License key secret
    - Version: 15.4

12. **MongoDB** (mongodb)
    - Category: Data Management
    - YAML Line: From reference-config.yaml
    - Dependencies: None
    - NoSQL database

13. **Informix** (informix)
    - Category: Data Management
    - YAML Line: Not in YAML (low usage)
    - Dependencies: None
    - Legacy database

### Batch 4: Integration & Streaming (3 components)

14. **IBM StreamSets** (streamsets)
    - Category: Integration
    - YAML Line: From reference-config.yaml
    - Dependencies: None
    - Data streaming

15. **Unstructured Data Integration** (udp)
    - Category: Integration
    - YAML Line: From reference-config.yaml
    - Dependencies: None
    - Unstructured data processing

16. **IBM Manta Data Lineage** (datalineage)
    - Category: Governance
    - YAML Line: From reference-config.yaml
    - Dependencies: CCS
    - Size: small

### Batch 5: AI & Development Tools (4 components)

17. **Watson Speech Services** (watson-speech)
    - Category: AI & Machine Learning
    - YAML Line: From reference-config.yaml
    - Dependencies: MCG, GPU (conditional)
    - STT and TTS

18. **RStudio Server** (rstudio)
    - Category: Development Tools
    - YAML Line: From reference-config.yaml
    - Dependencies: None
    - R development environment

19. **Anaconda Repository** (anaconda)
    - Category: Development Tools
    - YAML Line: Not in main YAML
    - Dependencies: None
    - Python package management

20. **Synthetic Data Generator** (syntheticdata)
    - Category: Data Management
    - YAML Line: From reference-config.yaml
    - Dependencies: None
    - Test data generation

### Batch 6: Governance & Compliance (2 components)

21. **OpenPages** (openpages)
    - Category: Governance
    - YAML Line: From reference-config.yaml
    - Dependencies: None
    - GRC platform

22. **Data Privacy Risk Assessment** (dpra)
    - Category: Governance
    - YAML Line: From reference-config.yaml
    - Dependencies: Data Privacy
    - Risk assessment

---

## Implementation Strategy

### Step 1: Read YAML Data
Read relevant sections from `ibm_software_hub_requirements_normalized_operational.yaml` for components with YAML definitions.

### Step 2: Create Component Objects
For each component, create a complete object with:
- Basic metadata (id, name, description, category)
- External dependencies
- Service dependencies
- Component dependencies
- Configuration schema
- State and version

### Step 3: Add to mockComponents.ts
Use `insert_content` to add all 22 components before the closing bracket of the MOCK_COMPONENTS array.

### Step 4: Verify Build
Run `npm run build` to ensure TypeScript compilation succeeds.

### Step 5: Test UI
Verify all 54 components appear in the UI with correct filtering and dependencies.

---

## Component Templates

### Template 1: Basic Service (No Dependencies)

```typescript
{
  id: 'component-id',
  name: 'Component Name',
  originalName: 'original_name',
  description: 'Component description',
  category: 'Category',
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
```

### Template 2: Service with CCS Dependency

```typescript
{
  id: 'component-id',
  name: 'Component Name',
  originalName: 'original_name',
  description: 'Component description',
  category: 'Category',
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
}
```

### Template 3: Service with GPU Requirements

```typescript
{
  id: 'component-id',
  name: 'Component Name',
  originalName: 'original_name',
  description: 'Component description',
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
}
```

---

## Success Criteria

- ✅ All 22 components added to mockComponents.ts
- ✅ TypeScript compilation passes with no errors
- ✅ Total component count: 54 (32 existing + 22 new)
- ✅ Component coverage: 87% (54/62)
- ✅ All components visible in UI
- ✅ Category distribution correct
- ✅ Dependency information accurate
- ✅ Configuration schemas defined

---

## Expected Component Distribution After Phase 1.5.4

- **AI & Machine Learning:** 13 components
- **Data Management:** 15 components
- **Analytics:** 6 components
- **Governance:** 9 components
- **Integration:** 8 components
- **Development Tools:** 3 components

---

## Next Steps After Phase 1.5.4

1. **Phase 1.5.5:** Add 9 low-priority components (reach 100% coverage - 63/62 with extras)
2. **Phase 1.5.6:** Enhance dependency resolver with conditional logic
3. **Phase 1.5.7:** Update UI components for better dependency visualization
4. **Phase 2:** Build Configuration Page
5. **Phase 3:** Build Deployment Page

---

**Document Status:** Ready for Implementation  
**Estimated Time:** 2-3 hours for all 22 components  
**Dependencies:** Phase 1.5.3 must be complete (✅ Complete)