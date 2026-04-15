# Phase 2: Configuration Page - Detailed Implementation Plan

## Executive Summary

This document provides a comprehensive implementation plan for Phase 2 of the Cloud Pak Deployer UI: the Configuration Page. This phase builds upon the completed Phase 1 (Component Selection) and Phase 1.5 (Component Coverage Expansion) to create a professional configuration interface where users can customize their selected components and generate valid `config.yaml` files.

**Current Status:**
- ✅ Phase 1 Complete: Component Selection with 63 components (101% coverage)
- ✅ Phase 1.5 Complete: Enhanced dependency resolution and UI components
- 🚀 Phase 2 Starting: Configuration Page with dynamic forms and YAML preview

**Key Objectives:**
1. Create intuitive configuration forms for global settings and component-specific options
2. Implement real-time YAML preview with syntax highlighting
3. Provide comprehensive validation with clear error messages
4. Enable save/load/export/import functionality for configurations
5. Ensure generated YAML matches reference-config.yaml structure exactly

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Existing Infrastructure Analysis](#2-existing-infrastructure-analysis)
3. [Component Breakdown](#3-component-breakdown)
4. [Data Flow & State Management](#4-data-flow--state-management)
5. [UI/UX Design](#5-uiux-design)
6. [Implementation Steps](#6-implementation-steps)
7. [Validation Strategy](#7-validation-strategy)
8. [Testing Plan](#8-testing-plan)
9. [Success Criteria](#9-success-criteria)

---

## 1. Architecture Overview

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Configuration Page                            │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Left Panel (60%)          │  Right Panel (40%)            │ │
│  │  ┌──────────────────────┐  │  ┌──────────────────────────┐│ │
│  │  │  Configuration Form  │  │  │    YAML Preview          ││ │
│  │  │  ┌────────────────┐  │  │  │  ┌────────────────────┐ ││ │
│  │  │  │ Global Config  │  │  │  │  │  Syntax Highlight  │ ││ │
│  │  │  │ - Environment  │  │  │  │  │  Line Numbers      │ ││ │
│  │  │  │ - Platform     │  │  │  │  │  Copy Button       │ ││ │
│  │  │  │ - Cluster      │  │  │  │  │  Download Button   │ ││ │
│  │  │  └────────────────┘  │  │  │  └────────────────────┘ ││ │
│  │  │  ┌────────────────┐  │  │  │                          ││ │
│  │  │  │ Component      │  │  │  │  Updates in real-time   ││ │
│  │  │  │ Configurations │  │  │  │  as user edits forms    ││ │
│  │  │  │ - Selected     │  │  │  │                          ││ │
│  │  │  │   components   │  │  │  │  Validates YAML         ││ │
│  │  │  │ - Dynamic      │  │  │  │  structure              ││ │
│  │  │  │   fields       │  │  │  │                          ││ │
│  │  │  └────────────────┘  │  │  │                          ││ │
│  │  └──────────────────────┘  │  └──────────────────────────┘│ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Action Bar: Save | Load | Export | Import | Reset         │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │   configStore    │
                    │  - configuration │
                    │  - generateYAML  │
                    │  - validate      │
                    │  - save/load     │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  componentStore  │
                    │  - selected      │
                    │  - components    │
                    └──────────────────┘
```

### 1.2 Two-Panel Layout Design

**Left Panel (Configuration Forms):**
- Scrollable container with sections
- Accordion-style expandable sections
- Form fields with Carbon Design components
- Inline validation with error messages
- Contextual help tooltips

**Right Panel (YAML Preview):**
- Fixed position, scrollable
- Syntax-highlighted YAML
- Line numbers for reference
- Copy to clipboard button
- Download as file button
- Real-time updates as user types

---

## 2. Existing Infrastructure Analysis

### 2.1 ConfigStore (Already Implemented)

**Location:** `deployer-web/ui/src/stores/configStore.ts` (292 lines)

**Current Capabilities:**
```typescript
interface ConfigStore {
  // State
  configuration: CloudPakConfig | null;
  isDirty: boolean;
  validationErrors: Record<string, string[]>;
  isLoading: boolean;
  error: string | null;

  // Actions
  initializeConfig: () => void;                    // ✅ Ready
  updateGlobalConfig: (config: Partial<GlobalConfig>) => void;  // ✅ Ready
  updateComponentConfig: (componentId: string, config: Partial<CartridgeConfig>) => void;  // ✅ Ready
  generateYAML: () => string;                      // ✅ Ready
  validateConfiguration: () => boolean;            // ✅ Ready
  saveConfiguration: (name: string, description?: string) => void;  // ✅ Ready
  loadConfiguration: (name: string) => void;       // ✅ Ready
  getSavedConfigurations: () => SavedConfiguration[];  // ✅ Ready
  exportConfiguration: () => void;                 // ✅ Ready
  importConfiguration: (yamlString: string) => void;  // ✅ Ready
  resetConfiguration: () => void;                  // ✅ Ready
  setComponentState: (componentId: string, state: 'installed' | 'removed') => void;  // ✅ Ready
}
```

**Key Features Already Available:**
- ✅ YAML generation using js-yaml library
- ✅ Configuration persistence to localStorage
- ✅ Import/export functionality
- ✅ Validation framework
- ✅ State management with Zustand
- ✅ Uses REFERENCE_CONFIG as template

**What We Need to Add:**
- Enhanced validation rules for specific fields
- Component-specific configuration schemas
- Better error messaging
- Validation for component dependencies

### 2.2 ComponentStore Integration

**Location:** `deployer-web/ui/src/stores/componentStore.ts`

**Available Data:**
```typescript
interface ComponentStore {
  selectedComponents: Set<string>;     // ✅ User selections
  components: CloudPakComponent[];     // ✅ All 63 components
  resolutionResult: ResolutionResult | null;  // ✅ Dependency info
  conflicts: Conflict[];               // ✅ Conflict detection
}
```

**Integration Points:**
- Read selected components to show only relevant configuration forms
- Use component metadata to generate dynamic form fields
- Display dependency information in configuration context
- Show warnings for components with restrictions

### 2.3 Reference Config Structure

**Location:** `references/reference-config.yaml` (664 lines)

**Structure Analysis:**
```yaml
global_config:           # ← Section 1: Global settings
  environment_name: demo
  cloud_platform: existing-ocp
  confirm_destroy: False
  optimize_deploy: True
  env_id: cpd-demo

openshift:              # ← Section 2: OpenShift cluster config
- name: "{{ env_id }}"
  ocp_version: detect
  cluster_name: "{{ env_id }}"
  domain_name: example.com
  mcg: { ... }
  gpu: { ... }
  openshift_ai: { ... }
  openshift_storage: [ ... ]

cp4d:                   # ← Section 3: Cloud Pak for Data
- project: cpd
  openshift_cluster_name: "{{ env_id }}"
  cp4d_version: latest
  cp4d_entitlement: [ ... ]
  state: installed
  cartridges:           # ← Section 4: Component configurations
  - name: cp-foundation
    scale: level_1
    license_service: { ... }
  - name: lite
  - name: scheduler
    state: removed
  - name: analyticsengine
    description: Analytics Engine Powered by Apache Spark
    size: small
    state: removed
    installation_options: { ... }
  # ... 60+ more components
```

**Key Observations:**
1. **Template Variables:** Uses `{{ env_id }}` for dynamic values
2. **State Management:** Each cartridge has `state: installed|removed`
3. **Optional Fields:** Many fields are optional (size, instances, installation_options)
4. **Nested Structures:** Complex nested objects for installation_options
5. **Array Fields:** Some components have instances arrays

---

## 3. Component Breakdown

### 3.1 Main Components

#### 3.1.1 ConfigurationPage (Main Container)
**File:** `src/pages/ConfigurationPage.tsx`

**Responsibilities:**
- Layout management (two-panel design)
- Route integration
- Action bar with save/load/export/import buttons
- Coordination between form and preview panels

**Props:** None (uses stores)

**State:**
- Local UI state (panel sizes, active section)
- Subscribes to configStore and componentStore

**Carbon Components Used:**
- `Grid`, `Column` for layout
- `Button` for actions
- `InlineNotification` for success/error messages
- `Modal` for import dialog

---

#### 3.1.2 ConfigurationForm (Left Panel)
**File:** `src/components/configuration/ConfigurationForm.tsx`

**Responsibilities:**
- Render all configuration sections
- Manage form state
- Handle form submission
- Coordinate validation

**Structure:**
```tsx
<ConfigurationForm>
  <GlobalConfigSection />
  <OpenShiftConfigSection />
  <CP4DConfigSection />
  <ComponentConfigList>
    {selectedComponents.map(component => (
      <ComponentConfigSection key={component.id} component={component} />
    ))}
  </ComponentConfigList>
</ConfigurationForm>
```

**Carbon Components Used:**
- `Form`
- `Accordion`, `AccordionItem` for sections
- `Stack` for vertical spacing

---

#### 3.1.3 GlobalConfigSection
**File:** `src/components/configuration/GlobalConfigSection.tsx`

**Responsibilities:**
- Render global_config fields
- Handle environment name, cloud platform, env_id
- Validate required fields

**Fields:**
```typescript
interface GlobalConfigFields {
  environment_name: string;      // Required, alphanumeric
  cloud_platform: string;        // Required, dropdown: existing-ocp, aws, azure, ibm-cloud
  confirm_destroy: boolean;      // Checkbox
  optimize_deploy: boolean;      // Checkbox
  env_id: string;               // Required, alphanumeric, used in templates
}
```

**Carbon Components Used:**
- `TextInput` for text fields
- `Dropdown` for cloud_platform
- `Checkbox` for boolean fields
- `FormGroup` for grouping
- `Tooltip` for help text

---

#### 3.1.4 OpenShiftConfigSection
**File:** `src/components/configuration/OpenShiftConfigSection.tsx`

**Responsibilities:**
- Render OpenShift cluster configuration
- Handle cluster name, domain, storage settings
- Configure GPU, OpenShift AI, MCG options

**Fields:**
```typescript
interface OpenShiftConfigFields {
  name: string;                  // Template variable
  ocp_version: string;           // Default: detect
  cluster_name: string;          // Template variable
  domain_name: string;           // Required, domain format
  mcg: {
    install: boolean;
    storage_type: string;
    storage_class: string;
  };
  gpu: {
    install: string;             // auto | true | false
  };
  openshift_ai: {
    install: string;             // auto | true | false
    channel: string;             // auto | specific version
  };
  openshift_storage: Array<{
    storage_name: string;
    storage_type: string;
  }>;
}
```

**Carbon Components Used:**
- `TextInput` for text fields
- `Dropdown` for select fields
- `Toggle` for boolean options
- `Accordion` for nested sections

---

#### 3.1.5 CP4DConfigSection
**File:** `src/components/configuration/CP4DConfigSection.tsx`

**Responsibilities:**
- Render CP4D project configuration
- Handle version, entitlement, license settings
- Configure operators project

**Fields:**
```typescript
interface CP4DConfigFields {
  project: string;                      // Required, k8s name format
  openshift_cluster_name: string;       // Template variable
  cp4d_version: string;                 // latest | specific version
  cp4d_entitlement: string[];           // Multi-select dropdown
  cp4d_production_license: boolean;     // Checkbox
  accept_licenses: boolean;             // Checkbox, must be true to deploy
  db2u_limited_privileges: boolean;     // Checkbox
  operators_project: string;            // Required, k8s name format
  ibm_cert_manager: boolean;            // Checkbox
  install_day0_patch: boolean;          // Checkbox
  state: string;                        // installed | removed
}
```

**Carbon Components Used:**
- `TextInput` for text fields
- `Dropdown` for version selection
- `MultiSelect` for entitlements
- `Checkbox` for boolean fields
- `InlineNotification` for license warning

---

#### 3.1.6 ComponentConfigSection
**File:** `src/components/configuration/ComponentConfigSection.tsx`

**Responsibilities:**
- Render configuration for a single selected component
- Generate dynamic form fields based on component schema
- Handle component-specific options (size, instances, installation_options)
- Display component dependencies and restrictions

**Props:**
```typescript
interface ComponentConfigSectionProps {
  component: CloudPakComponent;
  config: CartridgeConfig;
  onChange: (config: Partial<CartridgeConfig>) => void;
  errors?: string[];
}
```

**Dynamic Fields Based on Component:**
```typescript
// Common fields for all components
interface BaseCartridgeConfig {
  name: string;                    // Read-only, from component
  description?: string;            // Optional
  state: 'installed' | 'removed';  // Always 'installed' for selected
}

// Optional fields (component-dependent)
interface OptionalCartridgeFields {
  size?: 'small' | 'medium' | 'large';  // If component supports sizing
  instances?: Array<{              // If component supports instances
    name: string;
    description?: string;
    size?: string;
    storage_size_gb?: number;
    // ... component-specific instance fields
  }>;
  installation_options?: Record<string, any>;  // Component-specific options
  replicas?: number;               // For some components
  // ... many more optional fields
}
```

**Carbon Components Used:**
- `Accordion`, `AccordionItem` for component grouping
- `TextInput` for text fields
- `NumberInput` for numeric fields
- `Dropdown` for select fields
- `Checkbox` for boolean options
- `Toggle` for on/off options
- `Tag` for showing dependencies
- `InlineNotification` for warnings

---

#### 3.1.7 YAMLPreview (Right Panel)
**File:** `src/components/configuration/YAMLPreview.tsx`

**Responsibilities:**
- Display generated YAML with syntax highlighting
- Provide copy to clipboard functionality
- Provide download as file functionality
- Show validation errors inline
- Auto-scroll to error locations

**Features:**
```typescript
interface YAMLPreviewProps {
  yaml: string;
  errors?: ValidationError[];
  onCopy?: () => void;
  onDownload?: () => void;
}
```

**Implementation Details:**
- Use `react-syntax-highlighter` for YAML syntax highlighting
- Use `Prism` theme matching Carbon Design dark/light mode
- Line numbers for easy reference
- Sticky header with action buttons
- Error indicators at specific line numbers

**Carbon Components Used:**
- `CodeSnippet` (or custom implementation)
- `Button` for copy/download
- `InlineNotification` for errors
- `Tag` for line number indicators

---

#### 3.1.8 ConfigurationValidator
**File:** `src/services/configuration/ConfigurationValidator.ts`

**Responsibilities:**
- Validate all configuration fields
- Check required fields
- Validate field formats (domain names, k8s names, etc.)
- Validate component dependencies
- Check for conflicting configurations
- Return structured error messages

**Validation Rules:**
```typescript
interface ValidationRule {
  field: string;
  validator: (value: any, config: CloudPakConfig) => boolean;
  errorMessage: string;
  severity: 'error' | 'warning';
}

// Example rules:
const VALIDATION_RULES: ValidationRule[] = [
  {
    field: 'global_config.environment_name',
    validator: (value) => /^[a-zA-Z0-9-]+$/.test(value),
    errorMessage: 'Environment name must be alphanumeric with hyphens',
    severity: 'error'
  },
  {
    field: 'global_config.env_id',
    validator: (value) => /^[a-z0-9-]+$/.test(value) && value.length <= 20,
    errorMessage: 'Environment ID must be lowercase alphanumeric, max 20 chars',
    severity: 'error'
  },
  {
    field: 'openshift[0].domain_name',
    validator: (value) => /^[a-z0-9.-]+\.[a-z]{2,}$/.test(value),
    errorMessage: 'Domain name must be a valid domain format',
    severity: 'error'
  },
  {
    field: 'cp4d[0].accept_licenses',
    validator: (value) => value === true,
    errorMessage: 'You must accept licenses to proceed with deployment',
    severity: 'error'
  },
  // ... many more rules
];
```

**Methods:**
```typescript
class ConfigurationValidator {
  validate(config: CloudPakConfig): ValidationResult;
  validateField(field: string, value: any): FieldValidationResult;
  validateComponent(component: CartridgeConfig): ComponentValidationResult;
  validateDependencies(config: CloudPakConfig): DependencyValidationResult;
}
```

---

#### 3.1.9 ConfigurationImportModal
**File:** `src/components/configuration/ConfigurationImportModal.tsx`

**Responsibilities:**
- Allow users to paste or upload YAML configuration
- Parse and validate imported YAML
- Show preview of what will be imported
- Handle import errors gracefully

**Features:**
- Text area for pasting YAML
- File upload button
- YAML validation before import
- Preview of parsed configuration
- Confirmation before applying

**Carbon Components Used:**
- `Modal`
- `TextArea` for YAML input
- `FileUploader` for file upload
- `Button` for actions
- `InlineNotification` for errors

---

#### 3.1.10 SavedConfigurationsList
**File:** `src/components/configuration/SavedConfigurationsList.tsx`

**Responsibilities:**
- Display list of saved configurations
- Allow loading saved configurations
- Allow deleting saved configurations
- Show configuration metadata (name, date, description)

**Features:**
- List view with configuration cards
- Search/filter saved configurations
- Load button for each configuration
- Delete button with confirmation
- Export individual configurations

**Carbon Components Used:**
- `DataTable` or `StructuredList`
- `Button` for actions
- `Modal` for delete confirmation
- `Search` for filtering

---

### 3.2 Component Hierarchy

```
ConfigurationPage
├── ConfigurationForm (Left Panel)
│   ├── GlobalConfigSection
│   │   ├── TextInput (environment_name)
│   │   ├── Dropdown (cloud_platform)
│   │   ├── TextInput (env_id)
│   │   ├── Checkbox (confirm_destroy)
│   │   └── Checkbox (optimize_deploy)
│   ├── OpenShiftConfigSection
│   │   ├── TextInput (name, cluster_name, domain_name)
│   │   ├── Accordion (MCG Settings)
│   │   ├── Accordion (GPU Settings)
│   │   ├── Accordion (OpenShift AI Settings)
│   │   └── Accordion (Storage Settings)
│   ├── CP4DConfigSection
│   │   ├── TextInput (project, operators_project)
│   │   ├── Dropdown (cp4d_version)
│   │   ├── MultiSelect (cp4d_entitlement)
│   │   └── Checkbox (licenses, options)
│   └── ComponentConfigList
│       └── ComponentConfigSection (for each selected component)
│           ├── Accordion (Component Header)
│           ├── Dropdown (size, if applicable)
│           ├── NumberInput (replicas, if applicable)
│           ├── Accordion (Instances, if applicable)
│           └── Accordion (Installation Options, if applicable)
├── YAMLPreview (Right Panel)
│   ├── Header (with Copy/Download buttons)
│   ├── SyntaxHighlighter (YAML content)
│   └── ErrorIndicators (if validation errors)
└── ActionBar
    ├── Button (Save Configuration)
    ├── Button (Load Configuration)
    ├── Button (Export YAML)
    ├── Button (Import YAML)
    └── Button (Reset to Defaults)
```

---

## 4. Data Flow & State Management

### 4.1 State Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    User Interactions                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              ConfigurationForm Components                    │
│  - GlobalConfigSection                                       │
│  - OpenShiftConfigSection                                    │
│  - CP4DConfigSection                                         │
│  - ComponentConfigSection (multiple)                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ onChange events
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     configStore                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ updateGlobalConfig(config)                            │  │
│  │ updateComponentConfig(id, config)                     │  │
│  │ setComponentState(id, state)                          │  │
│  └───────────────────────────────────────────────────────┘  │
│                              │                               │
│                              ▼                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ configuration: CloudPakConfig                         │  │
│  │ - global_config                                       │  │
│  │ - openshift[]                                         │  │
│  │ - cp4d[]                                              │  │
│  │   - cartridges[]                                      │  │
│  └───────────────────────────────────────────────────────┘  │
│                              │                               │
│                              ▼                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ generateYAML()                                        │  │
│  │ - Uses js-yaml library                                │  │
│  │ - Applies REFERENCE_CONFIG template                   │  │
│  │ - Sets component states based on selections           │  │
│  └───────────────────────────────────────────────────────┘  │
│                              │                               │
│                              ▼                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ validateConfiguration()                               │  │
│  │ - Runs all validation rules                           │  │
│  │ - Returns errors by field                             │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Subscribe to changes
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    YAMLPreview Component                     │
│  - Displays generated YAML                                   │
│  - Shows validation errors                                   │
│  - Updates in real-time                                      │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Integration with ComponentStore

```typescript
// In ConfigurationPage or ConfigurationForm
const selectedComponents = useComponentStore(state => state.selectedComponents);
const components = useComponentStore(state => state.components);

// Filter to get only selected component details
const selectedComponentDetails = components.filter(c => 
  selectedComponents.has(c.id)
);

// Render configuration sections for each selected component
{selectedComponentDetails.map(component => (
  <ComponentConfigSection 
    key={component.id}
    component={component}
    config={getComponentConfig(component.id)}
    onChange={(config) => updateComponentConfig(component.id, config)}
  />
))}
```

### 4.3 YAML Generation Flow

```typescript
// In configStore.ts
generateYAML: () => {
  const { configuration } = get();
  if (!configuration) return '';

  // Start with reference config structure
  const yamlConfig = {
    global_config: configuration.global_config,
    openshift: configuration.openshift,
    cp4d: configuration.cp4d.map(cp4d => ({
      ...cp4d,
      cartridges: [
        // Always include foundation and lite
        { name: 'cp-foundation', scale: 'level_1', license_service: { threads_per_core: 2 } },
        { name: 'lite' },
        // Add selected components with state: installed
        ...selectedComponents.map(id => {
          const component = components.find(c => c.id === id);
          const config = componentConfigs[id] || {};
          return {
            name: component.name,
            description: component.description,
            state: 'installed',
            ...config  // User-provided configuration
          };
        }),
        // Add non-selected components with state: removed
        ...nonSelectedComponents.map(id => {
          const component = components.find(c => c.id === id);
          return {
            name: component.name,
            description: component.description,
            state: 'removed'
          };
        })
      ]
    }))
  };

  // Convert to YAML string
  return yaml.dump(yamlConfig, {
    indent: 2,
    lineWidth: -1,
    noRefs: true,
    sortKeys: false
  });
}
```

---

## 5. UI/UX Design

### 5.1 Layout Specifications

**Desktop (≥1280px):**
```
┌────────────────────────────────────────────────────────────┐
│  Header (64px)                                              │
├────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────┬──────────────────────────┐   │
│  │  Configuration Form      │  YAML Preview            │   │
│  │  (60% width)             │  (40% width)             │   │
│  │  ┌────────────────────┐  │  ┌────────────────────┐  │   │
│  │  │ Global Config      │  │  │ # config.yaml      │  │   │
│  │  │ [Expanded]         │  │  │ global_config:     │  │   │
│  │  │  - Environment     │  │  │   environment_name │  │   │
│  │  │  - Platform        │  │  │   cloud_platform   │  │   │
│  │  │  - Env ID          │  │  │ ...                │  │   │
│  │  └────────────────────┘  │  └────────────────────┘  │   │
│  │  ┌────────────────────┐  │                          │   │
│  │  │ OpenShift Config   │  │  [Copy] [Download]      │   │
│  │  │ [Collapsed]        │  │                          │   │
│  │  └────────────────────┘  │  Sticky header          │   │
│  │  ┌────────────────────┐  │  Scrollable content     │   │
│  │  │ CP4D Config        │  │                          │   │
│  │  │ [Collapsed]        │  │                          │   │
│  │  └────────────────────┘  │                          │   │
│  │  ┌────────────────────┐  │                          │   │
│  │  │ Components (3)     │  │                          │   │
│  │  │ [Collapsed]        │  │                          │   │
│  │  └────────────────────┘  │                          │   │
│  │                          │                          │   │
│  │  Scrollable              │  Fixed position          │   │
│  └──────────────────────────┴──────────────────────────┘   │
│  ┌────────────────────────────────────────────────────┐   │
│  │  [Save] [Load] [Export] [Import] [Reset]           │   │
│  └────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────┘
```

**Tablet (768px - 1279px):**
- Stack panels vertically
- Configuration form on top
- YAML preview below
- Both full width

**Mobile (<768px):**
- Single column layout
- Tabs to switch between form and preview
- Simplified form fields
- Collapsible sections

### 5.2 Color Scheme (IBM Carbon)

**Light Theme:**
- Background: `$ui-background` (#ffffff)
- Panel background: `$ui-01` (#f4f4f4)
- Border: `$ui-03` (#e0e0e0)
- Text: `$text-01` (#161616)
- Link: `$link-01` (#0f62fe)
- Error: `$support-01` (#da1e28)
- Warning: `$support-03` (#f1c21b)
- Success: `$support-02` (#24a148)

**Dark Theme:**
- Background: `$ui-background` (#161616)
- Panel background: `$ui-01` (#262626)
- Border: `$ui-03` (#525252)
- Text: `$text-01` (#f4f4f4)
- Link: `$link-01` (#78a9ff)
- Error: `$support-01` (#fa4d56)
- Warning: `$support-03` (#f1c21b)
- Success: `$support-02` (#42be65)

### 5.3 Typography

**Headings:**
- Page title: `$heading-05` (32px, 40px line-height)
- Section title: `$heading-03` (20px, 28px line-height)
- Subsection: `$heading-02` (16px, 24px line-height)

**Body:**
- Body text: `$body-long-01` (14px, 20px line-height)
- Helper text: `$helper-text-01` (12px, 16px line-height)
- Code: `$code-01` (12px, 16px line-height, monospace)

### 5.4 Spacing

**Vertical Spacing:**
- Between sections: `$spacing-07` (32px)
- Between form groups: `$spacing-05` (16px)
- Between fields: `$spacing-03` (8px)

**Horizontal Spacing:**
- Panel padding: `$spacing-05` (16px)
- Form field padding: `$spacing-03` (8px)
- Button spacing: `$spacing-03` (8px)

### 5.5 Interactive States

**Form Fields:**
- Default: Border `$ui-04`, background `$field-01`
- Focus: Border `$focus`, background `$field-01`
- Error: Border `$support-01`, background `$field-01`
- Disabled: Border `$disabled-02`, background `$disabled-01`

**Buttons:**
- Primary: Background `$interactive-01`, text `$text-04`
- Secondary: Background `$interactive-02`, text `$text-01`
- Ghost: Background transparent, text `$link-01`
- Danger: Background `$danger-01`, text `$text-04`

---

## 6. Implementation Steps

### Phase 2.1: Type Definitions and Schemas (1 day)

**Tasks:**
1. Create configuration schema types
2. Define validation rule types
3. Create form field metadata types
4. Define component configuration schemas

**Files to Create:**
```
src/types/configuration.types.ts
src/schemas/componentSchemas.ts
src/schemas/validationRules.ts
```

**Deliverables:**
- Complete TypeScript types for all configuration fields
- Schema definitions for dynamic form generation
- Validation rule definitions

---

### Phase 2.2: YAMLPreview Component (1 day)

**Tasks:**
1. Install react-syntax-highlighter
2. Create YAMLPreview component
3. Add copy to clipboard functionality
4. Add download functionality
5. Implement error highlighting
6. Add line numbers

**Files to Create:**
```
src/components/configuration/YAMLPreview.tsx
src/components/configuration/YAMLPreview.css
```

**Dependencies:**
```bash
npm install react-syntax-highlighter
npm install @types/react-syntax-highlighter --save-dev
```

**Deliverables:**
- Functional YAML preview with syntax highlighting
- Copy and download buttons working
- Error indicators at specific lines

---

### Phase 2.3: GlobalConfigSection Component (1 day)

**Tasks:**
1. Create GlobalConfigSection component
2. Add form fields for all global config options
3. Implement field validation
4. Add help tooltips
5. Connect to configStore

**Files to Create:**
```
src/components/configuration/GlobalConfigSection.tsx
src/components/configuration/GlobalConfigSection.css
```

**Deliverables:**
- Complete global configuration form
- All fields validated
- Connected to configStore

---

### Phase 2.4: OpenShiftConfigSection Component (1 day)

**Tasks:**
1. Create OpenShiftConfigSection component
2. Add form fields for OpenShift configuration
3. Implement nested accordion sections
4. Add validation for domain names
5. Connect to configStore

**Files to Create:**
```
src/components/configuration/OpenShiftConfigSection.tsx
src/components/configuration/OpenShiftConfigSection.css
```

**Deliverables:**
- Complete OpenShift configuration form
- Nested sections for MCG, GPU, AI, Storage
- All fields validated

---

### Phase 2.5: CP4DConfigSection Component (1 day)

**Tasks:**
1. Create CP4DConfigSection component
2. Add form fields for CP4D configuration
3. Implement multi-select for entitlements
4. Add license acceptance checkbox with warning
5. Connect to configStore

**Files to Create:**
```
src/components/configuration/CP4DConfigSection.tsx
src/components/configuration/CP4DConfigSection.css
```

**Deliverables:**
- Complete CP4D configuration form
- Entitlement multi-select working
- License warning displayed

---

### Phase 2.6: ComponentConfigSection Component (2 days)

**Tasks:**
1. Create ComponentConfigSection component
2. Implement dynamic field generation based on component schema
3. Handle optional fields (size, instances, installation_options)
4. Add nested forms for instances
5. Display component dependencies
6. Connect to configStore

**Files to Create:**
```
src/components/configuration/ComponentConfigSection.tsx
src/components/configuration/ComponentConfigSection.css
src/components/configuration/DynamicFormField.tsx
```

**Deliverables:**
- Dynamic component configuration forms
- Support for all component types
- Instance management for components that support it
- Installation options handling

---

### Phase 2.7: ConfigurationForm Component (1 day)

**Tasks:**
1. Create ConfigurationForm component
2. Integrate all section components
3. Implement accordion behavior
4. Add form submission handling
5. Connect to componentStore for selected components

**Files to Create:**
```
src/components/configuration/ConfigurationForm.tsx
src/components/configuration/ConfigurationForm.css
```

**Deliverables:**
- Complete configuration form with all sections
- Accordion navigation working
- Form state management

---

### Phase 2.8: ConfigurationValidator Service (1 day)

**Tasks:**
1. Create ConfigurationValidator service
2. Implement validation rules for all fields
3. Add dependency validation
4. Add conflict detection
5. Return structured error messages

**Files to Create:**
```
src/services/configuration/ConfigurationValidator.ts
src/services/configuration/validationRules.ts
```

**Deliverables:**
- Complete validation service
- All validation rules implemented
- Error messages clear and actionable

---

### Phase 2.9: ConfigurationPage Component (1 day)

**Tasks:**
1. Create ConfigurationPage component
2. Implement two-panel layout
3. Add action bar with buttons
4. Integrate ConfigurationForm and YAMLPreview
5. Add route to App.tsx

**Files to Create:**
```
src/pages/ConfigurationPage.tsx
src/pages/ConfigurationPage.css
```

**Deliverables:**
- Complete configuration page
- Two-panel layout working
- Real-time YAML preview
- Action buttons functional

---

### Phase 2.10: Import/Export Functionality (1 day)

**Tasks:**
1. Create ConfigurationImportModal component
2. Implement YAML parsing and validation
3. Add file upload support
4. Create SavedConfigurationsList component
5. Implement save/load functionality

**Files to Create:**
```
src/components/configuration/ConfigurationImportModal.tsx
src/components/configuration/SavedConfigurationsList.tsx
```

**Deliverables:**
- Import modal working
- File upload functional
- Saved configurations list
- Load/delete operations working

---

### Phase 2.11: Testing and Refinement (2 days)

**Tasks:**
1. Test all form fields
2. Test validation rules
3. Test YAML generation
4. Test save/load/export/import
5. Test with all 63 components
6. Fix bugs and polish UI
7. Test responsive design
8. Test accessibility

**Deliverables:**
- All features tested and working
- Bugs fixed
- UI polished
- Responsive design verified
- Accessibility verified

---

### Phase 2.12: Documentation and Commit (1 day)

**Tasks:**
1. Update CLOUD_PAK_UI_IMPLEMENTATION_PLAN.md
2. Create Phase 2 completion document
3. Update README if needed
4. Commit all changes
5. Create pull request

**Deliverables:**
- Documentation updated
- Changes committed
- Pull request created

---

## 7. Validation Strategy

### 7.1 Validation Levels

**Level 1: Field-Level Validation (Real-time)**
- Triggered on blur or change
- Validates individual field format
- Shows inline error messages
- Examples:
  - Environment name: alphanumeric with hyphens
  - Domain name: valid domain format
  - Env ID: lowercase alphanumeric, max 20 chars

**Level 2: Section-Level Validation (On section complete)**
- Validates related fields together
- Checks for required fields in section
- Shows section-level warnings
- Examples:
  - OpenShift: domain_name required if cluster_name provided
  - CP4D: accept_licenses must be true

**Level 3: Configuration-Level Validation (On save/export)**
- Validates entire configuration
- Checks component dependencies
- Validates cross-section relationships
- Shows summary of all errors
- Examples:
  - Selected components have required dependencies
  - No conflicting components selected
  - All required fields filled

### 7.2 Validation Rules

**Global Config:**
```typescript
{
  'environment_name': {
    required: true,
    pattern: /^[a-zA-Z0-9-]+$/,
    message: 'Must be alphanumeric with hyphens'
  },
  'cloud_platform': {
    required: true,
    enum: ['existing-ocp', 'aws', 'azure', 'ibm-cloud', 'vsphere'],
    message: 'Must select a valid cloud platform'
  },
  'env_id': {
    required: true,
    pattern: /^[a-z0-9-]+$/,
    maxLength: 20,
    message: 'Must be lowercase alphanumeric, max 20 characters'
  }
}
```

**OpenShift Config:**
```typescript
{
  'domain_name': {
    required: true,
    pattern: /^[a-z0-9.-]+\.[a-z]{2,}$/,
    message: 'Must be a valid domain name'
  },
  'cluster_name': {
    required: true,
    pattern: /^[a-z0-9-]+$/,
    message: 'Must be lowercase alphanumeric with hyphens'
  }
}
```

**CP4D Config:**
```typescript
{
  'project': {
    required: true,
    pattern: /^[a-z0-9-]+$/,
    maxLength: 63,
    message: 'Must be valid Kubernetes namespace name'
  },
  'operators_project': {
    required: true,
    pattern: /^[a-z0-9-]+$/,
    maxLength: 63,
    message: 'Must be valid Kubernetes namespace name'
  },
  'accept_licenses': {
    required: true,
    equals: true,
    message: 'You must accept licenses to proceed'
  }
}
```

**Component Config:**
```typescript
{
  'size': {
    required: false,
    enum: ['small', 'medium', 'large'],
    message: 'Must be small, medium, or large'
  },
  'replicas': {
    required: false,
    type: 'number',
    min: 1,
    max: 10,
    message: 'Must be between 1 and 10'
  }
}
```

### 7.3 Error Display

**Inline Errors (Field Level):**
```tsx
<TextInput
  id="environment-name"
  labelText="Environment Name"
  value={environmentName}
  onChange={handleChange}
  invalid={!!errors.environment_name}
  invalidText={errors.environment_name}
/>
```

**Section Errors (Section Level):**
```tsx
{sectionErrors.length > 0 && (
  <InlineNotification
    kind="error"
    title="Configuration Errors"
    subtitle={`${sectionErrors.length} error(s) in this section`}
  />
)}
```

**Summary Errors (Configuration Level):**
```tsx
{allErrors.length > 0 && (
  <InlineNotification
    kind="error"
    title="Cannot Save Configuration"
    subtitle={`Please fix ${allErrors.length} error(s) before saving`}
    actions={
      <Button size="sm" onClick={scrollToFirstError}>
        Go to first error
      </Button>
    }
  />
)}
```

---

## 8. Testing Plan

### 8.1 Unit Tests

**Components to Test:**
- GlobalConfigSection
- OpenShiftConfigSection
- CP4DConfigSection
- ComponentConfigSection
- YAMLPreview
- ConfigurationValidator

**Test Cases:**
```typescript
describe('GlobalConfigSection', () => {
  it('renders all fields', () => {});
  it('validates environment name format', () => {});
  it('validates env_id format', () => {});
  it('updates configStore on change', () => {});
  it('shows error messages for invalid input', () => {});
});

describe('ConfigurationValidator', () => {
  it('validates required fields', () => {});
  it('validates field formats', () => {});
  it('validates component dependencies', () => {});
  it('detects conflicting configurations', () => {});
  it('returns structured error messages', () => {});
});

describe('YAMLPreview', () => {
  it('displays YAML with syntax highlighting', () => {});
  it('copies YAML to clipboard', () => {});
  it('downloads YAML as file', () => {});
  it('highlights error lines', () => {});
});
```

### 8.2 Integration Tests

**Scenarios to Test:**
1. **Complete Configuration Flow:**
   - Fill in global config
   - Configure OpenShift settings
   - Configure CP4D settings
   - Configure selected components
   - Verify YAML generation
   - Save configuration
   - Load configuration
   - Export YAML
   - Import YAML

2. **Validation Flow:**
   - Enter invalid data in fields
   - Verify inline errors appear
   - Fix errors
   - Verify errors clear
   - Attempt to save with errors
   - Verify save blocked

3. **Component Configuration:**
   - Select components in Phase 1
   - Navigate to Configuration page
   - Verify only selected components shown
   - Configure each component
   - Verify YAML includes all configurations

### 8.3 End-to-End Tests

**User Journeys:**
```typescript
describe('Configuration Page E2E', () => {
  it('completes full configuration workflow', async () => {
    // 1. Navigate to configuration page
    await page.goto('/configuration');
    
    // 2. Fill in global config
    await page.fill('#environment-name', 'test-env');
    await page.selectOption('#cloud-platform', 'existing-ocp');
    await page.fill('#env-id', 'test-cpd');
    
    // 3. Configure OpenShift
    await page.click('text=OpenShift Configuration');
    await page.fill('#domain-name', 'example.com');
    
    // 4. Configure CP4D
    await page.click('text=CP4D Configuration');
    await page.check('#accept-licenses');
    
    // 5. Configure components
    await page.click('text=Component Configurations');
    // ... configure each selected component
    
    // 6. Verify YAML preview updates
    const yamlContent = await page.textContent('.yaml-preview');
    expect(yamlContent).toContain('environment_name: test-env');
    
    // 7. Save configuration
    await page.click('button:has-text("Save")');
    await page.fill('#config-name', 'My Test Config');
    await page.click('button:has-text("Confirm")');
    
    // 8. Verify success message
    await expect(page.locator('.notification')).toContainText('Configuration saved');
  });
  
  it('validates required fields', async () => {
    await page.goto('/configuration');
    
    // Try to save without filling required fields
    await page.click('button:has-text("Save")');
    
    // Verify error messages appear
    await expect(page.locator('.error-message')).toBeVisible();
    await expect(page.locator('.error-message')).toContainText('Environment name is required');
  });
  
  it('imports YAML configuration', async () => {
    await page.goto('/configuration');
    
    // Click import button
    await page.click('button:has-text("Import")');
    
    // Paste YAML content
    const yamlContent = `
global_config:
  environment_name: imported-env
  cloud_platform: existing-ocp
  env_id: imported-cpd
`;
    await page.fill('textarea', yamlContent);
    
    // Confirm import
    await page.click('button:has-text("Import")');
    
    // Verify fields are populated
    await expect(page.locator('#environment-name')).toHaveValue('imported-env');
  });
});
```

---

## 9. Success Criteria

### 9.1 Functional Requirements

**Must Have:**
- ✅ All configuration sections render correctly
- ✅ Form fields update configStore in real-time
- ✅ YAML preview updates as user types
- ✅ Validation errors display inline
- ✅ Save/load configurations to localStorage
- ✅ Export YAML to file
- ✅ Import YAML from file or paste
- ✅ Only selected components show configuration forms
- ✅ Generated YAML matches reference-config.yaml structure
- ✅ Component states correctly set to "installed" or "removed"

**Should Have:**
- ✅ Responsive design works on tablet and desktop
- ✅ Keyboard navigation works throughout
- ✅ Help tooltips provide context
- ✅ Error messages are clear and actionable
- ✅ Configuration templates for common scenarios

**Nice to Have:**
- ⭐ Auto-save draft configurations
- ⭐ Configuration comparison tool
- ⭐ Configuration validation against backend API
- ⭐ Undo/redo functionality
- ⭐ Configuration history with timestamps

### 9.2 Technical Requirements

**Code Quality:**
- TypeScript strict mode with no errors
- All components properly typed
- Consistent code style (Prettier + ESLint)
- Comprehensive error handling
- Proper loading states

**Performance:**
- Page loads in < 2 seconds
- Form updates feel instant (< 100ms)
- YAML generation completes in < 500ms
- No memory leaks
- Efficient re-renders (React.memo where appropriate)

**Accessibility:**
- WCAG 2.1 AA compliance
- Keyboard navigation works
- Screen reader compatible
- Proper ARIA labels
- Focus management

**Testing:**
- Unit test coverage > 80%
- All critical paths have integration tests
- E2E tests for main user journeys
- No console errors or warnings

### 9.3 User Experience Requirements

**Usability:**
- Clear visual hierarchy
- Intuitive form layout
- Helpful error messages
- Smooth transitions
- Consistent with Phase 1 design

**Guidance:**
- Tooltips explain complex fields
- Examples provided for formats
- Links to documentation
- Validation feedback is immediate
- Success states are clear

**Efficiency:**
- Minimal clicks to complete configuration
- Smart defaults reduce data entry
- Copy/paste works everywhere
- Keyboard shortcuts available
- Quick access to common actions

---

## 10. Implementation Timeline

### Week 1: Foundation (Days 1-5)
- **Day 1:** Phase 2.1 - Type definitions and schemas
- **Day 2:** Phase 2.2 - YAMLPreview component
- **Day 3:** Phase 2.3 - GlobalConfigSection
- **Day 4:** Phase 2.4 - OpenShiftConfigSection
- **Day 5:** Phase 2.5 - CP4DConfigSection

### Week 2: Components (Days 6-10)
- **Day 6-7:** Phase 2.6 - ComponentConfigSection (complex, needs 2 days)
- **Day 8:** Phase 2.7 - ConfigurationForm integration
- **Day 9:** Phase 2.8 - ConfigurationValidator service
- **Day 10:** Phase 2.9 - ConfigurationPage main component

### Week 3: Features & Testing (Days 11-15)
- **Day 11:** Phase 2.10 - Import/Export functionality
- **Day 12-13:** Phase 2.11 - Testing and refinement
- **Day 14:** Phase 2.12 - Documentation and commit
- **Day 15:** Buffer day for unexpected issues

**Total Estimated Time:** 15 days (3 weeks)

---

## 11. Risk Assessment & Mitigation

### 11.1 Technical Risks

**Risk 1: Complex Dynamic Form Generation**
- **Impact:** High
- **Probability:** Medium
- **Mitigation:**
  - Start with simple components first
  - Create reusable form field components
  - Use schema-driven approach
  - Test incrementally

**Risk 2: YAML Generation Accuracy**
- **Impact:** High
- **Probability:** Low
- **Mitigation:**
  - Use reference-config.yaml as template
  - Extensive testing with all component combinations
  - Validation against backend expectations
  - Manual review of generated YAML

**Risk 3: Performance with 63 Components**
- **Impact:** Medium
- **Probability:** Medium
- **Mitigation:**
  - Use React.memo for expensive components
  - Virtualize long lists if needed
  - Debounce YAML generation
  - Profile and optimize hot paths

**Risk 4: Validation Complexity**
- **Impact:** Medium
- **Probability:** Medium
- **Mitigation:**
  - Start with simple validation rules
  - Add complex rules incrementally
  - Comprehensive test coverage
  - Clear error messages

### 11.2 UX Risks

**Risk 1: Form Complexity Overwhelming Users**
- **Impact:** High
- **Probability:** Medium
- **Mitigation:**
  - Use accordion sections to hide complexity
  - Provide smart defaults
  - Add contextual help
  - Progressive disclosure of advanced options

**Risk 2: Validation Errors Frustrating Users**
- **Impact:** Medium
- **Probability:** High
- **Mitigation:**
  - Clear, actionable error messages
  - Show errors inline near fields
  - Provide examples of valid input
  - Allow saving invalid configs as drafts

### 11.3 Integration Risks

**Risk 1: ConfigStore Not Fully Compatible**
- **Impact:** Medium
- **Probability:** Low
- **Mitigation:**
  - Review configStore implementation early
  - Extend if needed
  - Maintain backward compatibility
  - Test integration thoroughly

**Risk 2: Component Data Structure Mismatches**
- **Impact:** Medium
- **Probability:** Low
- **Mitigation:**
  - Verify against reference-config.yaml
  - Cross-reference with component data
  - Add transformation layer if needed
  - Comprehensive integration tests

---

## 12. Dependencies & Prerequisites

### 12.1 External Dependencies

**New NPM Packages:**
```json
{
  "react-syntax-highlighter": "^15.5.0",
  "@types/react-syntax-highlighter": "^15.5.0"
}
```

**Existing Dependencies (Already Installed):**
- `@carbon/react`: UI components
- `zustand`: State management
- `js-yaml`: YAML parsing/generation
- `react-router-dom`: Routing

### 12.2 Prerequisites

**Must Be Complete Before Starting:**
- ✅ Phase 1: Component Selection Page
- ✅ Phase 1.5: Component Coverage Expansion
- ✅ configStore implementation
- ✅ componentStore implementation
- ✅ All 63 components defined

**Should Be Available:**
- ✅ reference-config.yaml structure
- ✅ Component schemas and metadata
- ✅ Validation requirements
- ✅ Design system guidelines

---

## 13. Appendix

### 13.1 Example Component Configuration Schemas

**Watson Studio (ws):**
```typescript
{
  name: 'ws',
  description: 'Watson Studio',
  configSchema: {
    state: { type: 'enum', values: ['installed', 'removed'], default: 'installed' },
    // No additional configuration needed
  }
}
```

**Analytics Engine (analyticsengine):**
```typescript
{
  name: 'analyticsengine',
  description: 'Analytics Engine Powered by Apache Spark',
  configSchema: {
    state: { type: 'enum', values: ['installed', 'removed'], default: 'installed' },
    size: { type: 'enum', values: ['small', 'medium', 'large'], default: 'small' },
    installation_options: {
      sparkAdvEnabled: { type: 'boolean', default: true },
      jobAutoDeleteEnabled: { type: 'boolean', default: true },
      kernelCullTime: { type: 'number', default: 30, min: 1, max: 120 },
      imagePullParallelism: { type: 'string', default: '40' },
      imagePullCompletions: { type: 'string', default: '20' },
      kernelCleanupSchedule: { type: 'string', default: '*/30 * * * *' },
      jobCleanupSchedule: { type: 'string', default: '*/30 * * * *' },
      skipSelinuxRelabeling: { type: 'boolean', default: false },
      mountCustomizationsFromCchome: { type: 'boolean', default: false },
      maxDriverCpuCores: { type: 'number', default: 5, min: 1, max: 32 },
      maxExecutorCpuCores: { type: 'number', default: 5, min: 1, max: 32 },
      maxDriveMemory: { type: 'string', default: '50g' },
      maxExecutorMemory: { type: 'string', default: '50g' },
      maxNumWorkers: { type: 'number', default: 50, min: 1, max: 1000 },
      localDirScaleFactor: { type: 'number', default: 10, min: 1, max: 100 }
    }
  }
}
```

**Db2 OLTP (db2):**
```typescript
{
  name: 'db2',
  description: 'Db2 OLTP',
  configSchema: {
    state: { type: 'enum', values: ['installed', 'removed'], default: 'installed' },
    size: { type: 'enum', values: ['small', 'medium', 'large'], default: 'small' },
    instances: {
      type: 'array',
      itemSchema: {
        name: { type: 'string', required: true },
        metadata_size_gb: { type: 'number', default: 20, min: 10, max: 1000 },
        data_size_gb: { type: 'number', default: 20, min: 10, max: 1000 },
        backup_size_gb: { type: 'number', default: 20, min: 10, max: 1000 },
        transactionlog_size_gb: { type: 'number', default: 20, min: 10, max: 1000 }
      }
    }
  }
}
```

### 13.2 YAML Generation Example

**Input (User Selections):**
- Selected components: ws, wml, analyticsengine
- Global config: environment_name = "production", env_id = "prod-cpd"
- Analytics Engine: size = "medium", sparkAdvEnabled = false

**Output (Generated YAML):**
```yaml
global_config:
  environment_name: production
  cloud_platform: existing-ocp
  confirm_destroy: false
  optimize_deploy: true
  env_id: prod-cpd

openshift:
- name: "{{ env_id }}"
  ocp_version: detect
  cluster_name: "{{ env_id }}"
  domain_name: example.com
  mcg:
    install: false
    storage_type: storage-class
    storage_class: managed-nfs-storage
  gpu:
    install: auto
  openshift_ai:
    install: auto
    channel: auto
  openshift_storage:
  - storage_name: auto-storage
    storage_type: auto

cp4d:
- project: cpd
  openshift_cluster_name: "{{ env_id }}"
  cp4d_version: latest
  cp4d_entitlement:
  - cpd-enterprise
  cp4d_production_license: true
  accept_licenses: false
  state: installed
  cartridges:
  - name: cp-foundation
    scale: level_1
    license_service:
      threads_per_core: 2
  - name: lite
  - name: analyticsengine
    description: Analytics Engine Powered by Apache Spark
    size: medium
    state: installed
    installation_options:
      sparkAdvEnabled: false
      jobAutoDeleteEnabled: true
      kernelCullTime: 30
      # ... other options with defaults
  - name: ws
    description: Watson Studio
    state: installed
  - name: wml
    description: Watson Machine Learning
    size: small
    state: installed
  # All other components with state: removed
  - name: ca
    description: Cognos Analytics
    state: removed
  # ... etc
```

### 13.3 Validation Error Examples

**Example 1: Invalid Environment Name**
```typescript
{
  field: 'global_config.environment_name',
  value: 'My Environment!',
  error: 'Environment name must be alphanumeric with hyphens only',
  suggestion: 'Try: my-environment'
}
```

**Example 2: Missing Required Field**
```typescript
{
  field: 'cp4d[0].accept_licenses',
  value: false,
  error: 'You must accept licenses to proceed with deployment',
  severity: 'error',
  blocking: true
}
```

**Example 3: Invalid Domain Format**
```typescript
{
  field: 'openshift[0].domain_name',
  value: 'invalid_domain',
  error: 'Domain name must be a valid domain format (e.g., example.com)',
  suggestion: 'Try: example.com'
}
```

---

## 14. Conclusion

This comprehensive plan provides a clear roadmap for implementing Phase 2: Configuration Page. The plan addresses:

✅ **Architecture:** Two-panel layout with real-time YAML preview
✅ **Components:** 10 major components with clear responsibilities
✅ **Data Flow:** Integration with existing stores
✅ **Validation:** Three-level validation strategy
✅ **Testing:** Unit, integration, and E2E test plans
✅ **Timeline:** 15-day implementation schedule
✅ **Risk Management:** Identified risks with mitigation strategies

**Next Steps:**
1. Review and approve this plan
2. Begin Phase 2.1: Type definitions and schemas
3. Follow the implementation steps sequentially
4. Test thoroughly at each stage
5. Document progress and learnings

**Success Metrics:**
- All 63 components configurable
- YAML generation 100% accurate
- Validation catches all errors
- User can complete configuration in < 10 minutes
- Zero critical bugs in production

---

**Document Version:** 1.0
**Last Updated:** 2026-04-09
**Status:** Ready for Implementation
**Estimated Completion:** 3 weeks from start date
