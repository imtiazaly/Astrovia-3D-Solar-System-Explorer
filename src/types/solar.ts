// Celestial Body Types
export type CelestialType =
  | "star"
  | "terrestrial"
  | "gas-giant"
  | "ice-giant"
  | "dwarf";

// Verified Ground-Truth Planet Data Interface
export interface PlanetData {
  id: string;
  name: string;
  tagline: string;
  type: CelestialType;
  color: string;
  size: number;
  realRadiusKm: number;
  distanceFromSunAU: number;
  orbitRadius: number;
  orbitalPeriodDays: number;
  rotationPeriodHours: number;
  massKg: string;
  surfaceTempC: number | string;
  gravityMs2: number;
  moonsCount: number;
  moonsList: string[];
  atmosphere: string[];
  description: string;
  funFacts: string[];
  hasRings?: boolean;
  ringColor?: string;
  ringInnerRadius?: number;
  ringOuterRadius?: number;
}

// 3D Scale Modes
export type ScaleMode = "exploratory" | "realistic";

// Time Scrubber & Orbit Controls Engine State
export interface TimeEngineState {
  isPlaying: boolean;
  speed: number;
  isReversed: boolean;
}

// AstroAI Chat Message Interface
export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  relatedPlanetId?: string;
}

// AI Quiz Question Interface
export interface QuizQuestion {
  id: string;
  planetId: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}
