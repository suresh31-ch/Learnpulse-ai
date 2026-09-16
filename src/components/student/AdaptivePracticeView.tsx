import React, { useState } from 'react';
import { ConfidenceRating, PracticeQuestion } from '../../types';
import { ADAPTIVE_PRACTICE_QUESTIONS } from '../../data/seedData';
import { Dumbbell, CheckCircle2, XCircle, AlertCircle, ArrowRight, Sparkles, HelpCircle, RotateCcw, TrendingUp } from 'lucide-react';
import confetti from 'canvas-confetti';

export const AdaptivePracticeView: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<ConfidenceRating | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [history, setHistory] = useState<{ isCorrect: boolean; confidence: ConfidenceRating; difficulty: string }[]>([]);

  const currentQuestion: PracticeQuestion = ADAPTIVE_PRACTICE_QUESTIONS[currentIndex] || ADAPTIVE_PRACTICE_QUESTIONS[0];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(idx);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null || !confidence) return;
    setIsAnswerSubmitted(true);

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    setHistory(prev => [...prev, { isCorrect, confidence, difficulty: currentQuestion.difficulty }]);

    if (isCorrect) {
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
    }
  };

  const handleNextQuestion = () => {
    setIsAnswerSubmitted(false);
    setSelectedAnswer(null);
    setConfidence(null);
    setCurrentIndex(prev => (prev + 1) % ADAPTIVE_PRACTICE_QUESTIONS.length);
  };

  // Confidence Mismatch Detection
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
  const isOverconfident = isAnswerSubmitted && !isCorrect && confidence === 'very';
  const isUnderconfident = isAnswerSubmitted && isCorrect && confidence === 'guessing';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Dumbbell className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Adaptive Practice Engine</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
              Confidence Calibration
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Questions calibrate to your real-time mastery. Evaluates both mathematical correctness and metacognitive confidence.
          </p>
        </div>

        {/* Dynamic Difficulty Indicator */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Engine Mode:</span>
          <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-900 text-emerald-400 font-mono">
            {currentQuestion.difficulty} Level
          </span>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Progress header */}
        <div className="flex items-center justify-between text-xs text-slate-500 pb-3 border-b border-slate-100">
          <span className="font-semibold text-slate-800">
            Question {currentIndex + 1} of {ADAPTIVE_PRACTICE_QUESTIONS.length} • {currentQuestion.concept}
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
            Type: {currentQuestion.type}
          </span>
        </div>

        {/* Question Prompt */}
        <div className="space-y-2">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {currentQuestion.prompt}
          </h3>
          {currentQuestion.misconceptionTargeted && (
            <span className="inline-block text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md font-medium">
              Targeted Misconception Check: {currentQuestion.misconceptionTargeted}
            </span>
          )}
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedAnswer === idx;
            let btnClass = 'bg-white border-slate-200 text-slate-800 hover:border-slate-300';

            if (isAnswerSubmitted) {
              if (idx === currentQuestion.correctAnswer) {
                btnClass = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold ring-2 ring-emerald-200';
              } else if (isSelected) {
                btnClass = 'bg-rose-50 border-rose-400 text-rose-900';
              } else {
                btnClass = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
              }
            } else if (isSelected) {
              btnClass = 'bg-indigo-50 border-indigo-600 text-indigo-900 font-bold ring-2 ring-indigo-200';
            }

            return (
              <button
                key={idx}
                disabled={isAnswerSubmitted}
                onClick={() => handleSelectOption(idx)}
                className={`w-full p-4 rounded-xl border text-xs sm:text-sm text-left transition-all flex items-center justify-between ${btnClass}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{option}</span>
                </div>
                {isAnswerSubmitted && idx === currentQuestion.correctAnswer && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
                {isAnswerSubmitted && isSelected && idx !== currentQuestion.correctAnswer && (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Confidence Selector (Before Submission) */}
        {!isAnswerSubmitted && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Confidence Calibration Rating:
              </span>
              <span className="text-[11px] text-slate-500">How certain are you of this step?</span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                onClick={() => setConfidence('guessing')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                  confidence === 'guessing'
                    ? 'bg-slate-800 text-white border-slate-800'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                1. Guessing / Uncertain
              </button>
              <button
                onClick={() => setConfidence('somewhat')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                  confidence === 'somewhat'
                    ? 'bg-slate-800 text-white border-slate-800'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                2. Somewhat Confident
              </button>
              <button
                onClick={() => setConfidence('very')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                  confidence === 'very'
                    ? 'bg-slate-800 text-white border-slate-800'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                3. Very Confident
              </button>
            </div>
          </div>
        )}

        {/* Submit or Next Button */}
        {!isAnswerSubmitted ? (
          <button
            id="btn-submit-adaptive-practice"
            disabled={selectedAnswer === null || confidence === null}
            onClick={handleSubmit}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
          >
            <span>Verify Response & Calibrate</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="space-y-4 pt-2">
            {/* Confidence Calibration Analysis Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                  Confidence Calibration Analysis:
                </span>
                <span className="text-[11px] text-slate-500">Not a psychological diagnosis</span>
              </div>

              {isOverconfident && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>High Confidence + Incorrect Response:</strong> You felt very confident, but fell into a sign-rule trap. This is a prime learning opportunity: the error is often systemic, not random.
                  </div>
                </div>
              )}

              {isUnderconfident && (
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Low Confidence + Correct Response:</strong> You got the answer right, but marked "guessing". Trust your algebraic instincts more on standard forms!
                  </div>
                </div>
              )}

              {!isOverconfident && !isUnderconfident && (
                <div className="text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Well Calibrated! Your reported confidence aligns with your actual performance.</span>
                </div>
              )}

              {/* Mathematical Explanation */}
              <div className="mt-3 text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">Step-by-Step Mathematical Explanation:</span>
                <p className="leading-relaxed">{currentQuestion.explanation}</p>
              </div>
            </div>

            <button
              id="btn-next-adaptive-question"
              onClick={handleNextQuestion}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <span>Proceed to Next Adaptive Challenge</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
