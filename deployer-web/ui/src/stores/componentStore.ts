/**
 * Component Store
 * Manages component selection, dependency resolution, and conflict detection
 */

import { create } from 'zustand';
import { Component, DependencyGraph, Conflict } from '@/types';
import { DependencyResolver } from '@/services/dependency/DependencyResolver';
import { MOCK_COMPONENTS } from '@/constants/mockComponents';

interface ComponentStore {
  // State
  components: Component[];
  selectedComponents: Set<string>;
  autoSelectedComponents: Set<string>;
  dependencyGraph: DependencyGraph;
  conflicts: Conflict[];
  explanations: Record<string, string[]>;
  isLoading: boolean;
  error: string | null;
  resolver: DependencyResolver | null;
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
}

export const useComponentStore = create<ComponentStore>((set, get) => ({
  // Initial State
  components: [],
  selectedComponents: new Set(),
  autoSelectedComponents: new Set(),
  dependencyGraph: { nodes: [], edges: [] },
  conflicts: [],
  explanations: {},
  isLoading: false,
  error: null,
  resolver: null,
  searchTerm: '',
  categoryFilter: null,

  // Load components and initialize resolver
  loadComponents: () => {
    set({ isLoading: true, error: null });

    try {
      const components = MOCK_COMPONENTS;
      const resolver = new DependencyResolver(components);

      set({
        components,
        resolver,
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
    const { selectedComponents, resolver } = get();

    if (!resolver) {
      console.error('Resolver not initialized');
      return;
    }

    // Add to selected components
    const newSelected = new Set(selectedComponents);
    newSelected.add(componentId);

    // Resolve dependencies
    const result = resolver.resolveDependencies(newSelected);

    // Build visual graph
    const graph = resolver.buildDependencyGraph(new Set(result.resolved));

    // Update auto-selected flag in graph nodes
    graph.nodes.forEach(node => {
      node.autoSelected = result.autoSelected.includes(node.id);
    });

    set({
      selectedComponents: new Set(result.resolved),
      autoSelectedComponents: new Set(result.autoSelected),
      conflicts: result.conflicts,
      explanations: result.explanations,
      dependencyGraph: graph
    });
  },

  // Deselect a component
  deselectComponent: (componentId: string) => {
    const { selectedComponents, autoSelectedComponents, resolver } = get();

    // Cannot deselect auto-selected components
    if (autoSelectedComponents.has(componentId)) {
      console.warn('Cannot deselect auto-selected component:', componentId);
      return;
    }

    if (!resolver) {
      console.error('Resolver not initialized');
      return;
    }

    // Remove from selected components
    const newSelected = new Set(selectedComponents);
    newSelected.delete(componentId);

    // Resolve dependencies for remaining components
    const result = resolver.resolveDependencies(newSelected);

    // Build visual graph
    const graph = resolver.buildDependencyGraph(new Set(result.resolved));

    // Update auto-selected flag in graph nodes
    graph.nodes.forEach(node => {
      node.autoSelected = result.autoSelected.includes(node.id);
    });

    set({
      selectedComponents: new Set(result.resolved),
      autoSelectedComponents: new Set(result.autoSelected),
      conflicts: result.conflicts,
      explanations: result.explanations,
      dependencyGraph: graph
    });
  },

  // Toggle component selection
  toggleComponent: (componentId: string) => {
    const { selectedComponents, autoSelectedComponents } = get();

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
    const { selectedComponents, resolver } = get();

    if (!resolver) return;

    const result = resolver.resolveDependencies(selectedComponents);
    const graph = resolver.buildDependencyGraph(new Set(result.resolved));

    graph.nodes.forEach(node => {
      node.autoSelected = result.autoSelected.includes(node.id);
    });

    set({
      selectedComponents: new Set(result.resolved),
      autoSelectedComponents: new Set(result.autoSelected),
      conflicts: result.conflicts,
      explanations: result.explanations,
      dependencyGraph: graph
    });
  },

  // Clear all selections
  clearSelection: () => {
    set({
      selectedComponents: new Set(),
      autoSelectedComponents: new Set(),
      conflicts: [],
      explanations: {},
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
    const { resolver } = get();
    if (!resolver) return [];
    return resolver.getOptionalDependencies(componentId);
  },

  // Get dependency chain for a component
  getDependencyChain: (componentId: string) => {
    const { resolver } = get();
    if (!resolver) return [];
    return resolver.getDependencyChain(componentId);
  }
}));

// Made with Bob
