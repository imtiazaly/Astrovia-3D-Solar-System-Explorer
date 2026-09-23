import React, { useState } from "react";
import {
  X,
  Key,
  Check,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Info,
  Globe,
  AlertCircle,
  Trash2,
} from "lucide-react";
import {
  getStoredApiKey,
  setStoredApiKey,
  getAiStatus,
} from "../../services/aiService";
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
  const status = getAiStatus();

  if (!isOpen) return null;

  const handleSave = () => {
    soundEngine.playClick();
    setStoredApiKey(apiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleClearKey = () => {
    soundEngine.playClick();
    localStorage.removeItem("astrovia_gemini_api_key");
    setApiKey(import.meta.env.VITE_GEMINI_API_KEY || "");
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
                GEMINI AI
              </span>
            </div>
            <p className="text-[10px] text-cyan-400/70 font-mono-hud uppercase">
              Google Gemini 3.6 Flash Setup
            </p>
          </div>
        </div>

        {/* Active Status Badge */}
        <div
          className={`p-3 rounded-2xl border mb-5 font-mono-hud text-xs flex items-center justify-between ${
            status.source === "user"
              ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300"
              : status.source === "env"
                ? "bg-cyan-950/60 border-cyan-500/40 text-cyan-300"
                : "bg-rose-950/60 border-rose-500/40 text-rose-300"
          }`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                status.available ? "bg-emerald-400 animate-pulse" : "bg-rose-500"
              }`}
            />
            <span className="font-bold">
              {status.source === "user"
                ? "Custom Browser Key Active"
                : status.source === "env"
                  ? "Production .env Key Active"
                  : "No API Key Configured"}
            </span>
          </div>
          <span className="text-[10px] uppercase opacity-80">
            {status.available ? "AI Ready" : "AI Offline"}
          </span>
        </div>

        {/* Production Deployment Guide Banner */}
        <div className="p-3.5 bg-slate-950/70 rounded-2xl border border-cyan-500/20 text-xs text-slate-300 leading-relaxed font-sans mb-5 space-y-2">
          <div className="flex items-center gap-1.5 text-cyan-300 font-mono-hud font-bold text-[11px]">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>Production Deployment Note (10-15 Reviewers)</span>
          </div>
          <p className="text-[11px] text-slate-300">
            To provide zero-friction AI access to all visitors without asking them to enter keys, set <code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded font-mono">VITE_GEMINI_API_KEY</code> in your project's <code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded font-mono">.env</code> file or hosting platform settings.
          </p>
        </div>

        {/* API Key Form */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-mono-hud text-cyan-300 font-bold uppercase">
                Gemini API Key
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] font-mono-hud text-purple-400 hover:text-purple-300 underline flex items-center gap-0.5"
              >
                Get Free Key <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full p-3 bg-slate-950/90 border border-cyan-500/30 rounded-xl text-cyan-100 placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 font-mono-hud text-xs"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className={`flex-1 py-3 rounded-2xl font-display font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer uppercase tracking-wider ${
                saved
                  ? "bg-emerald-600 text-white shadow-emerald-500/30 border border-emerald-400/50"
                  : "bg-linear-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-cyan-500/30 border border-cyan-300/40"
              }`}
            >
              {saved ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-200" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save Credentials</span>
                </>
              )}
            </button>

            {localStorage.getItem("astrovia_gemini_api_key") && (
              <button
                onClick={handleClearKey}
                title="Clear Browser Stored Key"
                className="px-3.5 py-3 rounded-2xl bg-rose-950/50 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
