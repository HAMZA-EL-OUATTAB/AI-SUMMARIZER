import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, username, password } = await req.json();

  // TODO: Connect your backend or database here
  // Example: save user to database
  if (!email || !username || !password) {
    return NextResponse.json({ detail: "Missing fields" }, { status: 400 });
  }

  // Simulate success
  return NextResponse.json({ success: true });
}
