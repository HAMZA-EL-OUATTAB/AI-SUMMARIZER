import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  // TODO: Connect your backend for authentication
  if (email === "test@test.com" && password === "1234") {
    return NextResponse.json({ access_token: "fake-jwt-token" });
  } else {
    return NextResponse.json({ detail: "Invalid credentials" }, { status: 401 });
  }
}
