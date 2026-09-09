import React, { useState } from "react";
import { X, Send, Sparkles, Bot, User } from "lucide-react";
import type { ChatMessage, PlanetData } from "../../types/solar";
import { askAstroAI } from "../../services/aiService";
import { soundEngine } from "../../services/soundService";

interface AiChatAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlanet: PlanetData | null;
}

export const AiChatAssistant: React.FC<AiChatAssistantProps> = ({
  isOpen,
  onClose,
  selectedPlanet,
}) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "ai",
      text: `Hello space explorer! 🚀 I am **AstroAI**, your real-time astronomy guide powered by Google Gemini. Ask me anything about planets, space missions, or astrophysics!`,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

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
    setLoading(false);
  };

  const presetQuestions = [
    `Why is ${selectedPlanet?.name || "Mars"} special?`,
    "Which planet has the most moons?",
    "What would happen if Earth had two Suns?",
    "How old is our Solar System?",
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-slate-950/95 backdrop-blur-2xl border-l border-cyan-500/30 flex flex-col shadow-2xl">
      {/* Header */}
      <div className="p-4 bg-slate-900/80 border-b border-cyan-500/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-purple-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
              AstroAI Guide
              <span className="text-[10px] px-1.5 py-0.5 bg-purple-950 text-purple-300 rounded border border-purple-700">
                GEMINI
              </span>
            </h3>
            <p className="text-[10px] text-cyan-400/80">
              Real-time Solar System Assistant
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            soundEngine.playClick();
            onClose();
          }}
          className="p-1.5 text-slate-400 hover:text-cyan-300 rounded-xl hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                msg.sender === "user"
                  ? "bg-cyan-600 text-white"
                  : "bg-purple-900 text-purple-200"
              }`}
            >
              {msg.sender === "user" ? (
                <User className="w-4 h-4" />
              ) : (
                <Bot className="w-4 h-4" />
              )}
            </div>

            <div
              className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                msg.sender === "user"
                  ? "bg-cyan-600/30 text-cyan-100 border border-cyan-500/30 rounded-tr-none"
                  : "bg-slate-900/90 text-slate-200 border border-purple-500/30 rounded-tl-none whitespace-pre-line"
              }`}
            >
              {msg.text}
              <div className="text-[9px] text-slate-500 mt-1 text-right">
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-purple-400 p-2">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>AstroAI is computing space query...</span>
          </div>
        )}
      </div>

      {/* Quick Questions */}
      <div className="p-2 px-4 bg-slate-900/40 border-t border-slate-800 flex gap-1.5 overflow-x-auto custom-scrollbar">
        {presetQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-2.5 py-1 bg-slate-800/80 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-full text-[10px] whitespace-nowrap transition-colors shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Dock */}
      <div className="p-3 bg-slate-900/90 border-t border-cyan-500/20 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
          placeholder="Ask AstroAI any celestial question..."
          className="flex-1 px-3 py-2 bg-slate-950 text-cyan-100 placeholder-slate-500 rounded-xl border border-cyan-500/30 focus:border-cyan-400 focus:outline-none text-xs"
        />

        <button
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          className="p-2 rounded-xl bg-linear-to-r from-cyan-600 to-purple-600 text-white disabled:opacity-50 transition-transform transform active:scale-95"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
