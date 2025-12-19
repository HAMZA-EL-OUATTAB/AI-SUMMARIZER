"use client"

import { useEffect } from "react"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[v0] Application error:", error)
  }, [error])

  return (
    <div className="flex h-screen items-center justify-center bg-background p-4">
      <div className="max-w-md space-y-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground md:text-2xl">Something went wrong</h2>
          <p className="text-sm text-muted-foreground">
            We encountered an unexpected error. Please try refreshing the page.
          </p>
        </div>
        <Button onClick={reset}>Try Again</Button>
      </div>
    </div>
  )
}
