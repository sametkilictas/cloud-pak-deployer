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
  onComponentClick?: (componentId: string) => void;
  height?: number;
}

interface GraphNode {
  id: string;
  name: string;
  type: 'selected' | 'auto-selected' | 'available';
  component: CloudPakComponent;
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
  onComponentClick,
  height = 600
}) => {
  const [showLabels, setShowLabels] = React.useState(true);
  const [showOnlySelected, setShowOnlySelected] = React.useState(false);
  const graphRef = React.useRef<any>();

  // Build graph data from components
  const graphData = useMemo<GraphData>(() => {
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];
    const nodeMap = new Map<string, GraphNode>();

    // Filter components if needed
    const filteredComponents = showOnlySelected
      ? components.filter(c => selectedComponents.has(c.id) || autoSelectedComponents.has(c.id))
      : components;

    // Create nodes
    filteredComponents.forEach(component => {
      const node: GraphNode = {
        id: component.id,
        name: component.name,
        type: selectedComponents.has(component.id)
          ? 'selected'
          : autoSelectedComponents.has(component.id)
          ? 'auto-selected'
          : 'available',
        component
      };
      nodes.push(node);
      nodeMap.set(component.id, node);
    });

    // Create links from dependencies
    filteredComponents.forEach(component => {
      // Required dependencies
      component.dependencies.required.forEach(depId => {
        if (nodeMap.has(depId)) {
          links.push({
            source: component.id,
            target: depId,
            type: 'required',
            label: 'requires'
          });
        }
      });

      // Optional dependencies
      component.dependencies.optional.forEach(depId => {
        if (nodeMap.has(depId)) {
          links.push({
            source: component.id,
            target: depId,
            type: 'optional',
            label: 'optional'
          });
        }
      });

      // Conditional dependencies
      component.dependencies.conditional.forEach(cond => {
        cond.requires.forEach(depId => {
          if (nodeMap.has(depId)) {
            links.push({
              source: component.id,
              target: depId,
              type: 'conditional',
              label: 'conditional'
            });
          }
        });
      });
    });

    return { nodes, links };
  }, [components, selectedComponents, autoSelectedComponents, showOnlySelected]);

  // Node color based on type
  const getNodeColor = useCallback((node: GraphNode) => {
    switch (node.type) {
      case 'selected':
        return '#0f62fe'; // IBM Blue 60
      case 'auto-selected':
        return '#0043ce'; // IBM Blue 70
      case 'available':
        return '#8d8d8d'; // Gray 60
      default:
        return '#8d8d8d';
    }
  }, []);

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

      <div className="dependency-graph__canvas">
        <ForceGraph2D
          ref={graphRef}
          graphData={graphData}
          height={height}
          nodeLabel={(node: any) => node.name}
          nodeColor={(node: any) => getNodeColor(node)}
          nodeRelSize={8}
          nodeCanvasObject={(node: any, ctx, globalScale) => {
            const label = node.name;
            const fontSize = 12 / globalScale;
            ctx.font = `${fontSize}px Sans-Serif`;
            const textWidth = ctx.measureText(label).width;
            const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.4);

            // Draw node circle
            ctx.fillStyle = getNodeColor(node);
            ctx.beginPath();
            ctx.arc(node.x, node.y, 8, 0, 2 * Math.PI, false);
            ctx.fill();

            // Draw label if enabled
            if (showLabels) {
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
          }}
          linkColor={(link: any) => getLinkColor(link)}
          linkWidth={2}
          linkDirectionalArrowLength={6}
          linkDirectionalArrowRelPos={1}
          linkLabel={(link: any) => link.label}
          onNodeClick={handleNodeClick}
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
            <div className="dependency-graph__legend-node" style={{ backgroundColor: '#8d8d8d' }} />
            <span>Available</span>
          </div>
          <div className="dependency-graph__legend-item">
            <div className="dependency-graph__legend-line" style={{ backgroundColor: '#da1e28' }} />
            <span>Required</span>
          </div>
          <div className="dependency-graph__legend-item">
            <div className="dependency-graph__legend-line" style={{ backgroundColor: '#198038' }} />
            <span>Optional</span>
          </div>
          <div className="dependency-graph__legend-item">
            <div className="dependency-graph__legend-line" style={{ backgroundColor: '#f1c21b' }} />
            <span>Conditional</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DependencyGraph;

// Made with Bob
