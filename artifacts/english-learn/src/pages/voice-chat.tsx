import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Bot, X, Volume2 } from "lucide-react";
import { useVoiceRecorder, useVoiceStream } from "@workspace/integrations-openai-ai-react";
import { useLocation } from "wouter";
import logoImg from "/logo.png";

export default function VoiceChat() {
  const [, navigate] = useLocation();
  const [status, setStatus] = useState<"idle" | "recording" | "processing" | "playing">("idle");
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
  const workletPath = `${BASE}/audio-playback-worklet.js`;

  const voiceStream = useVoiceStream({
    workletPath,
    onUserTranscript: (text: string) => setUserText(text),
    onTranscript: (_: string, full: string) => setAiText(full),
    onComplete: () => setStatus("idle"),
    onError: (err: Error) => {
      setError("حدث خطأ في المحادثة الصوتية");
      setStatus("idle");
      console.error(err);
    },
  });

  const { startRecording, stopRecording } = useVoiceRecorder();

  const handleMicPress = useCallback(async () => {
    if (status === "recording") {
      setStatus("processing");
      const blob = await stopRecording();
      if (!blob || blob.size < 1000) {
        setStatus("idle");
        return;
      }
      setUserText("");
      setAiText("");
      setError(null);
      setStatus("playing");
      try {
        await voiceStream.streamVoiceResponse(`${BASE}/api/voice-chat/message`, blob);
      } catch {
        setStatus("idle");
      }
    } else if (status === "idle") {
      setError(null);
      setUserText("");
      setAiText("");
      await startRecording();
      setStatus("recording");
    }
  }, [status, startRecording, stopRecording, voiceStream, BASE]);

  const statusColor = {
    idle: "from-primary to-purple-600",
    recording: "from-red-500 to-rose-600",
    processing: "from-yellow-500 to-amber-600",
    playing: "from-green-500 to-emerald-600",
  }[status];

  const statusLabel = {
    idle: "اضغط للتحدث",
    recording: "جارٍ التسجيل... اضغط للإيقاف",
    processing: "جارٍ المعالجة...",
    playing: "الذكاء الاصطناعي يتحدث...",
  }[status];

  return (
    <div className="fixed inset-0 bg-background flex flex-col z-50" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-white text-sm">المساعد الصوتي</p>
            <p className="text-xs text-muted-foreground">تحدّث وسيرد عليك بالصوت</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <img src={logoImg} alt="VOT" className="h-7 w-auto opacity-70" />
          <button
            onClick={() => navigate("/")}
            className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8 px-6">
        {/* Animated mic button */}
        <div className="relative flex items-center justify-center">
          {/* Pulse rings */}
          {status === "recording" && (
            <>
              <motion.div
                className="absolute w-48 h-48 rounded-full bg-red-500/20"
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
              <motion.div
                className="absolute w-40 h-40 rounded-full bg-red-500/20"
                animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}
              />
            </>
          )}
          {status === "playing" && (
            <>
              <motion.div
                className="absolute w-48 h-48 rounded-full bg-green-500/20"
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
              />
              <motion.div
                className="absolute w-40 h-40 rounded-full bg-green-500/20"
                animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ repeat: Infinity, duration: 1.2, delay: 0.25 }}
              />
            </>
          )}

          <motion.button
            onClick={handleMicPress}
            disabled={status === "processing" || status === "playing"}
            whileTap={{ scale: 0.92 }}
            className={`relative w-32 h-32 rounded-full bg-gradient-to-br ${statusColor} flex items-center justify-center shadow-2xl disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300`}
            style={{ boxShadow: `0 0 40px rgba(var(--primary), 0.3)` }}
          >
            {status === "recording" ? (
              <MicOff className="w-14 h-14 text-white" />
            ) : status === "playing" ? (
              <Volume2 className="w-14 h-14 text-white" />
            ) : status === "processing" ? (
              <motion.div
                className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
              />
            ) : (
              <Mic className="w-14 h-14 text-white" />
            )}
          </motion.button>
        </div>

        {/* Status label */}
        <motion.p
          key={status}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-muted-foreground text-base text-center"
        >
          {statusLabel}
        </motion.p>

        {/* Transcripts */}
        <div className="w-full max-w-md space-y-3">
          <AnimatePresence>
            {userText && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-primary/10 border border-primary/20 rounded-2xl rounded-tr-sm px-4 py-3 text-right"
              >
                <p className="text-xs text-primary mb-1">أنت</p>
                <p className="text-white text-sm leading-relaxed">{userText}</p>
              </motion.div>
            )}
            {aiText && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3 text-right"
              >
                <p className="text-xs text-muted-foreground mb-1">المساعد</p>
                <p className="text-white text-sm leading-relaxed">{aiText}</p>
              </motion.div>
            )}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-destructive/10 border border-destructive/30 rounded-xl px-4 py-3 text-center"
              >
                <p className="text-destructive text-sm">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Tips */}
      <div className="px-6 pb-6">
        <p className="text-center text-xs text-muted-foreground">
          💡 تحدث بالإنجليزية أو العربية وسيساعدك المساعد على تعلم اللغة
        </p>
      </div>
    </div>
  );
}
