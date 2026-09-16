import React, { useMemo, useState } from 'react';
import {
  Network,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Loader2,
  WifiOff,
  RefreshCw,
} from 'lucide-react';
import { MasteryBadge } from '../shared/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { useStudentData } from '../../lib/useStudentData';
import { masteryStatus } from '../../lib/gapDetection';

// ---------------------------------------------------------------------------
// Internal node type used by the map UI
// ---------------------------------------------------------------------------
interface ConceptNode {
  id: string;
  name: string;
  mastery: number;
  status: 'mastered' | 'developing' | 'needs_attention' | 'prerequisite_gap';
  attempts: number;
  prerequisites: string[];
  description: string;
  misconceptionAlert?: string;
  topicName?: string;
  isRealData: boolean;
}

// ---------------------------------------------------------------------------
// Static seed nodes used as fallback when Supabase has no data
// ---------------------------------------------------------------------------
const SEED_NODES: ConceptNode[] = [
  {
    id: 'c-poly',
    name: 'Polynomial Division & Remainder Theorem',
    mastery: 84,
    status: 'mastered',
    attempts: 42,
    prerequisites: ['Basic Algebra', 'Exponents'],
    description: 'Synthetic division, factor theorem, and identifying algebraic zeroes.',
    isRealData: false,
  },
  {
    id: 'c-linear',
    name: 'Simultaneous Linear Equations',
    mastery: 79,
    status: 'mastered',
    attempts: 58,
    prerequisites: ['Linear Graphing'],
    description: 'Substitution, elimination, and graphical consistency.',
    isRealData: false,
  },
  {
    id: 'c-quad-std',
    name: 'Quadratic Standard Form (ax² + bx + c = 0)',
    mastery: 74,
    status: 'developing',
    attempts: 39,
    prerequisites: ['Polynomial Division'],
    description: 'Recognizing second-degree polynomial coefficients where a ≠ 0.',
    isRealData: false,
  },
  {
    id: 'c-disc',
    name: 'Discriminant Calculation (Δ = b² - 4ac)',
    mastery: 39,
    status: 'needs_attention' as const,
    attempts: 46,
    prerequisites: ['Quadratic Standard Form', 'Integer Sign Rules'],
    description: 'Evaluating Δ to determine real vs complex roots.',
    misconceptionAlert:
      'Frequent sign inversion: treating -4ac as subtraction when c is negative.',
    isRealData: false,
  },
  {
    id: 'c-roots',
    name: 'Roots via Quadratic Formula',
    mastery: 54,
    status: 'developing',
    attempts: 32,
    prerequisites: ['Discriminant Calculation'],
    description: 'Application of x = (-b ± √Δ)/(2a).',
    isRealData: false,
  },
  {
    id: 'c-graph',
    name: 'Parabola Graph & Vertex Intercepts',
    mastery: 67,
    status: 'developing',
    attempts: 25,
    prerequisites: ['Roots via Quadratic Formula'],
    description: 'Geometric interpretation of roots as x-axis crossings.',
    isRealData: false,
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
interface StudentKnowledgeMapProps {
  onOpenPractice?: () => void;
  onOpenTutor?: (prompt: string) => void;
}

export const StudentKnowledgeMap: React.FC<StudentKnowledgeMapProps> = ({
  onOpenPractice,
  onOpenTutor,
}) => {
  const { user } = useAuth();
  const studentData = useStudentData(user?.id);

  const [selectedConcept, setSelectedConcept] = useState<ConceptNode | null>(null);

  // Build concept name → prerequisite names lookup from edge list
  const prereqNameMap = useMemo<Map<string, string[]>>(() => {
    const map = new Map<string, string[]>();
    // Index concept mastery rows by concept_id for name lookups
    const conceptById = new Map(studentData.conceptMastery.map((c) => [c.concept_id, c]));
    for (const edge of studentData.prerequisites) {
      const prereqName =
        conceptById.get(edge.prerequisite_concept_id)?.concept_name ?? edge.prerequisite_concept_id;
      if (!map.has(edge.concept_id)) map.set(edge.concept_id, []);
      map.get(edge.concept_id)!.push(prereqName);
    }
    return map;
  }, [studentData.conceptMastery, studentData.prerequisites]);

  // Build active misconception lookup by concept_id
  const misconceptionByConceptId = useMemo<Map<string, string>>(() => {
    const map = new Map<string, string>();
    for (const m of studentData.misconceptions) {
      if (m.conceptId) map.set(m.conceptId, m.description);
    }
    return map;
  }, [studentData.misconceptions]);

  // Map real concept mastery rows → ConceptNode[]
  const realNodes: ConceptNode[] = useMemo(() => {
    if (!studentData.hasRealData || studentData.conceptMastery.length === 0) return [];
    const byId = new Map(studentData.conceptMastery.map((c) => [c.concept_id, c]));
    return studentData.conceptMastery.map((cm) => {
      const weakPrereq = studentData.prerequisites.some((edge) => {
        if (edge.concept_id !== cm.concept_id) return false;
        const prereq = byId.get(edge.prerequisite_concept_id);
        return prereq != null && prereq.mastery_score < 65;
      });
      const score = cm.mastery_score;
      return {
        id: cm.concept_id,
        name: cm.concept_name,
        mastery: score,
        status: masteryStatus(score, weakPrereq),
        attempts: 0,
        prerequisites: prereqNameMap.get(cm.concept_id) ?? [],
        description: cm.topic_name ? `Part of: ${cm.topic_name}` : 'Concept from your curriculum',
        misconceptionAlert: misconceptionByConceptId.get(cm.concept_id),
        topicName: cm.topic_name,
        isRealData: true,
      };
    });
  }, [studentData.conceptMastery, studentData.hasRealData, prereqNameMap, misconceptionByConceptId]);

  // Decide which nodes to display
  const concepts: ConceptNode[] =
    realNodes.length > 0 ? realNodes : SEED_NODES;

  const isRealData = realNodes.length > 0;

  // Reset selection when data source switches
  const [lastDataSource, setLastDataSource] = useState<'real' | 'seed'>('seed');
  const currentSource = isRealData ? 'real' : 'seed';
  if (currentSource !== lastDataSource) {
    setLastDataSource(currentSource);
    setSelectedConcept(null);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Network className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Interactive Knowledge Map</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
              {isRealData ? `${concepts.length} Concepts Tracked` : 'Mathematics • Algebra Unit'}
            </span>
            {isRealData && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                Live Supabase Data
              </span>
            )}
            {!isRealData && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-bold border border-purple-200">
                Demo Data
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {isRealData
              ? 'Your concept mastery data from Supabase — click any node to inspect prerequisites and misconceptions.'
              : 'Hierarchical dependency map: Click any concept node to inspect prerequisites, error patterns, and recovery status.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Legend */}
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Mastered
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Developing
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Needs attention
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-violet-500" /> Prerequisite gap
            </span>
          </div>

          {/* Refresh button */}
          <button
            onClick={studentData.refresh}
            disabled={studentData.loading}
            className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors border border-slate-200"
            title="Refresh from Supabase"
          >
            <RefreshCw className={`w-4 h-4 ${studentData.loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Loading state */}
      {studentData.loading && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 shadow-xs flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <p className="text-sm font-semibold text-slate-600">Loading concept mastery from Supabase…</p>
        </div>
      )}

      {/* Error/not-configured notice */}
      {!studentData.loading && studentData.error && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-medium text-amber-800">
          <WifiOff className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{studentData.error} Showing demo concept data.</span>
        </div>
      )}

      {studentData.nextAction && (
        <div className="bg-white rounded-2xl border border-indigo-200 p-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">What should I learn next?</p>
            <p className="text-sm font-bold text-slate-900">{studentData.nextAction.target}</p>
            <p className="text-xs text-slate-500 mt-0.5">{studentData.nextAction.reason}</p>
          </div>
          <button
            onClick={() => onOpenPractice?.()}
            className="px-3 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl"
          >
            Start focused practice
          </button>
        </div>
      )}

      {/* Main Map Visual Canvas */}
      {!studentData.loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Node Graph Flow */}
          <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-6 border border-slate-800 text-white relative overflow-hidden">
            {/* Subtle Grid Canvas Background */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px]" />

            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono pb-2 border-b border-slate-800">
                <span>PREREQUISITE FLOW → HIGHER-ORDER MASTERY</span>
                <span>{concepts.length} CONCEPTS MAPPED</span>
              </div>

              {concepts.length === 0 ? (
                /* Empty state — student has no concept mastery records yet */
                <div className="py-16 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
                    <Network className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-300">No concept data yet</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Complete some practice sessions or assessments so your concept mastery map
                    can be generated.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {concepts.map((concept, idx) => {
                    const isSelected = selectedConcept?.id === concept.id;
                    const statusColor =
                      concept.status === 'mastered'
                        ? 'border-emerald-500/70 bg-emerald-950/20 text-emerald-300'
                        : concept.status === 'developing'
                        ? 'border-amber-500/70 bg-amber-950/20 text-amber-300'
                        : concept.status === 'prerequisite_gap'
                        ? 'border-violet-500/80 bg-violet-950/30 text-violet-300 ring-2 ring-violet-500/20'
                        : 'border-rose-500/80 bg-rose-950/30 text-rose-300 ring-2 ring-rose-500/30';

                    return (
                      <div key={concept.id} className="relative">
                        <button
                          id={`concept-node-${concept.id}`}
                          onClick={() => setSelectedConcept(concept)}
                          className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between gap-4 ${statusColor} ${
                            isSelected
                              ? 'ring-2 ring-indigo-400 scale-[1.01] shadow-lg'
                              : 'hover:border-slate-600'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                                concept.status === 'mastered'
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : concept.status === 'developing'
                                  ? 'bg-amber-500/20 text-amber-300'
                                  : concept.status === 'prerequisite_gap'
                                  ? 'bg-violet-500/20 text-violet-300'
                                  : 'bg-rose-500/20 text-rose-300'
                              }`}
                            >
                              {idx + 1}
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-white truncate">
                                {concept.name}
                              </div>
                              <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2 flex-wrap">
                                {concept.topicName && (
                                  <span className="text-slate-500">{concept.topicName}</span>
                                )}
                                {concept.attempts > 0 && (
                                  <>
                                    <span>•</span>
                                    <span>Attempts: {concept.attempts}</span>
                                  </>
                                )}
                                {concept.prerequisites.length > 0 && (
                                  <>
                                    <span>•</span>
                                    <span className="truncate max-w-[200px]">
                                      Prereqs: {concept.prerequisites.slice(0, 2).join(', ')}
                                      {concept.prerequisites.length > 2 ? '…' : ''}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <div className="text-right">
                              <span className="text-base font-extrabold text-white">
                                {concept.mastery}%
                              </span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-500" />
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Node Inspector Drawer */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
            {selectedConcept ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Concept Inspector
                  </span>
                  <MasteryBadge
                    level={
                      selectedConcept.status === 'mastered'
                        ? 'mastered'
                        : selectedConcept.status === 'developing'
                        ? 'developing'
                        : 'critical'
                    }
                  />
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedConcept.name}</h3>
                  {selectedConcept.topicName && (
                    <p className="text-xs text-indigo-600 font-semibold mt-0.5">
                      Topic: {selectedConcept.topicName}
                    </p>
                  )}
                  <p className="text-xs text-slate-600 mt-1">{selectedConcept.description}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Mastery Level:</span>
                    <span className="font-bold text-slate-800">{selectedConcept.mastery}%</span>
                  </div>
                  {selectedConcept.attempts > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Completed Assessments:</span>
                      <span className="font-bold text-slate-800">
                        {selectedConcept.attempts} attempts
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Prerequisite Chain:</span>
                    <span className="font-bold text-slate-800">
                      {selectedConcept.prerequisites.length} link
                      {selectedConcept.prerequisites.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Data Source:</span>
                    <span
                      className={`font-bold ${
                        selectedConcept.isRealData ? 'text-emerald-600' : 'text-purple-600'
                      }`}
                    >
                      {selectedConcept.isRealData ? 'Supabase' : 'Demo Seed'}
                    </span>
                  </div>
                </div>

                {selectedConcept.prerequisites.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-200/60 space-y-1.5">
                    <span className="text-xs font-bold text-indigo-800 block">
                      Required Prerequisites
                    </span>
                    {selectedConcept.prerequisites.map((p, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs text-indigo-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                        {p}
                      </div>
                    ))}
                  </div>
                )}

                {selectedConcept.status === 'prerequisite_gap' && (
                  <p className="text-xs text-violet-800 bg-violet-50 border border-violet-200 rounded-xl p-3">
                    A weaker prerequisite is likely slowing this concept. Repair the earlier node first.
                  </p>
                )}

                {selectedConcept.misconceptionAlert && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 space-y-1">
                    <span className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                      Likely misconception
                    </span>
                    <p className="text-xs text-rose-800 leading-relaxed">
                      {selectedConcept.misconceptionAlert}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onOpenPractice?.()}
                    className="py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl"
                  >
                    Practice this
                  </button>
                  <button
                    onClick={() =>
                      onOpenTutor?.(
                        `Help me understand ${selectedConcept.name}. My recorded mastery is ${selectedConcept.mastery}%. Use Socratic hints.`,
                      )
                    }
                    className="py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
                  >
                    Ask tutor
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 space-y-3 my-auto">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="text-xs font-bold text-slate-700">Select any Concept Node</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Click a node on the left to reveal prerequisite depth, diagnostic evidence, and
                  targeted practice items.
                </p>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100">
              <span className="text-[11px] text-slate-400">
                {isRealData
                  ? `${concepts.length} concept records from Supabase student_concept_mastery.`
                  : 'Integrated with Supabase directed-graph prerequisites table.'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
