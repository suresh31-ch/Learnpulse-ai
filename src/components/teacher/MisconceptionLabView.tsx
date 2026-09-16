import React, { useState } from 'react';
import { Flame, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, BookOpen, Users, Brain } from 'lucide-react';
import { MISCONCEPTION_LAB_SEED } from '../../data/seedData';

interface MisconceptionLabViewProps {
  onGenerateIntervention?: (misconceptionTitle: string) => void;
}

export const MisconceptionLabView: React.FC<MisconceptionLabViewProps> = ({
  onGenerateIntervention
}) => {
  const [activeItem, setActiveItem] = useState(MISCONCEPTION_LAB_SEED[0]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Misconception Lab</h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              Pattern Diagnostics
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Detects persistent cognitive bottlenecks across Class 10A using response telemetry and error clustering.
          </p>
        </div>

        {/* Visual Badge differentiating Deterministic vs AI Interpretation */}
        <div className="flex items-center gap-2 text-xs bg-slate-50 p-2 rounded-xl border border-slate-200">
          <span className="px-2 py-0.5 rounded bg-white text-slate-700 font-semibold border border-slate-200">
            📊 Deterministic Telemetry
          </span>
          <span className="text-slate-400">+</span>
          <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
            ✨ AI Interpretation
          </span>
        </div>
      </div>

      {/* Main Grid: Misconceptions Cards & Deep Lab Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Misconception Catalog */}
        <div className="lg:col-span-2 space-y-4">
          {MISCONCEPTION_LAB_SEED.map((item) => {
            const isSelected = activeItem.id === item.id;

            return (
              <div
                key={item.id}
                onClick={() => setActiveItem(item)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer bg-white ${
                  isSelected
                    ? 'border-amber-500 ring-2 ring-amber-200 shadow-sm'
                    : 'border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                        {item.topic} • {item.concept}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                        {item.affectedStudentsCount} Students Affected
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      {item.misconceptionTitle}
                    </h3>
                  </div>

                  <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-100 text-slate-600">
                    Confidence: {item.confidence}%
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {item.rootCauseExplanation}
                </p>

                {/* Evidence snippet */}
                <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs font-mono text-slate-700">
                  <span className="text-slate-400 font-sans font-semibold block text-[10px] uppercase">
                    Observed Assessment Evidence:
                  </span>
                  "{item.exampleErrorSnippet}"
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Col: Remediation Action Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                  AI Remediation Plan
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 mt-1">
                {activeItem.misconceptionTitle}
              </h4>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-800 block">Recommended Intervention:</span>
              <p className="text-xs text-slate-600 leading-relaxed">
                {activeItem.recommendedIntervention}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 space-y-1.5">
              <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                Expected Recovery Yield:
              </span>
              <p className="text-xs text-indigo-900/80">
                Resolving this single misconception recovers an estimated <strong>+24 percentage points</strong> for 11 affected students.
              </p>
            </div>
          </div>

          <button
            onClick={() => onGenerateIntervention?.(activeItem.misconceptionTitle)}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Launch 15-Minute Recovery Lesson</span>
          </button>
        </div>
      </div>
    </div>
  );
};
