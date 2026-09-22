import React, { useState } from "react";
import { X, Scale, GitCompare, ArrowRightLeft } from "lucide-react";
import type { PlanetData } from "../../types/solar";
import { PLANETS_DATA } from "../../data/planetsData";
import { soundEngine } from "../../services/soundService";

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [p1, setP1] = useState<PlanetData>(PLANETS_DATA[2]); // Earth
  const [p2, setP2] = useState<PlanetData>(PLANETS_DATA[3]); // Mars

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-2xl hud-glass border border-cyan-500/35 rounded-3xl p-5 sm:p-7 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_35px_rgba(6,182,212,0.2)] relative text-slate-100 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-cyan-300 rounded-xl hover:bg-slate-900/80 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 border border-cyan-400/40">
            <GitCompare className="w-5 h-5 text-cyan-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-extrabold font-display tracking-wider text-slate-100">
                Celestial Comparison Lab
              </h3>
              <span className="text-[9px] font-mono-hud px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                SIDE-BY-SIDE
              </span>
            </div>
            <p className="text-[10px] text-cyan-400/70 font-mono-hud uppercase">
              Physical & Orbital Metric Telemetry Differential
            </p>
          </div>
        </div>

        {/* Planet Selectors Cards */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
          {/* Target 1 Card */}
          <div className="p-3.5 bg-slate-950/70 rounded-2xl border border-cyan-500/25">
            <label className="text-[10px] font-mono-hud text-cyan-400/80 mb-1.5 flex items-center gap-1.5 uppercase font-bold">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  backgroundColor: p1.color,
                  boxShadow: `0 0 8px ${p1.color}`,
                }}
              />
              Target Body A
            </label>
            <select
              value={p1.id}
              onChange={(e) => {
                soundEngine.playClick();
                setP1(PLANETS_DATA.find((p) => p.id === e.target.value) || p1);
              }}
              className="w-full p-2.5 bg-slate-900 border border-cyan-500/30 rounded-xl text-xs font-display font-bold text-cyan-200 focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              {PLANETS_DATA.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.type})
                </option>
              ))}
            </select>
          </div>

          {/* Target 2 Card */}
          <div className="p-3.5 bg-slate-950/70 rounded-2xl border border-cyan-500/25">
            <label className="text-[10px] font-mono-hud text-cyan-400/80 mb-1.5 flex items-center gap-1.5 uppercase font-bold">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  backgroundColor: p2.color,
                  boxShadow: `0 0 8px ${p2.color}`,
                }}
              />
              Target Body B
            </label>
            <select
              value={p2.id}
              onChange={(e) => {
                soundEngine.playClick();
                setP2(PLANETS_DATA.find((p) => p.id === e.target.value) || p2);
              }}
              className="w-full p-2.5 bg-slate-900 border border-cyan-500/30 rounded-xl text-xs font-display font-bold text-cyan-200 focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              {PLANETS_DATA.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.type})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Metrics Comparison Table */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-xs text-left text-slate-300 border-collapse font-mono-hud">
            <thead>
              <tr className="border-b border-cyan-500/30 text-cyan-400 text-[10px] uppercase tracking-wider">
                <th className="py-2.5 px-3">Telemetry Metric</th>
                <th className="py-2.5 px-3 text-cyan-200">{p1.name}</th>
                <th className="py-2.5 px-3 text-cyan-200">{p2.name}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              <tr className="hover:bg-cyan-500/5 transition-colors">
                <td className="py-2.5 px-3 text-slate-400">Mean Radius</td>
                <td className="py-2.5 px-3 font-bold text-cyan-200">
                  {p1.realRadiusKm.toLocaleString()} km
                </td>
                <td className="py-2.5 px-3 font-bold text-cyan-200">
                  {p2.realRadiusKm.toLocaleString()} km
                </td>
              </tr>
              <tr className="hover:bg-cyan-500/5 transition-colors">
                <td className="py-2.5 px-3 text-slate-400">Total Mass</td>
                <td className="py-2.5 px-3">{p1.massKg}</td>
                <td className="py-2.5 px-3">{p2.massKg}</td>
              </tr>
              <tr className="hover:bg-cyan-500/5 transition-colors">
                <td className="py-2.5 px-3 text-slate-400">Surface Temp</td>
                <td className="py-2.5 px-3 font-semibold text-amber-300">
                  {p1.surfaceTempC}°C
                </td>
                <td className="py-2.5 px-3 font-semibold text-amber-300">
                  {p2.surfaceTempC}°C
                </td>
              </tr>
              <tr className="hover:bg-cyan-500/5 transition-colors">
                <td className="py-2.5 px-3 text-slate-400">Surface Gravity</td>
                <td className="py-2.5 px-3 font-semibold text-emerald-300">
                  {p1.gravityMs2} m/s²
                </td>
                <td className="py-2.5 px-3 font-semibold text-emerald-300">
                  {p2.gravityMs2} m/s²
                </td>
              </tr>
              <tr className="hover:bg-cyan-500/5 transition-colors">
                <td className="py-2.5 px-3 text-slate-400">Distance from Sun</td>
                <td className="py-2.5 px-3 text-cyan-300">{p1.distanceFromSunAU} AU</td>
                <td className="py-2.5 px-3 text-cyan-300">{p2.distanceFromSunAU} AU</td>
              </tr>
              <tr className="hover:bg-cyan-500/5 transition-colors">
                <td className="py-2.5 px-3 text-slate-400">Known Moons</td>
                <td className="py-2.5 px-3 font-bold text-indigo-300">{p1.moonsCount}</td>
                <td className="py-2.5 px-3 font-bold text-indigo-300">{p2.moonsCount}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
