import { useFileTree } from './hooks/useFileTree';
import FileTree from './components/FileTree';
import ErrorToast from './components/ErrorToast';

function App() {
  const {
    nodes,
    loading,
    error,
    createFolder,
    createFile,
    renameNode,
    deleteNode,
    clearError
  } = useFileTree();

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading file tree...</div>
      </div>
    );
  }

  return (
    <div className="app">
      <FileTree
        nodes={nodes}
        onCreateFolder={createFolder}
        onCreateFile={createFile}
        onRename={renameNode}
        onDelete={deleteNode}
      />
      <ErrorToast message={error} onClose={clearError} />
    </div>
  );
}

export default App;
