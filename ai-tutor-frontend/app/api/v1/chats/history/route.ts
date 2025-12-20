import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("user_id")

  if (!userId) {
    return NextResponse.json({ error: "user_id is required" }, { status: 400 })
  }

  try {
    const backendUrl = `${process.env.BACKEND_API_URL}/api/v1/sessions?user_id=${userId}`
    console.log("Fetching from backend:", backendUrl)
    
    const res = await fetch(backendUrl, { cache: "no-store" })

    if (!res.ok) {
      const errorText = await res.text()
      console.error(`Backend error (${res.status}):`, errorText)
      return NextResponse.json({ 
        error: `Failed to fetch sessions: ${res.status}`,
        details: errorText 
      }, { status: 500 })
    }

    const data = await res.json()
    
    // Transform backend response to match frontend expectations
    return NextResponse.json({
      success: true,
      chats: Array.isArray(data) ? data.map((chat: any) => ({
        session_id: chat.id,
        title: chat.title,
        created_at: chat.created_at,
        updated_at: chat.created_at,
      })) : []
    })
  } catch (error) {
    console.error("Error fetching chat history:", error)
    return NextResponse.json({ 
      error: "Failed to fetch sessions",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
