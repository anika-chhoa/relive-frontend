import type { ChatMessage } from "@/types/domain";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function getChatHistory(): Promise<ChatMessage[]> {
  const res = await fetch(`${API_URL}/api/chat/history`, { credentials: "include" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Could not load chat history");
  return data.messages;
}

interface StreamHandlers {
  onChunk: (text: string) => void;
  onSuggestions: (items: string[]) => void;
  onDone: () => void;
  onError: (message: string) => void;
}

export async function sendChatMessage(message: string, handlers: StreamHandlers) {
  const res = await fetch(`${API_URL}/api/chat/message`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  if (!res.ok || !res.body) {
    handlers.onError("Could not reach the assistant right now.");
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const parts = buffer.split("\n\n");
    buffer = parts.pop() || "";

    for (const part of parts) {
      const line = part.replace(/^data: /, "").trim();
      if (!line) continue;
      try {
        const payload = JSON.parse(line);
        if (payload.type === "chunk") handlers.onChunk(payload.text);
        else if (payload.type === "suggestions") handlers.onSuggestions(payload.items);
        else if (payload.type === "done") handlers.onDone();
        else if (payload.type === "error") handlers.onError(payload.message);
      } catch {
        // ignore partial/incomplete JSON chunk, will complete on next read
      }
    }
  }
}