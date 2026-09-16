import React, { useMemo } from 'react';
import {
  Sparkles,
  Target,
  Clock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Flame,
  Bot,
  Loader2,
  WifiOff,
  Calendar,
  ShieldCheck,
} from 'lucide-react';
import { STUDENTS_SEED, PRE_CLASS_PREVIEW_TOMORROW, DEMO_METADATA } from '../../data/seedData';
import { MasteryBadge, RiskBadge, TrendBadge, DemoDataBadge } from '../shared/StatusBadge';
import { LearningLoopBar, LEARNING_LOOP_STAGES } from '../shared/LearningLoopBar';
import { useAuth } from '../../context/AuthContext';
import { useStudentData } from '../../lib/useStudentData';
import type { DetectedGap, GapSeverity } from '../../lib/gapDetection';

interface StudentHomeProps {
  onNavigate: (tabId: string) => void;
}

const SEVERITY_COLOURS: Record<GapSeverity, string> = {
  critical: 'bg-rose-50 border-rose-200 text-rose-900',
  moderate: 'bg-amber-50 border-amber-200 text-amber-900',
  attention: 'bg-slate-50 border-slate-200 text-slate-800',
};
const SEVERITY_DOT: Record<GapSeverity, string> = {
  critical: 'bg-rose-500',
  moderate: 'bg-amber-500',
  attention: 'bg-slate-400',
};

function loopNav(stageId: string): string {
  if (stageId === 'pre_class_preview' || stageId === 'before_class') return 'pre_class';
  if (stageId === 'adaptive_practice' || stageId === 'quick_check' || stageId === 'assessment' || stageId === 'reassessment') {
    return 'practice';
  }
  if (stageId === 'gap_detection' || stageId === 'risk_analysis' || stageId === 'intervention' || stageId === 'mastery_recovery') {
    return 'insights';
  }
  if (stageId === 'classroom') return 'home';
  return 'home';
}

export const StudentHome: React.FC<StudentHomeProps> = ({ onNavigate }) => {
  const { user, profile } = useAuth();
  const studentData = useStudentData(user?.id);

  const seedStudent =
    STUDENTS_SEED.find((s) => s.name === 'Aarav Mehta') ||
    STUDENTS_SEED.find((s) => s.name === 'Rahul Kumar') ||
    STUDENTS_SEED[0];
  const preClass = PRE_CLASS_PREVIEW_TOMORROW;

  const displayMastery = studentData.hasRealData
    ? (studentData.overallMastery ?? seedStudent.overallMastery)
    : seedStudent.overallMastery;

  const displayName = profile?.full_name ?? user?.user_metadata?.full_name ?? seedStudent.name;

  const topicWeaknesses =
    studentData.hasRealData && studentData.weakestTopics.length > 0
      ? studentData.weakestTopics.slice(0, 5).map((t) => ({
          topicName: t.topicName,
          subject: t.subjectName ?? '—',
          score: t.score,
        }))
      : seedStudent.topicMastery;

  const displayGaps: DetectedGap[] = studentData.hasRealData
    ? studentData.gaps.slice(0, 4)
    : seedStudent.topicMastery
        .filter((tm) => tm.score < 65)
        .slice(0, 4)
        .map((tm) => ({
          layer: 'topic' as const,
          id: tm.topicName,
          name: tm.topicName,
          subject: tm.subject,
          topic: tm.topicName,
          subjectOrTopic: tm.subject,
          masteryScore: tm.score,
          mastery: tm.score,
          severity: (tm.score < 45 ? 'critical' : tm.score < 60 ? 'moderate' : 'attention') as GapSeverity,
          evidence: `Learning signal: topic mastery is ${tm.score}% — below the 65% proficiency threshold.`,
          evidenceSignals: [`topic_mastery=${tm.score}`],
          prerequisiteImpact: 'May slow upcoming lessons in this unit.',
          recommendedFocus: `Repair ${tm.topicName}`,
          blockedPrerequisites: [],
          lastUpdated: seedStudent.lastAssessmentDate,
        }));

  const nextAction = studentData.hasRealData
    ? studentData.nextAction
    : {
        action: 'Prepare for class',
        target: preClass.topicTitle,
        reason: 'Demo next action: complete the 3-minute readiness check before tomorrow’s quadratic lesson.',
        navHint: 'pre_class' as const,
        severity: 'moderate' as GapSeverity,
      };

  const trendLabel = studentData.hasRealData ? studentData.trend : seedStudent.trend;
  const trendDelta = studentData.hasRealData
    ? studentData.trendDelta
    : seedStudent.trendDelta;

  const upcomingTitle =
    studentData.upcomingSession?.topicName ||
    studentData.upcomingSession?.title ||
    preClass.topicTitle;
  const upcomingWhen = studentData.upcomingSession?.scheduledAt
    ? new Date(studentData.upcomingSession.scheduledAt).toLocaleString(undefined, {
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    : preClass.scheduledFor;

  const readinessPct =
    studentData.learningEvents.find((e) => e.eventType === 'preclass_readiness')?.metadata
      ?.readiness;
  const displayReadiness =
    typeof readinessPct === 'number' ? Math.round(readinessPct) : preClass.readinessPercentage;

  const activeRecovery = studentData.interventions.find((i) =>
    ['active', 'in_progress', 'open'].includes(String(i.status ?? '')),
  );

  const insight = studentData.insights[0];

  const lastActivity = useMemo(() => {
    const dates = [
      ...studentData.practiceSessions.map((s) => s.practisedAt),
      ...studentData.attempts.map((a) => a.createdAt),
    ]
      .map((d) => new Date(d).getTime())
      .filter((n) => Number.isFinite(n));
    if (dates.length === 0) return seedStudent.lastAssessmentDate;
    return new Date(Math.max(...dates)).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, [studentData.practiceSessions, studentData.attempts, seedStudent.lastAssessmentDate]);

  if (studentData.loading) {
    return (
      <div className="space-y-4">
        <LearningLoopBar currentStageId="pre_class_preview" onSelectStage={(id) => onNavigate(loopNav(id))} />
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 shadow-xs flex flex-col items-center gap-3 text-center">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <p className="text-sm font-semibold text-slate-700">Loading your learning intelligence…</p>
          <p className="text-xs text-slate-400">Fetching mastery, assessments, and recovery signals</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <LearningLoopBar
        currentStageId={studentData.hasRealData ? studentData.loopStageId : 'pre_class_preview'}
        onSelectStage={(id) => onNavigate(loopNav(id))}
      />

      {studentData.hasRealData && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Live learning data from Supabase — {studentData.topicMastery.length} topics,{' '}
            {studentData.conceptMastery.length} concepts, {studentData.gaps.length} gap
            {studentData.gaps.length !== 1 ? 's' : ''} from recorded evidence.
          </span>
        </div>
      )}

      {studentData.error && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-xs font-medium text-amber-800">
          <WifiOff className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{studentData.error} Showing demo data as a preview.</span>
        </div>
      )}

      {!studentData.loading && !studentData.hasRealData && !studentData.error && user && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-600">
          <AlertCircle className="w-4 h-4 text-slate-400 shrink-0" />
          <span>
            No mastery records yet for this account. Demo intelligence is shown until assessments or
            practice sessions are recorded.
          </span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <img
              src={profile?.avatar_url || seedStudent.avatarUrl}
              alt={displayName}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-100 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-slate-900">{displayName}</h1>
                {!studentData.hasRealData && <DemoDataBadge />}
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
                  {studentData.upcomingSession?.className || seedStudent.className}
                </span>
                <RiskBadge
                  risk={
                    studentData.riskSignals[0]?.riskLevel === 'critical'
                      ? 'critical'
                      : studentData.riskSignals[0]?.riskLevel === 'elevated'
                      ? 'elevated'
                      : studentData.hasRealData && studentData.gaps.some((g) => g.severity === 'critical')
                      ? 'watch'
                      : seedStudent.riskLevel
                  }
                />
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {DEMO_METADATA.institutionName} • Last activity: {lastActivity}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="btn-student-home-preclass"
              onClick={() => onNavigate('pre_class')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Pre-Class Preview ({displayReadiness}%)</span>
            </button>
            <button
              id="btn-student-home-tutor"
              onClick={() => onNavigate('tutor')}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Bot className="w-3.5 h-3.5 text-indigo-400" />
              <span>Pulse Tutor</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Overall Mastery
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold text-slate-800">{displayMastery}%</span>
              <MasteryBadge level={displayMastery} />
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              {studentData.hasRealData
                ? `Mean of ${studentData.topicMastery.length || studentData.conceptMastery.length} recorded scores`
                : 'Demo mean of topic scores'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Mastery Trend
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              {trendDelta == null ? (
                <span className="text-sm font-semibold text-slate-400">Need 2+ sessions</span>
              ) : (
                <>
                  <span
                    className={`text-2xl font-extrabold ${
                      trendDelta < 0 ? 'text-rose-600' : trendDelta > 0 ? 'text-emerald-600' : 'text-slate-700'
                    }`}
                  >
                    {trendDelta > 0 ? '+' : ''}
                    {trendDelta}%
                  </span>
                  {trendLabel && <TrendBadge trend={trendLabel} />}
                </>
              )}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              {studentData.recentAccuracy != null
                ? `Recent accuracy ${studentData.recentAccuracy}%`
                : 'From recorded practice, not predicted'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Upcoming Session
            </span>
            <div className="text-sm font-bold text-slate-800 mt-1 truncate">{upcomingTitle}</div>
            <span className="text-[11px] text-indigo-600 font-semibold mt-1 block flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {upcomingWhen} · readiness {displayReadiness}%
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Activity streak
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold text-indigo-700">
                {studentData.hasRealData ? studentData.activityStreak : 3}
              </span>
              <span className="text-xs text-slate-500">days</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Consecutive days with recorded activity
            </span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl border border-indigo-200/80 p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            Recommended next
          </div>
          <p className="text-sm font-extrabold text-slate-900 mt-1">
            {nextAction.action}: {nextAction.target}
          </p>
          <p className="text-xs text-indigo-900/80 leading-relaxed mt-1 max-w-2xl">{nextAction.reason}</p>
        </div>
        <button
          onClick={() => onNavigate(nextAction.navHint || 'practice')}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
        >
          Start now
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between gap-2 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                    Pre-class readiness
                  </span>
                  <h3 className="text-base font-bold text-white">{upcomingTitle}</h3>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase">Readiness</span>
                <span className="text-lg font-extrabold text-amber-400">{displayReadiness}%</span>
              </div>
            </div>

            <div className="my-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
              {preClass.prerequisites.map((p) => {
                const live = studentData.conceptMastery.find(
                  (c) => c.concept_name.toLowerCase() === p.name.toLowerCase(),
                );
                const score = live?.mastery_score ?? p.masteryPercentage;
                const ok = score >= 65;
                return (
                  <div key={p.id} className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80">
                    <span className="text-[11px] text-slate-400 truncate block">{p.name}</span>
                    <div className="flex items-center justify-between mt-1">
                      <span className={`text-xs font-bold ${ok ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {score}%
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-1.5 rounded ${
                          ok ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        {ok ? 'OK' : 'GAP'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3.5 rounded-xl bg-indigo-900/40 border border-indigo-700/50 text-xs text-indigo-100 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                {insight
                  ? `${insight.headline}. ${insight.detail}`
                  : preClass.aiInsight}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {LEARNING_LOOP_STAGES.find((s) => s.id === (studentData.loopStageId || 'pre_class_preview'))?.label}
              </span>
              <button
                onClick={() => onNavigate('pre_class')}
                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
              >
                Open readiness check
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Topics needing attention</h3>
                  <p className="text-xs text-slate-500">Deterministic gaps from recorded mastery — not AI guesses</p>
                </div>
              </div>
            </div>

            {displayGaps.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <p className="text-sm font-bold text-slate-700">No learning gaps detected</p>
                <p className="text-xs text-slate-400">Tracked topics are at or above the 65% threshold.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {displayGaps.map((gap, idx) => (
                  <div
                    key={gap.id + idx}
                    className={`p-3 rounded-xl border flex items-start justify-between gap-3 ${SEVERITY_COLOURS[gap.severity]}`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${SEVERITY_DOT[gap.severity]}`} />
                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate">{gap.name}</div>
                        <div className="text-[11px] opacity-70 truncate">
                          {[gap.subject, gap.unit, gap.topic].filter(Boolean).join(' · ')}
                        </div>
                        <div className="text-[11px] mt-0.5 opacity-80">{gap.evidence}</div>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="text-base font-extrabold">{gap.masteryScore}%</span>
                      <span className="block text-[10px] font-bold uppercase tracking-wide mt-0.5">
                        {gap.severity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => onNavigate('insights')}
              className="mt-4 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
            >
              Open insights & recovery path
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {activeRecovery && (
            <div className="bg-white rounded-2xl border border-emerald-200 p-5 shadow-xs">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs mb-2">
                <ShieldCheck className="w-4 h-4" />
                Active recovery
              </div>
              <p className="text-sm font-bold text-slate-900">{activeRecovery.title}</p>
              <p className="text-xs text-slate-500 mt-1">
                {activeRecovery.beforeMastery != null
                  ? `Before: ${activeRecovery.beforeMastery}%`
                  : 'In progress'}
                {activeRecovery.afterMastery != null ? ` → After: ${activeRecovery.afterMastery}%` : ''}
              </p>
              <button
                onClick={() => onNavigate('insights')}
                className="mt-3 w-full py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl"
              >
                Continue recovery
              </button>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              Topic mastery
            </h3>
            {topicWeaknesses.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No topic mastery yet.</p>
            ) : (
              <div className="space-y-3">
                {topicWeaknesses.map((tm, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">{tm.topicName}</span>
                      <span className="text-[10px] text-slate-400">{tm.subject}</span>
                    </div>
                    <MasteryBadge level={tm.score} showPercent />
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => onNavigate('learn')}
              className="mt-4 w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
            >
              Knowledge map
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-600" />
              Recent activity
            </h3>
            {studentData.hasRealData &&
            (studentData.practiceSessions.length > 0 || studentData.attempts.length > 0) ? (
              <div className="space-y-2">
                {studentData.attempts.slice(0, 2).map((a) => (
                  <div
                    key={a.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between text-xs"
                  >
                    <span className="font-semibold text-slate-700 truncate">
                      {a.assessmentTitle || 'Assessment'}
                    </span>
                    <span className="font-extrabold text-slate-800">{a.score ?? '—'}%</span>
                  </div>
                ))}
                {studentData.practiceSessions.slice(0, 3).map((s) => (
                  <div
                    key={s.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between"
                  >
                    <div className="text-xs">
                      <span className="font-semibold text-slate-700">
                        Practice {s.correctCount ?? '—'}/{s.questionCount ?? '—'}
                      </span>
                      <span className="text-slate-400 block text-[11px]">
                        {new Date(s.practisedAt).toLocaleDateString()}
                      </span>
                    </div>
                    {s.accuracy != null && (
                      <span className="text-sm font-extrabold text-indigo-700">{s.accuracy}%</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                Complete a practice session to start a recorded activity trail.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
