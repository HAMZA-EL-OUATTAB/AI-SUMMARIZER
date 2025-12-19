import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface ChatMessageProps {
  role: "user" | "assistant"
  content: string
  timestamp: string
}

export function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const isUser = role === "user"
  const isLoading = content === "..."

  const formatTime = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  return (
    <div className={cn("flex w-full gap-3", isUser ? "justify-end" : "justify-start")}>
      <div className={cn("flex max-w-[85%] flex-col gap-2 md:max-w-[80%]", isUser && "items-end")}>
        <div
          className={cn(
            "rounded-2xl px-3 py-2.5 text-sm leading-relaxed md:px-4 md:py-3 md:text-[15px]",
            isUser ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
          )}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              <span>Thinking...</span>
            </div>
          ) : (
            <p className="whitespace-pre-wrap break-words">{content}</p>
          )}
        </div>
        {!isLoading && (
          <span className="px-2 text-xs text-muted-foreground" aria-label={`Message sent at ${formatTime(timestamp)}`}>
            {formatTime(timestamp)}
          </span>
        )}
      </div>
    </div>
  )
}
