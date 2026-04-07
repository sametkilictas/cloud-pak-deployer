# Phase 1.5.7: UI Component Enhancements for Dependency Visualization

## Overview
This phase enhances the UI components to visualize the advanced dependency features implemented in Phase 1.5.6, providing users with clear, actionable information about component dependencies, conflicts, and requirements.

## Duration
1 day

## Goals
- Enhanced dependency visualization in the graph
- Improved component details modal with comprehensive dependency information
- Visual indicators for auto-selected components
- Conflict warnings and resolution guidance
- External dependency requirements display
- Dependency chain explanation tooltips

## Implementation Tasks

### Task 1: Enhanced Component Card (2 hours)

**File:** `deployer-web/ui/src/components/common/ComponentCard.tsx`

Add visual indicators for dependency status:

```typescript
import { 
  CheckmarkFilled, 
  WarningFilled, 
  InformationFilled,
  Link,
  Locked
} from '@carbon/icons-react';

interface ComponentCardProps {
  component: CloudPakComponentEnhanced;
  isSelected: boolean;
  isAutoSelected: boolean;
  hasConflicts?: boolean;
  hasExternalDeps?: boolean;
  dependencyCount?: number;
  onSelect: () => void;
  onDeselect: () => void;
  onShowInfo: () => void;
}

export const ComponentCard: React.FC<ComponentCardProps> = ({
  component,
  isSelected,
  isAutoSelected,
  hasConflicts = false,
  hasExternalDeps = false,
  dependencyCount = 0,
  onSelect,
  onDeselect,
  onShowInfo
}) => {
  return (
    <div className={`component-card ${isSelected ? 'selected' : ''} ${isAutoSelected ? 'auto-selected' : ''}`}>
      {/* Existing card content */}
      
      {/* Dependency Indicators */}
      <div className="component-card__indicators">
        {isAutoSelected && (
          <Tag type="blue" size="sm" renderIcon={Locked}>
            Auto-selected
          </Tag>
        )}
        
        {hasConflicts && (
          <Tag type="red" size="sm" renderIcon={WarningFilled}>
            Conflicts
          </Tag>
        )}
        
        {hasExternalDeps && (
          <Tag type="purple" size="sm" renderIcon={Link}>
            External Deps
          </Tag>
        )}
        
        {dependencyCount > 0 && (
          <Tag type="gray" size="sm">
            {dependencyCount} dependencies
          </Tag>
        )}
      </div>
      
      {/* Restriction Warnings */}
      {component.restrictions.length > 0 && (
        <div className="component-card__restrictions">
          <InformationFilled size={16} />
          <span>{component.restrictions.length} restriction(s)</span>
        </div>
      )}
    </div>
  );
};
```

**CSS Updates:** `deployer-web/ui/src/components/common/ComponentCard.css`

```css
.component-card__indicators {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.component-card__restrictions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background-color: var(--cds-notification-background-info);
  border-left: 3px solid var(--cds-support-info);
  font-size: 0.875rem;
  color: var(--cds-text-secondary);
}

.component-card.auto-selected {
  border: 2px solid var(--cds-interactive);
  background-color: var(--cds-layer-selected-01);
}

.component-card.auto-selected::after {
  content: '';
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--cds-interactive);
}
```

### Task 2: Enhanced Dependency Graph (3 hours)

**File:** `deployer-web/ui/src/components/common/DependencyGraph.tsx`

Add enhanced visualization features:

```typescript
import { 
  InformationSquare, 
  WarningAlt,
  Link as LinkIcon
} from '@carbon/icons-react';

export const DependencyGraph: React.FC<DependencyGraphProps> = ({
  components,
  selectedComponents,
  autoSelectedComponents,
  conflicts = [],
  externalDependencies = new Set(),
  onComponentClick,
  height = 600
}) => {
  const [selectedNode, setSelectedNode] = React.useState<string | null>(null);
  const [showDependencyPanel, setShowDependencyPanel] = React.useState(false);

  // Enhanced node rendering with status indicators
  const nodeCanvasObject = useCallback((node: any, ctx: any, globalScale: any) => {
    const label = node.name;
    const fontSize = 12 / globalScale;
    const nodeRadius = 8;
    
    // Draw node circle with status color
    ctx.fillStyle = getNodeColor(node);
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeRadius, 0, 2 * Math.PI, false);
    ctx.fill();
    
    // Draw status ring for auto-selected
    if (node.type === 'auto-selected') {
      ctx.strokeStyle = '#0f62fe';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeRadius + 3, 0, 2 * Math.PI, false);
      ctx.stroke();
    }
    
    // Draw warning indicator for conflicts
    if (node.hasConflicts) {
      ctx.fillStyle = '#da1e28';
      ctx.beginPath();
      ctx.arc(node.x + nodeRadius, node.y - nodeRadius, 4, 0, 2 * Math.PI, false);
      ctx.fill();
    }
    
    // Draw external dependency indicator
    if (node.hasExternalDeps) {
      ctx.fillStyle = '#8a3ffc';
      ctx.beginPath();
      ctx.arc(node.x - nodeRadius, node.y - nodeRadius, 4, 0, 2 * Math.PI, false);
      ctx.fill();
    }
    
    // Draw label
    if (showLabels) {
      ctx.font = `${fontSize}px Sans-Serif`;
      const textWidth = ctx.measureText(label).width;
      const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.4);
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillRect(
        node.x - bckgDimensions[0] / 2,
        node.y + 12,
        bckgDimensions[0],
        bckgDimensions[1]
      );
      
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#161616';
      ctx.fillText(label, node.x, node.y + 12 + fontSize / 2);
    }
  }, [showLabels]);

  // Enhanced link rendering with dependency type styling
  const linkCanvasObject = useCallback((link: any, ctx: any, globalScale: any) => {
    const start = link.source;
    const end = link.target;
    
    // Draw link line
    ctx.strokeStyle = getLinkColor(link);
    ctx.lineWidth = link.type === 'required' ? 2 : 1;
    
    if (link.type === 'conditional') {
      ctx.setLineDash([5, 5]);
    } else {
      ctx.setLineDash([]);
    }
    
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
    
    // Draw arrow
    const angle = Math.atan2(end.y - start.y, end.x - start.x);
    const arrowLength = 10;
    const arrowWidth = 6;
    
    ctx.fillStyle = getLinkColor(link);
    ctx.beginPath();
    ctx.moveTo(end.x, end.y);
    ctx.lineTo(
      end.x - arrowLength * Math.cos(angle) - arrowWidth * Math.sin(angle),
      end.y - arrowLength * Math.sin(angle) + arrowWidth * Math.cos(angle)
    );
    ctx.lineTo(
      end.x - arrowLength * Math.cos(angle) + arrowWidth * Math.sin(angle),
      end.y - arrowLength * Math.sin(angle) - arrowWidth * Math.cos(angle)
    );
    ctx.closePath();
    ctx.fill();
  }, []);

  return (
    <div className="dependency-graph">
      {/* Existing controls */}
      
      {/* Graph canvas */}
      <div className="dependency-graph__canvas">
        <ForceGraph2D
          ref={graphRef}
          graphData={graphData}
          height={height}
          nodeLabel={(node: any) => node.name}
          nodeCanvasObject={nodeCanvasObject}
          linkCanvasObject={linkCanvasObject}
          onNodeClick={(node: any) => {
            setSelectedNode(node.id);
            setShowDependencyPanel(true);
            if (onComponentClick) {
              onComponentClick(node.id);
            }
          }}
          onNodeHover={(node: any) => {
            // Show tooltip with dependency info
          }}
          cooldownTicks={100}
          d3AlphaDecay={0.02}
          d3VelocityDecay={0.3}
        />
      </div>

      {/* Enhanced Legend */}
      <div className="dependency-graph__legend">
        <h4>Legend</h4>
        <div className="legend-section">
          <h5>Node Types</h5>
          <div className="legend-item">
            <div className="legend-node selected" />
            <span>User Selected</span>
          </div>
          <div className="legend-item">
            <div className="legend-node auto-selected" />
            <span>Auto Selected (with ring)</span>
          </div>
          <div className="legend-item">
            <div className="legend-node available" />
            <span>Available</span>
          </div>
        </div>
        
        <div className="legend-section">
          <h5>Dependency Types</h5>
          <div className="legend-item">
            <div className="legend-line required" />
            <span>Required (solid)</span>
          </div>
          <div className="legend-item">
            <div className="legend-line optional" />
            <span>Optional (solid)</span>
          </div>
          <div className="legend-item">
            <div className="legend-line conditional" />
            <span>Conditional (dashed)</span>
          </div>
        </div>
        
        <div className="legend-section">
          <h5>Indicators</h5>
          <div className="legend-item">
            <WarningAlt size={16} className="text-red" />
            <span>Has conflicts</span>
          </div>
          <div className="legend-item">
            <LinkIcon size={16} className="text-purple" />
            <span>External dependencies</span>
          </div>
        </div>
      </div>

      {/* Dependency Detail Panel */}
      {showDependencyPanel && selectedNode && (
        <DependencyDetailPanel
          componentId={selectedNode}
          onClose={() => setShowDependencyPanel(false)}
        />
      )}
    </div>
  );
};
```

### Task 3: Dependency Detail Panel Component (2 hours)

**New File:** `deployer-web/ui/src/components/common/DependencyDetailPanel.tsx`

```typescript
import React from 'react';
import {
  SidePanel,
  Accordion,
  AccordionItem,
  Tag,
  InlineNotification
} from '@carbon/react';
import { useComponentStore } from '../../stores/componentStore';
import './DependencyDetailPanel.css';

interface DependencyDetailPanelProps {
  componentId: string;
  onClose: () => void;
}

export const DependencyDetailPanel: React.FC<DependencyDetailPanelProps> = ({
  componentId,
  onClose
}) => {
  const { getComponent, getComponentExplanation } = useComponentStore();
  const component = getComponent(componentId);
  const explanation = getComponentExplanation(componentId);

  if (!component) return null;

  return (
    <SidePanel
      open={true}
      onRequestClose={onClose}
      title={component.name}
      subtitle={component.description}
      size="md"
    >
      <div className="dependency-detail-panel">
        {/* Direct Dependencies */}
        {explanation.direct.length > 0 && (
          <Accordion>
            <AccordionItem title={`Direct Dependencies (${explanation.direct.length})`}>
              <ul className="dependency-list">
                {explanation.direct.map((dep, idx) => (
                  <li key={idx}>
                    <Tag type="blue" size="sm">Required</Tag>
                    <span>{dep}</span>
                  </li>
                ))}
              </ul>
            </AccordionItem>
          </Accordion>
        )}

        {/* Transitive Dependencies */}
        {explanation.transitive.length > 0 && (
          <Accordion>
            <AccordionItem title={`Transitive Dependencies (${explanation.transitive.length})`}>
              <ul className="dependency-list">
                {explanation.transitive.map((dep, idx) => (
                  <li key={idx}>
                    <Tag type="gray" size="sm">Indirect</Tag>
                    <span>{dep}</span>
                  </li>
                ))}
              </ul>
            </AccordionItem>
          </Accordion>
        )}

        {/* External Dependencies */}
        {explanation.external.length > 0 && (
          <Accordion>
            <AccordionItem title={`External Dependencies (${explanation.external.length})`}>
              <InlineNotification
                kind="info"
                title="External Requirements"
                subtitle="These must be installed separately"
                lowContrast
                hideCloseButton
              />
              <ul className="dependency-list">
                {explanation.external.map((dep, idx) => (
                  <li key={idx}>
                    <Tag type="purple" size="sm">External</Tag>
                    <span>{dep}</span>
                  </li>
                ))}
              </ul>
            </AccordionItem>
          </Accordion>
        )}

        {/* Conflicts and Restrictions */}
        {explanation.conflicts.length > 0 && (
          <Accordion>
            <AccordionItem title={`Restrictions (${explanation.conflicts.length})`}>
              <InlineNotification
                kind="warning"
                title="Important Restrictions"
                subtitle="Review these before proceeding"
                lowContrast
                hideCloseButton
              />
              <ul className="dependency-list">
                {explanation.conflicts.map((conflict, idx) => (
                  <li key={idx}>
                    <Tag type="red" size="sm">Restriction</Tag>
                    <span>{conflict}</span>
                  </li>
                ))}
              </ul>
            </AccordionItem>
          </Accordion>
        )}

        {/* Component Information */}
        <Accordion>
          <AccordionItem title="Component Information">
            <div className="component-info">
              <div className="info-row">
                <span className="info-label">Category:</span>
                <span className="info-value">{component.category}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Version:</span>
                <span className="info-value">{component.version}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Original Name:</span>
                <span className="info-value"><code>{component.originalName}</code></span>
              </div>
            </div>
          </AccordionItem>
        </Accordion>
      </div>
    </SidePanel>
  );
};
```

**CSS File:** `deployer-web/ui/src/components/common/DependencyDetailPanel.css`

```css
.dependency-detail-panel {
  padding: 1rem;
}

.dependency-list {
  list-style: none;
  padding: 0;
  margin: 1rem 0;
}

.dependency-list li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  background-color: var(--cds-layer-01);
  border-radius: 4px;
}

.dependency-list li span {
  flex: 1;
  font-size: 0.875rem;
}

.component-info {
  padding: 1rem 0;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--cds-border-subtle);
}

.info-label {
  font-weight: 600;
  color: var(--cds-text-secondary);
}

.info-value {
  color: var(--cds-text-primary);
}

.info-value code {
  background-color: var(--cds-layer-02);
  padding: 0.125rem 0.5rem;
  border-radius: 2px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.875rem;
}
```

### Task 4: Enhanced Component Details Modal (2 hours)

**File:** `deployer-web/ui/src/pages/ComponentSelectionPage.tsx`

Update the modal to show comprehensive dependency information:

```typescript
<Modal
  open={detailsModalOpen}
  onRequestClose={() => setDetailsModalOpen(false)}
  modalHeading={selectedComponentForDetails?.name}
  passiveModal
  size="lg"
>
  {selectedComponentForDetails && (
    <div className="component-details-modal">
      {/* Description */}
      <div className="detail-section">
        <h3>Description</h3>
        <p>{selectedComponentForDetails.description}</p>
      </div>

      {/* Category and Version */}
      <div className="detail-section">
        <Grid narrow>
          <Column sm={2} md={4} lg={8}>
            <h4>Category</h4>
            <Tag type="blue">{selectedComponentForDetails.category}</Tag>
          </Column>
          <Column sm={2} md={4} lg={8}>
            <h4>Version</h4>
            <Tag type="gray">{selectedComponentForDetails.version}</Tag>
          </Column>
        </Grid>
      </div>

      {/* Service Dependencies */}
      {selectedComponentForDetails.serviceDependencies.length > 0 && (
        <div className="detail-section">
          <h3>Service Dependencies</h3>
          <DataTable
            rows={selectedComponentForDetails.serviceDependencies.map((dep, idx) => ({
              id: idx.toString(),
              name: dep.name,
              relationship: dep.relationship,
              notes: dep.notes?.join('; ') || '-'
            }))}
            headers={[
              { key: 'name', header: 'Service' },
              { key: 'relationship', header: 'Type' },
              { key: 'notes', header: 'Notes' }
            ]}
          >
            {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
              <Table {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    {headers.map(header => (
                      <TableHeader {...getHeaderProps({ header })}>
                        {header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map(row => (
                    <TableRow {...getRowProps({ row })}>
                      {row.cells.map(cell => (
                        <TableCell key={cell.id}>{cell.value}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </DataTable>
        </div>
      )}

      {/* External Dependencies */}
      {selectedComponentForDetails.externalDependencies.length > 0 && (
        <div className="detail-section">
          <h3>External Dependencies</h3>
          <InlineNotification
            kind="info"
            title="External Requirements"
            subtitle="These must be installed before deploying this component"
            lowContrast
          />
          <ul className="external-deps-list">
            {selectedComponentForDetails.externalDependencies.map((dep, idx) => (
              <li key={idx}>
                <Tag type="purple" size="sm">{dep.type}</Tag>
                <strong>{dep.name}</strong>
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

      {/* Restrictions */}
      {selectedComponentForDetails.restrictions.length > 0 && (
        <div className="detail-section">
          <h3>Restrictions</h3>
          <InlineNotification
            kind="warning"
            title="Important Restrictions"
            subtitle="Review these carefully before installation"
            lowContrast
          />
          <ul className="restrictions-list">
            {selectedComponentForDetails.restrictions.map((restriction, idx) => (
              <li key={idx}>
                <WarningFilled size={16} />
                {restriction}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )}
</Modal>
```

### Task 5: Conflict Warning Banner (1 hour)

**New Component:** `deployer-web/ui/src/components/common/ConflictWarning.tsx`

```typescript
import React from 'react';
import { InlineNotification, Button } from '@carbon/react';
import { WarningAlt } from '@carbon/icons-react';
import { Conflict } from '../../types';
import './ConflictWarning.css';

interface ConflictWarningProps {
  conflicts: Conflict[];
  onResolve?: (conflict: Conflict) => void;
}

export const ConflictWarning: React.FC<ConflictWarningProps> = ({
  conflicts,
  onResolve
}) => {
  if (conflicts.length === 0) return null;

  return (
    <div className="conflict-warning">
      <InlineNotification
        kind="error"
        title={`${conflicts.length} Conflict${conflicts.length > 1 ? 's' : ''} Detected`}
        subtitle="The following conflicts must be resolved before proceeding"
        lowContrast={false}
        hideCloseButton
      />
      
      <div className="conflict-list">
        {conflicts.map((conflict, idx) => (
          <div key={idx} className="conflict-item">
            <div className="conflict-header">
              <WarningAlt size={20} className="conflict-icon" />
              <span className="conflict-type">{conflict.type}</span>
            </div>
            <p className="conflict-message">{conflict.message}</p>
            <div className="conflict-components">
              <span>Affected components:</span>
              {conflict.components.map((compId, compIdx) => (
                <Tag key={compIdx} type="red" size="sm">
                  {compId}
                </Tag>
              ))}
            </div>
            {onResolve && (
              <Button
                kind="danger--tertiary"
                size="sm"
                onClick={() => onResolve(conflict)}
              >
                Resolve Conflict
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
```

### Task 6: Update ComponentSelectionPage (1 hour)

Add conflict warnings and enhanced indicators:

```typescript
export const ComponentSelectionPage: React.FC = () => {
  const {
    components,
    selectedComponents,
    autoSelectedComponents,
    conflicts,
    externalDependencies,
    // ... other state
  } = useComponentStore();

  return (
    <div className="component-selection-page">
      {/* Page Header */}
      {/* ... existing header */}

      {/* Conflict Warning */}
      {conflicts.length > 0 && (
        <ConflictWarning conflicts={conflicts} />
      )}

      {/* External Dependencies Summary */}
      {externalDependencies.size > 0 && (
        <InlineNotification
          kind="info"
          title="External Dependencies Required"
          subtitle={`${externalDependencies.size} external dependencies must be installed`}
          lowContrast
        />
      )}

      {/* ... rest of the page */}
    </div>
  );
};
```

## Testing Strategy

### Visual Testing
1. Test all dependency indicators appear correctly
2. Verify conflict warnings are prominent and clear
3. Ensure auto-selected components are visually distinct
4. Test dependency panel shows complete information

### Interaction Testing
1. Click on graph nodes to open dependency panel
2. Hover over nodes to see tooltips
3. Test conflict resolution workflows
4. Verify external dependency warnings

### Accessibility Testing
1. Keyboard navigation through dependency information
2. Screen reader compatibility for all indicators
3. Color contrast for all visual indicators
4. Focus management in modals and panels

## Success Criteria

- ✅ All dependency types are visually distinct
- ✅ Auto-selected components are clearly marked
- ✅ Conflicts are prominently displayed with resolution guidance
- ✅ External dependencies are clearly communicated
- ✅ Dependency chains are easy to understand
- ✅ UI remains performant with 63 components
- ✅ All interactions are accessible
- ✅ Mobile/tablet responsive design maintained

## Files to Create/Modify

### New Files
1. `deployer-web/ui/src/components/common/DependencyDetailPanel.tsx`
2. `deployer-web/ui/src/components/common/DependencyDetailPanel.css`
3. `deployer-web/ui/src/components/common/ConflictWarning.tsx`
4. `deployer-web/ui/src/components/common/ConflictWarning.css`

### Modified Files
1. `deployer-web/ui/src/components/common/ComponentCard.tsx`
2. `deployer-web/ui/src/components/common/ComponentCard.css`
3. `deployer-web/ui/src/components/common/DependencyGraph.tsx`
4. `deployer-web/ui/src/components/common/DependencyGraph.css`
5. `deployer-web/ui/src/pages/ComponentSelectionPage.tsx`
6. `deployer-web/ui/src/pages/ComponentSelectionPage.css`

## Next Phase
Phase 2 will implement the Configuration Page for selected components.

---
Made with Bob