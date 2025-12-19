import { type NextRequest, NextResponse } from "next/server"

interface RouteParams {
  params: Promise<{ session_id: string }>
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { session_id } = await params
    const formData = await request.formData()
    const files = formData.getAll("files")

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 })
    }

    // Upload files to your backend storage service
    const backendFormData = new FormData()
    files.forEach((file) => backendFormData.append("files", file))
    const response = await fetch(`${process.env.BACKEND_API_URL}/files/upload/${session_id}`, {
      method: "POST",
      body: backendFormData,
    })
    const data = await response.json()

    return NextResponse.json({
      success: true,
      files: data.files || [],
      message: data.message || "Successfully uploaded files",
    })
  } catch (error) {
    console.error("File upload error:", error)
    return NextResponse.json({ error: "Failed to upload files" }, { status: 500 })
  }
}
