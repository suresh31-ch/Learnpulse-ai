import { StudentProfile, LearningGap, NextBestAction, MasteryLevel, TrendDirection } from '../types';

/**
 * LearnPulse AI — Deterministic Learning Gap Detection Engine
 * 
 * CRITICAL RULE: Pure deterministic algorithmic calculations.
 * No generative AI / LLM is used for mathematical scoring, thresholds,
 * or metric derivations.
 */

export interface GapDetectionInputs {
  student: StudentProfile;
  preClassReadiness?: number;
  recentAssessmentScore?: number;
  recentConfidence?: 'guessing' | 'somewhat' | 'very';
  lastAnswerCorrect?: boolean;
}

/**
 * Deterministically analyzes student learning evidence and generates structured learning gaps.
 */
export function detectStudentLearningGaps(student: StudentProfile): LearningGap[] {
  const gaps: LearningGap[] = [];

  // 1. Inspect each topic within student's topic mastery
  student.topicMastery.forEach((tm, idx) => {
    // Topic mastery threshold: Critical (< 50%), Moderate (50-65%), Developing (66-74% if trend is down)
    const isCritical = tm.score < 50;
    const isModerate = tm.score >= 50 && tm.score <= 65;
    const isDecliningDeveloping = tm.score > 65 && tm.score < 75 && student.trend === 'down';

    if (isCritical || isModerate || isDecliningDeveloping) {
      const severity: 'critical' | 'moderate' | 'mild' = isCritical
        ? 'critical'
        : isModerate
        ? 'moderate'
        : 'mild';

      // Prerequisite dependency derivation based on curriculum
      let prerequisiteGap: LearningGap['prerequisiteGap'] = null;
      let targetConcept = 'Core Concepts';

      if (tm.topicName.includes('Quadratic')) {
        targetConcept = 'Discriminant Sign Evaluation & Factorisation';
        prerequisiteGap = {
          concept: 'Linear Equations & Integer Multiplication Signs',
          status: isCritical ? 'weak' : 'developing',
          description: 'Evaluating (-4ac) when c < 0 requires integer multiplication rules before applying the quadratic formula.'
        };
      } else if (tm.topicName.includes('Newton') || tm.topicName.includes('Forces')) {
        targetConcept = 'Free Body Diagrams & Vector Directions';
        prerequisiteGap = {
          concept: 'Velocity & Acceleration Vectors',
          status: isCritical ? 'missing' : 'developing',
          description: 'Distinguishing between direction of net force and instantaneous velocity.'
        };
      } else if (tm.topicName.includes('Kinematics')) {
        targetConcept = 'Deceleration vs Negative Velocity';
        prerequisiteGap = {
          concept: 'Motion in One Dimension & Coordinate Axes',
          status: 'developing',
          description: 'Assigning consistent coordinate directions to vector displacements.'
        };
      } else if (tm.topicName.includes('Electricity')) {
        targetConcept = 'Ohm’s Law & Variable Transposition (I = V/R)';
        prerequisiteGap = {
          concept: 'Linear Algebraic Transposition',
          status: 'developing',
          description: 'Isolating dependent variables in rational quotients.'
        };
      }

      // Concrete evidence points
      const evidence: string[] = [];
      evidence.push(`Topic mastery is currently ${tm.score}% (Benchmark threshold: 75%).`);
      
      if (student.trend === 'down' && student.trendDelta < 0) {
        evidence.push(`Formative trend declined by ${Math.abs(student.trendDelta)}% across recent checks.`);
      }
      
      if (student.repeatedErrorsCount > 1) {
        evidence.push(`${student.repeatedErrorsCount} repeated conceptual errors observed in recent assessments.`);
      }

      if (student.misconceptionDetected && student.misconceptionDetected.topic.toLowerCase().includes(tm.topicName.toLowerCase().slice(0, 5))) {
        evidence.push(`Diagnosed pattern: ${student.misconceptionDetected.title}.`);
      }

      // Deterministic baseline and recovery calculation
      const baselineMastery = Math.max(25, tm.score - 15);
      const recoveryGain = Math.max(10, 85 - tm.score);

      // Recommended action
      let recommendedAction = `Launch 5-step interactive recovery on ${tm.topicName}.`;
      if (severity === 'critical') {
        recommendedAction = `Begin prerequisite concept repair on ${prerequisiteGap?.concept || 'foundations'} followed by guided examples.`;
      } else if (severity === 'moderate') {
        recommendedAction = `Complete targeted adaptive practice with confidence calibration for ${tm.topicName}.`;
      }

      gaps.push({
        id: `gap-${student.id}-${idx}-${tm.topicName.toLowerCase().replace(/\s+/g, '-')}`,
        topicId: `top-${idx + 1}`,
        topicName: tm.topicName,
        conceptId: `con-${idx + 1}`,
        conceptName: targetConcept,
        subject: tm.subject,
        currentMastery: tm.score,
        baselineMastery,
        severity,
        evidence,
        prerequisiteGap,
        trend: student.trend,
        confidenceMismatch: student.repeatedErrorsCount >= 3 ? {
          type: 'overconfident',
          description: 'High reported confidence on questions answered incorrectly indicates an unconscious mental model gap.'
        } : null,
        recommendedAction,
        recoveryGain,
        status: 'active'
      });
    }
  });

  // If student has high mastery across all topics, ensure at least an extension gap or monitor
  if (gaps.length === 0 && student.topicMastery.length > 0) {
    // Find lowest score to optimize
    const lowest = [...student.topicMastery].sort((a, b) => a.score - b.score)[0];
    if (lowest) {
      gaps.push({
        id: `gap-${student.id}-opt-${lowest.topicName.toLowerCase().replace(/\s+/g, '-')}`,
        topicId: 'top-opt',
        topicName: lowest.topicName,
        conceptId: 'con-opt',
        conceptName: 'Advanced Problem Solving',
        subject: lowest.subject,
        currentMastery: lowest.score,
        baselineMastery: lowest.score - 5,
        severity: 'mild',
        evidence: [
          `Overall mastery is strong at ${lowest.score}%.`,
          'Minor speed optimization possible on multi-stage Olympiad problems.'
        ],
        prerequisiteGap: null,
        trend: 'stable',
        confidenceMismatch: null,
        recommendedAction: `Solve 3 challenge problems to achieve 100% topic mastery.`,
        recoveryGain: 100 - lowest.score,
        status: 'active'
      });
    }
  }

  // Sort by severity (critical first, then moderate, then mild)
  const severityOrder = { critical: 0, moderate: 1, mild: 2 };
  return gaps.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
}

/**
 * Deterministically computes the Next Best Learning Action for a student.
 */
export function computeNextBestAction(
  student: StudentProfile,
  gaps: LearningGap[],
  preClassReadinessScore?: number
): NextBestAction {
  // Priority 1: Tomorrow's Pre-Class Readiness check if not ready (< 70%)
  if (preClassReadinessScore !== undefined && preClassReadinessScore < 70) {
    return {
      id: 'nba-readiness-check',
      title: 'Complete Tomorrow’s Pre-Class Check',
      subtitle: 'Prepare for Quadratic Equations (Discriminant & Roots) before Period 2.',
      category: 'readiness',
      urgency: 'immediate',
      actionRoute: 'preview',
      estimatedMinutes: 6,
      expectedGain: '+25% class readiness'
    };
  }

  // Priority 2: Critical Learning Gap requiring Concept Repair
  const criticalGap = gaps.find(g => g.severity === 'critical');
  if (criticalGap) {
    return {
      id: `nba-recovery-${criticalGap.id}`,
      title: `Start Concept Repair: ${criticalGap.topicName}`,
      subtitle: `Targeted repair on ${criticalGap.conceptName} to resolve sign reversal error.`,
      category: 'recovery',
      urgency: 'immediate',
      actionRoute: 'recovery',
      estimatedMinutes: 12,
      expectedGain: `+${criticalGap.recoveryGain || 25}% mastery recovery`
    };
  }

  // Priority 3: Active Moderate Gap requiring Adaptive Practice
  const moderateGap = gaps.find(g => g.severity === 'moderate');
  if (moderateGap) {
    return {
      id: `nba-practice-${moderateGap.id}`,
      title: `Practice 4 Calibration Questions on ${moderateGap.topicName}`,
      subtitle: 'Calibrate confidence and eliminate misconceptions with step-by-step feedback.',
      category: 'practice',
      urgency: 'recommended',
      actionRoute: 'practice',
      estimatedMinutes: 8,
      expectedGain: `+${moderateGap.recoveryGain || 15}% mastery gain`
    };
  }

  // Priority 4: Reassessment or Next Chapter Advancement
  return {
    id: 'nba-advance-mastery',
    title: 'Explore Student Knowledge Map',
    subtitle: 'Inspect connected curriculum dependencies and advance to next unit topics.',
    category: 'advancement',
    urgency: 'optional',
    actionRoute: 'learn',
    estimatedMinutes: 10,
    expectedGain: 'Curriculum advancement'
  };
}

/**
 * LearnPulse Product Metric: Learning Recovery Score
 * Recovery = Current Mastery - Baseline Mastery
 */
export function calculateLearningRecoveryScore(
  baselineMastery: number,
  currentMastery: number
): { baseline: number; current: number; recoveryGain: number; formulaNotice: string } {
  const recoveryGain = Math.max(0, currentMastery - baselineMastery);
  return {
    baseline: baselineMastery,
    current: currentMastery,
    recoveryGain,
    formulaNotice: 'LearnPulse Product Metric: Learning Recovery Score = Current Mastery − Baseline Formative Mastery.'
  };
}
