"use client"

import { useState, useRef, type KeyboardEvent } from "react"
import { Send, Paperclip } from "lucide-react"
import { FileUpload } from "./file-upload"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

interface ChatInputProps {
  sessionId: string
  onMessagesUpdate: (messages: Message[]) => void
  currentMessages: Message[]
}

export function ChatInput({ sessionId, onMessagesUpdate, currentMessages }: ChatInputProps) {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showFileUpload, setShowFileUpload] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { toast } = useToast()

const handleSend = async () => {
  if (!input.trim() || isLoading) return

  const token = localStorage.getItem("token")
  if (!token) {
    toast({
      title: "Not authenticated",
      description: "Please log in first.",
      variant: "destructive",
    })
    return
  }

  const userMessage: Message = {
    id: `user-${Date.now()}`,
    role: "user",
    content: input.trim(),
    timestamp: new Date().toISOString(),
  }

  setInput("")
  onMessagesUpdate([...currentMessages, userMessage])
  setIsLoading(true)

  const loadingMessage: Message = {
    id: "loading",
    role: "assistant",
    content: "...",
    timestamp: new Date().toISOString(),
  }
  onMessagesUpdate([...currentMessages, userMessage, loadingMessage])

  try {
    const response = await fetch(`/api/v1/chats/${sessionId}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ content: userMessage.content }),
    })

    if (!response.ok) {
      throw new Error("Failed to send message")
    }

    const data = await response.json()

    const aiMessage: Message = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: data.ai_message.content,
      timestamp: new Date().toISOString(),
    }

    onMessagesUpdate([...currentMessages, userMessage, aiMessage])
    toast({
      title: "Message sent",
      description: "Your question has been sent to the AI Tutor.",
    })
  } catch (error) {
    console.error("[v0] Error sending message:", error)
    onMessagesUpdate([...currentMessages, userMessage])
    toast({
      title: "Failed to send message",
      description: "Please try again.",
      variant: "destructive",
    })
  } finally {
    setIsLoading(false)
    textareaRef.current?.focus()
  }
}


  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-t border-border bg-card">
      {showFileUpload && (
        <div className="border-b border-border p-4">
          <div className="mx-auto max-w-3xl">
            <FileUpload sessionId={sessionId} />
          </div>
        </div>
      )}

      <div className="p-4">
        <div className="mx-auto max-w-3xl">
          <div className="flex gap-2">
            <button
              onClick={() => setShowFileUpload(!showFileUpload)}
              className={`flex h-[52px] w-[52px] items-center justify-center rounded-lg border border-input hover:bg-muted transition-all ${
                showFileUpload ? "bg-muted" : ""
              }`}
            >
              <Paperclip className="h-5 w-5 text-muted-foreground" />
            </button>

            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask your AI Tutor anything..."
              className="min-h-[52px] max-h-32 flex-1 resize-none rounded-lg border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              disabled={isLoading}
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="flex h-[52px] w-[52px] items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground text-center">
            Press Enter to send, Shift + Enter for new line
          </p>
        </div>
      </div>
    </div>
  )
}
