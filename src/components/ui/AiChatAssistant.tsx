import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Radio,
  Trash2,
  AlertTriangle,
  Key,
  ExternalLink,
  ShieldCheck,
  Info,
  Layers,
  HelpCircle,
  Search,
} from "lucide-react";
import type { ChatMessage, PlanetData } from "../../types/solar";
import { askAstroAI, getAiStatus } from "../../services/aiService";
import { soundEngine } from "../../services/soundService";

interface AiChatAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlanet: PlanetData | null;
  onOpenSettings?: () => void;
}

export const AiChatAssistant: React.FC<AiChatAssistantProps> = ({
  isOpen,
  onClose,
  selectedPlanet,
  onOpenSettings,
}) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const aiStatus = getAiStatus();

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Initialize or update welcome message based on AI status
  useEffect(() => {
    if (isOpen) {
      const status = getAiStatus();
      if (status.available && messages.length === 0) {
        setMessages([
          {
            id: "welcome-1",
            sender: "ai",
            text: `Greetings Commander! 🚀 I am **AstroAI**, your real-time astrophysics guide powered by Cloudflare Workers AI (**Llama 3.2 3B Instruct**).\n\n🟢 **System Status**: Connected via AI-Hub Worker\n\nAsk me anything regarding planetary science, orbital mechanics, solar dynamics, or deep space exploration!`,
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      }
    }
  }, [isOpen]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const prompt = textToSend || input.trim();
    if (!prompt || loading) return;

    soundEngine.playClick();

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const aiResponseText = await askAstroAI(
        prompt,
        selectedPlanet || undefined,
      );

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        relatedPlanetId: selectedPlanet?.id,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "AI service connection error.";

      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: `⚠️ **AstroAI Error Notice**\n\n${errorMessage}\n\n*Unable to connect to Cloudflare Worker AI Hub. Please verify your connection.*`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    soundEngine.playClick();
    setMessages([
      {
        id: Date.now().toString(),
        sender: "ai",
        text: `Terminal reset. Ready for new space mission inquiries! 🌌\n\n🟢 Status: Cloudflare Worker AI Active`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  };

  const presetQuestions = [
    `Why is ${selectedPlanet?.name || "Mars"} special?`,
    "Which planet has the most moons?",
    "What would happen if Earth had two Suns?",
    "How old is our Solar System?",
    "What is the Great Red Spot?",
  ];

  // =========================================================================
  // RENDER: AI UNAVAILABLE / CONFIGURATION GUIDANCE SCREEN
  // =========================================================================
  if (!aiStatus.available) {
    return (
      <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 md:w-[480px] hud-glass-purple border-l border-rose-500/35 flex flex-col shadow-[0_0_60px_rgba(244,63,94,0.2)] select-none animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 bg-slate-950/90 border-b border-rose-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-rose-600 via-amber-600 to-purple-600 flex items-center justify-center shadow-lg shadow-rose-500/30 border border-rose-400/40">
              <AlertTriangle className="w-5 h-5 text-amber-200 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-slate-100 font-display tracking-wider">
                  AstroAI Console
                </h3>
                <span className="text-[9px] font-mono-hud px-2 py-0.5 bg-rose-950/90 text-rose-300 rounded-md border border-rose-600/60 font-bold">
                  AI OFFLINE
                </span>
              </div>
              <p className="text-[10px] text-rose-300/80 font-mono-hud flex items-center gap-1">
                <Radio className="w-2.5 h-2.5 text-rose-400" />
                API Key Configuration Required
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-rose-300 rounded-xl hover:bg-rose-950/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content & Comprehensive Setup Guide */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs font-sans custom-scrollbar">
          {/* Main Error Callout */}
          <div className="p-4 bg-rose-950/40 border border-rose-500/40 rounded-2xl space-y-2 text-rose-200">
            <div className="flex items-center gap-2 font-bold font-display text-sm text-rose-300">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Default Fallback Response Disabled</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-300">
              AstroAI does not use fake simulated text. To prevent misleading
              information, the AI chat stays paused until a valid Google Gemini
              API key is connected.
            </p>
          </div>

          {/* User Guide Card 1: Production Deployment (For Reviewers / 10-15 visitors) */}
          <div className="p-4 bg-slate-950/80 border border-cyan-500/30 rounded-2xl space-y-2.5 text-slate-200">
            <div className="flex items-center gap-2 text-cyan-300 font-mono-hud font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Production Setup (For Project Owner / Deployment)</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              If deploying to production (Vercel, Netlify, GitHub Pages), set your API key in environment variables:
            </p>
            <div className="p-2.5 bg-slate-900 rounded-xl border border-cyan-500/20 font-mono-hud text-[10px] text-cyan-300">
              VITE_GEMINI_API_KEY=your_gemini_api_key
            </div>
            <p className="text-[10px] text-cyan-400/80">
              ✨ <strong>Benefit:</strong> All 10-15 visitors/reviewers get seamless out-of-the-box AI access without needing to generate their own keys!
            </p>
          </div>

          {/* User Guide Card 2: Individual Visitor Key Input */}
          <div className="p-4 bg-slate-950/80 border border-purple-500/30 rounded-2xl space-y-2.5 text-slate-200">
            <div className="flex items-center gap-2 text-purple-300 font-mono-hud font-bold text-xs">
              <Key className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Visitor Setup (Custom Gemini API Key)</span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-slate-300 leading-relaxed">
              <li>
                Get a free key from{" "}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-purple-300 underline font-semibold hover:text-purple-200 inline-flex items-center gap-0.5"
                >
                  Google AI Studio <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </li>
              <li>Click <strong>"Configure API Key ⚙️"</strong> below.</li>
              <li>Paste key and click Save. Credentials stay private in your browser.</li>
            </ol>
          </div>

          {/* User Guide Card 3: Capabilities Overview */}
          <div className="p-4 bg-purple-950/30 border border-purple-500/20 rounded-2xl space-y-2 text-slate-300">
            <div className="flex items-center gap-2 text-purple-300 font-mono-hud font-bold text-xs">
              <Info className="w-4 h-4 text-purple-400 shrink-0" />
              <span>What You Can Do With AstroAI</span>
            </div>
            <ul className="space-y-1.5 text-[11px]">
              <li className="flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-cyan-400 shrink-0" />
                <span>Ask live questions about planetary physics and solar dynamics</span>
              </li>
              <li className="flex items-center gap-2">
                <Layers className="w-3 h-3 text-purple-400 shrink-0" />
                <span>Get real-time telemetry contextualized to selected planets</span>
              </li>
              <li className="flex items-center gap-2">
                <HelpCircle className="w-3 h-3 text-amber-400 shrink-0" />
                <span>Generate dynamic AI astrophysics quizzes</span>
              </li>
              <li className="flex items-center gap-2">
                <Search className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>Search planets using natural language terms ("hottest planet")</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950/90 border-t border-rose-500/25 space-y-2">
          {onOpenSettings && (
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenSettings();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-linear-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30 cursor-pointer uppercase tracking-wider"
            >
              <Key className="w-4 h-4" />
              <span>Configure API Key ⚙️</span>
            </button>
          )}

          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noreferrer"
            className="w-full py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Get Free Key at Google AI Studio</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: ACTIVE AI CHAT INTERFACE (When API key is available)
  // =========================================================================
  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 md:w-[460px] hud-glass-purple border-l border-purple-500/35 flex flex-col shadow-[0_0_60px_rgba(168,85,247,0.25)] select-none animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 bg-slate-950/80 border-b border-purple-500/25 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-purple-600 via-indigo-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-purple-500/30 border border-purple-400/40">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-slate-100 font-display tracking-wider">
                AstroAI Guide
              </h3>
              <span className="text-[9px] font-mono-hud px-1.5 py-0.5 bg-purple-950/80 text-purple-300 rounded-md border border-purple-600/50">
                LLAMA 3.2 3B
              </span>
            </div>
            <p className="text-[10px] text-purple-300/70 font-mono-hud flex items-center gap-1">
              <Radio className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
              Cloudflare Worker AI Copilot
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {onOpenSettings && (
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenSettings();
              }}
              title="API Key Settings"
              className="p-2 text-slate-400 hover:text-cyan-300 rounded-xl hover:bg-purple-950/50 transition-colors cursor-pointer"
            >
              <Key className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={handleClearHistory}
            title="Clear Chat History"
            className="p-2 text-slate-400 hover:text-purple-300 rounded-xl hover:bg-purple-950/50 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            title="Close Assistant"
            className="p-2 text-slate-400 hover:text-purple-300 rounded-xl hover:bg-purple-950/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Target Context Pill */}
      {selectedPlanet && (
        <div className="px-4 py-2 bg-purple-950/40 border-b border-purple-500/20 flex items-center justify-between text-[11px] font-mono-hud text-purple-300">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full shadow-sm"
              style={{ backgroundColor: selectedPlanet.color }}
            />
            <span>
              ACTIVE FOCUS: <strong>{selectedPlanet.name}</strong>
            </span>
          </div>
          <span className="text-[9px] text-purple-400/70 uppercase">
            Context Attached
          </span>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === "user" ? "flex-row-reverse" : ""
            } animate-in fade-in slide-in-from-bottom-2 duration-200`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                msg.sender === "user"
                  ? "bg-linear-to-tr from-cyan-600 to-blue-600 text-white border border-cyan-400/40"
                  : msg.text.includes("⚠️") || msg.text.includes("Error")
                    ? "bg-rose-950 text-rose-300 border border-rose-500/40"
                    : "bg-linear-to-tr from-purple-900 to-indigo-900 text-purple-200 border border-purple-500/40"
              }`}
            >
              {msg.sender === "user" ? (
                <User className="w-4 h-4" />
              ) : (
                <Bot className="w-4 h-4" />
              )}
            </div>

            <div
              className={`max-w-[82%] p-3.5 rounded-2xl text-xs leading-relaxed font-sans ${
                msg.sender === "user"
                  ? "bg-linear-to-r from-cyan-950/80 to-blue-950/80 text-cyan-100 border border-cyan-500/30 rounded-tr-none shadow-md shadow-cyan-500/10"
                  : msg.text.includes("⚠️") || msg.text.includes("Error")
                    ? "bg-rose-950/90 text-rose-100 border border-rose-500/40 rounded-tl-none shadow-md shadow-rose-500/20 whitespace-pre-line"
                    : "bg-slate-950/85 text-slate-200 border border-purple-500/30 rounded-tl-none shadow-md shadow-purple-500/10 whitespace-pre-line"
              }`}
            >
              <div>{msg.text}</div>
              <div className="text-[9px] font-mono-hud text-slate-400/70 mt-1.5 text-right">
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3 p-3 bg-purple-950/30 rounded-2xl border border-purple-500/30 text-xs text-purple-300 font-mono-hud">
            <Sparkles className="w-4 h-4 animate-spin text-purple-400" />
            <div className="flex items-center gap-1">
              <span>AstroAI is querying Cloudflare Workers AI Engine</span>
              <span className="animate-pulse">...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="p-2.5 px-4 bg-slate-950/60 border-t border-purple-500/20 flex gap-2 overflow-x-auto custom-scrollbar">
        {presetQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-3 py-1 bg-purple-950/50 hover:bg-purple-800/40 text-purple-200 border border-purple-500/30 rounded-full text-[10px] font-mono-hud whitespace-nowrap transition-all shrink-0 hover:border-purple-400 active:scale-95 cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Command Input Dock */}
      <div className="p-3 bg-slate-950/90 border-t border-purple-500/25 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
          placeholder="Ask AstroAI any celestial question..."
          className="flex-1 px-3.5 py-2.5 bg-slate-900/90 text-purple-100 placeholder-slate-500 rounded-xl border border-purple-500/30 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-xs font-mono-hud"
        />

        <button
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          className="p-2.5 rounded-xl bg-linear-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white disabled:opacity-40 transition-all transform active:scale-95 shadow-md shadow-purple-500/30 cursor-pointer"
          title="Send Query"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
