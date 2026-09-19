import React, { useState } from 'react';
import { Target, CheckCircle2, Circle, ArrowRight, Sparkles, Clock, BookOpen, ShieldCheck } from 'lucide-react';
import { RecoveryMetricCard } from '../shared/RecoveryMetricCard';
import { RECOVERY_SCORE_DATA } from '../../data/seedData';
import confetti from 'canvas-confetti';

export const StudentRecoveryPath: React.FC = () => {
  const [activeStep, setActiveStep] = useState(3); // 3 completed out of 5

  const steps = [
    {
      stepNumber: 1,
      title: 'Concept Repair: Negative Constant Signs',
      duration: '5 min',
      desc: 'Targeted visual cards isolating why -4ac evaluates to addition when c < 0.',
      status: 'completed'
    },
    {
      stepNumber: 2,
      title: 'Guided Worked Example',
      duration: '5 min',
      desc: 'Walking through 2x² - 3x - 5 = 0 with color-coded algebraic signs.',
      status: 'completed'
    },
    {
      stepNumber: 3,
      title: 'Targeted Adaptive Practice',
      duration: '10 min',
      desc: 'Solving 4 practice questions focused strictly on negative discriminant cases.',
      status: 'completed'
    },
    {
      stepNumber: 4,
      title: 'Confidence Calibration Check',
      duration: '3 min',
      desc: 'Meta-cognitive checkpoint verifying question certainty.',
      status: 'in_progress'
    },
    {
      stepNumber: 5,
      title: 'Mastery Reassessment',
      duration: '7 min',
      desc: 'Final verification exam measuring verified recovery gain.',
      status: 'upcoming'
    }
  ];

  const handleCompleteCurrentStep = () => {
    if (activeStep < 5) {
      setActiveStep(prev => prev + 1);
      if (activeStep === 4) {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      }
    }
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
            <h2 className="text-lg font-bold text-slate-900">Personalized Recovery Mission</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 font-semibold border border-rose-200">
              Gap Resolution Sprint
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Targeted recovery plan targeting your specific detected weakness: <span className="font-semibold text-slate-700">Discriminant Calculation in Quadratic Equations</span>.
          </p>
        </div>

        {/* Target Goal Pill */}
        <div className="flex items-center gap-3 bg-slate-900 text-white px-4 py-2 rounded-xl">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Recovery Goal</span>
            <span className="text-xs font-bold text-emerald-400">42% → 75% Mastery</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-xs">
            +33%
          </div>
        </div>
      </div>

      {/* Recovery Score Card */}
      <RecoveryMetricCard data={RECOVERY_SCORE_DATA} />

      {/* 5-Step Recovery Plan Timeline */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Targeted 5-Step Learning Recovery Path</h3>
            <p className="text-xs text-slate-500">
              System targeted to the exact conceptual error, avoiding generic repetitious worksheets.
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            {activeStep} of 5 Completed
          </span>
        </div>

        <div className="space-y-3">
          {steps.map((step, idx) => {
            const isDone = idx < activeStep;
            const isCurrent = idx === activeStep;

            return (
              <div
                key={step.stepNumber}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isDone
                    ? 'bg-emerald-50/40 border-emerald-200 text-slate-800'
                    : isCurrent
                    ? 'bg-indigo-50/50 border-indigo-300 text-slate-900 ring-2 ring-indigo-200 shadow-xs'
                    : 'bg-slate-50/60 border-slate-200 text-slate-400'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold mt-0.5 ${
                      isDone
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : step.stepNumber}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${isCurrent ? 'text-indigo-950' : 'text-slate-800'}`}>
                        {step.title}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400 px-1.5 py-0.2 rounded bg-white border border-slate-200">
                        {step.duration}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{step.desc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {isDone && (
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-lg">
                      Completed ✓
                    </span>
                  )}
                  {isCurrent && (
                    <button
                      onClick={handleCompleteCurrentStep}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
                    >
                      Complete Step
                    </button>
                  )}
                  {!isDone && !isCurrent && (
                    <span className="text-xs text-slate-400 px-2.5 py-1">Locked</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
