import React, { useState } from "react";
import { Search, Sparkles, X } from "lucide-react";
import type { PlanetData } from "../../types/solar";
import { ALL_CELESTIAL_BODIES } from "../../data/planetsData";
import { parseNaturalLanguageSearch } from "../../services/aiService";
import { soundEngine } from "../../services/soundService";

interface SearchBarProps {
  onSelectPlanet: (planet: PlanetData) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSelectPlanet }) => {
  const [query, setQuery] = useState("");
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Fast direct filter matching
  const filtered = query.trim()
    ? ALL_CELESTIAL_BODIES.filter(
        (b) =>
          b.name.toLowerCase().includes(query.toLowerCase()) ||
          b.type.toLowerCase().includes(query.toLowerCase()) ||
          b.tagline.toLowerCase().includes(query.toLowerCase()),
      )
    : [];

  const handleSelect = (planet: PlanetData) => {
    soundEngine.playFlyTo();
    onSelectPlanet(planet);
    setQuery("");
    setIsOpen(false);
  };

  const handleAiSearch = async () => {
    if (!query.trim()) return;
    setIsAiSearching(true);
    soundEngine.playClick();

    const planetId = await parseNaturalLanguageSearch(query);
    setIsAiSearching(false);

    if (planetId) {
      const found = ALL_CELESTIAL_BODIES.find((b) => b.id === planetId);
      if (found) {
        handleSelect(found);
        return;
      }
    }
    alert(
      `No planet matched for: "${query}". Try "red planet", "gas giant", or "hottest planet"!`,
    );
  };

  return (
    <div className="relative w-72 md:w-96 z-50">
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400/70" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAiSearch();
          }}
          placeholder='Search or ask AI e.g. "red planet"...'
          className="w-full pl-10 pr-20 py-2 bg-slate-900/80 text-cyan-100 placeholder-slate-400/60 rounded-full border border-cyan-500/30 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 backdrop-blur-md text-xs transition-all"
        />

        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-10 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-300"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {/* AI Fuzzy Parser Button */}
        <button
          onClick={handleAiSearch}
          disabled={isAiSearching}
          title="Search with Gemini AI Intent Parser"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2 py-1 bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-full text-[10px] font-medium flex items-center gap-1 shadow-md shadow-cyan-500/20 disabled:opacity-50"
        >
          <Sparkles className="w-3 h-3 text-cyan-200 animate-pulse" />
          {isAiSearching ? "AI..." : "AI"}
        </button>
      </div>

      {/* Autocomplete Results Dropdown */}
      {isOpen && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/90 backdrop-blur-xl border border-cyan-500/30 rounded-2xl overflow-hidden shadow-2xl max-h-60 overflow-y-auto">
          {filtered.map((planet) => (
            <button
              key={planet.id}
              onClick={() => handleSelect(planet)}
              className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-cyan-500/10 text-left transition-colors border-b border-slate-800/50 last:border-0"
            >
              <div className="flex items-center gap-3">
                <span
                  className="w-3 h-3 rounded-full shadow-sm"
                  style={{ backgroundColor: planet.color }}
                />
                <div>
                  <div className="text-xs font-semibold text-slate-100">
                    {planet.name}
                  </div>
                  <div className="text-[10px] text-cyan-400/80">
                    {planet.tagline}
                  </div>
                </div>
              </div>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700">
                {planet.type}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
