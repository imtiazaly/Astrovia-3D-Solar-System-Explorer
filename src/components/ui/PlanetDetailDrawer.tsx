import React, { useState } from "react";
import {
  X,
  Volume2,
  VolumeX,
  Sparkles,
  Globe,
  Thermometer,
  Gauge,
  Orbit,
  Info,
  BookOpen,
} from "lucide-react";
import type { PlanetData } from "../../types/solar";
import { ttsService } from "../../services/ttsService";
import { soundEngine } from "../../services/soundService";
import { askAstroAI } from "../../services/aiService";

interface PlanetDetailDrawerProps {
  planet: PlanetData | null;
  onClose: () => void;
  onOpenAiChat: () => void;
}

export const PlanetDetailDrawer: React.FC<PlanetDetailDrawerProps> = ({
  planet,
  onClose,
  onOpenAiChat,
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "specs" | "ai">(
    "overview",
  );
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  if (!planet) return null;

  const handleSpeak = () => {
    soundEngine.playClick();
    if (isSpeaking) {
      ttsService.stop();
      setIsSpeaking(false);
    } else {
      const textToRead = `${planet.name}. ${planet.tagline}. ${planet.description}`;
      ttsService.speak(textToRead, () => setIsSpeaking(false));
      setIsSpeaking(true);
    }
  };

  const handleFetchAiInsight = async () => {
    setLoadingAi(true);
    soundEngine.playClick();
    const result = await askAstroAI(
      `Give me a deep scientific insight and mystery about ${planet.name}`,
      planet,
    );
    setAiInsight(result);
    setLoadingAi(false);
  };

  return (
    <div className="fixed right-4 top-20 bottom-24 z-30 w-80 md:w-96 bg-slate-950/80 backdrop-blur-2xl border border-cyan-500/30 rounded-3xl p-5 flex flex-col shadow-2xl overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full shadow-md"
              style={{ backgroundColor: planet.color }}
            />
            <h2 className="text-xl font-bold text-slate-100 font-mono tracking-wider">
              {planet.name}
            </h2>
          </div>
          <p className="text-xs text-cyan-400 font-medium mt-0.5">
            {planet.tagline}
          </p>
        </div>

        <div className="flex items-center gap-1">
          {/* Voice Narrator Button */}
          <button
            onClick={handleSpeak}
            title="Listen to Audio Guide"
            className={`p-2 rounded-xl border transition-all ${
              isSpeaking
                ? "bg-cyan-500/30 border-cyan-400 text-cyan-200 animate-pulse"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-cyan-300"
            }`}
          >
            {isSpeaking ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              ttsService.stop();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-cyan-300 rounded-xl hover:bg-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 my-3 p-1 bg-slate-900/90 rounded-2xl border border-slate-800 text-xs">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex-1 py-1.5 rounded-xl font-medium transition-all ${
            activeTab === "overview"
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
              : "text-slate-400"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("specs")}
          className={`flex-1 py-1.5 rounded-xl font-medium transition-all ${
            activeTab === "specs"
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
              : "text-slate-400"
          }`}
        >
          Specs
        </button>
        <button
          onClick={() => {
            setActiveTab("ai");
            if (!aiInsight) handleFetchAiInsight();
          }}
          className={`flex-1 py-1.5 rounded-xl font-medium flex items-center justify-center gap-1 transition-all ${
            activeTab === "ai"
              ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
              : "text-slate-400"
          }`}
        >
          <Sparkles className="w-3 h-3 text-purple-400" />
          AI Deep Dive
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4 text-xs text-slate-300 custom-scrollbar">
        {activeTab === "overview" && (
          <>
            <p className="leading-relaxed text-slate-300 bg-slate-900/40 p-3 rounded-2xl border border-slate-800/60">
              {planet.description}
            </p>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-slate-900/60 rounded-2xl border border-slate-800 flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400">Radius</div>
                  <div className="font-semibold text-slate-200">
                    {planet.realRadiusKm.toLocaleString()} km
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-2xl border border-slate-800 flex items-center gap-2.5">
                <Thermometer className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400">Surface Temp</div>
                  <div className="font-semibold text-slate-200">
                    {planet.surfaceTempC}°C
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-2xl border border-slate-800 flex items-center gap-2.5">
                <Gauge className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400">Gravity</div>
                  <div className="font-semibold text-slate-200">
                    {planet.gravityMs2} m/s²
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-2xl border border-slate-800 flex items-center gap-2.5">
                <Orbit className="w-4 h-4 text-indigo-400 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400">Known Moons</div>
                  <div className="font-semibold text-slate-200">
                    {planet.moonsCount}
                  </div>
                </div>
              </div>
            </div>

            {/* Fun Facts */}
            <div>
              <div className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                Verified Astronomical Facts
              </div>
              <ul className="space-y-2">
                {planet.funFacts.map((fact, idx) => (
                  <li
                    key={idx}
                    className="p-2.5 bg-slate-900/40 rounded-xl border border-slate-800/50 text-slate-300 flex items-start gap-2"
                  >
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {activeTab === "specs" && (
          <div className="space-y-2">
            <div className="p-3 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Mass:</span>
                <span className="font-mono text-cyan-300">{planet.massKg}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Distance from Sun:</span>
                <span className="font-mono text-cyan-300">
                  {planet.distanceFromSunAU} AU
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Orbital Period:</span>
                <span className="font-mono text-cyan-300">
                  {planet.orbitalPeriodDays} Earth Days
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Rotation Period:</span>
                <span className="font-mono text-cyan-300">
                  {planet.rotationPeriodHours} Hours
                </span>
              </div>
            </div>

            {/* Atmosphere */}
            <div className="p-3 bg-slate-900/60 rounded-2xl border border-slate-800">
              <div className="text-xs font-bold text-slate-200 mb-1.5">
                Atmospheric Composition
              </div>
              <div className="flex flex-wrap gap-1.5">
                {planet.atmosphere.map((gas, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-cyan-950/60 border border-cyan-800/50 text-cyan-300 rounded-lg text-[10px]"
                  >
                    {gas}
                  </span>
                ))}
              </div>
            </div>

            {/* Moons */}
            {planet.moonsList.length > 0 && (
              <div className="p-3 bg-slate-900/60 rounded-2xl border border-slate-800">
                <div className="text-xs font-bold text-slate-200 mb-1.5">
                  Major Satellite Moons
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {planet.moonsList.map((moon, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg text-[10px]"
                    >
                      {moon}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "ai" && (
          <div className="space-y-3">
            {loadingAi ? (
              <div className="p-6 text-center text-cyan-400 space-y-2">
                <Sparkles className="w-6 h-6 animate-spin mx-auto text-purple-400" />
                <p className="text-xs font-medium">
                  Asking AstroAI for deep space insights...
                </p>
              </div>
            ) : (
              <div className="p-3 bg-purple-950/30 border border-purple-500/30 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-purple-300 font-semibold">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  Gemini AI Deep Report
                </div>
                <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                  {aiInsight}
                </p>
              </div>
            )}

            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenAiChat();
              }}
              className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 text-xs shadow-lg shadow-purple-500/20"
            >
              <Info className="w-4 h-4" />
              Chat with AstroAI about {planet.name}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
