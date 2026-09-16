import React, { useState } from 'react';
import { Brain, Sparkles, ArrowRight, AlertTriangle, ShieldCheck, Clock, Send, CheckCircle2, ChevronRight } from 'lucide-react';
import { CURRENT_CLASS_INFO, TOPIC_INTELLIGENCE_SEED } from '../../data/seedData';
import { TeacherCommandResponse } from '../../types';

interface TeacherAICommandProps {
  onLaunchIntervention?: (topic: string) => void;
  onNavigateTab?: (tab: string) => void;
}

export const TeacherAICommand: React.FC<TeacherAICommandProps> = ({
  onLaunchIntervention,
  onNavigateTab
}) => {
  const [query, setQuery] = useState('What should I focus on with Class 10A today?');
  const [loading, setLoading] = useState(false);
  const [isLiveAI, setIsLiveAI] = useState<boolean | null>(null);
  const [result, setResult] = useState<TeacherCommandResponse | null>({
    summary: "Class 10A demonstrates stable aggregate algebra retention (81%), but has an acute critical bottleneck in Quadratic Equations with 19 students struggling specifically with negative constant signs in the discriminant.",
    keyIssues: [
      {
        topic: "Quadratic Equations (Discriminant)",
        impact: "19 students affected • Class mastery at 48% (↓ 11% trend)",
        urgency: "high"
      },
      {
        topic: "Geometry (Triangle Similarity Criteria)",
        impact: "11 students confusing congruence vs proportionality",
        urgency: "medium"
      },
      {
        topic: "Linear Equations & Factoring",
        impact: "24 students showing strong upward recovery (+5%)",
        urgency: "low"
      }
    ],
    recommendedAction: "Run a 12-minute targeted Quadratic Intervention focused on sign rules in Δ = b² - 4ac before starting tomorrow's lesson.",
    actionType: "intervention"
  });

  const handleAskAI = async (customPrompt?: string) => {
    const promptToUse = customPrompt || query;
    if (!promptToUse.trim() || loading) return;

    setLoading(true);
    try {
      const res = await fetch('/api/ai/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToUse,
          context: {
            className: CURRENT_CLASS_INFO.className,
            totalStudents: CURRENT_CLASS_INFO.totalStudents,
            averageMastery: CURRENT_CLASS_INFO.averageMastery,
            atRisk: CURRENT_CLASS_INFO.atRiskCount,
            critical: CURRENT_CLASS_INFO.criticalCount,
            primaryGap: TOPIC_INTELLIGENCE_SEED.name,
            gapMastery: TOPIC_INTELLIGENCE_SEED.masteryPercentage
          }
        })
      });

      const data = await res.json();
      if (data.data) {
        setResult(data.data);
        setIsLiveAI(data.isLiveAI);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    "What should I focus on with Class 10A today?",
    "Why are 6 students showing elevated risk signals?",
    "Generate a 10-minute recap for tomorrow's quadratic lesson",
    "Which prerequisite concept has the lowest readiness score?"
  ];

  return (
    <div className="space-y-6">
      {/* Signature Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-md relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Signature Feature • AI Teaching Co-Pilot</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Teacher AI Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Synthesizes assessment telemetry, error pattern diagnostics, and prerequisite dependencies to provide immediate classroom action plans.
          </p>

          {/* Interactive Natural Language Prompt Input */}
          <div className="pt-2">
            <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700/80 rounded-2xl p-2 shadow-inner">
              <input
                id="input-teacher-ai-command"
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAskAI()}
                placeholder="Ask anything about Class 10A learning evidence..."
                className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-hidden"
              />
              <button
                id="btn-run-ai-command"
                disabled={loading || !query.trim()}
                onClick={() => handleAskAI()}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5 shrink-0"
              >
                {loading ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    <span>Synthesizing...</span>
                  </>
                ) : (
                  <>
                    <span>Execute Command</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>

            {/* Suggested quick queries */}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="text-[11px] text-slate-400 font-medium">Try asking:</span>
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(p);
                    handleAskAI(p);
                  }}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-indigo-300 border border-slate-700 transition-colors"
                >
                  "{p}"
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Synthesized Response Output */}
      {result && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Empirical Synthesis for Class 10A</h3>
                <span className="text-xs text-slate-500">
                  Targeting: 42 Students • Academic Year 2025–26
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Grounding: Formative Assessment Data
              </span>
              {isLiveAI !== null && (
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  {isLiveAI ? 'Live Gemini 2.5' : 'Verified Seed Synthesis'}
                </span>
              )}
            </div>
          </div>

          {/* Executive Summary */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 block mb-1">
              Executive Briefing:
            </span>
            <p className="text-sm font-medium text-slate-800 leading-relaxed">
              {result.summary}
            </p>
          </div>

          {/* Key Issues Identified */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Evidence-Backed Prioritization (Ranked by Impact):
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {result.keyIssues.map((issue, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border flex flex-col justify-between ${
                    issue.urgency === 'high'
                      ? 'bg-rose-50/50 border-rose-200 text-rose-950'
                      : issue.urgency === 'medium'
                      ? 'bg-amber-50/50 border-amber-200 text-amber-950'
                      : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold">{idx + 1}. {issue.topic}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          issue.urgency === 'high'
                            ? 'bg-rose-200 text-rose-800'
                            : issue.urgency === 'medium'
                            ? 'bg-amber-200 text-amber-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {issue.urgency}
                      </span>
                    </div>
                    <p className="text-xs opacity-85 leading-relaxed">{issue.impact}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Recommendation Banner */}
          <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                Recommended Classroom Action:
              </span>
              <p className="text-sm font-bold text-indigo-950">
                "{result.recommendedAction}"
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                id="btn-ai-launch-intervention"
                onClick={() => onLaunchIntervention?.('Quadratic Equations')}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
              >
                <span>Launch 12-Min Intervention</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
