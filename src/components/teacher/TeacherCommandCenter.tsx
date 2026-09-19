import React from 'react';
import {
  Users,
  TrendingUp,
  AlertTriangle,
  Flame,
  ArrowRight,
  Sparkles,
  BookOpen,
  CalendarCheck,
  ShieldCheck,
  ChevronRight,
  Brain,
  CheckCircle2
} from 'lucide-react';
import { CURRENT_CLASS_INFO, CLASS_MASTERY_OVERVIEW, TOPIC_INTELLIGENCE_SEED } from '../../data/seedData';
import { MasteryBadge, RiskBadge, TrendBadge, DemoDataBadge } from '../shared/StatusBadge';
import { LearningLoopBar } from '../shared/LearningLoopBar';
import { LearningLoopStageId, mapStageToRoute } from '../../lib/learningLoop';

interface TeacherCommandCenterProps {
  onNavigateTab: (tabId: string) => void;
  onOpenStudentModal?: (studentId: string) => void;
  currentStageId?: LearningLoopStageId;
  onSelectStage?: (stageId: LearningLoopStageId) => void;
}

export const TeacherCommandCenter: React.FC<TeacherCommandCenterProps> = ({
  onNavigateTab,
  onOpenStudentModal,
  currentStageId = 'gap_detection',
  onSelectStage
}) => {
  const classInfo = CURRENT_CLASS_INFO;

  return (
    <div className="space-y-6">
      {/* Learning Intelligence Loop Banner */}
      <LearningLoopBar
        currentStageId={currentStageId}
        onSelectStage={(stageId) => {
          if (onSelectStage) {
            onSelectStage(stageId);
          } else {
            const targetRoute = mapStageToRoute(stageId, 'teacher');
            onNavigateTab(targetRoute);
          }
        }}
      />

      {/* Greeting & Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Good evening, Dr. Sharma 👋
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Live Command Center
            </span>
            <DemoDataBadge />
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Section: <span className="font-bold text-slate-800">{classInfo.className}</span> • {classInfo.curriculum} • {classInfo.schoolName}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-teacher-open-ai-command"
            onClick={() => onNavigateTab('ai_command')}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
          >
            <Brain className="w-4 h-4" />
            <span>AI Command Co-Pilot</span>
          </button>
          <button
            id="btn-teacher-preclass"
            onClick={() => onNavigateTab('pre_class_intelligence')}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <CalendarCheck className="w-4 h-4 text-emerald-400" />
            <span>Tomorrow's Readiness (42)</span>
          </button>
        </div>
      </div>

      {/* 5 Macro Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Total Students</span>
          <div className="text-2xl font-extrabold text-slate-800 mt-1">{classInfo.totalStudents}</div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">100% attendance rate</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Average Mastery</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-indigo-600">{classInfo.averageMastery}%</span>
            <span className="text-xs font-semibold text-emerald-600">+3%</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Class cohort mean</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-rose-100 bg-rose-50/20 shadow-xs">
          <span className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider block">At Risk</span>
          <div className="text-2xl font-extrabold text-rose-600 mt-1">{classInfo.atRiskCount}</div>
          <span className="text-[11px] text-rose-600/80 mt-0.5 block">Elevated risk signals</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Critical Support</span>
          <div className="text-2xl font-extrabold text-rose-700 mt-1">{classInfo.criticalCount}</div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Immediate action needed</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-100 bg-emerald-50/20 shadow-xs">
          <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider block">Improving</span>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">{classInfo.improvingCount}</div>
          <span className="text-[11px] text-emerald-600/80 mt-0.5 block">Positive trajectory</span>
        </div>
      </div>

      {/* 2 Primary Callout Action Banners (Prompt Mandates) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Attention Required Banner */}
        <div className="bg-gradient-to-br from-rose-50 via-white to-amber-50 rounded-2xl border border-rose-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Attention Required
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                6 Elevated Risk
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              6 students show elevated risk signals.
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Early warning detections triggered by recent accuracy drops (&gt;15%), low practice hours, and repeated sign traps.
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-rose-100 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Includes Rahul Kumar, Vikram Malhotra</span>
            <button
              id="btn-review-students"
              onClick={() => onNavigateTab('students')}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              <span>Review Students</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Top Learning Gap Banner */}
        <div className="bg-gradient-to-br from-indigo-50 via-white to-violet-50 rounded-2xl border border-indigo-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-indigo-600" />
                Top Learning Gap
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                19 Students Affected
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              Quadratic Equations
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Class mastery is at <strong>48%</strong> with a steep sign-error misconception in calculating Δ = b² - 4ac.
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-indigo-100 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">19 students bottlenecked</span>
            <button
              id="btn-generate-intervention-cta"
              onClick={() => onNavigateTab('interventions')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              <span>Generate Intervention</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Class Mastery Visual Charts / Heatmap Grid */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Class Mastery by Curriculum Strands</h3>
            <p className="text-xs text-slate-500">
              Formative aggregate distribution across Mathematics units for Class 10A.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('topic_intelligence')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <span>Deep Topic Drilldown</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {CLASS_MASTERY_OVERVIEW.map((item, idx) => {
            const isCritical = item.mastery < 65;
            const isHigh = item.mastery >= 75;

            return (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/60 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-800">{item.subject}</span>
                    <TrendBadge trend={item.trend as any} delta={item.change} />
                  </div>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-extrabold text-slate-900">{item.mastery}%</span>
                    <MasteryBadge level={item.mastery} />
                  </div>
                </div>

                {/* Styled visual bar with threshold indicator */}
                <div className="mt-4 pt-3 border-t border-slate-200/60">
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        isHigh ? 'bg-emerald-500' : isCritical ? 'bg-rose-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${item.mastery}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">Benchmark: 75% target</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Direct Intelligence Suite Launchers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div
          onClick={() => onNavigateTab('risk_radar')}
          className="bg-white hover:bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 shadow-xs cursor-pointer transition-all hover:border-indigo-300 group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
              6 Signals
            </span>
          </div>
          <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
            Risk Radar Matrix
          </h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Multi-factor early warning tracking velocity, recency drop, and persistence gaps.
          </p>
          <div className="mt-4 flex items-center text-xs font-bold text-indigo-600 gap-1">
            <span>Open Risk Radar</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('misconception_lab')}
          className="bg-white hover:bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 shadow-xs cursor-pointer transition-all hover:border-indigo-300 group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Flame className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              Diagnostic Lab
            </span>
          </div>
          <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
            Misconception Lab
          </h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Unpack cognitive trap: -4ac double-negative confusion confirmed in 19 students.
          </p>
          <div className="mt-4 flex items-center text-xs font-bold text-indigo-600 gap-1">
            <span>Explore Misconceptions</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('ai_question_generator')}
          className="bg-white hover:bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 shadow-xs cursor-pointer transition-all hover:border-indigo-300 group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
              Gemini Studio
            </span>
          </div>
          <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
            AI Question Studio
          </h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Generate CBSE curriculum questions with calibrated distractors targeting specific gaps.
          </p>
          <div className="mt-4 flex items-center text-xs font-bold text-indigo-600 gap-1">
            <span>Launch Generator</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
