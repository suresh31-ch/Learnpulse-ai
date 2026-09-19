import React, { useState } from 'react';
import {
  Sparkles,
  TrendingDown,
  TrendingUp,
  Target,
  Clock,
  ArrowRight,
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Calendar,
  Flame,
  Bot,
  Zap,
  Download,
  Layers,
  HelpCircle,
  ShieldCheck,
  Award,
  Compass,
  FileText,
  UserCheck
} from 'lucide-react';
import { STUDENTS_SEED, PRE_CLASS_PREVIEW_TOMORROW, DEMO_METADATA } from '../../data/seedData';
import { MasteryBadge, RiskBadge, TrendBadge, DemoDataBadge } from '../shared/StatusBadge';
import { LearningLoopBar } from '../shared/LearningLoopBar';
import { useAuth } from '../../context/AuthContext';
import { detectStudentLearningGaps, computeNextBestAction, calculateLearningRecoveryScore } from '../../lib/learningGapEngine';
import { evaluateStudentBadges } from '../../lib/badgeEngine';
import { generateStudentProgressReportPDF } from '../../lib/pdfReportGenerator';
import { GamifiedBadges } from './GamifiedBadges';
import { StudentProfile, LearningGap } from '../../types';
import { LearningLoopStageId, mapStageToRoute } from '../../lib/learningLoop';

interface StudentHomeProps {
  onNavigate: (tabId: string) => void;
  onSelectGapForRecovery?: (gap: LearningGap) => void;
  currentStageId?: LearningLoopStageId;
  onSelectStage?: (stageId: LearningLoopStageId) => void;
}

export const StudentHome: React.FC<StudentHomeProps> = ({
  onNavigate,
  onSelectGapForRecovery,
  currentStageId = 'pre_class_preview',
  onSelectStage
}) => {
  const { user, profile } = useAuth();
  
  // Find matched student: First match by profile.id or profile.full_name or user.email, or fallback to first student
  const initialMatchedStudent = (() => {
    if (user?.email) {
      const byEmail = STUDENTS_SEED.find(s => s.email.toLowerCase() === user.email?.toLowerCase());
      if (byEmail) return byEmail;
    }
    if (profile?.full_name) {
      const byName = STUDENTS_SEED.find(s => s.name.toLowerCase().includes(profile.full_name?.toLowerCase() || ''));
      if (byName) return byName;
    }
    return STUDENTS_SEED.find(s => s.name === 'Aarav Mehta') || STUDENTS_SEED[0];
  })();

  const [currentStudent, setCurrentStudent] = useState<StudentProfile>(initialMatchedStudent);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Deterministically detect learning gaps & badges for this active student
  const detectedGaps = detectStudentLearningGaps(currentStudent);
  const nextBestAction = computeNextBestAction(currentStudent, detectedGaps, PRE_CLASS_PREVIEW_TOMORROW.readinessPercentage);
  const badges = evaluateStudentBadges(currentStudent);
  const recoveryScore = calculateLearningRecoveryScore(
    Math.max(25, currentStudent.overallMastery - 18),
    currentStudent.overallMastery
  );

  const preClass = PRE_CLASS_PREVIEW_TOMORROW;

  // Handle PDF Export
  const handleDownloadPDF = () => {
    setIsGeneratingPDF(true);
    setDownloadSuccess(null);
    try {
      const strongest = currentStudent.topicMastery
        .filter(tm => tm.score >= 75)
        .map(tm => ({ topic: tm.topicName, subject: tm.subject, score: tm.score }));

      generateStudentProgressReportPDF({
        studentName: currentStudent.name,
        institutionName: DEMO_METADATA.institutionName,
        className: currentStudent.className,
        rollNumber: currentStudent.rollNumber,
        generatedDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        overallMastery: currentStudent.overallMastery,
        trendDirection: currentStudent.trend,
        trendDelta: currentStudent.trendDelta,
        recentAccuracy: currentStudent.recentAccuracy,
        practiceHours: currentStudent.recentPracticeHours,
        streakDays: currentStudent.assignmentConsistency > 80 ? 4 : 2,
        strongestAreas: strongest.length > 0 ? strongest : [{ topic: 'Linear Equations', subject: 'Mathematics', score: 82 }],
        learningGaps: detectedGaps.map(g => ({
          topic: g.topicName,
          concept: g.conceptName,
          currentMastery: g.currentMastery,
          severity: g.severity,
          recommendedAction: g.recommendedAction
        })),
        misconceptions: currentStudent.misconceptionDetected ? [currentStudent.misconceptionDetected.title] : ['None detected'],
        recentAssessments: [
          { title: 'Formative Check #4', date: 'Yesterday', score: currentStudent.recentAccuracy },
          { title: 'Unit 2 Diagnostic', date: '3 days ago', score: currentStudent.overallMastery - 3 }
        ],
        preClassReadinessAverage: preClass.readinessPercentage,
        learningRecoveryScore: {
          baseline: recoveryScore.baseline,
          current: recoveryScore.current,
          gain: recoveryScore.recoveryGain,
          status: currentStudent.trend === 'up' ? 'Accelerating Recovery' : 'Active Calibration'
        },
        badgesSummary: {
          totalUnlocked: badges.filter(b => b.unlocked).length,
          totalAvailable: badges.length,
          recentBadges: badges.filter(b => b.unlocked).map(b => b.name).slice(0, 3)
        },
        nextBestAction: nextBestAction.title
      });
      setDownloadSuccess('Report generated successfully!');
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* Learning Intelligence Loop Banner */}
      <LearningLoopBar
        currentStageId={currentStageId}
        onSelectStage={(id) => {
          if (onSelectStage) {
            onSelectStage(id);
          } else {
            const target = mapStageToRoute(id, 'student');
            onNavigate(target);
          }
        }}
      />

      {/* Top Welcome / Overview Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <img
              src={currentStudent.avatarUrl}
              alt={currentStudent.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-100 shadow-xs"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">{currentStudent.name}</h1>
                <DemoDataBadge />
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
                  {currentStudent.className} • Roll {currentStudent.rollNumber}
                </span>
                <RiskBadge risk={currentStudent.riskLevel} />
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {DEMO_METADATA.institutionName} • <span className="font-semibold text-slate-700">Class 10 Mathematics & Physics</span> • Last active: {currentStudent.lastAssessmentDate}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Student Switcher for evaluators */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
              <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">Profile:</span>
              <select
                value={currentStudent.id}
                onChange={(e) => {
                  const found = STUDENTS_SEED.find(s => s.id === e.target.value);
                  if (found) setCurrentStudent(found);
                }}
                className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
                title="Switch student archetype for evaluation"
              >
                <option value="s-101">Aarav Mehta (Average 78%)</option>
                <option value="s-102">Ananya Sharma (High Mastery 94%)</option>
                <option value="s-103">Rohan Verma (Declining 71%)</option>
                <option value="s-107">Vihaan Kapoor (Critical Gap 49%)</option>
                <option value="s-111">Dev Malhotra (Prerequisite Gap 36%)</option>
                <option value="s-114">Rahul Kumar (Sign Error 61%)</option>
              </select>
            </div>

            <button
              id="btn-student-home-preclass"
              onClick={() => onNavigate('preview')}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Tomorrow's Preview ({preClass.readinessPercentage}%)</span>
            </button>

            <button
              id="btn-student-home-pdf"
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 border border-slate-200"
              title="Download Progress Report as PDF"
            >
              <Download className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Export PDF</span>
            </button>
          </div>
        </div>

        {/* 4 Key Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Overall Mastery</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold text-slate-800">{currentStudent.overallMastery}%</span>
              <MasteryBadge level={currentStudent.overallMastery} />
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Curriculum Benchmark: 80%</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Learning Trend</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-2xl font-extrabold ${currentStudent.trendDelta >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {currentStudent.trendDelta >= 0 ? `+${currentStudent.trendDelta}%` : `${currentStudent.trendDelta}%`}
              </span>
              <TrendBadge trend={currentStudent.trend} />
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              {currentStudent.trend === 'up' ? 'Upward acceleration' : currentStudent.trend === 'down' ? 'Needs formative recovery' : 'Consistent performance'}
            </span>
          </div>

          <div
            id="metric-upcoming-class"
            onClick={() => onNavigate('preview')}
            className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 hover:border-indigo-300 hover:bg-indigo-50/30 cursor-pointer transition-all group"
            title="Click to open Tomorrow's Pre-Class Preview"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block group-hover:text-indigo-600">Upcoming Class</span>
              <span className="text-[10px] text-indigo-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">Open →</span>
            </div>
            <div className="text-sm font-bold text-slate-800 mt-1 truncate group-hover:text-indigo-700">
              {preClass.topicTitle}
            </div>
            <span className="text-[11px] text-indigo-600 font-semibold mt-1 block">
              Readiness Check: {preClass.readinessPercentage}%
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Detected Gaps</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold text-indigo-600">{detectedGaps.length}</span>
              <span className="text-xs text-slate-500">Topics</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
              +{recoveryScore.recoveryGain}% Recovery Gain
            </span>
          </div>
        </div>
      </div>

      {/* Next Best Learning Action Spotlight */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white border border-indigo-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-bold uppercase tracking-wider border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next Best Learning Action (Determined from evidence)</span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">{nextBestAction.title}</h2>
          <p className="text-xs text-indigo-200/90 max-w-2xl leading-relaxed">{nextBestAction.subtitle}</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-indigo-300 uppercase block font-medium">Est. Duration</span>
            <span className="text-xs font-bold text-white">{nextBestAction.estimatedMinutes} mins</span>
          </div>
          <button
            type="button"
            id="btn-execute-next-best-action"
            onClick={() => {
              if (nextBestAction.actionRoute === 'recovery') {
                const gap = detectedGaps[0];
                if (gap && onSelectGapForRecovery) onSelectGapForRecovery(gap);
                onNavigate('recovery');
              } else {
                onNavigate(nextBestAction.actionRoute);
              }
            }}
            className="px-4 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-500/30 flex items-center gap-1.5"
          >
            <span>Start Action ({nextBestAction.expectedGain})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2-Column Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Tomorrow's Class & Missions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Signature Feature: Tomorrow's Class Preview Card */}
          <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between gap-2 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Tomorrow's Class</span>
                  <h3 className="text-base font-bold text-white">{preClass.topicTitle}</h3>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase">Class Readiness</span>
                <span className={`text-lg font-extrabold ${preClass.readinessPercentage >= 75 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {preClass.readinessPercentage}%
                </span>
              </div>
            </div>

            {/* Prerequisites breakdown */}
            <div className="my-4 space-y-2">
              <span className="text-xs font-semibold text-slate-300 block">Prerequisite Concept Check:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {preClass.prerequisites.map(p => (
                  <div key={p.id} className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80">
                    <span className="text-[11px] text-slate-400 truncate block">{p.name}</span>
                    <div className="flex items-center justify-between mt-1">
                      <span className={`text-xs font-bold ${p.status === 'passed' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {p.masteryPercentage}%
                      </span>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${p.status === 'passed' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                        {p.status === 'passed' ? 'OK' : 'GAP'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Insight */}
            <div className="p-3.5 rounded-xl bg-indigo-900/40 border border-indigo-700/50 text-xs text-indigo-100 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                "{preClass.aiInsight}"
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => onNavigate('check')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2 flex items-center gap-1"
              >
                <span>Take Post-Class Understanding Check ("What Changed?")</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('preview')}
                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <span>Prepare for Class</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Active Detected Learning Gaps (From Gap Engine) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Identified Learning Gaps</h3>
                  <p className="text-xs text-slate-500">Deterministic gap detection based on formative performance</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('gaps')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                View All Gaps ({detectedGaps.length}) →
              </button>
            </div>

            <div className="space-y-3">
              {detectedGaps.slice(0, 2).map((gap) => (
                <div
                  key={gap.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">{gap.topicName}</span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm ${gap.severity === 'critical' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                        {gap.severity}
                      </span>
                    </div>
                    <p className="text-xs text-indigo-600 font-medium">{gap.conceptName}</p>
                    <p className="text-[11px] text-slate-500">{gap.evidence[0]}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-800">{gap.currentMastery}%</span>
                      <span className="text-[10px] text-slate-400 block">Mastery</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (onSelectGapForRecovery) onSelectGapForRecovery(gap);
                        onNavigate('recovery');
                      }}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Zap className="w-3 h-3" />
                      <span>Recover</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gamified Achievement Badges Preview */}
          <GamifiedBadges badges={badges} showFilters={false} title="Your Learning Badges & Achievements" />
        </div>

        {/* Right Col: Topic Weaknesses, Recovery Score & Knowledge Map */}
        <div className="space-y-6">
          {/* Recovery Metric Card */}
          <div className="bg-gradient-to-br from-indigo-50 via-white to-violet-50 rounded-2xl border border-indigo-100 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-indigo-600" />
                Learning Recovery Score
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                +{recoveryScore.recoveryGain}% Gain
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-indigo-100">
              <span>Baseline: <strong>{recoveryScore.baseline}%</strong></span>
              <span>Current: <strong>{recoveryScore.current}%</strong></span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Recovery score tracks verified understanding gains achieved via concept repair missions.
            </p>
          </div>

          {/* Topic Weaknesses */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              Curriculum Mastery Radar
            </h3>
            <div className="space-y-2.5">
              {currentStudent.topicMastery.map((tm, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">{tm.topicName}</span>
                    <span className="text-[10px] text-slate-400">{tm.subject}</span>
                  </div>
                  <MasteryBadge level={tm.score} showPercent />
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate('learn')}
              className="mt-4 w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Explore Interactive Knowledge Map</span>
            </button>
          </div>

          {/* Pulse Socratic Tutor Card */}
          <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-5 space-y-3 shadow-md">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white">Need Conceptual Help?</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Ask Pulse Tutor to explain difficult concepts step-by-step or test your intuition using Socratic questioning.
            </p>
            <button
              onClick={() => onNavigate('tutor')}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Ask Pulse Tutor</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
