import type React from "react"
import { Sidebar } from "@/components/sidebar"
import { ErrorBoundary } from "@/components/error-boundary"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <ErrorBoundary>
      <div className="flex h-screen flex-col overflow-hidden bg-background md:flex-row">
        <div className="hidden md:flex">
          <Sidebar />
        </div>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </ErrorBoundary>
  )
}
