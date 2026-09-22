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
  SlidersHorizontal,
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-3 sm:px-5 py-2.5 flex items-center justify-between hud-glass border-b border-cyan-500/25 select-none">
      {/* Left: Brand Logo & Mission Badge */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        <div className="relative group cursor-pointer">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 border border-cyan-400/40 transition-transform group-hover:scale-105">
            <Orbit className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-200 animate-spin-slow" />
          </div>
          <span className="absolute -bottom-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
        </div>

        <div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <h1 className="text-xs sm:text-base font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-200 to-white uppercase font-display">
              Astrovia 3D
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 text-[9px] font-mono-hud px-1.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
              <Radio className="w-2.5 h-2.5 text-cyan-400 animate-pulse" />
              LIVE TELEMETRY
            </span>
          </div>
          <p className="hidden xs:block text-[8px] sm:text-[10px] text-cyan-400/70 tracking-widest font-mono-hud uppercase">
            Solar Exploration Console
          </p>
        </div>
      </div>

      {/* Center: Search Bar (Desktop >= lg) */}
      <div className="hidden lg:block px-2">
        <SearchBar onSelectPlanet={onSelectPlanet} />
      </div>

      {/* Desktop Controls (>= lg) */}
      <div className="hidden lg:flex items-center gap-1.5 sm:gap-2">
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
              <div className="text-left">
                <span className="text-[9px] text-slate-400 block uppercase leading-none">Scale</span>
                <span className="text-[11px] text-cyan-300 font-bold capitalize leading-none">
                  {scaleMode}
                </span>
              </div>
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1.5 bg-slate-900/95 border border-cyan-500/40 rounded-xl shadow-xl text-left pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap">
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
              <div className="text-left">
                <span className="text-[9px] text-slate-400 block uppercase leading-none">Orbits</span>
                <span className={`text-[11px] font-bold leading-none ${showOrbits ? "text-cyan-300" : "text-slate-400"}`}>
                  {showOrbits ? "Visible" : "Hidden"}
                </span>
              </div>
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1.5 bg-slate-900/95 border border-cyan-500/40 rounded-xl shadow-xl text-left pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap">
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
              <span className="text-[11px]">Compare</span>
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1.5 bg-slate-900/95 border border-cyan-500/40 rounded-xl shadow-xl text-left pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap">
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
              <span className="text-[11px]">AI Quiz</span>
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1.5 bg-purple-950/95 border border-purple-500/40 rounded-xl shadow-xl text-left pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap">
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
            <div className="absolute top-full right-0 mt-2 px-2.5 py-1.5 bg-slate-900/95 border border-cyan-500/40 rounded-xl shadow-xl text-left pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap">
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
            <div className="absolute top-full right-0 mt-2 px-2.5 py-1.5 bg-slate-900/95 border border-cyan-500/40 rounded-xl shadow-xl text-left pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap">
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
              className="p-2 rounded-xl bg-slate-950/80 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-all active:scale-95 cursor-pointer group"
            >
              <Settings className="w-4 h-4 text-cyan-400 group-hover:rotate-90 transition-transform duration-500" />
            </button>
            <div className="absolute top-full right-0 mt-2 px-2.5 py-1.5 bg-slate-900/95 border border-cyan-500/40 rounded-xl shadow-xl text-left pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap">
              <div className="text-[10px] font-bold text-cyan-300">Settings & API Key</div>
              <div className="text-[9px] text-slate-400">Configure custom Google Gemini API Key</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Compact Controls (< lg) */}
      <div className="flex lg:hidden items-center gap-1.5">
        {/* Mobile Search Toggle */}
        <button
          onClick={() => {
            soundEngine.playClick();
            setMobileSearchOpen(!mobileSearchOpen);
            setMobileMenuOpen(false);
          }}
          className={`p-2 rounded-xl border text-xs transition-all active:scale-95 ${
            mobileSearchOpen
              ? "bg-cyan-500/30 border-cyan-400 text-cyan-200"
              : "bg-slate-950/80 hover:bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
          }`}
          title="Search Planets"
        >
          {mobileSearchOpen ? <X className="w-4 h-4" /> : <SearchIcon className="w-4 h-4" />}
        </button>

        {/* AstroAI Compact Button */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenAiChat();
          }}
          title="Launch AstroAI Chat Assistant"
          className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/30 border border-cyan-300/40 active:scale-95 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-200 animate-pulse" />
          <span className="text-[11px] font-display">AI</span>
        </button>

        {/* Audio Mute Toggle */}
        <button
          onClick={() => {
            onToggleMute();
          }}
          className={`p-2 rounded-xl transition-all active:scale-95 cursor-pointer border ${
            isMuted
              ? "bg-rose-950/40 border-rose-500/30 text-rose-400"
              : "bg-slate-950/80 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20"
          }`}
          title={isMuted ? "Unmute Sound" : "Mute Sound"}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
        </button>

        {/* Mobile Tools Menu Toggle */}
        <button
          onClick={() => {
            soundEngine.playClick();
            setMobileMenuOpen(!mobileMenuOpen);
            setMobileSearchOpen(false);
          }}
          className={`p-2 rounded-xl border text-xs transition-all active:scale-95 ${
            mobileMenuOpen
              ? "bg-cyan-500/30 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.4)]"
              : "bg-slate-950/80 hover:bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
          }`}
          title="Open Console Menu"
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <SlidersHorizontal className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile Search Overlay (< lg) */}
      {mobileSearchOpen && (
        <div className="absolute top-full left-0 right-0 p-3 bg-slate-950/95 border-b border-cyan-500/30 backdrop-blur-2xl lg:hidden animate-in fade-in slide-in-from-top-2 shadow-2xl">
          <SearchBar
            onSelectPlanet={(planet) => {
              onSelectPlanet(planet);
              setMobileSearchOpen(false);
            }}
          />
        </div>
      )}

      {/* Mobile Tools Sheet Panel (< lg) */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 p-4 bg-slate-950/95 border-b border-cyan-500/30 backdrop-blur-2xl lg:hidden animate-in fade-in slide-in-from-top-2 shadow-2xl space-y-3 font-mono-hud">
          <div className="text-[10px] text-cyan-400/80 uppercase tracking-widest font-bold border-b border-cyan-500/20 pb-1.5 flex justify-between items-center">
            <span>Mission Console Tools</span>
            <span className="text-emerald-400 text-[9px]">ONLINE</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Scale Toggle */}
            <button
              onClick={() => {
                soundEngine.playClick();
                onToggleScale();
              }}
              className="p-2.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-left text-xs flex flex-col gap-0.5 active:scale-95"
            >
              <div className="flex items-center gap-1.5 text-cyan-400 text-[10px]">
                <Scale className="w-3.5 h-3.5" />
                <span>SCALE MODE</span>
              </div>
              <span className="font-bold text-cyan-100 capitalize">{scaleMode}</span>
            </button>

            {/* Orbit Lines Toggle */}
            <button
              onClick={() => {
                soundEngine.playClick();
                onToggleOrbits();
              }}
              className={`p-2.5 rounded-xl border text-left text-xs flex flex-col gap-0.5 active:scale-95 ${
                showOrbits
                  ? "bg-cyan-500/20 border-cyan-400 text-cyan-100"
                  : "bg-slate-900/90 border-slate-700/80 text-slate-400"
              }`}
            >
              <div className="flex items-center gap-1.5 text-[10px]">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>ORBIT LINES</span>
              </div>
              <span className="font-bold">{showOrbits ? "Visible" : "Hidden"}</span>
            </button>

            {/* Compare Tool */}
            <button
              onClick={() => {
                soundEngine.playClick();
                setMobileMenuOpen(false);
                onOpenCompare();
              }}
              className="p-2.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-left text-xs flex flex-col gap-0.5 active:scale-95 text-cyan-200"
            >
              <div className="flex items-center gap-1.5 text-cyan-400 text-[10px]">
                <GitCompare className="w-3.5 h-3.5" />
                <span>COMPARE</span>
              </div>
              <span className="font-bold text-cyan-100">Planet VS Planet</span>
            </button>

            {/* AI Space Quiz */}
            <button
              onClick={() => {
                soundEngine.playClick();
                setMobileMenuOpen(false);
                onOpenQuiz();
              }}
              className="p-2.5 rounded-xl bg-purple-950/70 border border-purple-500/40 text-left text-xs flex flex-col gap-0.5 active:scale-95 text-purple-200 shadow-md shadow-purple-500/20"
            >
              <div className="flex items-center gap-1.5 text-purple-300 text-[10px]">
                <HelpCircle className="w-3.5 h-3.5 animate-pulse" />
                <span>AI QUIZ</span>
              </div>
              <span className="font-bold text-purple-100">Trivia Challenge</span>
            </button>
          </div>

          {/* Settings / API Key Button */}
          <button
            onClick={() => {
              soundEngine.playClick();
              setMobileMenuOpen(false);
              onOpenSettings();
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-cyan-500/30 text-xs font-semibold text-cyan-300 flex items-center justify-between active:scale-95"
          >
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-cyan-400" />
              <span>Configure Gemini API Key</span>
            </div>
            <span className="text-[10px] text-slate-400">Settings →</span>
          </button>
        </div>
      )}
    </header>
  );
};
