import React, { useState } from 'react';
import { Layers, ChevronRight, AlertTriangle, Sparkles, TrendingDown, ArrowRight, BookOpen, Users, CheckCircle2 } from 'lucide-react';
import { TOPIC_INTELLIGENCE_SEED } from '../../data/seedData';
import { MasteryBadge } from '../shared/StatusBadge';

interface TopicIntelligenceViewProps {
  onGenerateIntervention?: (topic: string) => void;
}

export const TopicIntelligenceView: React.FC<TopicIntelligenceViewProps> = ({
  onGenerateIntervention
}) => {
  const topic = TOPIC_INTELLIGENCE_SEED;
  const [selectedConcept, setSelectedConcept] = useState(topic.concepts[0]);

  return (
    <div className="space-y-6">
      {/* Breadcrumb Hierarchy Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
        <span className="font-semibold text-slate-700">{topic.subject}</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-slate-700">{topic.unit}</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{topic.name}</span>
      </div>

      {/* Main Topic Macro Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-slate-900">{topic.name}</h1>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                Critical Priority
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Deep concept diagnostic across 42 students in Class 10A.
            </p>
          </div>

          <button
            onClick={() => onGenerateIntervention?.(topic.name)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Targeted Intervention</span>
          </button>
        </div>

        {/* 4 Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Class Mastery</span>
            <div className="text-2xl font-extrabold text-rose-600 mt-1">{topic.masteryPercentage}%</div>
            <span className="text-[11px] text-slate-400">Target benchmark: 75%</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Students Affected</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{topic.studentsAffected || 19} / 42</div>
            <span className="text-[11px] text-rose-600 font-semibold">45% of entire section</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Cohort Trend</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-2xl font-extrabold text-rose-600">{topic.trendValue}%</span>
              <TrendingDown className="w-4 h-4 text-rose-600" />
            </div>
            <span className="text-[11px] text-rose-600 font-semibold">Declining pace</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Tagged Misconception</span>
            <div className="text-xs font-bold text-slate-800 mt-1 truncate">
              {topic.commonMisconception}
            </div>
            <span className="text-[11px] text-amber-700 font-semibold">11 students confirmed</span>
          </div>
        </div>
      </div>

      {/* Concept Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Concepts List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Concept-Level Mastery Breakdown</h3>
              <p className="text-xs text-slate-500">Notice the steep drop specifically in Discriminant Calculation.</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
              4 Sub-Concepts
            </span>
          </div>

          <div className="space-y-3">
            {topic.concepts.map((concept) => {
              const isSelected = selectedConcept.conceptId === concept.conceptId;
              const isCritical = concept.masteryPercentage < 50;

              return (
                <div
                  key={concept.conceptId}
                  onClick={() => setSelectedConcept(concept)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isSelected
                      ? 'border-indigo-600 ring-2 ring-indigo-200 bg-indigo-50/30'
                      : 'border-slate-200/80 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{concept.conceptName}</span>
                      <MasteryBadge level={concept.masteryPercentage} />
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500">
                      <span>{concept.attemptsCount} student attempts</span>
                      <span>•</span>
                      <span>Last assessed: {concept.lastAssessedAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="w-32 bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full ${
                          isCritical ? 'bg-rose-500' : concept.masteryPercentage >= 70 ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${concept.masteryPercentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-extrabold text-slate-900 w-10 text-right">
                      {concept.masteryPercentage}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Concept Inspector Detail Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="pb-3 border-b border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">Selected Concept</span>
              <h4 className="text-base font-bold text-slate-900 mt-1">{selectedConcept.conceptName}</h4>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2.5 rounded-lg bg-slate-50">
                <span className="text-slate-500">Class Proficiency:</span>
                <span className="font-bold text-slate-800">{selectedConcept.masteryPercentage}%</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-slate-50">
                <span className="text-slate-500">Attempts Tracked:</span>
                <span className="font-bold text-slate-800">{selectedConcept.attemptsCount} total</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-slate-50">
                <span className="text-slate-500">Status:</span>
                <span className="font-bold text-amber-700 capitalize">{selectedConcept.status}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                Root Cause Diagnostic:
              </span>
              <p className="text-xs text-amber-800 leading-relaxed">
                Students evaluate (-4)(a)(c) as subtraction when c is negative, reversing the sign from positive to negative and mischaracterizing real roots as imaginary.
              </p>
            </div>
          </div>

          <button
            onClick={() => onGenerateIntervention?.(selectedConcept.conceptName)}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-colors shadow-xs text-center"
          >
            Create Remediation Lesson
          </button>
        </div>
      </div>
    </div>
  );
};
