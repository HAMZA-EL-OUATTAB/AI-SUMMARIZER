"use client"

import { ChatHeader } from "@/components/chat-header"
import { ChatContainer } from "@/components/chat-container"
import { Sidebar } from "@/components/sidebar"
import { AppLayout } from "@/components/app-layout"
import { useEffect, useState } from "react"

interface ChatPageProps {
  params: Promise<{ id: string }>
}

export default function ChatPage({ params }: ChatPageProps) {
  const [id, setId] = useState<string>("")
  const [initialMessages, setInitialMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get the id from params
        const resolvedParams = await params
        setId(resolvedParams.id)

        // Fetch messages from client side with localStorage token
        const token = localStorage.getItem("token")
        if (!token) {
          console.warn("No token found, user may not be authenticated")
          setLoading(false)
          return
        }

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
        const res = await fetch(`${baseUrl}/api/v1/chats/${resolvedParams.id}/messages`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          throw new Error(`Failed to fetch messages: ${res.status}`)
        }

        const data = await res.json()
        setInitialMessages(data.messages || [])
      } catch (error) {
        console.error("Error fetching messages:", error)
        setInitialMessages([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex h-full flex-col">
      <AppLayout>

      <ChatHeader title={`Chat Session`} />
      <ChatContainer sessionId={id} initialMessages={initialMessages} />

      </AppLayout>

    </div>
  )
}
