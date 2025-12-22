import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const { title } = await request.json()

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    const backendResponse = await fetch(
      `${process.env.BACKEND_API_URL}/api/v1/chats/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title }),
      }
    )

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text()
      console.error("Backend error:", errorText)
      return NextResponse.json(
        { error: "Failed to create chat session" },
        { status: backendResponse.status }
      )
    }

    const data = await backendResponse.json()

    return NextResponse.json({
      id: data.id,
      title: data.title,
      created_at: data.created_at,
    })
  } catch (error) {
    console.error("Error creating chat:", error)
    return NextResponse.json({ error: "Failed to create chat" }, { status: 500 })
  }
}
