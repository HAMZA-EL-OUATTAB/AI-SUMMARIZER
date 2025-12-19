import { MessageSquarePlus } from "lucide-react"

export function ChatListEmpty() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
      <div className="mb-4 rounded-full bg-muted p-4">
        <MessageSquarePlus className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mb-1 text-sm font-medium text-foreground">No chats yet</h3>
      <p className="text-xs text-muted-foreground">Start a new chat to begin learning</p>
    </div>
  )
}
