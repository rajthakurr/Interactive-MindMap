import React, { useState } from 'react';
import type { MindmapNode } from '../types';
import './SidePanel.css';

interface SidePanelProps {
  selectedNode: MindmapNode | null;
  onUpdateNode: (nodeId: string, updates: Partial<MindmapNode>) => void;
  onAddChild: (parentId: string, child: MindmapNode) => void;
  onDeleteNode?: (nodeId: string) => void;
  data?: MindmapNode | null;
}

export const SidePanel: React.FC<SidePanelProps> = ({ selectedNode, onUpdateNode, onAddChild, onDeleteNode, data }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedLabel, setEditedLabel] = useState('');
  const [editedSummary, setEditedSummary] = useState('');
  const [isAddingChild, setIsAddingChild] = useState(false);
  const [newChildLabel, setNewChildLabel] = useState('');

  const handleEditClick = () => {
    if (selectedNode) {
      setEditedLabel(selectedNode.label);
      setEditedSummary(selectedNode.summary);
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    if (selectedNode) {
      onUpdateNode(selectedNode.id, {
        label: editedLabel,
        summary: editedSummary,
      });
      setIsEditing(false);
    }
  };

  const getNodeDepth = (nodeId: string, currentNode?: MindmapNode, depth = 0): number => {
    const root = currentNode || data;
    if (!root) return 0;
    if (root.id === nodeId) return depth;
    for (const child of root.children || []) {
      const result = getNodeDepth(nodeId, child, depth + 1);
      if (result !== -1) return result;
    }
    return -1;
  };

  const getColorForDepth = (parentDepth: number): string => {
    switch (parentDepth) {
      case 0: // Parent is root
        return '#90EE90'; // Light green
      case 1: // Parent is level 1
        return '#FFA500'; // Orange
      case 2: // Parent is level 2
        return '#DDA0DD'; // Purple/Pink
      default:
        return '#DDA0DD'; // Purple/Pink for deeper levels
    }
  };

  const handleAddChild = () => {
    if (selectedNode && newChildLabel.trim()) {
      const parentDepth = getNodeDepth(selectedNode.id);
      const newChild: MindmapNode = {
        id: `${selectedNode.id}-${Date.now()}`,
        label: newChildLabel,
        summary: 'Add a summary for this node',
        color: getColorForDepth(parentDepth),
        children: [],
      };
      onAddChild(selectedNode.id, newChild);
      setNewChildLabel('');
      setIsAddingChild(false);
    }
  };

  const handleDeleteNode = () => {
    if (selectedNode && selectedNode.id !== 'root') {
      if (window.confirm(`Delete node "${selectedNode.label}"? This action cannot be undone.`)) {
        onDeleteNode?.(selectedNode.id);
      }
    }
  };

  return (
    <div className="side-panel">
      <div className="panel-header">
        <h2>Architecture Documentation</h2>
        <p className="subtitle">Interactive component visualization</p>
      </div>

      {selectedNode ? (
        <div className="panel-content">
          <div className="node-info">
            <div className="breadcrumb">
              <span className="breadcrumb-text">Root</span>
            </div>

            <div className="node-title-section">
              {!isEditing ? (
                <div>
                  <h3 className="node-title">{selectedNode.label}</h3>
                  <button className="edit-btn" onClick={handleEditClick}>
                    ✏️ Edit
                  </button>
                </div>
              ) : (
                <div className="edit-form">
                  <input
                    type="text"
                    value={editedLabel}
                    onChange={(e) => setEditedLabel(e.target.value)}
                    className="edit-input"
                    placeholder="Node label"
                  />
                </div>
              )}
            </div>

            <div className="summary-section">
              <h4 className="summary-title">SUMMARY:</h4>
              {!isEditing ? (
                <p className="summary-text">{selectedNode.summary}</p>
              ) : (
                <textarea
                  value={editedSummary}
                  onChange={(e) => setEditedSummary(e.target.value)}
                  className="edit-textarea"
                  placeholder="Node summary"
                  rows={6}
                />
              )}
            </div>

            {isEditing && (
              <div className="edit-actions">
                <button className="save-btn" onClick={handleSave}>
                  💾 Save
                </button>
                <button className="cancel-btn" onClick={() => setIsEditing(false)}>
                  ✕ Cancel
                </button>
              </div>
            )}

            {!isEditing && selectedNode.id !== 'root' && (
              <button className="delete-btn" onClick={handleDeleteNode}>
                🗑️ Delete Node
              </button>
            )}

            <div className="add-child-section">
              {!isAddingChild ? (
                <button className="add-child-btn" onClick={() => setIsAddingChild(true)}>
                  + Add Child Node
                </button>
              ) : (
                <div className="add-child-form">
                  <input
                    type="text"
                    value={newChildLabel}
                    onChange={(e) => setNewChildLabel(e.target.value)}
                    className="edit-input"
                    placeholder="New child label"
                    autoFocus
                  />
                  <div className="add-child-actions">
                    <button className="save-btn" onClick={handleAddChild}>
                      Add
                    </button>
                    <button className="cancel-btn" onClick={() => setIsAddingChild(false)}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="panel-empty">
          <p>Select a node to view details</p>
        </div>
      )}
    </div>
  );
};
