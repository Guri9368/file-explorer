import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { generateTempId, getDescendants } from '../utils/treeUtils';

export const useFileTree = () => {
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load initial tree
  useEffect(() => {
    loadTree();
  }, []);

  const loadTree = async () => {
    try {
      setLoading(true);
      const response = await api.getTree();
      setNodes(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load file tree');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Create folder with optimistic update
  const createFolder = useCallback(async (name, parentId) => {
    const tempId = generateTempId();
    const tempNode = {
      _id: tempId,
      name,
      type: 'folder',
      parentId: parentId || null,
      createdAt: new Date().toISOString()
    };

    // Optimistic update
    const previousNodes = [...nodes];
    setNodes(prev => [...prev, tempNode]);

    try {
      const response = await api.createFolder(name, parentId);
      // Replace temp node with real node from server
      setNodes(prev => prev.map(node => 
        node._id === tempId ? response.data : node
      ));
    } catch (err) {
      // Rollback on error
      setNodes(previousNodes);
      setError(err.message);
      throw err;
    }
  }, [nodes]);

  // Create file with optimistic update
  const createFile = useCallback(async (name, parentId) => {
    const tempId = generateTempId();
    const tempNode = {
      _id: tempId,
      name,
      type: 'file',
      parentId: parentId || null,
      createdAt: new Date().toISOString()
    };

    // Optimistic update
    const previousNodes = [...nodes];
    setNodes(prev => [...prev, tempNode]);

    try {
      const response = await api.createFile(name, parentId);
      // Replace temp node with real node from server
      setNodes(prev => prev.map(node => 
        node._id === tempId ? response.data : node
      ));
    } catch (err) {
      // Rollback on error
      setNodes(previousNodes);
      setError(err.message);
      throw err;
    }
  }, [nodes]);

  // Rename node with optimistic update
  const renameNode = useCallback(async (id, newName) => {
    // Store previous state for rollback
    const previousNodes = [...nodes];

    // Optimistic update
    setNodes(prev => prev.map(node => 
      node._id === id ? { ...node, name: newName } : node
    ));

    try {
      await api.renameNode(id, newName);
    } catch (err) {
      // Rollback on error
      setNodes(previousNodes);
      setError(err.message);
      throw err;
    }
  }, [nodes]);

  // Delete node with optimistic update
  const deleteNode = useCallback(async (id) => {
    // Store previous state for rollback
    const previousNodes = [...nodes];

    // Get all descendants to delete
    const descendants = getDescendants(nodes, id);
    const idsToDelete = [id, ...descendants.map(d => d._id)];

    // Optimistic update
    setNodes(prev => prev.filter(node => !idsToDelete.includes(node._id)));

    try {
      await api.deleteNode(id);
    } catch (err) {
      // Rollback on error
      setNodes(previousNodes);
      setError(err.message);
      throw err;
    }
  }, [nodes]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    nodes,
    loading,
    error,
    createFolder,
    createFile,
    renameNode,
    deleteNode,
    clearError
  };
};
