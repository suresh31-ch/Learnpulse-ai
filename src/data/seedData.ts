import {
  StudentProfile,
  TopicItem,
  PreClassPreviewData,
  ActiveIntervention,
  MisconceptionRecord,
  PracticeQuestion,
  LearningRecoveryScoreData,
  AdminAnalytics,
  ParentStudentInfo
} from '../types';

/**
 * LearnPulse AI — Step 6: Realistic Demonstration Dataset (Seed Data)
 * 
 * ALL DATA IN THIS FILE IS FICTIONAL DEMONSTRATION CONTENT.
 * Clearly labeled as Demo Data.
 * Institution: LearnPulse Demo Academy
 */

export const DEMO_METADATA = {
  isDemo: true,
  label: 'Demo Data',
  description: 'Fictional demonstration data for LearnPulse AI evaluation and review.',
  institutionName: 'LearnPulse Demo Academy',
  academicYear: '2025–2026'
};

export const DEMO_INSTITUTION = {
  id: '11111111-1111-1111-1111-111111111111',
  name: 'LearnPulse Demo Academy',
  type: 'k12_academy',
  academicYear: '2025–2026',
  curriculumTracks: ['CBSE Secondary (Class 10)', 'JEE Advanced Preparation (Batch Alpha)'],
  totalStudents: 420,
  totalTeachers: 24,
  averageMastery: 73,
  atRiskCount: 38,
  activeInterventions: 28,
  schools: [
    {
      id: 'sch-main',
      name: 'LearnPulse Demo Academy (Main Campus)',
      code: 'LPDA-MAIN',
      studentsCount: 260,
      teachersCount: 15,
      avgMastery: 74,
      gapsDetected: 32,
      recoveryEfficacy: 84
    },
    {
      id: 'sch-stem',
      name: 'LearnPulse Demo Academy (STEM Wing)',
      code: 'LPDA-STEM',
      studentsCount: 160,
      teachersCount: 9,
      avgMastery: 72,
      gapsDetected: 24,
      recoveryEfficacy: 79
    }
  ]
};

export const DEMO_PROGRAMS = [
  {
    id: '22222222-1111-1111-1111-111111111111',
    name: 'Class 10 CBSE Secondary',
    description: 'Central Board of Secondary Education Class 10 Curriculum',
    classesCount: 6,
    studentsCount: 210
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'JEE Advanced Preparation (Batch Alpha)',
    description: 'Intensive engineering entrance competitive training track',
    classesCount: 4,
    studentsCount: 120
  }
];

export const DEMO_CLASSES = [
  {
    id: '77777777-1111-1111-1111-111111111111',
    name: 'Class 10A — Mathematics',
    academicYear: '2025–2026',
    programName: 'Class 10 CBSE Secondary',
    subject: 'Mathematics',
    teacherName: 'Dr. Radhika Sharma',
    studentsCount: 36,
    averageMastery: 71,
    atRiskCount: 5
  },
  {
    id: '77777777-2222-2222-2222-222222222222',
    name: 'Class 10A — Science',
    academicYear: '2025–2026',
    programName: 'Class 10 CBSE Secondary',
    subject: 'Science (Physics/Chem)',
    teacherName: 'Prof. Vikram Sen',
    studentsCount: 36,
    averageMastery: 74,
    atRiskCount: 4
  },
  {
    id: '77777777-3333-3333-3333-333333333333',
    name: 'JEE Batch Alpha — Physics',
    academicYear: '2025–2026',
    programName: 'JEE Advanced Preparation',
    subject: 'Physics',
    teacherName: 'Prof. Vikram Sen',
    studentsCount: 28,
    averageMastery: 78,
    atRiskCount: 3
  },
  {
    id: '77777777-4444-4444-4444-444444444444',
    name: 'JEE Batch Alpha — Mathematics',
    academicYear: '2025–2026',
    programName: 'JEE Advanced Preparation',
    subject: 'Mathematics',
    teacherName: 'Dr. Radhika Sharma',
    studentsCount: 28,
    averageMastery: 76,
    atRiskCount: 4
  }
];

export const CURRENT_CLASS_INFO = {
  className: 'Class 10A — Mathematics',
  subject: 'Mathematics',
  academicYear: '2025–2026',
  curriculum: 'CBSE Secondary',
  teacher: 'Dr. Radhika Sharma',
  schoolName: 'LearnPulse Demo Academy',
  totalStudents: 36,
  averageMastery: 71,
  atRiskCount: 5,
  criticalCount: 2,
  improvingCount: 21,
  stableCount: 8
};

export const CLASS_MASTERY_OVERVIEW = [
  { subject: 'Quadratic Equations', mastery: 64, trend: 'down', change: '-6%' },
  { subject: 'Linear Equations', mastery: 84, trend: 'up', change: '+4%' },
  { subject: 'Kinematics', mastery: 72, trend: 'up', change: '+3%' },
  { subject: 'Newton’s Laws', mastery: 68, trend: 'stable', change: '0%' },
  { subject: 'Electricity & Circuits', mastery: 76, trend: 'up', change: '+5%' }
];

export const DEMO_CURRICULUM_HIERARCHY = [
  {
    subject: 'Mathematics',
    unit: 'Algebra',
    topics: [
      {
        id: '55555555-1111-1111-1111-111111111111',
        name: 'Quadratic Equations',
        concepts: [
          { id: '66666666-1111-1111-1111-111111111111', name: 'Factorisation', prerequisites: ['Solving Linear Equations'] },
          { id: '66666666-1111-1111-1111-111111111112', name: 'Roots of Quadratic Equations', prerequisites: ['Factorisation'] },
          { id: '66666666-1111-1111-1111-111111111113', name: 'Discriminant', prerequisites: ['Solving Linear Equations'] }
        ]
      },
      {
        id: '55555555-2222-2222-2222-222222222222',
        name: 'Linear Equations',
        concepts: [
          { id: '66666666-2222-2222-2222-222222222221', name: 'Solving Linear Equations', prerequisites: [] },
          { id: '66666666-2222-2222-2222-222222222222', name: 'Substitution and Elimination', prerequisites: ['Solving Linear Equations'] }
        ]
      }
    ]
  },
  {
    subject: 'Physics',
    unit: 'Mechanics',
    topics: [
      {
        id: '55555555-3333-3333-3333-333333333333',
        name: 'Kinematics',
        concepts: [
          { id: '66666666-3333-3333-3333-333333333331', name: 'Motion in One Dimension', prerequisites: [] },
          { id: '66666666-3333-3333-3333-333333333332', name: 'Velocity and Acceleration', prerequisites: ['Motion in One Dimension'] }
        ]
      },
      {
        id: '55555555-4444-4444-4444-444444444444',
        name: 'Newton’s Laws',
        concepts: [
          { id: '66666666-4444-4444-4444-444444444441', name: 'Forces', prerequisites: ['Velocity and Acceleration'] },
          { id: '66666666-4444-4444-4444-444444444442', name: 'Free Body Diagrams', prerequisites: ['Forces'] }
        ]
      }
    ]
  },
  {
    subject: 'Science',
    unit: 'Electricity',
    topics: [
      {
        id: '55555555-5555-5555-5555-555555555555',
        name: 'Electricity',
        concepts: [
          { id: '66666666-5555-5555-5555-555555555551', name: 'Ohm’s Law', prerequisites: ['Resistance and Current'] },
          { id: '66666666-5555-5555-5555-555555555552', name: 'Resistance and Current', prerequisites: [] }
        ]
      }
    ]
  }
];

export const PRE_CLASS_PREVIEW_TOMORROW: PreClassPreviewData = {
  topicId: '55555555-1111-1111-1111-111111111111',
  topicTitle: 'Quadratic Equations (Discriminant & Roots)',
  scheduledFor: 'Tomorrow, 09:30 AM (Period 2)',
  durationMinutes: 45,
  whatYouWillLearn: [
    'Standard quadratic form: ax² + bx + c = 0 (where a ≠ 0)',
    'The role of discriminant Δ = b² - 4ac in determining real vs complex roots',
    'Solving quadratics via factorization and quadratic formula',
    'Interpreting negative constants without algebraic sign errors'
  ],
  whyItMatters: 'Quadratic curves model parabolic trajectory in physics (satellite dishes, projectile arcs), structural arches in architecture, and revenue optimization models.',
  aiIntroduction: 'Imagine launching a model rocket: its altitude over time forms an inverted parabola. Quadratic equations provide the mathematical syntax to calculate peak height and landing timestamp.',
  keyVocabulary: [
    { term: 'Quadratic Polynomial', definition: 'A polynomial of degree 2 whose standard form is ax² + bx + c = 0.' },
    { term: 'Roots / Zeroes', definition: 'The values of x for which the quadratic function equals zero.' },
    { term: 'Discriminant (Δ)', definition: 'The value b² - 4ac determining the nature and multiplicity of roots.' },
    { term: 'Vertex', definition: 'The turning point of the parabolic graph.' }
  ],
  keyFormulas: [
    { name: 'Standard Form', formula: 'ax² + bx + c = 0, a ≠ 0' },
    { name: 'Discriminant', formula: 'Δ = b² - 4ac' },
    { name: 'Quadratic Formula', formula: 'x = (-b ± √(b² - 4ac)) / (2a)', note: 'Remember the ± yields two root branches' }
  ],
  prerequisites: [
    { id: 'p1', name: 'Factorisation of Polynomials', masteryPercentage: 82, status: 'passed' },
    { id: 'p2', name: 'Solving Linear Equations', masteryPercentage: 84, status: 'passed' },
    { id: 'p3', name: 'Algebraic Sign Rules (Negative Constants)', masteryPercentage: 51, status: 'gap' }
  ],
  readinessPercentage: 58,
  aiInsight: 'You have solid retention in polynomial factorisation (82%) and linear equations (84%), but prerequisite checks indicate algebraic sign manipulation when c < 0 is at 51%. A 5-minute review before tomorrow’s lesson will prevent calculation bottlenecks.',
  recommendedPreparation: 'Review sign multiplication rules when multiplying -4(a)(c) with negative constants.',
  quickQuestions: [
    {
      id: 'q1',
      questionText: 'Which of the following equations is in standard quadratic form?',
      options: ['2x² - 5x + 3 = 0', '3x³ + 2x² - 4 = 0', '4x - 7 = 0', 'x² + 1/x = 5'],
      correctIndex: 0,
      explanation: 'Standard quadratic form is ax² + bx + c = 0 with degree exactly 2 and a ≠ 0.',
      conceptChecked: 'Standard Form Identification'
    },
    {
      id: 'q2',
      questionText: 'For the equation 2x² - 4x - 6 = 0, what is the value of the constant term c?',
      options: ['6', '-6', '-4', '2'],
      correctIndex: 1,
      explanation: 'In ax² + bx + c = 0, here a = 2, b = -4, and c = -6 (including the negative sign!).',
      conceptChecked: 'Sign Rule Identification'
    },
    {
      id: 'q3',
      questionText: 'If b² - 4ac is greater than 0, how many distinct real roots exist?',
      options: ['0 (No real roots)', '1 (Equal real root)', '2 distinct real roots', 'Infinitely many'],
      correctIndex: 2,
      explanation: 'When Δ > 0, the square root yields two non-zero values (±√Δ), giving two distinct real roots.',
      conceptChecked: 'Discriminant Interpretation'
    }
  ]
};

/**
 * 18 Realistic Fictional Demo Students
 * Covering High (85-98%), Medium (65-84%), Needs Support (40-64%), and Critical Gap (<40%).
 */
export const STUDENTS_SEED: StudentProfile[] = [
  {
    id: 's-101',
    name: 'Aarav Mehta',
    email: 'aarav.mehta@demo.learnpulse.ai',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    className: 'Class 10A — Mathematics',
    rollNumber: '10A-01',
    overallMastery: 78,
    riskLevel: 'low',
    trend: 'stable',
    trendDelta: 1,
    primaryGapTopic: 'Coordinate Geometry',
    lastAssessmentDate: 'Yesterday, 3:15 PM',
    recommendedAction: 'Targeted Review on Distance Formula',
    recentAccuracy: 81,
    recentPracticeHours: 3.5,
    assignmentConsistency: 92,
    repeatedErrorsCount: 1,
    evidencePoints: [
      'Strong performance across Linear Equations (86%) and Kinematics (80%).',
      'Stable mastery trend across the past 4 formative assessments.',
      'Minor latency increase in multi-step quadratic word problems.'
    ],
    topicMastery: [
      { topicName: 'Quadratic Equations', subject: 'Mathematics', score: 76, status: 'mastered' },
      { topicName: 'Linear Equations', subject: 'Mathematics', score: 86, status: 'mastered' },
      { topicName: 'Kinematics', subject: 'Physics', score: 80, status: 'mastered' },
      { topicName: 'Newton’s Laws', subject: 'Physics', score: 72, status: 'developing' },
      { topicName: 'Electricity', subject: 'Science', score: 79, status: 'mastered' }
    ]
  },
  {
    id: 's-102',
    name: 'Ananya Sharma',
    email: 'ananya.sharma@demo.learnpulse.ai',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    className: 'Class 10A — Mathematics',
    rollNumber: '10A-02',
    overallMastery: 94,
    riskLevel: 'low',
    trend: 'up',
    trendDelta: 5,
    primaryGapTopic: 'None (High Mastery)',
    lastAssessmentDate: 'Today, 11:30 AM',
    recommendedAction: 'Olympiad Extension Track',
    recentAccuracy: 96,
    recentPracticeHours: 5.4,
    assignmentConsistency: 100,
    repeatedErrorsCount: 0,
    evidencePoints: [
      'Top 5% percentile across all curriculum units.',
      '100% pre-class readiness completion rate across the term.',
      'Demonstrates advanced conceptual fluency in Free Body Diagrams.'
    ],
    topicMastery: [
      { topicName: 'Quadratic Equations', subject: 'Mathematics', score: 95, status: 'mastered' },
      { topicName: 'Linear Equations', subject: 'Mathematics', score: 98, status: 'mastered' },
      { topicName: 'Kinematics', subject: 'Physics', score: 92, status: 'mastered' },
      { topicName: 'Newton’s Laws', subject: 'Physics', score: 94, status: 'mastered' },
      { topicName: 'Electricity', subject: 'Science', score: 91, status: 'mastered' }
    ]
  },
  {
    id: 's-103',
    name: 'Rohan Verma',
    email: 'rohan.verma@demo.learnpulse.ai',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    className: 'Class 10A — Mathematics',
    rollNumber: '10A-03',
    overallMastery: 71,
    riskLevel: 'watch',
    trend: 'down',
    trendDelta: -4,
    primaryGapTopic: 'Newton’s Laws (Free Body Diagrams)',
    lastAssessmentDate: '2 days ago',
    recommendedAction: 'Free Body Diagram Direction Check',
    recentAccuracy: 68,
    recentPracticeHours: 2.1,
    assignmentConsistency: 84,
    repeatedErrorsCount: 3,
    evidencePoints: [
      'Recent accuracy decreased from 80% to 68% on dynamic physics problems.',
      'Repeated error pattern: omitted friction vectors in free body diagrams.',
      'Strong algebraic base in linear equations (82%) provides foundation for recovery.'
    ],
    misconceptionDetected: {
      topic: 'Newton’s Laws',
      concept: 'Free Body Diagrams',
      title: 'Incorrect force direction in free-body diagrams',
      evidence: 'Repeatedly placed friction force parallel to motion direction instead of opposing relative surface motion.',
      firstObserved: '4 days ago on Checkpoint #3'
    },
    topicMastery: [
      { topicName: 'Quadratic Equations', subject: 'Mathematics', score: 72, status: 'developing' },
      { topicName: 'Linear Equations', subject: 'Mathematics', score: 82, status: 'mastered' },
      { topicName: 'Kinematics', subject: 'Physics', score: 75, status: 'mastered' },
      { topicName: 'Newton’s Laws', subject: 'Physics', score: 56, status: 'developing' },
      { topicName: 'Electricity', subject: 'Science', score: 70, status: 'developing' }
    ]
  },
  {
    id: 's-104',
    name: 'Priya Nair',
    email: 'priya.nair@demo.learnpulse.ai',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    className: 'Class 10A — Mathematics',
    rollNumber: '10A-04',
    overallMastery: 88,
    riskLevel: 'low',
    trend: 'up',
    trendDelta: 6,
    primaryGapTopic: 'None (Stable High)',
    lastAssessmentDate: 'Today, 10:00 AM',
    recommendedAction: 'JEE Advanced Mechanics Prep',
    recentAccuracy: 90,
    recentPracticeHours: 4.8,
    assignmentConsistency: 96,
    repeatedErrorsCount: 1,
    evidencePoints: [
      'Achieved 91% on Kinematics Quick Assessment.',
      'Rapid question completion with high confidence calibration.',
      'Active contributor to class peer problem solving.'
    ],
    topicMastery: [
      { topicName: 'Quadratic Equations', subject: 'Mathematics', score: 89, status: 'mastered' },
      { topicName: 'Linear Equations', subject: 'Mathematics', score: 92, status: 'mastered' },
      { topicName: 'Kinematics', subject: 'Physics', score: 91, status: 'mastered' },
      { topicName: 'Newton’s Laws', subject: 'Physics', score: 84, status: 'mastered' },
      { topicName: 'Electricity', subject: 'Science', score: 85, status: 'mastered' }
    ]
  },
  {
    id: 's-105',
    name: 'Arjun Rao',
    email: 'arjun.rao@demo.learnpulse.ai',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    className: 'Class 10A — Mathematics',
    rollNumber: '10A-05',
    overallMastery: 64,
    riskLevel: 'watch',
    trend: 'stable',
    trendDelta: 0,
    primaryGapTopic: 'Electricity (Ohm’s Law Formula)',
    lastAssessmentDate: '3 days ago',
    recommendedAction: 'Ohm’s Law Circuit Simulator Practice',
    recentAccuracy: 62,
    recentPracticeHours: 2.2,
    assignmentConsistency: 78,
    repeatedErrorsCount: 3,
    evidencePoints: [
      'Struggles with series-parallel branch resistance calculations.',
      'Consistently inverts current and resistance when calculating voltage drop.',
      'High motivation and attendance during in-class discussions.'
    ],
    misconceptionDetected: {
      topic: 'Electricity',
      concept: 'Ohm’s Law',
      title: 'Applies Ohm’s law variables incorrectly',
      evidence: 'Calculated current as I = V × R instead of I = V / R across 3 consecutive circuit questions.',
      firstObserved: '5 days ago on Electricity Checkpoint'
    },
    topicMastery: [
      { topicName: 'Quadratic Equations', subject: 'Mathematics', score: 68, status: 'developing' },
      { topicName: 'Linear Equations', subject: 'Mathematics', score: 76, status: 'mastered' },
      { topicName: 'Kinematics', subject: 'Physics', score: 67, status: 'developing' },
      { topicName: 'Newton’s Laws', subject: 'Physics', score: 60, status: 'developing' },
      { topicName: 'Electricity', subject: 'Science', score: 52, status: 'developing' }
    ]
  },
  {
    id: 's-106',
    name: 'Kavya Iyer',
    email: 'kavya.iyer@demo.learnpulse.ai',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    className: 'Class 10A — Mathematics',
    rollNumber: '10A-06',
    overallMastery: 74,
    riskLevel: 'low',
    trend: 'stable',
    trendDelta: 2,
    primaryGapTopic: 'Quadratic Formula Radicals',
    lastAssessmentDate: 'Yesterday',
    recommendedAction: 'Scaffolded Quadratic Roots Practice',
    recentAccuracy: 76,
    recentPracticeHours: 3.4,
    assignmentConsistency: 90,
    repeatedErrorsCount: 1,
    evidencePoints: [
      'Strong conceptual grasp in Motion in One Dimension (85%).',
      'Minor algebraic simplification errors when roots contain irrational radicals.',
      'Consistent daily practice routine.'
    ],
    topicMastery: [
      { topicName: 'Quadratic Equations', subject: 'Mathematics', score: 70, status: 'developing' },
      { topicName: 'Linear Equations', subject: 'Mathematics', score: 81, status: 'mastered' },
      { topicName: 'Kinematics', subject: 'Physics', score: 85, status: 'mastered' },
      { topicName: 'Newton’s Laws', subject: 'Physics', score: 68, status: 'developing' },
      { topicName: 'Electricity', subject: 'Science', score: 72, status: 'developing' }
    ]
  },
  {
    id: 's-107',
    name: 'Vihaan Kapoor',
    email: 'vihaan.kapoor@demo.learnpulse.ai',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    className: 'Class 10A — Mathematics',
    rollNumber: '10A-07',
    overallMastery: 49,
    riskLevel: 'elevated',
    trend: 'down',
    trendDelta: -9,
    primaryGapTopic: 'Kinematics (Velocity vs Acceleration)',
    lastAssessmentDate: '3 days ago',
    recommendedAction: 'Kinematics Concept Repair Mission',
    recentAccuracy: 46,
    recentPracticeHours: 1.1,
    assignmentConsistency: 60,
    repeatedErrorsCount: 5,
    evidencePoints: [
      'Accuracy dropped below 50% across the last 3 physics formative checks.',
      'Repeatedly confuses positive velocity with positive acceleration in deceleration scenarios.',
      'Practice activity dropped from 2.8 hrs/wk to 1.1 hrs/wk.'
    ],
    misconceptionDetected: {
      topic: 'Kinematics',
      concept: 'Velocity and Acceleration',
      title: 'Confuses velocity with acceleration in decelerating bodies',
      evidence: 'Stated that an object moving north cannot accelerate south without instantly changing direction.',
      firstObserved: 'Last Friday on Kinematics Check'
    },
    topicMastery: [
      { topicName: 'Quadratic Equations', subject: 'Mathematics', score: 54, status: 'developing' },
      { topicName: 'Linear Equations', subject: 'Mathematics', score: 65, status: 'developing' },
      { topicName: 'Kinematics', subject: 'Physics', score: 44, status: 'critical' },
      { topicName: 'Newton’s Laws', subject: 'Physics', score: 42, status: 'critical' },
      { topicName: 'Electricity', subject: 'Science', score: 51, status: 'developing' }
    ]
  },
  {
    id: 's-108',
    name: 'Meera Patel',
    email: 'meera.patel@demo.learnpulse.ai',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    className: 'Class 10A — Mathematics',
    rollNumber: '10A-08',
    overallMastery: 52,
    riskLevel: 'elevated',
    trend: 'down',
    trendDelta: -7,
    primaryGapTopic: 'Factorisation of Quadratics',
    lastAssessmentDate: '4 days ago',
    recommendedAction: 'Factorisation Recovery Sprint',
    recentAccuracy: 50,
    recentPracticeHours: 1.4,
    assignmentConsistency: 65,
    repeatedErrorsCount: 4,
    evidencePoints: [
      'Middle-term splitting errors observed in 4 out of 5 quadratic tests.',
      'Prerequisite gap in identifying factor pairs that sum to negative middle terms.',
      'Self-reported low confidence despite spending >25 mins per test.'
    ],
    topicMastery: [
      { topicName: 'Quadratic Equations', subject: 'Mathematics', score: 42, status: 'critical' },
      { topicName: 'Linear Equations', subject: 'Mathematics', score: 64, status: 'developing' },
      { topicName: 'Kinematics', subject: 'Physics', score: 58, status: 'developing' },
      { topicName: 'Newton’s Laws', subject: 'Physics', score: 51, status: 'developing' },
      { topicName: 'Electricity', subject: 'Science', score: 55, status: 'developing' }
    ]
  },
  {
    id: 's-109',
    name: 'Aditya Singh',
    email: 'aditya.singh@demo.learnpulse.ai',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    className: 'Class 10A — Mathematics',
    rollNumber: '10A-09',
    overallMastery: 67,
    riskLevel: 'watch',
    trend: 'stable',
    trendDelta: 0,
    primaryGapTopic: 'Newton’s Third Law Paired Forces',
    lastAssessmentDate: 'Yesterday',
    recommendedAction: 'Targeted Newton’s Laws Practice',
    recentAccuracy: 70,
    recentPracticeHours: 2.8,
    assignmentConsistency: 86,
    repeatedErrorsCount: 2,
    evidencePoints: [
      'Steady homework completion but struggles with action-reaction force pair identification.',
      'Good mathematical computation speed across linear and quadratic formulas.'
    ],
    topicMastery: [
      { topicName: 'Quadratic Equations', subject: 'Mathematics', score: 71, status: 'developing' },
      { topicName: 'Linear Equations', subject: 'Mathematics', score: 79, status: 'mastered' },
      { topicName: 'Kinematics', subject: 'Physics', score: 70, status: 'developing' },
      { topicName: 'Newton’s Laws', subject: 'Physics', score: 58, status: 'developing' },
      { topicName: 'Electricity', subject: 'Science', score: 68, status: 'developing' }
    ]
  },
  {
    id: 's-110',
    name: 'Ishita Gupta',
    email: 'ishita.gupta@demo.learnpulse.ai',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    className: 'Class 10A — Mathematics',
    rollNumber: '10A-10',
    overallMastery: 83,
    riskLevel: 'low',
    trend: 'up',
    trendDelta: 7,
    primaryGapTopic: 'None (Consistently Improving)',
    lastAssessmentDate: 'Today, 9:00 AM',
    recommendedAction: 'Maintain Adaptive Practice Schedule',
    recentAccuracy: 88,
    recentPracticeHours: 4.0,
    assignmentConsistency: 95,
    repeatedErrorsCount: 1,
    evidencePoints: [
      'Mastery improved from 72% to 83% following targeted pre-class previews.',
      'Flawless execution in linear equation substitution and elimination methods.'
    ],
    topicMastery: [
      { topicName: 'Quadratic Equations', subject: 'Mathematics', score: 84, status: 'mastered' },
      { topicName: 'Linear Equations', subject: 'Mathematics', score: 90, status: 'mastered' },
      { topicName: 'Kinematics', subject: 'Physics', score: 81, status: 'mastered' },
      { topicName: 'Newton’s Laws', subject: 'Physics', score: 80, status: 'mastered' },
      { topicName: 'Electricity', subject: 'Science', score: 82, status: 'mastered' }
    ]
  },
  {
    id: 's-111',
    name: 'Dev Malhotra',
    email: 'dev.malhotra@demo.learnpulse.ai',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    className: 'Class 10A — Mathematics',
    rollNumber: '10A-11',
    overallMastery: 36,
    riskLevel: 'critical',
    trend: 'down',
    trendDelta: -14,
    primaryGapTopic: 'Factorisation & Linear Equations Prerequisite',
    lastAssessmentDate: '5 days ago',
    recommendedAction: 'Immediate 1-on-1 Foundation Intervention',
    recentAccuracy: 34,
    recentPracticeHours: 0.6,
    assignmentConsistency: 45,
    repeatedErrorsCount: 7,
    evidencePoints: [
      'Severe prerequisite gap spanning 7th and 8th grade algebraic manipulation.',
      'Sign error when constant c is negative, reversing discriminant signs in 100% of tested cases.',
      'Rapid submission latency (<10s) indicating random guessing on recent checkpoints.'
    ],
    misconceptionDetected: {
      topic: 'Quadratic Equations',
      concept: 'Discriminant',
      title: 'Sign error while solving quadratic equations',
      evidence: 'Evaluated b² - 4ac as b² - (4ac) treating negative c as a positive scalar, producing negative discriminants for real roots.',
      firstObserved: '10 days ago'
    },
    topicMastery: [
      { topicName: 'Quadratic Equations', subject: 'Mathematics', score: 28, status: 'critical' },
      { topicName: 'Linear Equations', subject: 'Mathematics', score: 41, status: 'critical' },
      { topicName: 'Kinematics', subject: 'Physics', score: 38, status: 'critical' },
      { topicName: 'Newton’s Laws', subject: 'Physics', score: 35, status: 'critical' },
      { topicName: 'Electricity', subject: 'Science', score: 40, status: 'critical' }
    ]
  },
  {
    id: 's-112',
    name: 'Sneha Reddy',
    email: 'sneha.reddy@demo.learnpulse.ai',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    className: 'Class 10A — Mathematics',
    rollNumber: '10A-12',
    overallMastery: 73,
    riskLevel: 'low',
    trend: 'up',
    trendDelta: 5,
    primaryGapTopic: 'Translating Word Problems to Equations',
    lastAssessmentDate: 'Yesterday',
    recommendedAction: 'Scaffolded Word Problems Module',
    recentAccuracy: 76,
    recentPracticeHours: 3.2,
    assignmentConsistency: 92,
    repeatedErrorsCount: 2,
    evidencePoints: [
      'Pure numerical computation accuracy is 88%, but english word problem translation drops to 61%.',
      'Consistent practice and high motivation score.'
    ],
    topicMastery: [
      { topicName: 'Quadratic Equations', subject: 'Mathematics', score: 71, status: 'developing' },
      { topicName: 'Linear Equations', subject: 'Mathematics', score: 81, status: 'mastered' },
      { topicName: 'Kinematics', subject: 'Physics', score: 74, status: 'mastered' },
      { topicName: 'Newton’s Laws', subject: 'Physics', score: 70, status: 'developing' },
      { topicName: 'Electricity', subject: 'Science', score: 78, status: 'mastered' }
    ]
  },
  {
    id: 's-113',
    name: 'Tanvi Joshi',
    email: 'tanvi.joshi@demo.learnpulse.ai',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    className: 'Class 10A — Mathematics',
    rollNumber: '10A-13',
    overallMastery: 85,
    riskLevel: 'low',
    trend: 'up',
    trendDelta: 4,
    primaryGapTopic: 'None (Solid Mastery)',
    lastAssessmentDate: 'Yesterday',
    recommendedAction: 'Advanced Problem Set Track',
    recentAccuracy: 89,
    recentPracticeHours: 4.2,
    assignmentConsistency: 98,
    repeatedErrorsCount: 1,
    evidencePoints: [
      'Scores above 80% across all 5 assessed core topics.',
      'Consistently identifies roots without relying on formula crutches.'
    ],
    topicMastery: [
      { topicName: 'Quadratic Equations', subject: 'Mathematics', score: 86, status: 'mastered' },
      { topicName: 'Linear Equations', subject: 'Mathematics', score: 88, status: 'mastered' },
      { topicName: 'Kinematics', subject: 'Physics', score: 84, status: 'mastered' },
      { topicName: 'Newton’s Laws', subject: 'Physics', score: 82, status: 'mastered' },
      { topicName: 'Electricity', subject: 'Science', score: 87, status: 'mastered' }
    ]
  },
  {
    id: 's-114',
    name: 'Rahul Kumar',
    email: 'rahul.kumar@demo.learnpulse.ai',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    className: 'Class 10A — Mathematics',
    rollNumber: '10A-14',
    overallMastery: 61,
    riskLevel: 'elevated',
    trend: 'down',
    trendDelta: -8,
    primaryGapTopic: 'Quadratic Equations (Discriminant Sign)',
    lastAssessmentDate: 'Yesterday, 3:15 PM',
    recommendedAction: 'Assign Factorisation Recovery Mission',
    recentAccuracy: 54,
    recentPracticeHours: 1.4,
    assignmentConsistency: 68,
    repeatedErrorsCount: 4,
    evidencePoints: [
      'Recent accuracy dropped by 18% over the last 3 formative checkpoints.',
      'Quadratic Equations mastery is currently at 42% (class avg 71%).',
      'Repeated sign error when constant c is negative in discriminant calculation.',
      'Recent practice engagement dropped from 3.5 hrs/week to 1.4 hrs/week.'
    ],
    misconceptionDetected: {
      topic: 'Quadratic Equations',
      concept: 'Discriminant',
      title: 'Sign error while solving quadratic equations',
      evidence: 'Repeatedly wrote b² - 4ac as b² - (4ac) even when c was negative, turning subtraction into double negative addition failure.',
      firstObserved: '3 days ago on Checkpoint #4'
    },
    topicMastery: [
      { topicName: 'Quadratic Equations', subject: 'Mathematics', score: 42, status: 'critical' },
      { topicName: 'Linear Equations', subject: 'Mathematics', score: 79, status: 'mastered' },
      { topicName: 'Kinematics', subject: 'Physics', score: 68, status: 'developing' },
      { topicName: 'Newton’s Laws', subject: 'Physics', score: 62, status: 'developing' },
      { topicName: 'Electricity', subject: 'Science', score: 64, status: 'developing' }
    ]
  },
  {
    id: 's-115',
    name: 'Siddharth Rao',
    email: 'siddharth.rao@demo.learnpulse.ai',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    className: 'Class 10A — Mathematics',
    rollNumber: '10A-15',
    overallMastery: 62,
    riskLevel: 'watch',
    trend: 'stable',
    trendDelta: 1,
    primaryGapTopic: 'Free Body Diagrams in Incline Planes',
    lastAssessmentDate: '2 days ago',
    recommendedAction: 'Physics Mechanics Guided Practice',
    recentAccuracy: 64,
    recentPracticeHours: 2.4,
    assignmentConsistency: 79,
    repeatedErrorsCount: 2,
    evidencePoints: [
      'Deconstructs gravitational components into mg sin θ and mg cos θ inconsistently.',
      'Solid algebra execution once equations are successfully formulated.'
    ],
    topicMastery: [
      { topicName: 'Quadratic Equations', subject: 'Mathematics', score: 66, status: 'developing' },
      { topicName: 'Linear Equations', subject: 'Mathematics', score: 78, status: 'mastered' },
      { topicName: 'Kinematics', subject: 'Physics', score: 65, status: 'developing' },
      { topicName: 'Newton’s Laws', subject: 'Physics', score: 54, status: 'developing' },
      { topicName: 'Electricity', subject: 'Science', score: 63, status: 'developing' }
    ]
  },
  {
    id: 's-116',
    name: 'Neha Kulkarni',
    email: 'neha.kulkarni@demo.learnpulse.ai',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    className: 'Class 10A — Mathematics',
    rollNumber: '10A-16',
    overallMastery: 91,
    riskLevel: 'low',
    trend: 'up',
    trendDelta: 4,
    primaryGapTopic: 'None (High Mastery)',
    lastAssessmentDate: 'Today, 10:45 AM',
    recommendedAction: 'Peer Mentorship & Olympiad Challenge',
    recentAccuracy: 93,
    recentPracticeHours: 4.9,
    assignmentConsistency: 99,
    repeatedErrorsCount: 0,
    evidencePoints: [
      'Zero conceptual gaps identified in algebra or mechanics.',
      'High accuracy on complex multi-concept synthesis questions.'
    ],
    topicMastery: [
      { topicName: 'Quadratic Equations', subject: 'Mathematics', score: 94, status: 'mastered' },
      { topicName: 'Linear Equations', subject: 'Mathematics', score: 96, status: 'mastered' },
      { topicName: 'Kinematics', subject: 'Physics', score: 89, status: 'mastered' },
      { topicName: 'Newton’s Laws', subject: 'Physics', score: 90, status: 'mastered' },
      { topicName: 'Electricity', subject: 'Science', score: 88, status: 'mastered' }
    ]
  },
  {
    id: 's-117',
    name: 'Kabir Sen',
    email: 'kabir.sen@demo.learnpulse.ai',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    className: 'Class 10A — Mathematics',
    rollNumber: '10A-17',
    overallMastery: 96,
    riskLevel: 'low',
    trend: 'up',
    trendDelta: 3,
    primaryGapTopic: 'None (Top Performer)',
    lastAssessmentDate: 'Today, 12:00 PM',
    recommendedAction: 'JEE Alpha Physics Track Enrolment',
    recentAccuracy: 98,
    recentPracticeHours: 5.6,
    assignmentConsistency: 100,
    repeatedErrorsCount: 0,
    evidencePoints: [
      'Rank 1 in Class 10A mathematics and science diagnostics.',
      'Completed all elective challenge problem sets with 98% accuracy.'
    ],
    topicMastery: [
      { topicName: 'Quadratic Equations', subject: 'Mathematics', score: 98, status: 'mastered' },
      { topicName: 'Linear Equations', subject: 'Mathematics', score: 99, status: 'mastered' },
      { topicName: 'Kinematics', subject: 'Physics', score: 95, status: 'mastered' },
      { topicName: 'Newton’s Laws', subject: 'Physics', score: 96, status: 'mastered' },
      { topicName: 'Electricity', subject: 'Science', score: 94, status: 'mastered' }
    ]
  },
  {
    id: 's-118',
    name: 'Riya Choudhury',
    email: 'riya.choudhury@demo.learnpulse.ai',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    className: 'Class 10A — Mathematics',
    rollNumber: '10A-18',
    overallMastery: 58,
    riskLevel: 'elevated',
    trend: 'up',
    trendDelta: 6,
    primaryGapTopic: 'Circuit Series-Parallel Resistances',
    lastAssessmentDate: 'Yesterday',
    recommendedAction: 'Electricity Targeted Practice Sprint',
    recentAccuracy: 60,
    recentPracticeHours: 2.6,
    assignmentConsistency: 80,
    repeatedErrorsCount: 3,
    evidencePoints: [
      'Mastery recovering steadily (+6%) over the past 2 weeks.',
      'Still encounters confusion when reducing complex parallel resistor meshes.'
    ],
    topicMastery: [
      { topicName: 'Quadratic Equations', subject: 'Mathematics', score: 62, status: 'developing' },
      { topicName: 'Linear Equations', subject: 'Mathematics', score: 74, status: 'mastered' },
      { topicName: 'Kinematics', subject: 'Physics', score: 60, status: 'developing' },
      { topicName: 'Newton’s Laws', subject: 'Physics', score: 56, status: 'developing' },
      { topicName: 'Electricity', subject: 'Science', score: 48, status: 'critical' }
    ]
  }
];

export const TOPIC_INTELLIGENCE_SEED: TopicItem = {
  id: '55555555-1111-1111-1111-111111111111',
  name: 'Quadratic Equations',
  unit: 'Unit 1: Algebra',
  subject: 'Mathematics',
  masteryPercentage: 58,
  studentsAffected: 14,
  trend: 'down',
  trendValue: -8,
  commonMisconception: 'Sign error while solving quadratic equations (when c is negative)',
  misconceptionDescription: 'Students frequently fail to apply double-negative addition in Δ = b² - 4ac when c < 0, resulting in b² - 4a|c| rather than b² + 4a|c|.',
  concepts: [
    {
      conceptId: '66666666-1111-1111-1111-111111111113',
      conceptName: 'Discriminant (Δ = b² - 4ac)',
      masteryPercentage: 38,
      status: 'critical',
      attemptsCount: 148,
      lastAssessedAt: 'Yesterday'
    },
    {
      conceptId: '66666666-1111-1111-1111-111111111111',
      conceptName: 'Factorisation of Quadratic Terms',
      masteryPercentage: 44,
      status: 'critical',
      attemptsCount: 162,
      lastAssessedAt: '2 days ago'
    },
    {
      conceptId: '66666666-1111-1111-1111-111111111112',
      conceptName: 'Roots of Quadratic Equations',
      masteryPercentage: 61,
      status: 'developing',
      attemptsCount: 134,
      lastAssessedAt: 'Yesterday'
    }
  ]
};

export const ACTIVE_INTERVENTIONS_SEED: ActiveIntervention[] = [
  {
    id: 'int-01',
    title: 'Factorisation Recovery Mission',
    topic: 'Quadratic Equations (Factorisation & Sign Rules)',
    studentsCount: 14,
    progressPercentage: 78,
    status: 'active',
    expectedCompletion: 'Today, 5:00 PM',
    beforeMastery: 42,
    afterMastery: 63,
    effectivenessGain: 21,
    strategy: 'Targeted sign-tracking worked examples, color-coded variable expansion, and adaptive checkpoint.',
    timeline: [
      { minutes: '0–3 min', title: 'Concept Recap', description: 'Visual proof of why -4ac evaluates to positive addition when c < 0.' },
      { minutes: '3–7 min', title: 'Worked Example', description: 'Step-by-step resolution of 2x² - 4x - 6 = 0 with explicit signed brackets.' },
      { minutes: '7–12 min', title: 'Guided Practice', description: '3 interactive problems with immediate sign verification feedback.' },
      { minutes: '12–15 min', title: 'Exit Check', description: 'Formative reassessment measuring immediate conceptual recovery.' }
    ],
    studentIds: ['s-111', 's-114', 's-108']
  },
  {
    id: 'int-02',
    title: 'Kinematics Concept Repair',
    topic: 'Kinematics (Velocity vs Acceleration Directionality)',
    studentsCount: 8,
    progressPercentage: 55,
    status: 'active',
    expectedCompletion: 'Tomorrow, 3:00 PM',
    beforeMastery: 44,
    afterMastery: 65,
    effectivenessGain: 21,
    strategy: 'Deceleration vectors on interactive number lines and displacement-time slope visualization.',
    timeline: [
      { minutes: '0–4 min', title: 'Vector Definition', description: 'Velocity represents motion direction; acceleration represents rate of velocity shift.' },
      { minutes: '4–9 min', title: 'Braking Vehicle Simulation', description: 'Car moving +x with braking force applied in -x direction.' },
      { minutes: '9–15 min', title: 'Check Questions', description: 'Directional checks for vertical projectile throwing.' }
    ],
    studentIds: ['s-107']
  },
  {
    id: 'int-03',
    title: 'Newton’s Laws Guided Practice',
    topic: 'Newton’s Laws (Free Body Diagrams & Opposing Friction)',
    studentsCount: 9,
    progressPercentage: 40,
    status: 'scheduled',
    expectedCompletion: 'Thursday, 4:30 PM',
    beforeMastery: 54,
    afterMastery: 72,
    effectivenessGain: 18,
    strategy: 'Surface contact isolation cards identifying opposing resistive forces.',
    timeline: [
      { minutes: '0–5 min', title: 'Isolating Bodies', description: 'Drawing isolated box and labeling gravitational weight down and normal force up.' },
      { minutes: '5–10 min', title: 'Friction Vectoring', description: 'Verifying kinetic friction vector always opposes relative velocity vector.' },
      { minutes: '10–15 min', title: 'Equilibrium Equations', description: 'Sum of forces ΣF = ma resolution.' }
    ],
    studentIds: ['s-103', 's-109', 's-115']
  },
  {
    id: 'int-04',
    title: 'Quadratic Equations Targeted Practice',
    topic: 'Quadratic Equations (Quadratic Formula Numerator Distribution)',
    studentsCount: 6,
    progressPercentage: 90,
    status: 'completed',
    expectedCompletion: 'Completed Yesterday',
    beforeMastery: 38,
    afterMastery: 74,
    effectivenessGain: 36,
    strategy: 'Fraction division bounding boxes preventing isolation of -b outside division line.',
    timeline: [
      { minutes: '0–4 min', title: 'Fraction Structure', description: 'Emphasizing that the entire (-b ± √Δ) is divided by 2a.' },
      { minutes: '4–10 min', title: 'Formula Drills', description: 'Color-coded denominator brackets.' },
      { minutes: '10–15 min', title: 'Reassessment', description: '4-question exit check.' }
    ],
    studentIds: ['s-106', 's-112']
  }
];

export const MISCONCEPTIONS_SEED: MisconceptionRecord[] = [
  {
    id: 'misc-01',
    topic: 'Quadratic Equations',
    concept: 'Discriminant',
    misconception: 'Sign error while solving quadratic equations (treating -4ac as subtraction when c is negative)',
    studentsAffected: 12,
    evidence: 'In 36 attempts on 2x² - 4x - 6 = 0, 12 students computed (-4)² - 4(2)(6) = 16 - 48 = -32 instead of 16 + 48 = 64.',
    confidenceScore: 95,
    recommendedIntervention: '15-min Classroom Recovery: "Deconstructing -4ac as an explicit product of 3 signed factors".',
    category: 'algebraic_sign'
  },
  {
    id: 'misc-02',
    topic: 'Kinematics',
    concept: 'Velocity and Acceleration',
    misconception: 'Confuses velocity with acceleration (assuming acceleration direction must match motion direction)',
    studentsAffected: 8,
    evidence: 'Students asserted that a slowing car moving forward has forward acceleration.',
    confidenceScore: 92,
    recommendedIntervention: 'Interactive vector deceleration simulator and velocity-time gradient review.',
    category: 'conceptual_inversion'
  },
  {
    id: 'misc-03',
    topic: 'Electricity',
    concept: 'Ohm’s Law',
    misconception: 'Applies Ohm’s law variables incorrectly (confusing I = V/R with I = VR or R = VI)',
    studentsAffected: 7,
    evidence: 'Calculated current as voltage multiplied by resistance in 11 test responses.',
    confidenceScore: 89,
    recommendedIntervention: 'Dimensional analysis and physical water pipe resistance analogy.',
    category: 'formula_misapplication'
  },
  {
    id: 'misc-04',
    topic: 'Newton’s Laws',
    concept: 'Free Body Diagrams',
    misconception: 'Incorrect force direction in free-body diagrams (drawing friction in motion direction)',
    studentsAffected: 9,
    evidence: 'Drew friction arrows pointing along displacement rather than opposing contact shear.',
    confidenceScore: 91,
    recommendedIntervention: 'Surface contact isolation diagrams with tactile friction blocks.',
    category: 'graphical_misread'
  }
];

export const RECOVERY_SCORE_DATA: LearningRecoveryScoreData = {
  topic: 'Quadratic Equations',
  studentName: 'Rahul Kumar',
  beforeIntervention: 42,
  afterIntervention: 79,
  recoveryPoints: 37,
  status: 'recovered',
  whatChanged: [
    'Completed 5-minute targeted Concept Repair on negative coefficient sign rules',
    'Practiced 3 worked examples with step-by-step sign tracking brackets',
    'Successfully solved 4/4 adaptive check questions on negative discriminant terms',
    'Achieved 88% accuracy on the post-intervention reassessment'
  ],
  completedAt: 'Yesterday, 4:45 PM'
};

export const ADAPTIVE_PRACTICE_QUESTIONS: PracticeQuestion[] = [
  {
    id: 'pq-01',
    subject: 'Mathematics',
    topic: 'Quadratic Equations',
    concept: 'Discriminant',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'For equation 2x² - 4x - 6 = 0, what is the value of the constant term c?',
    options: ['6', '-6', '-4', '2'],
    correctAnswer: 1,
    explanation: 'In ax² + bx + c = 0, here a = 2, b = -4, and c = -6 (including the negative sign!).',
    learningObjective: 'Accurately identify signed coefficients in quadratic equations.'
  },
  {
    id: 'pq-02',
    subject: 'Mathematics',
    topic: 'Quadratic Equations',
    concept: 'Discriminant',
    difficulty: 'Medium',
    type: 'misconception',
    prompt: 'Calculate the discriminant Δ for the equation 2x² - 4x - 6 = 0. Watch the negative signs carefully.',
    options: ['64', '-32', '32', '-64'],
    correctAnswer: 0,
    explanation: 'Δ = b² - 4ac = (-4)² - 4(2)(-6) = 16 - (-48) = 16 + 48 = 64. The negative c turns the product into addition!',
    learningObjective: 'Accurately evaluate discriminant when constant c is negative.',
    misconceptionTargeted: 'Sign error while solving quadratic equations'
  },
  {
    id: 'pq-03',
    subject: 'Physics',
    topic: 'Kinematics',
    concept: 'Velocity and Acceleration',
    difficulty: 'Medium',
    type: 'conceptual',
    prompt: 'An electric vehicle travels North at 60 km/h and hits the brakes. What is the direction of its acceleration?',
    options: ['North', 'South', 'East', 'Zero until it comes to a stop'],
    correctAnswer: 1,
    explanation: 'When an object slows down, acceleration vector points in the opposite direction of velocity (South).',
    learningObjective: 'Distinguish velocity direction from acceleration direction in deceleration.'
  },
  {
    id: 'pq-04',
    subject: 'Science',
    topic: 'Electricity',
    concept: 'Ohm’s Law',
    difficulty: 'Easy',
    type: 'application',
    prompt: 'According to Ohm’s Law, if a 12V battery is connected across a 4Ω resistor, what is the current flowing?',
    options: ['48 A', '3 A', '0.33 A', '16 A'],
    correctAnswer: 1,
    explanation: 'I = V / R = 12 / 4 = 3 A. Be sure to divide voltage by resistance, not multiply!',
    learningObjective: 'Correctly apply I = V / R without inverting variables.'
  }
];

export const PARENT_STUDENT_INFO: ParentStudentInfo = {
  childName: 'Rahul Kumar',
  className: 'Class 10A — Mathematics',
  parentName: 'Sanjay Kumar',
  teacherName: 'Dr. Radhika Sharma',
  summaryNotice: 'Rahul is making steady progress, with focused teacher support underway in Quadratic Equations.',
  strengths: [
    { topic: 'Linear Equations in Two Variables', mastery: 84, note: 'Strong problem setup, substitution, and elimination speed.' },
    { topic: 'Kinematics & Rectilinear Motion', mastery: 76, note: 'Confident with speed-time graphs and uniform velocity.' },
    { topic: 'Arithmetic Progressions', mastery: 88, note: 'Excellent pattern recognition on series questions.' }
  ],
  needsSupport: [
    {
      topic: 'Quadratic Equations',
      mastery: 42,
      plainLanguageExplanation: 'Rahul is solving quadratic equations well conceptually, but occasionally reverses the negative sign when multiplying negative constants in the formula.',
      schoolAction: 'Dr. Sharma has assigned the 15-minute Factorisation Recovery Mission and guided sign practice.'
    }
  ],
  practicalHomeActions: [
    {
      title: 'Ask Rahul to explain with his own words',
      description: 'Ask Rahul to explain how the discriminant Δ tells him whether a parabola hits the ground. Explaining out loud builds self-monitoring.'
    },
    {
      title: 'Encourage 10-minute short sessions',
      description: '10 minutes of targeted daily practice on LearnPulse before dinner is vastly more effective than a stressful weekend cram.'
    },
    {
      title: 'Praise problem-solving effort',
      description: 'Praise diligence and persistence when working through negative sign brackets rather than focusing only on test scores.'
    }
  ],
  upcomingAssessments: [
    {
      title: 'Unit Assessment: Quadratic Equations',
      focusTopic: 'Discriminant & Roots',
      date: 'Thursday, 09:30 AM'
    },
    {
      title: 'Formative Check: Newton’s Laws & Forces',
      focusTopic: 'Free Body Diagrams',
      date: 'Next Tuesday'
    }
  ]
};

export const ADMIN_ANALYTICS_SEED: AdminAnalytics = {
  institutionName: 'LearnPulse Demo Academy',
  totalSchools: 2,
  totalStudents: 420,
  totalTeachers: 24,
  dailyActiveTeachers: 21,
  averageMastery: 73,
  gapsDetected: 56,
  activeInterventions: 28,
  interventionSuccessRate: 82,
  systemicGaps: [
    {
      topic: 'Quadratic Equations (Sign Rules when c < 0)',
      schoolsAffected: 2,
      commonBottleneck: 'Negative constant multiplication in discriminant calculations',
      totalStudentsImpacted: 48
    },
    {
      topic: 'Newton’s Laws (Free Body Diagram Directionality)',
      schoolsAffected: 2,
      commonBottleneck: 'Drawing friction force aligned with motion rather than opposing shear',
      totalStudentsImpacted: 34
    },
    {
      topic: 'Electricity (Ohm’s Law Variable Ratios)',
      schoolsAffected: 1,
      commonBottleneck: 'Confusing I = V/R with I = VR in parallel branches',
      totalStudentsImpacted: 26
    }
  ],
  schools: [
    { id: 'sch-main', name: 'LearnPulse Demo Academy (Main Campus)', studentsCount: 260, avgMastery: 74, gapsDetected: 32, recoveryEfficacy: 84 },
    { id: 'sch-stem', name: 'LearnPulse Demo Academy (STEM Wing)', studentsCount: 160, avgMastery: 72, gapsDetected: 24, recoveryEfficacy: 79 }
  ]
};

export const PRE_CLASS_TEACHER_INTELLIGENCE_SEED = {
  topic: 'Quadratic Equations (Discriminant & Roots)',
  readyCount: 21,
  needsPrepCount: 9,
  needsSupportCount: 6,
  aiTeachingRecommendation: 'Consider a 3-minute algebraic sign recap at the start of Period 2 because 15 students show prerequisite hesitation in multiplying negative constants.',
  prerequisites: [
    { name: 'Factorisation of Polynomials', masteryPercentage: 82, status: 'good' as const },
    { name: 'Solving Linear Equations', masteryPercentage: 84, status: 'good' as const },
    { name: 'Algebraic Sign Rules (c < 0)', masteryPercentage: 51, status: 'attention' as const }
  ]
};

export const MISCONCEPTION_LAB_SEED = [
  {
    id: 'misc-lab-01',
    topic: 'Quadratic Equations',
    concept: 'Discriminant',
    misconceptionTitle: 'Sign error when constant term c is negative',
    affectedStudentsCount: 12,
    confidence: 95,
    rootCauseExplanation: 'Students calculate -4(a)(c) as a simple subtraction from b² even when c is negative, treating the minus sign as an isolated operator rather than a factor sign.',
    exampleErrorSnippet: 'In 2x² - 4x - 6 = 0, student computed Δ = (-4)² - 4(2)(6) = 16 - 48 = -32, concluding "no real roots".',
    recommendedIntervention: '15-minute Classroom Recovery: Visual sign bracket expansion and color-coded algebraic terms.'
  },
  {
    id: 'misc-lab-02',
    topic: 'Kinematics',
    concept: 'Velocity and Acceleration',
    misconceptionTitle: 'Confuses velocity with acceleration direction',
    affectedStudentsCount: 8,
    confidence: 92,
    rootCauseExplanation: 'Intuition equates "moving forward" with "accelerating forward", failing to recognize that braking produces an opposing acceleration vector.',
    exampleErrorSnippet: 'Claimed a braking train moving East has Eastward acceleration because it has not yet stopped.',
    recommendedIntervention: 'Interactive vector deceleration simulator and velocity-time gradient visualization.'
  },
  {
    id: 'misc-lab-03',
    topic: 'Electricity',
    concept: 'Ohm’s Law',
    misconceptionTitle: 'Applies Ohm’s law variables inversely or multiplicatively',
    affectedStudentsCount: 7,
    confidence: 89,
    rootCauseExplanation: 'Fails to memorize I = V/R triangle relationship, treating voltage as dependent product in all configurations.',
    exampleErrorSnippet: 'For V=12 and R=4, computed current I = 12 × 4 = 48 A instead of 3 A.',
    recommendedIntervention: 'Triangular mnemonic cards and resistance-water analogy practice.'
  }
];

export const INTERVENTIONS_SEED = [
  {
    id: 'int-01',
    topic: 'Quadratic Equations (Sign Rules)',
    targetCount: 14,
    progress: 78,
    measuredRecovery: '+21% Mastery',
    description: '15-minute targeted remediation focused on -4ac evaluation when c < 0.'
  },
  {
    id: 'int-02',
    topic: 'Kinematics (Deceleration Vectors)',
    targetCount: 8,
    progress: 55,
    measuredRecovery: '+21% Mastery',
    description: 'Vector orientation drills distinguishing direction of travel from direction of force.'
  },
  {
    id: 'int-03',
    topic: 'Ohm’s Law Ratio Verification',
    targetCount: 7,
    progress: 88,
    measuredRecovery: '+24% Mastery',
    description: 'Circuit simulator drills testing voltage, current, and resistance proportionality.'
  }
];
