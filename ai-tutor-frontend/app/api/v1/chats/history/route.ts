import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    const res = await fetch(
      `${process.env.BACKEND_API_URL}/api/v1/sessions`,
      {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Backend error:", errorText);
      return NextResponse.json(
        { error: "Failed to fetch sessions" },
        { status: res.status }
      );
    }

    const data = await res.json();

    return NextResponse.json({
      success: true,
      chats: data.map((chat: any) => ({
        session_id: chat.id,
        title: chat.title,
        created_at: chat.created_at,
        updated_at: chat.created_at,
      })),
    });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 }
    );
  }
}
