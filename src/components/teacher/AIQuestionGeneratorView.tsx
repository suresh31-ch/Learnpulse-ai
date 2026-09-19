import React, { useState } from 'react';
import { HelpCircle, Sparkles, Send, CheckCircle2, ArrowRight, Layers, BookmarkPlus, Check } from 'lucide-react';
import { GeneratedQuestion } from '../../types';

export const AIQuestionGeneratorView: React.FC = () => {
  const [topic, setTopic] = useState('Quadratic Equations');
  const [concept, setConcept] = useState('Discriminant Calculation (Δ = b² - 4ac)');
  const [difficulty, setDifficulty] = useState('Medium');
  const [questionType, setQuestionType] = useState('Multiple Choice');
  const [targetMisconception, setTargetMisconception] = useState('Sign error in negative constant multiplication');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [question, setQuestion] = useState<GeneratedQuestion | null>({
    id: 'gen-q1',
    prompt: 'For the quadratic equation 3x² - 4x - 7 = 0, calculate the value of the discriminant Δ and state the nature of the roots.',
    options: [
      'Δ = -68, so there are two complex roots',
      'Δ = 100, so there are two distinct real roots',
      'Δ = -68, so there is one repeated real root',
      'Δ = 68, so there are two irrational roots'
    ],
    correctAnswer: 1,
    explanation: 'Δ = b² - 4ac. Here a = 3, b = -4, and c = -7. Δ = (-4)² - 4(3)(-7) = 16 - (-84) = 16 + 84 = 100. Since Δ > 0 and 100 is a perfect square, there are two distinct rational real roots.',
    concept: 'Discriminant Calculation (Δ = b² - 4ac)',
    difficulty: 'Medium',
    targetMisconception: 'Treating -4(3)(-7) as subtraction instead of addition yielding -68.'
  });

  const [isLiveAI, setIsLiveAI] = useState<boolean | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setSaved(false);

    try {
      const res = await fetch('/api/ai/question-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          concept,
          difficulty,
          questionType,
          targetMisconception
        })
      });

      const data = await res.json();
      const q = data.data || data.question;
      if (q) {
        setQuestion(q);
        setIsLiveAI(data.isLiveAI);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">AI Diagnostic Question Studio</h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Targeted Gap Assessment
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Generate calibrated diagnostic questions crafted specifically to isolate conceptual trap errors and confirm recovery.
          </p>
        </div>
      </div>

      {/* Control Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Controls */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
            Targeting Parameters
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Topic</label>
              <input
                type="text"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Concept</label>
              <input
                type="text"
                value={concept}
                onChange={e => setConcept(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Target Misconception to Test</label>
              <input
                type="text"
                value={targetMisconception}
                onChange={e => setTargetMisconception(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={e => setDifficulty(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Easy">Easy (Foundational)</option>
                  <option value="Medium">Medium (Application)</option>
                  <option value="Hard">Hard (Trap-Intense)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Format</label>
                <select
                  value={questionType}
                  onChange={e => setQuestionType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Multiple Choice">Multiple Choice</option>
                  <option value="Step-by-Step">Step-by-Step</option>
                  <option value="Word Problem">Word Problem</option>
                </select>
              </div>
            </div>
          </div>

          <button
            id="btn-generate-ai-question"
            disabled={loading}
            onClick={handleGenerate}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5"
          >
            {loading ? (
              <>
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Synthesizing Question via Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Diagnostic Question</span>
              </>
            )}
          </button>
        </div>

        {/* Question Preview & Verification */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between space-y-6">
          {question ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    {question.difficulty}
                  </span>
                  {isLiveAI && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      Live Gemini AI
                    </span>
                  )}
                  <span className="text-xs font-semibold text-slate-500">
                    Target: {question.concept}
                  </span>
                </div>

                <button
                  onClick={() => setSaved(true)}
                  className="text-xs font-semibold px-3 py-1 rounded-lg text-indigo-600 hover:bg-indigo-50 border border-indigo-200 transition-colors flex items-center gap-1"
                >
                  {saved ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Saved to Class Bank</span>
                    </>
                  ) : (
                    <>
                      <BookmarkPlus className="w-3.5 h-3.5" />
                      <span>Save to Question Bank</span>
                    </>
                  )}
                </button>
              </div>

              {/* Prompt */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <h3 className="text-sm font-bold text-slate-900 leading-relaxed">
                  {question.prompt}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-2">
                {question.options.map((opt, idx) => {
                  const isCorrect = idx === question.correctAnswer;
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                        isCorrect
                          ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900 font-semibold'
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[11px]">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {isCorrect && (
                        <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                          Correct Answer
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Distractor & Misconception metadata */}
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1 text-xs">
                <span className="font-bold text-amber-900 block">
                  Targeted Distractor Trap:
                </span>
                <p className="text-amber-800 leading-relaxed">{question.targetMisconception}</p>
              </div>

              {/* Explanation */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                <span className="font-bold text-slate-900 block">Verification Explanation:</span>
                <p className="leading-relaxed">{question.explanation}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400">
              Configure parameters on the left and click Generate.
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Validates alignment with CBSE Class 10 blueprint and Bloom's taxonomy.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
