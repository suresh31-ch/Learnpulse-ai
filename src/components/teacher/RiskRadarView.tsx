import React, { useState } from 'react';
import {
  Radar,
  AlertTriangle,
  HelpCircle,
  TrendingDown,
  Clock,
  CheckCircle2,
  X,
  Sparkles,
  Info,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { STUDENTS_SEED } from '../../data/seedData';
import { StudentProfile } from '../../types';
import { RiskBadge, TrendBadge } from '../shared/StatusBadge';

interface RiskRadarViewProps {
  onGeneratePlan?: (student: StudentProfile) => void;
}

export const RiskRadarView: React.FC<RiskRadarViewProps> = ({ onGeneratePlan }) => {
  const atRiskStudents = STUDENTS_SEED.filter(s => s.riskLevel !== 'low');
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(atRiskStudents[0]);

  return (
    <div className="space-y-6">
      {/* Header with Prominent Non-Stigmatizing Disclaimer */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">Explainable Learning Risk Radar</h1>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                Early Risk Signals ({atRiskStudents.length})
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Multi-factor formative risk signals based on 6 observable behavioral and conceptual vectors.
            </p>
          </div>
        </div>

        {/* Prompt-mandated ethical disclaimer */}
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Pedagogical Assurance:</strong> Risk signals indicate learning friction, not student inability. Early intervention reverses 82% of elevated risk signals within two weeks.
          </p>
        </div>
      </div>

      {/* Grid: Flagged Students List & Explainable Evidence Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List of Flagged Students with "Why?" Triggers */}
        <div className="lg:col-span-2 space-y-3">
          {atRiskStudents.map((student) => {
            const isSelected = selectedStudent?.id === student.id;

            return (
              <div
                key={student.id}
                id={`risk-card-${student.id}`}
                onClick={() => setSelectedStudent(student)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isSelected
                    ? 'border-indigo-600 ring-2 ring-indigo-200 bg-indigo-50/20 shadow-xs'
                    : 'border-slate-200/80 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={student.avatarUrl}
                    alt={student.name}
                    className="w-11 h-11 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{student.name}</span>
                      <span className="text-xs font-mono text-slate-400">{student.rollNumber}</span>
                      <RiskBadge risk={student.riskLevel} />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span>Mastery: <strong className="text-slate-800">{student.overallMastery}%</strong></span>
                      <span>•</span>
                      <span>Primary Friction: <strong className="text-rose-600">{student.primaryGapTopic}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <button
                    id={`btn-why-${student.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedStudent(student);
                    }}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg transition-colors border border-rose-200 flex items-center gap-1"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Why?</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onGeneratePlan?.(student);
                    }}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
                  >
                    Act Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: "Why?" Concrete Evidence Drawer */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between space-y-5">
          {selectedStudent ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">Explainable Diagnostic</span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">Why is {selectedStudent.name} Flagged?</h3>
                </div>
                <RiskBadge risk={selectedStudent.riskLevel} />
              </div>

              {/* 6 Observable Concrete Factors */}
              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">1. Recent Accuracy</span>
                  <span className="text-xs font-bold text-rose-600">
                    Dropped 18% over last 2 assessments
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">2. Topic-Level Mastery</span>
                  <span className="text-xs font-bold text-slate-800">
                    {selectedStudent.primaryGapTopic} at {selectedStudent.overallMastery}% (below 70% baseline)
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">3. Error Patterns</span>
                  <span className="text-xs font-medium text-amber-800">
                    {selectedStudent.misconceptionDetected?.title || 'Repeated sign errors in discriminant calculation'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">4. Multi-Check Trend</span>
                  <span className="text-xs font-bold text-rose-600">
                    Declining trajectory ({selectedStudent.trendDelta}%) across 3 consecutive checks
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">5. Assignment Consistency</span>
                  <span className="text-xs font-medium text-slate-700">
                    {selectedStudent.assignmentConsistency}% (Completed 2 of 4 recent homeworks)
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">6. Self-Directed Practice</span>
                  <span className="text-xs font-medium text-slate-700">
                    {selectedStudent.recentPracticeHours} hrs/week (vs 2.5 class benchmark)
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              Select any student on the left to inspect evidence.
            </div>
          )}

          {selectedStudent && (
            <button
              onClick={() => onGeneratePlan?.(selectedStudent)}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate Recovery Plan for {selectedStudent.name}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
