import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { user_id, title } = body

    // Validate input
    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    if (!user_id || typeof user_id !== "number") {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // TODO: Create chat session in your backend database
    // Example:
    // const response = await fetch(`${process.env.BACKEND_API_URL}/chats`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ user_id, title })
    // })
    // const data = await response.json()

    return NextResponse.json({
      session_id: "backend-integration-required",
      title,
      user_id,
      created_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error creating chat:", error)
    return NextResponse.json({ error: "Failed to create chat" }, { status: 500 })
  }
}
