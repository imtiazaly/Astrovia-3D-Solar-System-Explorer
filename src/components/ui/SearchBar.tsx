import React, { useState, useRef, useEffect } from "react";
import { Search, Sparkles, X, ArrowRight } from "lucide-react";
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
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    <div ref={containerRef} className="relative w-64 sm:w-80 md:w-96 z-50">
      <div className="relative flex items-center group">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400/80 transition-colors group-focus-within:text-cyan-300" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (query.trim()) setIsOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAiSearch();
            if (e.key === "Escape") setIsOpen(false);
          }}
          placeholder='Explore celestial bodies or ask AI...'
          className="w-full pl-10 pr-24 py-2 bg-slate-950/70 text-cyan-100 placeholder-slate-400/60 rounded-2xl border border-cyan-500/30 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/25 backdrop-blur-2xl text-xs transition-all shadow-inner font-mono-hud shadow-black/40"
        />

        {query && (
          <button
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="absolute right-14 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-300 transition-colors p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {/* AI Fuzzy Parser Button */}
        <button
          onClick={handleAiSearch}
          disabled={isAiSearching}
          title="Search with Gemini AI Natural Language Intent Parser"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-xl text-[10px] font-bold flex items-center gap-1.5 shadow-md shadow-cyan-500/30 disabled:opacity-50 transition-all border border-cyan-300/30 active:scale-95 cursor-pointer"
        >
          <Sparkles className="w-3 h-3 text-cyan-200 animate-pulse" />
          <span>{isAiSearching ? "PARSING..." : "AI FIND"}</span>
        </button>
      </div>

      {/* Autocomplete Results Dropdown */}
      {isOpen && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-950/95 backdrop-blur-2xl border border-cyan-500/30 rounded-2xl overflow-hidden shadow-2xl max-h-72 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-3 py-1.5 bg-slate-900/60 border-b border-cyan-500/20 text-[10px] font-mono-hud text-cyan-400/70 uppercase tracking-widest flex justify-between">
            <span>Matching Objects</span>
            <span>{filtered.length} FOUND</span>
          </div>
          {filtered.map((planet) => (
            <button
              key={planet.id}
              onClick={() => handleSelect(planet)}
              className="w-full px-3.5 py-2.5 flex items-center justify-between hover:bg-cyan-500/15 text-left transition-all border-b border-slate-800/40 last:border-0 group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span
                  className="w-3.5 h-3.5 rounded-full shadow-md transition-transform group-hover:scale-125"
                  style={{
                    backgroundColor: planet.color,
                    boxShadow: `0 0 10px ${planet.color}80`,
                  }}
                />
                <div>
                  <div className="text-xs font-bold text-slate-100 group-hover:text-cyan-300 transition-colors font-display">
                    {planet.name}
                  </div>
                  <div className="text-[10px] text-slate-400 group-hover:text-slate-300 transition-colors">
                    {planet.tagline}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] uppercase font-mono-hud px-2 py-0.5 bg-slate-900/90 text-cyan-300 rounded-md border border-cyan-500/30">
                  {planet.type}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400/50 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
