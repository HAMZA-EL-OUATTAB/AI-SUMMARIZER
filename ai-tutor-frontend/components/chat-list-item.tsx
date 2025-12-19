"use client"

import { MessageSquare } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface ChatListItemProps {
  id: string
  title: string
  date: string
}

export function ChatListItem({ id, title, date }: ChatListItemProps) {
  const pathname = usePathname()
  const isActive = pathname === `/chats/${id}`

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })

  return (
    <Link
      href={`/chats/${id}`}
      className={cn(
        "group block rounded-lg border border-transparent p-3 transition-all hover:border-border hover:bg-accent/50",
        isActive && "border-border bg-accent",
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "mt-0.5 rounded-md bg-muted p-1.5 transition-colors group-hover:bg-muted/80",
            isActive && "bg-primary/10",
          )}
        >
          <MessageSquare className={cn("h-4 w-4 text-muted-foreground", isActive && "text-primary")} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={cn("truncate text-sm font-medium text-foreground", isActive && "text-primary")}>{title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{formattedDate}</p>
        </div>
      </div>
    </Link>
  )
}
