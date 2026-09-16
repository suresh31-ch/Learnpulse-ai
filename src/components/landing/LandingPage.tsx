import React from 'react';
import { UserRole } from '../../types';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Brain,
  TrendingUp,
  Activity,
  Layers,
  GraduationCap,
  Users,
  UserCheck,
  Building2,
  CheckCircle2,
  Clock,
  Compass,
  Zap,
  Target,
  KeyRound,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { LEARNING_LOOP_STAGES } from '../shared/LearningLoopBar';
import { useAuth } from '../../context/AuthContext';

interface LandingPageProps {
  onSelectRole: (role: UserRole) => void;
  onExploreDemo: () => void;
  onOpenArchitecture: () => void;
  onOpenAuth?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onSelectRole,
  onExploreDemo,
  onOpenArchitecture,
  onOpenAuth
}) => {
  const { user: authUser, signOut } = useAuth();
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">
              LearnPulse <span className="text-indigo-400">AI</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenArchitecture}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border border-slate-700/60"
            >
              Supabase Architecture
            </button>

            {authUser ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs font-semibold text-emerald-300 max-w-[140px] truncate">
                  {authUser.email}
                </span>
                <button
                  onClick={() => signOut()}
                  className="text-slate-400 hover:text-rose-300 transition-colors p-1"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              onOpenAuth && (
                <button
                  id="btn-landing-auth"
                  onClick={onOpenAuth}
                  className="text-xs font-semibold px-3.5 py-1.5 rounded-lg text-slate-200 hover:text-white hover:bg-slate-800 transition-colors border border-slate-700/80 flex items-center gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Sign In / Sign Up</span>
                </button>
              )
            )}

            <button
              id="btn-landing-explore-demo"
              onClick={onExploreDemo}
              className="text-xs font-semibold px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
            >
              <span>Explore Live Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 overflow-hidden border-b border-slate-800/60">
        {/* Subtle decorative radial gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>The AI-Powered Learning Intelligence Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-tight">
            Know what students know —{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-300 to-emerald-400">
              before the exam tells you otherwise.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            LearnPulse AI transforms assessment data into concept-level intelligence, early-risk signals, personalized interventions, and measurable learning recovery.
          </p>

          {/* Core Promise Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-indigo-300 font-semibold">
              Detect the gap.
            </span>
            <span className="text-slate-600 font-bold">•</span>
            <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-violet-300 font-semibold">
              Explain the gap.
            </span>
            <span className="text-slate-600 font-bold">•</span>
            <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-amber-300 font-semibold">
              Fix the gap.
            </span>
            <span className="text-slate-600 font-bold">•</span>
            <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-emerald-300 font-semibold">
              Measure recovery.
            </span>
          </div>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {onOpenAuth && !authUser && (
              <button
                id="btn-hero-auth"
                onClick={onOpenAuth}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 hover:scale-[1.02] transition-all flex items-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>Sign In / Create Account</span>
              </button>
            )}

            <button
              id="btn-start-learning"
              onClick={() => onSelectRole('student')}
              className={`px-6 py-3 rounded-xl ${
                !authUser && onOpenAuth
                  ? 'bg-slate-900 hover:bg-slate-800 text-white border border-slate-700/80 hover:border-slate-600'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/30 hover:scale-[1.02]'
              } font-bold text-sm transition-all flex items-center gap-2`}
            >
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              <span>Explore as Student</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="btn-hero-teacher"
              onClick={() => onSelectRole('teacher')}
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm border border-slate-700/80 hover:border-slate-600 transition-all flex items-center gap-2"
            >
              <Users className="w-4 h-4 text-indigo-400" />
              <span>Teacher Command Center</span>
            </button>
          </div>
        </div>
      </section>

      {/* Role Selector Cards */}
      <section className="py-16 bg-slate-900/50 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Select an Experience to Enter
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Four tailored dashboards with role-based visibility powered by Supabase RLS.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Student */}
            <div
              onClick={() => onSelectRole('student')}
              className="group p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/80 hover:bg-slate-850 cursor-pointer transition-all flex flex-col justify-between hover:shadow-xl hover:shadow-indigo-500/10"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                  Student Portal
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Pre-class readiness preview, interactive knowledge map, adaptive practice, and Socratic Pulse Tutor.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2 text-[11px] text-indigo-400 font-semibold">
                  <span>Demo: Rahul Kumar (61% Mastery)</span>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-white group-hover:translate-x-1 transition-transform">
                <span>Enter Student View</span>
                <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
              </div>
            </div>

            {/* Teacher */}
            <div
              onClick={() => onSelectRole('teacher')}
              className="group p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/80 hover:bg-slate-850 cursor-pointer transition-all flex flex-col justify-between hover:shadow-xl hover:shadow-indigo-500/10"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-violet-300 transition-colors">
                  Teacher Command Center
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Whole-class radar, topic intelligence drilldowns, Misconception Lab, and 15-minute intervention generator.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2 text-[11px] text-violet-400 font-semibold">
                  <span>Demo: Dr. Sharma (Class 10A)</span>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-white group-hover:translate-x-1 transition-transform">
                <span>Launch Command Center</span>
                <ArrowRight className="w-3.5 h-3.5 text-violet-400" />
              </div>
            </div>

            {/* Parent */}
            <div
              onClick={() => onSelectRole('parent')}
              className="group p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/80 hover:bg-slate-850 cursor-pointer transition-all flex flex-col justify-between hover:shadow-xl hover:shadow-indigo-500/10"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <UserCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                  Parent / Guardian
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Simplified, supportive learning journey view with non-stigmatizing gap insights and practical support actions.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2 text-[11px] text-emerald-400 font-semibold">
                  <span>Demo: Sanjay Kumar (Parent)</span>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-white group-hover:translate-x-1 transition-transform">
                <span>View Child Journey</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>

            {/* Admin */}
            <div
              onClick={() => onSelectRole('admin')}
              className="group p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/80 hover:bg-slate-850 cursor-pointer transition-all flex flex-col justify-between hover:shadow-xl hover:shadow-indigo-500/10"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                  Institution / Admin
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Multi-school macro analytics, learning gap detection totals, and systemic intervention efficacy metrics.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2 text-[11px] text-amber-400 font-semibold">
                  <span>Demo: 4 Schools • 1,248 Students</span>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-white group-hover:translate-x-1 transition-transform">
                <span>View Admin Metrics</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Agnostic Section */}
      <section className="py-16 bg-slate-950 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Curriculum-Agnostic Engine</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
              One intelligence engine. Every learning journey.
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              From school syllabi to high-stakes competitive examinations and university engineering faculties.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-4">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">School Boards</h3>
              <p className="text-xs text-slate-400 mt-1">
                K-12 standards with continuous formative mastery tracking.
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {['CBSE', 'ICSE', 'Cambridge IGCSE', 'State Boards', 'IB Diploma'].map(tag => (
                  <span key={tag} className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="w-9 h-9 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center mb-4">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Competitive Exams</h3>
              <p className="text-xs text-slate-400 mt-1">
                Precision speed-accuracy calibration and trap-concept diagnostics.
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {['JEE Main', 'JEE Advanced', 'NEET UG', 'EAPCET', 'CUET', 'UPSC Prelims'].map(tag => (
                  <span key={tag} className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="w-9 h-9 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Higher Education</h3>
              <p className="text-xs text-slate-400 mt-1">
                Deep technical mastery tracking across multi-semester modular courses.
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {['B.Tech CSE', 'Data Science', 'BCA', 'MBA Quantitative', 'Applied Law'].map(tag => (
                  <span key={tag} className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Learning Intelligence Loop */}
      <section className="py-16 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Complete Educational Lifecycle</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
              The 11-Stage Closed Learning Loop
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              From preparation before class through measurable recovery after intervention.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {LEARNING_LOOP_STAGES.map((stage, idx) => (
              <div key={stage.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-mono font-bold text-indigo-400">
                    STAGE {String(idx + 1).padStart(2, '0')}
                  </div>
                  <div className="text-xs font-bold text-white mt-1">{stage.label}</div>
                  <div className="text-[11px] text-slate-400 mt-1">{stage.desc}</div>
                </div>
              </div>
            ))}
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-900/40 to-emerald-900/40 border border-emerald-500/30 flex flex-col justify-center text-center">
              <span className="text-xs font-bold text-emerald-300">Continuous Recovery</span>
              <span className="text-[10px] text-slate-300 mt-1">Never wait for exam failure</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-950 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500">
          <p>© 2026 LearnPulse AI. Built with React, Tailwind CSS, Supabase Architecture, and Gemini AI.</p>
          <p className="mt-1">All student records shown in demo mode are fictional pedagogical examples.</p>
        </div>
      </footer>
    </div>
  );
};
