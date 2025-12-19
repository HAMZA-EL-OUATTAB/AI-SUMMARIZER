"use client"

import { useState, useRef, type DragEvent, type ChangeEvent } from "react"
import { Upload, type File, CheckCircle2, XCircle, Loader2, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  status: "uploading" | "success" | "error"
  progress: number
}

interface FileUploadProps {
  sessionId: string
}

export function FileUpload({ sessionId }: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return "🖼️"
    if (type.startsWith("video/")) return "🎥"
    if (type.startsWith("audio/")) return "🎵"
    if (type.includes("pdf")) return "📄"
    if (type.includes("word") || type.includes("document")) return "📝"
    if (type.includes("sheet") || type.includes("excel")) return "📊"
    return "📎"
  }

  const uploadFiles = async (filesToUpload: File[]) => {
    const newFiles: UploadedFile[] = filesToUpload.map((file) => ({
      id: `temp-${Date.now()}-${Math.random()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      status: "uploading" as const,
      progress: 0,
    }))

    setFiles((prev) => [...prev, ...newFiles])

    const formData = new FormData()
    filesToUpload.forEach((file) => {
      formData.append("files", file)
    })

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setFiles((prev) =>
          prev.map((f) =>
            newFiles.some((nf) => nf.id === f.id) && f.progress < 90 ? { ...f, progress: f.progress + 10 } : f,
          ),
        )
      }, 200)

      const response = await fetch(`/api/v1/files/upload/${sessionId}`, {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()

      setFiles((prev) =>
        prev.map((f) => {
          const uploadedFile = data.files.find((uf: any) => uf.name === f.name)
          if (uploadedFile) {
            return {
              ...f,
              id: uploadedFile.id,
              status: "success" as const,
              progress: 100,
            }
          }
          return f
        }),
      )

      toast({
        title: "Upload successful",
        description: data.message,
      })
    } catch (error) {
      setFiles((prev) =>
        prev.map((f) => (newFiles.some((nf) => nf.id === f.id) ? { ...f, status: "error" as const, progress: 0 } : f)),
      )

      toast({
        title: "Upload failed",
        description: "Failed to upload files. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    if (droppedFiles.length > 0) {
      uploadFiles(droppedFiles)
    }
  }

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (selectedFiles && selectedFiles.length > 0) {
      uploadFiles(Array.from(selectedFiles))
    }
  }

  const handleRemoveFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-lg border-2 border-dashed transition-all ${
          isDragging ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/50"
        }`}
      >
        <input ref={fileInputRef} type="file" multiple onChange={handleFileSelect} className="hidden" />

        <div className="flex items-center gap-3 p-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all"
          >
            <Upload className="h-4 w-4" />
            Choose Files
          </button>

          <div className="flex-1 text-sm text-muted-foreground">or drag and drop files here</div>
        </div>

        {isDragging && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-primary/10 backdrop-blur-sm">
            <div className="text-center">
              <Upload className="mx-auto h-8 w-8 text-primary mb-2" />
              <p className="text-sm font-medium text-foreground">Drop files to upload</p>
            </div>
          </div>
        )}
      </div>

      {/* Uploaded Files List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-foreground">Uploaded Files</h3>
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-all hover:border-primary/50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-xl">
                  {getFileIcon(file.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                    {file.status === "uploading" && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                    {file.status === "success" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                    {file.status === "error" && <XCircle className="h-4 w-4 text-destructive" />}
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                    {file.status === "uploading" && (
                      <p className="text-xs text-primary font-medium">{file.progress}%</p>
                    )}
                    {file.status === "success" && <p className="text-xs text-green-600 font-medium">Uploaded</p>}
                    {file.status === "error" && <p className="text-xs text-destructive font-medium">Failed</p>}
                  </div>

                  {file.status === "uploading" && (
                    <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleRemoveFile(file.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted transition-all"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
