# Phase 1.5.5: Low Priority Components Implementation Guide

## Overview

**Objective:** Add final 9 low-priority Cloud Pak components to reach 100% coverage (63/62 components)

**Current Status:**
- Components before Phase 1.5.5: 54 (after Phase 1.5.4)
- Components to add: 9
- Total after Phase 1.5.5: 63
- Coverage: 102% (63/62 - includes some extras)

**Timeline:** 1 day

---

## Components Already Added (Excluded from Phase 1.5.5)

From the low-priority list, these were already added in previous phases:
- ✅ Data Gate (datagate) - Added in Phase 1.5.3
- ✅ Db2 Big SQL (bigsql) - Added in Phase 1.5.3  
- ✅ Voice Gateway (voice-gateway) - Added in Phase 1.5.3
- ✅ Synthetic Data Generator (syntheticdata) - Added in Phase 1.5.4
- ✅ Informix (informix) - Added in Phase 1.5.4

---

## 9 Low-Priority Components to Add

### Batch 1: Specialized Data Services (2 components)

1. **Execution Engine for Apache Hadoop** (hee)
   - Category: Analytics
   - YAML Line: 593
   - Dependencies: Watson Studio (required), Hadoop cluster (external)
   - Complexity: High (external Hadoop cluster requirement)

2. **Product Master** (productmaster)
   - Category: Data Management
   - YAML Line: From reference-config.yaml
   - Dependencies: Db2 instance secret setup required
   - Complexity: Medium (requires pre-configuration)

### Batch 2: watsonx Code Assistant Variants (4 components)

3. **watsonx Code Assistant for Z Code Explanation** (wca-z-ce)
   - Category: AI & Machine Learning
   - YAML Line: From reference-config.yaml
   - Dependencies: GPU operators
   - Complexity: Low (variant of wca-z)

4. **watsonx Code Assistant for Z Agentic** (wca-z-agentic)
   - Category: AI & Machine Learning
   - YAML Line: Not in main YAML
   - Dependencies: GPU operators
   - Complexity: Low (specialized variant)

5. **watsonx Code Assistant for Z Code Generation** (wca-z-codegen)
   - Category: AI & Machine Learning
   - YAML Line: Not in main YAML
   - Dependencies: GPU operators
   - Complexity: Low (specialized variant)

6. **watsonx Code Assistant for Z Understand** (wca-z-understand)
   - Category: AI & Machine Learning
   - YAML Line: Not in main YAML
   - Dependencies: GPU operators
   - Complexity: Low (specialized variant)

### Batch 3: Automation & Additional Services (3 components)

7. **IBM Robotic Process Automation** (rpa)
   - Category: Automation
   - YAML Line: Not in main YAML (low usage)
   - Dependencies: None
   - Complexity: Low (standalone service)

8. **Watson Machine Learning Accelerator** (wml-accelerator)
   - Category: AI & Machine Learning
   - YAML Line: From reference-config.yaml
   - Dependencies: GPU support
   - Complexity: Medium (GPU acceleration)

9. **Scheduler** (scheduler)
   - Category: Integration
   - YAML Line: From reference-config.yaml
   - Dependencies: None
   - Complexity: Low (job scheduling)

---

## Implementation Strategy

### Step 1: Read Reference Data
Most of these components are in reference-config.yaml since they're specialized/low-usage services not fully documented in the main YAML.

### Step 2: Create Component Objects
For each component, create a complete object with:
- Basic metadata (id, name, description, category)
- External dependencies (GPU operators where applicable)
- Service dependencies (minimal for low-priority components)
- Component dependencies (CCS where applicable)
- Configuration schema (minimal for specialized services)
- State and version

### Step 3: Add to mockComponents.ts
Use documentation approach similar to Phase 1.5.4 - create complete component data document.

### Step 4: Verify Build
Run `npm run build` to ensure TypeScript compilation succeeds.

### Step 5: Test UI
Verify all 63 components appear in the UI with correct filtering and dependencies.

---

## Component Templates

### Template 1: Basic Specialized Service

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

### Template 2: GPU-Dependent Service

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

### Template 3: Service with External System Requirement

```typescript
{
  id: 'component-id',
  name: 'Component Name',
  originalName: 'original_name',
  description: 'Component description',
  category: 'Category',
  restrictions: [],
  externalDependencies: [
    {
      name: 'External System Name',
      type: 'external_system',
      installBehavior: 'must_exist',
      notes: ['Specific requirements']
    }
  ],
  serviceDependencies: [
    {
      name: 'Required Service',
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
}
```

---

## Success Criteria

- ✅ All 9 components added to mockComponents.ts
- ✅ TypeScript compilation passes with no errors
- ✅ Total component count: 63 (54 existing + 9 new)
- ✅ Component coverage: 102% (63/62 - exceeds target)
- ✅ All components visible in UI
- ✅ Category distribution correct
- ✅ Dependency information accurate
- ✅ Configuration schemas defined

---

## Expected Component Distribution After Phase 1.5.5

- **AI & Machine Learning:** 18 components (+5 wca-z variants, +1 wml-accelerator)
- **Data Management:** 19 components (+1 Product Master)
- **Analytics:** 7 components (+1 Execution Engine for Hadoop)
- **Governance:** 10 components (no change)
- **Integration:** 6 components (+1 Scheduler)
- **Development Tools:** 2 components (no change)
- **Automation:** 1 component (+1 RPA)

---

## Next Steps After Phase 1.5.5

1. **Phase 1.5.6:** Enhance dependency resolver with conditional logic
2. **Phase 1.5.7:** Update UI components for better dependency visualization
3. **Phase 2:** Build Configuration Page
4. **Phase 3:** Build Deployment Page
5. **Phase 4:** API Integration
6. **Phase 5:** Testing & Polish

---

## Notes

- These are specialized/low-usage components
- Some may have limited documentation in main YAML
- Focus on basic implementation with minimal configuration
- GPU-dependent variants share similar structure
- External system dependencies require clear documentation

---

**Document Status:** Ready for Implementation  
**Estimated Time:** 1-2 hours for all 9 components  
**Dependencies:** Phase 1.5.4 must be complete (✅ Complete)  
**Target:** 100%+ component coverage