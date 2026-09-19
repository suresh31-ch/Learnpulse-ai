import React, { useState } from 'react';
import { Network, ChevronRight, CheckCircle2, AlertCircle, Sparkles, BookOpen, Layers } from 'lucide-react';
import { MasteryBadge } from '../shared/StatusBadge';

interface ConceptNode {
  id: string;
  name: string;
  mastery: number;
  status: 'mastered' | 'developing' | 'critical';
  attempts: number;
  prerequisites: string[];
  description: string;
  misconceptionAlert?: string;
}

export const StudentKnowledgeMap: React.FC = () => {
  const [selectedConcept, setSelectedConcept] = useState<ConceptNode | null>(null);

  const concepts: ConceptNode[] = [
    {
      id: 'c-poly',
      name: 'Polynomial Division & Remainder Theorem',
      mastery: 84,
      status: 'mastered',
      attempts: 42,
      prerequisites: ['Basic Algebra', 'Exponents'],
      description: 'Synthetic division, factor theorem, and identifying algebraic zeroes.'
    },
    {
      id: 'c-linear',
      name: 'Simultaneous Linear Equations',
      mastery: 79,
      status: 'mastered',
      attempts: 58,
      prerequisites: ['Linear Graphing'],
      description: 'Substitution, elimination, and graphical consistency.'
    },
    {
      id: 'c-quad-std',
      name: 'Quadratic Standard Form (ax² + bx + c = 0)',
      mastery: 74,
      status: 'developing',
      attempts: 39,
      prerequisites: ['Polynomial Division'],
      description: 'Recognizing second-degree polynomial coefficients where a ≠ 0.'
    },
    {
      id: 'c-disc',
      name: 'Discriminant Calculation (Δ = b² - 4ac)',
      mastery: 39,
      status: 'critical',
      attempts: 46,
      prerequisites: ['Quadratic Standard Form', 'Integer Sign Rules'],
      description: 'Evaluating Δ to determine real vs complex roots.',
      misconceptionAlert: 'Frequent sign inversion: treating -4ac as subtraction when c is negative.'
    },
    {
      id: 'c-roots',
      name: 'Roots via Quadratic Formula',
      mastery: 54,
      status: 'developing',
      attempts: 32,
      prerequisites: ['Discriminant Calculation'],
      description: 'Application of x = (-b ± √Δ)/(2a).'
    },
    {
      id: 'c-graph',
      name: 'Parabola Graph & Vertex Intercepts',
      mastery: 67,
      status: 'developing',
      attempts: 25,
      prerequisites: ['Roots via Quadratic Formula'],
      description: 'Geometric interpretation of roots as x-axis crossings.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Network className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Interactive Knowledge Map</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
              Mathematics • Algebra Unit
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Hierarchical dependency map: Click any concept node to inspect prerequisites, error patterns, and recovery status.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-slate-600 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Mastered (≥75%)
          </span>
          <span className="flex items-center gap-1.5 text-slate-600 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Developing (60-74%)
          </span>
          <span className="flex items-center gap-1.5 text-slate-600 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Critical Gap (&lt;60%)
          </span>
        </div>
      </div>

      {/* Main Map Visual Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Node Graph Flow */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-6 border border-slate-800 text-white relative overflow-hidden">
          {/* Subtle Grid Canvas Background */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono pb-2 border-b border-slate-800">
              <span>PREREQUISITE FLOW → HIGHER-ORDER MASTERY</span>
              <span>6 CONCEPTS MAPPED</span>
            </div>

            <div className="space-y-3">
              {concepts.map((concept, idx) => {
                const isSelected = selectedConcept?.id === concept.id;
                const statusColor =
                  concept.status === 'mastered'
                    ? 'border-emerald-500/70 bg-emerald-950/20 text-emerald-300'
                    : concept.status === 'developing'
                    ? 'border-amber-500/70 bg-amber-950/20 text-amber-300'
                    : 'border-rose-500/80 bg-rose-950/30 text-rose-300 ring-2 ring-rose-500/30';

                return (
                  <div key={concept.id} className="relative">
                    <button
                      id={`concept-node-${concept.id}`}
                      onClick={() => setSelectedConcept(concept)}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between gap-4 ${statusColor} ${
                        isSelected ? 'ring-2 ring-indigo-400 scale-[1.01] shadow-lg' : 'hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                            concept.status === 'mastered'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : concept.status === 'developing'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {idx + 1}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">{concept.name}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                            <span>Attempts: {concept.attempts}</span>
                            <span>•</span>
                            <span>Prereqs: {concept.prerequisites.join(', ')}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <span className="text-base font-extrabold text-white">{concept.mastery}%</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Node Inspector Drawer */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          {selectedConcept ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Concept Inspector</span>
                <MasteryBadge level={selectedConcept.status} />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedConcept.name}</h3>
                <p className="text-xs text-slate-600 mt-1">{selectedConcept.description}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Mastery Level:</span>
                  <span className="font-bold text-slate-800">{selectedConcept.mastery}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Completed Assessments:</span>
                  <span className="font-bold text-slate-800">{selectedConcept.attempts} attempts</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Prerequisite Chain:</span>
                  <span className="font-bold text-slate-800">{selectedConcept.prerequisites.length} links</span>
                </div>
              </div>

              {selectedConcept.misconceptionAlert && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 space-y-1">
                  <span className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                    Detected Misconception
                  </span>
                  <p className="text-xs text-rose-800 leading-relaxed">
                    {selectedConcept.misconceptionAlert}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 space-y-3 my-auto">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-xs font-bold text-slate-700">Select any Concept Node</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Click a node on the left to reveal prerequisite depth, diagnostic evidence, and targeted practice items.
              </p>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100">
            <span className="text-[11px] text-slate-400">
              Integrated with Supabase directed-graph prerequisites table.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
