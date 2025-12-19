import { ChatHeader } from "@/components/chat-header"
import { ChatContainer } from "@/components/chat-container"

interface ChatPageProps {
  params: Promise<{ id: string }>
}

async function getMessages(sessionId: string) {
  try {
    // In production, this would be an actual API call
    // For now, we'll use the local API route
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
    console.error("[v0] Error fetching messages:", error)
    return []
  }
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { id } = await params
  const initialMessages = await getMessages(id)

  return (
    <div className="flex h-full flex-col">
      <ChatHeader title={`Chat Session`} />
      <ChatContainer sessionId={id} initialMessages={initialMessages} />
    </div>
  )
}
