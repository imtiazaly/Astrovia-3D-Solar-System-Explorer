import React from "react";
import {
  Orbit,
  Volume2,
  VolumeX,
  Sparkles,
  HelpCircle,
  Layers,
  Settings,
  Scale,
} from "lucide-react";
import type { PlanetData, ScaleMode } from "../../types/solar";
import { SearchBar } from "./SearchBar";
import { soundEngine } from "../../services/soundService";

interface NavbarProps {
  onSelectPlanet: (planet: PlanetData) => void;
  scaleMode: ScaleMode;
  onToggleScale: () => void;
  showOrbits: boolean;
  onToggleOrbits: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenAiChat: () => void;
  onOpenQuiz: () => void;
  onOpenCompare: () => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSelectPlanet,
  scaleMode,
  onToggleScale,
  showOrbits,
  onToggleOrbits,
  isMuted,
  onToggleMute,
  onOpenAiChat,
  onOpenQuiz,
  onOpenCompare,
  onOpenSettings,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 py-3 flex items-center justify-between bg-slate-950/60 backdrop-blur-xl border-b border-cyan-500/20">
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 border border-cyan-400/30">
          <Orbit className="w-5 h-5 text-cyan-200 animate-spin-slow" />
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-widest text-transparent bg-clip-text bg-linear-to-r from-cyan-300 via-blue-200 to-white uppercase font-mono">
            Astrovia 3D
          </h1>
          <p className="text-[10px] text-cyan-400/70 tracking-wider">
            SOLAR SYSTEM EXPLORER
          </p>
        </div>
      </div>

      {/* Center Search Bar */}
      <div className="hidden md:block">
        <SearchBar onSelectPlanet={onSelectPlanet} />
      </div>

      {/* Right Controls Dock */}
      <div className="flex items-center gap-2">
        {/* Scale Toggle */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onToggleScale();
          }}
          title={`Switch Scale Mode: Currently ${scaleMode}`}
          className="p-2 rounded-xl bg-slate-900/80 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md"
        >
          <Scale className="w-4 h-4 text-cyan-400" />
          <span className="hidden lg:inline capitalize">{scaleMode}</span>
        </button>

        {/* Orbit Lines Toggle */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onToggleOrbits();
          }}
          title="Toggle Orbit Lines"
          className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md ${
            showOrbits
              ? "bg-cyan-500/20 text-cyan-300 border-cyan-400"
              : "bg-slate-900/80 text-slate-400 border-slate-800 hover:bg-slate-800"
          }`}
        >
          <Layers className="w-4 h-4" />
        </button>

        {/* Compare Tool */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenCompare();
          }}
          title="Compare Planets"
          className="px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md"
        >
          <span>VS</span>
        </button>

        {/* AI Space Quiz Button */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenQuiz();
          }}
          title="AI Space Trivia Quiz"
          className="p-2 rounded-xl bg-purple-950/60 hover:bg-purple-800/40 text-purple-300 border border-purple-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-purple-500/20"
        >
          <HelpCircle className="w-4 h-4 text-purple-300" />
          <span className="hidden sm:inline">Quiz</span>
        </button>

        {/* AstroAI Chat Assistant Launcher */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenAiChat();
          }}
          className="px-3 py-2 rounded-xl bg-linear-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/30 border border-cyan-300/30 transition-all transform hover:scale-105"
        >
          <Sparkles className="w-4 h-4 text-cyan-200 animate-pulse" />
          <span className="hidden sm:inline">AstroAI</span>
        </button>

        {/* Audio Mute Toggle */}
        <button
          onClick={() => {
            onToggleMute();
          }}
          title="Toggle Sound Effects"
          className="p-2 rounded-xl bg-slate-900/80 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-all"
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-red-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-cyan-400" />
          )}
        </button>

        {/* Settings Button */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenSettings();
          }}
          title="Settings & Gemini API Key"
          className="p-2 rounded-xl bg-slate-900/80 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-all"
        >
          <Settings className="w-4 h-4 text-cyan-400" />
        </button>
      </div>
    </header>
  );
};
