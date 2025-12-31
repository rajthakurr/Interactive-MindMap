import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { MindmapNode } from '../types';
import type { MindmapCanvasRef } from './MindmapCanvas';
import { Toolbar } from './Toolbar';
import { MindmapCanvas } from './MindmapCanvas';
import { SidePanel } from './SidePanel';
import './MindmapApp.css';

export const MindmapApp: React.FC = () => {
  const [data, setData] = useState<MindmapNode | null>(null);
  const [selectedNode, setSelectedNode] = useState<MindmapNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<MindmapNode | null>(null);
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set());
  const canvasRef = useRef<MindmapCanvasRef>(null);

  // Load data from JSON file
  useEffect(() => {
    fetch('/mindmap-data.json')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setSelectedNode(json);
      })
      .catch((err) => console.error('Failed to load mindmap data:', err));
  }, []);

  // Toggle node collapse
  const handleCollapseNode = useCallback((nodeId: string) => {
    setCollapsedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  }, []);

  // Expand all nodes
  const handleExpandAll = useCallback(() => {
    setCollapsedNodes(new Set());
  }, []);

  // Collapse all nodes except root
  const handleCollapseAll = useCallback(() => {
    const allNodeIds = new Set<string>();
    const traverse = (node: MindmapNode) => {
      if (node.children && node.children.length > 0 && node.id !== 'root') {
        allNodeIds.add(node.id);
      }
      node.children?.forEach(traverse);
    };
    if (data) {
      traverse(data);
    }
    setCollapsedNodes(allNodeIds);
  }, [data]);

  // Fit view (reset zoom)
  const handleFitView = useCallback(() => {
    canvasRef.current?.fitView();
  }, []);

  // Drill down to selected node
  const handleDrillDown = useCallback(() => {
    if (selectedNode) {
      canvasRef.current?.drillDown(selectedNode.id);
    }
  }, [selectedNode]);

  // Drill up to root
  const handleDrillUp = useCallback(() => {
    canvasRef.current?.drillUp();
  }, []);

  // Update node in the tree
  const handleUpdateNode = useCallback(
    (nodeId: string, updates: Partial<MindmapNode>) => {
      if (!data) return;

      const updateNodeRecursive = (node: MindmapNode): MindmapNode => {
        if (node.id === nodeId) {
          return { ...node, ...updates };
        }
        if (node.children) {
          return {
            ...node,
            children: node.children.map(updateNodeRecursive),
          };
        }
        return node;
      };

      const updatedData = updateNodeRecursive(data);
      setData(updatedData);
      setSelectedNode(updates as MindmapNode);
    },
    [data]
  );

  // Add child node
  const handleAddChild = useCallback(
    (parentId: string, child: MindmapNode) => {
      if (!data) return;

      const addChildRecursive = (node: MindmapNode): MindmapNode => {
        if (node.id === parentId) {
          return {
            ...node,
            children: [...(node.children || []), child],
          };
        }
        if (node.children) {
          return {
            ...node,
            children: node.children.map(addChildRecursive),
          };
        }
        return node;
      };

      const updatedData = addChildRecursive(data);
      setData(updatedData);
    },
    [data]
  );

  // Delete node
  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      if (!data || nodeId === 'root') return;

      const deleteNodeRecursive = (node: MindmapNode): MindmapNode | null => {
        if (node.id === nodeId) {
          return null;
        }
        if (node.children && node.children.length > 0) {
          const filteredChildren = node.children
            .map(deleteNodeRecursive)
            .filter((child): child is MindmapNode => child !== null);
          return {
            ...node,
            children: filteredChildren,
          };
        }
        return node;
      };

      const updatedData = deleteNodeRecursive(data);
      if (updatedData) {
        setData(updatedData);
        setSelectedNode(updatedData);
      }
    },
    [data]
  );

  // Download mindmap as image
  const handleDownload = useCallback(() => {
    const svg = document.querySelector('svg.mindmap-canvas') as SVGSVGElement;
    if (!svg) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.fillStyle = '#1e3c72';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'mindmap.png';
      link.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  }, []);

  if (!data) {
    return <div className="loading">Loading mindmap...</div>;
  }

  return (
    <div className="mindmap-app">
      <Toolbar
        onExpandAll={handleExpandAll}
        onCollapseAll={handleCollapseAll}
        onFitView={handleFitView}
        onDrillDown={handleDrillDown}
        onDrillUp={handleDrillUp}
        onAddNode={() => alert('Click a node to add a child')}
        onDownload={handleDownload}
        hoveredNode={hoveredNode}
      />
      <div className="main-content">
        <MindmapCanvas
          ref={canvasRef}
          data={data}
          onNodeClick={setSelectedNode}
          onNodeHover={setHoveredNode}
          selectedNodeId={selectedNode?.id ?? null}
          collapsedNodes={collapsedNodes}
          onCollapseNode={handleCollapseNode}
        />
        <SidePanel
          selectedNode={selectedNode}
          onUpdateNode={handleUpdateNode}
          onAddChild={handleAddChild}
          onDeleteNode={handleDeleteNode}
          data={data}
        />
      </div>
    </div>
  );
};
