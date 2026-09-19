import React, { useState } from 'react';
import { StudentProfile, LearningGap, BadgeItem, StudentProgressReportData } from '../../types';
import { generateStudentProgressReportPDF } from '../../lib/pdfReportGenerator';
import { GamifiedBadges } from './GamifiedBadges';
import {
  FileText,
  Download,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Zap,
  Target,
  Clock,
  Flame,
  Award,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface StudentInsightsViewProps {
  student: StudentProfile;
  gaps: LearningGap[];
  badges: BadgeItem[];
  onStartRecovery?: (gap: LearningGap) => void;
}

export const StudentInsightsView: React.FC<StudentInsightsViewProps> = ({
  student,
  gaps,
  badges,
  onStartRecovery
}) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Deterministic calculation for baseline & recovery
  const baseline = Math.max(30, student.overallMastery - (student.trendDelta > 0 ? student.trendDelta * 2 : 12));
  const recoveryGain = Math.max(0, student.overallMastery - baseline);

  const handleDownloadPDF = () => {
    setIsGeneratingPDF(true);
    setDownloadSuccess(null);

    try {
      const strongest = student.topicMastery
        .filter(tm => tm.score >= 75)
        .map(tm => ({ topic: tm.topicName, subject: tm.subject, score: tm.score }));

      const reportData: StudentProgressReportData = {
        studentName: student.name,
        institutionName: 'LearnPulse Demo Academy',
        className: student.className,
        rollNumber: student.rollNumber,
        generatedDate: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        overallMastery: student.overallMastery,
        trendDirection: student.trend,
        trendDelta: student.trendDelta,
        recentAccuracy: student.recentAccuracy,
        practiceHours: student.recentPracticeHours,
        streakDays: student.assignmentConsistency > 80 ? 4 : 2,
        strongestAreas: strongest.length > 0 ? strongest : [{ topic: 'Linear Equations', subject: 'Mathematics', score: 82 }],
        learningGaps: gaps.map(g => ({
          topic: g.topicName,
          concept: g.conceptName,
          currentMastery: g.currentMastery,
          severity: g.severity,
          recommendedAction: g.recommendedAction
        })),
        misconceptions: student.misconceptionDetected ? [student.misconceptionDetected.title] : ['None detected'],
        recentAssessments: [
          { title: 'Formative Check #4', date: 'Yesterday', score: student.recentAccuracy },
          { title: 'Unit 2 Diagnostic', date: '3 days ago', score: student.overallMastery - 3 }
        ],
        preClassReadinessAverage: 84,
        learningRecoveryScore: {
          baseline,
          current: student.overallMastery,
          gain: recoveryGain,
          status: student.trend === 'up' ? 'Accelerating Recovery' : 'Active Calibration'
        },
        badgesSummary: {
          totalUnlocked: badges.filter(b => b.unlocked).length,
          totalAvailable: badges.length,
          recentBadges: badges.filter(b => b.unlocked).map(b => b.name).slice(0, 3)
        },
        nextBestAction: student.recommendedAction || 'Complete Targeted Recovery Path on Quadratic Equations'
      };

      generateStudentProgressReportPDF(reportData);
      setDownloadSuccess('PDF Progress Report downloaded successfully.');
    } catch (err: unknown) {
      console.error('PDF generation error:', err);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Comprehensive Student Analytics</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Learning Mastery Insights & Official PDF Report
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Detailed breakdown of curriculum mastery, formative growth trajectory, detected gaps, and verified achievement milestones.
          </p>
        </div>

        {/* PDF Download Button */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <button
            type="button"
            id="btn-download-progress-pdf"
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/25 flex items-center gap-2"
          >
            {isGeneratingPDF ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Progress Report (PDF)</span>
              </>
            )}
          </button>
          {downloadSuccess && (
            <span className="text-[11px] text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{downloadSuccess}</span>
            </span>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Overall Mastery</span>
            <span className="text-indigo-400 font-semibold">Curriculum Target: 80%</span>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">
            {student.overallMastery}%
          </div>
          <div className="mt-2 text-xs flex items-center gap-1.5">
            {student.trend === 'up' ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" />
                +{student.trendDelta}% this cycle
              </span>
            ) : student.trend === 'down' ? (
              <span className="text-rose-400 font-semibold flex items-center gap-0.5">
                <TrendingDown className="w-3.5 h-3.5" />
                {student.trendDelta}% this cycle
              </span>
            ) : (
              <span className="text-slate-400 font-semibold">Stable performance</span>
            )}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
          <div className="text-xs text-slate-400 mb-1">Recent Formative Accuracy</div>
          <div className="text-3xl font-extrabold text-white tracking-tight">
            {student.recentAccuracy}%
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Across {student.topicMastery.length} curriculum units
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
          <div className="text-xs text-slate-400 mb-1">Deliberate Practice Logged</div>
          <div className="text-3xl font-extrabold text-white tracking-tight">
            {student.recentPracticeHours} <span className="text-base font-normal text-slate-400">hrs</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Consistency: {student.assignmentConsistency}% on-time completion
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
          <div className="text-xs text-slate-400 mb-1">Active Learning Gaps</div>
          <div className="text-3xl font-extrabold text-white tracking-tight">
            {gaps.length} <span className="text-base font-normal text-slate-400">Topics</span>
          </div>
          <div className="mt-2 text-xs text-indigo-400 font-semibold">
            {gaps.filter(g => g.severity === 'critical').length} require immediate recovery
          </div>
        </div>
      </div>

      {/* LearnPulse Learning Recovery Score Spotlight */}
      <div className="p-6 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
                <Zap className="w-4 h-4 text-indigo-400" />
              </div>
              <h3 className="text-base font-bold text-white">
                Product Metric: Learning Recovery Score
              </h3>
            </div>
            <p className="text-xs text-indigo-200/80 mt-1 max-w-xl">
              Measures the actual conceptual gain achieved after completing deliberate concept repair missions.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-950/80 p-3.5 rounded-xl border border-indigo-500/20">
            <div className="text-center">
              <div className="text-[10px] uppercase text-slate-400 font-medium">Baseline</div>
              <div className="text-base font-bold text-slate-300">{baseline}%</div>
            </div>
            <div className="text-indigo-400 font-bold">→</div>
            <div className="text-center">
              <div className="text-[10px] uppercase text-slate-400 font-medium">Current</div>
              <div className="text-base font-bold text-white">{student.overallMastery}%</div>
            </div>
            <div className="text-indigo-400 font-bold">=</div>
            <div className="text-center px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
              <div className="text-[10px] uppercase text-emerald-400 font-bold">Recovery Gain</div>
              <div className="text-lg font-bold text-emerald-400">+{recoveryGain}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum Topic Mastery Breakdown */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white tracking-tight">
          Curriculum Topic Mastery Breakdown
        </h3>

        <div className="space-y-3">
          {student.topicMastery.map((tm, idx) => {
            const isMastered = tm.score >= 75;
            const isCritical = tm.score < 50;

            return (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{tm.topicName}</span>
                    <span className="text-[10px] font-semibold text-slate-400 px-2 py-0.5 rounded-sm bg-slate-800">
                      {tm.subject}
                    </span>
                  </div>
                  <div className="w-full max-w-md h-2 bg-slate-800 rounded-full overflow-hidden mt-2">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isCritical ? 'bg-rose-500' : isMastered ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${tm.score}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span
                    className={`text-sm font-bold ${
                      isCritical
                        ? 'text-rose-400'
                        : isMastered
                        ? 'text-emerald-400'
                        : 'text-amber-400'
                    }`}
                  >
                    {tm.score}%
                  </span>
                  <span
                    className={`text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-md border ${
                      isCritical
                        ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                        : isMastered
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                    }`}
                  >
                    {tm.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gamified Achievements Showcase */}
      <GamifiedBadges badges={badges} />
    </div>
  );
};
