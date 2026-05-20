import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Crown, ArrowRight, Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { customFetch } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/auth-context";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

interface Conversation {
  id: number;
  title: string;
  createdAt: string;
}

export default function AiChat() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user?.isSubscribed) {
      navigate("/subscription");
      return;
    }
    loadConversations();
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadConversations = async () => {
    try {
      const data = await customFetch("/api/ai-chat/conversations") as Conversation[];
      setConversations(data);
      if (data.length > 0) {
        setActiveConvId(data[data.length - 1].id);
        loadMessages(data[data.length - 1].id);
      }
    } catch {
      toast({ title: "خطأ", description: "فشل تحميل المحادثات", variant: "destructive" });
    } finally {
      setLoadingConvs(false);
    }
  };

  const loadMessages = async (convId: number) => {
    try {
      const data = await customFetch(`/api/ai-chat/conversations/${convId}/messages`) as Message[];
      setMessages(data);
    } catch {
      setMessages([]);
    }
  };

  const newConversation = async () => {
    try {
      const conv = await customFetch("/api/ai-chat/conversations", {
        method: "POST",
        body: JSON.stringify({ title: `محادثة ${conversations.length + 1}` }),
      }) as Conversation;
      setConversations(prev => [...prev, conv]);
      setActiveConvId(conv.id);
      setMessages([]);
    } catch {
      toast({ title: "خطأ", description: "فشل إنشاء محادثة", variant: "destructive" });
    }
  };

  const selectConversation = (conv: Conversation) => {
    setActiveConvId(conv.id);
    loadMessages(conv.id);
  };

  const sendMessage = async () => {
    if (!input.trim() || streaming || !activeConvId) return;

    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      content: input.trim(),
      createdAt: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = input.trim();
    setInput("");
    setStreaming(true);

    const assistantMsg: Message = {
      id: Date.now() + 1,
      role: "assistant",
      content: "",
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, assistantMsg]);

    try {
      const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
      const response = await fetch(`${BASE}/api/ai-chat/conversations/${activeConvId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content: currentInput }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const json = JSON.parse(line.slice(6));
                if (json.content) {
                  setMessages(prev => {
                    const updated = [...prev];
                    const last = updated[updated.length - 1];
                    if (last.role === "assistant") {
                      updated[updated.length - 1] = { ...last, content: last.content + json.content };
                    }
                    return updated;
                  });
                }
              } catch {}
            }
          }
        }
      }
    } catch {
      toast({ title: "خطأ", description: "فشل إرسال الرسالة", variant: "destructive" });
    } finally {
      setStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!user?.isSubscribed) return null;

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background" dir="rtl">
      <div className="w-64 border-l border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 mb-3">
            <Crown className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-yellow-400">مشترك مميز</span>
          </div>
          <Button onClick={newConversation} size="sm" className="w-full gap-2">
            <Plus className="w-4 h-4" />
            محادثة جديدة
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {loadingConvs ? (
            <div className="flex justify-center p-4">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : conversations.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center p-4">لا توجد محادثات بعد</p>
          ) : (
            conversations.map(conv => (
              <button
                key={conv.id}
                onClick={() => selectConversation(conv)}
                className={`w-full text-right px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeConvId === conv.id
                    ? "bg-primary/20 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <p className="truncate">{conv.title}</p>
              </button>
            ))
          )}
        </div>
        <div className="p-3 border-t border-border">
          <Button variant="ghost" size="sm" className="w-full gap-2 text-muted-foreground" onClick={() => navigate("/")}>
            <ArrowRight className="w-4 h-4" />
            الرئيسية
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-border flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-white">إنجلش بوت</p>
            <p className="text-xs text-muted-foreground">مساعدك الذكي لتعلم الإنجليزية</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!activeConvId ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                <Bot className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-2">مرحباً! أنا إنجلش بوت</h2>
                <p className="text-muted-foreground text-sm max-w-sm">
                  أنا هنا لمساعدتك في تعلم الإنجليزية. اسألني عن القواعد أو المفردات أو أرسل لي جملة لأصححها!
                </p>
              </div>
              <Button onClick={newConversation} className="gap-2">
                <Plus className="w-4 h-4" />
                ابدأ محادثة جديدة
              </Button>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
              <Bot className="w-12 h-12 text-muted-foreground" />
              <p className="text-muted-foreground">ابدأ بكتابة سؤالك عن اللغة الإنجليزية</p>
              <div className="flex flex-wrap gap-2 justify-center max-w-md">
                {["ما الفرق بين since وfor؟", "صحّح هذه الجملة: I am go school", "اشرح المضارع التام"].map(s => (
                  <button
                    key={s}
                    onClick={() => setInput(s)}
                    className="text-xs bg-muted hover:bg-muted/80 text-muted-foreground px-3 py-1.5 rounded-full transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                    msg.role === "user" ? "bg-primary/20" : "bg-gradient-to-br from-primary to-purple-600"
                  }`}>
                    {msg.role === "user" ? <User className="w-4 h-4 text-primary" /> : <Bot className="w-4 h-4 text-white" />}
                  </div>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : "bg-card border border-border text-foreground rounded-tl-sm"
                  }`}>
                    {msg.content ? (
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    ) : (
                      <div className="flex gap-1 items-center py-1">
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || streaming || !activeConvId}
              size="icon"
              className="flex-shrink-0"
            >
              {streaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={activeConvId ? "اكتب سؤالك هنا..." : "أنشئ محادثة جديدة أولاً"}
              disabled={!activeConvId || streaming}
              className="flex-1 text-right"
            />
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">اضغط Enter للإرسال</p>
        </div>
      </div>
    </div>
  );
}
