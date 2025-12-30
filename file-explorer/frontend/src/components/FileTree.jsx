import TreeNode from './TreeNode';
import { buildTree } from '../utils/treeUtils';

export default function FileTree({ 
  nodes, 
  onCreateFolder, 
  onCreateFile, 
  onRename, 
  onDelete 
}) {
  const tree = buildTree(nodes);

  const handleCreateRoot = async (type) => {
    const name = prompt(`Enter ${type} name:`);
    if (name && name.trim()) {
      try {
        if (type === 'folder') {
          await onCreateFolder(name.trim(), null);
        } else {
          await onCreateFile(name.trim(), null);
        }
      } catch (err) {
        // Error already handled in hook
      }
    }
  };

  return (
    <div className="file-tree">
      <div className="tree-header">
        <h2>Explorer</h2>
        <div className="root-actions">
          <button 
            onClick={() => handleCreateRoot('folder')}
            title="New Folder"
            className="action-btn"
          >
            📁+
          </button>
          <button 
            onClick={() => handleCreateRoot('file')}
            title="New File"
            className="action-btn"
          >
            📄+
          </button>
        </div>
      </div>

      <div className="tree-content">
        {tree.length === 0 ? (
          <div className="empty-state">
            <p>No files or folders yet.</p>
            <p>Click + to create one.</p>
          </div>
        ) : (
          tree.map(node => (
            <TreeNode
              key={node._id}
              node={node}
              onCreateFolder={onCreateFolder}
              onCreateFile={onCreateFile}
              onRename={onRename}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
