import React from "react";
import {
  X,
  Cpu,
  Globe,
  CheckCircle2,
  Server,
  Zap,
} from "lucide-react";
import { soundEngine } from "../../services/soundService";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

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
          <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-purple-600 via-indigo-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 border border-cyan-400/40">
            <Cpu className="w-5 h-5 text-cyan-200 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-extrabold font-display tracking-wider text-slate-100">
                System Configuration
              </h3>
              <span className="text-[9px] font-mono-hud px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/40">
                AI-HUB WORKER
              </span>
            </div>
            <p className="text-[10px] text-cyan-400/70 font-mono-hud uppercase">
              Cloudflare Workers AI Architecture
            </p>
          </div>
        </div>

        {/* Active Status Badge */}
        <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl mb-5 font-mono-hud text-xs flex items-center justify-between text-emerald-300">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold">Cloudflare Worker AI Hub Active</span>
          </div>
          <span className="text-[10px] uppercase opacity-80 font-bold">
            ONLINE
          </span>
        </div>

        {/* Architecture Details Cards */}
        <div className="space-y-3 font-sans text-xs">
          <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-cyan-500/25 space-y-2">
            <div className="flex items-center gap-2 text-cyan-300 font-mono-hud font-bold text-[11px]">
              <Server className="w-3.5 h-3.5 text-cyan-400" />
              <span>Production Worker Endpoint</span>
            </div>
            <p className="text-[11px] font-mono bg-slate-900/90 p-2 rounded-xl border border-cyan-500/20 text-cyan-200 break-all select-all">
              https://ai-hub.imtiyazalye.workers.dev/api/chat
            </p>
          </div>

          <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-purple-500/25 space-y-2">
            <div className="flex items-center gap-2 text-purple-300 font-mono-hud font-bold text-[11px]">
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              <span>AI LLM Engine</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Powered by{" "}
              <strong className="text-purple-300 font-mono">
                @cf/meta/llama-3.2-3b-instruct
              </strong>{" "}
              on Cloudflare Workers AI infrastructure.
            </p>
          </div>

          <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-emerald-500/25 space-y-2">
            <div className="flex items-center gap-2 text-emerald-300 font-mono-hud font-bold text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero Configuration Needed</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Visitors do not need to configure API keys. Requests are routed
              securely from Astrovia directly through the AI-Hub Cloudflare
              Worker.
            </p>
          </div>

          <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-amber-500/25 space-y-2">
            <div className="flex items-center gap-2 text-amber-300 font-mono-hud font-bold text-[11px]">
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>Allowed Production Origin</span>
            </div>
            <p className="text-[11px] font-mono bg-slate-900/90 p-2 rounded-xl border border-amber-500/20 text-amber-200">
              https://imtiazaly.github.io
            </p>
          </div>
        </div>

        {/* Footer Action */}
        <div className="mt-5">
          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="w-full py-3 rounded-2xl font-display font-bold text-xs bg-linear-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white shadow-lg shadow-purple-500/25 border border-purple-400/40 cursor-pointer uppercase tracking-wider"
          >
            Close Settings
          </button>
        </div>
      </div>
    </div>
  );
};
