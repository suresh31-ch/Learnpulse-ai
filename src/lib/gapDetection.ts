/**
 * LearnPulse AI — Deterministic Learning Gap Detection Utility
 *
 * Pure functions only. No Supabase calls, no AI, no side effects.
 * Numerical mastery, severity, readiness, accuracy, and recovery
 * are always calculated here — never guessed by Gemini.
 *
 * Severity (observed evidence, not a prediction of future performance):
 *   critical  : mastery_score < 45
 *   moderate  : mastery_score 45–59
 *   attention : mastery_score 60–64
 *   (≥65 is not a gap)
 */

export interface TopicMasteryRow {
  id: string;
  topic_id: string;
  topic_name: string;
  unit_name?: string;
  subject_name?: string;
  mastery_score: number;
  trend: string | null;
  attempts_count: number | null;
  updated_at: string;
}

export interface ConceptMasteryRow {
  id: string;
  concept_id: string;
  concept_name: string;
  topic_id: string | null;
  topic_name?: string;
  mastery_score: number;
  updated_at: string;
}

export interface PrerequisiteEdge {
  concept_id: string;
  prerequisite_concept_id: string;
}

export type GapSeverity = 'critical' | 'moderate' | 'attention';

/** @deprecated Use GapSeverity `'moderate'` — kept as a type alias for older call sites. */
export type LegacyGapSeverity = GapSeverity | 'priority';

export interface DetectedGap {
  layer: 'topic' | 'concept';
  id: string;
  name: string;
  subject?: string;
  unit?: string;
  topic?: string;
  concept?: string;
  subjectOrTopic?: string;
  unitName?: string;
  masteryScore: number;
  mastery: number;
  severity: GapSeverity;
  evidence: string;
  evidenceSignals: string[];
  prerequisiteImpact: string;
  recommendedFocus: string;
  blockedPrerequisites: string[];
  lastUpdated: string;
}

export interface NextBestAction {
  action: string;
  target: string;
  targetId?: string;
  targetLayer?: 'topic' | 'concept';
  reason: string;
  steps: string[];
  severity: GapSeverity;
  navHint: 'practice' | 'pre_class' | 'insights' | 'learn' | 'tutor';
}

export interface EvidenceInsight {
  id: string;
  headline: string;
  detail: string;
  kind: 'strength' | 'gap' | 'trend' | 'misconception' | 'prerequisite' | 'practice' | 'recovery';
}

export interface ConfidenceMismatch {
  id: string;
  kind: 'overconfident' | 'underconfident';
  conceptId: string | null;
  evidence: string;
}

export interface RepeatedErrorSignal {
  conceptId: string;
  conceptName: string;
  incorrectCount: number;
  totalCount: number;
  evidence: string;
}

export interface LearningRecoveryMetric {
  topic: string;
  topicId: string | null;
  before: number;
  after: number;
  recoveryPoints: number;
  status: 'recovered' | 'in_progress' | 'stalled' | 'insufficient_data';
  whatChanged: string[];
  source: 'intervention' | 'practice_sessions';
}

export interface NextBestActionContext {
  upcomingTopicName?: string | null;
  upcomingReadiness?: number | null;
  unresolvedMisconceptionCount?: number;
  activeInterventionTitle?: string | null;
  recentAccuracy?: number | null;
  decliningTrend?: boolean;
  insufficientPractice?: boolean;
}

function classifySeverity(score: number): GapSeverity | null {
  if (score < 45) return 'critical';
  if (score < 60) return 'moderate';
  if (score < 65) return 'attention';
  return null;
}

export function normalizeSeverity(value: string | null | undefined): GapSeverity | null {
  if (!value) return null;
  if (value === 'priority') return 'moderate';
  if (value === 'critical' || value === 'moderate' || value === 'attention') return value;
  return null;
}

const SEVERITY_ORDER: Record<GapSeverity, number> = {
  critical: 0,
  moderate: 1,
  attention: 2,
};

export function masteryStatus(
  score: number,
  hasPrerequisiteGap = false,
): 'mastered' | 'developing' | 'needs_attention' | 'prerequisite_gap' {
  if (hasPrerequisiteGap) return 'prerequisite_gap';
  if (score >= 75) return 'mastered';
  if (score >= 60) return 'developing';
  return 'needs_attention';
}

export function detectGaps(
  topicMastery: TopicMasteryRow[],
  conceptMastery: ConceptMasteryRow[],
  prerequisites: PrerequisiteEdge[] = [],
): DetectedGap[] {
  const gaps: DetectedGap[] = [];
  const conceptNameMap = new Map<string, string>(
    conceptMastery.map((cm) => [cm.concept_id, cm.concept_name]),
  );
  const conceptById = new Map(conceptMastery.map((cm) => [cm.concept_id, cm]));

  for (const tm of topicMastery) {
    const score = tm.mastery_score ?? 0;
    const severity = classifySeverity(score);
    if (!severity) continue;

    const attemptsNote =
      tm.attempts_count != null && tm.attempts_count > 0
        ? `across ${tm.attempts_count} recorded attempts`
        : 'limited attempt history available';

    const severityPhrase =
      severity === 'critical'
        ? 'Learning signal: low topic mastery'
        : severity === 'moderate'
        ? 'Learning signal: repeated weakness observed'
        : 'Learning signal: needs attention';

    const trendNote =
      tm.trend === 'down' || tm.trend === 'declining'
        ? ' Recent recorded performance is declining.'
        : '';

    gaps.push({
      layer: 'topic',
      id: tm.topic_id,
      name: tm.topic_name,
      subject: tm.subject_name,
      unit: tm.unit_name,
      topic: tm.topic_name,
      concept: undefined,
      subjectOrTopic: tm.subject_name,
      unitName: tm.unit_name,
      masteryScore: score,
      mastery: score,
      severity,
      evidence: `${severityPhrase}: topic mastery is ${score}% (${attemptsNote}).${trendNote}`,
      evidenceSignals: [
        `topic_mastery=${score}`,
        tm.attempts_count != null ? `attempts=${tm.attempts_count}` : 'attempts=unknown',
        tm.trend ? `trend=${tm.trend}` : 'trend=unknown',
      ],
      prerequisiteImpact: 'Topic-level gap may slow upcoming lessons in this unit.',
      recommendedFocus: `Repair ${tm.topic_name} with targeted practice, then reassess.`,
      blockedPrerequisites: [],
      lastUpdated: tm.updated_at,
    });
  }

  for (const cm of conceptMastery) {
    const score = cm.mastery_score ?? 0;
    const severity = classifySeverity(score);
    if (!severity) continue;

    const blocked = prerequisites
      .filter((edge) => edge.prerequisite_concept_id === cm.concept_id)
      .map((edge) => conceptNameMap.get(edge.concept_id) ?? edge.concept_id);

    const weakPrereqs = prerequisites
      .filter((edge) => edge.concept_id === cm.concept_id)
      .map((edge) => conceptById.get(edge.prerequisite_concept_id))
      .filter((row): row is ConceptMasteryRow => Boolean(row) && (row!.mastery_score ?? 0) < 65);

    const severityPhrase =
      severity === 'critical'
        ? 'Learning signal: low concept mastery'
        : severity === 'moderate'
        ? 'Learning signal: repeated weakness observed'
        : 'Learning signal: needs attention';

    const prereqNote =
      blocked.length > 0
        ? ` This concept is a prerequisite for: ${blocked.slice(0, 3).join(', ')}.`
        : '';
    const upstreamNote =
      weakPrereqs.length > 0
        ? ` Upstream prerequisite still weak: ${weakPrereqs
            .slice(0, 2)
            .map((p) => p.concept_name)
            .join(', ')}.`
        : '';

    const impact =
      blocked.length > 0
        ? `May block progress in ${blocked.slice(0, 2).join(' and ')}.`
        : weakPrereqs.length > 0
        ? `Likely affected by weaker prerequisite ${weakPrereqs[0].concept_name}.`
        : 'Localized concept gap based on recorded mastery.';

    gaps.push({
      layer: 'concept',
      id: cm.concept_id,
      name: cm.concept_name,
      subject: undefined,
      unit: undefined,
      topic: cm.topic_name,
      concept: cm.concept_name,
      subjectOrTopic: cm.topic_name,
      masteryScore: score,
      mastery: score,
      severity,
      evidence: `${severityPhrase}: concept mastery is ${score}%.${prereqNote}${upstreamNote}`,
      evidenceSignals: [
        `concept_mastery=${score}`,
        blocked.length ? `blocks=${blocked.length}` : 'blocks=0',
        weakPrereqs.length ? `weak_prereqs=${weakPrereqs.length}` : 'weak_prereqs=0',
      ],
      prerequisiteImpact: impact,
      recommendedFocus: `Repair: ${cm.concept_name}`,
      blockedPrerequisites: blocked,
      lastUpdated: cm.updated_at,
    });
  }

  gaps.sort((a, b) => {
    const tierDiff = SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity];
    return tierDiff !== 0 ? tierDiff : a.masteryScore - b.masteryScore;
  });

  return gaps;
}

export function computeOverallMastery(
  topicMastery: TopicMasteryRow[],
  conceptMastery: ConceptMasteryRow[] = [],
): number | null {
  if (topicMastery.length > 0) {
    const sum = topicMastery.reduce((acc, tm) => acc + (tm.mastery_score ?? 0), 0);
    return Math.round(sum / topicMastery.length);
  }
  if (conceptMastery.length > 0) {
    const sum = conceptMastery.reduce((acc, cm) => acc + (cm.mastery_score ?? 0), 0);
    return Math.round(sum / conceptMastery.length);
  }
  return null;
}

export interface MasteryHighlight {
  topicName: string;
  subjectName?: string;
  score: number;
}

export function getStrongestTopics(topicMastery: TopicMasteryRow[], limit = 3): MasteryHighlight[] {
  return [...topicMastery]
    .sort((a, b) => b.mastery_score - a.mastery_score)
    .slice(0, limit)
    .map((tm) => ({ topicName: tm.topic_name, subjectName: tm.subject_name, score: tm.mastery_score }));
}

export function getWeakestTopics(topicMastery: TopicMasteryRow[], limit = 3): MasteryHighlight[] {
  return [...topicMastery]
    .sort((a, b) => a.mastery_score - b.mastery_score)
    .slice(0, limit)
    .map((tm) => ({ topicName: tm.topic_name, subjectName: tm.subject_name, score: tm.mastery_score }));
}

export function deriveNextBestAction(
  gaps: DetectedGap[],
  context: NextBestActionContext = {},
): NextBestAction {
  if (
    context.upcomingReadiness != null &&
    context.upcomingReadiness < 60 &&
    context.upcomingTopicName
  ) {
    return {
      action: 'Prepare for class',
      target: context.upcomingTopicName,
      reason: `Recorded pre-class readiness is ${context.upcomingReadiness}% for ${context.upcomingTopicName}. Completing the readiness check now is the highest-leverage next step.`,
      steps: [
        `Open the pre-class preview for ${context.upcomingTopicName}`,
        'Review weak prerequisite concepts',
        'Complete the readiness questions',
        'Ask Pulse Tutor about any remaining sign or formula traps',
      ],
      severity: context.upcomingReadiness < 45 ? 'critical' : 'moderate',
      navHint: 'pre_class',
    };
  }

  if (context.activeInterventionTitle && gaps.length > 0) {
    const top = gaps[0];
    return {
      action: 'Continue recovery',
      target: context.activeInterventionTitle,
      targetId: top.id,
      targetLayer: top.layer,
      reason: `An active recovery plan is in progress. Observed evidence still shows a ${top.severity} signal on ${top.name} (${top.masteryScore}%).`,
      steps: top.layer === 'concept'
        ? [
            `Repair ${top.name} with a guided explanation`,
            'Work one example with sign tracking',
            'Complete targeted practice',
            'Reassess to record observed improvement',
          ]
        : [
            `Focus the recovery plan on ${top.name}`,
            'Complete targeted practice',
            'Reassess after the session',
          ],
      severity: top.severity,
      navHint: 'insights',
    };
  }

  if (gaps.length === 0) {
    if (context.insufficientPractice) {
      return {
        action: 'Keep practising',
        target: 'Mixed review',
        reason: 'No learning gaps are currently flagged, but recent practice volume is low. A short mixed session will help confirm retention.',
        steps: [
          'Start a mixed adaptive practice session',
          'Calibrate confidence on each item',
          'Review explanations for any misses',
        ],
        severity: 'attention',
        navHint: 'practice',
      };
    }
    return {
      action: 'Continue practice',
      target: 'All topics',
      reason: 'No learning gaps detected from available mastery records. Maintain fluency with regular practice.',
      steps: [
        'Attempt a mixed-topic adaptive practice session',
        'Review recent assessments to confirm retention',
        'Challenge yourself with higher-difficulty questions',
      ],
      severity: 'attention',
      navHint: 'practice',
    };
  }

  const criticalConcept = gaps.find((g) => g.severity === 'critical' && g.layer === 'concept');
  const criticalTopic = gaps.find((g) => g.severity === 'critical' && g.layer === 'topic');
  const moderateConcept = gaps.find((g) => g.severity === 'moderate' && g.layer === 'concept');
  const moderateTopic = gaps.find((g) => g.severity === 'moderate' && g.layer === 'topic');
  const top = criticalConcept ?? criticalTopic ?? moderateConcept ?? moderateTopic ?? gaps[0];

  const misconceptionNote =
    (context.unresolvedMisconceptionCount ?? 0) > 0
      ? ` An unresolved likely misconception is still open.`
      : '';
  const trendNote = context.decliningTrend
    ? ' Recent recorded accuracy is declining.'
    : '';

  return {
    action: top.severity === 'critical' ? 'Repair concept' : 'Focused practice',
    target: top.name,
    targetId: top.id,
    targetLayer: top.layer,
    reason: `${top.evidence} ${top.prerequisiteImpact}${misconceptionNote}${trendNote}`,
    steps: [
      `Review core ideas in ${top.name}`,
      'Complete 3–5 targeted practice questions',
      'Complete a confidence calibration check',
      'Reassess to measure observed recovery',
    ],
    severity: top.severity,
    navHint: 'practice',
  };
}

export interface PracticeSessionSlim {
  accuracy: number | null;
  practisedAt: string;
}

export function computeTrendFromPractice(
  sessions: PracticeSessionSlim[],
): 'up' | 'down' | 'stable' | null {
  const valid = sessions
    .filter((s) => s.accuracy !== null)
    .sort((a, b) => new Date(b.practisedAt).getTime() - new Date(a.practisedAt).getTime())
    .slice(0, 6);

  if (valid.length < 3) return null;

  const mid = Math.floor(valid.length / 2);
  const recentAvg = valid.slice(0, mid).reduce((s, r) => s + (r.accuracy ?? 0), 0) / mid;
  const olderAvg =
    valid.slice(mid).reduce((s, r) => s + (r.accuracy ?? 0), 0) / (valid.length - mid);

  const delta = recentAvg - olderAvg;
  if (delta > 3) return 'up';
  if (delta < -3) return 'down';
  return 'stable';
}

export function computeTrendDelta(sessions: PracticeSessionSlim[]): number | null {
  const valid = sessions
    .filter((s) => s.accuracy !== null)
    .sort((a, b) => new Date(a.practisedAt).getTime() - new Date(b.practisedAt).getTime());
  if (valid.length < 2) return null;
  const first = valid[0].accuracy ?? 0;
  const last = valid[valid.length - 1].accuracy ?? 0;
  return Math.round(last - first);
}

/**
 * Readiness = 55% quiz accuracy + 45% mean prerequisite mastery.
 * Quiz contribution is omitted until the student submits answers.
 */
export function computeReadinessPercentage(
  prerequisiteMasteries: number[],
  quizAccuracy: number | null,
): number {
  const prereqAvg =
    prerequisiteMasteries.length > 0
      ? prerequisiteMasteries.reduce((s, n) => s + n, 0) / prerequisiteMasteries.length
      : 0;

  if (quizAccuracy == null) {
    return Math.round(prereqAvg);
  }
  if (prerequisiteMasteries.length === 0) {
    return Math.round(quizAccuracy);
  }
  return Math.round(0.55 * quizAccuracy + 0.45 * prereqAvg);
}

export function computeActivityStreak(isoDates: string[], today = new Date()): number {
  const days = new Set(
    isoDates
      .map((d) => {
        const dt = new Date(d);
        if (Number.isNaN(dt.getTime())) return null;
        return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, '0')}-${String(dt.getUTCDate()).padStart(2, '0')}`;
      })
      .filter((v): v is string => Boolean(v)),
  );
  if (days.size === 0) return 0;

  let streak = 0;
  const cursor = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  while (true) {
    const key = `${cursor.getUTCFullYear()}-${String(cursor.getUTCMonth() + 1).padStart(2, '0')}-${String(cursor.getUTCDate()).padStart(2, '0')}`;
    if (!days.has(key)) break;
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
}

export function detectConfidenceMismatches(
  responses: Array<{
    id: string;
    isCorrect: boolean | null;
    confidence: string | number | null;
    conceptId?: string | null;
  }>,
): ConfidenceMismatch[] {
  const mismatches: ConfidenceMismatch[] = [];
  for (const r of responses) {
    if (r.isCorrect == null || r.confidence == null) continue;
    const conf = String(r.confidence).toLowerCase();
    const high = conf === 'very' || conf === 'high' || conf === '3' || Number(r.confidence) >= 80;
    const low = conf === 'guessing' || conf === 'low' || conf === '1' || Number(r.confidence) <= 30;
    if (high && r.isCorrect === false) {
      mismatches.push({
        id: r.id,
        kind: 'overconfident',
        conceptId: r.conceptId ?? null,
        evidence:
          'High confidence with an incorrect response. This is a calibration signal — worth reviewing the worked explanation, not a diagnosis.',
      });
    } else if (low && r.isCorrect === true) {
      mismatches.push({
        id: r.id,
        kind: 'underconfident',
        conceptId: r.conceptId ?? null,
        evidence:
          'Low confidence with a correct response. Your reasoning may be stronger than it feels — a chance to calibrate, not a medical claim.',
      });
    }
  }
  return mismatches;
}

export function deriveRepeatedErrorSignals(
  responses: Array<{
    isCorrect: boolean | null;
    conceptId: string | null;
    conceptName?: string | null;
  }>,
): RepeatedErrorSignal[] {
  const buckets = new Map<string, { name: string; incorrect: number; total: number }>();
  for (const r of responses) {
    if (!r.conceptId || r.isCorrect == null) continue;
    const current = buckets.get(r.conceptId) ?? {
      name: r.conceptName || 'Concept',
      incorrect: 0,
      total: 0,
    };
    current.total += 1;
    if (r.isCorrect === false) current.incorrect += 1;
    buckets.set(r.conceptId, current);
  }

  return [...buckets.entries()]
    .filter(([, v]) => v.incorrect >= 2 && v.incorrect / v.total >= 0.5)
    .map(([conceptId, v]) => ({
      conceptId,
      conceptName: v.name,
      incorrectCount: v.incorrect,
      totalCount: v.total,
      evidence: `Repeated incorrect responses on ${v.name}: ${v.incorrect} of ${v.total} recorded answers were incorrect.`,
    }))
    .sort((a, b) => b.incorrectCount - a.incorrectCount);
}

export function computeLearningRecoveryScore(
  interventions: Array<{
    title: string | null;
    topicName?: string | null;
    topicId?: string | null;
    beforeMastery: number | null;
    afterMastery: number | null;
    status: string | null;
  }>,
  sessions: PracticeSessionSlim[] = [],
): LearningRecoveryMetric | null {
  const withPair = interventions.find(
    (i) => i.beforeMastery != null && i.afterMastery != null,
  );
  if (withPair && withPair.beforeMastery != null && withPair.afterMastery != null) {
    const recoveryPoints = Math.round(withPair.afterMastery - withPair.beforeMastery);
    const status: LearningRecoveryMetric['status'] =
      withPair.afterMastery >= 75
        ? 'recovered'
        : recoveryPoints > 0
        ? 'in_progress'
        : 'stalled';
    return {
      topic: withPair.topicName || withPair.title || 'Learning target',
      topicId: withPair.topicId ?? null,
      before: Math.round(withPair.beforeMastery),
      after: Math.round(withPair.afterMastery),
      recoveryPoints,
      status,
      whatChanged: [
        `LearnPulse Recovery (observed improvement) on ${withPair.topicName || withPair.title || 'this target'}.`,
        `Before recorded mastery: ${Math.round(withPair.beforeMastery)}%.`,
        `After recorded mastery: ${Math.round(withPair.afterMastery)}%.`,
        recoveryPoints > 0
          ? `Observed change: +${recoveryPoints} percentage points.`
          : `Observed change: ${recoveryPoints} percentage points.`,
      ],
      source: 'intervention',
    };
  }

  const valid = sessions
    .filter((s) => s.accuracy !== null)
    .sort((a, b) => new Date(a.practisedAt).getTime() - new Date(b.practisedAt).getTime());
  if (valid.length >= 2) {
    const before = valid[0].accuracy ?? 0;
    const after = valid[valid.length - 1].accuracy ?? 0;
    const recoveryPoints = Math.round(after - before);
    return {
      topic: 'Recent practice target',
      topicId: null,
      before,
      after,
      recoveryPoints,
      status: after >= 75 ? 'recovered' : recoveryPoints > 0 ? 'in_progress' : 'stalled',
      whatChanged: [
        'LearnPulse Recovery from recorded practice sessions (not a universal scientific score).',
        `First recorded session accuracy: ${before}%.`,
        `Latest recorded session accuracy: ${after}%.`,
        `Observed change: ${recoveryPoints > 0 ? '+' : ''}${recoveryPoints} percentage points across ${valid.length} sessions.`,
      ],
      source: 'practice_sessions',
    };
  }

  return null;
}

export function buildEvidenceInsights(input: {
  overallMastery: number | null;
  strongest: MasteryHighlight[];
  weakest: MasteryHighlight[];
  gaps: DetectedGap[];
  trend: 'up' | 'down' | 'stable' | null;
  trendDelta: number | null;
  misconceptions: Array<{ description: string }>;
  repeatedErrors: RepeatedErrorSignal[];
  recovery: LearningRecoveryMetric | null;
  recentAccuracy: number | null;
}): EvidenceInsight[] {
  const insights: EvidenceInsight[] = [];

  if (input.strongest[0]) {
    insights.push({
      id: 'strongest',
      headline: `Your strongest topic is ${input.strongest[0].topicName}`,
      detail: `Recorded mastery is ${input.strongest[0].score}%${
        input.strongest[0].subjectName ? ` in ${input.strongest[0].subjectName}` : ''
      }.`,
      kind: 'strength',
    });
  }

  if (input.weakest[0] && (input.weakest[0].score < 65 || input.gaps.length > 0)) {
    const gap = input.gaps[0];
    insights.push({
      id: 'attention-concept',
      headline: gap
        ? `This ${gap.layer} needs attention: ${gap.name}`
        : `This topic needs attention: ${input.weakest[0].topicName}`,
      detail: gap ? gap.evidence : `Recorded mastery is ${input.weakest[0].score}%.`,
      kind: 'gap',
    });
  }

  if (input.trend && input.trendDelta != null) {
    insights.push({
      id: 'trend',
      headline:
        input.trend === 'up'
          ? 'Your recent performance improved'
          : input.trend === 'down'
          ? 'Your recent performance declined'
          : 'Your recent performance is stable',
      detail: `Observed change across recorded practice: ${input.trendDelta > 0 ? '+' : ''}${input.trendDelta} percentage points.`,
      kind: 'trend',
    });
  }

  if (input.repeatedErrors[0]) {
    insights.push({
      id: 'repeat',
      headline: `You repeatedly missed ${input.repeatedErrors[0].conceptName}`,
      detail: input.repeatedErrors[0].evidence,
      kind: 'misconception',
    });
  } else if (input.misconceptions[0]) {
    insights.push({
      id: 'misconception',
      headline: 'A likely misconception is still open',
      detail: `${input.misconceptions[0].description} Treat this as a possible misunderstanding based on recorded evidence, not a certainty.`,
      kind: 'misconception',
    });
  }

  const prereqGap = input.gaps.find((g) => g.blockedPrerequisites.length > 0);
  if (prereqGap) {
    insights.push({
      id: 'prereq',
      headline: 'Your prerequisite gap may be affecting later work',
      detail: prereqGap.prerequisiteImpact,
      kind: 'prerequisite',
    });
  }

  if (input.recovery && input.recovery.recoveryPoints > 0) {
    insights.push({
      id: 'recovery',
      headline: 'You improved after targeted practice',
      detail: `LearnPulse Recovery (observed improvement): ${input.recovery.before}% → ${input.recovery.after}% (${input.recovery.recoveryPoints > 0 ? '+' : ''}${input.recovery.recoveryPoints} pts) on ${input.recovery.topic}.`,
      kind: 'recovery',
    });
  }

  if (input.recentAccuracy != null) {
    insights.push({
      id: 'practice',
      headline: `Recent practice accuracy is ${input.recentAccuracy}%`,
      detail: 'Accuracy is calculated from recorded correct answers, not estimated.',
      kind: 'practice',
    });
  }

  return insights;
}

export function selectAdaptiveDifficulty(
  history: Array<{ isCorrect: boolean; difficulty: 'Easy' | 'Medium' | 'Hard' }>,
  fallback: 'Easy' | 'Medium' | 'Hard' = 'Medium',
): 'Easy' | 'Medium' | 'Hard' {
  if (history.length === 0) return fallback;
  const last = history.slice(-2);
  const correctCount = last.filter((h) => h.isCorrect).length;
  if (last.length >= 2 && correctCount === 2) {
    return last[last.length - 1].difficulty === 'Hard' ? 'Hard' : 'Hard';
  }
  if (last.length >= 2 && correctCount === 0) return 'Easy';
  if (history[history.length - 1].isCorrect) {
    return history[history.length - 1].difficulty === 'Easy' ? 'Medium' : 'Hard';
  }
  return history[history.length - 1].difficulty === 'Hard' ? 'Medium' : 'Easy';
}

export function currentLoopStage(input: {
  hasUpcomingSession: boolean;
  readinessCompleted: boolean;
  hasGaps: boolean;
  hasPractice: boolean;
  hasRecovery: boolean;
}): string {
  if (input.hasRecovery) return 'mastery_recovery';
  if (input.hasPractice && input.hasGaps) return 'adaptive_practice';
  if (input.hasGaps) return 'gap_detection';
  if (input.readinessCompleted) return 'classroom';
  if (input.hasUpcomingSession) return 'pre_class_preview';
  return 'before_class';
}
