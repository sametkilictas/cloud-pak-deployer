# Phase 2.14: Complete Component Name Mapping Table

## Overview

This document provides a comprehensive mapping between:
1. **UI Component IDs** - Used for routing and state management
2. **UI originalName** - Current mapping in mockComponents.ts
3. **reference-config.yaml cartridge names** - GOLDEN SOURCE (what backend expects)
4. **Status** - Whether mapping is correct or needs fixing

---

## Mapping Table (63 UI Components)

| # | UI Component ID | UI Display Name | UI originalName | Config Cartridge Name | Status | Notes |
|---|----------------|-----------------|-----------------|----------------------|--------|-------|
| 1 | `watson-ml` | Watson Machine Learning | `wml` | `wml` | ✅ CORRECT | - |
| 2 | `watson-studio` | Watson Studio | `ws` | `ws` | ✅ CORRECT | - |
| 3 | `watson-openscale` | Watson OpenScale | `watson-openscale` | `watson-openscale` | ✅ CORRECT | - |
| 4 | `watsonx-ai` | watsonx.ai | `watsonx_ai` | `watsonx_ai` | ✅ CORRECT | Underscore format |
| 5 | `watsonx-data` | watsonx.data | `watsonx_data` | `watsonx_data` | ✅ CORRECT | Underscore format |
| 6 | `watsonx-governance` | watsonx.governance | `watsonx_governance` | `watsonx_governance` | ✅ CORRECT | Underscore format |
| 7 | `ikc-premium` | IBM Knowledge Catalog Premium | `ikc_premium` | `ikc_premium` | ✅ CORRECT | Underscore format |
| 8 | `ikc-standard` | IBM Knowledge Catalog Standard | `ikc_standard` | `ikc_standard` | ✅ CORRECT | Underscore format |
| 9 | `datastage-ent-plus` | DataStage Enterprise Plus | `datastage-ent-plus` | `datastage-ent-plus` | ✅ CORRECT | - |
| 10 | `cognos-analytics` | Cognos Analytics | `ca` | `ca` | ✅ CORRECT | - |
| 11 | `db2` | Db2 | `db2` | `db2` | ✅ CORRECT | - |
| 12 | `data-virtualization` | Data Virtualization | `dv` | `dv` | ✅ CORRECT | - |
| 13 | `watson-assistant` | Watson Assistant | `watson-assistant` | `watson-assistant` | ✅ CORRECT | - |
| 14 | `watson-discovery` | Watson Discovery | `watson-discovery` | `watson-discovery` | ✅ CORRECT | - |
| 15 | `watsonx-orchestrate` | watsonx Orchestrate | `watsonx_orchestrate` | `watsonx_orchestrate` | ✅ CORRECT | Underscore format |
| 16 | `voice-gateway` | Voice Gateway | `voice-gateway` | `voice-gateway` | ✅ CORRECT | - |
| 17 | `watsonx-code-assistant` | watsonx Code Assistant | `wca` | `wca` | ✅ CORRECT | - |
| 18 | `wca-ansible` | watsonx Code Assistant for Ansible | `wca-ansible` | `wca-ansible` | ✅ CORRECT | - |
| 19 | `wca-z` | watsonx Code Assistant for Z | `wca-z` | `wca-z` | ✅ CORRECT | - |
| 20 | `db2wh` | Db2 Warehouse | `db2wh` | `db2wh` | ✅ CORRECT | - |
| 21 | `match-360` | IBM Match 360 | `match360` | `match360` | ✅ CORRECT | No hyphen in config |
| 22 | `db2-bigsql` | Db2 Big SQL | `bigsql` | `bigsql` | ✅ CORRECT | - |
| 23 | `data-gate` | Db2 Data Gate | `datagate` | `datagate` | ✅ CORRECT | No hyphen in config |
| 24 | `data-replication` | Data Replication | `replication` | `replication` | ✅ CORRECT | - |
| 25 | `decision-optimization` | Decision Optimization | `dods` | `dods` | ✅ CORRECT | - |
| 26 | `planning-analytics` | Planning Analytics | `planning-analytics` | `planning-analytics` | ✅ CORRECT | - |
| 27 | `spss-modeler` | SPSS Modeler | `spss` | `spss` | ✅ CORRECT | - |
| 28 | `analytics-engine` | Analytics Engine | `analyticsengine` | `analyticsengine` | ✅ CORRECT | No hyphen in config |
| 29 | `cognos-dashboards` | Cognos Dashboards | `dashboard` | `dashboard` | ✅ CORRECT | Singular in config |
| 30 | `data-privacy` | Data Privacy | `dp` | `dp` | ✅ CORRECT | - |
| 31 | `manta-lineage` | MANTA Automated Lineage | `mantaflow` | `mantaflow` | ✅ CORRECT | - |
| 32 | `datastage-ent` | DataStage Enterprise | `datastage-ent` | `datastage-ent` | ✅ CORRECT | - |
| 33 | `ai-factsheets` | AI Factsheets | `factsheet` | `factsheet` | ✅ CORRECT | Singular in config |
| 34 | `data-product-hub` | Data Product Hub | `dataproduct` | `dataproduct` | ✅ CORRECT | No hyphens in config |
| 35 | `data-refinery` | Data Refinery | `datarefinery` | N/A | ⚠️ NOT IN CONFIG | Not in reference-config.yaml |
| 36 | `ibm-knowledge-catalog` | IBM Knowledge Catalog | `wkc` | `wkc` | ✅ CORRECT | - |
| 37 | `orchestration-pipelines` | Orchestration Pipelines | `ws-pipelines` | `ws-pipelines` | ✅ CORRECT | - |
| 38 | `watson-studio-runtimes` | Watson Studio Runtimes | `ws-runtimes` | `ws-runtimes` | ✅ CORRECT | - |
| 39 | `watsonx-data-premium` | watsonx.data Premium | `watsonx_data_premium` | `watsonx_data_premium` | ✅ CORRECT | Underscore format |
| 40 | `watsonx-data-integration` | watsonx.data integration | `watsonx_dataintegration` | `watsonx_dataintegration` | ✅ CORRECT | Underscore format |
| 41 | `watsonx-data-intelligence` | watsonx.data intelligence | `watsonx_dataintelligence` | `watsonx_dataintelligence` | ✅ CORRECT | Underscore format |
| 42 | `db2-data-management-console` | Db2 Data Management Console | `dmc` | `dmc` | ✅ CORRECT | - |
| 43 | `edb-postgres` | EDB Postgres | `edb_cp4d` | `edb_cp4d` | ✅ CORRECT | Underscore format |
| 44 | `mongodb` | MongoDB | `mongodb` | `mongodb` | ✅ CORRECT | - |
| 45 | `informix` | Informix | `informix` | N/A | ⚠️ NOT IN CONFIG | Not in reference-config.yaml |
| 46 | `ibm-streamsets` | IBM StreamSets | `streamsets` | `streamsets` | ✅ CORRECT | - |
| 47 | `unstructured-data-integration` | Data Integration for Unstructured Data | `udp` | `udp` | ✅ CORRECT | - |
| 48 | `ibm-manta-data-lineage` | IBM MANTA Data Lineage | `datalineage` | `datalineage` | ✅ CORRECT | No hyphens in config |
| 49 | `watson-speech-services` | Watson Speech Services | `watson-speech` | `watson-speech` | ✅ CORRECT | **FIXED in Phase 2.13** |
| 50 | `rstudio-server` | RStudio Server | `rstudio` | `rstudio` | ✅ CORRECT | - |
| 51 | `anaconda-repository` | Anaconda Repository | `anaconda` | N/A | ⚠️ NOT IN CONFIG | Not in reference-config.yaml |
| 52 | `synthetic-data-generator` | Synthetic Data Generator | `syntheticdata` | `syntheticdata` | ✅ CORRECT | No hyphens in config |
| 53 | `openpages` | OpenPages | `openpages` | `openpages` | ✅ CORRECT | - |
| 54 | `data-privacy-risk-assessment` | Data Privacy Risk Assessment | `dpra` | `dpra` | ✅ CORRECT | - |
| 55 | `execution-engine-hadoop` | Execution Engine for Apache Hadoop | `hee` | `hee` | ✅ CORRECT | - |
| 56 | `product-master` | Product Master | `productmaster` | `productmaster` | ✅ CORRECT | No hyphen in config |
| 57 | `wca-z-code-explanation` | watsonx Code Assistant for Z Code Explanation | `wca-z-ce` | `wca-z-ce` | ✅ CORRECT | - |
| 58 | `wca-z-agentic` | watsonx Code Assistant for Z Agentic | `wca-z-agentic` | N/A | ⚠️ NOT IN CONFIG | Not in reference-config.yaml |
| 59 | `wca-z-code-generation` | watsonx Code Assistant for Z Code Generation | `wca-z-codegen` | N/A | ⚠️ NOT IN CONFIG | Not in reference-config.yaml |
| 60 | `wca-z-understand` | watsonx Code Assistant for Z Understand | `wca-z-understand` | N/A | ⚠️ NOT IN CONFIG | Not in reference-config.yaml |
| 61 | `ibm-rpa` | IBM Robotic Process Automation | `rpa` | N/A | ⚠️ NOT IN CONFIG | Not in reference-config.yaml |
| 62 | `watson-ml-accelerator` | Watson Machine Learning Accelerator | `wml-accelerator` | `wml-accelerator` | ✅ CORRECT | - |
| 63 | `scheduler` | Scheduler | `scheduler` | `scheduler` | ✅ CORRECT | - |

---

## Summary Statistics

- **Total UI Components:** 63
- **Correct Mappings:** 57 (90.5%)
- **Not in reference-config.yaml:** 6 (9.5%)
- **Incorrect Mappings:** 0 (0%)

---

## Components NOT in reference-config.yaml

These 6 components exist in the UI but are NOT present in reference-config.yaml:

| UI Component ID | UI originalName | Reason |
|----------------|-----------------|--------|
| `data-refinery` | `datarefinery` | May be part of Watson Studio or deprecated |
| `informix` | `informix` | Not supported in current CP4D version |
| `anaconda-repository` | `anaconda` | May be infrastructure component, not cartridge |
| `wca-z-agentic` | `wca-z-agentic` | New component not yet in reference config |
| `wca-z-code-generation` | `wca-z-codegen` | New component not yet in reference config |
| `wca-z-understand` | `wca-z-understand` | New component not yet in reference config |
| `ibm-rpa` | `rpa` | Not supported in current CP4D version |

**Action Required:** These components should either:
1. Be removed from the UI if not supported
2. Be marked as "Coming Soon" if planned for future releases
3. Have their cartridge names verified if they are valid but missing from reference config

---

## Components in reference-config.yaml NOT in UI

These cartridges exist in reference-config.yaml but are NOT represented in the UI:

| Cartridge Name | Description | Reason |
|---------------|-------------|--------|
| `cp-foundation` | Cloud Pak Foundation | Infrastructure component, auto-installed |
| `lite` | Lite | Always installed, not user-selectable |

**Note:** These are foundation components that are automatically installed and should not be user-selectable in the UI.

---

## Validation Results

### ✅ All User-Selectable Components Have Correct Mappings

All 57 components that exist in both the UI and reference-config.yaml have **correct originalName mappings**. This means:

1. The `originalName` field in mockComponents.ts matches the cartridge name in reference-config.yaml
2. Config generator can use `originalName` directly without transformation
3. No naming conflicts or mismatches for supported components

### ⚠️ 6 Components Need Review

The 6 components not in reference-config.yaml need product management review to determine:
- Should they be removed from UI?
- Are they valid but missing from reference config?
- Should they be marked as "Coming Soon"?

---

## Implementation Impact

### No Changes Required for Core Mapping

**Good News:** The existing `originalName` fields in mockComponents.ts are **100% correct** for all components that exist in reference-config.yaml.

### Changes Required

1. **Config Generator** - Must use `originalName` field (not `id`)
2. **Component Schemas** - Must register with `originalName` as key
3. **Config Store** - Must use `originalName` for backend compatibility
4. **Validation System** - Must validate against reference-config.yaml cartridge names
5. **UI Filtering** - May need to hide/disable the 6 unsupported components

### No Changes Required

1. **mockComponents.ts originalName fields** - Already correct ✅
2. **Component display names** - Can remain user-friendly
3. **Component IDs** - Can remain as-is for routing

---

## Next Steps

1. ✅ **Mapping Complete** - All originalName fields verified
2. ⏳ **Await User Approval** - Review this mapping table
3. ⏳ **Decide on 6 Unsupported Components** - Remove, hide, or mark as coming soon
4. ⏳ **Implement Config Generator** - Use originalName field
5. ⏳ **Create Validation System** - Validate against reference-config.yaml
6. ⏳ **Update Component Schemas** - Register with originalName keys
7. ⏳ **Test with Backend** - Verify generated config.yaml works with deployer scripts

---

## Conclusion

**The naming architecture is sound.** The `originalName` field pattern in mockComponents.ts correctly maps UI components to backend cartridge names. The main work ahead is:

1. Ensuring the config generator uses `originalName` instead of `id`
2. Deciding what to do with the 6 components not in reference-config.yaml
3. Creating validation to prevent future naming drift

**Risk Assessment:** LOW - No incorrect mappings found, only missing components that need product decisions.

**Recommendation:** Proceed with implementation using the existing `originalName` fields.