/**
 * LearnPulse AI — useStudentData
 *
 * Fetches student learning intelligence from Supabase using the
 * publishable key + RLS. Individual query failures never crash the hook.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { getSupabase } from './supabase';
import {
  detectGaps,
  computeOverallMastery,
  getStrongestTopics,
  getWeakestTopics,
  computeTrendFromPractice,
  computeTrendDelta,
  deriveNextBestAction,
  computeActivityStreak,
  detectConfidenceMismatches,
  deriveRepeatedErrorSignals,
  computeLearningRecoveryScore,
  buildEvidenceInsights,
  currentLoopStage,
  TopicMasteryRow,
  ConceptMasteryRow,
  PrerequisiteEdge,
  DetectedGap,
  MasteryHighlight,
  NextBestAction,
  EvidenceInsight,
  ConfidenceMismatch,
  RepeatedErrorSignal,
  LearningRecoveryMetric,
} from './gapDetection';

interface RawTopicMasteryRow {
  id: string;
  student_id: string | null;
  topic_id: string | null;
  mastery_score: number | null;
  trend: string | null;
  attempts_count: number | null;
  updated_at: string;
  topics: {
    name: string;
    units: {
      name: string;
      subjects: {
        name: string;
      } | null;
    } | null;
  } | null;
}

interface RawConceptMasteryRow {
  id: string;
  student_id: string | null;
  concept_id: string | null;
  mastery_score: number | null;
  updated_at: string;
  concepts: {
    name: string;
    topic_id: string | null;
    topics: {
      name: string;
    } | null;
  } | null;
}

interface RawMisconceptionRow {
  id: string;
  student_id: string | null;
  topic_id: string | null;
  concept_id: string | null;
  description: string | null;
  evidence: string | null;
  confidence: string | number | null;
  status: string | null;
  created_at: string;
}

interface RawRiskSignalRow {
  id: string;
  student_id: string | null;
  class_id: string | null;
  evidence: string | null;
  risk_level: string | null;
  explanation: string | null;
  created_at: string;
}

interface RawPracticeSessionRow {
  id: string;
  student_id: string | null;
  topic_id: string | null;
  score: number | null;
  correct_count: number | null;
  question_count: number | null;
  created_at: string;
}

export type { TopicMasteryRow, ConceptMasteryRow, PrerequisiteEdge, DetectedGap, MasteryHighlight };

export interface StudentMisconception {
  id: string;
  topicId: string | null;
  conceptId: string | null;
  description: string;
  evidence: string | null;
  confidence: number | null;
  status: string | null;
  detectedAt: string;
  likely: boolean;
}

export interface StudentRiskSignal {
  id: string;
  riskLevel: string | null;
  evidence: string | null;
  explanation: string | null;
  detectedAt: string;
}

export interface RecentPracticeSession {
  id: string;
  topicId: string | null;
  score: number | null;
  correctCount: number | null;
  questionCount: number | null;
  accuracy: number | null;
  practisedAt: string;
}

export interface StudentAttempt {
  id: string;
  assessmentId: string | null;
  score: number | null;
  createdAt: string;
  assessmentTitle?: string;
}

export interface StudentResponse {
  id: string;
  attemptId: string | null;
  questionId: string | null;
  isCorrect: boolean | null;
  confidence: string | number | null;
  createdAt: string;
  conceptId: string | null;
  conceptName: string | null;
}

export interface StudentIntervention {
  id: string;
  title: string | null;
  status: string | null;
  topicId: string | null;
  topicName?: string | null;
  beforeMastery: number | null;
  afterMastery: number | null;
  createdAt: string;
}

export interface UpcomingSession {
  id: string;
  title: string | null;
  scheduledAt: string | null;
  topicId: string | null;
  topicName?: string | null;
  className?: string | null;
}

export interface BankQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctAnswer: string | number;
  explanation: string | null;
  difficulty: string | null;
  topicId: string | null;
  conceptId: string | null;
  conceptName?: string | null;
}

export interface LearningEventRow {
  id: string;
  eventType: string | null;
  topicId: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface StudentDataResult {
  topicMastery: TopicMasteryRow[];
  conceptMastery: ConceptMasteryRow[];
  misconceptions: StudentMisconception[];
  riskSignals: StudentRiskSignal[];
  practiceSessions: RecentPracticeSession[];
  prerequisites: PrerequisiteEdge[];
  attempts: StudentAttempt[];
  responses: StudentResponse[];
  interventions: StudentIntervention[];
  learningEvents: LearningEventRow[];
  upcomingSession: UpcomingSession | null;
  questionBank: BankQuestion[];
  gaps: DetectedGap[];
  overallMastery: number | null;
  strongestTopics: MasteryHighlight[];
  weakestTopics: MasteryHighlight[];
  nextAction: NextBestAction;
  insights: EvidenceInsight[];
  confidenceMismatches: ConfidenceMismatch[];
  repeatedErrors: RepeatedErrorSignal[];
  recoveryMetric: LearningRecoveryMetric | null;
  activityStreak: number;
  recentAccuracy: number | null;
  trend: 'up' | 'down' | 'stable' | null;
  trendDelta: number | null;
  loopStageId: string;
  loading: boolean;
  error: string | null;
  hasRealData: boolean;
  refresh: () => void;
}

function parseOptions(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.map((v) => String(v));
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.map((v) => String(v));
    } catch {
      return [];
    }
  }
  return [];
}

function parseConfidence(value: string | number | null): number | null {
  if (value == null) return null;
  if (typeof value === 'number') return value;
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : null;
}

export function useStudentData(userId: string | null | undefined): StudentDataResult {
  const [topicMastery, setTopicMastery] = useState<TopicMasteryRow[]>([]);
  const [conceptMastery, setConceptMastery] = useState<ConceptMasteryRow[]>([]);
  const [misconceptions, setMisconceptions] = useState<StudentMisconception[]>([]);
  const [riskSignals, setRiskSignals] = useState<StudentRiskSignal[]>([]);
  const [practiceSessions, setPracticeSessions] = useState<RecentPracticeSession[]>([]);
  const [prerequisites, setPrerequisites] = useState<PrerequisiteEdge[]>([]);
  const [attempts, setAttempts] = useState<StudentAttempt[]>([]);
  const [responses, setResponses] = useState<StudentResponse[]>([]);
  const [interventions, setInterventions] = useState<StudentIntervention[]>([]);
  const [learningEvents, setLearningEvents] = useState<LearningEventRow[]>([]);
  const [upcomingSession, setUpcomingSession] = useState<UpcomingSession | null>(null);
  const [questionBank, setQuestionBank] = useState<BankQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchCount, setFetchCount] = useState(0);

  const refresh = useCallback(() => setFetchCount((c) => c + 1), []);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const supabase = getSupabase();
    if (!supabase) {
      setError('Supabase is not configured — showing demo data.');
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    async function fetchAll() {
      if (!supabase) return;
      try {
        const [
          topicMasteryResult,
          conceptMasteryResult,
          misconceptionsResult,
          riskSignalsResult,
          practiceSessionsResult,
          prerequisitesResult,
          attemptsResult,
          interventionsResult,
          eventsResult,
          membershipResult,
          questionsResult,
        ] = await Promise.allSettled([
          supabase
            .from('student_topic_mastery')
            .select(`
              id, student_id, topic_id, mastery_score, trend, attempts_count, updated_at,
              topics ( name, units ( name, subjects ( name ) ) )
            `)
            .eq('student_id', userId!)
            .order('mastery_score', { ascending: true }),
          supabase
            .from('student_concept_mastery')
            .select(`
              id, student_id, concept_id, mastery_score, updated_at,
              concepts ( name, topic_id, topics ( name ) )
            `)
            .eq('student_id', userId!)
            .order('mastery_score', { ascending: true }),
          supabase
            .from('misconceptions')
            .select('id, student_id, topic_id, concept_id, description, evidence, confidence, status, created_at')
            .eq('student_id', userId!)
            .order('created_at', { ascending: false })
            .limit(10),
          supabase
            .from('risk_signals')
            .select('id, student_id, class_id, evidence, risk_level, explanation, created_at')
            .eq('student_id', userId!)
            .order('created_at', { ascending: false })
            .limit(5),
          supabase
            .from('practice_sessions')
            .select('id, student_id, topic_id, score, correct_count, question_count, created_at')
            .eq('student_id', userId!)
            .order('created_at', { ascending: false })
            .limit(10),
          supabase.from('prerequisites').select('concept_id, prerequisite_concept_id'),
          supabase
            .from('attempts')
            .select('id, student_id, assessment_id, score, created_at, assessments ( title )')
            .eq('student_id', userId!)
            .order('created_at', { ascending: false })
            .limit(12),
          supabase
            .from('interventions')
            .select('id, student_id, topic_id, title, status, before_mastery, after_mastery, created_at, topics ( name )')
            .eq('student_id', userId!)
            .order('created_at', { ascending: false })
            .limit(8),
          supabase
            .from('learning_events')
            .select('id, student_id, topic_id, event_type, metadata, created_at')
            .eq('student_id', userId!)
            .order('created_at', { ascending: false })
            .limit(30),
          supabase.from('class_members').select('class_id').eq('student_id', userId!),
          supabase
            .from('questions')
            .select('id, topic_id, concept_id, question_text, options, correct_answer, explanation, difficulty, concepts ( name )')
            .limit(24),
        ]);

        if (cancelled) return;

        if (topicMasteryResult.status === 'fulfilled' && !topicMasteryResult.value.error) {
          const rows = (topicMasteryResult.value.data ?? []) as unknown as RawTopicMasteryRow[];
          setTopicMastery(
            rows
              .filter((r) => r.topic_id != null)
              .map((r) => ({
                id: r.id,
                topic_id: r.topic_id!,
                topic_name: r.topics?.name ?? 'Unknown Topic',
                unit_name: r.topics?.units?.name ?? undefined,
                subject_name: r.topics?.units?.subjects?.name ?? undefined,
                mastery_score: r.mastery_score ?? 0,
                trend: r.trend,
                attempts_count: r.attempts_count,
                updated_at: r.updated_at,
              })),
          );
        } else if (topicMasteryResult.status === 'rejected') {
          console.warn('[useStudentData] topic mastery query failed:', topicMasteryResult.reason);
        }

        let conceptRows: ConceptMasteryRow[] = [];
        if (conceptMasteryResult.status === 'fulfilled' && !conceptMasteryResult.value.error) {
          const rows = (conceptMasteryResult.value.data ?? []) as unknown as RawConceptMasteryRow[];
          conceptRows = rows
            .filter((r) => r.concept_id != null)
            .map((r) => ({
              id: r.id,
              concept_id: r.concept_id!,
              concept_name: r.concepts?.name ?? 'Unknown Concept',
              topic_id: r.concepts?.topic_id ?? null,
              topic_name: r.concepts?.topics?.name ?? undefined,
              mastery_score: r.mastery_score ?? 0,
              updated_at: r.updated_at,
            }));
          setConceptMastery(conceptRows);
        }

        if (misconceptionsResult.status === 'fulfilled' && !misconceptionsResult.value.error) {
          const rows = (misconceptionsResult.value.data ?? []) as RawMisconceptionRow[];
          setMisconceptions(
            rows
              .filter((r) => !r.status || ['active', 'pending', 'open'].includes(String(r.status)))
              .map((r) => ({
                id: r.id,
                topicId: r.topic_id,
                conceptId: r.concept_id,
                description: r.description ?? '',
                evidence: r.evidence,
                confidence: parseConfidence(r.confidence),
                status: r.status,
                detectedAt: r.created_at,
                likely: true,
              })),
          );
        }

        if (riskSignalsResult.status === 'fulfilled' && !riskSignalsResult.value.error) {
          const rows = (riskSignalsResult.value.data ?? []) as RawRiskSignalRow[];
          setRiskSignals(
            rows.map((r) => ({
              id: r.id,
              riskLevel: r.risk_level,
              evidence: r.evidence,
              explanation: r.explanation,
              detectedAt: r.created_at,
            })),
          );
        }

        if (practiceSessionsResult.status === 'fulfilled' && !practiceSessionsResult.value.error) {
          const rows = (practiceSessionsResult.value.data ?? []) as RawPracticeSessionRow[];
          setPracticeSessions(
            rows.map((r) => {
              const accuracy =
                r.correct_count != null && r.question_count != null && r.question_count > 0
                  ? Math.round((r.correct_count / r.question_count) * 100)
                  : r.score;
              return {
                id: r.id,
                topicId: r.topic_id,
                score: r.score,
                correctCount: r.correct_count,
                questionCount: r.question_count,
                accuracy,
                practisedAt: r.created_at,
              };
            }),
          );
        }

        if (prerequisitesResult.status === 'fulfilled' && !prerequisitesResult.value.error) {
          setPrerequisites((prerequisitesResult.value.data ?? []) as PrerequisiteEdge[]);
        }

        const attemptRows: StudentAttempt[] = [];
        if (attemptsResult.status === 'fulfilled' && !attemptsResult.value.error) {
          const rows = (attemptsResult.value.data ?? []) as unknown as Array<{
            id: string;
            assessment_id: string | null;
            score: number | null;
            created_at: string;
            assessments: { title: string } | null;
          }>;
          for (const r of rows) {
            attemptRows.push({
              id: r.id,
              assessmentId: r.assessment_id,
              score: r.score,
              createdAt: r.created_at,
              assessmentTitle: r.assessments?.title,
            });
          }
          setAttempts(attemptRows);
        }

        if (attemptRows.length > 0) {
          const attemptIds = attemptRows.map((a) => a.id);
          const responsesResult = await supabase
            .from('responses')
            .select('id, attempt_id, question_id, is_correct, confidence, created_at, questions ( concept_id, concepts ( name ) )')
            .in('attempt_id', attemptIds)
            .limit(80);
          if (!cancelled && !responsesResult.error) {
            const rows = (responsesResult.data ?? []) as unknown as Array<{
              id: string;
              attempt_id: string | null;
              question_id: string | null;
              is_correct: boolean | null;
              confidence: string | number | null;
              created_at: string;
              questions: { concept_id: string | null; concepts: { name: string } | null } | null;
            }>;
            setResponses(
              rows.map((r) => ({
                id: r.id,
                attemptId: r.attempt_id,
                questionId: r.question_id,
                isCorrect: r.is_correct,
                confidence: r.confidence,
                createdAt: r.created_at,
                conceptId: r.questions?.concept_id ?? null,
                conceptName: r.questions?.concepts?.name ?? null,
              })),
            );
          }
        }

        if (interventionsResult.status === 'fulfilled' && !interventionsResult.value.error) {
          const rows = (interventionsResult.value.data ?? []) as unknown as Array<{
            id: string;
            title: string | null;
            status: string | null;
            topic_id: string | null;
            before_mastery: number | null;
            after_mastery: number | null;
            created_at: string;
            topics: { name: string } | null;
          }>;
          setInterventions(
            rows.map((r) => ({
              id: r.id,
              title: r.title,
              status: r.status,
              topicId: r.topic_id,
              topicName: r.topics?.name,
              beforeMastery: r.before_mastery,
              afterMastery: r.after_mastery,
              createdAt: r.created_at,
            })),
          );
        }

        if (eventsResult.status === 'fulfilled' && !eventsResult.value.error) {
          const rows = (eventsResult.value.data ?? []) as Array<{
            id: string;
            event_type: string | null;
            topic_id: string | null;
            metadata: Record<string, unknown> | null;
            created_at: string;
          }>;
          setLearningEvents(
            rows.map((r) => ({
              id: r.id,
              eventType: r.event_type,
              topicId: r.topic_id,
              metadata: r.metadata,
              createdAt: r.created_at,
            })),
          );
        }

        if (questionsResult.status === 'fulfilled' && !questionsResult.value.error) {
          const rows = (questionsResult.value.data ?? []) as unknown as Array<{
            id: string;
            topic_id: string | null;
            concept_id: string | null;
            question_text: string | null;
            options: unknown;
            correct_answer: string | number | null;
            explanation: string | null;
            difficulty: string | null;
            concepts: { name: string } | null;
          }>;
          setQuestionBank(
            rows
              .filter((r) => r.question_text)
              .map((r) => ({
                id: r.id,
                prompt: r.question_text ?? '',
                options: parseOptions(r.options),
                correctAnswer: r.correct_answer ?? '',
                explanation: r.explanation,
                difficulty: r.difficulty,
                topicId: r.topic_id,
                conceptId: r.concept_id,
                conceptName: r.concepts?.name,
              })),
          );
        }

        if (membershipResult.status === 'fulfilled' && !membershipResult.value.error) {
          const classIds = ((membershipResult.value.data ?? []) as Array<{ class_id: string }>)
            .map((r) => r.class_id)
            .filter(Boolean);
          if (classIds.length > 0) {
            const sessionResult = await supabase
              .from('class_sessions')
              .select('id, class_id, topic_id, scheduled_at, title, topics ( name ), classes ( name )')
              .in('class_id', classIds)
              .gte('scheduled_at', new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString())
              .order('scheduled_at', { ascending: true })
              .limit(1);
            if (!cancelled && !sessionResult.error && sessionResult.data?.[0]) {
              const s = sessionResult.data[0] as unknown as {
                id: string;
                title: string | null;
                scheduled_at: string | null;
                topic_id: string | null;
                topics: { name: string } | null;
                classes: { name: string } | null;
              };
              setUpcomingSession({
                id: s.id,
                title: s.title,
                scheduledAt: s.scheduled_at,
                topicId: s.topic_id,
                topicName: s.topics?.name,
                className: s.classes?.name,
              });
            }
          }
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : 'Unexpected error fetching student data';
          console.error('[useStudentData]', msg);
          setError(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchAll();
    return () => {
      cancelled = true;
    };
  }, [userId, fetchCount]);

  const gaps = useMemo(
    () => detectGaps(topicMastery, conceptMastery, prerequisites),
    [topicMastery, conceptMastery, prerequisites],
  );
  const overallMastery = useMemo(
    () => computeOverallMastery(topicMastery, conceptMastery),
    [topicMastery, conceptMastery],
  );
  const strongestTopics = useMemo(() => getStrongestTopics(topicMastery), [topicMastery]);
  const weakestTopics = useMemo(() => getWeakestTopics(topicMastery), [topicMastery]);
  const trend = useMemo(() => computeTrendFromPractice(practiceSessions), [practiceSessions]);
  const trendDelta = useMemo(() => computeTrendDelta(practiceSessions), [practiceSessions]);
  const repeatedErrors = useMemo(() => deriveRepeatedErrorSignals(responses), [responses]);
  const confidenceMismatches = useMemo(
    () => detectConfidenceMismatches(responses),
    [responses],
  );
  const recoveryMetric = useMemo(
    () =>
      computeLearningRecoveryScore(
        interventions.map((i) => ({
          title: i.title,
          topicName: i.topicName,
          topicId: i.topicId,
          beforeMastery: i.beforeMastery,
          afterMastery: i.afterMastery,
          status: i.status,
        })),
        practiceSessions,
      ),
    [interventions, practiceSessions],
  );

  const recentAccuracy = useMemo(() => {
    const recent = practiceSessions.slice(0, 3).filter((s) => s.accuracy != null);
    if (recent.length === 0) {
      const scored = attempts.filter((a) => a.score != null);
      if (scored.length === 0) return null;
      return Math.round(scored.reduce((s, a) => s + (a.score ?? 0), 0) / scored.length);
    }
    return Math.round(recent.reduce((s, r) => s + (r.accuracy ?? 0), 0) / recent.length);
  }, [practiceSessions, attempts]);

  const activityStreak = useMemo(() => {
    const dates = [
      ...practiceSessions.map((s) => s.practisedAt),
      ...learningEvents.map((e) => e.createdAt),
      ...attempts.map((a) => a.createdAt),
    ];
    return computeActivityStreak(dates);
  }, [practiceSessions, learningEvents, attempts]);

  const readinessEvent = learningEvents.find(
    (e) => e.eventType === 'preclass_readiness' || e.eventType === 'readiness_check',
  );
  const readinessValue =
    typeof readinessEvent?.metadata?.readiness === 'number'
      ? (readinessEvent.metadata.readiness as number)
      : typeof readinessEvent?.metadata?.score === 'number'
      ? (readinessEvent.metadata.score as number)
      : null;

  const activeIntervention = interventions.find(
    (i) => i.status && ['active', 'in_progress', 'open'].includes(String(i.status)),
  );

  const nextAction = useMemo(
    () =>
      deriveNextBestAction(gaps, {
        upcomingTopicName: upcomingSession?.topicName || upcomingSession?.title,
        upcomingReadiness: readinessValue,
        unresolvedMisconceptionCount: misconceptions.length,
        activeInterventionTitle: activeIntervention?.title,
        recentAccuracy,
        decliningTrend: trend === 'down',
        insufficientPractice: practiceSessions.length < 2,
      }),
    [
      gaps,
      upcomingSession,
      readinessValue,
      misconceptions.length,
      activeIntervention?.title,
      recentAccuracy,
      trend,
      practiceSessions.length,
    ],
  );

  const derivedMisconceptions = useMemo(() => {
    if (misconceptions.length > 0) return misconceptions;
    return repeatedErrors.map((err) => ({
      id: `derived-${err.conceptId}`,
      topicId: null,
      conceptId: err.conceptId,
      description: `Possible misunderstanding on ${err.conceptName}`,
      evidence: err.evidence,
      confidence: Math.round((err.incorrectCount / err.totalCount) * 100),
      status: 'derived',
      detectedAt: new Date().toISOString(),
      likely: true,
    }));
  }, [misconceptions, repeatedErrors]);

  const insights = useMemo(
    () =>
      buildEvidenceInsights({
        overallMastery,
        strongest: strongestTopics,
        weakest: weakestTopics,
        gaps,
        trend,
        trendDelta,
        misconceptions: derivedMisconceptions,
        repeatedErrors,
        recovery: recoveryMetric,
        recentAccuracy,
      }),
    [
      overallMastery,
      strongestTopics,
      weakestTopics,
      gaps,
      trend,
      trendDelta,
      derivedMisconceptions,
      repeatedErrors,
      recoveryMetric,
      recentAccuracy,
    ],
  );

  const loopStageId = currentLoopStage({
    hasUpcomingSession: Boolean(upcomingSession),
    readinessCompleted: Boolean(readinessEvent),
    hasGaps: gaps.length > 0,
    hasPractice: practiceSessions.length > 0,
    hasRecovery: Boolean(recoveryMetric && recoveryMetric.recoveryPoints > 0),
  });

  const hasRealData = topicMastery.length > 0 || conceptMastery.length > 0;

  return {
    topicMastery,
    conceptMastery,
    misconceptions: derivedMisconceptions,
    riskSignals,
    practiceSessions,
    prerequisites,
    attempts,
    responses,
    interventions,
    learningEvents,
    upcomingSession,
    questionBank,
    gaps,
    overallMastery,
    strongestTopics,
    weakestTopics,
    nextAction,
    insights,
    confidenceMismatches,
    repeatedErrors,
    recoveryMetric,
    activityStreak,
    recentAccuracy,
    trend,
    trendDelta,
    loopStageId,
    loading,
    error,
    hasRealData,
    refresh,
  };
}
