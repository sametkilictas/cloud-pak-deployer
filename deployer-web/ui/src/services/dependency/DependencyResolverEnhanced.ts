/**
 * Enhanced Dependency Resolver
 * 
 * Provides advanced dependency resolution with support for:
 * - Conditional dependencies with expression evaluation
 * - Service dependency resolution
 * - Component auto-installation
 * - External dependency tracking
 * - Conflict detection based on restrictions
 * - Comprehensive dependency explanations
 */

import { 
  Component, 
  DependencyGraph, 
  DependencyNode, 
  DependencyEdge,
  Conflict,
  ResolutionResult,
  ServiceDependency,
  ComponentDependency,
  ExternalDependency
} from '../../types/component.types';
import { ConditionalEvaluator, EvaluationContext } from './ConditionalEvaluator';

export interface DependencyExplanation {
  direct: string[];
  transitive: string[];
  external: string[];
  conflicts: string[];
}

export class DependencyResolverEnhanced {
  private components: Map<string, Component>;
  private conditionalEvaluator: ConditionalEvaluator;

  constructor(components: Component[]) {
    this.components = new Map(components.map(c => [c.id, c]));
    this.conditionalEvaluator = new ConditionalEvaluator();
  }

  /**
   * Enhanced dependency resolution with conditional logic
   */
  resolveDependenciesEnhanced(
    selectedIds: string[],
    context?: Partial<EvaluationContext>
  ): ResolutionResult {
    const resolved = new Set<string>(selectedIds);
    const autoSelected = new Set<string>();
    const conflicts: Conflict[] = [];
    const explanations: Record<string, string[]> = {};
    const externalDeps = new Set<string>();
    const queue = [...selectedIds];

    // Build evaluation context
    const evalContext: EvaluationContext = {
      selectedComponents: resolved,
      componentVersions: new Map(),
      platformVersion: context?.platformVersion || '5.3.0',
      installationOptions: context?.installationOptions || {}
    };

    // Initialize explanations
    selectedIds.forEach(id => {
      explanations[id] = ['User selected'];
    });

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const component = this.components.get(currentId);
      if (!component) continue;

      // Update context with current selections
      evalContext.selectedComponents = resolved;

      // Process service dependencies
      this.processServiceDependencies(
        component,
        resolved,
        autoSelected,
        queue,
        explanations,
        evalContext
      );

      // Process component dependencies
      this.processComponentDependencies(
        component,
        resolved,
        autoSelected,
        queue,
        explanations,
        evalContext
      );

      // Process external dependencies
      this.processExternalDependencies(
        component,
        externalDeps,
        explanations,
        evalContext
      );

      // Check for conflicts
      this.checkComponentConflicts(
        component,
        resolved,
        conflicts
      );
    }

    return {
      resolved: Array.from(resolved),
      autoSelected: Array.from(autoSelected),
      conflicts,
      explanations,
      externalDependencies: Array.from(externalDeps)
    };
  }

  /**
   * Process service dependencies (required, optional, conditional)
   */
  private processServiceDependencies(
    component: Component,
    resolved: Set<string>,
    autoSelected: Set<string>,
    queue: string[],
    explanations: Record<string, string[]>,
    context: EvaluationContext
  ): void {
    // Required service dependencies
    component.serviceDependencies
      .filter(dep => dep.relationship === 'required')
      .forEach(dep => {
        const depComponent = this.findComponentByName(dep.name);
        if (depComponent && !resolved.has(depComponent.id)) {
          resolved.add(depComponent.id);
          autoSelected.add(depComponent.id);
          queue.push(depComponent.id);
          
          if (!explanations[depComponent.id]) {
            explanations[depComponent.id] = [];
          }
          explanations[depComponent.id].push(
            `Required service dependency of ${component.name}`
          );
          
          if (dep.notes && dep.notes.length > 0) {
            explanations[depComponent.id].push(...dep.notes);
          }
        }
      });

    // Conditional service dependencies
    component.serviceDependencies
      .filter(dep => dep.relationship === 'conditional' && dep.condition)
      .forEach(dep => {
        if (dep.condition) {
          const shouldInclude = this.conditionalEvaluator.evaluate(
            dep.condition,
            context
          );
          
          if (shouldInclude) {
            const depComponent = this.findComponentByName(dep.name);
            if (depComponent && !resolved.has(depComponent.id)) {
              resolved.add(depComponent.id);
              autoSelected.add(depComponent.id);
              queue.push(depComponent.id);
              
              if (!explanations[depComponent.id]) {
                explanations[depComponent.id] = [];
              }
              explanations[depComponent.id].push(
                `Conditional dependency of ${component.name}: ${this.conditionalEvaluator.describeExpression(dep.condition)}`
              );
              
              if (dep.notes && dep.notes.length > 0) {
                explanations[depComponent.id].push(...dep.notes);
              }
            }
          }
        }
      });
  }

  /**
   * Process component dependencies (auto-installed, conditional)
   */
  private processComponentDependencies(
    component: Component,
    resolved: Set<string>,
    autoSelected: Set<string>,
    queue: string[],
    explanations: Record<string, string[]>,
    context: EvaluationContext
  ): void {
    // Auto-installed component dependencies
    component.componentDependencies
      .filter(dep => dep.installBehavior === 'auto_installed' && !dep.conditional)
      .forEach(dep => {
        const depComponent = this.findComponentByOriginalName(dep.originalName);
        if (depComponent && !resolved.has(depComponent.id)) {
          resolved.add(depComponent.id);
          autoSelected.add(depComponent.id);
          queue.push(depComponent.id);
          
          if (!explanations[depComponent.id]) {
            explanations[depComponent.id] = [];
          }
          explanations[depComponent.id].push(
            `Auto-installed component dependency of ${component.name}`
          );
        }
      });

    // Conditional component dependencies
    component.componentDependencies
      .filter(dep => dep.conditional && dep.condition)
      .forEach(dep => {
        if (dep.condition) {
          const shouldInclude = this.conditionalEvaluator.evaluate(
            dep.condition,
            context
          );
          
          if (shouldInclude) {
            const depComponent = this.findComponentByOriginalName(dep.originalName);
            if (depComponent && !resolved.has(depComponent.id)) {
              resolved.add(depComponent.id);
              autoSelected.add(depComponent.id);
              queue.push(depComponent.id);
              
              if (!explanations[depComponent.id]) {
                explanations[depComponent.id] = [];
              }
              explanations[depComponent.id].push(
                `Conditional component dependency of ${component.name}: ${this.conditionalEvaluator.describeExpression(dep.condition)}`
              );
            }
          }
        }
      });
  }

  /**
   * Process external dependencies (operators, storage, etc.)
   */
  private processExternalDependencies(
    component: Component,
    externalDeps: Set<string>,
    explanations: Record<string, string[]>,
    context: EvaluationContext
  ): void {
    component.externalDependencies.forEach(dep => {
      // Skip conditional dependencies that don't meet the condition
      if (dep.conditional && dep.condition) {
        const shouldInclude = this.conditionalEvaluator.evaluate(
          dep.condition,
          context
        );
        if (!shouldInclude) return;
      }

      const depKey = `${dep.type}:${dep.name}`;
      externalDeps.add(depKey);
      
      if (!explanations[depKey]) {
        explanations[depKey] = [];
      }
      explanations[depKey].push(
        `External ${dep.type} required by ${component.name}`
      );
      
      if (dep.notes && dep.notes.length > 0) {
        explanations[depKey].push(...dep.notes);
      }
    });
  }

  /**
   * Check for conflicts based on component restrictions
   */
  private checkComponentConflicts(
    component: Component,
    resolved: Set<string>,
    conflicts: Conflict[]
  ): void {
    component.restrictions.forEach(restriction => {
      // Parse restriction patterns
      // Example: "Cannot be installed with component X"
      // Example: "Requires OpenShift version >= 4.12"
      
      const conflictMatch = restriction.match(/Cannot be installed with (.+)/i);
      if (conflictMatch) {
        const conflictingName = conflictMatch[1].trim();
        const conflictingComponent = this.findComponentByName(conflictingName);
        
        if (conflictingComponent && resolved.has(conflictingComponent.id)) {
          // Check if conflict already exists
          const existingConflict = conflicts.find(c => 
            c.components.includes(component.id) && 
            c.components.includes(conflictingComponent.id)
          );
          
          if (!existingConflict) {
            conflicts.push({
              type: 'incompatible',
              components: [component.id, conflictingComponent.id],
              message: restriction,
              severity: 'error'
            });
          }
        }
      }

      // Check for version requirements
      const versionMatch = restriction.match(/Requires (.+) version (>=|<=|>|<|==) ([\d.]+)/i);
      if (versionMatch) {
        // This would require platform version checking
        // For now, we'll add it as a warning
        conflicts.push({
          type: 'restriction_violation',
          components: [component.id],
          message: restriction,
          severity: 'warning'
        });
      }
    });
  }

  /**
   * Find component by service name
   */
  private findComponentByName(name: string): Component | undefined {
    return Array.from(this.components.values()).find(
      c => c.name.toLowerCase() === name.toLowerCase() ||
           c.originalName.toLowerCase() === name.toLowerCase()
    );
  }

  /**
   * Find component by original name (from YAML)
   */
  private findComponentByOriginalName(originalName: string): Component | undefined {
    return Array.from(this.components.values()).find(
      c => c.originalName === originalName
    );
  }

  /**
   * Get detailed dependency explanation for a component
   */
  getDependencyExplanation(componentId: string, selectedIds: string[]): DependencyExplanation {
    const component = this.components.get(componentId);
    if (!component) {
      return { direct: [], transitive: [], external: [], conflicts: [] };
    }

    const direct: string[] = [];
    const transitive: string[] = [];
    const external: string[] = [];
    const conflicts: string[] = [];

    // Analyze direct service dependencies
    component.serviceDependencies
      .filter(dep => dep.relationship === 'required')
      .forEach(dep => {
        direct.push(`Requires service: ${dep.name}`);
        if (dep.notes && dep.notes.length > 0) {
          dep.notes.forEach(note => direct.push(`  • ${note}`));
        }
      });

    // Analyze direct component dependencies
    component.componentDependencies
      .filter(dep => dep.installBehavior === 'auto_installed')
      .forEach(dep => {
        direct.push(`Auto-installs component: ${dep.name}`);
      });

    // Analyze external dependencies
    component.externalDependencies.forEach(dep => {
      external.push(`Requires ${dep.type}: ${dep.name}`);
      if (dep.notes && dep.notes.length > 0) {
        dep.notes.forEach(note => external.push(`  • ${note}`));
      }
    });

    // Analyze restrictions
    component.restrictions.forEach(restriction => {
      conflicts.push(restriction);
    });

    // Analyze transitive dependencies (dependencies of dependencies)
    const directDepIds = new Set<string>();
    component.serviceDependencies
      .filter(dep => dep.relationship === 'required')
      .forEach(dep => {
        const depComp = this.findComponentByName(dep.name);
        if (depComp) directDepIds.add(depComp.id);
      });

    directDepIds.forEach(depId => {
      const depComponent = this.components.get(depId);
      if (depComponent) {
        depComponent.serviceDependencies
          .filter(dep => dep.relationship === 'required')
          .forEach(dep => {
            transitive.push(`${depComponent.name} requires: ${dep.name}`);
          });
      }
    });

    return { direct, transitive, external, conflicts };
  }

  /**
   * Build a dependency graph from selected components
   */
  buildDependencyGraph(selectedIds: string[]): DependencyGraph {
    const nodes: DependencyNode[] = [];
    const edges: DependencyEdge[] = [];
    const visited = new Set<string>();

    const addNode = (componentId: string, isUserSelected: boolean) => {
      if (visited.has(componentId)) return;
      visited.add(componentId);

      const component = this.components.get(componentId);
      if (!component) return;

      nodes.push({
        id: componentId,
        name: component.name,
        type: 'component',
        selected: isUserSelected,
        autoSelected: !isUserSelected,
        required: !isUserSelected,
      });

      // Add service dependency edges
      component.serviceDependencies
        .filter(dep => dep.relationship === 'required')
        .forEach(dep => {
          const depComponent = this.findComponentByName(dep.name);
          if (depComponent) {
            edges.push({
              source: componentId,
              target: depComponent.id,
              type: 'requires',
            });
            addNode(depComponent.id, false);
          }
        });

      // Add component dependency edges
      component.componentDependencies
        .filter(dep => dep.installBehavior === 'auto_installed')
        .forEach(dep => {
          const depComponent = this.findComponentByOriginalName(dep.originalName);
          if (depComponent) {
            edges.push({
              source: componentId,
              target: depComponent.id,
              type: 'installs',
            });
            addNode(depComponent.id, false);
          }
        });

      // Add conditional dependencies
      component.serviceDependencies
        .filter(dep => dep.relationship === 'conditional' && dep.condition)
        .forEach(dep => {
          const depComponent = this.findComponentByName(dep.name);
          if (depComponent) {
            edges.push({
              source: componentId,
              target: depComponent.id,
              type: 'requires',
              conditional: true,
              condition: dep.condition,
            });
          }
        });
    };

    selectedIds.forEach(id => addNode(id, true));

    return { nodes, edges };
  }

  /**
   * Validate component selection
   */
  validateSelection(selectedIds: string[]): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    selectedIds.forEach(id => {
      const component = this.components.get(id);
      if (!component) return;

      // Check for missing required service dependencies
      component.serviceDependencies
        .filter(dep => dep.relationship === 'required')
        .forEach(dep => {
          const depComponent = this.findComponentByName(dep.name);
          if (depComponent && !selectedIds.includes(depComponent.id)) {
            errors.push(
              `Missing dependency: ${component.name} requires ${dep.name}`
            );
          }
        });

      // Check for optional dependencies
      component.serviceDependencies
        .filter(dep => dep.relationship === 'optional')
        .forEach(dep => {
          const depComponent = this.findComponentByName(dep.name);
          if (depComponent && !selectedIds.includes(depComponent.id)) {
            warnings.push(
              `Optional dependency: ${component.name} works better with ${dep.name}`
            );
          }
        });

      // Check restrictions
      component.restrictions.forEach(restriction => {
        const conflictMatch = restriction.match(/Cannot be installed with (.+)/i);
        if (conflictMatch) {
          const conflictingName = conflictMatch[1].trim();
          const conflictingComponent = this.findComponentByName(conflictingName);
          if (conflictingComponent && selectedIds.includes(conflictingComponent.id)) {
            errors.push(restriction);
          }
        }
      });
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Get components that depend on a given component
   */
  getDependents(componentId: string, allSelectedIds: string[]): string[] {
    const dependents: string[] = [];

    allSelectedIds.forEach(id => {
      const component = this.components.get(id);
      if (!component) return;

      // Check service dependencies
      const hasServiceDep = component.serviceDependencies.some(dep => {
        const depComponent = this.findComponentByName(dep.name);
        return depComponent?.id === componentId;
      });

      // Check component dependencies
      const hasComponentDep = component.componentDependencies.some(dep => {
        const depComponent = this.findComponentByOriginalName(dep.originalName);
        return depComponent?.id === componentId;
      });

      if (hasServiceDep || hasComponentDep) {
        dependents.push(id);
      }
    });

    return dependents;
  }

  /**
   * Check if a component can be safely removed
   */
  canRemoveComponent(componentId: string, selectedIds: string[]): {
    canRemove: boolean;
    reason?: string;
    affectedComponents?: string[];
  } {
    const dependents = this.getDependents(componentId, selectedIds);

    if (dependents.length > 0) {
      const dependentNames = dependents
        .map(id => this.components.get(id)?.name || id)
        .join(', ');

      return {
        canRemove: false,
        reason: `This component is required by: ${dependentNames}`,
        affectedComponents: dependents,
      };
    }

    return { canRemove: true };
  }

  /**
   * Calculate installation order based on dependencies
   */
  getInstallationOrder(selectedIds: string[]): string[] {
    const order: string[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();

    const visit = (id: string) => {
      if (visited.has(id)) return;
      if (visiting.has(id)) {
        throw new Error(`Circular dependency detected involving ${id}`);
      }

      visiting.add(id);

      const component = this.components.get(id);
      if (component) {
        // Visit service dependencies first
        component.serviceDependencies
          .filter(dep => dep.relationship === 'required')
          .forEach(dep => {
            const depComponent = this.findComponentByName(dep.name);
            if (depComponent && selectedIds.includes(depComponent.id)) {
              visit(depComponent.id);
            }
          });

        // Visit component dependencies
        component.componentDependencies
          .filter(dep => dep.installBehavior === 'auto_installed')
          .forEach(dep => {
            const depComponent = this.findComponentByOriginalName(dep.originalName);
            if (depComponent && selectedIds.includes(depComponent.id)) {
              visit(depComponent.id);
            }
          });
      }

      visiting.delete(id);
      visited.add(id);
      order.push(id);
    };

    selectedIds.forEach(id => visit(id));

    return order;
  }
}

// Made with Bob