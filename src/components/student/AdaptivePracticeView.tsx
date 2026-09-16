import React, { useState, useMemo, useCallback } from 'react';
import { ConfidenceRating, PracticeQuestion } from '../../types';
import { ADAPTIVE_PRACTICE_QUESTIONS } from '../../data/seedData';
import {
  Dumbbell,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  Sparkles,
  HelpCircle,
  RotateCcw,
  TrendingUp,
  Loader2,
  WifiOff,
  Target,
  Bot,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { useStudentData } from '../../lib/useStudentData';
import { persistPracticeSession, persistAttemptResponses } from '../../lib/studentPersistence';
import type { BankQuestion } from '../../lib/useStudentData';

interface AdaptivePracticeViewProps {
  onOpenTutor?: (prompt: string) => void;
}

type Difficulty = 'Easy' | 'Medium' | 'Hard';

function bankToPracticeQuestion(q: BankQuestion, idx: number): PracticeQuestion {
  const options = q.options.length > 0 ? q.options : ['Option A', 'Option B', 'Option C', 'Option D'];
  const correctNum = typeof q.correctAnswer === 'number'
    ? q.correctAnswer
    : Math.min(parseInt(String(q.correctAnswer), 10) || 0, options.length - 1);
  const diff = (q.difficulty === 'Hard' || q.difficulty === 'hard' || q.difficulty === 'difficult')
    ? 'Hard'
    : (q.difficulty === 'Easy' || q.difficulty === 'easy')
    ? 'Easy'
    : 'Medium';
  return {
    id: q.id,
    subject: 'Mathematics',
    topic: 'Adaptive Practice',
    concept: q.conceptName ?? `Concept ${idx + 1}`,
    difficulty: diff as Difficulty,
    type: 'mcq',
    prompt: q.prompt,
    options,
    correctAnswer: correctNum,
    explanation: q.explanation ?? 'No explanation available.',
    learningObjective: q.conceptName ?? 'Concept mastery',
  };
}

export const AdaptivePracticeView: React.FC<AdaptivePracticeViewProps> = ({ onOpenTutor }) => {
  const { user } = useAuth();
  const studentData = useStudentData(user?.id);

  const allQuestions: PracticeQuestion[] = useMemo(() => {
    if (studentData.questionBank.length > 0) {
      return studentData.questionBank.map((q, i) => bankToPracticeQuestion(q, i));
    }
    return ADAPTIVE_PRACTICE_QUESTIONS;
  }, [studentData.questionBank]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<ConfidenceRating | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [history, setHistory] = useState<{ isCorrect: boolean; confidence: ConfidenceRating; difficulty: string; concept: string }[]>([]);
  const [persistNote, setPersistNote] = useState<string | null>(null);
  const [persisting, setPersisting] = useState(false);

  const currentDifficulty: Difficulty = useMemo(() => {
    if (history.length === 0) return 'Medium';
    const recent = history.slice(-3);
    const correctCount = recent.filter((h) => h.isCorrect).length;
    if (correctCount >= 2) return 'Hard';
    if (correctCount === 0) return 'Easy';
    return 'Medium';
  }, [history]);

  const availableQuestions = useMemo(() => {
    const matching = allQuestions.filter((q) => q.difficulty === currentDifficulty);
    return matching.length > 0 ? matching : allQuestions;
  }, [allQuestions, currentDifficulty]);

  const currentQuestion: PracticeQuestion = availableQuestions[currentIndex % availableQuestions.length] || allQuestions[0];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(idx);
  };

  const handleSubmit = useCallback(async () => {
    if (selectedAnswer === null || !confidence) return;
    setIsAnswerSubmitted(true);

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const newEntry = {
      isCorrect,
      confidence,
      difficulty: currentQuestion.difficulty,
      concept: currentQuestion.concept,
    };
    setHistory((prev) => [...prev, newEntry]);

    if (isCorrect) {
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
    }

    if (user?.id) {
      setPersisting(true);
      const totalCorrect = [...history, newEntry].filter((h) => h.isCorrect).length;
      const totalQuestions = history.length + 1;
      const score = Math.round((totalCorrect / totalQuestions) * 100);

      const ok = await persistAttemptResponses({
        studentId: user.id,
        responses: [{ questionId: null, isCorrect, confidence }],
        score,
      });

      if (ok && totalQuestions >= 3) {
        await persistPracticeSession({
          studentId: user.id,
          topicId: studentData.upcomingSession?.topicId ?? null,
          correctCount: totalCorrect,
          questionCount: totalQuestions,
        });
        setPersistNote(`Session saved: ${totalCorrect}/${totalQuestions} correct (${score}%).`);
        studentData.refresh();
      } else if (ok) {
        setPersistNote('Response recorded to Supabase.');
      } else {
        setPersistNote('Could not persist — check RLS or table access.');
      }
      setPersisting(false);
    }
  }, [selectedAnswer, confidence, currentQuestion, history, user?.id, studentData]);

  const handleNextQuestion = () => {
    setIsAnswerSubmitted(false);
    setSelectedAnswer(null);
    setConfidence(null);
    setPersistNote(null);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleReset = () => {
    setHistory([]);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setConfidence(null);
    setIsAnswerSubmitted(false);
    setPersistNote(null);
  };

  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
  const isOverconfident = isAnswerSubmitted && !isCorrect && confidence === 'very';
  const isUnderconfident = isAnswerSubmitted && isCorrect && confidence === 'guessing';

  const accuracy = history.length > 0
    ? Math.round((history.filter((h) => h.isCorrect).length / history.length) * 100)
    : null;

  const difficultyReason = useMemo(() => {
    if (history.length === 0) return 'Starting at Medium — no performance history yet.';
    const recent = history.slice(-3);
    const correct = recent.filter((h) => h.isCorrect).length;
    if (correct >= 2) return `Increased to Hard — ${correct}/${recent.length} correct in recent responses.`;
    if (correct === 0) return `Adjusted to Easy — ${correct}/${recent.length} correct in recent responses. Repairing concept first.`;
    return `Maintaining Medium — ${correct}/${recent.length} correct in recent responses.`;
  }, [history]);

  return (
    <div className="space-y-6">
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
            {studentData.hasRealData && studentData.questionBank.length > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                Live Questions
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Questions calibrate to your real-time performance. Evaluates both correctness and metacognitive confidence.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-slate-500 font-medium block">Current Difficulty:</span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg font-mono ${
              currentDifficulty === 'Hard' ? 'bg-rose-100 text-rose-700'
              : currentDifficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700'
              : 'bg-slate-900 text-emerald-400'
            }`}>
              {currentDifficulty}
            </span>
          </div>
          {accuracy !== null && (
            <div className="text-right">
              <span className="text-xs text-slate-500 font-medium block">Session Accuracy:</span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                accuracy >= 75 ? 'bg-emerald-100 text-emerald-700'
                : accuracy >= 50 ? 'bg-amber-100 text-amber-700'
                : 'bg-rose-100 text-rose-700'
              }`}>
                {accuracy}%
              </span>
            </div>
          )}
        </div>
      </div>

      {studentData.loading && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 shadow-xs flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <p className="text-sm font-semibold text-slate-600">Loading practice questions from Supabase…</p>
        </div>
      )}

      {studentData.error && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-xs font-medium text-amber-800">
          <WifiOff className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{studentData.error} Using built-in practice questions.</span>
        </div>
      )}

      <div className="bg-indigo-50/50 border border-indigo-200/60 rounded-xl p-3 flex items-start gap-2">
        <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <div className="text-xs text-indigo-900">
          <span className="font-bold">Why this difficulty?</span> {difficultyReason}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between text-xs text-slate-500 pb-3 border-b border-slate-100">
          <span className="font-semibold text-slate-800">
            Question {currentIndex + 1} • {currentQuestion.concept}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
              {currentQuestion.difficulty}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
              {currentQuestion.type}
            </span>
          </div>
        </div>

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

        {!isAnswerSubmitted ? (
          <button
            id="btn-submit-adaptive-practice"
            disabled={selectedAnswer === null || confidence === null || persisting}
            onClick={handleSubmit}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
          >
            {persisting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving response…</span>
              </>
            ) : (
              <>
                <span>Verify Response & Calibrate</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        ) : (
          <div className="space-y-4 pt-2">
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
                    <strong>High Confidence + Incorrect Response:</strong> You felt very confident, but the answer was wrong. This is a prime learning opportunity — the error is often systemic, not random.
                  </div>
                </div>
              )}

              {isUnderconfident && (
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Low Confidence + Correct Response:</strong> You got the answer right, but marked "guessing". Consider trusting your instincts more on this concept type.
                  </div>
                </div>
              )}

              {!isOverconfident && !isUnderconfident && (
                <div className="text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Well Calibrated! Your reported confidence aligns with your actual performance.</span>
                </div>
              )}

              <div className="mt-3 text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">Step-by-Step Mathematical Explanation:</span>
                <p className="leading-relaxed">{currentQuestion.explanation}</p>
              </div>
            </div>

            {persistNote && (
              <p className="text-[11px] text-slate-500 text-center">{persistNote}</p>
            )}

            <div className="flex items-center gap-3">
              <button
                id="btn-next-adaptive-question"
                onClick={handleNextQuestion}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <span>Next Adaptive Challenge</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              {onOpenTutor && (
                <button
                  onClick={() => onOpenTutor(`I just answered a ${currentQuestion.difficulty} question on ${currentQuestion.concept}. I got it ${isCorrect ? 'correct' : 'incorrect'} with ${confidence} confidence. Help me understand this concept better using Socratic hints.`)}
                  className="px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Bot className="w-4 h-4 text-indigo-400" />
                  Ask Tutor
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {history.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Session History</h3>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
          <div className="space-y-2">
            {history.map((h, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  {h.isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-600" />
                  )}
                  <span className="font-semibold text-slate-700">{h.concept}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-medium">{h.difficulty}</span>
                  <span className="capitalize">{h.confidence}</span>
                </div>
              </div>
            ))}
          </div>
          {accuracy !== null && (
            <div className="mt-3 pt-3 border-t border-slate-100 text-center">
              <span className="text-xs text-slate-500">
                Session accuracy: <span className={`font-bold ${accuracy >= 75 ? 'text-emerald-600' : accuracy >= 50 ? 'text-amber-600' : 'text-rose-600'}`}>{accuracy}%</span>
                {' '}across {history.length} question{history.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
