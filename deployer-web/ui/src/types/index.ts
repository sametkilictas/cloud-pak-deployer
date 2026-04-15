/**
 * Type Exports
 * Central export point for all TypeScript types
 */

// Export all from component.types (includes simplified dependency interfaces)
export * from './component.types';

// Export enhanced dependency types with aliases to avoid conflicts
export type {
  ExternalDependencyType,
  InstallBehavior,
  ServiceDependencyType,
  DependencyCondition,
  ConditionalExternalDependency,
  ConditionalServiceDependency,
  ConditionalComponentDependency,
  ExternalDependencies,
  ServiceDependencies,
  ComponentDependencies,
  VersionConstraint,
  DocumentationReference,
  DependencyResolutionResult,
  DependencyChainNode
} from './dependency.types';

// Re-export enhanced dependency interfaces with 'Enhanced' suffix
export type {
  ExternalDependency as ExternalDependencyEnhanced,
  ServiceDependency as ServiceDependencyEnhanced,
  ComponentDependency as ComponentDependencyEnhanced
} from './dependency.types';

export * from './config.types';
export * from './configuration.types';
export * from './api.types';

// Made with Bob
