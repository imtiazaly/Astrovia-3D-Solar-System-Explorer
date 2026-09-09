import React from "react";
import { Play, Pause, FastForward, RotateCcw } from "lucide-react";
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
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 px-5 py-2.5 bg-slate-950/80 backdrop-blur-xl border border-cyan-500/30 rounded-full shadow-2xl flex items-center gap-4 text-cyan-200">
      {/* Play / Pause Toggle */}
      <button
        onClick={() => {
          soundEngine.playClick();
          onChangeTimeEngine((prev) => ({
            ...prev,
            isPlaying: !prev.isPlaying,
          }));
        }}
        className="p-2.5 rounded-full bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 border border-cyan-400/40 transition-all shadow-md shadow-cyan-500/20"
      >
        {timeEngine.isPlaying ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4 fill-cyan-300 ml-0.5" />
        )}
      </button>

      {/* Reverse Toggle */}
      <button
        onClick={() => {
          soundEngine.playClick();
          onChangeTimeEngine((prev) => ({
            ...prev,
            isReversed: !prev.isReversed,
          }));
        }}
        title="Toggle Reverse Orbital Direction"
        className={`px-3 py-1 rounded-full text-xs font-mono font-semibold transition-all border ${
          timeEngine.isReversed
            ? "bg-amber-500/20 text-amber-300 border-amber-400"
            : "bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800"
        }`}
      >
        REV
      </button>

      {/* Speed Selector */}
      <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-full border border-slate-800">
        <FastForward className="w-3.5 h-3.5 text-cyan-400 ml-1.5 mr-0.5" />
        {speeds.map((s) => (
          <button
            key={s}
            onClick={() => {
              soundEngine.playClick();
              onChangeTimeEngine((prev) => ({ ...prev, speed: s }));
            }}
            className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-bold transition-all ${
              timeEngine.speed === s
                ? "bg-cyan-500 text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-cyan-200"
            }`}
          >
            {s}x
          </button>
        ))}
      </div>

      {/* Reset Speed Button */}
      <button
        onClick={() => {
          soundEngine.playClick();
          onChangeTimeEngine(() => ({
            isPlaying: true,
            speed: 1,
            isReversed: false,
          }));
        }}
        title="Reset Time Engine to Normal (1x)"
        className="p-2 text-slate-400 hover:text-cyan-300 transition-colors"
      >
        <RotateCcw className="w-4 h-4" />
      </button>
    </div>
  );
};
