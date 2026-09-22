import React, { useState } from "react";
import { X, Key, Check, ShieldCheck, Sparkles } from "lucide-react";
import { getStoredApiKey, setStoredApiKey } from "../../services/aiService";
import { soundEngine } from "../../services/soundService";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [apiKey, setApiKey] = useState(getStoredApiKey());
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    soundEngine.playClick();
    setStoredApiKey(apiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-md max-h-[92dvh] overflow-y-auto custom-scrollbar hud-glass border border-cyan-500/35 rounded-3xl p-5 sm:p-7 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_35px_rgba(6,182,212,0.2)] relative text-slate-100 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-cyan-300 rounded-xl hover:bg-slate-900/80 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 border border-cyan-400/40">
            <Key className="w-5 h-5 text-cyan-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-extrabold font-display tracking-wider text-slate-100">
                System Configuration
              </h3>
              <span className="text-[9px] font-mono-hud px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                SECURITY
              </span>
            </div>
            <p className="text-[10px] text-cyan-400/70 font-mono-hud uppercase">
              Google Gemini 2.0 Flash API Setup
            </p>
          </div>
        </div>

        {/* Info Callout */}
        <div className="p-3.5 bg-slate-950/70 rounded-2xl border border-cyan-500/20 text-xs text-slate-300 leading-relaxed font-sans mb-5">
          <div className="flex items-center gap-1.5 text-cyan-300 font-mono-hud font-bold text-[11px] mb-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Empower AstroAI Intelligence</span>
          </div>
          <p>
            Configure your free Google Gemini API key to activate live
            generative planetary trivia, deep scientific dossiers, and natural
            language cosmic search.
          </p>
        </div>

        {/* API Key Form */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-mono-hud text-cyan-300 font-bold uppercase">
                Gemini API Key
              </label>
              <span className="text-[10px] font-mono-hud text-slate-400">
                Stored locally in browser
              </span>
            </div>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full p-3 bg-slate-950/90 border border-cyan-500/30 rounded-xl text-cyan-100 placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 font-mono-hud text-xs"
            />
          </div>

          <button
            onClick={handleSave}
            className={`w-full py-3 rounded-2xl font-display font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer uppercase tracking-wider ${
              saved
                ? "bg-emerald-600 text-white shadow-emerald-500/30 border border-emerald-400/50"
                : "bg-linear-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-cyan-500/30 border border-cyan-300/40"
            }`}
          >
            {saved ? (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-200" />
                <span>API Credentials Active!</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Save Credentials</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
