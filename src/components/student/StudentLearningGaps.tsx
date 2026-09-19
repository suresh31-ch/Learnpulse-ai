import React, { useState } from 'react';
import { LearningGap, StudentProfile } from '../../types';
import {
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Sparkles,
  Zap,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Clock,
  Layers,
  ShieldAlert,
  Compass
} from 'lucide-react';

interface StudentLearningGapsProps {
  student: StudentProfile;
  gaps: LearningGap[];
  onStartRecovery: (gap: LearningGap) => void;
  onPracticeTopic?: (topicName: string) => void;
  onOpenKnowledgeMap?: () => void;
}

export const StudentLearningGaps: React.FC<StudentLearningGapsProps> = ({
  student,
  gaps,
  onStartRecovery,
  onPracticeTopic,
  onOpenKnowledgeMap
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'critical' | 'moderate' | 'mild'>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  const subjects = ['all', ...Array.from(new Set(gaps.map(g => g.subject)))];

  const filteredGaps = gaps.filter(gap => {
    const matchesSeverity = selectedFilter === 'all' || gap.severity === selectedFilter;
    const matchesSubject = selectedSubject === 'all' || gap.subject === selectedSubject;
    return matchesSeverity && matchesSubject;
  });

  const criticalCount = gaps.filter(g => g.severity === 'critical').length;
  const moderateCount = gaps.filter(g => g.severity === 'moderate').length;
  const potentialRecoveryGain = gaps.reduce((acc, g) => acc + (g.recoveryGain || 15), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* Supportive Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Personalized Diagnostic Intelligence</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Your Learning Gaps & Recovery Roadmap
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Every challenge is an opportunity to strengthen understanding. LearnPulse identifies exactly where conceptual bottlenecks occur and gives you interactive, step-by-step recovery missions.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {onOpenKnowledgeMap && (
              <button
                type="button"
                onClick={onOpenKnowledgeMap}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-all"
              >
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>Curriculum Knowledge Map</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Diagnostic Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="text-[11px] text-slate-400 font-medium">Total Detected Gaps</div>
            <div className="text-lg font-bold text-white mt-0.5">{gaps.length} Areas</div>
          </div>
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
            <div className="text-[11px] text-rose-300 font-medium">Critical Attention</div>
            <div className="text-lg font-bold text-rose-400 mt-0.5">{criticalCount} Topics</div>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <div className="text-[11px] text-amber-300 font-medium">Moderate Developing</div>
            <div className="text-lg font-bold text-amber-400 mt-0.5">{moderateCount} Topics</div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="text-[11px] text-emerald-300 font-medium">Recovery Potential</div>
            <div className="text-lg font-bold text-emerald-400 mt-0.5">+{potentialRecoveryGain}% Gain</div>
          </div>
        </div>
      </div>

      {/* Filter and Subject Selector Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Severity Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            type="button"
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Gaps ({gaps.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('critical')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedFilter === 'critical'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-rose-300'
            }`}
          >
            Critical ({criticalCount})
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('moderate')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedFilter === 'moderate'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-amber-300'
            }`}
          >
            Moderate ({moderateCount})
          </button>
        </div>

        {/* Subject Filter */}
        {subjects.length > 2 && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 mr-1">Subject:</span>
            {subjects.map(subj => (
              <button
                key={subj}
                type="button"
                onClick={() => setSelectedSubject(subj)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                  selectedSubject === subj
                    ? 'bg-slate-800 text-indigo-400 border-indigo-500/40'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {subj === 'all' ? 'All Subjects' : subj}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Gaps List */}
      {filteredGaps.length === 0 ? (
        <div className="p-12 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No Gaps Found in This Category</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            You are performing solidly in these topics. Keep up your deliberate practice routine!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredGaps.map(gap => {
            const isCritical = gap.severity === 'critical';
            const isModerate = gap.severity === 'moderate';

            return (
              <div
                key={gap.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                {/* Left: Topic, Concept & Evidence */}
                <div className="flex-1 min-w-0 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700">
                      {gap.subject}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider border ${
                        isCritical
                          ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                          : isModerate
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                          : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                      }`}
                    >
                      {gap.severity} Gap
                    </span>
                    {gap.trend === 'down' && (
                      <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-300 text-[11px] font-semibold flex items-center gap-1">
                        <TrendingDown className="w-3 h-3" />
                        <span>Declining Trend</span>
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">{gap.topicName}</h3>
                    <p className="text-xs font-medium text-indigo-400 mt-0.5">
                      Focus Concept: {gap.conceptName}
                    </p>
                  </div>

                  {/* Evidence Points */}
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                    <div className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Diagnosed Evidence & Root Cause:</span>
                    </div>
                    <ul className="text-xs text-slate-400 space-y-1 pl-5 list-disc">
                      {gap.evidence.map((ev, i) => (
                        <li key={i}>{ev}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Prerequisite Linkage */}
                  {gap.prerequisiteGap && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs flex items-start gap-2.5">
                      <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div className="leading-relaxed">
                        <strong className="text-amber-200">Prerequisite Dependency: </strong>
                        <span className="text-amber-300/90 font-medium">
                          {gap.prerequisiteGap.concept} ({gap.prerequisiteGap.status.toUpperCase()})
                        </span>
                        <p className="text-slate-400 text-[11px] mt-0.5">
                          {gap.prerequisiteGap.description}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Confidence Mismatch Warning */}
                  {gap.confidenceMismatch && (
                    <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-indigo-300 flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>
                        <strong>Confidence Calibration Alert:</strong> {gap.confidenceMismatch.description}
                      </span>
                    </div>
                  )}
                </div>

                {/* Right: Mastery Meter & Action CTA */}
                <div className="w-full lg:w-72 shrink-0 flex flex-col justify-between p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-400 font-medium">Current Mastery</span>
                      <span
                        className={`font-bold ${
                          gap.currentMastery < 50
                            ? 'text-rose-400'
                            : gap.currentMastery < 70
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {gap.currentMastery}%
                      </span>
                    </div>

                    <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden mb-2">
                      <div
                        className={`h-full rounded-full transition-all ${
                          gap.currentMastery < 50
                            ? 'bg-rose-500'
                            : gap.currentMastery < 70
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${gap.currentMastery}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Target: 80%</span>
                      <span className="text-emerald-400 font-semibold">
                        +{gap.recoveryGain || 25}% Recovery Target
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                    <button
                      type="button"
                      id={`btn-start-recovery-${gap.id}`}
                      onClick={() => onStartRecovery(gap)}
                      className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/25 flex items-center justify-center gap-1.5"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Start 5-Step Recovery Path</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    {onPracticeTopic && (
                      <button
                        type="button"
                        id={`btn-practice-gap-${gap.id}`}
                        onClick={() => onPracticeTopic(gap.topicName)}
                        className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all border border-slate-700 flex items-center justify-center gap-1.5"
                      >
                        <Compass className="w-3.5 h-3.5 text-slate-400" />
                        <span>Adaptive Practice</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
