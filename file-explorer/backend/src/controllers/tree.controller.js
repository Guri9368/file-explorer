import Node from '../models/Node.js';
import mongoose from 'mongoose';

// Get entire tree
export const getTree = async (req, res) => {
  try {
    const nodes = await Node.find().sort({ createdAt: 1 });
    res.json({ success: true, data: nodes });
  } catch (error) {
    console.error('Error fetching tree:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch tree' });
  }
};

// Create a new folder
export const createFolder = async (req, res) => {
  try {
    const { name, parentId } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Folder name is required' 
      });
    }

    // Check if parent exists when parentId is provided
    if (parentId) {
      if (!mongoose.Types.ObjectId.isValid(parentId)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid parent ID' 
        });
      }

      const parent = await Node.findById(parentId);
      if (!parent) {
        return res.status(404).json({ 
          success: false, 
          message: 'Parent folder not found' 
        });
      }

      if (parent.type !== 'folder') {
        return res.status(400).json({ 
          success: false, 
          message: 'Parent must be a folder' 
        });
      }
    }

    // Check for duplicate names in the same parent
    const existingNode = await Node.findOne({ 
      name: name.trim(), 
      parentId: parentId || null 
    });

    if (existingNode) {
      return res.status(409).json({ 
        success: false, 
        message: 'A folder with this name already exists here' 
      });
    }

    const folder = new Node({
      name: name.trim(),
      type: 'folder',
      parentId: parentId || null
    });

    await folder.save();
    res.status(201).json({ success: true, data: folder });
  } catch (error) {
    console.error('Error creating folder:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to create folder' 
    });
  }
};

// Create a new file
export const createFile = async (req, res) => {
  try {
    const { name, parentId } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: 'File name is required' 
      });
    }

    // Check if parent exists when parentId is provided
    if (parentId) {
      if (!mongoose.Types.ObjectId.isValid(parentId)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid parent ID' 
        });
      }

      const parent = await Node.findById(parentId);
      if (!parent) {
        return res.status(404).json({ 
          success: false, 
          message: 'Parent folder not found' 
        });
      }

      if (parent.type !== 'folder') {
        return res.status(400).json({ 
          success: false, 
          message: 'Parent must be a folder' 
        });
      }
    }

    // Check for duplicate names in the same parent
    const existingNode = await Node.findOne({ 
      name: name.trim(), 
      parentId: parentId || null 
    });

    if (existingNode) {
      return res.status(409).json({ 
        success: false, 
        message: 'A file with this name already exists here' 
      });
    }

    const file = new Node({
      name: name.trim(),
      type: 'file',
      parentId: parentId || null
    });

    await file.save();
    res.status(201).json({ success: true, data: file });
  } catch (error) {
    console.error('Error creating file:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to create file' 
    });
  }
};

// Rename a node
export const renameNode = async (req, res) => {
  try {
    const { id, name } = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid node ID is required' 
      });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: 'New name is required' 
      });
    }

    const node = await Node.findById(id);
    if (!node) {
      return res.status(404).json({ 
        success: false, 
        message: 'Node not found' 
      });
    }

    // Check for duplicate names in the same parent
    const existingNode = await Node.findOne({ 
      _id: { $ne: id },
      name: name.trim(), 
      parentId: node.parentId 
    });

    if (existingNode) {
      return res.status(409).json({ 
        success: false, 
        message: 'A node with this name already exists here' 
      });
    }

    node.name = name.trim();
    await node.save();

    res.json({ success: true, data: node });
  } catch (error) {
    console.error('Error renaming node:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to rename node' 
    });
  }
};

// Delete a node
export const deleteNode = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid node ID' 
      });
    }

    const node = await Node.findById(id);
    if (!node) {
      return res.status(404).json({ 
        success: false, 
        message: 'Node not found' 
      });
    }

    // If it's a folder, recursively delete all children
    if (node.type === 'folder') {
      await deleteNodeAndChildren(id);
    } else {
      await Node.findByIdAndDelete(id);
    }

    res.json({ success: true, message: 'Node deleted successfully' });
  } catch (error) {
    console.error('Error deleting node:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to delete node' 
    });
  }
};

// Helper function to recursively delete a node and its children
async function deleteNodeAndChildren(nodeId) {
  const children = await Node.find({ parentId: nodeId });
  
  for (const child of children) {
    if (child.type === 'folder') {
      await deleteNodeAndChildren(child._id);
    }
    await Node.findByIdAndDelete(child._id);
  }
  
  await Node.findByIdAndDelete(nodeId);
}
