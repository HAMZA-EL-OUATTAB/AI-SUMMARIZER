import { MobileSidebarToggle } from "./mobile-sidebar-toggle"

interface ChatHeaderProps {
  title: string
}

export function ChatHeader({ title }: ChatHeaderProps) {
  return (
    <div className="border-b border-border bg-card">
      <div className="flex items-center gap-3 px-4 py-4 md:px-6">
        <MobileSidebarToggle />
        <h2 className="text-lg font-semibold text-foreground md:text-xl">{title}</h2>
      </div>
    </div>
  )
}
