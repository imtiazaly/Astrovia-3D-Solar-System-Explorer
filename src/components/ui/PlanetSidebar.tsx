import React from "react";
import { Compass, RotateCcw } from "lucide-react";
import type { PlanetData } from "../../types/solar";
import { ALL_CELESTIAL_BODIES } from "../../data/planetsData";
import { soundEngine } from "../../services/soundService";

interface PlanetSidebarProps {
  selectedPlanet: PlanetData | null;
  onSelectPlanet: (planet: PlanetData | null) => void;
}

export const PlanetSidebar: React.FC<PlanetSidebarProps> = ({
  selectedPlanet,
  onSelectPlanet,
}) => {
  return (
    <aside className="fixed left-4 top-20 bottom-24 z-30 w-52 hidden lg:flex flex-col bg-slate-950/60 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-3 overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between px-2 py-1.5 mb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold tracking-wider uppercase font-mono">
          <Compass className="w-4 h-4 text-cyan-400" />
          Celestial Body
        </div>
        {selectedPlanet && (
          <button
            onClick={() => {
              soundEngine.playClick();
              onSelectPlanet(null);
            }}
            title="Reset Overview Camera"
            className="p-1 text-slate-400 hover:text-cyan-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
        {ALL_CELESTIAL_BODIES.map((planet) => {
          const isSelected = selectedPlanet?.id === planet.id;
          return (
            <button
              key={planet.id}
              onClick={() => {
                soundEngine.playFlyTo();
                onSelectPlanet(planet);
              }}
              className={`w-full px-3 py-2 rounded-2xl flex items-center justify-between text-left text-xs transition-all border ${
                isSelected
                  ? "bg-cyan-500/20 border-cyan-400 text-cyan-100 shadow-md shadow-cyan-500/10"
                  : "bg-slate-900/40 border-transparent hover:bg-slate-800/60 text-slate-300"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="w-2.5 h-2.5 rounded-full shadow-sm"
                  style={{ backgroundColor: planet.color }}
                />
                <span className="font-semibold">{planet.name}</span>
              </div>
              <span className="text-[10px] text-slate-400 capitalize">
                {planet.type === "star"
                  ? "Star"
                  : `${planet.distanceFromSunAU} AU`}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
