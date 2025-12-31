import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import * as d3 from 'd3';
import type { MindmapNode, D3Node, D3Link } from '../types';
import './MindmapCanvas.css';

export interface MindmapCanvasRef {
  fitView: () => void;
  drillDown: (nodeId: string) => void;
  drillUp: () => void;
}

interface MindmapCanvasProps {
  data: MindmapNode;
  onNodeClick: (node: MindmapNode) => void;
  onNodeHover: (node: MindmapNode | null) => void;
  selectedNodeId: string | null;
  collapsedNodes: Set<string>;
  onCollapseNode: (nodeId: string) => void;
}

const MindmapCanvasComponent: React.ForwardRefRenderFunction<MindmapCanvasRef, MindmapCanvasProps> = (
  {
    data,
    onNodeClick,
    onNodeHover,
    selectedNodeId,
    collapsedNodes,
    onCollapseNode,
  },
  ref
) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [_simulation, setSimulation] = useState<d3.Simulation<D3Node, D3Link> | null>(null);
  const nodesMapRef = useRef<Map<string, D3Node>>(new Map());
  const zoomActionsRef = useRef<{
    svg?: any;
    zoom?: any;
    width?: number;
    height?: number;
  }>({});

  // Set up imperative handle
  useImperativeHandle(ref, () => ({
    fitView: () => {
      const { svg, zoom, width, height } = zoomActionsRef.current;
      if (svg && zoom && width && height) {
        // Calculate bounds of all nodes
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        nodesMapRef.current.forEach((node) => {
          if (node.x !== undefined && node.y !== undefined) {
            const radius = node.depth === 0 ? 60 : node.depth === 1 ? 50 : node.depth === 2 ? 40 : 35;
            minX = Math.min(minX, node.x - radius);
            maxX = Math.max(maxX, node.x + radius);
            minY = Math.min(minY, node.y - radius);
            maxY = Math.max(maxY, node.y + radius);
          }
        });

        if (isFinite(minX)) {
          const nodeWidth = maxX - minX;
          const nodeHeight = maxY - minY;
          const scale = Math.min((width || 0) / nodeWidth, (height || 0) / nodeHeight) * 0.85;
          const centerX = (minX + maxX) / 2;
          const centerY = (minY + maxY) / 2;
          
          svg.transition()
            .duration(750)
            .call(
              zoom.transform as any,
              d3.zoomIdentity.translate((width || 0) / 2, (height || 0) / 2).scale(scale).translate(-centerX, -centerY)
            );
        }
      }
    },
    drillDown: (nodeId: string) => {
      const { svg, zoom, width, height } = zoomActionsRef.current;
      const node = nodesMapRef.current.get(nodeId);
      if (node && svg && zoom && width && height && node.x !== undefined && node.y !== undefined) {
        // Calculate bounds of node's children
        let minX = node.x, maxX = node.x, minY = node.y, maxY = node.y;
        const nodeRadius = node.depth === 0 ? 60 : node.depth === 1 ? 50 : node.depth === 2 ? 40 : 35;
        minX -= nodeRadius;
        maxX += nodeRadius;
        minY -= nodeRadius;
        maxY += nodeRadius;

        if (node.children) {
          node.children.forEach((child: any) => {
            if (child.x !== undefined && child.y !== undefined) {
              const childRadius = child.depth === 0 ? 60 : child.depth === 1 ? 50 : child.depth === 2 ? 40 : 35;
              minX = Math.min(minX, child.x - childRadius);
              maxX = Math.max(maxX, child.x + childRadius);
              minY = Math.min(minY, child.y - childRadius);
              maxY = Math.max(maxY, child.y + childRadius);
            }
          });
        }

        const nodeWidth = maxX - minX;
        const nodeHeight = maxY - minY;
        const scale = Math.min((width || 0) / nodeWidth, (height || 0) / nodeHeight) * 0.8;
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;
        
        svg.transition()
          .duration(750)
          .call(
            zoom.transform as any,
            d3.zoomIdentity.translate((width || 0) / 2, (height || 0) / 2).scale(scale).translate(-centerX, -centerY)
          );
      }
    },
    drillUp: () => {
      const { svg, zoom } = zoomActionsRef.current;
      // Drill up just calls fitView
      const fitViewRef = { svg, zoom, ...zoomActionsRef.current };
      const width = fitViewRef.width;
      const height = fitViewRef.height;
      if (svg && zoom && width && height) {
        // Calculate bounds of all nodes
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        nodesMapRef.current.forEach((node) => {
          if (node.x !== undefined && node.y !== undefined) {
            const radius = node.depth === 0 ? 60 : node.depth === 1 ? 50 : node.depth === 2 ? 40 : 35;
            minX = Math.min(minX, node.x - radius);
            maxX = Math.max(maxX, node.x + radius);
            minY = Math.min(minY, node.y - radius);
            maxY = Math.max(maxY, node.y + radius);
          }
        });

        if (isFinite(minX)) {
          const nodeWidth = maxX - minX;
          const nodeHeight = maxY - minY;
          const scale = Math.min(width / nodeWidth, height / nodeHeight) * 0.85;
          const centerX = (minX + maxX) / 2;
          const centerY = (minY + maxY) / 2;
          
          svg.transition()
            .duration(750)
            .call(
              zoom.transform as any,
              d3.zoomIdentity.translate(width / 2, height / 2).scale(scale).translate(-centerX, -centerY)
            );
        }
      }
    },
  }), []);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    // Create SVG groups
    const svg = d3.select(svgRef.current);
    const g = svg.append('g').attr('class', 'canvas-group');

    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .on('zoom', (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
        g.attr('transform', event.transform.toString());
      });
    svg.call(zoom);

    // Store zoom actions for imperative handle
    zoomActionsRef.current = { svg, zoom, width, height };

    // Flatten the hierarchy for D3
    const hierarchy = d3.hierarchy(data);
    const descendants = hierarchy.descendants();

    // Filter out collapsed nodes from display
    const visibleDescendants = descendants.filter((d: d3.HierarchyNode<MindmapNode>) => {
      let parent = d.parent;
      while (parent) {
        if (collapsedNodes.has(parent.data.id)) {
          return false;
        }
        parent = parent.parent;
      }
      return true;
    });

    // Create links only between visible nodes
    const links: D3Link[] = [];
    visibleDescendants.forEach((node: d3.HierarchyNode<MindmapNode>) => {
      if (node.parent && visibleDescendants.includes(node.parent)) {
        links.push({ source: node.parent as D3Node, target: node as D3Node } as D3Link);
      }
    });

    // Create force simulation (first without tick handler)
    const newSimulation = d3.forceSimulation<D3Node, D3Link>(visibleDescendants as D3Node[])
      .force('link', d3.forceLink<D3Node, D3Link>(links)
        .id((d: D3Node) => d.data.id)
        .distance(120)
        .strength(0.5)
      )
      .force('charge', d3.forceManyBody().strength(-500).distanceMax(300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(60));

    setSimulation(newSimulation);

    // Draw links
    const linkSelection = g.selectAll<SVGLineElement, D3Link>('.link')
      .data(links)
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('stroke', '#ccc')
      .attr('stroke-width', 2)
      .attr('opacity', 0.6);

    // Draw nodes
    const nodeSelection = g.selectAll<SVGCircleElement, D3Node>('.node')
      .data(visibleDescendants as D3Node[])
      .enter()
      .append('circle')
      .attr('class', 'node')
      .attr('r', (d: D3Node) => {
        // Store node in map for later access
        nodesMapRef.current.set(d.data.id, d);
        if (d.depth === 0) return 60;
        if (d.depth === 1) return 50;
        if (d.depth === 2) return 40;
        return 35;
      })
      .attr('fill', (d: D3Node) => d.data.color)
      .attr('stroke', (d: D3Node) => selectedNodeId === d.data.id ? '#ff9800' : '#333')
      .attr('stroke-width', (d: D3Node) => selectedNodeId === d.data.id ? 3 : 2)
      .style('cursor', 'pointer')
      .on('mouseenter', (_event: any, d: D3Node) => {
        onNodeHover(d.data);
      })
      .on('mouseleave', () => {
        onNodeHover(null);
      })
      .on('click', (event: any, d: D3Node) => {
        event.stopPropagation();
        if (d.children && d.children.length > 0) {
          onCollapseNode(d.data.id);
        }
        onNodeClick(d.data);
      })
      .call(d3.drag<SVGCircleElement, D3Node>()
        .on('start', (event: any, d: D3Node) => {
          if (!event.active) newSimulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event: any, d: D3Node) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event: any, d: D3Node) => {
          if (!event.active) newSimulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
      );

    // Add labels with text wrapping
    const labelSelection = g.selectAll<SVGTextElement, D3Node>('.label')
      .data(visibleDescendants as D3Node[])
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.3em')
      .attr('font-size', (d: D3Node) => {
        if (d.depth === 0) return '14px';
        if (d.depth === 1) return '12px';
        return '11px';
      })
      .attr('fill', '#000')
      .attr('font-weight', (d: D3Node) => d.depth === 0 ? 'bold' : 'normal')
      .text((d: D3Node) => d.data.label)
      .style('pointer-events', 'none');

    // Add expand/collapse indicators for nodes with children
    const indicatorSelection = g.selectAll<SVGCircleElement, D3Node>('.expand-indicator')
      .data(visibleDescendants.filter((d: D3Node) => d.children && d.children.length > 0) as D3Node[], (d: any) => d.data.id)
      .join(
        (enter) => enter
          .append('circle')
          .attr('class', 'expand-indicator')
          .attr('r', 6)
          .attr('fill', '#fff')
          .attr('stroke', '#333')
          .attr('stroke-width', 2)
          .style('cursor', 'pointer')
          .on('click', (event: any, d: D3Node) => {
            event.stopPropagation();
            onCollapseNode(d.data.id);
          }),
        (update) => update
      );

    // Set up tick handler after all selections are created
    newSimulation.on('tick', () => {
      // Update links
      linkSelection
        .attr('x1', (d: D3Link) => d.source.x || 0)
        .attr('y1', (d: D3Link) => d.source.y || 0)
        .attr('x2', (d: D3Link) => d.target.x || 0)
        .attr('y2', (d: D3Link) => d.target.y || 0);

      // Update nodes
      nodeSelection
        .attr('cx', (d: D3Node) => d.x || 0)
        .attr('cy', (d: D3Node) => d.y || 0);

      // Update labels
      labelSelection
        .attr('x', (d: D3Node) => d.x || 0)
        .attr('y', (d: D3Node) => d.y || 0);

      // Update indicator positions
      indicatorSelection
        .attr('cx', (d: D3Node) => (d.x || 0) + (d.depth === 0 ? 55 : 45))
        .attr('cy', (d: D3Node) => (d.y || 0) + (d.depth === 0 ? 55 : 45));
    });

    setSimulation(newSimulation);

    // Initial zoom to fit
    setTimeout(() => {
      // Calculate bounds of all nodes
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      nodesMapRef.current.forEach((node) => {
        if (node.x !== undefined && node.y !== undefined) {
          const radius = node.depth === 0 ? 60 : node.depth === 1 ? 50 : node.depth === 2 ? 40 : 35;
          minX = Math.min(minX, node.x - radius);
          maxX = Math.max(maxX, node.x + radius);
          minY = Math.min(minY, node.y - radius);
          maxY = Math.max(maxY, node.y + radius);
        }
      });

      if (isFinite(minX)) {
        const nodeWidth = maxX - minX;
        const nodeHeight = maxY - minY;
        const scale = Math.min(width / nodeWidth, height / nodeHeight) * 0.85;
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;
        
        svg.call(
          zoom.transform as any,
          d3.zoomIdentity.translate(width / 2, height / 2).scale(scale).translate(-centerX, -centerY)
        );
      }
    }, 100);

    return () => {
      newSimulation.stop();
    };
  }, [data, collapsedNodes, selectedNodeId, onNodeClick, onNodeHover, onCollapseNode]);

  return (
    <div className="mindmap-canvas-container">
      <svg ref={svgRef} className="mindmap-canvas" />
    </div>
  );
};

export const MindmapCanvas = forwardRef(MindmapCanvasComponent);
MindmapCanvas.displayName = 'MindmapCanvas';
