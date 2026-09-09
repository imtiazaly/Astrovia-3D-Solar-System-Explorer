// Celestial Body Types
export type CelestialType =
  | "star"
  | "terrestrial"
  | "gas-giant"
  | "ice-giant"
  | "dwarf";

// Verified Ground-Truth Planet Data Interface
export interface PlanetData {
  id: string; // Unique ID (e.g. 'earth')
  name: string; // Display Name
  tagline: string; // Short catchy subtitle
  type: CelestialType; // Planet category
  color: string; // Primary hex color for rendering/ui
  size: number; // Exploratory 3D render radius
  realRadiusKm: number; // Ground truth radius in kilometers
  distanceFromSunAU: number; // Ground truth distance in Astronomical Units
  orbitRadius: number; // Exploratory 3D orbit distance
  orbitalPeriodDays: number; // Revolution time around Sun in Earth days
  rotationPeriodHours: number; // Axial rotation time in hours
  massKg: string; // Scientific notation mass (e.g., "5.972 × 10^24 kg")
  surfaceTempC: number | string; // Average surface temp in Celsius
  gravityMs2: number; // Surface gravity in m/s²
  moonsCount: number; // Number of known natural satellites
  moonsList: string[]; // Notable moons names
  atmosphere: string[]; // Primary atmospheric gases
  description: string; // Concise verified summary
  funFacts: string[]; // Interesting verified astronomical facts
  hasRings?: boolean; // Rings flag (Saturn, Uranus)
  ringColor?: string; // Rings tint color
  ringInnerRadius?: number;
  ringOuterRadius?: number;
}

// 3D Scale Modes
export type ScaleMode = "exploratory" | "realistic";

// Time Scrubber & Orbit Controls Engine State
export interface TimeEngineState {
  isPlaying: boolean;
  speed: number; // 0.1x, 1x, 5x, 10x, 50x
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
