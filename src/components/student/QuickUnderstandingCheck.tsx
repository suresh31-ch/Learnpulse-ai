import React, { useState } from 'react';
import { UnderstandingCheckQuestion, UnderstandingCheckResult } from '../../types';
import {
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Sparkles,
  HelpCircle,
  RotateCcw,
  Zap,
  Award
} from 'lucide-react';

interface QuickUnderstandingCheckProps {
  topicTitle?: string;
  preClassScore?: number; // default e.g. 55%
  onCompleteCheck: (result: UnderstandingCheckResult) => void;
  onGoToRecovery?: () => void;
  onGoToPractice?: () => void;
}

const DEFAULT_QUESTIONS: UnderstandingCheckQuestion[] = [
  {
    id: 'u-1',
    questionText: 'For the equation 3x² - 6x - 9 = 0, what is the value of the discriminant Δ = b² - 4ac?',
    options: ['Δ = -72 (No real roots)', 'Δ = 144 (Two distinct real roots)', 'Δ = 0 (One root)', 'Δ = 72'],
    correctIndex: 1,
    explanation: 'b = -6, so b² = 36. 4ac = 4 × 3 × (-9) = -108. b² - 4ac = 36 - (-108) = 36 + 108 = 144 > 0.',
    conceptTested: 'Sign handling with negative constant c'
  },
  {
    id: 'u-2',
    questionText: 'If a quadratic equation has roots x = 3 and x = -1, which standard form equation represents this curve?',
    options: ['x² - 2x - 3 = 0', 'x² + 2x - 3 = 0', 'x² - 4x + 3 = 0', 'x² + 4x + 3 = 0'],
    correctIndex: 0,
    explanation: '(x - 3)(x + 1) = x² + x - 3x - 3 = x² - 2x - 3 = 0.',
    conceptTested: 'Roots factor reconstruction'
  }
];

export const QuickUnderstandingCheck: React.FC<QuickUnderstandingCheckProps> = ({
  topicTitle = 'Quadratic Equations (Discriminant & Roots)',
  preClassScore = 55,
  onCompleteCheck,
  onGoToRecovery,
  onGoToPractice
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState<UnderstandingCheckResult | null>(null);

  const currentQ = DEFAULT_QUESTIONS[currentIndex];
  const isSelected = selectedAnswers[currentIndex] !== undefined;

  const handleSelectOption = (optIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [currentIndex]: optIndex }));
  };

  const handleNext = () => {
    if (currentIndex < DEFAULT_QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Calculate results deterministically
      let correctCount = 0;
      DEFAULT_QUESTIONS.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctIndex) {
          correctCount++;
        }
      });

      const postClassScore = Math.round((correctCount / DEFAULT_QUESTIONS.length) * 100);
      const deltaScore = postClassScore - preClassScore;

      const whatChanged: string[] = [];
      if (deltaScore > 0) {
        whatChanged.push(`Understanding grew by +${deltaScore}% after instructional review.`);
        whatChanged.push('Correctly managed the double negative sign in 4ac evaluation.');
        whatChanged.push('Demonstrated mastery in reconstructing polynomial factors from roots.');
      } else {
        whatChanged.push('Score maintained relative to baseline formative readiness check.');
        whatChanged.push('Further deliberate practice recommended on sign transposition.');
      }

      const res: UnderstandingCheckResult = {
        topicTitle,
        preClassScore,
        postClassScore,
        deltaScore,
        status: deltaScore >= 20 ? 'significant_growth' : deltaScore >= 0 ? 'steady_progress' : 'needs_reinforcement',
        whatChanged,
        nextStepRecommendation: deltaScore >= 20
          ? 'Proceed to Adaptive Practice to solidify newly mastered mental model.'
          : 'Launch Concept Recovery Path to eliminate remaining sign errors.'
      };

      setResult(res);
      setIsSubmitted(true);
      onCompleteCheck(res);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 font-sans">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Post-Class Checkpoint</span>
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Quick Understanding Check: {topicTitle}
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          A quick 2-minute pulse check to measure your comprehension following today's classroom instruction.
        </p>

        {/* Comparison Banner */}
        <div className="mt-4 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Pre-Class Readiness Score:</span>
            <span className="font-bold text-amber-400">{preClassScore}%</span>
          </div>
          <span className="text-slate-500 text-[11px]">2 Quick Conceptual Questions</span>
        </div>
      </div>

      {!isSubmitted ? (
        /* Question Card */
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              Question {currentIndex + 1} of {DEFAULT_QUESTIONS.length}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono text-[11px]">
              {currentQ.conceptTested}
            </span>
          </div>

          <h3 className="text-base font-semibold text-white leading-snug">
            {currentQ.questionText}
          </h3>

          {/* Options */}
          <div className="space-y-2.5">
            {currentQ.options.map((opt, oIdx) => {
              const active = selectedAnswers[currentIndex] === oIdx;
              return (
                <button
                  key={oIdx}
                  type="button"
                  onClick={() => handleSelectOption(oIdx)}
                  className={`w-full p-4 rounded-xl text-left text-xs font-medium border transition-all flex items-center justify-between ${
                    active
                      ? 'bg-indigo-600/20 border-indigo-500 text-white ring-1 ring-indigo-500'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span>{opt}</span>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      active ? 'border-indigo-400 bg-indigo-500 text-white' : 'border-slate-700'
                    }`}
                  >
                    {active && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Select an answer to reveal your post-class understanding delta
            </span>
            <button
              type="button"
              id="btn-submit-understanding-q"
              disabled={!isSelected}
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
            >
              <span>{currentIndex < DEFAULT_QUESTIONS.length - 1 ? 'Next Question' : 'Complete & Compare'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Result & "What Changed?" Comparison View */
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6 animate-fadeIn">
          {/* Delta Hero */}
          <div className="p-5 rounded-xl bg-gradient-to-r from-indigo-950/50 via-slate-950 to-slate-950 border border-indigo-500/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                  Post-Class Understanding Complete
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  What Changed? (Pre-Class vs. Post-Class)
                </h3>
              </div>

              {/* Score Badges */}
              <div className="flex items-center gap-3">
                <div className="text-center px-3 py-2 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">Pre-Class</div>
                  <div className="text-lg font-bold text-amber-400">{result?.preClassScore}%</div>
                </div>

                <div className="text-indigo-400 font-bold text-lg">→</div>

                <div className="text-center px-3 py-2 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">Post-Class</div>
                  <div className="text-lg font-bold text-emerald-400">{result?.postClassScore}%</div>
                </div>

                <div className="text-center px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <div className="text-[10px] uppercase font-bold">Growth Delta</div>
                  <div className="text-lg font-bold">
                    {result && result.deltaScore >= 0 ? `+${result.deltaScore}%` : `${result?.deltaScore}%`}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Concrete "What Changed" Observations */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Observable Conceptual Growth Evidence:</span>
            </h4>
            <ul className="text-xs text-slate-300 space-y-1.5 pl-5 list-disc">
              {result?.whatChanged.map((change, i) => (
                <li key={i}>{change}</li>
              ))}
            </ul>
          </div>

          {/* Next Steps CTA */}
          <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-indigo-300">
              <strong>Recommended Next Action: </strong>
              <span>{result?.nextStepRecommendation}</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {onGoToPractice && (
                <button
                  type="button"
                  onClick={onGoToPractice}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Adaptive Practice</span>
                </button>
              )}

              {onGoToRecovery && result && result.postClassScore < 70 && (
                <button
                  type="button"
                  onClick={onGoToRecovery}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
                >
                  <span>Recovery Mission</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
