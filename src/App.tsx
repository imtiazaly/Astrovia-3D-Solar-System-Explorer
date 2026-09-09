import { useState } from "react";
import type { PlanetData, ScaleMode, TimeEngineState } from "./types/solar";
import { PLANETS_DATA } from "./data/planetsData";
import { SolarSystemCanvas } from "./components/3d/SolarSystemCanvas";
import { Navbar } from "./components/ui/Navbar";
import { PlanetSidebar } from "./components/ui/PlanetSidebar";
import { TimeControls } from "./components/ui/TimeControls";
import { PlanetDetailDrawer } from "./components/ui/PlanetDetailDrawer";
import { AiChatAssistant } from "./components/ui/AiChatAssistant";
import { AiQuizModal } from "./components/ui/AiQuizModal";
import { ComparisonModal } from "./components/ui/ComparisonModal";
import { SettingsModal } from "./components/ui/SettingsModal";
import { soundEngine } from "./services/soundService";

export function App() {
  // Application State
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [scaleMode, setScaleMode] = useState<ScaleMode>("exploratory");
  const [showOrbits, setShowOrbits] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [timeEngine, setTimeEngine] = useState<TimeEngineState>({
    isPlaying: true,
    speed: 1,
    isReversed: false,
  });

  // Modal States
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleToggleScale = () => {
    setScaleMode((prev) =>
      prev === "exploratory" ? "realistic" : "exploratory",
    );
  };

  const handleToggleOrbits = () => {
    setShowOrbits((prev) => !prev);
  };

  const handleToggleMute = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-slate-950">
      {/* Top Navbar */}
      <Navbar
        onSelectPlanet={setSelectedPlanet}
        scaleMode={scaleMode}
        onToggleScale={handleToggleScale}
        showOrbits={showOrbits}
        onToggleOrbits={handleToggleOrbits}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenAiChat={() => setIsAiChatOpen(true)}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onOpenCompare={() => setIsCompareOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main 3D Interactive Canvas */}
      <SolarSystemCanvas
        selectedPlanet={selectedPlanet}
        onSelectPlanet={setSelectedPlanet}
        scaleMode={scaleMode}
        timeEngine={timeEngine}
        showOrbits={showOrbits}
      />

      {/* Left Planet Navigation Directory */}
      <PlanetSidebar
        selectedPlanet={selectedPlanet}
        onSelectPlanet={setSelectedPlanet}
      />

      {/* Bottom Floating Time Scrubber Controls */}
      <TimeControls
        timeEngine={timeEngine}
        onChangeTimeEngine={setTimeEngine}
      />

      {/* Selected Planet Details Drawer */}
      <PlanetDetailDrawer
        planet={selectedPlanet}
        onClose={() => setSelectedPlanet(null)}
        onOpenAiChat={() => setIsAiChatOpen(true)}
      />

      {/* AstroAI Chat Assistant Drawer */}
      <AiChatAssistant
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
        selectedPlanet={selectedPlanet}
      />

      {/* Dynamic AI Space Trivia Quiz Modal */}
      <AiQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        planet={selectedPlanet || PLANETS_DATA[2]} // Default Earth
      />

      {/* Planet Comparison Tool Modal */}
      <ComparisonModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </main>
  );
}

export default App;
