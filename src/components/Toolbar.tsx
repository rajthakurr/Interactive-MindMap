import React from 'react';
import type { MindmapNode } from '../types';
import './Toolbar.css';

interface ToolbarProps {
  onExpandAll: () => void;
  onCollapseAll: () => void;
  onFitView: () => void;
  onDrillDown: () => void;
  onDrillUp: () => void;
  onAddNode: () => void;
  onDownload: () => void;
  hoveredNode: MindmapNode | null;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onExpandAll,
  onCollapseAll,
  onFitView,
  onDrillDown,
  onDrillUp,
  onAddNode,
  onDownload,
  hoveredNode,
}) => {
  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <button className="toolbar-btn expand-all-btn" onClick={onExpandAll} title="Expand all nodes">
          ✕ Expand All
        </button>
        <button className="toolbar-btn collapse-all-btn" onClick={onCollapseAll} title="Collapse all nodes">
          ⊡ Collapse All
        </button>
        <button className="toolbar-btn drill-down-btn" onClick={onDrillDown} title="Drill down">
          ⬇ Drill Down
        </button>
        <button className="toolbar-btn drill-up-btn" onClick={onDrillUp} title="Drill up">
          ⬆ Drill Up
        </button>
        <button className="toolbar-btn fit-view-btn" onClick={onFitView} title="Fit to view">
          ⊙ Fit View
        </button>
        <button className="toolbar-btn add-node-btn" onClick={onAddNode} title="Add a new node">
          + Add Node
        </button>
        <button className="toolbar-btn documentation-btn" onClick={() => alert('Full documentation')}>
          📖 Full Documentation
        </button>
      </div>

      <div className="toolbar-right">
        <button className="toolbar-btn download-btn" onClick={onDownload} title="Download as image">
          ⬇ Download
        </button>
        {hoveredNode && (
          <div className="hover-info">
            <span className="hover-label">{hoveredNode.label}</span>
          </div>
        )}
      </div>
    </div>
  );
};
