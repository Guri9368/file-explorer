const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
  async getTree() {
    const response = await fetch(`${API_URL}/tree`);
    if (!response.ok) throw new Error('Failed to fetch tree');
    return response.json();
  },

  async createFolder(name, parentId) {
    const response = await fetch(`${API_URL}/folder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, parentId })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create folder');
    }
    return response.json();
  },

  async createFile(name, parentId) {
    const response = await fetch(`${API_URL}/file`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, parentId })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create file');
    }
    return response.json();
  },

  async renameNode(id, name) {
    const response = await fetch(`${API_URL}/rename`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, name })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to rename node');
    }
    return response.json();
  },

  async deleteNode(id) {
    const response = await fetch(`${API_URL}/node/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete node');
    }
    return response.json();
  }
};
