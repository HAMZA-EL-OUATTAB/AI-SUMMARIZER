// API Client for AI Tutor Backend - FIXED VERSION
// Matches your actual FastAPI backend structure

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

// ==================== Types & Interfaces ====================

export interface CreateChatRequest {
  user_id: number
  title: string
}

export interface CreateChatResponse {
  id: number
  title: string
  created_at: string
}

export interface Message {
  id: number
  sender: "user" | "ai"
  content: string
  created_at: string
}

export interface GetMessagesResponse {
  id: number
  sender: string
  content: string
  created_at: string
}

export interface SendMessageRequest {
  content: string
}

export interface SendMessageResponse {
  user_message: Message
  ai_message: Message
}

export interface UploadFileResponse {
  id: number
  filename: string
  file_type: string
  file_size: number
  text_extracted: boolean
  uploaded_at: string
}

export interface ChatSession {
  id: number
  title: string
  created_at: string
}

export interface HealthCheckResponse {
  status: string
}

export interface RootResponse {
  message: string
  version: string
  status: string
}

// ==================== Error Handling ====================

export class ApiClientError extends Error {
  status: number
  detail: string

  constructor(status: number, detail: string) {
    super(detail)
    this.status = status
    this.detail = detail
    this.name = "ApiClientError"
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorDetail = "An error occurred"
    try {
      const errorData = await response.json()
      errorDetail = errorData.detail || errorData.message || errorDetail
    } catch {
      errorDetail = response.statusText || errorDetail
    }
    throw new ApiClientError(response.status, errorDetail)
  }

  const contentType = response.headers.get("content-type")
  if (contentType && contentType.includes("application/json")) {
    return response.json()
  }

  return {} as T
}

// ==================== API Client ====================

export const apiClient = {
  // ==================== Chat Endpoints ====================

  /**
   * Create a new chat session
   * POST /api/v1/chats/
   */
  async createChat(userId: number, title: string): Promise<CreateChatResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/chats/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: userId, title }),
    })
    return handleResponse<CreateChatResponse>(response)
  },

  /**
   * Get messages for a chat session
   * GET /api/v1/chats/{session_id}/messages
   */
  async getMessages(sessionId: number): Promise<Message[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/chats/${sessionId}/messages`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    return handleResponse<Message[]>(response)
  },

  /**
   * Send a message in a chat session and get AI response
   * POST /api/v1/chats/{session_id}/messages
   */
  async sendMessage(sessionId: number, content: string): Promise<SendMessageResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/chats/${sessionId}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    })
    return handleResponse<SendMessageResponse>(response)
  },

  // ==================== File Endpoints ====================

  /**
   * Upload a file to a chat session
   * POST /api/v1/files/upload/{session_id}
   */
  async uploadFile(
    sessionId: number,
    file: File,
    onProgress?: (progress: number) => void,
  ): Promise<UploadFileResponse> {
    const formData = new FormData()
    formData.append("file", file)

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      // Track upload progress
      if (onProgress) {
        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100
            onProgress(progress)
          }
        })
      }

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText)
            resolve(data)
          } catch {
            reject(new ApiClientError(xhr.status, "Invalid JSON response"))
          }
        } else {
          let errorDetail = "Upload failed"
          try {
            const errorData = JSON.parse(xhr.responseText)
            errorDetail = errorData.detail || errorData.message || errorDetail
          } catch {
            errorDetail = xhr.statusText || errorDetail
          }
          reject(new ApiClientError(xhr.status, errorDetail))
        }
      })

      xhr.addEventListener("error", () => {
        reject(new ApiClientError(0, "Network error occurred"))
      })

      xhr.addEventListener("abort", () => {
        reject(new ApiClientError(0, "Upload aborted"))
      })

      xhr.open("POST", `${API_BASE_URL}/api/v1/files/upload/${sessionId}`)
      xhr.send(formData)
    })
  },

  // ==================== Health & Status ====================

  /**
   * Check API health
   * GET /health
   */
  async healthCheck(): Promise<HealthCheckResponse> {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    return handleResponse<HealthCheckResponse>(response)
  },

  /**
   * Root endpoint - Get API info
   * GET /
   */
  async root(): Promise<RootResponse> {
    const response = await fetch(`${API_BASE_URL}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    return handleResponse<RootResponse>(response)
  },
}

// ==================== Convenience Exports ====================

// Export the error class (already exported above)
// No need to re-export

// ==================== Usage Examples ====================

/*
// Create a chat
const chat = await apiClient.createChat(1, "Biology Study")
console.log(chat.id) // 4

// Send a message
const response = await apiClient.sendMessage(4, "What is photosynthesis?")
console.log(response.user_message.content) // "What is photosynthesis?"
console.log(response.ai_message.content) // AI's response

// Get all messages
const messages = await apiClient.getMessages(4)
messages.forEach(msg => {
  console.log(`${msg.sender}: ${msg.content}`)
})

// Upload a file
const file = new File(["content"], "notes.txt", { type: "text/plain" })
const result = await apiClient.uploadFile(4, file, (progress) => {
  console.log(`Upload: ${progress}%`)
})
console.log(result.filename) // "notes.txt"
*/