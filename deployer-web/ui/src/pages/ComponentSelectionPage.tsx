/**
 * Component Selection Page
 * 
 * Allows users to select Cloud Pak components for deployment.
 * Features:
 * - Grid layout of available components
 * - Search and filter functionality
 * - Real-time dependency resolution
 * - Visual dependency graph
 * - Component details modal
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Column,
  Search,
  Tabs,
  TabList,
  Tab,
  Button,
  Modal,
} from '@carbon/react';
import { CheckmarkFilled, WarningAlt } from '@carbon/icons-react';
import { useComponentStore } from '../stores/componentStore';
import { ComponentCard } from '../components/common/ComponentCard';
import { DependencyGraph } from '../components/common/DependencyGraph';
import { ConflictWarning } from '../components/common/ConflictWarning';
import { Component } from '../types';
import './ComponentSelectionPage.css';

export const ComponentSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    components,
    selectedComponents,
    autoSelectedComponents,
    dependencyGraph,
    conflicts,
    toggleComponent,
    loadComponents,
    setSearchTerm,
    setCategoryFilter,
    searchTerm,
    categoryFilter
  } = useComponentStore();

  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedComponentForDetails, setSelectedComponentForDetails] = useState<Component | null>(null);

  // Load components on mount
  useEffect(() => {
    if (components.length === 0) {
      loadComponents();
    }
  }, [components.length, loadComponents]);

  // Get unique categories from components
  const categories = useMemo(() => {
    const cats = new Set(components.map(c => c.category));
    return ['all', ...Array.from(cats)];
  }, [components]);

  // Filter components based on search and category
  const filteredComponents = useMemo(() => {
    return components.filter(component => {
      const matchesSearch = !searchTerm ||
        component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        component.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !categoryFilter || categoryFilter === 'all' || component.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [components, searchTerm, categoryFilter]);

  // Count selected components
  const selectedCount = selectedComponents.size;
  const autoSelectedCount = autoSelectedComponents.size;
  const conflictCount = conflicts.length;

  // Get conflicted component IDs
  const conflictedComponents = useMemo(() => {
    const conflictedIds = new Set<string>();
    conflicts.forEach(conflict => {
      conflict.components.forEach(id => conflictedIds.add(id));
    });
    return conflictedIds;
  }, [conflicts]);

  const handleComponentSelect = (componentId: string) => {
    toggleComponent(componentId);
  };

  const handleComponentDeselect = (componentId: string) => {
    toggleComponent(componentId);
  };

  const handleViewDetails = (component: Component) => {
    setSelectedComponentForDetails(component);
    setDetailsModalOpen(true);
  };

  const handleProceedToConfiguration = () => {
    // Navigate to configuration page using React Router
    navigate('/configuration');
  };

  return (
    <div className="component-selection-page">
      {/* Page Header */}
      <div className="page-header">
        <h1>Select Components</h1>
        <p className="page-subtitle">
          Choose the Cloud Pak for Data components you want to deploy. 
          Dependencies will be automatically selected.
        </p>
      </div>

      {/* Selection Summary */}
      <div className="selection-summary">
        <div className="summary-item">
          <CheckmarkFilled size={20} className="summary-icon" />
          <span className="summary-label">Selected:</span>
          <span className="summary-value">{selectedCount}</span>
        </div>
        {autoSelectedCount > 0 && (
          <div className="summary-item auto-selected">
            <span className="summary-label">Auto-selected dependencies:</span>
            <span className="summary-value">{autoSelectedCount}</span>
          </div>
        )}
        {conflictCount > 0 && (
          <div className="summary-item conflicts">
            <WarningAlt size={20} className="summary-icon warning" />
            <span className="summary-label">Conflicts detected:</span>
            <span className="summary-value">{conflictCount}</span>
          </div>
        )}
      </div>

      {/* Conflict Warnings */}
      {conflicts.length > 0 && (
        <div className="conflicts-section">
          <ConflictWarning conflicts={conflicts} />
        </div>
      )}


      {/* Search and Filter Controls */}
      <div className="controls-section">
        <Search
          size="lg"
          placeholder="Search components..."
          labelText="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClear={() => setSearchTerm('')}
        />

        <Tabs selectedIndex={categories.indexOf(categoryFilter || 'all')}>
          <TabList aria-label="Component categories">
            {categories.map(category => (
              <Tab
                key={category}
                onClick={() => setCategoryFilter(category === 'all' ? null : category)}
              >
                {category === 'all' ? 'All Components' : category}
              </Tab>
            ))}
          </TabList>
        </Tabs>
      </div>

      {/* Component Grid */}
      <div className="components-grid-section">
        <Grid narrow>
          {filteredComponents.map(component => {
            const isSelected = selectedComponents.has(component.id);
            const isAutoSelected = autoSelectedComponents.has(component.id);

            return (
              <Column key={component.id} sm={4} md={4} lg={4}>
                <ComponentCard
                  component={component}
                  isSelected={isSelected}
                  isAutoSelected={isAutoSelected}
                  onSelect={() => handleComponentSelect(component.id)}
                  onDeselect={() => handleComponentDeselect(component.id)}
                  onShowInfo={() => handleViewDetails(component)}
                />
              </Column>
            );
          })}
        </Grid>

        {filteredComponents.length === 0 && (
          <div className="no-results">
            <p>No components found matching your search criteria.</p>
          </div>
        )}
      </div>

      {/* Dependency Visualization */}
      {(selectedCount > 0 || autoSelectedCount > 0) && (
        <div className="dependency-section">
          <h2>Dependency Graph</h2>
          <p className="section-subtitle">
            Visual representation of component dependencies. Hover over nodes to see details.
          </p>
          <DependencyGraph
            components={components}
            selectedComponents={selectedComponents}
            autoSelectedComponents={autoSelectedComponents}
            conflictedComponents={conflictedComponents}
            onComponentClick={toggleComponent}
            height={500}
          />
        </div>
      )}

      {/* Action Buttons */}
      {selectedCount > 0 && (
        <div className="action-buttons">
          <Button
            kind="primary"
            size="lg"
            onClick={handleProceedToConfiguration}
          >
            Proceed to Configuration ({selectedCount + autoSelectedCount} components)
          </Button>
        </div>
      )}

      {/* Component Details Modal */}
      <Modal
        open={detailsModalOpen}
        onRequestClose={() => setDetailsModalOpen(false)}
        modalHeading={selectedComponentForDetails?.name}
        passiveModal
        size="lg"
      >
        {selectedComponentForDetails && (
          <div className="component-details-modal">
            <div className="detail-section">
              <h3>Description</h3>
              <p>{selectedComponentForDetails.description}</p>
            </div>

            <div className="detail-section">
              <h3>Category</h3>
              <p>{selectedComponentForDetails.category}</p>
            </div>

            {selectedComponentForDetails.serviceDependencies.length > 0 && (
              <div className="detail-section">
                <h3>Service Dependencies</h3>
                <ul>
                  {selectedComponentForDetails.serviceDependencies.map((dep, idx) => (
                    <li key={idx}>
                      <strong>{dep.name}</strong> ({dep.relationship})
                      {dep.notes && dep.notes.length > 0 && (
                        <ul className="notes-list">
                          {dep.notes.map((note, noteIdx) => (
                            <li key={noteIdx}>{note}</li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedComponentForDetails.componentDependencies.length > 0 && (
              <div className="detail-section">
                <h3>Component Dependencies</h3>
                <ul>
                  {selectedComponentForDetails.componentDependencies.map((dep, idx) => (
                    <li key={idx}>
                      <strong>{dep.name}</strong> ({dep.installBehavior})
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedComponentForDetails.restrictions.length > 0 && (
              <div className="detail-section">
                <h3>Restrictions</h3>
                <ul>
                  {selectedComponentForDetails.restrictions.map((restriction, idx) => (
                    <li key={idx}>{restriction}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ComponentSelectionPage;

// Made with Bob
