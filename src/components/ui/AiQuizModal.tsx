import React, { useState, useEffect } from "react";
import {
  X,
  Award,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Sparkles,
  HelpCircle,
  ArrowRight,
  RotateCcw,
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
  const progressPercent = questions.length > 0
    ? Math.round(((currentIndex + 1) / questions.length) * 100)
    : 0;

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
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-lg hud-glass-purple border border-purple-500/40 rounded-3xl p-5 sm:p-7 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_35px_rgba(168,85,247,0.25)] relative text-slate-100 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-purple-300 rounded-xl hover:bg-purple-950/50 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/30 border border-purple-400/40">
            <Sparkles className="w-5 h-5 text-purple-200 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-extrabold font-display tracking-wider text-purple-200">
                {planet.name} Celestial Trivia
              </h3>
              <span className="text-[9px] font-mono-hud px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-600/40">
                GEMINI AI
              </span>
            </div>
            <p className="text-[10px] text-purple-300/70 font-mono-hud uppercase">
              Adaptive Knowledge Evaluation
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        {!loading && !isCompleted && questions.length > 0 && (
          <div className="mb-4">
            <div className="flex justify-between items-center text-[10px] font-mono-hud text-purple-300 mb-1.5">
              <span>QUESTION {currentIndex + 1} OF {questions.length}</span>
              <span>SCORE: {score} PTS</span>
            </div>
            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-purple-500/20">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Body Content */}
        {loading ? (
          <div className="py-14 text-center text-purple-300 space-y-4">
            <RefreshCw className="w-10 h-10 animate-spin mx-auto text-purple-400" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold font-display tracking-wider">
                Synthesizing Dynamic Planetary Trivia
              </h4>
              <p className="text-xs font-mono-hud text-purple-400/80">
                Gemini is examining {planet.name}&apos;s real astrophysics data...
              </p>
            </div>
          </div>
        ) : isCompleted ? (
          <div className="py-8 text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="relative inline-block">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500/20 to-purple-500/20 border border-amber-400/40 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/10">
                <Award className="w-10 h-10 text-amber-400 animate-bounce" />
              </div>
            </div>

            <div>
              <h4 className="text-xl font-extrabold text-slate-100 font-display">
                Evaluation Complete!
              </h4>
              <p className="text-xs text-slate-300 mt-1 font-sans">
                You scored{" "}
                <strong className="text-cyan-300 font-mono-hud text-sm">
                  {score}
                </strong>{" "}
                out of{" "}
                <strong className="text-purple-300 font-mono-hud text-sm">
                  {questions.length}
                </strong>{" "}
                on {planet.name}&apos;s quiz.
              </p>
            </div>

            <div className="flex gap-2 justify-center pt-2">
              <button
                onClick={loadQuiz}
                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 rounded-2xl font-bold text-xs text-white shadow-lg shadow-purple-500/30 flex items-center gap-2 active:scale-95 cursor-pointer font-mono-hud"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Challenge</span>
              </button>
              <button
                onClick={() => {
                  soundEngine.playClick();
                  onClose();
                }}
                className="px-5 py-2.5 bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80 rounded-2xl font-semibold text-xs active:scale-95 cursor-pointer font-mono-hud"
              >
                Return to Orbit
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Question Text */}
            <div className="p-3.5 bg-slate-950/70 rounded-2xl border border-purple-500/25">
              <p className="text-xs sm:text-sm font-semibold leading-relaxed text-slate-100 font-sans">
                {currentQ?.question}
              </p>
            </div>

            {/* Multiple Choice Options */}
            <div className="space-y-2">
              {currentQ?.options.map((option, idx) => {
                const letters = ["A", "B", "C", "D"];
                let btnStyle =
                  "bg-slate-900/70 border-slate-800/80 text-slate-200 hover:border-purple-400/60 hover:bg-purple-950/30";

                if (selectedIndex !== null) {
                  if (idx === currentQ.correctAnswerIndex) {
                    btnStyle =
                      "bg-emerald-950/80 border-emerald-500 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.3)]";
                  } else if (idx === selectedIndex) {
                    btnStyle =
                      "bg-rose-950/80 border-rose-500 text-rose-100 shadow-[0_0_15px_rgba(244,63,94,0.3)]";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-3 rounded-2xl border text-xs text-left font-medium transition-all flex items-center justify-between cursor-pointer active:scale-98 ${btnStyle}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-lg bg-slate-950/80 border border-slate-700/70 flex items-center justify-center font-mono-hud text-[10px] text-purple-300 font-bold shrink-0">
                        {letters[idx]}
                      </span>
                      <span>{option}</span>
                    </div>
                    {selectedIndex !== null &&
                      idx === currentQ.correctAnswerIndex && (
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                    {selectedIndex !== null &&
                      idx === selectedIndex &&
                      idx !== currentQ.correctAnswerIndex && (
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                  </button>
                );
              })}
            </div>

            {/* Explanation & Next CTA */}
            {selectedIndex !== null && (
              <div className="p-3.5 bg-purple-950/40 border border-purple-500/40 rounded-2xl text-xs text-purple-200 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                <p className="leading-relaxed font-sans text-xs">
                  <strong className="text-purple-300 font-mono-hud uppercase">
                    Debrief:
                  </strong>{" "}
                  {currentQ.explanation}
                </p>
                <button
                  onClick={handleNext}
                  className="w-full py-2.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-purple-500/30 active:scale-95 cursor-pointer font-mono-hud uppercase tracking-wider"
                >
                  <span>
                    {currentIndex < questions.length - 1
                      ? "Next Question"
                      : "View Final Score"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
