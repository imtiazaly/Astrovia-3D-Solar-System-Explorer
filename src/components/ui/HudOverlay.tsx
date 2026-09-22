import React from "react";
import { Activity, Radio, Compass, Crosshair } from "lucide-react";
import type { PlanetData, ScaleMode, TimeEngineState } from "../../types/solar";

interface HudOverlayProps {
  selectedPlanet: PlanetData | null;
  scaleMode: ScaleMode;
  timeEngine: TimeEngineState;
  isSidebarCollapsed?: boolean;
}

export const HudOverlay: React.FC<HudOverlayProps> = ({
  selectedPlanet,
  scaleMode,
  timeEngine,
  isSidebarCollapsed = false,
}) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-20 select-none overflow-hidden font-mono-hud text-[10px] text-cyan-500/60">
      {/* Top Left Telemetry Status (Dynamically shifts with Sidebar collapse) */}
      <div
        className={`absolute top-20 hidden md:flex items-center gap-3 transition-all duration-300 ${
          isSidebarCollapsed ? "left-4 lg:left-24" : "left-4 lg:left-72"
        }`}
      >
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/70 border border-cyan-500/30 backdrop-blur-xl shadow-lg">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="tracking-widest uppercase font-bold text-emerald-400 text-[10px]">
            SYS_ONLINE
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-cyan-300 font-semibold tracking-wider text-[10px]">
            HELIOS_OBSERVER
          </span>
        </div>
      </div>

      {/* Top Right Simulation Stream Status (Below Navbar) */}
      <div className="absolute top-20 right-4 sm:right-6 hidden md:flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/70 border border-cyan-500/30 backdrop-blur-xl shadow-lg">
          <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="tracking-widest uppercase text-cyan-300 font-bold text-[10px]">
            {timeEngine.isPlaying
              ? "SIMULATION: STREAMING"
              : "SIMULATION: PAUSED"}
          </span>
          <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/40 text-[9px] font-bold">
            {timeEngine.speed}x
          </span>
        </div>
      </div>

      {/* Bottom Left Telemetry & Target Lock (Dynamically shifts with Sidebar collapse) */}
      <div
        className={`absolute bottom-6 hidden md:block transition-all duration-300 ${
          isSidebarCollapsed ? "left-4 lg:left-24" : "left-4 lg:left-72"
        }`}
      >
        <div className="p-3 rounded-2xl bg-slate-950/70 border border-cyan-500/30 backdrop-blur-xl max-w-xs shadow-xl">
          <div className="flex items-center gap-2 text-cyan-300 font-bold mb-1.5">
            <Crosshair className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
            <span className="tracking-wider uppercase text-[11px] font-display">
              {selectedPlanet
                ? `TARGET: ${selectedPlanet.name}`
                : "FREE ORBITAL CAMERA"}
            </span>
          </div>
          <div className="space-y-0.5 text-slate-300/80 text-[9px]">
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">SCALE:</span>
              <span className="text-cyan-300 uppercase font-semibold">
                {scaleMode}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">TRAJECTORY:</span>
              <span className="text-cyan-300 uppercase font-semibold">
                {timeEngine.isReversed ? "RETROGRADE" : "PROGRADE"}
              </span>
            </div>
            {selectedPlanet && (
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">DISTANCE:</span>
                <span className="text-cyan-300 font-semibold">
                  {selectedPlanet.distanceFromSunAU} AU
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Right Celestial Coordinates & Radio Freq */}
      <div className="absolute bottom-6 right-4 sm:right-6 hidden lg:flex flex-col items-end gap-1.5">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-950/60 border border-cyan-500/20 backdrop-blur-md text-slate-300">
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          <span>RA 18h 36m 56s | DEC +38° 47′</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/60 border border-cyan-500/20 backdrop-blur-md text-[9px] text-cyan-400/70">
          <Radio className="w-3 h-3 text-cyan-400" />
          <span>FREQ: 1420.405 MHz [HYDROGEN LINE]</span>
        </div>
      </div>

      {/* Sci-Fi Decorative Viewport Framing Brackets (Positioned below Navbar) */}
      {/* Top Left Bracket */}
      <div className="absolute top-[58px] sm:top-[68px] left-2 sm:left-3 w-4 sm:w-5 h-4 sm:h-5 border-t-2 border-l-2 border-cyan-400/50 pointer-events-none" />
      {/* Top Right Bracket */}
      <div className="absolute top-[58px] sm:top-[68px] right-2 sm:right-3 w-4 sm:w-5 h-4 sm:h-5 border-t-2 border-r-2 border-cyan-400/50 pointer-events-none" />
      {/* Bottom Left Bracket */}
      <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 w-4 sm:w-5 h-4 sm:h-5 border-b-2 border-l-2 border-cyan-400/50 pointer-events-none" />
      {/* Bottom Right Bracket */}
      <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 w-4 sm:w-5 h-4 sm:h-5 border-b-2 border-r-2 border-cyan-400/50 pointer-events-none" />
    </div>
  );
};
