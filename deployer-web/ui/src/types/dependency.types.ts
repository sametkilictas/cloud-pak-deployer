/**
 * Enhanced Dependency Type Definitions
 * 
 * These types represent the complete dependency structure from
 * ibm_software_hub_requirements_normalized_operational.yaml
 */

/**
 * External dependency types that must exist before component installation
 */
export type ExternalDependencyType =
  | 'operator'                  // OpenShift operators (NFD, GPU)
  | 'platform_software'         // Platform software (OpenShift AI, MCG)
  | 'external_system'           // External systems (Db2, SMTP, Hadoop)
  | 'license'                   // Required licenses
  | 'network_requirement'       // Network requirements (AT-TLS, same-network)
  | 'client_software'           // Client software (VS Code, browsers)
  | 'subscription';             // Required subscriptions

/**
 * Install behavior for dependencies
 */
export type InstallBehavior =
  | 'must_exist'                // Must already exist in the cluster
  | 'auto_installed';           // Automatically installed with the component

/**
 * External dependency definition
 */
export interface ExternalDependency {
  name: string;
  type: ExternalDependencyType;
  install_behavior?: InstallBehavior;
  notes?: string[];
}

/**
 * Service dependency types
 */
export type ServiceDependencyType =
  | 'service'                   // Another Cloud Pak service
  | 'shared_cluster_component'; // Shared cluster component (e.g., Scheduling service)

/**
 * Service dependency definition
 */
export interface ServiceDependency {
  name: string;
  type: ServiceDependencyType;
  install_behavior?: InstallBehavior;
  notes?: string[];
}

/**
 * Component dependency definition (auto-installed components)
 */
export interface ComponentDependency {
  name: string;
  type: 'component';
  original_name: string;        // Original component name in deployer
  install_behavior: 'auto_installed';
}

/**
 * Condition expression for conditional dependencies
 */
export interface DependencyCondition {
  expression: string;           // Human-readable condition expression
}

/**
 * Conditional dependency definition for external dependencies
 */
export interface ConditionalExternalDependency {
  condition: DependencyCondition;
  requires: ExternalDependency[];
  notes?: string[];
}

/**
 * Conditional dependency definition for service dependencies
 */
export interface ConditionalServiceDependency {
  condition: DependencyCondition;
  requires?: ServiceDependency[];
  installs?: (ServiceDependency | ComponentDependency)[];
  notes?: string[];
}

/**
 * Conditional dependency definition for component dependencies
 */
export interface ConditionalComponentDependency {
  condition: DependencyCondition;
  installs: ComponentDependency[];
  notes?: string[];
}

/**
 * Complete external dependencies structure
 */
export interface ExternalDependencies {
  required: ExternalDependency[];
  conditional: ConditionalExternalDependency[];
}

/**
 * Complete service dependencies structure
 */
export interface ServiceDependencies {
  required: ServiceDependency[];
  optional: ServiceDependency[];
  conditional: ConditionalServiceDependency[];
}

/**
 * Complete component dependencies structure
 */
export interface ComponentDependencies {
  auto_installed: ComponentDependency[];
  conditional: ConditionalComponentDependency[];
}

/**
 * Version constraint definition
 */
export interface VersionConstraint {
  applies_when: string;
  component_behavior?: {
    auto_installed?: string[];
    upgraded_to_latest?: string[];
  };
  service_requirements?: string[];
  service_behavior?: {
    auto_installed_services?: string[];
    service_dependencies?: string;
  };
}

/**
 * Documentation reference
 */
export interface DocumentationReference {
  name: string;
  url: string;
}

/**
 * Dependency resolution result
 */
export interface DependencyResolutionResult {
  selectedComponents: Set<string>;
  autoSelectedComponents: Set<string>;
  requiredExternalDependencies: ExternalDependency[];
  conflicts: Array<{
    component: string;
    conflictsWith: string;
    reason: string;
  }>;
  warnings: Array<{
    component: string;
    message: string;
    type: 'missing_external' | 'conditional_not_met' | 'version_constraint';
  }>;
}

/**
 * Dependency chain node for visualization
 */
export interface DependencyChainNode {
  componentId: string;
  componentName: string;
  reason: string;
  depth: number;
  isAutoInstalled: boolean;
  isConditional: boolean;
  children: DependencyChainNode[];
}

// Made with Bob
