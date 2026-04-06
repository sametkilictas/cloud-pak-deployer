/**
 * Component Types
 * Defines the structure for Cloud Pak components and their dependencies
 */

export type ComponentCategory =
  | 'AI & Machine Learning'
  | 'Data Management'
  | 'Analytics'
  | 'Integration'
  | 'Governance'
  | 'Development Tools';

export type ComponentState = 'removed' | 'installed';

export type ComponentSize = 'small' | 'medium' | 'large';

export interface Component {
  id: string;
  name: string;
  originalName: string;
  description: string;
  category: ComponentCategory;
  restrictions: string[];
  externalDependencies: ExternalDependency[];
  serviceDependencies: ServiceDependency[];
  componentDependencies: ComponentDependency[];
  configSchema: FormSchema;
  state: ComponentState;
  version?: string;
  size?: ComponentSize;
}

export interface ExternalDependency {
  name: string;
  type: 'operator' | 'platform_software' | 'external_system' | 'license' | 'client_software';
  installBehavior: 'must_exist' | 'auto_installed';
  notes?: string[];
  conditional?: boolean;
  condition?: string;
}

export interface ServiceDependency {
  name: string;
  type: 'service';
  relationship: 'required' | 'optional' | 'conditional';
  installBehavior?: 'auto_installed';
  condition?: string;
  notes?: string[];
}

export interface ComponentDependency {
  name: string;
  type: 'component';
  originalName: string;
  installBehavior: 'auto_installed';
  conditional?: boolean;
  condition?: string;
}

export interface DependencyGraph {
  nodes: DependencyNode[];
  edges: DependencyEdge[];
}

export interface DependencyNode {
  id: string;
  name: string;
  type: 'service' | 'component' | 'operator' | 'platform';
  selected: boolean;
  autoSelected: boolean;
  required: boolean;
}

export interface DependencyEdge {
  source: string;
  target: string;
  type: 'requires' | 'optional' | 'installs';
  conditional?: boolean;
  condition?: string;
}

export interface Conflict {
  component1: string;
  component2: string;
  reason: string;
  severity: 'error' | 'warning';
}

export interface FormSchema {
  fields: FormField[];
  zodSchema?: any; // Zod schema for validation
}

export type FormFieldType = 'text' | 'select' | 'number' | 'boolean' | 'textarea';

export interface FormField {
  name: string;
  label: string;
  type: FormFieldType;
  required: boolean;
  placeholder?: string;
  helperText?: string;
  options?: Array<{ value: string; label: string }>;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: any;
}

export interface DependencyInfo {
  id: string;
  name: string;
  reason: string;
  type: 'required' | 'optional' | 'conditional';
}

export interface ResolutionResult {
  resolved: string[];
  autoSelected: string[];
  conflicts: Conflict[];
  explanations: Record<string, string[]>;
}

export interface ValidationResult {
  valid: boolean;
  missingDependencies?: ExternalDependency[];
  warnings?: string[];
  errors?: string[];
}

// Made with Bob
