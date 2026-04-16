/**
 * Component Store
 * Manages component selection, dependency resolution, and conflict detection
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Component, DependencyGraph, Conflict } from '@/types';
import { DependencyResolver } from '../services/dependency/DependencyResolver';
import { DependencyResolverEnhanced, DependencyExplanation } from '../services/dependency/DependencyResolverEnhanced';
import { MOCK_COMPONENTS } from '@/constants/mockComponents';

interface ComponentStore {
  // State
  components: Component[];
  selectedComponents: Set<string>;
  autoSelectedComponents: Set<string>;
  dependencyGraph: DependencyGraph;
  conflicts: Conflict[];
  explanations: Record<string, string[]>;
  externalDependencies: Set<string>;
  isLoading: boolean;
  error: string | null;
  resolver: DependencyResolver | null;
  resolverEnhanced: DependencyResolverEnhanced | null;
  searchTerm: string;
  categoryFilter: string | null;

  // Actions
  loadComponents: () => void;
  selectComponent: (componentId: string) => void;
  deselectComponent: (componentId: string) => void;
  toggleComponent: (componentId: string) => void;
  resolveDependencies: () => void;
  clearSelection: () => void;
  setSearchTerm: (term: string) => void;
  setCategoryFilter: (category: string | null) => void;

  // Computed/Getters
  getComponent: (id: string) => Component | undefined;
  getSelectedComponentsList: () => Component[];
  getFilteredComponents: () => Component[];
  hasConflicts: () => boolean;
  getOptionalDependencies: (componentId: string) => Array<{
    id: string;
    name: string;
    reason: string;
  }>;
  getDependencyChain: (componentId: string) => string[];
  getComponentExplanation: (componentId: string) => DependencyExplanation;
}

export const useComponentStore = create<ComponentStore>()(
  persist(
    (set, get) => ({
  // Initial State
  components: [],
  selectedComponents: new Set(),
  autoSelectedComponents: new Set(),
  dependencyGraph: { nodes: [], edges: [] },
  conflicts: [],
  explanations: {},
  externalDependencies: new Set(),
  isLoading: false,
  error: null,
  resolver: null,
  resolverEnhanced: null,
  searchTerm: '',
  categoryFilter: null,

  // Load components and initialize resolver
  loadComponents: () => {
    set({ isLoading: true, error: null });

    try {
      const components = MOCK_COMPONENTS;
      const resolver = new DependencyResolver(components);
      const resolverEnhanced = new DependencyResolverEnhanced(components);

      // Pre-select required foundation components
      const requiredComponents = components.filter(c => c.required);
      const selectedIds = new Set(requiredComponents.map(c => c.id));

      set({
        components,
        resolver,
        resolverEnhanced,
        selectedComponents: selectedIds,
        isLoading: false
      });
    } catch (error) {
      set({
        error: (error as Error).message,
        isLoading: false
      });
    }
  },

  // Select a component
  selectComponent: (componentId: string) => {
    const { selectedComponents, resolverEnhanced } = get();

    if (!resolverEnhanced) {
      console.error('Enhanced resolver not initialized');
      return;
    }

    // Add to selected components
    const newSelected = new Set(selectedComponents);
    newSelected.add(componentId);

    // Resolve dependencies using enhanced resolver
    const result = resolverEnhanced.resolveDependenciesEnhanced(
      Array.from(newSelected),
      {
        platformVersion: '5.3.0',
        installationOptions: {}
      }
    );

    // Build visual graph
    const graph = resolverEnhanced.buildDependencyGraph(result.resolved);

    // Update auto-selected flag in graph nodes
    graph.nodes.forEach((node: any) => {
      node.autoSelected = result.autoSelected.includes(node.id);
    });

    set({
      selectedComponents: new Set(result.resolved),
      autoSelectedComponents: new Set(result.autoSelected),
      conflicts: result.conflicts,
      explanations: result.explanations,
      externalDependencies: new Set(result.externalDependencies || []),
      dependencyGraph: graph
    });
  },

  // Deselect a component
  deselectComponent: (componentId: string) => {
    const { selectedComponents, autoSelectedComponents, resolverEnhanced, components } = get();

    // Cannot deselect required components
    const component = components.find(c => c.id === componentId);
    if (component?.required) {
      console.warn('Cannot deselect required component:', componentId);
      return;
    }

    // Cannot deselect auto-selected components
    if (autoSelectedComponents.has(componentId)) {
      console.warn('Cannot deselect auto-selected component:', componentId);
      return;
    }

    if (!resolverEnhanced) {
      console.error('Enhanced resolver not initialized');
      return;
    }

    // Remove from selected components
    const newSelected = new Set(selectedComponents);
    newSelected.delete(componentId);

    // Resolve dependencies for remaining components using enhanced resolver
    const result = resolverEnhanced.resolveDependenciesEnhanced(
      Array.from(newSelected),
      {
        platformVersion: '5.3.0',
        installationOptions: {}
      }
    );

    // Build visual graph
    const graph = resolverEnhanced.buildDependencyGraph(result.resolved);

    // Update auto-selected flag in graph nodes
    graph.nodes.forEach((node: any) => {
      node.autoSelected = result.autoSelected.includes(node.id);
    });

    set({
      selectedComponents: new Set(result.resolved),
      autoSelectedComponents: new Set(result.autoSelected),
      conflicts: result.conflicts,
      explanations: result.explanations,
      externalDependencies: new Set(result.externalDependencies || []),
      dependencyGraph: graph
    });
  },

  // Toggle component selection
  toggleComponent: (componentId: string) => {
    const { selectedComponents, autoSelectedComponents, components } = get();

    // Cannot toggle required components
    const component = components.find(c => c.id === componentId);
    if (component?.required) {
      return;
    }

    // Cannot toggle auto-selected components
    if (autoSelectedComponents.has(componentId)) {
      return;
    }

    if (selectedComponents.has(componentId)) {
      get().deselectComponent(componentId);
    } else {
      get().selectComponent(componentId);
    }
  },

  // Manually trigger dependency resolution (useful after config changes)
  resolveDependencies: () => {
    const { selectedComponents, resolverEnhanced } = get();

    if (!resolverEnhanced) return;

    const result = resolverEnhanced.resolveDependenciesEnhanced(
      Array.from(selectedComponents),
      {
        platformVersion: '5.3.0',
        installationOptions: {}
      }
    );
    const graph = resolverEnhanced.buildDependencyGraph(result.resolved);

    graph.nodes.forEach((node: any) => {
      node.autoSelected = result.autoSelected.includes(node.id);
    });

    set({
      selectedComponents: new Set(result.resolved),
      autoSelectedComponents: new Set(result.autoSelected),
      conflicts: result.conflicts,
      explanations: result.explanations,
      externalDependencies: new Set(result.externalDependencies || []),
      dependencyGraph: graph
    });
  },

  // Clear all selections (except required components)
  clearSelection: () => {
    const { components } = get();
    // Keep required components selected
    const requiredComponents = components.filter(c => c.required);
    const selectedIds = new Set(requiredComponents.map(c => c.id));
    
    set({
      selectedComponents: selectedIds,
      autoSelectedComponents: new Set(),
      conflicts: [],
      explanations: {},
      externalDependencies: new Set(),
      dependencyGraph: { nodes: [], edges: [] }
    });
  },

  // Set search term
  setSearchTerm: (term: string) => {
    set({ searchTerm: term });
  },

  // Set category filter
  setCategoryFilter: (category: string | null) => {
    set({ categoryFilter: category });
  },

  // Get component by ID
  getComponent: (id: string) => {
    const { components } = get();
    return components.find(c => c.id === id);
  },

  // Get list of selected components
  getSelectedComponentsList: () => {
    const { components, selectedComponents } = get();
    return components.filter(c => selectedComponents.has(c.id));
  },

  // Get filtered components based on search and category
  getFilteredComponents: () => {
    const { components, searchTerm, categoryFilter } = get();

    let filtered = components;

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        c =>
          c.name.toLowerCase().includes(term) ||
          c.description.toLowerCase().includes(term) ||
          c.originalName.toLowerCase().includes(term)
      );
    }

    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter(c => c.category === categoryFilter);
    }

    return filtered;
  },

  // Check if there are any conflicts
  hasConflicts: () => {
    const { conflicts } = get();
    return conflicts.length > 0;
  },

  // Get optional dependencies for a component
  getOptionalDependencies: (componentId: string) => {
    const { resolver, components } = get();
    if (!resolver) return [];
    const depIds = resolver.getOptionalDependencies(componentId);
    return depIds.map(id => {
      const comp = components.find(c => c.id === id);
      return {
        id,
        name: comp?.name || id,
        reason: 'Optional dependency'
      };
    });
  },

  // Get dependency chain for a component
  getDependencyChain: (componentId: string) => {
    const { resolver } = get();
    if (!resolver) return [];
    return resolver.getDependencyChain(componentId);
  },

  // Get comprehensive dependency explanation for a component
  getComponentExplanation: (componentId: string): DependencyExplanation => {
    const { resolverEnhanced, selectedComponents } = get();
    if (!resolverEnhanced) {
      return { direct: [], transitive: [], external: [], conflicts: [] };
    }
    return resolverEnhanced.getDependencyExplanation(
      componentId,
      Array.from(selectedComponents)
    );
  }
    }),
    {
      name: 'cpd-component-selection',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const { state } = JSON.parse(str);
          return {
            state: {
              ...state,
              // Convert arrays back to Sets
              selectedComponents: new Set(state.selectedComponents || []),
              autoSelectedComponents: new Set(state.autoSelectedComponents || []),
              externalDependencies: new Set(state.externalDependencies || []),
            },
          };
        },
        setItem: (name, value) => {
          const { state } = value;
          localStorage.setItem(
            name,
            JSON.stringify({
              state: {
                ...state,
                // Convert Sets to arrays for storage
                selectedComponents: Array.from(state.selectedComponents),
                autoSelectedComponents: Array.from(state.autoSelectedComponents),
                externalDependencies: Array.from(state.externalDependencies),
              },
            })
          );
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
      partialize: (state) => ({
        selectedComponents: state.selectedComponents,
        autoSelectedComponents: state.autoSelectedComponents,
        dependencyGraph: state.dependencyGraph,
        conflicts: state.conflicts,
        explanations: state.explanations,
        externalDependencies: state.externalDependencies,
      }),
    }
  )
);

// Made with Bob
