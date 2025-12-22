"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatListItem } from "@/components/chat-list-item";
import { ChatListSkeleton } from "@/components/chat-list-skeleton";
import { ChatListEmpty } from "@/components/chat-list-empty";
import { NewChatButton } from "@/components/new-chat-button";
import { GraduationCap } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ProfileAlert } from "@/components/ProfileAlert";

interface Chat {
  session_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export function Sidebar() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchChatHistory() {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated");

        setIsLoading(true);

        const res = await fetch("/api/v1/chats/history", {
          cache: "no-store",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to load chats");
        }

        const data = await res.json();
        setChats(data.chats || []);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to load chats";
        setError(msg);
        toast({
          title: "Error loading chats",
          description: msg,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchChatHistory();
  }, [toast]);

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 border-b border-border p-4 shrink-0">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <GraduationCap className="h-6 w-6 text-primary-foreground" />
        </div>
        <h1 className="text-xl font-semibold">AI Tutor</h1>
      </div>

      <div className="p-4 shrink-0">
        <NewChatButton />
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full px-3">
          <div className="pb-4 space-y-2">
            {isLoading && <ChatListSkeleton />}
            {!isLoading && !error && chats.length === 0 && <ChatListEmpty />}
            {!isLoading && error && (
              <p className="px-4 py-8 text-center text-sm text-destructive">
                {error}
              </p>
            )}
            {!isLoading &&
              !error &&
              chats.map((chat) => (
                <ChatListItem
                  key={chat.session_id}
                  id={chat.session_id}
                  title={chat.title}
                  date={chat.created_at}
                />
              ))}
          </div>
        </ScrollArea>
      </div>

      <div className="border-t border-border p-4 shrink-0">
        <ProfileAlert />
      </div>
    </aside>
  );
}
