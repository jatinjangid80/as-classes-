import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "What courses do you offer?",
  "How much do classes cost?",
  "How can I enrol?",
  "Do you offer demo classes?",
];

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm Aspira — your AS Classes assistant. Ask me about courses, fees, timings, or admissions.",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: text.trim() }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.ok) {
        const err = await res.text();
        setMessages((m) => [...m, { role: "assistant", content: `Sorry, I hit an error: ${err || res.status}` }]);
        return;
      }
      const data = (await res.json()) as { reply: string };
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Network error — please try again in a moment." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open chat"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-hero text-primary-foreground shadow-glow transition-smooth hover:scale-105"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[32rem] w-[22rem] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-elegant">
          <div className="flex items-center gap-3 border-b border-border bg-gradient-hero px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-background/20">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <div className="font-display text-sm font-bold text-primary-foreground">Aspira</div>
              <div className="text-xs text-primary-foreground/80">AS Classes assistant</div>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-sm text-primary-foreground"
                    : "max-w-[90%] text-sm text-foreground"
                }
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="text-sm text-muted-foreground">Thinking…</div>
            )}
            {messages.length <= 1 && !loading && (
              <div className="flex flex-wrap gap-2 pt-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border border-border bg-secondary px-3 py-1 text-xs text-secondary-foreground transition-smooth hover:bg-accent hover:text-accent-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-border bg-background p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything…"
              className="flex-1 rounded-lg bg-input px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
              disabled={loading}
            />
            <Button type="submit" size="icon" disabled={loading || !input.trim()} className="bg-gradient-hero">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
