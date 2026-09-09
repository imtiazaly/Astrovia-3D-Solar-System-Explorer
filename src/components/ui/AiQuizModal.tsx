import React, { useState, useEffect } from "react";
import {
  X,
  Award,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import confetti from "canvas-confetti";
import type { PlanetData, QuizQuestion } from "../../types/solar";
import { generatePlanetQuiz } from "../../services/aiService";
import { soundEngine } from "../../services/soundService";

interface AiQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  planet: PlanetData;
}

export const AiQuizModal: React.FC<AiQuizModalProps> = ({
  isOpen,
  onClose,
  planet,
}) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (isOpen && planet) {
      loadQuiz();
    }
  }, [isOpen, planet]);

  const loadQuiz = async () => {
    setLoading(true);
    setCurrentIndex(0);
    setSelectedIndex(null);
    setScore(0);
    setIsCompleted(false);

    const qList = await generatePlanetQuiz(planet);
    setQuestions(qList);
    setLoading(false);
  };

  if (!isOpen) return null;

  const currentQ = questions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (selectedIndex !== null) return; // Prevent double select
    setSelectedIndex(idx);

    if (idx === currentQ.correctAnswerIndex) {
      soundEngine.playSuccess();
      setScore((prev) => prev + 1);
    } else {
      soundEngine.playClick();
    }
  };

  const handleNext = () => {
    soundEngine.playClick();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedIndex(null);
    } else {
      setIsCompleted(true);
      if (score >= 2) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-md bg-slate-900 border border-purple-500/30 rounded-3xl p-6 shadow-2xl relative text-slate-100">
        <button
          onClick={() => {
            soundEngine.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 text-slate-400 hover:text-cyan-300"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
          <h3 className="text-lg font-bold font-mono tracking-wider text-purple-300">
            {planet.name} AI Celestial Quiz
          </h3>
        </div>

        {loading ? (
          <div className="py-12 text-center text-purple-300 space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-purple-400" />
            <p className="text-xs">Generating dynamic quiz with Gemini AI...</p>
          </div>
        ) : isCompleted ? (
          <div className="py-8 text-center space-y-4">
            <Award className="w-14 h-14 mx-auto text-amber-400 animate-bounce" />
            <h4 className="text-xl font-bold text-slate-100">
              Quiz Completed!
            </h4>
            <p className="text-sm text-cyan-300 font-mono">
              Your Score: {score} / {questions.length}
            </p>

            <button
              onClick={loadQuiz}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full font-semibold text-xs text-white shadow-lg shadow-purple-500/30"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="font-mono text-purple-300 font-semibold">
                Score: {score}
              </span>
            </div>

            <p className="text-sm font-semibold leading-relaxed text-slate-200">
              {currentQ?.question}
            </p>

            <div className="space-y-2">
              {currentQ?.options.map((option, idx) => {
                let btnStyle =
                  "bg-slate-800/80 border-slate-700 text-slate-200 hover:border-purple-400";
                if (selectedIndex !== null) {
                  if (idx === currentQ.correctAnswerIndex) {
                    btnStyle =
                      "bg-emerald-950/80 border-emerald-500 text-emerald-200";
                  } else if (idx === selectedIndex) {
                    btnStyle = "bg-rose-950/80 border-rose-500 text-rose-200";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-3 rounded-2xl border text-xs text-left font-medium transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{option}</span>
                    {selectedIndex !== null &&
                      idx === currentQ.correctAnswerIndex && (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      )}
                    {selectedIndex !== null &&
                      idx === selectedIndex &&
                      idx !== currentQ.correctAnswerIndex && (
                        <AlertCircle className="w-4 h-4 text-rose-400" />
                      )}
                  </button>
                );
              })}
            </div>

            {selectedIndex !== null && (
              <div className="p-3 bg-purple-950/30 border border-purple-500/30 rounded-2xl text-xs text-purple-200 space-y-2">
                <p>
                  <strong>Explanation:</strong> {currentQ.explanation}
                </p>
                <button
                  onClick={handleNext}
                  className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-xs"
                >
                  {currentIndex < questions.length - 1
                    ? "Next Question →"
                    : "View Final Score 🎉"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
