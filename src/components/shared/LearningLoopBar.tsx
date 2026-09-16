import React from 'react';
import { ChevronRight } from 'lucide-react';

export const LEARNING_LOOP_STAGES = [
  { id: 'before_class', label: 'Before Class', desc: 'Syllabus & preview planning' },
  { id: 'pre_class_preview', label: 'Pre-Class Preview', desc: 'Prerequisite checks & readiness' },
  { id: 'classroom', label: 'Classroom', desc: 'Active lecture & interaction' },
  { id: 'quick_check', label: 'Quick Check', desc: 'Formative exit tickets' },
  { id: 'assessment', label: 'Assessment', desc: 'Concept-level evaluation' },
  { id: 'gap_detection', label: 'Gap Detection', desc: 'Algorithmic weakness tagging' },
  { id: 'risk_analysis', label: 'Risk Analysis', desc: 'Early warning signal evaluation' },
  { id: 'intervention', label: 'Intervention', desc: 'Targeted classroom recovery' },
  { id: 'adaptive_practice', label: 'Adaptive Practice', desc: 'Confidence-calibrated practice' },
  { id: 'reassessment', label: 'Reassessment', desc: 'Empirical verification' },
  { id: 'mastery_recovery', label: 'Mastery Recovery', desc: 'Measured learning gain' },
];

interface LearningLoopBarProps {
  currentStageId?: string;
  onSelectStage?: (stageId: string) => void;
  compact?: boolean;
}

export const LearningLoopBar: React.FC<LearningLoopBarProps> = ({
  currentStageId = 'pre_class_preview',
  onSelectStage,
  compact = false
}) => {
  return (
    <div id="learning-loop-bar" className="w-full bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">Core Learning Intelligence Loop</span>
          <p className="text-xs text-slate-500">Detect the gap. Explain the gap. Fix the gap. Measure recovery.</p>
        </div>
        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
          11-Stage Closed Loop
        </span>
      </div>

      <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200">
        <div className="flex items-center gap-1.5 min-w-max py-1">
          {LEARNING_LOOP_STAGES.map((stage, index) => {
            const isCurrent = stage.id === currentStageId;
            const isPast = LEARNING_LOOP_STAGES.findIndex(s => s.id === currentStageId) > index;

            return (
              <React.Fragment key={stage.id}>
                <button
                  id={`loop-stage-${stage.id}`}
                  onClick={() => onSelectStage?.(stage.id)}
                  className={`group text-left px-3 py-2 rounded-xl transition-all border ${
                    isCurrent
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm ring-2 ring-indigo-200'
                      : isPast
                      ? 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                        isCurrent ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className={`text-xs font-semibold whitespace-nowrap ${isCurrent ? 'text-white' : 'text-slate-800'}`}>
                      {stage.label}
                    </span>
                  </div>
                  {!compact && (
                    <p className={`text-[10px] mt-0.5 whitespace-nowrap ${isCurrent ? 'text-indigo-100' : 'text-slate-400'}`}>
                      {stage.desc}
                    </p>
                  )}
                </button>

                {index < LEARNING_LOOP_STAGES.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
