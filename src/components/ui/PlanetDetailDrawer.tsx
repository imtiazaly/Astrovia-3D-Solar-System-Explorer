import React, { useState, useEffect } from "react";
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
  Atom,
  ChevronRight,
  Radio,
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

  // Reset insight when planet changes
  useEffect(() => {
    setAiInsight(null);
    setIsSpeaking(false);
    ttsService.stop();
  }, [planet?.id]);

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
    try {
      const result = await askAstroAI(
        `Give me a deep scientific insight, geological characteristics, and an unsolved cosmic mystery about ${planet.name}`,
        planet,
      );
      setAiInsight(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setAiInsight(
        `⚠️ **AI Intel Unavailable**\n\n${msg}\n\n*Note: Simulated default responses have been disabled. Please set VITE_GEMINI_API_KEY in .env or configure your Gemini API key in Settings ⚙️.*`,
      );
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="fixed right-2 sm:right-6 top-16 sm:top-20 bottom-16 sm:bottom-24 z-30 w-[calc(100vw-16px)] sm:w-96 md:w-[420px] hud-glass rounded-3xl p-3.5 sm:p-5 flex flex-col shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_30px_rgba(6,182,212,0.15)] border border-cyan-500/35 overflow-hidden transition-all animate-in slide-in-from-right-6 duration-300 select-none">
      {/* Drawer Header */}
      <div className="flex items-start justify-between pb-3.5 border-b border-cyan-500/25">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span
              className="block w-4 h-4 rounded-full shadow-lg"
              style={{
                backgroundColor: planet.color,
                boxShadow: `0 0 16px ${planet.color}`,
              }}
            />
            <span className="absolute -inset-1 rounded-full border border-cyan-400/40 animate-ping opacity-70" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-100 font-display tracking-wider">
                {planet.name}
              </h2>
              <span className="text-[9px] font-mono-hud uppercase px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                {planet.type}
              </span>
            </div>
            <p className="text-xs text-cyan-400/90 font-mono-hud mt-0.5">
              {planet.tagline}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Audio Voice Narrator Button */}
          <button
            onClick={handleSpeak}
            title={
              isSpeaking ? "Pause Audio Narration" : "Listen to Audio Dossier"
            }
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-mono-hud flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
              isSpeaking
                ? "bg-cyan-500/30 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.4)] animate-pulse"
                : "bg-slate-900/80 border-slate-700/80 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/30"
            }`}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-cyan-300" />
                <span className="text-[10px] text-cyan-300 font-bold hidden sm:inline">
                  NARRATING
                </span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5" />
                <span className="text-[10px] hidden sm:inline">VOICE</span>
              </>
            )}
          </button>

          {/* Close Button */}
          <button
            onClick={() => {
              soundEngine.playClick();
              ttsService.stop();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-cyan-300 rounded-xl hover:bg-slate-900/80 transition-colors cursor-pointer"
            title="Close Dossier"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Futuristic Segmented Tabs */}
      <div className="flex items-center gap-1 my-3.5 p-1 bg-slate-950/90 rounded-2xl border border-cyan-500/25 text-xs font-mono-hud">
        <button
          onClick={() => {
            soundEngine.playClick();
            setActiveTab("overview");
          }}
          className={`flex-1 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            activeTab === "overview"
              ? "bg-linear-to-r from-cyan-500/30 to-blue-500/30 text-cyan-200 border border-cyan-400/50 shadow-sm"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          OVERVIEW
        </button>
        <button
          onClick={() => {
            soundEngine.playClick();
            setActiveTab("specs");
          }}
          className={`flex-1 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            activeTab === "specs"
              ? "bg-linear-to-r from-cyan-500/30 to-blue-500/30 text-cyan-200 border border-cyan-400/50 shadow-sm"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          SPECS
        </button>
        <button
          onClick={() => {
            soundEngine.playClick();
            setActiveTab("ai");
            if (!aiInsight) handleFetchAiInsight();
          }}
          className={`flex-1 py-1.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === "ai"
              ? "bg-linear-to-r from-purple-500/30 to-indigo-500/30 text-purple-200 border border-purple-400/50 shadow-sm"
              : "text-purple-400/70 hover:text-purple-300"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
          <span>AI INTEL</span>
        </button>
      </div>

      {/* Tab Content Area */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4 text-xs text-slate-300 custom-scrollbar">
        {activeTab === "overview" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Scientific Description Box */}
            <div className="relative p-3.5 bg-slate-900/60 rounded-2xl border border-cyan-500/20 text-slate-200 leading-relaxed font-sans shadow-inner">
              <div className="absolute top-2 right-2 flex items-center gap-1 text-[9px] font-mono-hud text-cyan-400/60 uppercase">
                <Radio className="w-2.5 h-2.5" /> ARCHIVE_DATA
              </div>
              <p className="mt-1">{planet.description}</p>
            </div>

            {/* Quick Telemetry Specs Grid */}
            <div className="grid grid-cols-2 gap-2.5 font-mono-hud">
              {/* Radius Card */}
              <div className="p-3 bg-slate-950/70 rounded-2xl border border-cyan-500/25 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[9px] text-slate-400 uppercase">
                    Radius
                  </div>
                  <div className="font-bold text-slate-100 text-xs sm:text-sm">
                    {planet.realRadiusKm.toLocaleString()} km
                  </div>
                </div>
              </div>

              {/* Temperature Card */}
              <div className="p-3 bg-slate-950/70 rounded-2xl border border-amber-500/25 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-950/60 border border-amber-500/30 text-amber-400">
                  <Thermometer className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[9px] text-slate-400 uppercase">
                    Surface Temp
                  </div>
                  <div className="font-bold text-amber-300 text-xs sm:text-sm">
                    {planet.surfaceTempC}°C
                  </div>
                </div>
              </div>

              {/* Gravity Card */}
              <div className="p-3 bg-slate-950/70 rounded-2xl border border-emerald-500/25 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
                  <Gauge className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[9px] text-slate-400 uppercase">
                    Gravity
                  </div>
                  <div className="font-bold text-emerald-300 text-xs sm:text-sm">
                    {planet.gravityMs2} m/s²
                  </div>
                </div>
              </div>

              {/* Moons Card */}
              <div className="p-3 bg-slate-950/70 rounded-2xl border border-indigo-500/25 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-950/60 border border-indigo-500/30 text-indigo-400">
                  <Orbit className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[9px] text-slate-400 uppercase">
                    Known Moons
                  </div>
                  <div className="font-bold text-indigo-300 text-xs sm:text-sm">
                    {planet.moonsCount}
                  </div>
                </div>
              </div>
            </div>

            {/* Verified Astronomical Facts */}
            <div>
              <div className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-2 flex items-center gap-2 font-mono-hud">
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                <span>Planetary Discoveries & Facts</span>
              </div>
              <ul className="space-y-2">
                {planet.funFacts.map((fact, idx) => (
                  <li
                    key={idx}
                    className="p-3 bg-slate-950/60 rounded-2xl border border-cyan-500/20 text-slate-300 flex items-start gap-2.5 font-sans leading-relaxed"
                  >
                    <span className="text-cyan-400 font-bold mt-0.5">•</span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === "specs" && (
          <div className="space-y-3.5 animate-in fade-in duration-200 font-mono-hud">
            {/* Core Metrics Table */}
            <div className="p-3.5 bg-slate-950/70 rounded-2xl border border-cyan-500/25 space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Mass:</span>
                <span className="font-bold text-cyan-300">{planet.massKg}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Sun Distance:</span>
                <span className="font-bold text-cyan-300">
                  {planet.distanceFromSunAU} AU
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Orbital Period:</span>
                <span className="font-bold text-cyan-300">
                  {planet.orbitalPeriodDays} Earth Days
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Rotation Period:</span>
                <span className="font-bold text-cyan-300">
                  {planet.rotationPeriodHours} Hours
                </span>
              </div>
            </div>

            {/* Atmosphere Composition */}
            <div className="p-3.5 bg-slate-950/70 rounded-2xl border border-cyan-500/25">
              <div className="text-xs font-bold text-cyan-300 mb-2 flex items-center gap-1.5">
                <Atom className="w-3.5 h-3.5 text-cyan-400" />
                <span>Atmospheric Chemistry</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {planet.atmosphere.map((gas, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 rounded-xl text-[11px] font-semibold"
                  >
                    {gas}
                  </span>
                ))}
              </div>
            </div>

            {/* Moons */}
            {planet.moonsList.length > 0 && (
              <div className="p-3.5 bg-slate-950/70 rounded-2xl border border-cyan-500/25">
                <div className="text-xs font-bold text-slate-200 mb-2 flex items-center gap-1.5">
                  <Orbit className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Major Satellites & Moons</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {planet.moonsList.map((moon, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-slate-900 border border-slate-700 text-slate-300 rounded-xl text-[11px]"
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
          <div className="space-y-3.5 animate-in fade-in duration-200 font-sans">
            {loadingAi ? (
              <div className="p-8 text-center text-purple-300 space-y-3 bg-purple-950/20 rounded-2xl border border-purple-500/30">
                <Sparkles className="w-8 h-8 animate-spin mx-auto text-purple-400" />
                <p className="text-xs font-mono-hud font-bold">
                  Consulting Google Gemini Deep Astronomy Engine...
                </p>
                <div className="w-32 h-1 bg-purple-900 mx-auto rounded-full overflow-hidden">
                  <div className="w-full h-full bg-purple-400 animate-pulse" />
                </div>
              </div>
            ) : (
              <div className="p-4 bg-purple-950/30 border border-purple-500/40 rounded-2xl space-y-2.5 shadow-lg shadow-purple-500/10">
                <div className="flex items-center gap-2 text-purple-300 font-bold font-mono-hud text-xs">
                  <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                  <span>Gemini Astrophysics Intelligence</span>
                </div>
                <p className="text-slate-200 leading-relaxed whitespace-pre-line text-xs">
                  {aiInsight}
                </p>
              </div>
            )}

            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenAiChat();
              }}
              className="w-full py-3 bg-linear-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 text-xs shadow-lg shadow-purple-500/30 border border-purple-400/40 transition-all transform active:scale-98 cursor-pointer font-display tracking-wider uppercase"
            >
              <Info className="w-4 h-4 text-purple-200" />
              <span>Ask AstroAI About {planet.name}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
