# 🗂️ Real-Time File Explorer

A VS Code-inspired file explorer web application built with React and Node.js, featuring optimistic UI updates and real-time synchronization with MongoDB.

![File Explorer Demo](https://img.shields.io/badge/Status-Working-success)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Architecture](#architecture)
- [Key Concepts](#key-concepts)
- [Screenshots](#screenshots)
- [Future Enhancements](#future-enhancements)

---

## ✨ Features

### Core Functionality
- ✅ **Create folders and files** - Hierarchical file system structure
- ✅ **Nested structure** - Unlimited folder depth with parent-child relationships
- ✅ **Expand/collapse folders** - Interactive tree navigation
- ✅ **Rename files and folders** - Inline editing with validation
- ✅ **Delete files and folders** - Cascading deletion for folders with children
- ✅ **Optimistic UI updates** - Instant feedback before server response
- ✅ **Automatic rollback** - Reverts changes if backend fails
- ✅ **Error notifications** - User-friendly error messages

### Technical Highlights
- 🚀 **No page reloads** - Fully client-side state management
- 🔄 **Backend as source of truth** - All data persisted in MongoDB
- 📦 **Flat state architecture** - Efficient state updates and queries
- 🎨 **VS Code-inspired UI** - Clean, minimal, developer-friendly interface
- ⚡ **Fast and responsive** - Optimized tree rendering

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Custom hooks** - `useFileTree` for state management
- **Fetch API** - HTTP client for backend communication

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

---

## 📁 Project Structure

file-explorer/
├── backend/
│ ├── src/
│ │ ├── models/
│ │ │ └── Node.js # Mongoose schema for files/folders
│ │ ├── controllers/
│ │ │ └── tree.controller.js # Business logic for CRUD operations
│ │ ├── routes/
│ │ │ └── tree.routes.js # API route definitions
│ │ └── server.js # Express app entry point
│ ├── .env # Environment variables
│ ├── .gitignore
│ └── package.json
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ │ ├── FileTree.jsx # Main tree container
│ │ │ ├── TreeNode.jsx # Individual file/folder node
│ │ │ └── ErrorToast.jsx # Error notification component
│ │ ├── hooks/
│ │ │ └── useFileTree.js # Custom hook for state & optimistic updates
│ │ ├── services/
│ │ │ └── api.js # API client wrapper
│ │ ├── utils/
│ │ │ └── treeUtils.js # Tree building and manipulation utilities
│ │ ├── App.jsx # Root component
│ │ ├── App.css # Styles
│ │ └── main.jsx # React entry point
│ ├── .env # Environment variables
│ ├── index.html
│ ├── vite.config.js
│ └── package.json
│
└── README.md

text

---

## 🚀 Installation

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (local installation) OR **MongoDB Atlas** (free cloud database)

### Step 1: Clone the Repository

git clone https://github.com/yourusername/file-explorer.git
cd file-explorer

text

### Step 2: Backend Setup

cd backend
npm install

text

Create a `.env` file in the `backend` folder:

PORT=5000
MONGODB_URI=mongodb://localhost:27017/file-explorer

text

**For MongoDB Atlas:**
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/file-explorer?retryWrites=true&w=majority

text

### Step 3: Frontend Setup

cd ../frontend
npm install

text

Create a `.env` file in the `frontend` folder:

VITE_API_URL=http://localhost:5000/api

text

---

## ▶️ Usage

### Start Backend Server

cd backend
npm run dev

text

Expected output:
Connected to MongoDB
Server running on port 5000

text

### Start Frontend Development Server

cd frontend
npm run dev

text

Expected output:
VITE v5.x.x ready in xxx ms
➜ Local: http://localhost:5173/

text

### Open in Browser

Navigate to [**http://localhost:5173**](http://localhost:5173)

---

## 📡 API Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| `GET` | `/api/tree` | Fetch all nodes | - | `{ success: true, data: [nodes] }` |
| `POST` | `/api/folder` | Create a folder | `{ name, parentId }` | `{ success: true, data: node }` |
| `POST` | `/api/file` | Create a file | `{ name, parentId }` | `{ success: true, data: node }` |
| `PUT` | `/api/rename` | Rename a node | `{ id, name }` | `{ success: true, data: node }` |
| `DELETE` | `/api/node/:id` | Delete a node | - | `{ success: true, message }` |

### Example API Request

// Create a folder
POST http://localhost:5000/api/folder
Content-Type: application/json

{
"name": "components",
"parentId": null
}

text

---

## 🏗️ Architecture

### Data Model

The application uses a **single MongoDB collection** called `nodes` to store both files and folders.

**Schema:**

{
_id: ObjectId, // Unique identifier
name: String, // Node name (required)
type: String, // "file" or "folder" (required)
parentId: ObjectId, // Reference to parent (null for root)
createdAt: Date, // Auto-generated timestamp
updatedAt: Date // Auto-generated timestamp
}

text

**Key Design Decisions:**
- **Flat storage** - All nodes in one collection with parent references
- **No content field** - Focus on structure, not file content
- **Null for roots** - Root-level items have `parentId: null`
- **Indexed parentId** - Fast queries for finding children

---

### Tree Construction

The frontend builds the tree dynamically from a flat array:

1. **Fetch flat array** - All nodes retrieved from backend
2. **Create node map** - Build `{nodeId: node}` lookup for O(1) access
3. **Link children** - Iterate and push each node into parent's `children` array
4. **Identify roots** - Nodes with `parentId === null`
5. **Sort recursively** - Folders before files, alphabetically

**Code Reference:** `frontend/src/utils/treeUtils.js` → `buildTree()`

**Time Complexity:** O(n) where n = number of nodes

---

### Optimistic UI Updates

**Flow:**

User Action → Update UI Immediately → Call API → Success ✓ → Replace temp with real data
→ Failure ✗ → Rollback + Show error

text

**Implementation:**

const createFolder = async (name, parentId) => {
const tempId = generateTempId();
const tempNode = { _id: tempId, name, type: 'folder', parentId };

// 1. Store previous state
const previousNodes = [...nodes];

// 2. Optimistic update
setNodes(prev => [...prev, tempNode]);

try {
// 3. Call backend
const response = await api.createFolder(name, parentId);

text
// 4. Replace temp with real node
setNodes(prev => prev.map(n => n._id === tempId ? response.data : n));
} catch (err) {
// 5. Rollback on error
setNodes(previousNodes);
showError(err.message);
}
};

text

**Benefits:**
- Instant feedback for users
- Works smoothly even on slow networks
- Graceful error handling

---

## 🔑 Key Concepts

### 1. Flat State Management

**Why not nested state?**

❌ **Nested state:**
// Hard to update deep nodes
{ id: 1, name: "src", children: [{ id: 2, name: "components", children: [...] }] }

text

✅ **Flat state:**
// Easy to update, search, filter
[
{ _id: 1, name: "src", parentId: null },
{ _id: 2, name: "components", parentId: 1 }
]

text

**Advantages:**
- Immutable updates are simple
- No deep cloning needed
- Easy to search and filter
- Tree built on-demand for rendering

---

### 2. Rollback Logic

**Strategies by operation:**

| Operation | Optimistic Update | Rollback Method |
|-----------|-------------------|-----------------|
| Create | Add temp node to array | Remove temp node |
| Rename | Update name in place | Restore old name from snapshot |
| Delete | Filter out node(s) | Re-insert deleted nodes |

**Critical implementation:**
- Deep copy state before mutations
- Use immutable update patterns
- Temporary IDs for creates: `temp_${timestamp}_${random}`
- Replace temp IDs with real IDs on success

---

### 3. Cascading Deletion

When deleting a folder, all descendants are removed:

**Backend (Recursive):**
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

text

**Frontend (Filter):**
const descendants = getDescendants(nodes, id);
const idsToDelete = [id, ...descendants.map(d => d._id)];
setNodes(prev => prev.filter(node => !idsToDelete.includes(node._id)));

text

---

## 🎯 Testing Guide

### Manual Testing

1. **Create root folder** → Click 📁+ → Enter "src" → Verify appears instantly
2. **Create root file** → Click 📄+ → Enter "README.md" → Verify appears instantly
3. **Expand folder** → Click on "src" → Verify it expands/collapses
4. **Create nested folder** → Hover over "src" → Click 📁+ → Create "components"
5. **Create nested file** → Hover over "components" → Click 📄+ → Create "Header.jsx"
6. **Rename** → Hover over any item → Click ✏️ → Edit name → Press Enter
7. **Delete file** → Hover over file → Click 🗑️ → Confirm → Verify removed
8. **Delete folder** → Hover over folder → Click 🗑️ → Confirm → Verify all children removed

### Test Optimistic Updates

1. **Stop backend** → Go to backend terminal → Press Ctrl+C
2. **Try creating folder** → UI updates immediately
3. **Wait 2 seconds** → Folder disappears (rollback)
4. **Error toast appears** → "Failed to create folder"
5. **Restart backend** → `npm run dev`

### Verify MongoDB Persistence

1. Create some files and folders
2. Stop frontend (Ctrl+C)
3. Refresh browser
4. Data should reload from MongoDB

---

## 🚧 Future Enhancements

- [ ] **Drag and drop** - Move files/folders by dragging
- [ ] **File content editing** - Click file to edit content
- [ ] **Search functionality** - Filter tree by name
- [ ] **Keyboard shortcuts** - Ctrl+N (new file), Ctrl+Shift+N (new folder)
- [ ] **Multi-select** - Select multiple items for bulk operations
- [ ] **Context menu** - Right-click menu for actions
- [ ] **Undo/Redo** - Command history stack
- [ ] **Real-time collaboration** - WebSocket sync between users
- [ ] **File upload** - Drag files from desktop
- [ ] **Dark/Light theme toggle**

---

## 🐛 Known Issues

- None currently

---

## 📝 License

MIT License - feel free to use this project for learning or portfolio purposes.

---

## 👤 Author

**Your Name**
- GitHub: [Guri9368](https://github.com/Guri9368)
- LinkedIn: [Gurmeet-singh-rathor]([https://linkedin.com/in/yourprofile](https://www.linkedin.com/in/gurmeet-singh-rathor-1bbbaa270/))

---

## 🙏 Acknowledgments

- Assignment provided by Grarri
- Inspired by VS Code's file explorer
- Built as part of Full-Stack Developer internship evaluation

---

## 📧 Contact

For questions or feedback, reach out at:gurigurmeet1234567@gmail.com

---


**⭐ If you found this helpful, please star the repository!**
