import { type NextRequest, NextResponse } from "next/server"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

export async function GET(request: NextRequest, context: { params: Promise<{ session_id: string }> }) {
  try {
    const { session_id } = await context.params

    // Fetch messages from your backend database
    const response = await fetch(`${process.env.BACKEND_API_URL}/chats/${session_id}/messages`)
    const data = await response.json()
    const messages = data.messages || []

    return NextResponse.json({
      messages,
      session_id,
    })
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, context: { params: Promise<{ session_id: string }> }) {
  try {
    const { session_id } = await context.params
    const body = await request.json()
    const { content } = body

    if (!content || typeof content !== "string") {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    // Send message to your backend AI service
    const aiResponse = await fetch(`${process.env.BACKEND_API_URL}/chats/${session_id}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    })
    const aiData = await aiResponse.json()

    return NextResponse.json({
      message: aiData.message || "Backend integration required",
      session_id,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error processing message:", error)
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 })
  }
}
