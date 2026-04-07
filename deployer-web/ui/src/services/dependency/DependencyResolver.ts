import { 
  Component, 
  DependencyGraph, 
  DependencyNode, 
  DependencyEdge,
  Conflict,
  ResolutionResult 
} from '../../types/component.types';

export class DependencyResolver {
  private components: Map<string, Component>;

  constructor(components: Component[]) {
    this.components = new Map(components.map(c => [c.id, c]));
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

      // Add dependencies
      if (component.dependencies) {
        component.dependencies.required?.forEach(depId => {
          edges.push({
            source: componentId,
            target: depId,
            type: 'requires',
          });
          addNode(depId, false);
        });

        component.dependencies.optional?.forEach(depId => {
          edges.push({
            source: componentId,
            target: depId,
            type: 'optional',
          });
        });

        component.dependencies.conditional?.forEach(cond => {
          cond.requires.forEach(depId => {
            edges.push({
              source: componentId,
              target: depId,
              type: 'requires',
              conditional: true,
              condition: cond.condition,
            });
          });
        });
      }
    };

    selectedIds.forEach(id => addNode(id, true));

    return { nodes, edges };
  }

  /**
   * Resolve all dependencies for selected components
   */
  resolveDependencies(selectedIds: string[]): ResolutionResult {
    const resolved = new Set<string>(selectedIds);
    const autoSelected = new Set<string>();
    const conflicts: Conflict[] = [];
    const explanations: Record<string, string[]> = {};
    const queue = [...selectedIds];

    // Initialize explanations for user-selected components
    selectedIds.forEach(id => {
      explanations[id] = ['User selected'];
    });

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const component = this.components.get(currentId);

      if (!component?.dependencies?.required) continue;

      component.dependencies.required.forEach(depId => {
        if (!resolved.has(depId)) {
          resolved.add(depId);
          autoSelected.add(depId);
          queue.push(depId);

          // Add explanation
          if (!explanations[depId]) {
            explanations[depId] = [];
          }
          explanations[depId].push(`Required by ${component.name}`);
        }
      });
    }

    return {
      resolved: Array.from(resolved),
      autoSelected: Array.from(autoSelected),
      conflicts,
      explanations,
    };
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

    // Check for missing dependencies
    selectedIds.forEach(id => {
      const component = this.components.get(id);
      if (!component?.dependencies?.required) return;

      component.dependencies.required.forEach(depId => {
        if (!selectedIds.includes(depId)) {
          const depComponent = this.components.get(depId);
          errors.push(
            `Missing dependency: ${component.name} requires ${depComponent?.name || depId}`
          );
        }
      });
    });

    // Check for optional dependencies
    selectedIds.forEach(id => {
      const component = this.components.get(id);
      if (!component?.dependencies?.optional) return;

      component.dependencies.optional.forEach(depId => {
        if (!selectedIds.includes(depId)) {
          const depComponent = this.components.get(depId);
          warnings.push(
            `Optional dependency: ${component.name} works better with ${depComponent?.name || depId}`
          );
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
   * Detect conflicts between selected components
   */
  detectConflicts(selectedIds: string[]): Conflict[] {
    const conflicts: Conflict[] = [];
    // Conflict detection logic would go here
    // For now, returning empty array as conflicts are not in the dependency structure
    return conflicts;
  }

  /**
   * Get components that depend on a given component
   */
  getDependents(componentId: string, allSelectedIds: string[]): string[] {
    const dependents: string[] = [];

    allSelectedIds.forEach(id => {
      const component = this.components.get(id);
      if (!component?.dependencies?.required) return;

      if (component.dependencies.required.includes(componentId)) {
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
   * Get recommended components based on current selection
   */
  getRecommendations(selectedIds: string[]): Component[] {
    const recommendations = new Set<string>();

    selectedIds.forEach(id => {
      const component = this.components.get(id);
      if (!component?.dependencies?.optional) return;

      component.dependencies.optional.forEach(depId => {
        if (!selectedIds.includes(depId)) {
          recommendations.add(depId);
        }
      });
    });

    return Array.from(recommendations)
      .map(id => this.components.get(id))
      .filter((c): c is Component => c !== undefined);
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
      if (component?.dependencies?.required) {
        component.dependencies.required.forEach(depId => {
          if (selectedIds.includes(depId)) {
            visit(depId);
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

  /**
   * Get optional dependencies for a component
   */
  getOptionalDependencies(componentId: string): string[] {
    const component = this.components.get(componentId);
    return component?.dependencies?.optional || [];
  }

  /**
   * Get dependency chain for a component
   */
  getDependencyChain(componentId: string): string[] {
    const chain: string[] = [];
    const visited = new Set<string>();

    const traverse = (id: string) => {
      if (visited.has(id)) return;
      visited.add(id);

      const component = this.components.get(id);
      if (!component?.dependencies?.required) return;

      component.dependencies.required.forEach(depId => {
        chain.push(depId);
        traverse(depId);
      });
    };

    traverse(componentId);
    return chain;
  }
}

// Made with Bob
