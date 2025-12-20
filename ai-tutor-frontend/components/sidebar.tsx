"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatListItem } from "@/components/chat-list-item";
import { ChatListSkeleton } from "@/components/chat-list-skeleton";
import { ChatListEmpty } from "@/components/chat-list-empty";
import { NewChatButton } from "@/components/new-chat-button";
import { GraduationCap } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ProfileAlert } from "@/components/ProfileAlert"; // <-- import

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
        setIsLoading(true);
        const response = await fetch("/api/v1/chats/history");
        const data = await response.json();

        if (data.success) {
          setChats(data.chats);
        } else {
          const errorMsg = data.error || "Failed to load chats";
          setError(errorMsg);
          toast({
            title: "Error loading chats",
            description: errorMsg,
            variant: "destructive",
          });
        }
      } catch (err) {
        const errorMsg = "Failed to load chats";
        setError(errorMsg);
        console.error("[v0] Error fetching chat history:", err);
        toast({
          title: "Error loading chats",
          description: errorMsg,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchChatHistory();
  }, [toast]);

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-card">
      {/* Logo/Header */}
      <div className="flex items-center gap-2 border-b border-border p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <GraduationCap className="h-6 w-6 text-primary-foreground" />
        </div>
        <h1 className="text-xl font-semibold text-foreground">AI Tutor</h1>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <NewChatButton />
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1 px-3">
        <div className="pb-4">
          {isLoading && <ChatListSkeleton />}
          {!isLoading && !error && chats.length === 0 && <ChatListEmpty />}
          {!isLoading && error && (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
          {!isLoading && !error && chats.length > 0 && (
            <div className="space-y-2">
              {chats.map((chat) => (
                <ChatListItem
                  key={chat.session_id}
                  id={chat.session_id}
                  title={chat.title}
                  date={chat.created_at}
                />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Profile section fixed at bottom */}
      <div className="p-4 border-t border-border mt-auto">
        <ProfileAlert />
      </div>
    </aside>
  );
}
