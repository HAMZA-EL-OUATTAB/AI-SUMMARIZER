import { AppLayout } from "@/components/app-layout"

export default function ChatPage({ params }: { params: { id: string } }) {
  return (
    <AppLayout>
      <div className="flex h-full flex-col">
        {/* Chat Header */}
        <div className="border-b border-border bg-card px-6 py-4">
          <h2 className="text-xl font-semibold text-foreground">Chat Session {params.id}</h2>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-3xl space-y-4">
            <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <p className="text-sm text-muted-foreground">
                This is where your chat messages will appear. Start asking questions to your AI Tutor!
              </p>
            </div>
          </div>
        </div>

        {/* Chat Input Area */}
        <div className="border-t border-border bg-card p-4">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-lg border border-input bg-background px-4 py-3">
              <p className="text-sm text-muted-foreground">Message input will go here...</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
