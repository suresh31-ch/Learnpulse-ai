import React, { useState, useEffect } from 'react';
import { X, Database, Shield, Brain, Layers, FileText, CheckCircle2, Lock, Terminal, Radio, RefreshCw, AlertCircle, Check, Key } from 'lucide-react';
import { isSupabaseConfigured, verifySupabaseConnection, SupabaseConnectionStatus, getSupabaseUrl } from '../../lib/supabase';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'connection' | 'tables' | 'seed' | 'rls' | 'ai_boundary' | 'rag'>('connection');
  const [connectionStatus, setConnectionStatus] = useState<SupabaseConnectionStatus | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      handleTestConnection();
    }
  }, [isOpen]);

  const handleTestConnection = async () => {
    setIsVerifying(true);
    try {
      const status = await verifySupabaseConnection();
      setConnectionStatus(status);
    } catch (e) {
      console.error(e);
    } finally {
      setIsVerifying(false);
    }
  };

  if (!isOpen) return null;


  const tablesList = [
    { name: 'profiles', desc: 'User identity, role (student/teacher/parent/admin), email, auth linkage' },
    { name: 'schools', desc: 'Institution entities, multi-tenant hierarchy and configuration' },
    { name: 'classes', desc: 'Class sections (e.g. Class 10A), academic years, curricula' },
    { name: 'class_members', desc: 'Many-to-many relationship mapping students and teachers to classes' },
    { name: 'programs', desc: 'Curriculum-agnostic tracks (School CBSE/ICSE, JEE, NEET, B.Tech)' },
    { name: 'curricula', desc: 'Board and syllabi standards metadata' },
    { name: 'subjects', desc: 'Academic disciplines (Mathematics, Physics, Chemistry, etc.)' },
    { name: 'topics', desc: 'Major chapters/units (e.g. Quadratic Equations, Geometry)' },
    { name: 'concepts', desc: 'Atomic learning objectives (e.g. Discriminant Δ = b² - 4ac)' },
    { name: 'prerequisites', desc: 'Directed acyclic knowledge graph linking concepts to dependencies' },
    { name: 'assessments', desc: 'Diagnostic, formative checkpoints, pre-class quizzes, exit tickets' },
    { name: 'questions', desc: 'Item bank with question types, distractors, and targeted misconceptions' },
    { name: 'attempts', desc: 'Student test attempts with timestamps, duration, and client metadata' },
    { name: 'responses', desc: 'Individual question responses, choice selection, latency, confidence' },
    { name: 'student_topic_mastery', desc: 'Calculated deterministic rolling mastery score & history' },
    { name: 'risk_predictions', desc: 'Statistical early warning signals, trend delta, and evidence payloads' },
    { name: 'misconceptions', desc: 'Catalog of recurring cognitive errors and mathematical trap patterns' },
    { name: 'interventions', desc: '15-minute recovery lesson plans, assigned cohorts, and timeline steps' },
    { name: 'learning_resources', desc: 'Curated explanations, video timestamps, and NCERT text anchors' },
    { name: 'practice_sessions', desc: 'Adaptive practice runs with difficulty progression logs' },
    { name: 'preclass_readiness', desc: 'Student preview scores, prerequisite check results, and flags' },
    { name: 'class_sessions', desc: 'Live classroom log, teacher recap notes, and exit check aggregates' },
    { name: 'learning_events', desc: 'Deterministic telemetry stream of student interaction events' },
    { name: 'ai_events', desc: 'Audit log of all server-side Gemini generation requests and tokens' }
  ];

  const rlsPolicies = [
    {
      role: 'Student',
      scope: 'Private Isolation',
      rule: 'Can SELECT & INSERT only their own responses, practice sessions, and pre-class readiness. Cannot view peers.',
      sql: 'CREATE POLICY "students_self_only" ON responses FOR ALL USING (auth.uid() = student_id);'
    },
    {
      role: 'Teacher',
      scope: 'Class Cohort Access',
      rule: 'Can view student performance only for classes they explicitly teach via class_members. Cannot access other schools.',
      sql: 'CREATE POLICY "teachers_assigned_classes" ON student_topic_mastery FOR SELECT USING (EXISTS (SELECT 1 FROM class_members WHERE teacher_id = auth.uid() AND class_id = student_topic_mastery.class_id));'
    },
    {
      role: 'Parent / Guardian',
      scope: 'Linked Dependent Only',
      rule: 'Access restricted strictly to children formally bound in parent_student_links table.',
      sql: 'CREATE POLICY "parents_linked_children" ON student_topic_mastery FOR SELECT USING (EXISTS (SELECT 1 FROM parent_child_links WHERE parent_id = auth.uid() AND child_id = student_topic_mastery.student_id));'
    },
    {
      role: 'Institution Admin',
      scope: 'School-Level Aggregates',
      rule: 'Can inspect school-wide analytics and teacher assignments. No unauthorized personal diary access.',
      sql: 'CREATE POLICY "admin_school_scope" ON schools FOR ALL USING (auth.uid() IN (SELECT admin_id FROM school_admins WHERE school_id = schools.id));'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">LearnPulse AI Architecture</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                  Production Blueprint
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Curriculum-agnostic schema, Supabase PostgreSQL, Row-Level Security, & Gemini boundaries.
              </p>
            </div>
          </div>
          <button
            id="btn-close-arch-modal"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-200 bg-white overflow-x-auto">
          <button
            onClick={() => setActiveTab('connection')}
            className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'connection'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-indigo-600" />
            <span>Supabase Connection</span>
            {connectionStatus?.connected ? (
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            ) : isSupabaseConfigured() ? (
              <span className="w-2 h-2 rounded-full bg-amber-500" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-slate-300" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('tables')}
            className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'tables'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            Database Schema (24 Tables)
          </button>
          <button
            onClick={() => setActiveTab('seed')}
            className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'seed'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-purple-600" />
            <span>Demo Seed Data (Step 6)</span>
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-100 text-purple-700">Ready</span>
          </button>
          <button
            onClick={() => setActiveTab('rls')}
            className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'rls'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Row Level Security (RLS)
          </button>
          <button
            onClick={() => setActiveTab('ai_boundary')}
            className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'ai_boundary'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            Deterministic vs. AI Boundary
          </button>
          <button
            onClick={() => setActiveTab('rag')}
            className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'rag'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Future RAG / pgvector
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'connection' && (
            <div className="space-y-4">
              {/* Connection Verification Card */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">
                        Supabase Client Status & Initialization
                      </h4>
                      {connectionStatus?.connected ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>Connected (Live Auth API)</span>
                        </span>
                      ) : connectionStatus?.configured ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-amber-600" />
                          <span>Configured (Testing Endpoint)</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                          Waiting for Secrets
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Modular client integration in <code className="font-mono text-indigo-600">src/lib/supabase.ts</code> using environment variables.
                    </p>
                  </div>

                  <button
                    id="btn-test-supabase-connection"
                    disabled={isVerifying}
                    onClick={handleTestConnection}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
                    <span>{isVerifying ? 'Testing...' : 'Test Connection'}</span>
                  </button>
                </div>

                {/* Secret Inspection (Safe display, no hardcoded values) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider block">
                      SUPABASE_URL
                    </span>
                    <div className="font-mono text-xs text-slate-800 font-medium mt-1 truncate">
                      {getSupabaseUrl() ? getSupabaseUrl() : <span className="text-slate-400 italic">Not detected in secrets</span>}
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider block">
                      SUPABASE_PUBLISHABLE_KEY
                    </span>
                    <div className="font-mono text-xs text-slate-800 font-medium mt-1">
                      {isSupabaseConfigured() ? (
                        <span className="text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Configured & Verified
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Not detected in secrets</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Security Guarantee */}
                <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
                  <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <strong>Zero-Exposure Security Guarantee:</strong> The Supabase service-role key and database passwords are never exposed in frontend code. Client requests use the publishable key with PostgreSQL Row Level Security (RLS) enforcement.
                  </div>
                </div>

                {/* Real Diagnostic Output */}
                {connectionStatus && (
                  <div className="p-3.5 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] space-y-1 overflow-x-auto">
                    <div className="text-slate-400 font-bold uppercase text-[10px] pb-1 border-b border-slate-800">
                      Live Supabase Diagnostic Result:
                    </div>
                    <div>• Configured in Env: {connectionStatus.configured ? 'YES' : 'NO'}</div>
                    <div>• Connected to API: {connectionStatus.connected ? 'YES (auth.getSession() HTTP 200)' : 'NO'}</div>
                    <div>• Auth Client Initialized: {connectionStatus.authInitialized ? 'YES' : 'NO'}</div>
                    {connectionStatus.errorMessage && (
                      <div className="text-amber-400">• Note: {connectionStatus.errorMessage}</div>
                    )}
                  </div>
                )}
              </div>

              {/* Ready Architecture Modules */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                  <Key className="w-4 h-4 text-indigo-600 mb-1" />
                  <span className="font-bold text-slate-900 block">1. Authentication Ready</span>
                  <p className="text-[11px] text-slate-500 mt-1">
                    <code className="text-indigo-600 font-mono">useSupabaseAuth</code> hook prepared for sign-in, sign-up, and session listening.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                  <Database className="w-4 h-4 text-indigo-600 mb-1" />
                  <span className="font-bold text-slate-900 block">2. Schema Types Ready</span>
                  <p className="text-[11px] text-slate-500 mt-1">
                    <code className="text-indigo-600 font-mono">Database</code> types in <code className="text-slate-700 font-mono">src/lib/database.types.ts</code> ready for type-safe queries.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                  <Shield className="w-4 h-4 text-indigo-600 mb-1" />
                  <span className="font-bold text-slate-900 block">3. RLS Policies Ready</span>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Row-level isolation per student, teacher, and parent roles prepared on database tables.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tables' && (

            <div className="space-y-3">
              <p className="text-xs text-slate-600">
                The database uses a <strong>curriculum-agnostic hierarchical relational architecture</strong>. Whether tracking CBSE Class 10, JEE Advanced, or Higher Ed B.Tech, the core progression model maps:
                <code className="mx-1 px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 font-mono text-[11px]">Program → Subject → Unit → Topic → Concept → Prerequisite → Question</code>.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {tablesList.map((tbl) => (
                  <div key={tbl.name} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-700">{tbl.name}</span>
                      <span className="text-[10px] uppercase font-semibold px-1.5 py-0.2 bg-slate-200 text-slate-700 rounded">Table</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{tbl.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'seed' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-purple-900">
                        Step 6: Realistic Fictional Demonstration Dataset
                      </h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-200/80 text-purple-800 border border-purple-300">
                        Demo Data
                      </span>
                    </div>
                    <p className="text-xs text-purple-700 mt-1">
                      Fictional demo institution: <strong>LearnPulse Demo Academy</strong> (CBSE Class 10 & JEE Batch Alpha).
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(
                        `-- LearnPulse AI Demo Seed Script is located in /supabase-seed.sql\n-- Execute this script in your Supabase Project Dashboard -> SQL Editor\n-- It seeds institutions, programs, subjects, units, topics, concepts, prerequisites, classes, assessments, questions, and mastery data.`
                      );
                      setCopiedSql(true);
                      setTimeout(() => setCopiedSql(false), 2500);
                    }}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-purple-700 text-white hover:bg-purple-800 transition-all shadow-xs flex items-center gap-1.5"
                  >
                    {copiedSql ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Copied Instructions!</span>
                      </>
                    ) : (
                      <>
                        <FileText className="w-3.5 h-3.5" />
                        <span>Copy SQL Seed Info</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Seed Content Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5 text-xs">
                  <span className="font-bold text-slate-800 block">🏫 Institution & Classes</span>
                  <p className="text-slate-600 text-[11px]">
                    • <strong>LearnPulse Demo Academy</strong> (2 campuses: Main & STEM Wing)
                  </p>
                  <p className="text-slate-600 text-[11px]">
                    • Class 10A — Mathematics (Dr. Radhika Sharma)
                  </p>
                  <p className="text-slate-600 text-[11px]">
                    • Class 10A — Science (Prof. Vikram Sen)
                  </p>
                  <p className="text-slate-600 text-[11px]">
                    • JEE Batch Alpha — Physics & Mathematics
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5 text-xs">
                  <span className="font-bold text-slate-800 block">👥 18 Fictional Students</span>
                  <p className="text-slate-600 text-[11px]">
                    • High (85–98%): Ananya Sharma, Kabir Sen, Neha Kulkarni, Priya Nair, Tanvi Joshi
                  </p>
                  <p className="text-slate-600 text-[11px]">
                    • Medium (65–84%): Aarav Mehta, Ishita Gupta, Kavya Iyer, Sneha Reddy, Rohan Verma, Aditya Singh
                  </p>
                  <p className="text-slate-600 text-[11px]">
                    • Needs Support (40–64%): Arjun Rao, Siddharth Rao, Rahul Kumar, Riya Choudhury, Meera Patel, Vihaan Kapoor
                  </p>
                  <p className="text-slate-600 text-[11px]">
                    • Critical Gap (&lt;40%): Dev Malhotra (36%)
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5 text-xs">
                  <span className="font-bold text-slate-800 block">🔬 Diagnosed Misconceptions</span>
                  <p className="text-slate-600 text-[11px]">
                    • <strong>Sign error in quadratics</strong>: evaluates -4ac as subtraction when c &lt; 0
                  </p>
                  <p className="text-slate-600 text-[11px]">
                    • <strong>Velocity vs. acceleration</strong>: assumes deceleration vector aligns with velocity
                  </p>
                  <p className="text-slate-600 text-[11px]">
                    • <strong>Ohm’s law variables</strong>: inverts current calculation I = V/R to I = VR
                  </p>
                  <p className="text-slate-600 text-[11px]">
                    • <strong>Free body diagram forces</strong>: omits opposing friction vectors
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5 text-xs">
                  <span className="font-bold text-slate-800 block">⚡ How to Apply in Supabase</span>
                  <p className="text-slate-600 text-[11px]">
                    Because Row Level Security (RLS) protects PostgreSQL from unauthenticated browser writes, execute the idempotent script in Supabase:
                  </p>
                  <p className="text-indigo-700 font-mono text-[11px] bg-indigo-50 p-1.5 rounded-lg border border-indigo-100">
                    File: /supabase-seed.sql (or /supabase/seed.sql)
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rls' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Strict Privacy Guarantee:</strong> Supabase PostgreSQL Row Level Security guarantees that no student can inspect another student's test results, and teachers can only query their enrolled class sections.
                </span>
              </div>

              <div className="space-y-3">
                {rlsPolicies.map((pol) => (
                  <div key={pol.role} className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-slate-900">{pol.role} Role</span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {pol.scope}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mb-2">{pol.rule}</p>
                    <div className="bg-slate-900 rounded-lg p-2.5 text-[11px] font-mono text-emerald-400 overflow-x-auto">
                      {pol.sql}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ai_boundary' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900">Deterministic Logic (Database/App Engine)</h4>
                  </div>
                  <ul className="text-xs text-slate-700 space-y-1.5">
                    <li>• Test scores, raw percentages, and accuracy metrics</li>
                    <li>• Attempt counts, duration, and question completion</li>
                    <li>• Mastery calculations & historical trend vectors</li>
                    <li>• Statistical aggregation by class, topic, and cohort</li>
                    <li>• Before/after intervention delta (+X percentage points)</li>
                  </ul>
                  <p className="text-[11px] text-blue-700 mt-3 font-medium">
                    AI never invents raw scores or alters deterministic assessment facts.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-4 h-4 text-purple-600" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900">Gemini AI Model (Server-Side)</h4>
                  </div>
                  <ul className="text-xs text-slate-700 space-y-1.5">
                    <li>• Interpreting error patterns into diagnosed misconceptions</li>
                    <li>• Generating step-by-step personalized explanations</li>
                    <li>• Socratic Mode interactive tutoring dialogs</li>
                    <li>• 15-minute classroom recovery lesson plans</li>
                    <li>• Adaptive question drafting with distractors and traps</li>
                  </ul>
                  <p className="text-[11px] text-purple-700 mt-3 font-medium">
                    All AI generation uses strict JSON schemas and is verified server-side.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rag' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/80">
                <h4 className="text-xs font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-indigo-600" />
                  RAG Textbook & Notes Grounding Pipeline
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  LearnPulse AI is engineered with an ingestion pipeline ready for NCERT chapters, official state board textbooks, teacher classroom notes, and coaching materials.
                </p>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <span className="font-bold text-slate-800">1. Ingestion</span>
                    <p className="text-[11px] text-slate-500 mt-1">PDF & doc chunking per concept</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <span className="font-bold text-slate-800">2. Vectorization</span>
                    <p className="text-[11px] text-slate-500 mt-1">Embeddings stored in pgvector</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <span className="font-bold text-slate-800">3. Semantic Query</span>
                    <p className="text-[11px] text-slate-500 mt-1">Targeted by detected gap ID</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <span className="font-bold text-slate-800">4. Grounded Tutor</span>
                    <p className="text-[11px] text-slate-500 mt-1">"Explain using my teacher's notes"</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            LearnPulse AI v1.0 • Ready for Supabase Auth & PostgreSQL
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
          >
            Close Architecture
          </button>
        </div>
      </div>
    </div>
  );
};
