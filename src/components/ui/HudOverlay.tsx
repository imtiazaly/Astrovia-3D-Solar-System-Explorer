import React from "react";
import { Activity, Radio, Compass, Crosshair } from "lucide-react";
import type { PlanetData, ScaleMode, TimeEngineState } from "../../types/solar";

interface HudOverlayProps {
  selectedPlanet: PlanetData | null;
  scaleMode: ScaleMode;
  timeEngine: TimeEngineState;
}

export const HudOverlay: React.FC<HudOverlayProps> = ({
  selectedPlanet,
  scaleMode,
  timeEngine,
}) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-20 select-none overflow-hidden font-mono-hud text-[10px] text-cyan-500/60">
      {/* Top Left Corner Bracket & Status */}
      <div className="absolute top-16 left-6 hidden md:flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/60 border border-cyan-500/20 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="tracking-widest uppercase font-semibold text-emerald-400/90 text-[9px]">
            SYS_ONLINE
          </span>
        </div>
        <div className="text-slate-400/60 tracking-wider hidden lg:block">
          MISSION: ASTROVIA-3D // HELIOS_OBSERVER
        </div>
      </div>

      {/* Top Right Corner Status */}
      <div className="absolute top-16 right-6 hidden md:flex flex-col items-end gap-1">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-950/60 border border-cyan-500/20 backdrop-blur-md">
          <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
          <span className="tracking-widest uppercase text-cyan-300">
            {timeEngine.isPlaying ? "TIME: STREAMING" : "TIME: PAUSED"}
          </span>
          <span className="text-cyan-500/80">({timeEngine.speed}x)</span>
        </div>
      </div>

      {/* Bottom Left Corner Telemetry & Target Lock */}
      <div className="absolute bottom-6 left-6 hidden md:block">
        <div className="p-2.5 rounded-2xl bg-slate-950/50 border border-cyan-500/20 backdrop-blur-md max-w-xs">
          <div className="flex items-center gap-2 text-cyan-400 font-bold mb-1">
            <Crosshair className="w-3.5 h-3.5 animate-spin-slow" />
            <span className="tracking-wider uppercase">
              {selectedPlanet ? `TARGET: ${selectedPlanet.name}` : "FREE ORBITAL CAMERA"}
            </span>
          </div>
          <div className="space-y-0.5 text-slate-400/80 text-[9px]">
            <div>SCALE_MODE: <span className="text-cyan-300 uppercase">{scaleMode}</span></div>
            <div>TRAJECTORY: <span className="text-cyan-300 uppercase">{timeEngine.isReversed ? "RETROGRADE" : "PROGRADE"}</span></div>
            {selectedPlanet && (
              <div>DISTANCE: <span className="text-cyan-300">{selectedPlanet.distanceFromSunAU} AU</span></div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Right Corner Coordinates */}
      <div className="absolute bottom-6 right-6 hidden lg:flex flex-col items-end gap-1">
        <div className="flex items-center gap-2 text-slate-400/60">
          <Compass className="w-3.5 h-3.5 text-cyan-500/60" />
          <span>RA 18h 36m 56s | DEC +38° 47′</span>
        </div>
        <div className="flex items-center gap-1.5 text-[9px] text-cyan-400/50">
          <Radio className="w-3 h-3" />
          <span>FREQ: 1420.405 MHz [HYDROGEN LINE]</span>
        </div>
      </div>

      {/* Sci-Fi Decorative Corner Brackets */}
      {/* Top Left Bracket */}
      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400/40 pointer-events-none" />
      {/* Top Right Bracket */}
      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400/40 pointer-events-none" />
      {/* Bottom Left Bracket */}
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400/40 pointer-events-none" />
      {/* Bottom Right Bracket */}
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400/40 pointer-events-none" />
    </div>
  );
};
