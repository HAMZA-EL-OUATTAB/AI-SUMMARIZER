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
    const response = await fetch(`${process.env.BACKEND_API_URL}/api/v1/chats/${session_id}/messages`)
    
    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch messages" }, { status: response.status })
    }
    
    const data = await response.json()
    
    // Backend returns array directly, transform to expected format
    const messages = Array.isArray(data) ? data.map((msg: any) => ({
      id: msg.id,
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.content,
      timestamp: msg.created_at,
    })) : []

    return NextResponse.json({
      success: true,
      messages,
      session_id,
    })
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "Failed to fetch messages", details: error instanceof Error ? error.message : String(error) }, { status: 500 })
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

    // Send message to FastAPI backend
    const aiResponse = await fetch(
      `${process.env.BACKEND_API_URL}/api/v1/chats/${session_id}/messages`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      }
    )

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text()
      console.error("Backend error:", errorText)
      return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
    }

    const aiData = await aiResponse.json()

    return NextResponse.json({
      message: aiData.ai_message.content, // use the actual AI response
      user_message: aiData.user_message,
      ai_message: aiData.ai_message,
      session_id,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error processing message:", error)
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 })
  }
}
