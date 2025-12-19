import { Skeleton } from "@/components/ui/skeleton"
import { GraduationCap } from "lucide-react"

export function LoadingPage() {
  return (
    <div className="flex h-screen">
      {/* Sidebar Skeleton */}
      <aside className="hidden w-64 border-r border-border bg-card md:flex md:flex-col">
        <div className="flex items-center gap-2 border-b border-border p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <GraduationCap className="h-6 w-6 text-primary-foreground" />
          </div>
          <Skeleton className="h-6 w-20" />
        </div>

        <div className="p-4">
          <Skeleton className="h-10 w-full" />
        </div>

        <div className="flex-1 space-y-2 px-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-2 rounded-lg border border-border bg-card p-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content Skeleton */}
      <main className="flex flex-1 flex-col">
        <div className="border-b border-border p-4">
          <Skeleton className="h-6 w-32" />
        </div>

        <div className="flex-1 space-y-4 p-4 md:p-6">
          <div className="mx-auto max-w-3xl space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-16 w-full max-w-[80%] rounded-2xl" />
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-border p-4">
          <div className="mx-auto max-w-3xl">
            <Skeleton className="h-[52px] w-full rounded-lg" />
          </div>
        </div>
      </main>
    </div>
  )
}
