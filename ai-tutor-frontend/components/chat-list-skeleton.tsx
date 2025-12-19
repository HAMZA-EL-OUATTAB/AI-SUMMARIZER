import { Skeleton } from "@/components/ui/skeleton"

export function ChatListSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-lg border border-transparent p-3">
          <div className="flex items-start gap-3">
            <Skeleton className="mt-0.5 h-8 w-8 rounded-md" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
