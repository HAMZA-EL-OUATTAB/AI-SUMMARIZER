"use client"

import { MessageSquare, Trash2, X } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { Button } from "@/components/ui/button" // Assuming you have a Button component

interface ChatListItemProps {
  id: string
  title: string
  date: string
}

export function ChatListItem({ id, title, date }: ChatListItemProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  
  const isActive = pathname === `/chats/${id}`

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowDeleteConfirm(true)
  }

  const handleConfirmDelete = async () => {
    setIsDeleting(true)
    
    try {
      const token = localStorage.getItem("token")

      const res = await fetch(`/api/v1/chats/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        throw new Error("Delete failed")
      }

      toast({
        title: "Chat deleted",
        description: `"${title}" has been removed.`,
      })

      // If user is inside deleted chat → redirect
      if (isActive) {
        router.push("/")
      }

      router.refresh()
    } catch (error) {
      toast({
        title: "Failed to delete chat",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false)
  }

  return (
    <>
      <Link
        href={`/chats/${id}`}
        className={cn(
          "group flex items-start gap-3 rounded-lg border border-transparent p-3 transition-all hover:border-border hover:bg-accent/50",
          isActive && "border-border bg-accent"
        )}
      >
        <div
          className={cn(
            "mt-0.5 rounded-md bg-muted p-1.5",
            isActive && "bg-primary/10"
          )}
        >
          <MessageSquare
            className={cn(
              "h-4 w-4 text-muted-foreground",
              isActive && "text-primary"
            )}
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3
            className={cn(
              "truncate text-sm font-medium text-foreground",
              isActive && "text-primary"
            )}
          >
            {title}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {formattedDate}
          </p>
        </div>

        {/* Delete button */}
        <button
          onClick={handleDeleteClick}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
          title="Delete chat"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </Link>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-full max-w-md mx-4">
            <div className="bg-background rounded-lg shadow-lg border">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-destructive/10">
                    <Trash2 className="h-5 w-5 text-destructive" />
                  </div>
                  <h3 className="text-lg font-semibold">Delete Chat</h3>
                </div>
                <button
                  onClick={handleCancelDelete}
                  className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-muted-foreground">
                  Are you sure you want to delete <span className="font-medium text-foreground">"{title}"</span>? This action cannot be undone.
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t">
                <Button
                  variant="outline"
                  onClick={handleCancelDelete}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}