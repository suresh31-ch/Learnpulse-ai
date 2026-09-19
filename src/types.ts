/**
 * LearnPulse AI — Core Domain Types & Data Contracts
 * Curriculum-Agnostic Learning Intelligence Architecture
 */

export type UserRole = 'student' | 'teacher' | 'parent' | 'admin';

export type LearningLoopStageId =
  | 'before_class'
  | 'pre_class_preview'
  | 'classroom'
  | 'quick_check'
  | 'assessment'
  | 'gap_detection'
  | 'risk_analysis'
  | 'intervention'
  | 'adaptive_practice'
  | 'reassessment'
  | 'mastery_recovery';

export type CurriculumType = 'CBSE' | 'ICSE' | 'Cambridge' | 'StateBoard' | 'JEE' | 'NEET' | 'HigherEd';

export type MasteryLevel = 'mastered' | 'developing' | 'critical';

export type RiskLevel = 'low' | 'watch' | 'elevated' | 'critical';

export type TrendDirection = 'up' | 'down' | 'stable';

export type ConfidenceRating = 'guessing' | 'somewhat' | 'very';

export type QuestionType = 'mcq' | 'numerical' | 'conceptual' | 'application' | 'misconception';

export interface ConceptMastery {
  conceptId: string;
  conceptName: string;
  masteryPercentage: number;
  status: MasteryLevel;
  attemptsCount: number;
  lastAssessedAt: string;
}

export interface TopicItem {
  id: string;
  name: string;
  unit: string;
  subject: string;
  masteryPercentage: number;
  studentsAffected?: number;
  trend: TrendDirection;
  trendValue: number;
  concepts: ConceptMastery[];
  commonMisconception?: string;
  misconceptionDescription?: string;
}

export interface PrerequisiteCheck {
  id: string;
  name: string;
  masteryPercentage: number;
  status: 'passed' | 'warning' | 'gap';
}

export interface PreClassPreviewData {
  topicId: string;
  topicTitle: string;
  scheduledFor: string;
  durationMinutes: number;
  whatYouWillLearn: string[];
  whyItMatters: string;
  aiIntroduction: string;
  keyVocabulary: { term: string; definition: string }[];
  keyFormulas: { name: string; formula: string; note?: string }[];
  prerequisites: PrerequisiteCheck[];
  readinessPercentage: number;
  aiInsight: string;
  recommendedPreparation: string;
  quickQuestions: {
    id: string;
    questionText: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    conceptChecked: string;
  }[];
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  className: string;
  rollNumber: string;
  overallMastery: number;
  riskLevel: RiskLevel;
  trend: TrendDirection;
  trendDelta: number;
  primaryGapTopic: string;
  lastAssessmentDate: string;
  recommendedAction: string;
  recentAccuracy: number;
  recentPracticeHours: number;
  assignmentConsistency: number; // percentage
  repeatedErrorsCount: number;
  evidencePoints: string[];
  misconceptionDetected?: {
    topic: string;
    concept: string;
    title: string;
    evidence: string;
    firstObserved: string;
  };
  topicMastery: {
    topicName: string;
    subject: string;
    score: number;
    status: MasteryLevel;
  }[];
}

export interface ActiveIntervention {
  id: string;
  title: string;
  topic: string;
  studentsCount: number;
  progressPercentage: number;
  status: 'active' | 'completed' | 'scheduled';
  expectedCompletion: string;
  beforeMastery: number;
  afterMastery?: number;
  effectivenessGain?: number;
  strategy: string;
  timeline: {
    minutes: string;
    title: string;
    description: string;
  }[];
  studentIds: string[];
}

export interface MisconceptionRecord {
  id: string;
  topic: string;
  concept: string;
  misconception: string;
  studentsAffected: number;
  evidence: string;
  confidenceScore: number; // 0 - 100
  recommendedIntervention: string;
  category: 'algebraic_sign' | 'conceptual_inversion' | 'formula_misapplication' | 'graphical_misread';
}

export interface TutorMessage {
  id: string;
  sender: 'user' | 'tutor' | 'system';
  text: string;
  mode?: 'socratic' | 'simple' | 'step_by_step' | 'visual' | 'real_world' | 'exam';
  timestamp: string;
  suggestedPrompts?: string[];
  mathSnippet?: string;
  isModeSwitch?: boolean;
}

export interface PracticeQuestion {
  id: string;
  subject: string;
  topic: string;
  concept: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  type: QuestionType;
  prompt: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  learningObjective: string;
  misconceptionTargeted?: string;
}

export interface GeneratedQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  concept: string;
  difficulty: string;
  targetMisconception: string;
}


export interface LearningRecoveryScoreData {
  topic: string;
  studentName?: string;
  beforeIntervention: number;
  afterIntervention: number;
  recoveryPoints: number;
  status: 'recovered' | 'in_progress' | 'stalled';
  whatChanged: string[];
  completedAt: string;
}

export interface PreClassTeacherIntelligenceData {
  topic: string;
  readyCount: number;
  needsPrepCount: number;
  needsSupportCount: number;
  aiTeachingRecommendation: string;
  prerequisites: {
    name: string;
    masteryPercentage: number;
    status: 'good' | 'attention';
  }[];
}

export interface MisconceptionLabItem {
  id: string;
  topic: string;
  concept: string;
  misconceptionTitle: string;
  affectedStudentsCount: number;
  confidence: number;
  rootCauseExplanation: string;
  exampleErrorSnippet: string;
  recommendedIntervention: string;
}

export interface ParentStudentInfo {
  childName: string;
  className: string;
  parentName: string;
  teacherName: string;
  summaryNotice: string;
  strengths: {
    topic: string;
    mastery: number;
    note: string;
  }[];
  needsSupport: {
    topic: string;
    mastery: number;
    plainLanguageExplanation: string;
    schoolAction: string;
  }[];
  practicalHomeActions: {
    title: string;
    description: string;
  }[];
  upcomingAssessments: {
    title: string;
    focusTopic: string;
    date: string;
  }[];
}

export interface AdminAnalytics {
  institutionName: string;
  totalSchools: number;
  totalStudents: number;
  totalTeachers: number;
  dailyActiveTeachers: number;
  averageMastery: number;
  gapsDetected: number;
  activeInterventions: number;
  interventionSuccessRate: number;
  systemicGaps: {
    topic: string;
    schoolsAffected: number;
    commonBottleneck: string;
    totalStudentsImpacted: number;
  }[];
  schools: {
    id: string;
    name: string;
    studentsCount: number;
    avgMastery: number;
    gapsDetected: number;
    recoveryEfficacy: number;
  }[];
}

export interface TeacherCommandResponse {
  summary: string;
  keyIssues: {
    topic: string;
    impact: string;
    urgency: 'high' | 'medium' | 'low';
  }[];
  recommendedAction: string;
  actionType: 'intervention' | 'quiz' | 'recap' | 'group_study';
  actionPayload?: any;
}

// ==========================================
// Step 7: Student Experience & Learning Gap Models
// ==========================================

export interface LearningGap {
  id: string;
  topicId: string;
  topicName: string;
  conceptId: string;
  conceptName: string;
  subject: string;
  currentMastery: number;
  baselineMastery: number;
  severity: 'critical' | 'moderate' | 'mild';
  evidence: string[];
  prerequisiteGap?: {
    concept: string;
    status: 'weak' | 'missing' | 'developing';
    description: string;
  } | null;
  trend: TrendDirection;
  confidenceMismatch?: {
    type: 'overconfident' | 'underconfident';
    description: string;
  } | null;
  recommendedAction: string;
  recoveryGain?: number;
  status: 'active' | 'in_recovery' | 'resolved';
}

export interface BadgeItem {
  id: string;
  name: string;
  description: string;
  category: 'milestone' | 'consistency' | 'mastery' | 'recovery';
  icon: string;
  unlocked: boolean;
  progress: number; // 0 - 100
  unlockedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface UnderstandingCheckQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  conceptTested: string;
}

export interface UnderstandingCheckResult {
  topicTitle: string;
  preClassScore: number; // percentage
  postClassScore: number; // percentage
  deltaScore: number; // e.g. +30
  status: 'significant_growth' | 'steady_progress' | 'needs_reinforcement';
  whatChanged: string[];
  nextStepRecommendation: string;
}

export interface NextBestAction {
  id: string;
  title: string;
  subtitle: string;
  category: 'readiness' | 'recovery' | 'practice' | 'reassessment' | 'advancement';
  urgency: 'immediate' | 'recommended' | 'optional';
  actionRoute: string;
  actionPayload?: string;
  estimatedMinutes: number;
  expectedGain: string;
}

export interface StudentProgressReportData {
  studentName: string;
  institutionName: string;
  className: string;
  rollNumber: string;
  generatedDate: string;
  overallMastery: number;
  trendDirection: TrendDirection;
  trendDelta: number;
  recentAccuracy: number;
  practiceHours: number;
  streakDays: number;
  strongestAreas: { topic: string; subject: string; score: number }[];
  learningGaps: {
    topic: string;
    concept: string;
    currentMastery: number;
    severity: string;
    recommendedAction: string;
  }[];
  misconceptions: string[];
  recentAssessments: { title: string; date: string; score: number }[];
  preClassReadinessAverage: number;
  learningRecoveryScore: {
    baseline: number;
    current: number;
    gain: number;
    status: string;
  };
  badgesSummary: {
    totalUnlocked: number;
    totalAvailable: number;
    recentBadges: string[];
  };
  nextBestAction: string;
}
