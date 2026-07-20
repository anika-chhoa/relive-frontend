"use client";

import { getChatHistory, sendChatMessage } from "@/lib/chat";
import { useAppSession } from "@/lib/useAppSession";
import type { ChatMessage } from "@/types/domain";
import { Loader2, Send, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const INITIAL_SUGGESTIONS = [
  "How do I list an item?",
  "How does Book Now payment work?",
  "How do seller ratings work?",
];

export default function ChatPage() {
  const router = useRouter();
  const { user, isPending: sessionPending } = useAppSession();

  useEffect(() => {
    if (!sessionPending && !user) {
      router.replace("/login?redirect=/chat");
    }
  }, [sessionPending, user, router]);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>(INITIAL_SUGGESTIONS);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    getChatHistory()
      .then((history) => {
        setMessages(history);
        if (history.length > 0) setSuggestions([]);
      })
      .finally(() => setHistoryLoaded(true));
  }, [user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  async function handleSend(text?: string) {
    const content = (text ?? input).trim();
    if (!content || streaming) return;

    setInput("");
    setSuggestions([]);
    setError("");
    setMessages((m) => [...m, { role: "user", content }]);
    setMessages((m) => [...m, { role: "assistant", content: "" }]);
    setStreaming(true);

    await sendChatMessage(content, {
      onChunk: (chunk) => {
        setMessages((m) => {
          const next = [...m];
          next[next.length - 1] = {
            role: "assistant",
            content: next[next.length - 1].content + chunk,
          };
          return next;
        });
      },
      onSuggestions: (items) => setSuggestions(items),
      onDone: () => setStreaming(false),
      onError: (message) => {
        setError(message);
        setStreaming(false);
      },
    });
  }

  if (sessionPending || !user || !historyLoaded) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-ink-muted">
        <Loader2 className="mr-2 animate-spin" size={18} />
        Loading chat…
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-64px)] max-w-3xl flex-col px-4 sm:px-6">
      <div className="border-b border-border py-4">
        <div className="flex items-center gap-2">
          <span
            className="aura-ring"
            style={{ "--ring-size": "28px" } as React.CSSProperties}
          />
          <div>
            <h1 className="font-display text-lg font-medium text-ink">Riva</h1>
            <p className="text-xs text-ink-faint">Relive&apos;s AI assistant</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-ink-muted">
            <Sparkles className="text-cta" size={24} />
            <p className="text-sm">
              Ask me anything about buying or selling on Relive.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-card px-4 py-2.5 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-cta text-white"
                    : "border border-border bg-surface text-ink"
                }`}
              >
                {m.content ? (
                  <span className="whitespace-pre-line">
                    {renderWithItemLinks(m.content)}
                  </span>
                ) : (
                  <span className="flex gap-1 py-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-faint [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-faint [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-faint" />
                  </span>
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {error && (
          <p className="mt-3 text-center text-xs text-error">{error}</p>
        )}
      </div>

      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2 border-t border-border py-3">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => handleSend(s)}
              className="btn btn-outline btn-xs rounded-full"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 border-t border-border py-4 mb-8"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about buying, selling, payments…"
          className="input input-bordered flex-1 text-sm"
        />
        <button
          type="submit"
          disabled={streaming || !input.trim()}
          className="btn btn-primary btn-circle"
        >
          {streaming ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Send size={16} />
          )}
        </button>
      </form>
    </div>
  );
}

function renderWithItemLinks(text: string) {
  const parts = text.split(/(\/items\/[a-f0-9]{24})/g);
  return parts.map((part, i) =>
    /^\/items\/[a-f0-9]{24}$/.test(part) ? (
      <Link key={i} href={part} className="font-medium text-cta underline">
        View item
      </Link>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}
