import type * as d3 from 'd3';

export interface MindmapNode {
  id: string;
  label: string;
  summary: string;
  color: string;
  children?: MindmapNode[];
  x?: number;
  y?: number;
  collapsed?: boolean;
}

export interface D3Node extends d3.HierarchyNode<MindmapNode> {
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
  collapsed?: boolean;
}

export interface D3Link extends d3.HierarchyLink<MindmapNode> {
  source: D3Node;
  target: D3Node;
}
