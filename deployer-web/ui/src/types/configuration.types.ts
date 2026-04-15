/**
 * Configuration Types for Phase 2
 * Enhanced types for configuration forms, validation, and schemas
 */

// ============================================================================
// Form Field Types
// ============================================================================

export type FieldType =
  | 'text'
  | 'number'
  | 'boolean'
  | 'select'
  | 'multiselect'
  | 'textarea'
  | 'password'
  | 'array';

export type FieldSize = 'small' | 'medium' | 'large';

export interface FormFieldSchema {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  defaultValue?: any;
  placeholder?: string;
  helpText?: string;
  disabled?: boolean;
  hidden?: boolean;
  unit?: string; // For displaying units like GB, minutes, etc.
  
  // Validation
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  validation?: {
    required?: string;
    pattern?: { value: RegExp; message: string };
    min?: { value: number; message: string };
    max?: { value: number; message: string };
    minLength?: { value: number; message: string };
    maxLength?: { value: number; message: string };
    custom?: (value: any) => string | undefined;
  };
  
  // For select/multiselect
  options?: Array<{
    value: string | number;
    label: string;
  }>;
  
  // For array fields
  arrayItemType?: 'text' | 'number' | 'select';
  
  // Conditional display
  showWhen?: {
    field: string;
    value: any;
  };
}

export interface FormSectionSchema {
  id: string;
  title: string;
  description?: string;
  fields: FormFieldSchema[];
  collapsible?: boolean;
  defaultExpanded?: boolean;
  defaultCollapsed?: boolean; // Alias for !defaultExpanded
}

// ============================================================================
// Validation Types
// ============================================================================

export type ValidationSeverity = 'error' | 'warning' | 'info';

export interface ValidationRule {
  field: string;
  validator: (value: any, config?: any) => boolean;
  message: string;
  severity: ValidationSeverity;
}

export interface FieldValidationResult {
  field: string;
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ConfigValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
  suggestion?: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
  value?: any;
}

// ============================================================================
// Component Configuration Schema Types
// ============================================================================

export interface ComponentConfigSchema {
  componentId?: string;
  componentName: string;
  displayName?: string; // Human-readable display name
  sections: FormSectionSchema[];
  supportsSize?: boolean;
  supportsInstances?: boolean;
  instanceSchema?: {
    sections: FormSectionSchema[];
  };
  supportsInstallationOptions?: boolean;
  supportsReplicas?: boolean;
  supportsModels?: boolean;
  modelSchema?: {
    sections: FormSectionSchema[];
  };
}

export interface ComponentInstanceSchema {
  fields: FormFieldSchema[];
  minInstances?: number;
  maxInstances?: number;
}

export interface InstallationOptionSchema {
  name: string;
  type: FieldType;
  defaultValue: any;
  required?: boolean;
  description?: string;
  options?: Array<{
    value: string | number;
    label: string;
  }>;
}

// ============================================================================
// Configuration Form State Types
// ============================================================================

export interface ConfigurationFormState {
  globalConfig: Record<string, any>;
  openshiftConfig: Record<string, any>;
  cp4dConfig: Record<string, any>;
  componentConfigs: Record<string, ComponentFormState>;
  isDirty: boolean;
  errors: Record<string, string[]>;
  warnings: Record<string, string[]>;
}

export interface ComponentFormState {
  componentId: string;
  size?: string;
  replicas?: number;
  instances: InstanceFormState[];
  installationOptions: Record<string, any>;
  models?: ModelFormState[];
}

export interface InstanceFormState {
  id: string;
  name: string;
  config: Record<string, any>;
}

export interface ModelFormState {
  modelId: string;
  state: 'installed' | 'removed';
  parameters?: Record<string, any>;
}

// ============================================================================
// YAML Preview Types
// ============================================================================

export interface YAMLPreviewProps {
  yaml: string;
  errors?: ValidationError[];
  onCopy?: () => void;
  onDownload?: () => void;
  highlightErrors?: boolean;
}

export interface YAMLErrorIndicator {
  line: number;
  message: string;
  severity: ValidationSeverity;
}

// ============================================================================
// Configuration Import/Export Types
// ============================================================================

export interface ConfigurationImportResult {
  success: boolean;
  config?: any;
  errors?: string[];
  warnings?: string[];
}

export interface ConfigurationExportOptions {
  format: 'yaml' | 'json';
  includeComments?: boolean;
  minify?: boolean;
}

// ============================================================================
// Saved Configuration Types
// ============================================================================

export interface SavedConfigurationMetadata {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  author?: string;
  tags?: string[];
  version?: string;
}

export interface SavedConfigurationWithMetadata {
  metadata: SavedConfigurationMetadata;
  config: any;
}

// ============================================================================
// Configuration Template Types
// ============================================================================

export interface ConfigurationTemplate {
  id: string;
  name: string;
  description: string;
  category: 'development' | 'staging' | 'production' | 'custom';
  config: any;
  requiredComponents: string[];
  optionalComponents: string[];
}

// ============================================================================
// Form Action Types
// ============================================================================

export type FormAction =
  | { type: 'UPDATE_GLOBAL_CONFIG'; payload: Record<string, any> }
  | { type: 'UPDATE_OPENSHIFT_CONFIG'; payload: Record<string, any> }
  | { type: 'UPDATE_CP4D_CONFIG'; payload: Record<string, any> }
  | { type: 'UPDATE_COMPONENT_CONFIG'; payload: { componentId: string; config: Partial<ComponentFormState> } }
  | { type: 'ADD_INSTANCE'; payload: { componentId: string; instance: InstanceFormState } }
  | { type: 'REMOVE_INSTANCE'; payload: { componentId: string; instanceId: string } }
  | { type: 'UPDATE_INSTANCE'; payload: { componentId: string; instanceId: string; config: Record<string, any> } }
  | { type: 'SET_ERRORS'; payload: Record<string, string[]> }
  | { type: 'CLEAR_ERRORS'; payload?: string }
  | { type: 'RESET_FORM' };

// ============================================================================
// Configuration Page State Types
// ============================================================================

export interface ConfigurationPageState {
  activeSection: string;
  expandedSections: Set<string>;
  showPreview: boolean;
  previewWidth: number;
  isValidating: boolean;
  isSaving: boolean;
  lastSaved?: string;
}

// ============================================================================
// Validation Rule Definitions
// ============================================================================

export const VALIDATION_PATTERNS = {
  ALPHANUMERIC_HYPHEN: /^[a-zA-Z0-9-]+$/,
  LOWERCASE_ALPHANUMERIC: /^[a-z0-9-]+$/,
  DOMAIN_NAME: /^[a-z0-9.-]+\.[a-z]{2,}$/,
  K8S_NAME: /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/,
  SEMVER: /^\d+\.\d+\.\d+$/,
  CRON: /^(\*|([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])|\*\/([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])) (\*|([0-9]|1[0-9]|2[0-3])|\*\/([0-9]|1[0-9]|2[0-3])) (\*|([1-9]|1[0-9]|2[0-9]|3[0-1])|\*\/([1-9]|1[0-9]|2[0-9]|3[0-1])) (\*|([1-9]|1[0-2])|\*\/([1-9]|1[0-2])) (\*|([0-6])|\*\/([0-6]))$/,
} as const;

// Export individual patterns for easier imports
export const ALPHANUMERIC_HYPHEN = VALIDATION_PATTERNS.ALPHANUMERIC_HYPHEN;
export const LOWERCASE_ALPHANUMERIC = VALIDATION_PATTERNS.LOWERCASE_ALPHANUMERIC;
export const DOMAIN_NAME = VALIDATION_PATTERNS.DOMAIN_NAME;
export const K8S_NAME = VALIDATION_PATTERNS.K8S_NAME;
export const SEMVER = VALIDATION_PATTERNS.SEMVER;
export const CRON = VALIDATION_PATTERNS.CRON;

export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_FORMAT: 'Invalid format',
  ALPHANUMERIC_HYPHEN: 'Must be alphanumeric with hyphens only',
  LOWERCASE_ALPHANUMERIC: 'Must be lowercase alphanumeric with hyphens',
  INVALID_DOMAIN: 'Must be a valid domain name (e.g., example.com)',
  INVALID_K8S_NAME: 'Must be a valid Kubernetes name (lowercase alphanumeric with hyphens, start and end with alphanumeric)',
  K8S_NAME: 'Must be a valid Kubernetes name (lowercase alphanumeric with hyphens, start and end with alphanumeric)',
  DOMAIN_NAME: 'Must be a valid domain name (e.g., example.com)',
  MIN_LENGTH: (min: number) => `Must be at least ${min} characters`,
  MAX_LENGTH: (max: number) => `Must be at most ${max} characters`,
  MIN_VALUE: (min: number) => `Must be at least ${min}`,
  MAX_VALUE: (max: number) => `Must be at most ${max}`,
  ACCEPT_LICENSES: 'You must accept licenses to proceed with deployment',
} as const;

// ============================================================================
// Helper Types
// ============================================================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type FormFieldValue = string | number | boolean | string[] | number[] | null | undefined;

export type FormErrors = Record<string, string[]>;

export type FormTouched = Record<string, boolean>;

// Made with Bob