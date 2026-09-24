import React, { useState } from "react";
import { Compass, RotateCcw, ChevronLeft, ChevronRight, Target, Sparkles, X } from "lucide-react";
import type { PlanetData } from "../../types/solar";
import { ALL_CELESTIAL_BODIES } from "../../data/planetsData";
import { soundEngine } from "../../services/soundService";

interface PlanetSidebarProps {
  selectedPlanet: PlanetData | null;
  onSelectPlanet: (planet: PlanetData | null) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const PlanetSidebar: React.FC<PlanetSidebarProps> = ({
  selectedPlanet,
  onSelectPlanet,
  isCollapsed: externalIsCollapsed,
  onToggleCollapse,
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const isCollapsed = externalIsCollapsed !== undefined ? externalIsCollapsed : internalCollapsed;

  const toggleCollapse = () => {
    soundEngine.playClick();
    if (onToggleCollapse) {
      onToggleCollapse();
    } else {
      setInternalCollapsed(!internalCollapsed);
    }
  };

  const handleSelectOnMobile = (planet: PlanetData) => {
    soundEngine.playFlyTo();
    onSelectPlanet(planet);
    setMobileDrawerOpen(false);
  };

  return (
    <>
      {/* Mobile Floating Trigger Button (< lg) */}
      <div className="fixed left-3 top-20 z-30 lg:hidden">
        <button
          onClick={() => {
            soundEngine.playClick();
            setMobileDrawerOpen(true);
          }}
          className="px-3 py-2 rounded-2xl hud-glass text-cyan-300 border border-cyan-500/35 shadow-xl shadow-black/60 hover:border-cyan-400 transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer font-mono-hud text-xs"
          title="Open Celestial Directory"
        >
          <Compass className="w-4 h-4 text-cyan-400 animate-spin-slow" />
          <span className="text-[10px] font-bold text-cyan-200">BODIES</span>
        </button>
      </div>

      {/* Mobile Off-Canvas Drawer & Backdrop (< lg) */}
      {mobileDrawerOpen && (
        <>
          <div
            onClick={() => setMobileDrawerOpen(false)}
            className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-md lg:hidden animate-in fade-in duration-200"
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-72 sm:w-80 hud-glass border-r border-cyan-500/35 p-4 flex flex-col shadow-2xl lg:hidden animate-in slide-in-from-left duration-300 select-none">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-cyan-500/25">
              <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold tracking-wider uppercase font-mono-hud">
                <Compass className="w-4 h-4 text-cyan-400 animate-spin-slow" />
                <span>Solar System Directory</span>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 text-slate-400 hover:text-cyan-300 rounded-xl hover:bg-slate-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Overview reset camera button on mobile */}
            {selectedPlanet && (
              <button
                onClick={() => {
                  soundEngine.playClick();
                  onSelectPlanet(null);
                  setMobileDrawerOpen(false);
                }}
                className="mb-3 w-full py-2 px-3 rounded-xl bg-cyan-950/70 hover:bg-cyan-900 text-xs text-cyan-300 border border-cyan-500/35 font-mono-hud flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                <span>Reset to Helios Overview</span>
              </button>
            )}

            {/* Planet list */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
              {ALL_CELESTIAL_BODIES.map((planet) => {
                const isSelected = selectedPlanet?.id === planet.id;
                return (
                  <button
                    key={planet.id}
                    onClick={() => handleSelectOnMobile(planet)}
                    className={`w-full px-3 py-2.5 rounded-2xl flex items-center justify-between text-left text-xs transition-all border cursor-pointer active:scale-98 ${
                      isSelected
                        ? "bg-linear-to-r from-cyan-950/90 to-blue-950/80 border-cyan-400 text-cyan-100 shadow-md shadow-cyan-500/20"
                        : "bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/80 text-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-3.5 h-3.5 rounded-full shadow-md"
                        style={{
                          backgroundColor: planet.color,
                          boxShadow: `0 0 10px ${planet.color}`,
                        }}
                      />
                      <div>
                        <div className="font-bold font-display text-[13px] text-slate-100 flex items-center gap-1.5">
                          <span>{planet.name}</span>
                          {isSelected && (
                            <span className="text-[8px] font-mono-hud px-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                              LOCKED
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono-hud capitalize">
                          {planet.type}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] text-cyan-400/80 font-mono-hud font-semibold">
                        {planet.type === "star"
                          ? "Origin"
                          : `${planet.distanceFromSunAU} AU`}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="pt-2 mt-2 border-t border-cyan-500/20 flex items-center justify-between text-[9px] font-mono-hud text-slate-400/70">
              <span>{ALL_CELESTIAL_BODIES.length} CELESTIAL BODIES</span>
              <span className="text-cyan-400/80 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> 3D ORBITAL
              </span>
            </div>
          </aside>
        </>
      )}

      {/* Desktop Main Celestial Sidebar Drawer (>= lg) */}
      <aside
        className={`fixed left-4 top-20 bottom-24 z-30 transition-all duration-300 select-none flex-col hud-glass rounded-3xl p-3.5 shadow-2xl border border-cyan-500/30 hidden lg:flex ${
          isCollapsed ? "w-16 items-center" : "w-64"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-cyan-500/20 w-full">
          {!isCollapsed && (
            <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold tracking-wider uppercase font-mono-hud">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Celestial Objects</span>
            </div>
          )}

          <div className="flex items-center gap-1 ml-auto">
            {/* Reset Overview Camera Button */}
            {selectedPlanet && !isCollapsed && (
              <button
                onClick={() => {
                  soundEngine.playClick();
                  onSelectPlanet(null);
                }}
                title="Reset Camera to Helios Overview"
                className="px-2 py-1 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 text-[10px] text-cyan-300 border border-cyan-500/30 font-mono-hud flex items-center gap-1 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3 h-3 text-cyan-400" />
                <span>Overview</span>
              </button>
            )}

            {/* Collapse / Expand Toggle Button */}
            <button
              onClick={toggleCollapse}
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              className="p-1 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800/60 transition-colors cursor-pointer"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 text-cyan-400" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Planet List */}
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar w-full">
          {ALL_CELESTIAL_BODIES.map((planet) => {
            const isSelected = selectedPlanet?.id === planet.id;

            if (isCollapsed) {
              return (
                <button
                  key={planet.id}
                  onClick={() => {
                    soundEngine.playFlyTo();
                    onSelectPlanet(planet);
                  }}
                  title={`${planet.name} (${planet.type})`}
                  className={`w-10 h-10 mx-auto rounded-2xl flex items-center justify-center transition-all cursor-pointer border ${
                    isSelected
                      ? "bg-cyan-500/30 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)] scale-110"
                      : "bg-slate-900/60 border-slate-800/80 hover:border-cyan-500/40 hover:scale-105"
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full transition-transform"
                    style={{
                      backgroundColor: planet.color,
                      boxShadow: `0 0 8px ${planet.color}`,
                    }}
                  />
                </button>
              );
            }

            return (
              <button
                key={planet.id}
                onClick={() => {
                  soundEngine.playFlyTo();
                  onSelectPlanet(planet);
                }}
                className={`w-full px-3 py-2 rounded-2xl flex items-center justify-between text-left text-xs transition-all border group cursor-pointer ${
                  isSelected
                    ? "bg-linear-to-r from-cyan-950/80 to-blue-950/60 border-cyan-400 text-cyan-100 shadow-lg shadow-cyan-500/15"
                    : "bg-slate-900/40 border-slate-800/50 hover:bg-slate-800/60 hover:border-cyan-500/30 text-slate-300"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="relative flex items-center justify-center">
                    <span
                      className="w-3 h-3 rounded-full shadow-sm transition-transform group-hover:scale-125"
                      style={{
                        backgroundColor: planet.color,
                        boxShadow: isSelected
                          ? `0 0 12px ${planet.color}`
                          : `0 0 6px ${planet.color}80`,
                      }}
                    />
                    {isSelected && (
                      <span className="absolute -inset-1 rounded-full border border-cyan-400 animate-ping opacity-75" />
                    )}
                  </div>
                  <div>
                    <div className="font-bold font-display text-[13px] tracking-wide group-hover:text-cyan-200 transition-colors flex items-center gap-1.5">
                      <span>{planet.name}</span>
                      {isSelected && (
                        <span className="text-[8px] font-mono-hud px-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                          LOCKED
                        </span>
                      )}
                    </div>
                    <div className="text-[9px] text-slate-400 font-mono-hud capitalize">
                      {planet.type}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-cyan-400/80 font-mono-hud font-semibold">
                    {planet.type === "star"
                      ? "Origin"
                      : `${planet.distanceFromSunAU} AU`}
                  </div>
                  {isSelected && (
                    <Target className="w-3 h-3 text-cyan-400 ml-auto animate-pulse" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Sub-indicator */}
        {!isCollapsed && (
          <div className="pt-2 mt-2 border-t border-cyan-500/20 flex items-center justify-between text-[9px] font-mono-hud text-slate-400/70">
            <span>TOTAL: {ALL_CELESTIAL_BODIES.length} BODIES</span>
            <span className="text-cyan-400/80 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> 3D ORBITAL
            </span>
          </div>
        )}
      </aside>
    </>
  );
};
