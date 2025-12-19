import { AppLayout } from "@/components/app-layout"
import { MobileSidebarToggle } from "@/components/mobile-sidebar-toggle"

export default function HomePage() {
  return (
    <AppLayout>
      <div className="flex h-full flex-col">
        <div className="border-b border-border bg-card px-4 py-4 md:hidden">
          <div className="flex items-center gap-3">
            <MobileSidebarToggle />
            <h1 className="text-lg font-semibold text-foreground">AI Tutor</h1>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center p-4 md:p-8">
          <div className="max-w-md space-y-4 text-center">
            <h2 className="text-2xl font-semibold text-foreground md:text-3xl">Welcome to AI Tutor</h2>
            <p className="text-balance text-sm text-muted-foreground md:text-base">
              Select a chat from the sidebar or start a new conversation to begin learning with your AI-powered tutor.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
