"use client"

import { useEffect } from "react"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AppLayout } from "@/components/app-layout"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[v0] Chat page error:", error)
  }, [error])

  return (
    <AppLayout>
      <div className="flex h-full items-center justify-center p-4">
        <div className="max-w-md space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground md:text-2xl">Failed to load chat</h2>
            <p className="text-sm text-muted-foreground">
              We couldn't load this chat session. Please try again or return to the home page.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button onClick={reset} variant="default">
              Try Again
            </Button>
            <Button onClick={() => (window.location.href = "/")} variant="outline">
              Go Home
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
