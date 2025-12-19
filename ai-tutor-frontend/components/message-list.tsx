"use client"

import { useEffect, useRef } from "react"
import { ChatMessage } from "./chat-message"
import { BookOpen } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

interface MessageListProps {
  messages: Message[]
}

export function MessageList({ messages }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h3 className="mb-2 text-base font-semibold text-foreground md:text-lg">Start Your Learning Journey</h3>
          <p className="text-sm text-muted-foreground">Ask me anything! I'm here to help you learn.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {messages.map((message) => (
        <ChatMessage key={message.id} role={message.role} content={message.content} timestamp={message.timestamp} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}
