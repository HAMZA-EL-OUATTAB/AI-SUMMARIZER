import { NextResponse } from "next/server"

export async function DELETE(
  request: Request,
  context: { params: Promise<{ session_id: string }> }
) {
  try {
    const { session_id } = await context.params

    if (!session_id) {
      return NextResponse.json(
        { error: "Session ID missing" },
        { status: 400 }
      )
    }

    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]

 
    const backendRes = await fetch(
      `${process.env.BACKEND_API_URL}/api/v1/sessions/${session_id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!backendRes.ok) {
      const text = await backendRes.text()
      console.error("Backend delete error:", text)
      return NextResponse.json(
        { error: "Failed to delete session" },
        { status: backendRes.status }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("DELETE session error:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
