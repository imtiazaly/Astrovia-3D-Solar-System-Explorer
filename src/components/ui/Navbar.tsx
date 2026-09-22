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
  GitCompare,
  Search as SearchIcon,
  X,
  Radio,
  Sliders,
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
    <header className="fixed top-0 left-0 right-0 z-40 px-3 sm:px-5 py-2.5 flex items-center justify-between hud-glass border-b border-cyan-500/25 select-none">
      {/* Left: Brand Logo & Mission Badge */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="relative group cursor-pointer">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 border border-cyan-400/40 transition-transform group-hover:scale-105">
            <Orbit className="w-5 h-5 text-cyan-200 animate-spin-slow" />
          </div>
          <span className="absolute -bottom-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-200 to-white uppercase font-display">
              Astrovia 3D
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 text-[9px] font-mono-hud px-1.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
              <Radio className="w-2.5 h-2.5 text-cyan-400 animate-pulse" />
              LIVE TELEMETRY
            </span>
          </div>
          <p className="text-[9px] sm:text-[10px] text-cyan-400/70 tracking-widest font-mono-hud uppercase">
            3D Solar System Mission Console
          </p>
        </div>
      </div>

      {/* Center: Search Bar (Desktop) */}
      <div className="hidden lg:block px-2">
        <SearchBar onSelectPlanet={onSelectPlanet} />
      </div>

      {/* Right: Explicitly Labeled Action Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Mobile Search Toggle */}
        <button
          onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
          className="lg:hidden p-2 rounded-xl bg-slate-900/80 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs transition-all active:scale-95"
          title="Search Planets"
        >
          {mobileSearchOpen ? <X className="w-4 h-4" /> : <SearchIcon className="w-4 h-4" />}
        </button>

        {/* Control Group 1: Physics & Viewport */}
        <div className="flex items-center bg-slate-950/80 p-1 rounded-2xl border border-cyan-500/20 backdrop-blur-md">
          {/* Scale Mode Switcher */}
          <div className="relative group">
            <button
              onClick={() => {
                soundEngine.playClick();
                onToggleScale();
              }}
              className="px-2.5 py-1.5 rounded-xl hover:bg-cyan-500/20 text-cyan-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer font-mono-hud"
            >
              <Scale className="w-3.5 h-3.5 text-cyan-400" />
              <div className="text-left hidden md:block">
                <span className="text-[9px] text-slate-400 block uppercase leading-none">Scale</span>
                <span className="text-[11px] text-cyan-300 font-bold capitalize leading-none">
                  {scaleMode}
                </span>
              </div>
            </button>
            {/* Interactive Tooltip Card */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1.5 bg-slate-900/95 border border-cyan-500/40 rounded-xl shadow-xl text-left pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap hidden sm:block">
              <div className="text-[10px] font-bold text-cyan-300">Planet Scale Mode</div>
              <div className="text-[9px] text-slate-400">Click to switch Exploratory vs Realistic physics</div>
            </div>
          </div>

          {/* Orbit Lines Toggle */}
          <div className="relative group">
            <button
              onClick={() => {
                soundEngine.playClick();
                onToggleOrbits();
              }}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer font-mono-hud ${
                showOrbits
                  ? "bg-cyan-500/25 text-cyan-200 border border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                  : "text-slate-400 hover:bg-slate-900"
              }`}
            >
              <Layers className={`w-3.5 h-3.5 ${showOrbits ? "text-cyan-300" : "text-slate-500"}`} />
              <div className="text-left hidden md:block">
                <span className="text-[9px] text-slate-400 block uppercase leading-none">Orbits</span>
                <span className={`text-[11px] font-bold leading-none ${showOrbits ? "text-cyan-300" : "text-slate-400"}`}>
                  {showOrbits ? "Visible" : "Hidden"}
                </span>
              </div>
            </button>
            {/* Interactive Tooltip Card */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1.5 bg-slate-900/95 border border-cyan-500/40 rounded-xl shadow-xl text-left pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap hidden sm:block">
              <div className="text-[10px] font-bold text-cyan-300">Orbit Lines Path</div>
              <div className="text-[9px] text-slate-400">Toggle Keplerian orbital trajectories on/off</div>
            </div>
          </div>
        </div>

        {/* Control Group 2: Scientific Analysis & Tools */}
        <div className="flex items-center gap-1.5">
          {/* Compare Planets Tool */}
          <div className="relative group">
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenCompare();
              }}
              className="px-2.5 py-1.5 rounded-xl bg-slate-950/80 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer font-mono-hud"
            >
              <GitCompare className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline text-[11px]">Compare</span>
            </button>
            {/* Tooltip */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1.5 bg-slate-900/95 border border-cyan-500/40 rounded-xl shadow-xl text-left pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap hidden sm:block">
              <div className="text-[10px] font-bold text-cyan-300">Compare Planets</div>
              <div className="text-[9px] text-slate-400">Side-by-side comparison of mass, radius, and gravity</div>
            </div>
          </div>

          {/* AI Space Quiz */}
          <div className="relative group">
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenQuiz();
              }}
              className="px-2.5 py-1.5 rounded-xl bg-purple-950/70 hover:bg-purple-900/60 text-purple-200 border border-purple-500/50 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-purple-500/25 active:scale-95 cursor-pointer font-mono-hud"
            >
              <HelpCircle className="w-3.5 h-3.5 text-purple-300 animate-pulse" />
              <span className="hidden sm:inline text-[11px]">AI Quiz</span>
            </button>
            {/* Tooltip */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1.5 bg-purple-950/95 border border-purple-500/40 rounded-xl shadow-xl text-left pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap hidden sm:block">
              <div className="text-[10px] font-bold text-purple-300">Gemini Space Quiz</div>
              <div className="text-[9px] text-slate-300">Dynamic AI-generated trivia challenge for planets</div>
            </div>
          </div>

          {/* AstroAI Chat Guide Launcher */}
          <div className="relative group">
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenAiChat();
              }}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/30 border border-cyan-300/40 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-200 animate-pulse" />
              <span className="font-display tracking-wider">AstroAI</span>
            </button>
            {/* Tooltip */}
            <div className="absolute top-full right-0 mt-2 px-2.5 py-1.5 bg-slate-900/95 border border-cyan-500/40 rounded-xl shadow-xl text-left pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap hidden sm:block">
              <div className="text-[10px] font-bold text-cyan-300">AstroAI Assistant</div>
              <div className="text-[9px] text-slate-400">Live Gemini-powered astronomy Q&A guide</div>
            </div>
          </div>
        </div>

        {/* Control Group 3: Audio & Settings */}
        <div className="flex items-center gap-1 border-l border-cyan-500/20 pl-2">
          {/* Audio Mute Toggle */}
          <div className="relative group">
            <button
              onClick={() => {
                onToggleMute();
              }}
              className={`p-2 rounded-xl transition-all active:scale-95 cursor-pointer border ${
                isMuted
                  ? "bg-rose-950/40 border-rose-500/30 text-rose-400"
                  : "bg-slate-950/80 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20"
              }`}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />
              )}
            </button>
            {/* Tooltip */}
            <div className="absolute top-full right-0 mt-2 px-2.5 py-1.5 bg-slate-900/95 border border-cyan-500/40 rounded-xl shadow-xl text-left pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap hidden sm:block">
              <div className="text-[10px] font-bold text-cyan-300">
                {isMuted ? "Sound: Muted" : "Sound: Active"}
              </div>
              <div className="text-[9px] text-slate-400">Toggle space sound effects and audio clicks</div>
            </div>
          </div>

          {/* Settings Button */}
          <div className="relative group">
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenSettings();
              }}
              className="p-2 rounded-xl bg-slate-950/80 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-all active:scale-95 cursor-pointer"
            >
              <Settings className="w-4 h-4 text-cyan-400 group-hover:rotate-90 transition-transform duration-500" />
            </button>
            {/* Tooltip */}
            <div className="absolute top-full right-0 mt-2 px-2.5 py-1.5 bg-slate-900/95 border border-cyan-500/40 rounded-xl shadow-xl text-left pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap hidden sm:block">
              <div className="text-[10px] font-bold text-cyan-300">Settings & API Key</div>
              <div className="text-[9px] text-slate-400">Configure custom Google Gemini API Key</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar Dropdown */}
      {mobileSearchOpen && (
        <div className="absolute top-full left-0 right-0 p-3 bg-slate-950/95 border-b border-cyan-500/30 lg:hidden animate-in fade-in slide-in-from-top-2">
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
