import React from 'react';
import { X, User, AlertTriangle, TrendingDown, CheckCircle2, Sparkles, BookOpen, Clock, ShieldCheck, Flame, ArrowRight } from 'lucide-react';
import { StudentProfile } from '../../types';
import { MasteryBadge, RiskBadge, TrendBadge } from '../shared/StatusBadge';

interface StudentIntelligenceModalProps {
  student: StudentProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onGenerateRecoveryPlan?: (student: StudentProfile) => void;
}

export const StudentIntelligenceModal: React.FC<StudentIntelligenceModalProps> = ({
  student,
  isOpen,
  onClose,
  onGenerateRecoveryPlan
}) => {
  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-4">
            <img
              src={student.avatarUrl}
              alt={student.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-400"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">{student.name}</h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                  {student.rollNumber}
                </span>
                <RiskBadge risk={student.riskLevel} />
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Class: <span className="text-slate-200 font-semibold">{student.className}</span> • Primary Gap: <span className="text-rose-400 font-semibold">{student.primaryGapTopic}</span>
              </p>
            </div>
          </div>

          <button
            id="btn-close-student-profile"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Top Score Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold block">Overall Mastery</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">{student.overallMastery}%</div>
              <span className="text-[11px] text-slate-400">Class Rank: 34th</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold block">Risk Signal</span>
              <div className="mt-1">
                <RiskBadge risk={student.riskLevel} />
              </div>
              <span className="text-[11px] text-slate-400 block mt-1">Elevated risk pattern</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold block">Recent Trend</span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-xl font-extrabold text-rose-600">{student.trendDelta}%</span>
                <TrendBadge trend={student.trend} />
              </div>
              <span className="text-[11px] text-slate-400 block mt-1">Declining recently</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold block">Consistency</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">{student.assignmentConsistency}%</div>
              <span className="text-[11px] text-slate-400">Practice: {student.recentPracticeHours} hrs/wk</span>
            </div>
          </div>

          {/* Knowledge Map Breakdown (Green = Mastered, Amber = Developing, Red = Critical) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                Curriculum Knowledge Map Breakdown
              </h3>
              <span className="text-xs text-slate-400">Visual Mastery States</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {student.topicMastery.map((tm, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-slate-200/80 bg-white flex items-center justify-between"
                >
                  <span className="text-xs font-bold text-slate-800">{tm.topicName}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700">{tm.score}%</span>
                    <MasteryBadge level={tm.score} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detected Misconception with Empirical Evidence */}
          {student.misconceptionDetected && (
            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                  <Flame className="w-4 h-4 text-amber-600" />
                  <span>Detected Misconception: {student.misconceptionDetected.concept}</span>
                </div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                  Empirical Evidence
                </span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-amber-200/80 space-y-2">
                <h4 className="text-xs font-bold text-slate-900">
                  {student.misconceptionDetected.title}
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  "{student.misconceptionDetected.evidence}"
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  <span>First observed: {student.misconceptionDetected.firstObserved}</span>
                  <span className="font-semibold text-rose-700">{student.repeatedErrorsCount} Repeated Errors Tagged</span>
                </div>
              </div>

              <div className="text-[11px] text-amber-800">
                <strong>Pedagogical Note:</strong> AI does not assume student inability. This reflects an isolated algebraic sign convention confusion that can be corrected in a single 15-minute recovery session.
              </div>
            </div>
          )}

          {/* Statistical Evidence Behind Risk Signal */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Evidence Supporting Risk Signal:
            </h4>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5">
              {student.evidencePoints.map((ev, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <span>{ev}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-slate-500">
            Recommended: <strong className="text-slate-800">{student.recommendedAction}</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Close
            </button>
            <button
              id="btn-generate-recovery-plan-modal"
              onClick={() => {
                onClose();
                onGenerateRecoveryPlan?.(student);
              }}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate Recovery Plan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
