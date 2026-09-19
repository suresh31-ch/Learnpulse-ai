import { UserRole } from '../types';

export interface LearningLoopStage {
  id: LearningLoopStageId;
  label: string;
  desc: string;
  stepNumber: string;
}

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

export const LEARNING_LOOP_STAGES: LearningLoopStage[] = [
  { id: 'before_class', stepNumber: '01', label: 'Before Class', desc: 'Syllabus & preview planning' },
  { id: 'pre_class_preview', stepNumber: '02', label: 'Pre-Class Preview', desc: 'Prerequisite checks & readiness' },
  { id: 'classroom', stepNumber: '03', label: 'Classroom', desc: 'Active lecture & interaction' },
  { id: 'quick_check', stepNumber: '04', label: 'Quick Check', desc: 'Formative exit tickets' },
  { id: 'assessment', stepNumber: '05', label: 'Assessment', desc: 'Concept-level evaluation' },
  { id: 'gap_detection', stepNumber: '06', label: 'Gap Detection', desc: 'Algorithmic weakness tagging' },
  { id: 'risk_analysis', stepNumber: '07', label: 'Risk Analysis', desc: 'Early warning signal evaluation' },
  { id: 'intervention', stepNumber: '08', label: 'Intervention', desc: 'Targeted classroom recovery' },
  { id: 'adaptive_practice', stepNumber: '09', label: 'Adaptive Practice', desc: 'Confidence-calibrated practice' },
  { id: 'reassessment', stepNumber: '10', label: 'Reassessment', desc: 'Empirical verification' },
  { id: 'mastery_recovery', stepNumber: '11', label: 'Mastery Recovery', desc: 'Measured learning gain' },
];

/**
 * Maps any Learning Loop Stage to the appropriate application route based on user role.
 */
export function mapStageToRoute(stageId: LearningLoopStageId, role: UserRole = 'student'): string {
  if (role === 'teacher') {
    switch (stageId) {
      case 'before_class':
      case 'pre_class_preview':
        return 'pre_class_intelligence';
      case 'classroom':
        return 'dashboard';
      case 'quick_check':
      case 'reassessment':
        return 'ai_question_generator';
      case 'assessment':
        return 'analytics';
      case 'gap_detection':
        return 'misconception_lab';
      case 'risk_analysis':
        return 'risk_radar';
      case 'intervention':
      case 'mastery_recovery':
        return 'interventions';
      case 'adaptive_practice':
        return 'students';
      default:
        return 'dashboard';
    }
  }

  // Student role default routing
  switch (stageId) {
    case 'before_class':
      return 'learn';
    case 'pre_class_preview':
      return 'preview';
    case 'classroom':
      return 'tutor';
    case 'quick_check':
      return 'check';
    case 'assessment':
      return 'gaps';
    case 'gap_detection':
      return 'gaps';
    case 'risk_analysis':
      return 'insights';
    case 'intervention':
      return 'recovery';
    case 'adaptive_practice':
      return 'practice';
    case 'reassessment':
      return 'check';
    case 'mastery_recovery':
      return 'recovery';
    default:
      return 'home';
  }
}

/**
 * Maps an active application route back to the most relevant Learning Loop Stage.
 */
export function mapRouteToStage(routeId: string, role: UserRole = 'student'): LearningLoopStageId {
  const normalized = routeId.toLowerCase();

  if (role === 'teacher') {
    if (normalized.includes('pre_class')) return 'pre_class_preview';
    if (normalized.includes('question')) return 'quick_check';
    if (normalized.includes('analytics')) return 'assessment';
    if (normalized.includes('misconception')) return 'gap_detection';
    if (normalized.includes('risk')) return 'risk_analysis';
    if (normalized.includes('intervention')) return 'intervention';
    if (normalized.includes('student')) return 'adaptive_practice';
    return 'gap_detection';
  }

  // Student mapping
  if (normalized === 'preview' || normalized === 'pre_class_preview' || normalized === 'pre_class') return 'pre_class_preview';
  if (normalized === 'learn' || normalized === 'knowledge_map') return 'before_class';
  if (normalized === 'tutor' || normalized === 'pulse_tutor') return 'classroom';
  if (normalized === 'check' || normalized === 'quick_check' || normalized === 'understanding_check') return 'quick_check';
  if (normalized === 'gaps' || normalized === 'learning_gaps') return 'gap_detection';
  if (normalized === 'practice' || normalized === 'adaptive_practice') return 'adaptive_practice';
  if (normalized === 'recovery' || normalized === 'recovery_path' || normalized === 'recovery_mission') return 'intervention';
  if (normalized === 'insights' || normalized === 'pdf') return 'risk_analysis';
  if (normalized === 'profile') return 'mastery_recovery';

  return 'pre_class_preview';
}
