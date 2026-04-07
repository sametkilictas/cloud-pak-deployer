/**
 * Dependency Detail Panel Component
 * 
 * Displays comprehensive dependency information for a selected component.
 * Shows direct dependencies, transitive dependencies, external requirements,
 * and any conflicts associated with the component.
 * 
 * Features:
 * - Direct dependency list with types
 * - Transitive dependency chains
 * - External dependency requirements
 * - Conflict warnings
 * - Expandable sections
 * - Visual indicators for dependency types
 */

import React, { useState } from 'react';
import {
  Accordion,
  AccordionItem,
  Tag,
  StructuredListWrapper,
  StructuredListHead,
  StructuredListRow,
  StructuredListCell,
  StructuredListBody,
  InlineNotification
} from '@carbon/react';
import {
  ChevronRight,
  Checkmark,
  WarningAlt,
  Information
} from '@carbon/icons-react';
import { DependencyExplanation, Conflict } from '../../types/component.types';
import './DependencyDetailPanel.css';

interface DependencyDetailPanelProps {
  componentId: string;
  componentName: string;
  explanation: DependencyExplanation;
  className?: string;
}

export const DependencyDetailPanel: React.FC<DependencyDetailPanelProps> = ({
  componentId,
  componentName,
  explanation,
  className = ''
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['direct', 'external'])
  );

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const getDependencyTypeColor = (type: 'service' | 'component') => {
    return (type === 'service' ? 'blue' : 'purple') as 'blue' | 'purple';
  };

  const getExternalTypeColor = (type: string) => {
    const colorMap: Record<string, string> = {
      'operator': 'cyan',
      'storage': 'teal',
      'license': 'magenta',
      'platform': 'green'
    };
    return (colorMap[type.toLowerCase()] || 'gray') as 'cyan' | 'teal' | 'magenta' | 'green' | 'gray';
  };

  const hasDirectDependencies = explanation.direct.length > 0;
  const hasTransitiveDependencies = explanation.transitive.length > 0;
  const hasExternalDependencies = explanation.external.length > 0;
  const hasConflicts = explanation.conflicts.length > 0;

  return (
    <div className={`dependency-detail-panel ${className}`}>
      <div className="dependency-detail-panel__header">
        <h3 className="dependency-detail-panel__title">
          Dependency Details: {componentName}
        </h3>
        <div className="dependency-detail-panel__summary">
          {hasDirectDependencies && (
            <Tag type="blue" size="sm">
              {explanation.direct.length} Direct
            </Tag>
          )}
          {hasTransitiveDependencies && (
            <Tag type="purple" size="sm">
              {explanation.transitive.length} Transitive
            </Tag>
          )}
          {hasExternalDependencies && (
            <Tag type="cyan" size="sm">
              {explanation.external.length} External
            </Tag>
          )}
          {hasConflicts && (
            <Tag type="red" size="sm">
              {explanation.conflicts.length} Conflict{explanation.conflicts.length !== 1 ? 's' : ''}
            </Tag>
          )}
        </div>
      </div>

      <div className="dependency-detail-panel__content">
        {/* Direct Dependencies Section */}
        <Accordion>
          <AccordionItem
            title={
              <div className="dependency-detail-panel__accordion-title">
                <span>Direct Dependencies</span>
                <Tag type="blue" size="sm">
                  {explanation.direct.length}
                </Tag>
              </div>
            }
            open={expandedSections.has('direct')}
          >
            {hasDirectDependencies ? (
              <StructuredListWrapper>
                <StructuredListHead>
                  <StructuredListRow head>
                    <StructuredListCell head>Component</StructuredListCell>
                    <StructuredListCell head>Type</StructuredListCell>
                    <StructuredListCell head>Reason</StructuredListCell>
                  </StructuredListRow>
                </StructuredListHead>
                <StructuredListBody>
                  {explanation.direct.map((dep, index) => (
                    <StructuredListRow key={index}>
                      <StructuredListCell>
                        <div className="dependency-detail-panel__component-name">
                          <Checkmark size={16} className="dependency-detail-panel__check-icon" />
                          {dep.name}
                        </div>
                      </StructuredListCell>
                      <StructuredListCell>
                        <Tag type={getDependencyTypeColor(dep.type)} size="sm">
                          {dep.type}
                        </Tag>
                      </StructuredListCell>
                      <StructuredListCell>
                        <span className="dependency-detail-panel__reason">
                          {dep.reason}
                        </span>
                      </StructuredListCell>
                    </StructuredListRow>
                  ))}
                </StructuredListBody>
              </StructuredListWrapper>
            ) : (
              <InlineNotification
                kind="info"
                title="No direct dependencies"
                subtitle="This component does not require any other components."
                lowContrast
                hideCloseButton
              />
            )}
          </AccordionItem>

          {/* Transitive Dependencies Section */}
          <AccordionItem
            title={
              <div className="dependency-detail-panel__accordion-title">
                <span>Transitive Dependencies</span>
                <Tag type="purple" size="sm">
                  {explanation.transitive.length}
                </Tag>
              </div>
            }
            open={expandedSections.has('transitive')}
          >
            {hasTransitiveDependencies ? (
              <div className="dependency-detail-panel__transitive-list">
                {explanation.transitive.map((dep, index) => (
                  <div key={index} className="dependency-detail-panel__transitive-item">
                    <div className="dependency-detail-panel__transitive-chain">
                      <span className="dependency-detail-panel__component-name">
                        {componentName}
                      </span>
                      <ChevronRight size={16} />
                      <span className="dependency-detail-panel__via">
                        {dep.via}
                      </span>
                      <ChevronRight size={16} />
                      <span className="dependency-detail-panel__component-name">
                        {dep.name}
                      </span>
                    </div>
                    <p className="dependency-detail-panel__reason">
                      {dep.reason}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <InlineNotification
                kind="info"
                title="No transitive dependencies"
                subtitle="This component does not have indirect dependencies through other components."
                lowContrast
                hideCloseButton
              />
            )}
          </AccordionItem>

          {/* External Dependencies Section */}
          <AccordionItem
            title={
              <div className="dependency-detail-panel__accordion-title">
                <span>External Requirements</span>
                <Tag type="cyan" size="sm">
                  {explanation.external.length}
                </Tag>
              </div>
            }
            open={expandedSections.has('external')}
          >
            {hasExternalDependencies ? (
              <StructuredListWrapper>
                <StructuredListHead>
                  <StructuredListRow head>
                    <StructuredListCell head>Requirement</StructuredListCell>
                    <StructuredListCell head>Type</StructuredListCell>
                    <StructuredListCell head>Details</StructuredListCell>
                  </StructuredListRow>
                </StructuredListHead>
                <StructuredListBody>
                  {explanation.external.map((ext, index) => (
                    <StructuredListRow key={index}>
                      <StructuredListCell>
                        <div className="dependency-detail-panel__component-name">
                          <Information size={16} className="dependency-detail-panel__info-icon" />
                          {ext.name}
                        </div>
                      </StructuredListCell>
                      <StructuredListCell>
                        <Tag type={getExternalTypeColor(ext.type)} size="sm">
                          {ext.type}
                        </Tag>
                      </StructuredListCell>
                      <StructuredListCell>
                        <span className="dependency-detail-panel__reason">
                          {ext.reason}
                        </span>
                      </StructuredListCell>
                    </StructuredListRow>
                  ))}
                </StructuredListBody>
              </StructuredListWrapper>
            ) : (
              <InlineNotification
                kind="success"
                title="No external requirements"
                subtitle="This component does not require additional operators, storage, or licenses."
                lowContrast
                hideCloseButton
              />
            )}
          </AccordionItem>

          {/* Conflicts Section */}
          {hasConflicts && (
            <AccordionItem
              title={
                <div className="dependency-detail-panel__accordion-title">
                  <span>Conflicts</span>
                  <Tag type="red" size="sm">
                    {explanation.conflicts.length}
                  </Tag>
                </div>
              }
              open={expandedSections.has('conflicts')}
            >
              <div className="dependency-detail-panel__conflicts">
                {explanation.conflicts.map((conflict, index) => (
                  <InlineNotification
                    key={index}
                    kind={conflict.severity === 'error' ? 'error' : 'warning'}
                    title={conflict.type.replace(/_/g, ' ').toUpperCase()}
                    subtitle={conflict.message}
                    lowContrast
                    hideCloseButton
                  />
                ))}
              </div>
            </AccordionItem>
          )}
        </Accordion>
      </div>

      {!hasDirectDependencies && !hasTransitiveDependencies && !hasExternalDependencies && !hasConflicts && (
        <div className="dependency-detail-panel__empty">
          <InlineNotification
            kind="info"
            title="No dependencies"
            subtitle="This component can be installed independently without any dependencies."
            lowContrast
            hideCloseButton
          />
        </div>
      )}
    </div>
  );
};

export default DependencyDetailPanel;

// Made with Bob