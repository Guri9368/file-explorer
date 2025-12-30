// Generate temporary ID for optimistic updates
export const generateTempId = () => `temp_${Date.now()}_${Math.random()}`;

// Build tree structure from flat array
export const buildTree = (nodes) => {
  const nodeMap = {};
  const roots = [];

  // First pass: create a map of all nodes
  nodes.forEach(node => {
    nodeMap[node._id] = { ...node, children: [] };
  });

  // Second pass: build the tree structure
  nodes.forEach(node => {
    if (node.parentId === null) {
      roots.push(nodeMap[node._id]);
    } else if (nodeMap[node.parentId]) {
      nodeMap[node.parentId].children.push(nodeMap[node._id]);
    }
  });

  // Sort children: folders first, then files, alphabetically
  const sortChildren = (node) => {
    if (node.children && node.children.length > 0) {
      node.children.sort((a, b) => {
        if (a.type === b.type) {
          return a.name.localeCompare(b.name);
        }
        return a.type === 'folder' ? -1 : 1;
      });
      node.children.forEach(sortChildren);
    }
  };

  roots.forEach(sortChildren);
  roots.sort((a, b) => {
    if (a.type === b.type) {
      return a.name.localeCompare(b.name);
    }
    return a.type === 'folder' ? -1 : 1;
  });

  return roots;
};

// Find node by ID in flat array
export const findNodeById = (nodes, id) => {
  return nodes.find(node => node._id === id);
};

// Get all descendants of a node
export const getDescendants = (nodes, parentId) => {
  const descendants = [];
  const findChildren = (pid) => {
    nodes.forEach(node => {
      if (node.parentId === pid) {
        descendants.push(node);
        if (node.type === 'folder') {
          findChildren(node._id);
        }
      }
    });
  };
  findChildren(parentId);
  return descendants;
};
