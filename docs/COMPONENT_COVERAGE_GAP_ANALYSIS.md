# Component Coverage Gap Analysis

## Executive Summary

This document provides a comprehensive analysis comparing the services defined in `references/ibm_software_hub_requirements_normalized_operational.yaml` with the mock components currently implemented in the UI (`deployer-web/ui/src/constants/mockComponents.ts`).

**Analysis Date:** 2026-04-06  
**Total Services in YAML:** 62  
**Current Mock Components:** 13  
**Coverage:** 21% (13/62)

---

## Current Mock Components (13)

The following components are currently implemented in the mock UI:

1. **Watson Machine Learning** (wml) ✅
2. **Watson Studio** (ws) ✅
3. **Watson OpenScale** (watson-openscale) ✅
4. **watsonx.ai** (watsonx_ai) ✅
5. **watsonx.data** (watsonx_data) ✅
6. **watsonx.governance** (watsonx_governance) ✅
7. **IBM Knowledge Catalog Premium** (ikc_premium) ✅
8. **IBM Knowledge Catalog Standard** (ikc_standard) ✅
9. **DataStage Enterprise Plus** (datastage-ent-plus) ✅
10. **Cognos Analytics** (ca) ✅
11. **Db2** (db2) ✅
12. **Data Virtualization** (dv) ✅
13. **Db2 Warehouse** (db2wh) ✅

---

## Complete Service List from YAML (62 Services)

### ✅ Already Implemented (13)

| # | Service Name | Mock ID | Status |
|---|--------------|---------|--------|
| 1 | Cognos Analytics | ca | ✅ Implemented |
| 2 | Data Virtualization | dv | ✅ Implemented |
| 3 | Db2 | db2 | ✅ Implemented |
| 4 | Db2 Warehouse | db2wh | ✅ Implemented |
| 5 | DataStage | datastage-ent-plus | ✅ Implemented (as DataStage Enterprise Plus) |
| 6 | IBM Knowledge Catalog Premium | ikc_premium | ✅ Implemented |
| 7 | IBM Knowledge Catalog Standard | ikc_standard | ✅ Implemented |
| 8 | Watson Machine Learning | wml | ✅ Implemented |
| 9 | Watson OpenScale | watson-openscale | ✅ Implemented |
| 10 | Watson Studio | ws | ✅ Implemented |
| 11 | watsonx.ai | watsonx_ai | ✅ Implemented |
| 12 | watsonx.data | watsonx_data | ✅ Implemented |
| 13 | watsonx.governance | watsonx_governance | ✅ Implemented |

### ❌ Missing Components (49)

| # | Service Name | Suggested Mock ID | Priority | Category |
|---|--------------|-------------------|----------|----------|
| 14 | AI Factsheets | factsheet | High | AI/ML |
| 15 | Anaconda Repository for IBM Cloud Pak for Data | anaconda | Medium | Development |
| 16 | Analytics Engine powered by Apache Spark | analyticsengine | High | Analytics |
| 17 | Cognos Dashboards | dashboard | Medium | Analytics |
| 18 | Data Gate | datagate | Low | Data Management |
| 19 | Data Privacy | dp | Medium | Governance |
| 20 | Data Product Hub | dataproduct | High | Data Management |
| 21 | Data Refinery | datarefinery | High | Data Preparation |
| 22 | Data Replication | replication | Medium | Data Integration |
| 23 | Db2 Big SQL | bigsql | Low | Database |
| 24 | Db2 Data Management Console | dmc | Medium | Database |
| 25 | Decision Optimization | dods | Medium | Analytics |
| 26 | EDB Postgres | edb_cp4d | Medium | Database |
| 27 | Execution Engine for Apache Hadoop | hee | Low | Big Data |
| 28 | IBM Knowledge Catalog | wkc | High | Governance |
| 29 | IBM Manta Data Lineage | datalineage | Medium | Governance |
| 30 | IBM Master Data Management | match360 | Medium | Data Management |
| 31 | IBM StreamSets | streamsets | Medium | Data Integration |
| 32 | Informix | informix | Low | Database |
| 33 | MANTA Automated Data Lineage | mantaflow | Medium | Governance |
| 34 | MongoDB | mongodb | Medium | Database |
| 35 | OpenPages | openpages | High | Governance |
| 36 | Orchestration Pipelines | ws-pipelines | High | Orchestration |
| 37 | Planning Analytics | planning-analytics | Medium | Analytics |
| 38 | Product Master | productmaster | Low | Data Management |
| 39 | RStudio Server Runtimes | rstudio | Medium | Development |
| 40 | SPSS Modeler | spss | Medium | Analytics |
| 41 | Synthetic Data Generator | syntheticdata | Low | Data Generation |
| 42 | Unstructured Data Integration | udp | Medium | Data Integration |
| 43 | Voice Gateway | voice-gateway | Low | AI/ML |
| 44 | Watson Discovery | watson-discovery | High | AI/ML |
| 45 | Watson Speech services | watson-speech | Medium | AI/ML |
| 46 | Watson Studio Runtimes | ws-runtimes | High | Development |
| 47 | watsonx Assistant | watson-assistant | High | AI/ML |
| 48 | watsonx BI | watsonx_bi | Medium | Analytics |
| 49 | watsonx Code Assistant | wca | High | Development |
| 50 | watsonx Code Assistant for Red Hat Ansible Lightspeed | wca-ansible | Medium | Development |
| 51 | watsonx Code Assistant for Z | wca-z | Medium | Development |
| 52 | watsonx Code Assistant for Z Agentic | wca-z-agentic | Low | Development |
| 53 | watsonx Code Assistant for Z Code Explanation | wca-z-ce | Low | Development |
| 54 | watsonx Code Assistant for Z Code Generation | wca-z-codegen | Low | Development |
| 55 | watsonx Code Assistant for Z Understand | wca-z-understand | Low | Development |
| 56 | watsonx.data Premium | watsonx_data_premium | High | Data Platform |
| 57 | watsonx.data integration | watsonx_dataintegration | High | Data Integration |
| 58 | watsonx.data intelligence | watsonx_dataintelligence | High | Data Intelligence |
| 59 | watsonx Orchestrate | watsonx_orchestrate | High | Orchestration |
| 60 | Data Observability | data_observability | Medium | Data Quality |
| 61 | IBM Unstructured Data Integration | unstructured_data_integration | Medium | Data Integration |
| 62 | IBM Robotic Process Automation | rpa | Low | Automation |

---

## Priority Breakdown

### High Priority (20 components)
These are commonly used services that should be added to provide comprehensive coverage:

1. AI Factsheets
2. Analytics Engine powered by Apache Spark
3. Data Product Hub
4. Data Refinery
5. IBM Knowledge Catalog (base version)
6. OpenPages
7. Orchestration Pipelines
8. Watson Discovery
9. Watson Studio Runtimes
10. watsonx Assistant
11. watsonx Code Assistant
12. watsonx.data Premium
13. watsonx.data integration
14. watsonx.data intelligence
15. watsonx Orchestrate

### Medium Priority (22 components)
Important services for specific use cases:

16. Anaconda Repository
17. Cognos Dashboards
18. Data Privacy
19. Data Replication
20. Db2 Data Management Console
21. Decision Optimization
22. EDB Postgres
23. IBM Manta Data Lineage
24. IBM Master Data Management
25. IBM StreamSets
26. MANTA Automated Data Lineage
27. MongoDB
28. Planning Analytics
29. RStudio Server Runtimes
30. SPSS Modeler
31. Unstructured Data Integration
32. Watson Speech services
33. watsonx BI
34. watsonx Code Assistant for Red Hat Ansible Lightspeed
35. watsonx Code Assistant for Z
36. Data Observability
37. IBM Unstructured Data Integration

### Low Priority (9 components)
Specialized or less commonly used services:

38. Data Gate
39. Db2 Big SQL
40. Execution Engine for Apache Hadoop
41. Informix
42. Product Master
43. Synthetic Data Generator
44. Voice Gateway
45. watsonx Code Assistant for Z Agentic
46. watsonx Code Assistant for Z Code Explanation
47. watsonx Code Assistant for Z Code Generation
48. watsonx Code Assistant for Z Understand
49. IBM Robotic Process Automation

---

## Attribute Coverage Analysis

### Current Mock Component Attributes

Each mock component currently includes:
- ✅ `id`: Unique identifier
- ✅ `name`: Display name
- ✅ `description`: Brief description
- ✅ `category`: Component category
- ✅ `version`: Version string
- ✅ `size`: Deployment size
- ✅ `dependencies`: Array of dependency IDs
- ✅ `conflicts`: Array of conflicting component IDs
- ✅ `status`: Installation status
- ✅ `configSchema`: Configuration form schema

### Missing Attributes from YAML

The YAML file contains additional metadata that should be incorporated:

- ❌ `restrictions`: Installation restrictions (e.g., mutual exclusivity)
- ❌ `external_dependencies`: External system requirements
- ❌ `service_dependencies`: Required/optional service dependencies
- ❌ `component_dependencies`: Auto-installed components
- ❌ `version_constraints`: Version-specific behaviors
- ❌ `notes`: Important installation notes
- ❌ `references`: Documentation URLs
- ❌ `original_name`: Original component name from deployer
- ❌ `install_behavior`: Auto-install, must_exist, etc.
- ❌ `conditional_dependencies`: Condition-based dependencies

---

## Dependency Mapping Analysis

### Dependency Types in YAML

1. **External Dependencies**
   - `required`: Must exist before installation
   - `conditional`: Required under specific conditions

2. **Service Dependencies**
   - `required`: Other services that must be installed
   - `optional`: Services that enhance functionality
   - `conditional`: Services installed based on configuration

3. **Component Dependencies**
   - `auto_installed`: Components automatically installed
   - `conditional`: Components installed based on conditions

### Current Mock Implementation

The current mock components use a simplified dependency model:
- Single `dependencies` array (maps to required service dependencies)
- Single `conflicts` array (maps to restrictions)
- Missing: conditional dependencies, external dependencies, auto-installed components

---

## Recommendations

### Phase 1: Enhance Existing Components (Immediate)

1. **Add Missing Attributes**
   - Add `restrictions` field to existing components
   - Add `external_dependencies` structure
   - Add `service_dependencies` with required/optional/conditional
   - Add `component_dependencies` with auto_installed/conditional
   - Add `notes` and `references` arrays
   - Add `original_name` field

2. **Update Type Definitions**
   - Extend `CloudPakComponent` interface in `types/component.types.ts`
   - Add new interfaces for dependency structures
   - Update DependencyResolver to handle new dependency types

### Phase 2: Add High Priority Components (Week 1-2)

Add the 20 high-priority components with full attribute coverage:
- AI Factsheets
- Analytics Engine powered by Apache Spark
- Data Product Hub
- Data Refinery
- IBM Knowledge Catalog
- OpenPages
- Orchestration Pipelines
- Watson Discovery
- Watson Studio Runtimes
- watsonx Assistant
- watsonx Code Assistant
- watsonx.data Premium
- watsonx.data integration
- watsonx.data intelligence
- watsonx Orchestrate

### Phase 3: Add Medium Priority Components (Week 3-4)

Add the 22 medium-priority components with full metadata.

### Phase 4: Add Low Priority Components (Week 5+)

Add remaining 9 low-priority components as needed.

### Phase 5: Enhance Dependency Resolution (Ongoing)

1. Implement conditional dependency logic
2. Add external dependency validation
3. Implement auto-install component handling
4. Add version constraint checking
5. Implement restriction validation (mutual exclusivity)

---

## Implementation Strategy

### Step 1: Create Enhanced Type Definitions

```typescript
interface ExternalDependency {
  name: string;
  type: 'operator' | 'platform_software' | 'external_system' | 'license' | 'network_requirement' | 'client_software' | 'subscription';
  install_behavior?: 'must_exist' | 'auto_installed';
  notes?: string[];
}

interface ServiceDependency {
  name: string;
  type: 'service' | 'shared_cluster_component';
  install_behavior?: 'auto_installed';
  notes?: string[];
}

interface ComponentDependency {
  name: string;
  type: 'component';
  original_name: string;
  install_behavior: 'auto_installed';
}

interface ConditionalDependency {
  condition: {
    expression: string;
  };
  requires?: ServiceDependency[];
  installs?: (ServiceDependency | ComponentDependency)[];
  notes?: string[];
}

interface CloudPakComponentEnhanced extends CloudPakComponent {
  original_name?: string;
  restrictions: string[];
  external_dependencies: {
    required: ExternalDependency[];
    conditional: ConditionalDependency[];
  };
  service_dependencies: {
    required: ServiceDependency[];
    optional: ServiceDependency[];
    conditional: ConditionalDependency[];
  };
  component_dependencies: {
    auto_installed: ComponentDependency[];
    conditional: ConditionalDependency[];
  };
  version_constraints: any[];
  notes: string[];
  references: Array<{ name: string; url: string }>;
}
```

### Step 2: Create Data Migration Script

Create a script to transform YAML data into enhanced mock components:
- Parse `ibm_software_hub_requirements_normalized_operational.yaml`
- Map service names to component IDs
- Generate enhanced mock component objects
- Validate against new type definitions

### Step 3: Update DependencyResolver

Enhance the dependency resolution algorithm to:
- Process conditional dependencies
- Handle auto-installed components
- Validate external dependencies
- Check version constraints
- Enforce restrictions

### Step 4: Update UI Components

- Update ComponentCard to display restrictions and notes
- Add external dependency indicators
- Show auto-installed component badges
- Display conditional dependency information
- Add reference links to documentation

---

## Conclusion

The current mock implementation covers 21% (13/62) of the services defined in the authoritative YAML file. To provide a comprehensive and production-ready UI, we need to:

1. **Immediate**: Enhance existing 13 components with full attribute coverage
2. **Short-term**: Add 20 high-priority components (weeks 1-2)
3. **Medium-term**: Add 22 medium-priority components (weeks 3-4)
4. **Long-term**: Add 9 low-priority components and enhance dependency resolution

This phased approach ensures that the most commonly used components are available first while maintaining data accuracy and completeness based on the official IBM dependency requirements.

---

**Next Steps:**
1. Review and approve this gap analysis
2. Update type definitions for enhanced attributes
3. Begin Phase 1: Enhance existing 13 components
4. Create automated data migration script
5. Implement Phase 2: Add high-priority components