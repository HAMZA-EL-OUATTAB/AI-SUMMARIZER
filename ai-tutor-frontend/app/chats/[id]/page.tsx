import { ChatHeader } from "@/components/chat-header"
import { ChatContainer } from "@/components/chat-container"
import { Sidebar } from "@/components/sidebar"
import { AppLayout } from "@/components/app-layout"

interface ChatPageProps {
  params: Promise<{ id: string }>
}

async function getMessages(sessionId: string) {
  try {
    // Call the Next.js API route (which proxies to FastAPI backend)
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
    const res = await fetch(`${baseUrl}/api/v1/chats/${sessionId}/messages`, {
      cache: "no-store",
    })

    if (!res.ok) {
      throw new Error("Failed to fetch messages")
    }

    const data = await res.json()
    return data.messages || []
  } catch (error) {
    console.error("Error fetching messages:", error)
    return []
  }
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { id } = await params
  const initialMessages = await getMessages(id)

  return (
    <div className="flex h-full flex-col">
      <AppLayout>

      <ChatHeader title={`Chat Session`} />
      <ChatContainer sessionId={id} initialMessages={initialMessages} />

      </AppLayout>

    </div>
  )
}
