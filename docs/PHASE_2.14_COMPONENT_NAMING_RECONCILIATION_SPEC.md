# Phase 2.14: Component Naming Reconciliation - CRITICAL FIX

## Risk Classification: **Tier 3**

**Blast Radius:** System boundary - affects contract between UI and backend deployer scripts

**Why Tier 3:**
- Changes public contract (config.yaml output schema)
- Breaks downstream system (cloud-pak-deployer Ansible scripts)
- Multiple consumers depend on correct cartridge names
- Requires validation against golden reference file

---

## Problem Statement

**Issue:** The UI generates config.yaml files with component names that don't match the expected cartridge names in reference-config.yaml, causing cloud-pak-deployer scripts to fail.

**Root Cause:** Inconsistent naming between:
1. UI component IDs (e.g., `'watson-speech-services'`)
2. reference-config.yaml cartridge names (e.g., `'watson-speech'`) - **GOLDEN SOURCE**
3. ibm_software_hub_requirements_normalized_operational.yaml service names (normalized)

**Impact:** 
- Generated config.yaml files are rejected by deployer scripts
- Deployments fail silently or with cryptic errors
- Users cannot successfully deploy Cloud Pak components

---

## Exploration Findings

### 1. Reference Config Cartridge Names (Golden Source)

From `references/reference-config.yaml` - 51 cartridges total:

**Foundation & Core:**
- `cp-foundation` - Cloud Pak Foundation
- `lite` - Lite (always installed)
- `scheduler` - Scheduler

**Data & Analytics:**
- `analyticsengine` - Analytics Engine Powered by Apache Spark
- `bigsql` - Db2 Big SQL
- `ca` - Cognos Analytics
- `dashboard` - Cognos Dashboards
- `datagate` - Db2 Data Gate
- `datalineage` - IBM MANTA Data Lineage
- `dataproduct` - Data Product Hub
- `datastage-ent` - DataStage Enterprise
- `datastage-ent-plus` - DataStage Enterprise Plus
- `db2` - Db2 OLTP
- `db2wh` - Db2 Warehouse
- `dmc` - Db2 Data Management Console
- `dods` - Decision Optimization
- `dp` - Data Privacy
- `dpra` - Data Privacy Risk Assessment
- `dv` - Data Virtualization
- `edb_cp4d` - EDB Postgres
- `factsheet` - AI Factsheets
- `hee` - Execution Engine for Apache Hadoop
- `mantaflow` - MANTA Automated Lineage
- `match360` - IBM Match 360
- `mongodb` - MongoDB for Cloud Pak for Data
- `openpages` - OpenPages
- `planning-analytics` - Planning Analytics
- `replication` - Data Replication
- `rstudio` - RStudio Server with R 3.6
- `spss` - SPSS Modeler
- `streamsets` - IBM StreamSets
- `syntheticdata` - Synthetic Data Generator
- `udp` - Data Integration for Unstructured Data
- `voice-gateway` - Voice Gateway

**Watson AI Services:**
- `watson-assistant` - Watson Assistant
- `watson-discovery` - Watson Discovery
- `watson-openscale` - Watson OpenScale
- `watson-speech` - Watson Speech (STT and TTS) ⚠️ **NOT** `watson-speech-services`

**watsonx Platform:**
- `watsonx_ai` - watsonx.ai
- `watsonx_data` - watsonx.data
- `watsonx_dataintegration` - watsonx.data integration
- `watsonx_dataintelligence` - watsonx.data intelligence
- `watsonx_data_premium` - watsonx.data Premium
- `watsonx_governance` - watsonx.governance
- `watsonx_orchestrate` - watsonx.orchestrate

**Code Assistants:**
- `wca` - watsonx Code Assistant
- `wca-ansible` - watsonx Code Assistant for Red Hat Ansible Lightspeed
- `wca-z` - watsonx Code Assistant for Z
- `wca-z-ce` - watsonx Code Assistant for Z Code Explanation

**Knowledge & ML:**
- `wkc` - IBM Knowledge Catalog
- `ikc_premium` - IBM Knowledge Catalog - Premium edition
- `ikc_standard` - IBM Knowledge Catalog - Standard edition
- `wml` - Watson Machine Learning
- `wml-accelerator` - Watson Machine Learning Accelerator
- `ws` - Watson Studio
- `ws-pipelines` - Orchestration Pipelines
- `ws-runtimes` - Watson Studio Runtimes

**Special:**
- `productmaster` - Product Master (requires manual setup)

### 2. UI Component IDs (Current State)

From `deployer-web/ui/src/constants/mockComponents.ts` - 63 components:

**Confirmed Mismatches:**
1. UI: `'watson-speech-services'` → Config: `'watson-speech'` ✗
2. UI: `'watsonx-ai'` → Config: `'watsonx_ai'` ✗ (hyphen vs underscore)
3. UI: `'watsonx-data'` → Config: `'watsonx_data'` ✗
4. UI: `'watsonx-governance'` → Config: `'watsonx_governance'` ✗
5. UI: `'watsonx-orchestrate'` → Config: `'watsonx_orchestrate'` ✗
6. UI: `'watsonx-code-assistant'` → Config: `'wca'` ✗
7. UI: `'ikc-premium'` → Config: `'ikc_premium'` ✗ (hyphen vs underscore)
8. UI: `'ikc-standard'` → Config: `'ikc_standard'` ✗
9. UI: `'watson-ml'` → Config: `'wml'` ✗
10. UI: `'watson-studio'` → Config: `'ws'` ✗
11. UI: `'cognos-analytics'` → Config: `'ca'` ✗
12. UI: `'data-virtualization'` → Config: `'dv'` ✗
13. UI: `'match-360'` → Config: `'match360'` ✗
14. UI: `'db2-bigsql'` → Config: `'bigsql'` ✗
15. UI: `'data-gate'` → Config: `'datagate'` ✗
16. UI: `'data-replication'` → Config: `'replication'` ✗
17. UI: `'decision-optimization'` → Config: `'dods'` ✗
18. UI: `'spss-modeler'` → Config: `'spss'` ✗
19. UI: `'analytics-engine'` → Config: `'analyticsengine'` ✗
20. UI: `'cognos-dashboards'` → Config: `'dashboard'` ✗
21. UI: `'data-privacy'` → Config: `'dp'` ✗
22. UI: `'manta-lineage'` → Config: `'mantaflow'` ✗
23. UI: `'ai-factsheets'` → Config: `'factsheet'` ✗
24. UI: `'data-product-hub'` → Config: `'dataproduct'` ✗
25. UI: `'ibm-knowledge-catalog'` → Config: `'wkc'` ✗
26. UI: `'orchestration-pipelines'` → Config: `'ws-pipelines'` ✗
27. UI: `'watson-studio-runtimes'` → Config: `'ws-runtimes'` ✗
28. UI: `'watsonx-data-premium'` → Config: `'watsonx_data_premium'` ✗
29. UI: `'watsonx-data-integration'` → Config: `'watsonx_dataintegration'` ✗
30. UI: `'watsonx-data-intelligence'` → Config: `'watsonx_dataintelligence'` ✗
31. UI: `'db2-data-management-console'` → Config: `'dmc'` ✗
32. UI: `'edb-postgres'` → Config: `'edb_cp4d'` ✗
33. UI: `'ibm-streamsets'` → Config: `'streamsets'` ✗
34. UI: `'unstructured-data-integration'` → Config: `'udp'` ✗
35. UI: `'ibm-manta-data-lineage'` → Config: `'datalineage'` ✗
36. UI: `'rstudio-server'` → Config: `'rstudio'` ✗
37. UI: `'synthetic-data-generator'` → Config: `'syntheticdata'` ✗
38. UI: `'data-privacy-risk-assessment'` → Config: `'dpra'` ✗
39. UI: `'execution-engine-hadoop'` → Config: `'hee'` ✗
40. UI: `'product-master'` → Config: `'productmaster'` ✗
41. UI: `'wca-z-code-explanation'` → Config: `'wca-z-ce'` ✗
42. UI: `'watson-ml-accelerator'` → Config: `'wml-accelerator'` ✗

**Note:** The mockComponents already has an `originalName` field that should map to config.yaml names, but it needs verification and correction.

### 3. Current originalName Mappings

Need to verify all `originalName` fields in mockComponents match reference-config.yaml exactly.

---

## Solution Design

### Approach: Use originalName as Cartridge Name Mapping

**Strategy:**
1. **Keep UI IDs user-friendly** (e.g., `'watson-speech-services'`) for display and routing
2. **Use `originalName` field** to store the exact cartridge name from reference-config.yaml
3. **Config generator uses `originalName`** when creating config.yaml output
4. **Validate all mappings** against reference-config.yaml

### Changes Required

#### 1. Verify and Fix originalName Mappings

**File:** `deployer-web/ui/src/constants/mockComponents.ts`

For each component, ensure `originalName` matches reference-config.yaml exactly:

```typescript
{
  id: 'watson-speech-services',  // UI identifier (user-friendly)
  name: 'Watson Speech Services', // Display name
  originalName: 'watson-speech',  // ← MUST match reference-config.yaml
  // ...
}
```

**Critical Fixes Needed:**
- `watson-speech-services` → originalName: `'watson-speech'`
- `watsonx-ai` → originalName: `'watsonx_ai'`
- `watsonx-data` → originalName: `'watsonx_data'`
- `watsonx-governance` → originalName: `'watsonx_governance'`
- `watsonx-orchestrate` → originalName: `'watsonx_orchestrate'`
- `ikc-premium` → originalName: `'ikc_premium'`
- `ikc-standard` → originalName: `'ikc_standard'`
- All others per mapping table above

#### 2. Update Config Generator

**File:** `deployer-web/ui/src/services/configGenerator.ts` (to be created/updated)

```typescript
export function generateConfigYAML(selectedComponents: Component[], configurations: Record<string, any>): string {
  const cartridges = selectedComponents.map(component => {
    const config = configurations[component.id] || {};
    
    return {
      name: component.originalName,  // ← Use originalName, not id
      description: component.description,
      state: config.state || 'installed',
      ...config  // Other configuration fields
    };
  });
  
  // Generate YAML using reference-config.yaml as template
  // ...
}
```

#### 3. Create Validation System

**File:** `deployer-web/ui/src/services/configValidator.ts` (new)

```typescript
import referenceConfig from '@/references/reference-config.yaml';

export function validateCartridgeNames(components: Component[]): ValidationResult {
  const validNames = extractCartridgeNamesFromReference(referenceConfig);
  const errors: string[] = [];
  
  components.forEach(component => {
    if (!validNames.includes(component.originalName)) {
      errors.push(`Invalid cartridge name: ${component.originalName} for component ${component.id}`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
}
```

#### 4. Update Component Schemas

**File:** `deployer-web/ui/src/schemas/componentSchemas.ts`

Ensure all schema registrations use `originalName`:

```typescript
export const componentSchemaRegistry: Record<string, ComponentSchema> = {
  'watson-speech': WATSON_SPEECH_SCHEMA,  // ← Use originalName as key
  'watsonx_ai': WATSONX_AI_SCHEMA,
  // ...
};
```

#### 5. Update Config Store

**File:** `deployer-web/ui/src/stores/configStore.ts`

Ensure config storage uses `originalName` for backend compatibility:

```typescript
export const useConfigStore = create<ConfigStore>((set, get) => ({
  updateComponentConfig: (componentId: string, config: Record<string, any>) => {
    const component = findComponentById(componentId);
    set(state => ({
      componentConfigs: {
        ...state.componentConfigs,
        [component.originalName]: config  // ← Use originalName
      }
    }));
  }
}));
```

---

## Acceptance Criteria

1. ✅ All mockComponents have correct `originalName` matching reference-config.yaml
2. ✅ Config generator uses `originalName` for cartridge names
3. ✅ Generated config.yaml structure matches reference-config.yaml exactly
4. ✅ Validation system catches any naming mismatches
5. ✅ Component schemas registered with `originalName` keys
6. ✅ Config store uses `originalName` for backend compatibility
7. ✅ All 51 cartridges from reference-config.yaml represented in UI
8. ✅ Automated tests verify config.yaml output format
9. ✅ Manual test: Generated config.yaml accepted by deployer scripts
10. ✅ Documentation updated with naming conventions

---

## Verification Plan

### 1. Automated Tests

```typescript
describe('Config YAML Generation', () => {
  it('should use originalName for cartridge names', () => {
    const components = [
      { id: 'watson-speech-services', originalName: 'watson-speech', ... }
    ];
    const yaml = generateConfigYAML(components, {});
    expect(yaml).toContain('name: watson-speech');
    expect(yaml).not.toContain('name: watson-speech-services');
  });
  
  it('should match reference-config.yaml structure', () => {
    const generated = generateConfigYAML(mockComponents, mockConfigs);
    const reference = loadReferenceConfig();
    expect(generated.structure).toEqual(reference.structure);
  });
});
```

### 2. Manual Verification

1. Select Watson Speech Services in UI
2. Configure with test values
3. Generate config.yaml
4. Verify cartridge name is `watson-speech` not `watson-speech-services`
5. Feed generated config to deployer scripts
6. Confirm deployment succeeds

### 3. Validation Gates

- [ ] All originalName fields verified against reference-config.yaml
- [ ] Config generator produces valid YAML
- [ ] YAML structure matches reference exactly
- [ ] Cartridge names match reference exactly
- [ ] Field names match reference exactly
- [ ] Deployer scripts accept generated config
- [ ] No naming-related deployment failures

---

## Rollback Strategy

If issues arise:
1. Revert mockComponents originalName changes
2. Revert config generator changes
3. Restore previous config.yaml generation logic
4. Document issues for future fix attempt

---

## Implementation Phases

### Phase 1: Exploration & Mapping (CURRENT)
- [x] Analyze reference-config.yaml cartridge names
- [x] Analyze UI component IDs
- [ ] Create complete mapping table
- [ ] Identify all mismatches
- [ ] Document findings

### Phase 2: Spec & Approval
- [ ] Complete this specification
- [ ] Get user approval
- [ ] Confirm approach

### Phase 3: Implementation
- [ ] Fix all originalName mappings in mockComponents
- [ ] Update/create config generator
- [ ] Create validation system
- [ ] Update component schemas
- [ ] Update config store

### Phase 4: Testing
- [ ] Write automated tests
- [ ] Run validation suite
- [ ] Manual testing with deployer scripts
- [ ] Fix any issues

### Phase 5: Documentation
- [ ] Update API documentation
- [ ] Update developer guide
- [ ] Document naming conventions
- [ ] Create troubleshooting guide

---

## Open Questions

1. **Are there components in UI not in reference-config.yaml?**
   - Need to verify 63 UI components vs 51 reference cartridges
   - Some UI components may be logical groupings

2. **Should we support both old and new names during transition?**
   - Backward compatibility considerations
   - Migration path for existing configs

3. **How to handle future component additions?**
   - Process for keeping UI and reference in sync
   - Validation in CI/CD pipeline

---

## Next Steps

1. **User Review & Approval** of this specification
2. **Complete mapping table** with all 63 components
3. **Begin implementation** per approved spec
4. **Iterative testing** with deployer scripts

---

**Status:** Awaiting user approval to proceed with implementation

**Risk Level:** HIGH - Affects core system functionality

**Priority:** CRITICAL - Blocks successful deployments