import React, { useState } from 'react';
import { Sparkles, Clock, CheckCircle2, Users, ArrowRight, Share2, Target, Send, Check } from 'lucide-react';
import { INTERVENTIONS_SEED } from '../../data/seedData';
import confetti from 'canvas-confetti';

export const InterventionsView: React.FC = () => {
  const [published, setPublished] = useState(false);
  const [activePlan, setActivePlan] = useState<'classroom' | 'individual'>('classroom');

  const handlePublish = () => {
    setPublished(true);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Intervention Intelligence & Delivery</h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Measurable Recovery Loop
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Generate 15-minute targeted remediation workflows that close diagnosed concept gaps.
          </p>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 font-medium">Cohort Status:</span>
          <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200">
            Active: 2 Sprints (+21% avg gain)
          </span>
        </div>
      </div>

      {/* 15-Minute Classroom Recovery Plan (Signature Feature) */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-md space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
                15-Minute Remediation Blueprint
              </span>
              <span className="text-xs text-slate-400">Class 10A • Quadratic Equations</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              Targeted Sign-Rule Recovery Session
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Targeted specifically to the 19 students confusing negative constant multiplication in Δ = b² - 4ac.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!published ? (
              <button
                id="btn-publish-intervention"
                onClick={handlePublish}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Publish to Student Portals</span>
              </button>
            ) : (
              <div className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>Published to 19 Students!</span>
              </div>
            )}
          </div>
        </div>

        {/* 4 Timed Sections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-indigo-300">00:00 – 03:00</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                Phase 1
              </span>
            </div>
            <h3 className="text-sm font-bold text-white">Concept Recap</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Focus specifically on why <strong>-4ac</strong> becomes addition whenever c is negative. Use high-contrast color notation on chalkboard.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-indigo-300">03:00 – 07:00</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                Phase 2
              </span>
            </div>
            <h3 className="text-sm font-bold text-white">Worked Example</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Solve <strong>2x² - 3x - 5 = 0</strong> step-by-step together, highlighting the transformation from 9 - (-40) to 9 + 40 = 49.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-indigo-300">07:00 – 12:00</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                Phase 3
              </span>
            </div>
            <h3 className="text-sm font-bold text-white">Guided Peer Practice</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Students solve 2 paired questions on their tablets with real-time confidence calibration tags.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-400">12:00 – 15:00</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-900/50 text-emerald-300 border border-emerald-500/30">
                Exit Check
              </span>
            </div>
            <h3 className="text-sm font-bold text-white">Mastery Verification</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              2 quick exit questions auto-scored to measure verified learning recovery before lecture concludes.
            </p>
          </div>
        </div>
      </div>

      {/* Active Interventions Progress Tracking */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Active Recovery Interventions</h3>
            <p className="text-xs text-slate-500">Continuous measurement of student improvement post-intervention.</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">2 Current Sprints</span>
        </div>

        <div className="space-y-3">
          {INTERVENTIONS_SEED.map((inv) => (
            <div
              key={inv.id}
              className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">{inv.topic}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                    {inv.targetCount} Students Enrolled
                  </span>
                </div>
                <p className="text-xs text-slate-500">{inv.description}</p>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">Measured Recovery</span>
                  <span className="text-sm font-extrabold text-emerald-600">{inv.measuredRecovery}</span>
                </div>
                <div className="w-24 bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${inv.progress}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
