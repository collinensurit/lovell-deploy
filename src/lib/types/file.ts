export interface FileNode {
  id: string
  name: string
  type: 'file' | 'directory'
  path?: string
  children?: FileNode[]
  content?: string
  metadata?: Record<string, unknown>
}

export interface FileExplorerProps {
  rootNode: FileNode
  onFileSelect?: (file: FileNode) => void
  onFolderSelect?: (folder: FileNode) => void
  className?: string
}
