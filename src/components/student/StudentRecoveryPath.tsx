/**
 * LearnPulse AI — Student Insights & Recovery Path
 *
 * The "Insights" navigation view for students.
 * Uses real Supabase data from useStudentData when available.
 * Falls back to seed data with a clear demo badge when Supabase is not configured
 * or the student has no records yet.
 *
 * Covers Step 7 requirements:
 *  - Overall mastery, strongest/weakest areas
 *  - Detected learning gaps with evidence
 *  - Misconceptions with topic/concept context
 *  - Next Best Learning Action (deterministic)
 *  - Progress & Recovery (where history exists)
 *  - Learning Journey stages (LearningLoopBar)
 *  - Proper loading/error/empty states
 */

import React, { useState } from 'react';
import {
  Target,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Minus,
  Loader2,
  WifiOff,
  BookOpen,
  Brain,
  Flame,
  RefreshCw,
  Award,
} from 'lucide-react';
import { RecoveryMetricCard } from '../shared/RecoveryMetricCard';
import { MasteryBadge, DemoDataBadge } from '../shared/StatusBadge';
import { LearningLoopBar } from '../shared/LearningLoopBar';
import { RECOVERY_SCORE_DATA, STUDENTS_SEED, DEMO_METADATA, MISCONCEPTIONS_SEED } from '../../data/seedData';
import { useAuth } from '../../context/AuthContext';
import { useStudentData } from '../../lib/useStudentData';
import {
  deriveNextBestAction,
  computeTrendFromPractice,
  type DetectedGap,
  type GapSeverity,
} from '../../lib/gapDetection';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const SEVERITY_LABEL: Record<GapSeverity, string> = {
  critical: 'Critical Gap',
  priority: 'Priority',
  attention: 'Needs Attention',
};

const SEVERITY_CARD: Record<GapSeverity, string> = {
  critical: 'bg-rose-50 border-rose-200',
  priority: 'bg-amber-50 border-amber-200',
  attention: 'bg-slate-50 border-slate-200',
};

const SEVERITY_BADGE: Record<GapSeverity, string> = {
  critical: 'bg-rose-100 text-rose-800 border-rose-200',
  priority: 'bg-amber-100 text-amber-800 border-amber-200',
  attention: 'bg-slate-100 text-slate-700 border-slate-200',
};

const SEVERITY_DOT: Record<GapSeverity, string> = {
  critical: 'bg-rose-500',
  priority: 'bg-amber-500',
  attention: 'bg-slate-400',
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface GapCardProps {
  gap: DetectedGap;
  index: number;
}

const GapCard: React.FC<GapCardProps> = ({ gap, index }) => (
  <div className={`p-4 rounded-xl border ${SEVERITY_CARD[gap.severity]}`}>
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-start gap-2.5 min-w-0">
        <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${SEVERITY_DOT[gap.severity]}`} />
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-900">{gap.name}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${SEVERITY_BADGE[gap.severity]}`}>
              {SEVERITY_LABEL[gap.severity]}
            </span>
          </div>
          {gap.subjectOrTopic && (
            <span className="text-[11px] text-slate-500 block mt-0.5">{gap.subjectOrTopic}</span>
          )}
          {gap.unitName && (
            <span className="text-[11px] text-slate-400">{gap.unitName}</span>
          )}
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{gap.evidence}</p>
          {gap.blockedPrerequisites.length > 0 && (
            <div className="mt-1.5 flex items-center gap-1 text-[11px] text-rose-700 font-medium">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>Prerequisite impact: {gap.blockedPrerequisites.slice(0, 2).join(', ')}</span>
            </div>
          )}
        </div>
      </div>
      <div className="shrink-0 text-right">
        <span className="text-lg font-extrabold text-slate-800">{gap.masteryScore}%</span>
        <span className="block text-[10px] text-slate-400 capitalize">{gap.layer}</span>
      </div>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export const StudentRecoveryPath: React.FC = () => {
  const { user, profile } = useAuth();
  const studentData = useStudentData(user?.id);
  const [activeTab, setActiveTab] = useState<'overview' | 'gaps' | 'misconceptions' | 'journey'>(
    'overview',
  );

  // Seed fallbacks
  const seedStudent = STUDENTS_SEED.find((s) => s.name === 'Rahul Kumar') || STUDENTS_SEED[0];
  const displayName = profile?.full_name ?? user?.user_metadata?.full_name ?? seedStudent.name;

  // ---- Derived values from real data ----
  const trend = computeTrendFromPractice(studentData.practiceSessions);
  const nextAction = deriveNextBestAction(studentData.gaps);
  const criticalGaps = studentData.gaps.filter((g) => g.severity === 'critical');
  const priorityGaps = studentData.gaps.filter((g) => g.severity === 'priority');
  const attentionGaps = studentData.gaps.filter((g) => g.severity === 'attention');

  // ---- Strongest / weakest for overview ----
  const strongest = studentData.strongestTopics.slice(0, 3);
  const weakest = studentData.weakestTopics.slice(0, 3);

  // ---- Recent accuracy ----
  const recentAccuracies = studentData.practiceSessions
    .slice(0, 5)
    .map((s) => s.accuracy)
    .filter((a): a is number => a !== null);
  const avgAccuracy =
    recentAccuracies.length > 0
      ? Math.round(recentAccuracies.reduce((s, v) => s + v, 0) / recentAccuracies.length)
      : null;

  // ---- Misconceptions ----
  const activeMisconceptions = studentData.misconceptions;

  // ---------- Loading ----------
  if (studentData.loading) {
    return (
      <div className="space-y-4">
        <LearningLoopBar currentStageId="gap_detection" />
        <div className="bg-white rounded-2xl border border-slate-200/80 p-16 shadow-xs flex flex-col items-center gap-3 text-center">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <p className="text-sm font-semibold text-slate-700">Analysing your learning intelligence…</p>
          <p className="text-xs text-slate-400">Fetching gaps, misconceptions and practice history</p>
        </div>
      </div>
    );
  }

  // ---------- Main render ----------
  return (
    <div className="space-y-6">
      {/* Learning Loop */}
      <LearningLoopBar currentStageId="gap_detection" />

      {/* Status banners */}
      {studentData.hasRealData && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Live intelligence loaded — {studentData.topicMastery.length} topics,{' '}
            {studentData.conceptMastery.length} concepts,{' '}
            {studentData.gaps.length} gap{studentData.gaps.length !== 1 ? 's' : ''} detected.
          </span>
          <button
            onClick={studentData.refresh}
            className="ml-auto flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-semibold"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      )}
      {studentData.error && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-xs font-medium text-amber-800">
          <WifiOff className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{studentData.error} Showing demo data below.</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Learning Intelligence — Insights</h2>
            {!studentData.hasRealData && <DemoDataBadge />}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {studentData.hasRealData
              ? `Evidence-based learning gap analysis for ${displayName}.`
              : `Demo insights for ${displayName} — ${DEMO_METADATA.institutionName}.`}
          </p>
        </div>

        {/* Recovery goal pill */}
        <div className="flex items-center gap-3 bg-slate-900 text-white px-4 py-2 rounded-xl">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">
              {studentData.hasRealData ? 'Overall Mastery' : 'Recovery Goal'}
            </span>
            <span className="text-xs font-bold text-emerald-400">
              {studentData.hasRealData
                ? `${studentData.overallMastery ?? '—'}%`
                : '42% → 75% Mastery'}
            </span>
          </div>
          {studentData.hasRealData && studentData.overallMastery !== null && (
            <MasteryBadge level={studentData.overallMastery} />
          )}
          {!studentData.hasRealData && (
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-xs">
              +33%
            </div>
          )}
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto">
        {(
          [
            { id: 'overview', label: 'Overview', icon: Award },
            { id: 'gaps', label: `Gaps (${studentData.hasRealData ? studentData.gaps.length : seedStudent.topicMastery.filter(t => t.score < 65).length})`, icon: Flame },
            { id: 'misconceptions', label: 'Misconceptions', icon: Brain },
            { id: 'journey', label: 'Learning Journey', icon: BookOpen },
          ] as const
        ).map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`pb-3 pt-1 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ================================================================
          TAB: OVERVIEW
          ================================================================ */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* 4-metric summary row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Overall Mastery
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-extrabold text-slate-800">
                  {studentData.hasRealData
                    ? `${studentData.overallMastery ?? '—'}%`
                    : `${seedStudent.overallMastery}%`}
                </span>
                <MasteryBadge
                  level={
                    studentData.hasRealData
                      ? (studentData.overallMastery ?? seedStudent.overallMastery)
                      : seedStudent.overallMastery
                  }
                />
              </div>
              <span className="text-[11px] text-slate-400 block mt-1">
                {studentData.hasRealData
                  ? `${studentData.topicMastery.length} topics tracked`
                  : 'Demo estimate'}
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Recent Trend
              </span>
              <div className="flex items-center gap-2 mt-1">
                {studentData.hasRealData ? (
                  trend === 'up' ? (
                    <>
                      <TrendingUp className="w-5 h-5 text-emerald-600" />
                      <span className="text-lg font-extrabold text-emerald-600">Improving</span>
                    </>
                  ) : trend === 'down' ? (
                    <>
                      <TrendingDown className="w-5 h-5 text-rose-600" />
                      <span className="text-lg font-extrabold text-rose-600">Declining</span>
                    </>
                  ) : trend === 'stable' ? (
                    <>
                      <Minus className="w-5 h-5 text-slate-500" />
                      <span className="text-lg font-extrabold text-slate-600">Stable</span>
                    </>
                  ) : (
                    <span className="text-sm font-semibold text-slate-400">Not enough history</span>
                  )
                ) : (
                  <>
                    <TrendingDown className="w-5 h-5 text-rose-600" />
                    <span className="text-lg font-extrabold text-rose-600">
                      {seedStudent.trendDelta}%
                    </span>
                  </>
                )}
              </div>
              <span className="text-[11px] text-slate-400 block mt-1">
                {avgAccuracy !== null
                  ? `Avg accuracy: ${avgAccuracy}%`
                  : studentData.hasRealData
                  ? 'Complete sessions to track'
                  : 'Declining over last 3 checks'}
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-rose-100 bg-rose-50/20 shadow-xs">
              <span className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider block">
                Detected Gaps
              </span>
              <div className="text-2xl font-extrabold text-rose-600 mt-1">
                {studentData.hasRealData
                  ? studentData.gaps.length
                  : seedStudent.topicMastery.filter((t) => t.score < 65).length}
              </div>
              <span className="text-[11px] text-rose-600/80 block mt-1">
                {studentData.hasRealData
                  ? `${criticalGaps.length} critical, ${priorityGaps.length} priority`
                  : 'Based on demo records'}
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-emerald-100 bg-emerald-50/20 shadow-xs">
              <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider block">
                Practice Sessions
              </span>
              <div className="text-2xl font-extrabold text-emerald-600 mt-1">
                {studentData.hasRealData
                  ? studentData.practiceSessions.length
                  : seedStudent.recentPracticeHours}
              </div>
              <span className="text-[11px] text-emerald-600/80 block mt-1">
                {studentData.hasRealData ? 'recorded sessions' : 'hrs/week (demo)'}
              </span>
            </div>
          </div>

          {/* Strongest & Weakest split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Doing well */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">What You're Doing Well</h3>
              </div>
              {studentData.hasRealData ? (
                strongest.length > 0 ? (
                  <div className="space-y-3">
                    {strongest.map((t, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200/70 flex items-center justify-between"
                      >
                        <div>
                          <span className="text-xs font-bold text-slate-900">{t.topicName}</span>
                          {t.subjectName && (
                            <span className="text-[11px] text-slate-500 block">{t.subjectName}</span>
                          )}
                        </div>
                        <MasteryBadge level={t.score} showPercent />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 py-4 text-center">
                    No mastery records yet — complete some assessments to see your strengths.
                  </p>
                )
              ) : (
                <div className="space-y-3">
                  {seedStudent.topicMastery
                    .filter((t) => t.score >= 75)
                    .slice(0, 3)
                    .map((t, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200/70 flex items-center justify-between"
                      >
                        <div>
                          <span className="text-xs font-bold text-slate-900">{t.topicName}</span>
                          <span className="text-[11px] text-slate-500 block">{t.subject}</span>
                        </div>
                        <MasteryBadge level={t.score} showPercent />
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Where struggling */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <h3 className="text-sm font-bold text-slate-900">Where You're Struggling</h3>
              </div>
              {studentData.hasRealData ? (
                weakest.length > 0 ? (
                  <div className="space-y-3">
                    {weakest.map((t, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-rose-50/40 border border-rose-200/70 flex items-center justify-between"
                      >
                        <div>
                          <span className="text-xs font-bold text-slate-900">{t.topicName}</span>
                          {t.subjectName && (
                            <span className="text-[11px] text-slate-500 block">{t.subjectName}</span>
                          )}
                        </div>
                        <MasteryBadge level={t.score} showPercent />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 py-4 text-center">
                    No mastery records yet.
                  </p>
                )
              ) : (
                <div className="space-y-3">
                  {seedStudent.topicMastery
                    .filter((t) => t.score < 65)
                    .slice(0, 3)
                    .map((t, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-rose-50/40 border border-rose-200/70 flex items-center justify-between"
                      >
                        <div>
                          <span className="text-xs font-bold text-slate-900">{t.topicName}</span>
                          <span className="text-[11px] text-slate-500 block">{t.subject}</span>
                        </div>
                        <MasteryBadge level={t.score} showPercent />
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Next Best Learning Action */}
          <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Next Best Learning Action</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 ml-auto">
                Deterministic Priority
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Recommended Action
                  </span>
                  <div className="text-base font-extrabold text-white mt-0.5">
                    {studentData.hasRealData ? nextAction.action : 'Concept Repair'}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Target
                  </span>
                  <div className="text-sm font-bold text-indigo-300 mt-0.5">
                    {studentData.hasRealData
                      ? nextAction.target
                      : 'Discriminant Calculation (Δ = b² - 4ac)'}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 leading-relaxed">
                  <span className="font-bold text-slate-200 block mb-1">Why this is the priority:</span>
                  {studentData.hasRealData
                    ? nextAction.reason
                    : 'Learning gap detected: concept mastery is 42% — blocks prerequisite for quadratic formula application.'}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Recovery Steps
                </span>
                {(studentData.hasRealData ? nextAction.steps : [
                  'Review core concepts in Discriminant Calculation',
                  'Complete 3–5 targeted practice questions',
                  'Complete a confidence calibration check',
                  'Reassess to measure recovery gain',
                ]).map((step, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs">
                    <span className="w-5 h-5 rounded-md bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-slate-300">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recovery Score Card (seed-based demo metric) */}
          {!studentData.hasRealData && <RecoveryMetricCard data={RECOVERY_SCORE_DATA} />}

          {/* Real practice history */}
          {studentData.hasRealData && studentData.practiceSessions.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Recent Practice History</h3>
              </div>
              <div className="space-y-2">
                {studentData.practiceSessions.slice(0, 5).map((s) => (
                  <div
                    key={s.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between"
                  >
                    <div className="text-xs">
                      <span className="font-semibold text-slate-700">
                        {s.correctCount ?? '—'}/{s.questionCount ?? '—'} correct
                      </span>
                      <span className="text-slate-400 block text-[11px]">
                        {new Date(s.practisedAt).toLocaleDateString(undefined, {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    {s.accuracy !== null && (
                      <span
                        className={`text-sm font-extrabold ${
                          s.accuracy >= 75
                            ? 'text-emerald-600'
                            : s.accuracy >= 60
                            ? 'text-amber-600'
                            : 'text-rose-600'
                        }`}
                      >
                        {s.accuracy}%
                      </span>
                    )}
                  </div>
                ))}
              </div>
              {studentData.practiceSessions.length === 0 && (
                <p className="text-xs text-slate-400 py-4 text-center">
                  No practice sessions recorded yet.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* ================================================================
          TAB: GAPS
          ================================================================ */}
      {activeTab === 'gaps' && (
        <div className="space-y-4">
          {/* Summary header */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <Flame className="w-5 h-5 text-rose-600" />
              <div>
                <h3 className="text-base font-bold text-slate-900">Learning Gap Analysis</h3>
                <p className="text-xs text-slate-500">
                  {studentData.hasRealData
                    ? 'Gaps detected deterministically from your Supabase mastery records.'
                    : 'Demo gap analysis — connect Supabase to see your real gaps.'}
                </p>
              </div>
            </div>
            {studentData.hasRealData && (
              <div className="flex items-center gap-3 ml-auto text-xs font-semibold">
                <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                  {criticalGaps.length} critical
                </span>
                <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  {priorityGaps.length} priority
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  {attentionGaps.length} attention
                </span>
              </div>
            )}
          </div>

          {/* Real gaps */}
          {studentData.hasRealData ? (
            studentData.gaps.length === 0 ? (
              <div className="bg-white rounded-2xl border border-emerald-200 p-12 shadow-xs text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">No learning gaps detected</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  All your tracked topics and concepts are above the proficiency threshold.
                  Keep up the consistent practice!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {criticalGaps.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2 px-1">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">
                        Critical Gaps — Immediate Attention Required
                      </span>
                    </div>
                    {criticalGaps.map((g, i) => <GapCard key={g.id} gap={g} index={i} />)}
                  </div>
                )}
                {priorityGaps.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2 px-1 mt-4">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                        Priority Gaps — Focus Practice Here
                      </span>
                    </div>
                    {priorityGaps.map((g, i) => <GapCard key={g.id} gap={g} index={i} />)}
                  </div>
                )}
                {attentionGaps.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2 px-1 mt-4">
                      <span className="w-2 h-2 rounded-full bg-slate-400" />
                      <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Needs Attention — Below Proficiency Threshold
                      </span>
                    </div>
                    {attentionGaps.map((g, i) => <GapCard key={g.id} gap={g} index={i} />)}
                  </div>
                )}
              </div>
            )
          ) : (
            /* Seed-based demo gaps */
            <div className="space-y-3">
              {seedStudent.topicMastery
                .filter((t) => t.score < 65)
                .map((t, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-xl border ${
                      t.score < 45
                        ? 'bg-rose-50 border-rose-200'
                        : t.score < 60
                        ? 'bg-amber-50 border-amber-200'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold text-slate-900">{t.topicName}</span>
                        <span className="text-[11px] text-slate-500 block">{t.subject}</span>
                        <p className="text-xs text-slate-600 mt-1">
                          {t.score < 45
                            ? 'Learning gap detected: topic mastery below critical threshold.'
                            : t.score < 60
                            ? 'Repeated weakness observed: mastery below proficiency target.'
                            : 'Needs attention: mastery slightly below 65% proficiency threshold.'}
                        </p>
                      </div>
                      <MasteryBadge level={t.score} showPercent />
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* ================================================================
          TAB: MISCONCEPTIONS
          ================================================================ */}
      {activeTab === 'misconceptions' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-1">
              <Brain className="w-4 h-4 text-amber-600" />
              <h3 className="text-base font-bold text-slate-900">Detected Misconceptions</h3>
            </div>
            <p className="text-xs text-slate-500">
              {studentData.hasRealData
                ? 'Active misconceptions from your Supabase records, with supporting evidence.'
                : 'Demo misconceptions — connect Supabase to see your personal patterns.'}
            </p>
          </div>

          {studentData.hasRealData ? (
            activeMisconceptions.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-12 shadow-xs text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">
                  No recurring misconceptions detected yet.
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Misconceptions are identified from patterns in your assessment responses.
                  Complete more practice sessions for the system to analyse your error patterns.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeMisconceptions.map((m) => (
                  <div
                    key={m.id}
                    className="bg-white rounded-2xl border border-amber-200/80 p-5 shadow-xs"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                        <AlertCircle className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900">{m.description}</p>
                        {m.evidence && (
                          <div className="mt-2 p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-700 leading-relaxed">
                            <span className="font-bold text-slate-800 block mb-0.5">
                              Evidence:
                            </span>
                            {m.evidence}
                          </div>
                        )}
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                          {m.confidence !== null && (
                            <span className="text-[11px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                              {m.confidence}% detection confidence
                            </span>
                          )}
                          {m.status && (
                            <span className="text-[11px] text-slate-500 capitalize font-medium">
                              Status: {m.status}
                            </span>
                          )}
                          <span className="text-[11px] text-slate-400">
                            Detected: {new Date(m.detectedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            /* Demo misconceptions from seed */
            <div className="space-y-3">
              {MISCONCEPTIONS_SEED.slice(0, 2).map((m) => (
                <div
                  key={m.id}
                  className="bg-white rounded-2xl border border-amber-200/80 p-5 shadow-xs"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs font-bold text-indigo-700">{m.topic}</span>
                        <span className="text-slate-400 text-xs">→</span>
                        <span className="text-xs font-semibold text-slate-700">{m.concept}</span>
                      </div>
                      <p className="text-sm font-bold text-slate-900">{m.misconception}</p>
                      <div className="mt-2 p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-700 leading-relaxed">
                        <span className="font-bold text-slate-800 block mb-0.5">Evidence:</span>
                        {m.evidence}
                      </div>
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <span className="text-[11px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                          {m.confidenceScore}% detection confidence
                        </span>
                        <span className="text-[11px] text-indigo-700 font-medium">
                          {m.studentsAffected} students affected
                        </span>
                      </div>
                      <div className="mt-2 p-2.5 rounded-lg bg-indigo-50 border border-indigo-200 text-xs text-indigo-800">
                        <span className="font-bold">Recommended correction: </span>
                        {m.recommendedIntervention}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================================================================
          TAB: LEARNING JOURNEY
          ================================================================ */}
      {activeTab === 'journey' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900">Your Learning Journey</h3>
            </div>
            <p className="text-xs text-slate-500">
              The complete 11-stage closed learning loop — from pre-class preview to verified mastery recovery.
            </p>
          </div>

          {/* Full loop stages */}
          <LearningLoopBar currentStageId="gap_detection" compact={false} />

          {/* Stage explanations relevant to this student */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                stage: 'Pre-Class Preview',
                status: 'completed',
                note: 'Prerequisite check completed — 1 gap identified in sign rules.',
                color: 'emerald',
              },
              {
                stage: 'Gap Detection',
                status: 'active',
                note: studentData.hasRealData
                  ? `${studentData.gaps.length} gap${studentData.gaps.length !== 1 ? 's' : ''} detected from your mastery records.`
                  : 'Discriminant calculation gap detected — mastery at 42%.',
                color: 'indigo',
              },
              {
                stage: 'Adaptive Practice',
                status: studentData.practiceSessions.length > 0 ? 'completed' : 'upcoming',
                note:
                  studentData.practiceSessions.length > 0
                    ? `${studentData.practiceSessions.length} session${studentData.practiceSessions.length !== 1 ? 's' : ''} completed.`
                    : 'No practice sessions recorded yet.',
                color: studentData.practiceSessions.length > 0 ? 'emerald' : 'slate',
              },
              {
                stage: 'Reassessment',
                status: 'upcoming',
                note: 'Complete the adaptive practice sequence to unlock reassessment.',
                color: 'slate',
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`p-4 rounded-xl border ${
                  item.status === 'completed'
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : item.status === 'active'
                    ? 'bg-indigo-50/50 border-indigo-200 ring-2 ring-indigo-100'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900">{item.stage}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      item.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.status === 'active'
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600">{item.note}</p>
              </div>
            ))}
          </div>

          {/* Progress & Recovery section */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">Progress & Recovery</h3>
            </div>

            {studentData.hasRealData && studentData.practiceSessions.length >= 2 ? (
              (() => {
                const sessions = [...studentData.practiceSessions]
                  .sort((a, b) => new Date(a.practisedAt).getTime() - new Date(b.practisedAt).getTime());
                const first = sessions[0];
                const last = sessions[sessions.length - 1];
                const delta =
                  first.accuracy !== null && last.accuracy !== null
                    ? last.accuracy - first.accuracy
                    : null;

                return (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 text-center">
                        <span className="text-[11px] text-slate-500 uppercase tracking-wider block">
                          First Session
                        </span>
                        <span className="text-2xl font-extrabold text-slate-700 mt-1 block">
                          {first.accuracy ?? '—'}%
                        </span>
                      </div>
                      <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/70 text-center">
                        <span className="text-[11px] text-emerald-700 uppercase tracking-wider block">
                          Latest Session
                        </span>
                        <span className="text-2xl font-extrabold text-emerald-700 mt-1 block">
                          {last.accuracy ?? '—'}%
                        </span>
                      </div>
                      <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-200/60 text-center">
                        <span className="text-[11px] text-indigo-700 uppercase tracking-wider block">
                          Net Change
                        </span>
                        <span
                          className={`text-2xl font-extrabold mt-1 block ${
                            delta === null
                              ? 'text-slate-500'
                              : delta > 0
                              ? 'text-emerald-700'
                              : delta < 0
                              ? 'text-rose-600'
                              : 'text-slate-600'
                          }`}
                        >
                          {delta !== null ? `${delta > 0 ? '+' : ''}${delta}%` : '—'}
                        </span>
                      </div>
                    </div>
                    {delta !== null && (
                      <p className="text-xs text-slate-600 text-center">
                        {delta > 0
                          ? `Improvement of ${delta} percentage points across ${sessions.length} recorded sessions.`
                          : delta < 0
                          ? `Accuracy declined by ${Math.abs(delta)} points — consider a targeted practice reset.`
                          : 'Accuracy is stable across recorded sessions.'}
                      </p>
                    )}
                  </div>
                );
              })()
            ) : (
              <div className="py-8 text-center space-y-2">
                <p className="text-sm font-semibold text-slate-600">
                  {studentData.hasRealData
                    ? 'Not enough history yet.'
                    : 'Demo recovery data below.'}
                </p>
                <p className="text-xs text-slate-400">
                  {studentData.hasRealData
                    ? 'Complete at least 2 practice sessions to track your progress over time.'
                    : 'Connect Supabase and complete practice sessions to track real recovery.'}
                </p>
                {!studentData.hasRealData && (
                  <div className="mt-4">
                    <RecoveryMetricCard data={RECOVERY_SCORE_DATA} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
