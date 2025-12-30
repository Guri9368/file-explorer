import { useState } from 'react';

export default function TreeNode({ 
  node, 
  onCreateFolder, 
  onCreateFile, 
  onRename, 
  onDelete 
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(node.name);
  const [showActions, setShowActions] = useState(false);

  const handleToggle = () => {
    if (node.type === 'folder') {
      setIsExpanded(!isExpanded);
    }
  };

  const handleRename = async () => {
    if (newName.trim() && newName !== node.name) {
      try {
        await onRename(node._id, newName.trim());
        setIsRenaming(false);
      } catch (err) {
        setNewName(node.name);
      }
    } else {
      setNewName(node.name);
      setIsRenaming(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setNewName(node.name);
      setIsRenaming(false);
    }
  };

  const handleCreateFolder = async () => {
    const folderName = prompt('Enter folder name:');
    if (folderName && folderName.trim()) {
      try {
        await onCreateFolder(folderName.trim(), node._id);
        setIsExpanded(true);
      } catch (err) {
        // Error already handled in hook
      }
    }
  };

  const handleCreateFile = async () => {
    const fileName = prompt('Enter file name:');
    if (fileName && fileName.trim()) {
      try {
        await onCreateFile(fileName.trim(), node._id);
        setIsExpanded(true);
      } catch (err) {
        // Error already handled in hook
      }
    }
  };

  const handleDelete = async () => {
    const confirmMsg = node.type === 'folder' 
      ? `Delete folder "${node.name}" and all its contents?`
      : `Delete file "${node.name}"?`;
    
    if (confirm(confirmMsg)) {
      try {
        await onDelete(node._id);
      } catch (err) {
        // Error already handled in hook
      }
    }
  };

  const isFolder = node.type === 'folder';
  const icon = isFolder ? (isExpanded ? '📂' : '📁') : '📄';

  return (
    <div className="tree-node">
      <div 
        className="node-content"
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <div className="node-main" onClick={handleToggle}>
          <span className="node-icon">{icon}</span>
          {isRenaming ? (
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={handleKeyDown}
              autoFocus
              className="rename-input"
            />
          ) : (
            <span className="node-name">{node.name}</span>
          )}
        </div>

        {showActions && !isRenaming && (
          <div className="node-actions">
            {isFolder && (
              <>
                <button 
                  onClick={handleCreateFolder}
                  title="New Folder"
                  className="action-btn"
                >
                  📁+
                </button>
                <button 
                  onClick={handleCreateFile}
                  title="New File"
                  className="action-btn"
                >
                  📄+
                </button>
              </>
            )}
            <button 
              onClick={() => setIsRenaming(true)}
              title="Rename"
              className="action-btn"
            >
              ✏️
            </button>
            <button 
              onClick={handleDelete}
              title="Delete"
              className="action-btn delete-btn"
            >
              🗑️
            </button>
          </div>
        )}
      </div>

      {isFolder && isExpanded && node.children && node.children.length > 0 && (
        <div className="node-children">
          {node.children.map(child => (
            <TreeNode
              key={child._id}
              node={child}
              onCreateFolder={onCreateFolder}
              onCreateFile={onCreateFile}
              onRename={onRename}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
