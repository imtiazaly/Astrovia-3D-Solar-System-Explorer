import { GoogleGenAI } from "@google/genai";
import type { PlanetData, QuizQuestion } from "../types/solar";
import { ALL_CELESTIAL_BODIES } from "../data/planetsData";

// Storage key for user-provided Gemini API Key
const API_KEY_STORAGE_KEY = "astrovia_gemini_api_key";

export interface AiStatusInfo {
  available: boolean;
  source: "user" | "env" | "none";
  key: string;
}

// Helper to get active API key & status
export const getStoredApiKey = (): string => {
  return (
    localStorage.getItem(API_KEY_STORAGE_KEY) ||
    import.meta.env.VITE_GEMINI_API_KEY ||
    ""
  ).trim();
};

export const getAiStatus = (): AiStatusInfo => {
  const userKey = (localStorage.getItem(API_KEY_STORAGE_KEY) || "").trim();
  const envKey = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();

  if (userKey) {
    return { available: true, source: "user", key: userKey };
  }
  if (envKey) {
    return { available: true, source: "env", key: envKey };
  }
  return { available: false, source: "none", key: "" };
};

// Helper to save user API key
export const setStoredApiKey = (key: string): void => {
  localStorage.setItem(API_KEY_STORAGE_KEY, key.trim());
};

// Helper to construct RAG Context from NASA ground-truth dataset
const getDatasetContext = (): string => {
  return ALL_CELESTIAL_BODIES.map(
    (p) => `
[${p.name}]
Type: ${p.type}
Tagline: ${p.tagline}
Mass: ${p.massKg}
Radius: ${p.realRadiusKm} km
Distance from Sun: ${p.distanceFromSunAU} AU
Orbital Period: ${p.orbitalPeriodDays} days
Rotation Period: ${p.rotationPeriodHours} hours
Surface Temp: ${p.surfaceTempC}°C
Gravity: ${p.gravityMs2} m/s²
Moons: ${p.moonsCount} (${p.moonsList.join(", ")})
Atmosphere: ${p.atmosphere.join(", ")}
Summary: ${p.description}
Fun Facts: ${p.funFacts.join(" | ")}
  `,
  ).join("\n---\n");
};

/**
 * 1. AstroAI Conversational Guide (RAG Chat)
 * Returns true AI response or throws an error (NO fake/simulated fallbacks).
 */
export const askAstroAI = async (
  userPrompt: string,
  selectedPlanet?: PlanetData,
): Promise<string> => {
  const apiKey = getStoredApiKey();

  // If no API Key configured, throw explicit missing key error
  if (!apiKey) {
    throw new Error(
      "API_KEY_MISSING: No Gemini API Key configured. Please add VITE_GEMINI_API_KEY in .env or configure your API key in Settings ⚙️.",
    );
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const datasetContext = getDatasetContext();
    const planetContext = selectedPlanet
      ? `The user is currently inspecting ${selectedPlanet.name}. Focus response on ${selectedPlanet.name} if relevant.`
      : "No specific planet selected.";

    const systemPrompt = `You are AstroAI, an expert, enthusiastic, and scientifically accurate astronomy AI assistant guiding users through 3D Solar System Explorer (Astrovia).
Use the following verified NASA dataset as your primary ground truth for numbers and facts:
${datasetContext}

User Context: ${planetContext}
Keep answers engaging, educational, concise (2-4 paragraphs max), and well-formatted with markdown emojis.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: `${systemPrompt}\n\nUser Question: ${userPrompt}` }],
        },
      ],
    });

    if (!response.text) {
      throw new Error("EMPTY_RESPONSE: Received empty text response from Gemini API.");
    }

    return response.text;
  } catch (error: unknown) {
    console.error("Gemini API Request Error:", error);
    const errMessage = error instanceof Error ? error.message : String(error);
    
    if (errMessage.includes("API_KEY_MISSING")) {
      throw error;
    }
    
    throw new Error(
      `GEMINI_API_ERROR: ${errMessage || "Failed to communicate with Google Gemini AI API."}`
    );
  }
};

/**
 * 2. Natural Language Fuzzy Search Parser
 */
export const parseNaturalLanguageSearch = async (
  query: string,
): Promise<string | null> => {
  const q = query.toLowerCase().trim();

  // Fast client-side keyword matching
  if (
    q.includes("red") ||
    q.includes("mars") ||
    q.includes("rusty") ||
    q.includes("olympus")
  )
    return "mars";
  if (
    q.includes("hot") ||
    q.includes("toxic") ||
    q.includes("venus") ||
    q.includes("morning star")
  )
    return "venus";
  if (
    q.includes("ring") ||
    q.includes("saturn") ||
    q.includes("jewel") ||
    q.includes("titan")
  )
    return "saturn";
  if (
    q.includes("giant") ||
    q.includes("largest") ||
    q.includes("biggest") ||
    q.includes("jupiter") ||
    q.includes("red spot")
  )
    return "jupiter";
  if (
    q.includes("blue") ||
    q.includes("water") ||
    q.includes("earth") ||
    q.includes("home") ||
    q.includes("life")
  )
    return "earth";
  if (
    q.includes("closest") ||
    q.includes("swift") ||
    q.includes("mercury") ||
    q.includes("smallest planet")
  )
    return "mercury";
  if (
    q.includes("sideways") ||
    q.includes("tilt") ||
    q.includes("uranus") ||
    q.includes("cyan")
  )
    return "uranus";
  if (
    q.includes("wind") ||
    q.includes("dark blue") ||
    q.includes("neptune") ||
    q.includes("triton")
  )
    return "neptune";
  if (q.includes("dwarf") || q.includes("pluto") || q.includes("kuiper"))
    return "pluto";
  if (
    q.includes("star") ||
    q.includes("sun") ||
    q.includes("center") ||
    q.includes("light")
  )
    return "sun";

  const apiKey = getStoredApiKey();
  if (!apiKey) return null;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Identify which planet or star in our solar system matches this user query: "${query}".
Options: sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune, pluto.
Respond ONLY with the single lowercase ID string (e.g., "mars"). If unmatched, respond with "none".`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const result = response.text?.trim().toLowerCase() || "";
    if (ALL_CELESTIAL_BODIES.some((b) => b.id === result)) {
      return result;
    }
  } catch (e) {
    console.warn("AI search parse fallback used", e);
  }

  return null;
};

/**
 * 3. Dynamic Quiz Generator
 */
export const generatePlanetQuiz = async (
  planet: PlanetData,
): Promise<QuizQuestion[]> => {
  const apiKey = getStoredApiKey();

  if (!apiKey) {
    return getOfflineQuiz(planet);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Generate 3 multiple choice quiz questions about ${planet.name} based on real astrophysics facts.
Respond ONLY with valid JSON in this exact structure:
[
  {
    "id": "q1",
    "planetId": "${planet.id}",
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswerIndex": index of the correct option (0-3),
    "explanation": "Brief explanation why."
  }
]`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const text = response.text || "";
    const cleanJson = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    const questions: QuizQuestion[] = JSON.parse(cleanJson);
    return questions;
  } catch (e) {
    console.warn("Gemini Quiz API parse failed, using offline astrophysics dataset:", e);
    return getOfflineQuiz(planet);
  }
};

// Standard Offline Astrophysics Quiz Dataset (Used when AI is offline)
function getOfflineQuiz(planet: PlanetData): QuizQuestion[] {
  return [
    {
      id: `${planet.id}-q1`,
      planetId: planet.id,
      question: `What is the primary category of ${planet.name}?`,
      options: [
        "Terrestrial Planet",
        "Gas Giant",
        "Ice Giant",
        "Dwarf Planet / Star",
      ],
      correctAnswerIndex:
        planet.type === "terrestrial"
          ? 0
          : planet.type === "gas-giant"
            ? 1
            : planet.type === "ice-giant"
              ? 2
              : 3,
      explanation: `${planet.name} is classified as a ${planet.type}.`,
    },
    {
      id: `${planet.id}-q2`,
      planetId: planet.id,
      question: `How many natural moons does ${planet.name} have?`,
      options: [
        `${planet.moonsCount} moons`,
        `${planet.moonsCount + 5} moons`,
        "0 moons",
        "Over 200 moons",
      ],
      correctAnswerIndex: 0,
      explanation: `${planet.name} has ${planet.moonsCount} known moons in its orbit.`,
    },
    {
      id: `${planet.id}-q3`,
      planetId: planet.id,
      question: `Which interesting astrophysics fact belongs to ${planet.name}?`,
      options: [
        planet.funFacts[0],
        "It is made entirely of solid gold",
        "It orbits the Sun in 1 hour",
        "It has zero gravity",
      ],
      correctAnswerIndex: 0,
      explanation: planet.funFacts[0],
    },
  ];
}
