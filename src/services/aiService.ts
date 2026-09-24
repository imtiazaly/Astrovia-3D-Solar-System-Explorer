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

  const systemPrompt = `You are AstroAI, an expert, enthusiastic, and scientifically accurate astrophysics AI assistant guiding users through Astrovia (3D Solar System Explorer).

CRITICAL ACCURACY & BEHAVIOR RULES:
1. Use the verified NASA ground-truth dataset below as your strict reference.
2. Saturn has 146 moons and holds the record for MOST MOONS in the Solar System. Jupiter has 95 moons. NEVER state Jupiter has the most moons.
3. Mercury temperatures range from 427°C (day) to -173°C (night). Venus is the hottest planet at 464°C.
4. Answer the user directly and concisely (2-3 paragraphs max). Use engaging markdown formatting and emojis.
5. STRICT SINGLE TURN: You are ONLY providing the answer. NEVER simulate user questions, NEVER append extra "User Question:" lines, and NEVER generate fake dialogue turns.

NASA Ground-Truth Dataset:
${datasetContext}

User Context: ${planetContext}`;

  try {
    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 1024,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`Cloudflare Worker HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    let resultText = "";

    if (typeof data.response === "string") {
      resultText = data.response;
    } else if (data.choices?.[0]?.message?.content) {
      resultText = data.choices[0].message.content;
    } else if (data.choices?.[0]?.text) {
      resultText = data.choices[0].text;
    } else if (data.response) {
      resultText = typeof data.response === "object" ? JSON.stringify(data.response) : String(data.response);
    }

    // Clean up any stray turn markers or fake dialogue artifacts
    resultText = resultText
      .replace(/^AstroAI:\s*/i, "")
      .replace(/User Question:[\s\S]*/i, "")
      .trim();

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
    const systemPrompt = `Identify which planet or star in our solar system matches the user query. Options: sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune, pluto. Respond ONLY with the single lowercase ID string (e.g., "mars"). If unmatched, respond with "none".`;

    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: query },
        ],
        max_tokens: 30,
        temperature: 0.1,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      let rawText = "";
      if (typeof data.response === "string") {
        rawText = data.response;
      } else if (data.choices?.[0]?.message?.content) {
        rawText = data.choices[0].message.content;
      } else if (data.choices?.[0]?.text) {
        rawText = data.choices[0].text;
      }
      const result = rawText.trim().toLowerCase().replace(/[^a-z]/g, "");
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
    const systemPrompt = `You are an astrophysics quiz generator for Astrovia. Generate 3 multiple choice quiz questions about ${planet.name} based on verified astrophysics facts.

STRICT JSON OUTPUT REQUIREMENTS:
1. Respond ONLY with a valid JSON array of 3 objects.
2. Do NOT include markdown formatting (\`\`\`json), intro text, or extra characters.
3. Keep explanation text under 15 words per question to keep JSON compact.

Exact JSON Structure:
[
  {
    "id": "q1",
    "planetId": "${planet.id}",
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswerIndex": 0,
    "explanation": "Short 1-sentence explanation."
  }
]`;

    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Generate 3 quiz questions for ${planet.name}` },
        ],
        max_tokens: 1536,
        temperature: 0.2,
      }),
    });

    if (response.ok) {
      const data = await response.json();

      // Case 1: Cloudflare Workers AI already parsed response into a JavaScript Array of Objects!
      if (Array.isArray(data.response) && data.response.length > 0) {
        return data.response as QuizQuestion[];
      }

      // Case 2: Extract string from response or choices message content
      let text = "";
      if (typeof data.response === "string") {
        text = data.response;
      } else if (data.choices?.[0]?.message?.content) {
        text = data.choices[0].message.content;
      } else if (data.choices?.[0]?.text) {
        text = data.choices[0].text;
      }

      if (text) {
        // Remove markdown code blocks if any
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();

        // Extract JSON array between first '[' and last ']'
        const startIdx = text.indexOf("[");
        const endIdx = text.lastIndexOf("]");
        
        if (startIdx !== -1 && endIdx > startIdx) {
          text = text.substring(startIdx, endIdx + 1);
        }

        const questions: QuizQuestion[] = JSON.parse(text);
        if (Array.isArray(questions) && questions.length > 0) {
          return questions;
        }
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
