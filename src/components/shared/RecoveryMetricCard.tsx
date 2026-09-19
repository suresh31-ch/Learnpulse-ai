import React from 'react';
import { ArrowRight, CheckCircle2, Sparkles, TrendingUp, Info } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LearningRecoveryScoreData } from '../../types';

interface RecoveryMetricCardProps {
  data: LearningRecoveryScoreData;
  onInteractiveCheck?: () => void;
}

export const RecoveryMetricCard: React.FC<RecoveryMetricCardProps> = ({ data, onInteractiveCheck }) => {
  const triggerCelebration = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  return (
    <div id="recovery-metric-card" className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 overflow-hidden relative">
      {/* Background soft glow */}
      <div className="absolute -top-16 -right-16 w-44 h-44 bg-emerald-50 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">Learning Recovery Score</h3>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                Active Product Metric
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Topic: <span className="font-semibold text-slate-700">{data.topic}</span>
              {data.studentName && ` • Student: ${data.studentName}`}
            </p>
          </div>
        </div>

        <button
          id="btn-celebrate-recovery"
          onClick={triggerCelebration}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200/60"
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Celebrate Gain</span>
        </button>
      </div>

      {/* Metric Flow */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 flex flex-col justify-center">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Before Intervention</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold text-slate-700">{data.beforeIntervention}%</span>
            <span className="text-xs font-medium text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">Detected Gap</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1">Initial diagnostic assessment</span>
        </div>

        <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/70 flex flex-col justify-center relative">
          <div className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border border-slate-200 items-center justify-center text-slate-400 shadow-xs z-10">
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-medium text-emerald-800 uppercase tracking-wider">After Intervention</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold text-emerald-700">{data.afterIntervention}%</span>
            <span className="text-xs font-medium text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded">Target Achieved</span>
          </div>
          <span className="text-[11px] text-emerald-600 mt-1">Post-reassessment check</span>
        </div>

        <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-200/60 flex flex-col justify-center">
          <span className="text-xs font-medium text-indigo-800 uppercase tracking-wider">Net Recovery Gain</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold text-indigo-700">+{data.recoveryPoints}</span>
            <span className="text-xs font-semibold text-indigo-700">Percentage Points</span>
          </div>
          <span className="text-[11px] text-indigo-600/80 mt-1">Calculated deterministic difference</span>
        </div>
      </div>

      {/* What Changed Section */}
      <div className="rounded-xl bg-slate-50/80 border border-slate-200/60 p-4">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          What Changed?
        </h4>
        <ul className="space-y-2">
          {data.whatChanged.map((change, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <span>{change}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Scientific Transparency Disclaimer */}
      <div className="mt-4 flex items-start gap-2 text-[11px] text-slate-400 bg-white p-2 rounded-lg border border-slate-100">
        <Info className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
        <span>
          <strong>Methodology Note:</strong> The Learning Recovery Score is a proprietary product metric calculated strictly from formative assessment response data before and after targeted interventions. It is not a universal clinical or psychological diagnosis.
        </span>
      </div>
    </div>
  );
};
