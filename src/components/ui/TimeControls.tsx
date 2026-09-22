import React from "react";
import { Play, Pause, RotateCcw, Gauge, Compass } from "lucide-react";
import type { TimeEngineState } from "../../types/solar";
import { soundEngine } from "../../services/soundService";

interface TimeControlsProps {
  timeEngine: TimeEngineState;
  onChangeTimeEngine: (
    updater: (prev: TimeEngineState) => TimeEngineState,
  ) => void;
}

export const TimeControls: React.FC<TimeControlsProps> = ({
  timeEngine,
  onChangeTimeEngine,
}) => {
  const speeds = [0.1, 1, 5, 10, 50];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 select-none">
      <div className="hud-glass px-4 sm:px-6 py-2 rounded-full border border-cyan-500/35 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8),0_0_25px_rgba(6,182,212,0.18)] flex items-center gap-3 sm:gap-4 text-cyan-200">
        {/* Play / Pause Toggle Button */}
        <div className="relative group">
          <button
            onClick={() => {
              soundEngine.playClick();
              onChangeTimeEngine((prev) => ({
                ...prev,
                isPlaying: !prev.isPlaying,
              }));
            }}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95 ${
              timeEngine.isPlaying
                ? "bg-linear-to-tr from-cyan-600 to-blue-600 text-white shadow-cyan-500/40 border border-cyan-300/40 animate-pulse-glow"
                : "bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30"
            }`}
          >
            {timeEngine.isPlaying ? (
              <Pause className="w-4 h-4 fill-white" />
            ) : (
              <Play className="w-4 h-4 fill-cyan-300 ml-0.5" />
            )}
          </button>
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-2.5 py-1 bg-slate-900/95 border border-cyan-500/40 rounded-xl shadow-xl text-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap hidden sm:block">
            <div className="text-[10px] font-bold text-cyan-300 font-mono-hud">
              {timeEngine.isPlaying ? "Pause Simulation" : "Resume Simulation"}
            </div>
          </div>
        </div>

        {/* Orbit Direction (Prograde vs Retrograde) */}
        <div className="relative group">
          <button
            onClick={() => {
              soundEngine.playClick();
              onChangeTimeEngine((prev) => ({
                ...prev,
                isReversed: !prev.isReversed,
              }));
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono-hud font-bold transition-all border cursor-pointer active:scale-95 flex items-center gap-1.5 ${
              timeEngine.isReversed
                ? "bg-amber-500/20 text-amber-300 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)] animate-pulse"
                : "bg-slate-900/80 text-slate-300 border-slate-700/80 hover:bg-slate-800 hover:border-cyan-500/30"
            }`}
          >
            <Compass
              className={`w-3.5 h-3.5 ${timeEngine.isReversed ? "text-amber-400 rotate-180" : "text-cyan-400"}`}
            />
            <span className="text-[10px] tracking-wider uppercase">
              {timeEngine.isReversed ? "Retrograde" : "Prograde"}
            </span>
          </button>
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-2.5 py-1 bg-slate-900/95 border border-cyan-500/40 rounded-xl shadow-xl text-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap hidden sm:block">
            <div className="text-[10px] font-bold text-cyan-300 font-mono-hud">
              Orbital Direction
            </div>
            <div className="text-[9px] text-slate-400">
              {timeEngine.isReversed
                ? "Time moving backwards"
                : "Standard forward physics"}
            </div>
          </div>
        </div>

        {/* Speed Selector Pill Dock */}
        <div className="flex items-center gap-1 bg-slate-950/90 p-1 rounded-2xl border border-cyan-500/25">
          <Gauge className="w-3.5 h-3.5 text-cyan-400 ml-1.5 mr-0.5 hidden sm:block" />
          {speeds.map((s) => (
            <button
              key={s}
              onClick={() => {
                soundEngine.playClick();
                onChangeTimeEngine((prev) => ({ ...prev, speed: s }));
              }}
              className={`px-2 sm:px-2.5 py-1 rounded-xl text-[10px] sm:text-[11px] font-mono-hud font-bold transition-all cursor-pointer active:scale-95 ${
                timeEngine.speed === s
                  ? "bg-linear-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.5)] font-extrabold"
                  : "text-slate-400 hover:text-cyan-200 hover:bg-slate-900/60"
              }`}
            >
              {s}x
            </button>
          ))}
        </div>

        {/* Reset Time Engine to Default 1x */}
        <div className="relative group">
          <button
            onClick={() => {
              soundEngine.playClick();
              onChangeTimeEngine(() => ({
                isPlaying: true,
                speed: 1,
                isReversed: false,
              }));
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-cyan-300 hover:bg-slate-900/80 transition-all cursor-pointer active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-3 px-2.5 py-1 bg-slate-900/95 border border-cyan-500/40 rounded-xl shadow-xl text-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap hidden sm:block">
            <div className="text-[10px] font-bold text-cyan-300 font-mono-hud">
              Reset Engine
            </div>
            <div className="text-[9px] text-slate-400">
              Restore normal 1x speed & forward trajectory
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
