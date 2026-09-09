import React, { useState } from "react";
import { X, Scale } from "lucide-react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-slate-900 border border-cyan-500/30 rounded-3xl p-6 shadow-2xl relative text-slate-100">
        <button
          onClick={() => {
            soundEngine.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 text-slate-400 hover:text-cyan-300"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-6">
          <Scale className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold font-mono tracking-wider text-cyan-300">
            Celestial Side-by-Side Comparison
          </h3>
        </div>

        {/* Planet Selectors */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">
              First Body
            </label>
            <select
              value={p1.id}
              onChange={(e) =>
                setP1(PLANETS_DATA.find((p) => p.id === e.target.value) || p1)
              }
              className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-cyan-200"
            >
              {PLANETS_DATA.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1 block">
              Second Body
            </label>
            <select
              value={p2.id}
              onChange={(e) =>
                setP2(PLANETS_DATA.find((p) => p.id === e.target.value) || p2)
              }
              className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-cyan-200"
            >
              {PLANETS_DATA.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-cyan-400 font-mono">
                <th className="py-2">Metric</th>
                <th className="py-2">{p1.name}</th>
                <th className="py-2">{p2.name}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              <tr>
                <td className="py-2 text-slate-400">Radius (km)</td>
                <td className="py-2 font-bold text-cyan-200">
                  {p1.realRadiusKm.toLocaleString()} km
                </td>
                <td className="py-2 font-bold text-cyan-200">
                  {p2.realRadiusKm.toLocaleString()} km
                </td>
              </tr>
              <tr>
                <td className="py-2 text-slate-400">Mass (kg)</td>
                <td className="py-2">{p1.massKg}</td>
                <td className="py-2">{p2.massKg}</td>
              </tr>
              <tr>
                <td className="py-2 text-slate-400">Surface Temp</td>
                <td className="py-2">{p1.surfaceTempC}°C</td>
                <td className="py-2">{p2.surfaceTempC}°C</td>
              </tr>
              <tr>
                <td className="py-2 text-slate-400">Gravity</td>
                <td className="py-2">{p1.gravityMs2} m/s²</td>
                <td className="py-2">{p2.gravityMs2} m/s²</td>
              </tr>
              <tr>
                <td className="py-2 text-slate-400">Distance (AU)</td>
                <td className="py-2">{p1.distanceFromSunAU} AU</td>
                <td className="py-2">{p2.distanceFromSunAU} AU</td>
              </tr>
              <tr>
                <td className="py-2 text-slate-400">Moons Count</td>
                <td className="py-2">{p1.moonsCount}</td>
                <td className="py-2">{p2.moonsCount}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
