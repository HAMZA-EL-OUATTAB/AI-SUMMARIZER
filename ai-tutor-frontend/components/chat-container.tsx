"use client"

import { useState } from "react"
import { MessageList } from "./message-list"
import { ChatInput } from "./chat-input"
import { ErrorBoundary } from "./error-boundary"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

interface ChatContainerProps {
  sessionId: string
  initialMessages: Message[]
}

export function ChatContainer({ sessionId, initialMessages }: ChatContainerProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)

  return (
    <ErrorBoundary>
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="mx-auto max-w-3xl">
          <MessageList messages={messages} />
        </div>
      </div>
      <ChatInput sessionId={sessionId} onMessagesUpdate={setMessages} currentMessages={messages} />
    </ErrorBoundary>
  )
}
