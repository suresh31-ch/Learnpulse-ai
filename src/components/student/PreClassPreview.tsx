import React, { useState } from 'react';
import { PreClassPreviewData } from '../../types';
import {
  Calendar,
  Clock,
  Sparkles,
  BookOpen,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Calculator,
  ChevronDown,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PreClassPreviewProps {
  data: PreClassPreviewData;
  onLaunchPreparation?: (topic: string) => void;
  onOpenTutor?: (contextPrompt: string) => void;
}

export const PreClassPreview: React.FC<PreClassPreviewProps> = ({
  data,
  onLaunchPreparation,
  onOpenTutor
}) => {
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'readiness_quiz' | 'prerequisites'>('overview');

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (submitted) return;
    setUserAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const calculateScore = () => {
    let correct = 0;
    data.quickQuestions.forEach(q => {
      if (userAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    });
    return Math.round((correct / data.quickQuestions.length) * 100);
  };

  const handleSubmitQuiz = () => {
    setSubmitted(true);
    const score = calculateScore();
    if (score >= 66) {
      confetti({ particleCount: 40, spread: 55, origin: { y: 0.6 } });
    }
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setSubmitted(false);
  };

  const dynamicReadiness = submitted ? calculateScore() : data.readinessPercentage;

  return (
    <div id="pre-class-preview-view" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Signature Feature • Tomorrow's Class</span>
              </span>
              <span className="text-xs text-slate-400">{data.scheduledFor}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {data.topicTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Preview tomorrow's lecture now to detect prerequisite friction before you enter the classroom.
            </p>
          </div>

          {/* Readiness Score Ring */}
          <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-4 border border-slate-700/80 text-center min-w-[150px]">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Class Readiness
            </span>
            <div className="text-3xl font-extrabold text-white mt-1">
              <span className={dynamicReadiness >= 75 ? 'text-emerald-400' : dynamicReadiness >= 55 ? 'text-amber-400' : 'text-rose-400'}>
                {dynamicReadiness}%
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              {submitted ? 'Verified via Quiz' : 'Diagnostic baseline'}
            </span>
          </div>
        </div>

        {/* AI Insight Box inside header */}
        <div className="mt-6 p-4 rounded-2xl bg-indigo-950/60 border border-indigo-800/50 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-indigo-200 uppercase tracking-wider">
              AI Readiness Diagnostic
            </h4>
            <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed">
              "{data.aiInsight}"
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            id="btn-prepare-for-class"
            onClick={() => onLaunchPreparation?.(data.topicTitle)}
            className="px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs shadow-md shadow-indigo-500/30 flex items-center gap-2 transition-all"
          >
            <span>Prepare for Class Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onOpenTutor?.(`I am preparing for tomorrow's class on ${data.topicTitle}. Please explain algebraic sign manipulation in quadratic equations simply.`)}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Ask Pulse Tutor</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'overview'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Lesson Overview & Formulas
        </button>
        <button
          onClick={() => setActiveTab('prerequisites')}
          className={`pb-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'prerequisites'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          Prerequisite Checks ({data.prerequisites.length})
        </button>
        <button
          onClick={() => setActiveTab('readiness_quiz')}
          className={`pb-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'readiness_quiz'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          Readiness Check (3 Questions)
          {submitted && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* What you will learn */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                What You Will Learn Tomorrow
              </h3>
              <ul className="space-y-2.5">
                {data.whatYouWillLearn.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <span className="w-5 h-5 rounded-md bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Why this topic matters & AI Intro */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Why This Topic Matters</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{data.whyItMatters}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <h4 className="text-xs font-bold text-slate-800">Intuitive AI Introduction</h4>
                </div>
                <p className="text-xs text-slate-600 italic">"{data.aiIntroduction}"</p>
              </div>
            </div>

            {/* Vocabulary */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Important Vocabulary</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.keyVocabulary.map((v, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                    <span className="text-xs font-bold text-indigo-900">{v.term}</span>
                    <p className="text-[11px] text-slate-600 mt-1">{v.definition}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Key Formulas */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-indigo-600" />
                Key Formulas & Rules
              </h3>
              <div className="space-y-3">
                {data.keyFormulas.map((f, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-900 text-white font-mono">
                    <span className="text-[10px] text-indigo-300 font-sans font-bold uppercase tracking-wider block">
                      {f.name}
                    </span>
                    <div className="text-sm font-bold text-emerald-400 mt-1">{f.formula}</div>
                    {f.note && <div className="text-[10px] text-slate-400 font-sans mt-1">{f.note}</div>}
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Prep Card */}
            <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs mb-1">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Recommended Preparation
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                {data.recommendedPreparation}
              </p>
              <button
                onClick={() => setActiveTab('readiness_quiz')}
                className="mt-3 w-full py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors"
              >
                Take 2-Min Readiness Check
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Prerequisite Checks */}
      {activeTab === 'prerequisites' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Prerequisite Concept Breakdown</h3>
              <p className="text-xs text-slate-500">
                Concepts required to comfortably absorb tomorrow's quadratic equation derivations.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
              3 Prerequisite Pillars
            </span>
          </div>

          <div className="space-y-4">
            {data.prerequisites.map((p) => {
              const isPassed = p.status === 'passed';
              return (
                <div
                  key={p.id}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                    isPassed
                      ? 'bg-emerald-50/40 border-emerald-200/70'
                      : 'bg-rose-50/50 border-rose-200'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{p.name}</span>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          isPassed
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {isPassed ? 'Ready' : 'Detected Gap'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {isPassed
                        ? 'Mastery meets required proficiency threshold.'
                        : 'Identified as primary risk factor for tomorrow’s lesson.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block font-medium">Your Mastery</span>
                      <span className={`text-xl font-extrabold ${isPassed ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {p.masteryPercentage}%
                      </span>
                    </div>
                    {!isPassed && (
                      <button
                        onClick={() => onOpenTutor?.(`Can you help me master ${p.name}? I need to be ready for tomorrow's class.`)}
                        className="px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-100 hover:bg-rose-200 rounded-lg transition-colors whitespace-nowrap"
                      >
                        Review with Tutor
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Quick Readiness Questions */}
      {activeTab === 'readiness_quiz' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Pre-Class Readiness Check</h3>
              <p className="text-xs text-slate-500">
                Answer these 3 quick questions to benchmark your preparedness before lecture.
              </p>
            </div>
            {submitted && (
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-700">
                  Your Score: <span className="text-indigo-600 font-extrabold">{calculateScore()}%</span>
                </span>
                <button
                  onClick={handleResetQuiz}
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retry</span>
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {data.quickQuestions.map((q, qIndex) => {
              const selected = userAnswers[q.id];
              const isAnswered = selected !== undefined;
              const isCorrect = isAnswered && selected === q.correctIndex;

              return (
                <div key={q.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
                      Question {qIndex + 1} • {q.conceptChecked}
                    </span>
                    {submitted && (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-semibold text-slate-900">{q.questionText}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {q.options.map((opt, optIdx) => {
                      const isOptionSelected = selected === optIdx;
                      let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100';

                      if (submitted) {
                        if (optIdx === q.correctIndex) {
                          btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-800 font-semibold';
                        } else if (isOptionSelected) {
                          btnStyle = 'bg-rose-50 border-rose-400 text-rose-800';
                        } else {
                          btnStyle = 'bg-white border-slate-200 text-slate-400 opacity-60';
                        }
                      } else if (isOptionSelected) {
                        btnStyle = 'bg-indigo-50 border-indigo-600 text-indigo-900 font-bold ring-2 ring-indigo-200';
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={submitted}
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          className={`p-3 rounded-xl border text-xs text-left transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {submitted && optIdx === q.correctIndex && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {submitted && (
                    <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 mt-2">
                      <span className="font-bold text-slate-800">Explanation: </span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {!submitted ? (
            <button
              id="btn-submit-readiness-quiz"
              disabled={Object.keys(userAnswers).length < data.quickQuestions.length}
              onClick={handleSubmitQuiz}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-600/20"
            >
              Submit Readiness Check ({Object.keys(userAnswers).length}/{data.quickQuestions.length} Answered)
            </button>
          ) : (
            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-indigo-900">Readiness Score Updated: {calculateScore()}%</span>
                <p className="text-[11px] text-indigo-700">Results saved to your learning telemetry for tomorrow’s teacher view.</p>
              </div>
              <button
                onClick={() => onLaunchPreparation?.(data.topicTitle)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors"
              >
                Proceed to Practice
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
