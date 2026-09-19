import React, { useState } from 'react';
import { Clock, Users, CheckCircle2, AlertTriangle, Sparkles, TrendingUp, ArrowRight, Play, Check, ChevronRight } from 'lucide-react';
import { PRE_CLASS_TEACHER_INTELLIGENCE_SEED } from '../../data/seedData';
import confetti from 'canvas-confetti';

export const PreClassTeacherIntelligence: React.FC = () => {
  const data = PRE_CLASS_TEACHER_INTELLIGENCE_SEED;
  const [exitCheckRun, setExitCheckRun] = useState(false);
  const [quickCheckScore, setQuickCheckScore] = useState(71);

  const handleSimulateExitCheck = () => {
    setExitCheckRun(true);
    confetti({ particleCount: 45, spread: 60, origin: { y: 0.6 } });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Tomorrow's Lecture Diagnostic
            </span>
            <span className="text-xs text-slate-400">Class 10A • 09:30 AM</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 tracking-tight">
            {data.topic}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Prerequisite readiness telemetry collected from student pre-class previews ahead of instruction.
          </p>
        </div>

        {/* 3-Bucket Student Triage */}
        <div className="flex items-center gap-2 bg-slate-800/80 p-2 rounded-2xl border border-slate-700">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-center">
            <span className="text-xs font-bold block">{data.readyCount}</span>
            <span className="text-[10px] uppercase font-semibold">Ready</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 text-center">
            <span className="text-xs font-bold block">{data.needsPrepCount}</span>
            <span className="text-[10px] uppercase font-semibold">Needs Prep</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 text-center">
            <span className="text-xs font-bold block">{data.needsSupportCount}</span>
            <span className="text-[10px] uppercase font-semibold">At Risk</span>
          </div>
        </div>
      </div>

      {/* AI Teaching Recommendation Card */}
      <div className="p-5 rounded-2xl bg-indigo-50/80 border border-indigo-200/90 flex items-start gap-4">
        <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900">
              AI Classroom Recommendation
            </h3>
            <span className="text-[10px] bg-indigo-200/70 text-indigo-800 px-2 py-0.2 rounded font-bold">
              Pedagogical Advice
            </span>
          </div>
          <p className="text-xs sm:text-sm text-indigo-950 leading-relaxed font-medium">
            "{data.aiTeachingRecommendation}"
          </p>
        </div>
      </div>

      {/* Prerequisite Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Prerequisite Concept Readiness</h3>
            <p className="text-xs text-slate-500">Benchmark requirement: ≥75% mastery for fluid comprehension.</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">3 Prerequisites Tracked</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.prerequisites.map((p, i) => {
            const isCritical = p.status === 'attention';
            return (
              <div
                key={i}
                className={`p-4 rounded-xl border flex flex-col justify-between ${
                  isCritical ? 'bg-rose-50/40 border-rose-200' : 'bg-slate-50/80 border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-800">{p.name}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isCritical ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {p.status === 'attention' ? 'Gap Alert' : 'Solid'}
                    </span>
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 mt-2">{p.masteryPercentage}%</div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60">
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full ${isCritical ? 'bg-rose-500' : 'bg-emerald-500'}`}
                      style={{ width: `${p.masteryPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3-Stage Closed-Loop Progression (Exit Check Simulation) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Learning Intelligence Progression Loop</h3>
            <p className="text-xs text-slate-500">Tracking comprehension shift: Before Class → Classroom Exit Check → Post-Assessment.</p>
          </div>

          {!exitCheckRun ? (
            <button
              id="btn-simulate-exit-check"
              onClick={handleSimulateExitCheck}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Simulate Class Exit Check</span>
            </button>
          ) : (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Exit Check Completed
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Stage 1: Pre-Class Preview</span>
            <div className="text-2xl font-extrabold text-slate-800 mt-1">58%</div>
            <span className="text-xs text-slate-500 mt-1 block">Baseline diagnostic</span>
          </div>

          <div className={`p-4 rounded-xl border text-center transition-all ${
            exitCheckRun ? 'bg-indigo-50/60 border-indigo-300 ring-2 ring-indigo-200' : 'bg-slate-50 border-slate-200 opacity-60'
          }`}>
            <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider block">Stage 2: Classroom Exit Check</span>
            <div className="text-2xl font-extrabold text-indigo-600 mt-1">
              {exitCheckRun ? `${quickCheckScore}%` : 'Pending'}
            </div>
            <span className="text-xs text-slate-500 mt-1 block">
              {exitCheckRun ? '+13% immediate recovery' : 'Run after 15m lesson'}
            </span>
          </div>

          <div className={`p-4 rounded-xl border text-center transition-all ${
            exitCheckRun ? 'bg-emerald-50/60 border-emerald-300' : 'bg-slate-50 border-slate-200 opacity-60'
          }`}>
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">Stage 3: Post-Assessment</span>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">
              {exitCheckRun ? '76%' : 'Scheduled'}
            </div>
            <span className="text-xs text-emerald-700 font-semibold mt-1 block">
              {exitCheckRun ? 'Goal Achieved: Ready for next unit' : 'Target: ≥75%'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
