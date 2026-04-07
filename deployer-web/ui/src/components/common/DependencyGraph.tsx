/**
 * Dependency Graph Component
 * 
 * Visualizes component dependencies using a force-directed graph.
 * Shows relationships between selected components and their dependencies.
 * 
 * Features:
 * - Interactive force-directed graph
 * - Color-coded nodes (selected, auto-selected, available)
 * - Dependency type indicators (required, optional, conditional)
 * - Zoom and pan controls
 * - Node click to select/deselect components
 * - Legend for understanding node types
 */

import React, { useMemo, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { Button, Toggle } from '@carbon/react';
import { ZoomIn, ZoomOut, ZoomFit } from '@carbon/icons-react';
import { CloudPakComponent, DependencyType } from '../../types/component.types';
import './DependencyGraph.css';

interface DependencyGraphProps {
  components: CloudPakComponent[];
  selectedComponents: Set<string>;
  autoSelectedComponents: Set<string>;
  conflictedComponents?: Set<string>;
  onComponentClick?: (componentId: string) => void;
  height?: number;
}

interface GraphNode {
  id: string;
  name: string;
  type: 'selected' | 'auto-selected' | 'available' | 'conflicted';
  component: CloudPakComponent;
  dependencyCount?: number;
}

interface GraphLink {
  source: string;
  target: string;
  type: DependencyType;
  label: string;
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export const DependencyGraph: React.FC<DependencyGraphProps> = ({
  components,
  selectedComponents,
  autoSelectedComponents,
  conflictedComponents = new Set(),
  onComponentClick,
  height = 600
}) => {
  const [showLabels, setShowLabels] = React.useState(true);
  const [showOnlySelected, setShowOnlySelected] = React.useState(false);
  const [hoveredNode, setHoveredNode] = React.useState<string | null>(null);
  const [containerWidth, setContainerWidth] = React.useState<number>(800);
  const graphRef = React.useRef<any>();
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Update container width on mount and resize
  React.useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Build graph data from components
  const graphData = useMemo<GraphData>(() => {
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];
    const nodeMap = new Map<string, GraphNode>();
    const nameToIdMap = new Map<string, string>();

    // Filter components if needed
    const filteredComponents = showOnlySelected
      ? components.filter(c => selectedComponents.has(c.id) || autoSelectedComponents.has(c.id))
      : components;

    // Create nodes and name-to-id mapping
    filteredComponents.forEach(component => {
      // Count dependencies from serviceDependencies and componentDependencies
      const depCount = (component.serviceDependencies?.length || 0) +
                      (component.componentDependencies?.length || 0);

      const node: GraphNode = {
        id: component.id,
        name: component.name,
        type: conflictedComponents.has(component.id)
          ? 'conflicted'
          : selectedComponents.has(component.id)
          ? 'selected'
          : autoSelectedComponents.has(component.id)
          ? 'auto-selected'
          : 'available',
        component,
        dependencyCount: depCount
      };
      nodes.push(node);
      nodeMap.set(component.id, node);
      nameToIdMap.set(component.name, component.id);
      // Also map originalName if it exists
      if (component.originalName) {
        nameToIdMap.set(component.originalName, component.id);
      }
    });

    // Create links from service dependencies
    filteredComponents.forEach(component => {
      // Service dependencies
      component.serviceDependencies?.forEach(dep => {
        const targetId = nameToIdMap.get(dep.name);
        if (targetId && nodeMap.has(targetId)) {
          const linkType = dep.relationship === 'required' ? 'required' :
                          dep.relationship === 'optional' ? 'optional' : 'conditional';
          links.push({
            source: component.id,
            target: targetId,
            type: linkType as DependencyType,
            label: dep.relationship
          });
        }
      });

      // Component dependencies
      component.componentDependencies?.forEach(dep => {
        const targetId = nameToIdMap.get(dep.name) || nameToIdMap.get(dep.originalName || '');
        if (targetId && nodeMap.has(targetId)) {
          links.push({
            source: component.id,
            target: targetId,
            type: 'required',
            label: dep.installBehavior
          });
        }
      });
    });

    return { nodes, links };
  }, [components, selectedComponents, autoSelectedComponents, conflictedComponents, showOnlySelected]);

  // Node color based on type with hover effect
  const getNodeColor = useCallback((node: GraphNode) => {
    const isHovered = hoveredNode === node.id;
    
    switch (node.type) {
      case 'selected':
        return isHovered ? '#0353e9' : '#0f62fe'; // IBM Blue 60/70
      case 'auto-selected':
        return isHovered ? '#002d9c' : '#0043ce'; // IBM Blue 70/80
      case 'conflicted':
        return isHovered ? '#ba1b23' : '#da1e28'; // IBM Red 60/70
      case 'available':
        return isHovered ? '#6f6f6f' : '#8d8d8d'; // Gray 60/70
      default:
        return '#8d8d8d';
    }
  }, [hoveredNode]);

  // Link color based on dependency type
  const getLinkColor = useCallback((link: GraphLink) => {
    switch (link.type) {
      case 'required':
        return '#da1e28'; // IBM Red 60
      case 'optional':
        return '#198038'; // IBM Green 60
      case 'conditional':
        return '#f1c21b'; // IBM Yellow 30
      default:
        return '#8d8d8d';
    }
  }, []);

  // Handle node click
  const handleNodeClick = useCallback((node: GraphNode) => {
    if (onComponentClick) {
      onComponentClick(node.id);
    }
  }, [onComponentClick]);

  // Zoom controls
  const handleZoomIn = useCallback(() => {
    if (graphRef.current) {
      graphRef.current.zoom(graphRef.current.zoom() * 1.2, 400);
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (graphRef.current) {
      graphRef.current.zoom(graphRef.current.zoom() / 1.2, 400);
    }
  }, []);

  const handleZoomFit = useCallback(() => {
    if (graphRef.current) {
      graphRef.current.zoomToFit(400, 50);
    }
  }, []);

  return (
    <div className="dependency-graph">
      <div className="dependency-graph__controls">
        <div className="dependency-graph__toggles">
          <Toggle
            id="show-labels-toggle"
            labelText="Show labels"
            toggled={showLabels}
            onToggle={setShowLabels}
            size="sm"
          />
          <Toggle
            id="show-selected-toggle"
            labelText="Show only selected"
            toggled={showOnlySelected}
            onToggle={setShowOnlySelected}
            size="sm"
          />
        </div>
        <div className="dependency-graph__zoom-controls">
          <Button
            kind="ghost"
            size="sm"
            renderIcon={ZoomIn}
            iconDescription="Zoom in"
            hasIconOnly
            onClick={handleZoomIn}
          />
          <Button
            kind="ghost"
            size="sm"
            renderIcon={ZoomOut}
            iconDescription="Zoom out"
            hasIconOnly
            onClick={handleZoomOut}
          />
          <Button
            kind="ghost"
            size="sm"
            renderIcon={ZoomFit}
            iconDescription="Fit to view"
            hasIconOnly
            onClick={handleZoomFit}
          />
        </div>
      </div>

      <div className="dependency-graph__canvas" ref={containerRef}>
        <ForceGraph2D
          ref={graphRef}
          graphData={graphData}
          width={containerWidth}
          height={height}
          nodeLabel={(node: any) => {
            const depCount = node.dependencyCount || 0;
            return `${node.name}\nType: ${node.type}\nDependencies: ${depCount}`;
          }}
          nodeColor={(node: any) => getNodeColor(node)}
          nodeRelSize={8}
          nodeCanvasObject={(node: any, ctx: any, globalScale: any) => {
            const label = node.name;
            const fontSize = 12 / globalScale;
            const isHovered = hoveredNode === node.id;
            const nodeSize = isHovered ? 10 : 8;
            
            ctx.font = `${fontSize}px Sans-Serif`;
            const textWidth = ctx.measureText(label).width;
            const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.4);

            // Draw hover ring
            if (isHovered) {
              ctx.strokeStyle = getNodeColor(node);
              ctx.lineWidth = 3;
              ctx.beginPath();
              ctx.arc(node.x, node.y, nodeSize + 4, 0, 2 * Math.PI, false);
              ctx.stroke();
            }

            // Draw node circle
            ctx.fillStyle = getNodeColor(node);
            ctx.beginPath();
            ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI, false);
            ctx.fill();

            // Draw dependency count badge
            if (node.dependencyCount && node.dependencyCount > 0) {
              const badgeSize = 6;
              ctx.fillStyle = '#ffffff';
              ctx.beginPath();
              ctx.arc(node.x + nodeSize - 2, node.y - nodeSize + 2, badgeSize, 0, 2 * Math.PI, false);
              ctx.fill();
              
              ctx.fillStyle = '#161616';
              ctx.font = `bold ${badgeSize * 1.5}px Sans-Serif`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(node.dependencyCount.toString(), node.x + nodeSize - 2, node.y - nodeSize + 2);
            }

            // Draw label if enabled
            if (showLabels) {
              ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
              ctx.fillRect(
                node.x - bckgDimensions[0] / 2,
                node.y + nodeSize + 4,
                bckgDimensions[0],
                bckgDimensions[1]
              );

              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = '#161616';
              ctx.font = `${fontSize}px Sans-Serif`;
              ctx.fillText(label, node.x, node.y + nodeSize + 4 + fontSize / 2);
            }
          }}
          linkColor={(link: any) => getLinkColor(link)}
          linkWidth={2}
          linkDirectionalArrowLength={6}
          linkDirectionalArrowRelPos={1}
          linkLabel={(link: any) => link.label}
          onNodeClick={handleNodeClick}
          onNodeHover={(node: any) => setHoveredNode(node ? node.id : null)}
          cooldownTicks={100}
          d3AlphaDecay={0.02}
          d3VelocityDecay={0.3}
        />
      </div>

      <div className="dependency-graph__legend">
        <h4 className="dependency-graph__legend-title">Legend</h4>
        <div className="dependency-graph__legend-items">
          <div className="dependency-graph__legend-item">
            <div className="dependency-graph__legend-node" style={{ backgroundColor: '#0f62fe' }} />
            <span>User Selected</span>
          </div>
          <div className="dependency-graph__legend-item">
            <div className="dependency-graph__legend-node" style={{ backgroundColor: '#0043ce' }} />
            <span>Auto Selected</span>
          </div>
          <div className="dependency-graph__legend-item">
            <div className="dependency-graph__legend-node" style={{ backgroundColor: '#da1e28' }} />
            <span>Conflicted</span>
          </div>
          <div className="dependency-graph__legend-item">
            <div className="dependency-graph__legend-node" style={{ backgroundColor: '#8d8d8d' }} />
            <span>Available</span>
          </div>
          <div className="dependency-graph__legend-item">
            <div className="dependency-graph__legend-line" style={{ backgroundColor: '#da1e28' }} />
            <span>Required Dependency</span>
          </div>
          <div className="dependency-graph__legend-item">
            <div className="dependency-graph__legend-line" style={{ backgroundColor: '#198038' }} />
            <span>Optional Dependency</span>
          </div>
          <div className="dependency-graph__legend-item">
            <div className="dependency-graph__legend-line" style={{ backgroundColor: '#f1c21b' }} />
            <span>Conditional Dependency</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DependencyGraph;

// Made with Bob
