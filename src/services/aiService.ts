import type { PlanetData, QuizQuestion } from "../types/solar";
import { ALL_CELESTIAL_BODIES } from "../data/planetsData";

// Cloudflare Worker AI Hub Endpoint
const WORKER_URL = "https://ai-hub.imtiyazalye.workers.dev/api/chat";

export interface AiStatusInfo {
  available: boolean;
  source: "worker";
  endpoint: string;
}

export const getAiStatus = (): AiStatusInfo => {
  return {
    available: true,
    source: "worker",
    endpoint: WORKER_URL,
  };
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
 * 1. AstroAI Conversational Guide (Cloudflare Workers AI RAG Chat)
 */
export const askAstroAI = async (
  userPrompt: string,
  selectedPlanet?: PlanetData,
): Promise<string> => {
  const datasetContext = getDatasetContext();
  const planetContext = selectedPlanet
    ? `The user is currently inspecting ${selectedPlanet.name}. Focus response on ${selectedPlanet.name} if relevant.`
    : "No specific planet selected.";

  const systemPrompt = `You are AstroAI, an expert, enthusiastic, and scientifically accurate astronomy AI assistant guiding users through 3D Solar System Explorer (Astrovia).
Use the following verified NASA dataset as your primary ground truth for numbers and facts:
${datasetContext}

User Context: ${planetContext}
Keep answers engaging, educational, concise (2-4 paragraphs max), and well-formatted with markdown emojis.`;

  try {
    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `${systemPrompt}\n\nUser Question: ${userPrompt}`,
      }),
    });

    if (!response.ok) {
      throw new Error(`Cloudflare Worker HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const resultText = data.response || data.choices?.[0]?.text || data.text || "";

    if (!resultText) {
      throw new Error("Received empty text response from Cloudflare Worker AI.");
    }

    return resultText;
  } catch (error: unknown) {
    console.error("Cloudflare Worker AI Request Error:", error);
    const errMessage = error instanceof Error ? error.message : String(error);
    throw new Error(
      `AI_WORKER_ERROR: ${errMessage || "Failed to communicate with Cloudflare Worker AI API."}`
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

  try {
    const prompt = `Identify which planet or star in our solar system matches this user query: "${query}".
Options: sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune, pluto.
Respond ONLY with the single lowercase ID string (e.g., "mars"). If unmatched, respond with "none".`;

    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: prompt }),
    });

    if (response.ok) {
      const data = await response.json();
      const rawText = (data.response || data.choices?.[0]?.text || "").trim().toLowerCase();
      const result = rawText.replace(/[^a-z]/g, "");
      if (ALL_CELESTIAL_BODIES.some((b) => b.id === result)) {
        return result;
      }
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
  try {
    const prompt = `Generate 3 multiple choice quiz questions about ${planet.name} based on real astrophysics facts.
Respond ONLY with valid JSON in this exact structure:
[
  {
    "id": "q1",
    "planetId": "${planet.id}",
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswerIndex": 0,
    "explanation": "Brief explanation why."
  }
]`;

    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: prompt }),
    });

    if (response.ok) {
      const data = await response.json();
      const text = data.response || data.choices?.[0]?.text || "";
      const cleanJson = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      const questions: QuizQuestion[] = JSON.parse(cleanJson);
      if (Array.isArray(questions) && questions.length > 0) {
        return questions;
      }
    }
  } catch (e) {
    console.warn("Cloudflare Worker AI Quiz parse failed, using offline astrophysics dataset:", e);
  }

  return getOfflineQuiz(planet);
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
