import { BadgeItem, StudentProfile } from '../types';

export const INITIAL_BADGES_DEFINITIONS: Omit<BadgeItem, 'unlocked' | 'progress' | 'unlockedAt'>[] = [
  {
    id: 'badge-first-step',
    name: 'First Step',
    description: 'Completed your first diagnostic or learning activity on LearnPulse.',
    category: 'milestone',
    icon: 'Footprints',
    rarity: 'common'
  },
  {
    id: 'badge-ready-to-learn',
    name: 'Ready to Learn',
    description: 'Completed a Pre-Class Readiness Preview before your live lesson.',
    category: 'milestone',
    icon: 'Sparkles',
    rarity: 'common'
  },
  {
    id: 'badge-practice-starter',
    name: 'Adaptive Explorer',
    description: 'Finished your first difficulty-calibrated adaptive practice session.',
    category: 'milestone',
    icon: 'Compass',
    rarity: 'common'
  },
  {
    id: 'badge-streak-keeper',
    name: 'Consistent Scholar',
    description: 'Maintained active daily learning consistency for 3 or more days.',
    category: 'consistency',
    icon: 'Flame',
    rarity: 'rare'
  },
  {
    id: 'badge-concept-recovered',
    name: 'Concept Overcomer',
    description: 'Turned a detected learning gap into mastered understanding via Recovery Path.',
    category: 'recovery',
    icon: 'Zap',
    rarity: 'epic'
  },
  {
    id: 'badge-mastery-builder',
    name: 'Mastery Builder',
    description: 'Achieved an overall curriculum mastery score of 75% or higher.',
    category: 'mastery',
    icon: 'Trophy',
    rarity: 'rare'
  },
  {
    id: 'badge-deep-practice',
    name: 'Deep Practice Master',
    description: 'Dedicated 3.0+ hours to focused conceptual deliberate practice.',
    category: 'consistency',
    icon: 'Clock',
    rarity: 'rare'
  },
  {
    id: 'badge-comeback-kid',
    name: 'Resilient Comeback',
    description: 'Demonstrated an upward mastery trajectory (+4% or higher trend).',
    category: 'recovery',
    icon: 'TrendingUp',
    rarity: 'epic'
  },
  {
    id: 'badge-confidence-calibrated',
    name: 'Calibration Genius',
    description: 'Accurately calibrated confidence ratings with zero overconfident errors.',
    category: 'mastery',
    icon: 'Target',
    rarity: 'epic'
  },
  {
    id: 'badge-topic-master',
    name: 'Subject Vanguard',
    description: 'Achieved 85%+ mastery in a major curriculum topic.',
    category: 'mastery',
    icon: 'Crown',
    rarity: 'legendary'
  }
];

/**
 * Deterministically evaluates badge progression based on student metrics.
 */
export function evaluateStudentBadges(
  student: StudentProfile,
  extraContext?: {
    hasCompletedPreClass?: boolean;
    hasCompletedRecovery?: boolean;
    hasCompletedPractice?: boolean;
  }
): BadgeItem[] {
  return INITIAL_BADGES_DEFINITIONS.map(def => {
    let unlocked = false;
    let progress = 0;
    let unlockedAt: string | undefined = undefined;

    switch (def.id) {
      case 'badge-first-step':
        unlocked = true;
        progress = 100;
        unlockedAt = 'Enrolled Term 1';
        break;

      case 'badge-ready-to-learn':
        if (extraContext?.hasCompletedPreClass || student.assignmentConsistency > 75) {
          unlocked = true;
          progress = 100;
          unlockedAt = 'Yesterday';
        } else {
          progress = Math.min(100, Math.round(student.assignmentConsistency));
        }
        break;

      case 'badge-practice-starter':
        if (extraContext?.hasCompletedPractice || student.recentPracticeHours > 0.5) {
          unlocked = true;
          progress = 100;
          unlockedAt = 'This Week';
        } else {
          progress = Math.round((student.recentPracticeHours / 0.5) * 100);
        }
        break;

      case 'badge-streak-keeper':
        // Based on assignment consistency & practice
        if (student.assignmentConsistency >= 85) {
          unlocked = true;
          progress = 100;
          unlockedAt = '3-Day Streak';
        } else {
          progress = Math.round((student.assignmentConsistency / 85) * 100);
        }
        break;

      case 'badge-concept-recovered':
        if (extraContext?.hasCompletedRecovery || student.trend === 'up') {
          unlocked = true;
          progress = 100;
          unlockedAt = 'Linear Equations Mastery';
        } else {
          progress = student.trendDelta > 0 ? 75 : 35;
        }
        break;

      case 'badge-mastery-builder':
        if (student.overallMastery >= 75) {
          unlocked = true;
          progress = 100;
          unlockedAt = `Mastery at ${student.overallMastery}%`;
        } else {
          progress = Math.round((student.overallMastery / 75) * 100);
        }
        break;

      case 'badge-deep-practice':
        if (student.recentPracticeHours >= 3.0) {
          unlocked = true;
          progress = 100;
          unlockedAt = `${student.recentPracticeHours} hrs logged`;
        } else {
          progress = Math.min(100, Math.round((student.recentPracticeHours / 3.0) * 100));
        }
        break;

      case 'badge-comeback-kid':
        if (student.trend === 'up' && student.trendDelta >= 4) {
          unlocked = true;
          progress = 100;
          unlockedAt = `+${student.trendDelta}% delta`;
        } else {
          progress = student.trendDelta > 0 ? Math.round((student.trendDelta / 4) * 100) : 10;
        }
        break;

      case 'badge-confidence-calibrated':
        if (student.repeatedErrorsCount <= 1 && student.recentAccuracy >= 75) {
          unlocked = true;
          progress = 100;
          unlockedAt = 'High Accuracy Alignment';
        } else {
          progress = Math.max(20, 100 - student.repeatedErrorsCount * 25);
        }
        break;

      case 'badge-topic-master':
        const hasTopicMastered = student.topicMastery.some(tm => tm.score >= 85);
        if (hasTopicMastered) {
          unlocked = true;
          progress = 100;
          const top = student.topicMastery.find(tm => tm.score >= 85);
          unlockedAt = top ? `${top.topicName}` : 'Top Subject';
        } else {
          const maxTopic = Math.max(...student.topicMastery.map(tm => tm.score), 0);
          progress = Math.round((maxTopic / 85) * 100);
        }
        break;

      default:
        progress = 50;
    }

    return {
      ...def,
      unlocked,
      progress: Math.min(100, Math.max(0, progress)),
      unlockedAt
    };
  });
}
