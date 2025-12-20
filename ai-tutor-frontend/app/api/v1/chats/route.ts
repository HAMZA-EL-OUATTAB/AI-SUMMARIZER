import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { user_id, title } = body

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    if (!user_id || typeof user_id !== "number") {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Call FastAPI backend to create chat
    const backendResponse = await fetch(`${process.env.BACKEND_API_URL}/api/v1/chats/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id, title }),
    })

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text()
      console.error("Backend error:", errorText)
      return NextResponse.json({ error: "Failed to create chat session" }, { status: 500 })
    }

    const data = await backendResponse.json() // parse JSON

    return NextResponse.json({
      session_id: data.id, // numeric session ID
      title: data.title,
      user_id,
      created_at: data.created_at,
    })
  } catch (error) {
    console.error("Error creating chat:", error)
    return NextResponse.json({ error: "Failed to create chat" }, { status: 500 })
  }
}
