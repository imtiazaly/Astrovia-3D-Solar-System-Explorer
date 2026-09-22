import React, { useState } from "react";
import {
  Orbit,
  Volume2,
  VolumeX,
  Sparkles,
  HelpCircle,
  Layers,
  Settings,
  Scale,
  Search as SearchIcon,
  X,
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
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-3 sm:px-6 py-2.5 flex items-center justify-between hud-glass border-b border-cyan-500/25">
      {/* Brand Logo & Telemetry Indicator */}
      <div className="flex items-center gap-3">
        <div className="relative group cursor-pointer">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 border border-cyan-400/40 transition-transform group-hover:scale-105">
            <Orbit className="w-5 h-5 text-cyan-200 animate-spin-slow" />
          </div>
          <span className="absolute -bottom-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
          </span>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-200 to-white uppercase font-display">
              Astrovia 3D
            </h1>
            <span className="hidden sm:inline-block text-[9px] font-mono-hud px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">
              v2.0 HUD
            </span>
          </div>
          <p className="text-[9px] sm:text-[10px] text-cyan-400/70 tracking-widest font-mono-hud uppercase">
            Solar Exploration Console
          </p>
        </div>
      </div>

      {/* Center Search Bar (Desktop) */}
      <div className="hidden md:block">
        <SearchBar onSelectPlanet={onSelectPlanet} />
      </div>

      {/* Right Controls Dock */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Mobile Search Toggle */}
        <button
          onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
          className="md:hidden p-2 rounded-xl bg-slate-900/80 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs transition-all active:scale-95"
          title="Search Planets"
        >
          {mobileSearchOpen ? <X className="w-4 h-4" /> : <SearchIcon className="w-4 h-4" />}
        </button>

        {/* Scale Toggle */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onToggleScale();
          }}
          title={`Switch Scale Mode: Currently ${scaleMode}`}
          className="px-2.5 py-1.5 rounded-xl bg-slate-950/70 hover:bg-cyan-500/20 text-cyan-200 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer font-mono-hud"
        >
          <Scale className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden xl:inline text-[11px] capitalize">{scaleMode}</span>
          <span className="xl:hidden text-[10px] uppercase font-bold text-cyan-300">
            {scaleMode === "exploratory" ? "EXP" : "REAL"}
          </span>
        </button>

        {/* Orbit Lines Toggle */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onToggleOrbits();
          }}
          title={showOrbits ? "Hide Orbit Trajectories" : "Show Orbit Trajectories"}
          className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer ${
            showOrbits
              ? "bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              : "bg-slate-950/70 text-slate-400 border-slate-800 hover:bg-slate-800/80"
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
          title="Celestial Side-by-Side Comparison"
          className="px-2.5 py-1.5 rounded-xl bg-slate-950/70 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center gap-1 transition-all shadow-md active:scale-95 cursor-pointer font-mono-hud"
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
          className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-800/40 text-purple-200 border border-purple-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-purple-500/20 active:scale-95 cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-purple-300" />
          <span className="hidden lg:inline text-[11px]">Quiz</span>
        </button>

        {/* AstroAI Chat Assistant Launcher */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenAiChat();
          }}
          title="Launch AstroAI Chat Assistant"
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/30 border border-cyan-300/40 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-200 animate-pulse" />
          <span className="hidden sm:inline font-display tracking-wider">AstroAI</span>
        </button>

        {/* Audio Mute Toggle */}
        <button
          onClick={() => {
            onToggleMute();
          }}
          title={isMuted ? "Unmute Sound Effects" : "Mute Sound Effects"}
          className="p-2 rounded-xl bg-slate-950/70 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-all active:scale-95 cursor-pointer"
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-rose-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />
          )}
        </button>

        {/* Settings Button */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenSettings();
          }}
          title="Settings & Gemini API Key"
          className="p-2 rounded-xl bg-slate-950/70 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-all active:scale-95 cursor-pointer group"
        >
          <Settings className="w-4 h-4 text-cyan-400 group-hover:rotate-45 transition-transform duration-300" />
        </button>
      </div>

      {/* Mobile Search Bar Dropdown */}
      {mobileSearchOpen && (
        <div className="absolute top-full left-0 right-0 p-3 bg-slate-950/95 border-b border-cyan-500/30 md:hidden animate-in fade-in slide-in-from-top-2">
          <SearchBar
            onSelectPlanet={(planet) => {
              onSelectPlanet(planet);
              setMobileSearchOpen(false);
            }}
          />
        </div>
      )}
    </header>
  );
};
