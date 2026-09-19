import React, { useState, useEffect } from 'react';
import { UserRole } from './types';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { ArchitectureModal } from './components/shared/ArchitectureModal';
import { LandingPage } from './components/landing/LandingPage';
import { AuthPage } from './components/auth/AuthPage';
import { ProfileSetupView } from './components/auth/ProfileSetupView';
import { InvalidRoleView } from './components/auth/InvalidRoleView';
import { UserProfileCard } from './components/shared/UserProfileCard';

// Student Components
import { StudentHome } from './components/student/StudentHome';
import { StudentKnowledgeMap } from './components/student/StudentKnowledgeMap';
import { AdaptivePracticeView } from './components/student/AdaptivePracticeView';
import { StudentRecoveryPath } from './components/student/StudentRecoveryPath';
import { PreClassPreview } from './components/student/PreClassPreview';
import { PulseTutorView } from './components/student/PulseTutorView';
import { StudentLearningGaps } from './components/student/StudentLearningGaps';
import { StudentInsightsView } from './components/student/StudentInsightsView';
import { QuickUnderstandingCheck } from './components/student/QuickUnderstandingCheck';
import { detectStudentLearningGaps } from './lib/learningGapEngine';
import { evaluateStudentBadges } from './lib/badgeEngine';
import { STUDENTS_SEED } from './data/seedData';
import { LearningGap } from './types';
import { LearningLoopStageId, mapStageToRoute, mapRouteToStage } from './lib/learningLoop';

// Teacher Components
import { TeacherCommandCenter } from './components/teacher/TeacherCommandCenter';
import { TeacherAICommand } from './components/teacher/TeacherAICommand';
import { StudentsTableView } from './components/teacher/StudentsTableView';
import { TopicIntelligenceView } from './components/teacher/TopicIntelligenceView';
import { InterventionsView } from './components/teacher/InterventionsView';
import { PreClassTeacherIntelligence } from './components/teacher/PreClassTeacherIntelligence';
import { RiskRadarView } from './components/teacher/RiskRadarView';
import { MisconceptionLabView } from './components/teacher/MisconceptionLabView';
import { AIQuestionGeneratorView } from './components/teacher/AIQuestionGeneratorView';

// Parent & Admin Components
import { ParentDashboard } from './components/parent/ParentDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';

// Icons & Seed
import { Sparkles, Loader2, Bell } from 'lucide-react';
import { PRE_CLASS_PREVIEW_TOMORROW } from './data/seedData';

export default function App() {
  const { user, session, profile, role, authLoading, profileLoading } = useAuth();

  const [activeNav, setActiveNav] = useState<string>('home');
  const [activeStage, setActiveStage] = useState<LearningLoopStageId>(() =>
    mapRouteToStage('home', role || 'student')
  );
  const [isArchitectureOpen, setIsArchitectureOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [tutorContextPrompt, setTutorContextPrompt] = useState<string>('');
  const [selectedGap, setSelectedGap] = useState<LearningGap | null>(null);

  // Synchronize activeStage with activeNav and role
  useEffect(() => {
    setActiveStage(mapRouteToStage(activeNav, role || 'student'));
  }, [activeNav, role]);

  const handleSelectStage = (stageId: LearningLoopStageId) => {
    setActiveStage(stageId);
    const targetRoute = mapStageToRoute(stageId, role || 'student');
    setActiveNav(targetRoute);
  };

  // Active student profile derived from authenticated user or fallback demo student
  const activeStudent = React.useMemo(() => {
    if (user?.email) {
      const byEmail = STUDENTS_SEED.find(s => s.email.toLowerCase() === user.email?.toLowerCase());
      if (byEmail) return byEmail;
    }
    if (profile?.full_name) {
      const byName = STUDENTS_SEED.find(s => s.name.toLowerCase().includes(profile.full_name?.toLowerCase() || ''));
      if (byName) return byName;
    }
    return STUDENTS_SEED.find(s => s.name === 'Aarav Mehta') || STUDENTS_SEED[0];
  }, [user?.email, profile?.full_name]);

  const detectedGaps = React.useMemo(() => detectStudentLearningGaps(activeStudent), [activeStudent]);
  const studentBadges = React.useMemo(() => evaluateStudentBadges(activeStudent), [activeStudent]);

  // Synchronize default active tab when verified role changes
  useEffect(() => {
    if (role === 'student') setActiveNav('home');
    else if (role === 'teacher') setActiveNav('dashboard');
    else if (role === 'parent') setActiveNav('overview');
    else if (role === 'admin') setActiveNav('dashboard');
  }, [role]);

  // When user becomes authenticated, close the auth modal/page
  useEffect(() => {
    if (user && session) {
      setIsAuthOpen(false);
    }
  }, [user, session]);

  const handleOpenTutorWithPrompt = (prompt: string) => {
    setTutorContextPrompt(prompt);
    setActiveNav('tutor');
  };

  // 1. Initial Authentication Loading State
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 animate-pulse mb-4">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-lg font-bold text-white mb-1">LearnPulse AI</h2>
        <p className="text-xs text-slate-400 flex items-center gap-2">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
          Restoring Supabase authentication session...
        </p>
      </div>
    );
  }

  // 2. Protected Route: When LOGGED OUT
  // Users may only access Landing Page or Auth Page (Login/Signup).
  // Logged-out users cannot open protected dashboards.
  if (!user || !session) {
    if (isAuthOpen) {
      return (
        <>
          <AuthPage
            onBackToLanding={() => setIsAuthOpen(false)}
            onOpenArchitecture={() => setIsArchitectureOpen(true)}
          />
          <ArchitectureModal
            isOpen={isArchitectureOpen}
            onClose={() => setIsArchitectureOpen(false)}
          />
        </>
      );
    }

    return (
      <>
        <LandingPage
          onSelectRole={() => setIsAuthOpen(true)}
          onExploreDemo={() => setIsAuthOpen(true)}
          onOpenArchitecture={() => setIsArchitectureOpen(true)}
          onOpenAuth={() => setIsAuthOpen(true)}
        />
        <ArchitectureModal
          isOpen={isArchitectureOpen}
          onClose={() => setIsArchitectureOpen(false)}
        />
      </>
    );
  }

  // 3. Authenticated State: Profile is Loading from Supabase
  if (profileLoading && !profile) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 animate-pulse mb-4">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-lg font-bold text-white mb-1">Verifying Profile</h2>
        <p className="text-xs text-slate-400 flex items-center gap-2">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
          Loading user profile from Supabase profiles table...
        </p>
      </div>
    );
  }

  // 4. Protected Route: Profile Does Not Exist Yet
  // Show a safe profile-setup state where user can provide full name and select student/teacher/parent
  if (!profile) {
    return (
      <>
        <ProfileSetupView onProfileCreated={() => {}} />
        <ArchitectureModal
          isOpen={isArchitectureOpen}
          onClose={() => setIsArchitectureOpen(false)}
        />
      </>
    );
  }

  // 5. Protected Route: Role is Missing or Invalid
  // Do not grant access to any dashboard
  if (!role || !['student', 'teacher', 'parent', 'admin'].includes(role)) {
    return (
      <>
        <InvalidRoleView />
        <ArchitectureModal
          isOpen={isArchitectureOpen}
          onClose={() => setIsArchitectureOpen(false)}
        />
      </>
    );
  }

  // 6. Authenticated & Authorized: Render Workspace with Role-Specific Dashboard and Navigation
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentRole={role}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        onOpenLanding={() => {
          // If authenticated user clicks brand home, reset to their role's home view
          if (role === 'student') setActiveNav('home');
          else if (role === 'teacher') setActiveNav('dashboard');
          else if (role === 'parent') setActiveNav('overview');
          else if (role === 'admin') setActiveNav('dashboard');
        }}
      />

      {/* Main Workspace with Role-Based Navigation */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {/* Role-Specific Sidebar */}
        <Sidebar
          currentRole={role}
          activeNav={activeNav}
          onSelectNav={setActiveNav}
        />

        {/* Dynamic Viewport Content */}
        <main className="flex-1 min-w-0">
          {/* STUDENT DASHBOARD & NAVIGATION */}
          {role === 'student' && (
            <>
              {activeNav === 'home' && (
                <StudentHome
                  currentStageId={activeStage}
                  onSelectStage={handleSelectStage}
                  onNavigate={(tab) => {
                    if (tab === 'practice') setActiveNav('practice');
                    else if (tab === 'knowledge_map') setActiveNav('learn');
                    else if (tab === 'recovery_path') setActiveNav('recovery');
                    else setActiveNav(tab);
                  }}
                  onSelectGapForRecovery={(gap) => {
                    setSelectedGap(gap);
                    setActiveNav('recovery');
                  }}
                />
              )}
              {activeNav === 'gaps' && (
                <StudentLearningGaps
                  student={activeStudent}
                  gaps={detectedGaps}
                  onStartRecovery={(gap) => {
                    setSelectedGap(gap);
                    setActiveNav('recovery');
                  }}
                  onPracticeTopic={() => setActiveNav('practice')}
                  onOpenKnowledgeMap={() => setActiveNav('learn')}
                />
              )}
              {activeNav === 'preview' && (
                <PreClassPreview
                  data={PRE_CLASS_PREVIEW_TOMORROW}
                  onLaunchPreparation={() => setActiveNav('practice')}
                  onOpenTutor={(prompt) => {
                    setTutorContextPrompt(prompt);
                    setActiveNav('tutor');
                  }}
                />
              )}
              {activeNav === 'check' && (
                <QuickUnderstandingCheck
                  topicTitle="Quadratic Equations (Discriminant & Roots)"
                  preClassScore={PRE_CLASS_PREVIEW_TOMORROW.readinessPercentage}
                  onCompleteCheck={(res) => {
                    console.log('Post-class check completed:', res);
                  }}
                  onGoToPractice={() => setActiveNav('practice')}
                  onGoToRecovery={() => setActiveNav('recovery')}
                />
              )}
              {activeNav === 'learn' && <StudentKnowledgeMap />}
              {activeNav === 'practice' && <AdaptivePracticeView />}
              {activeNav === 'recovery' && <StudentRecoveryPath />}
              {activeNav === 'insights' && (
                <StudentInsightsView
                  student={activeStudent}
                  gaps={detectedGaps}
                  badges={studentBadges}
                  onStartRecovery={(gap) => {
                    setSelectedGap(gap);
                    setActiveNav('recovery');
                  }}
                />
              )}
              {activeNav === 'profile' && <UserProfileCard />}
              {activeNav === 'tutor' && (
                <PulseTutorView
                  student={activeStudent}
                  detectedGaps={detectedGaps}
                  initialPrompt={tutorContextPrompt}
                />
              )}
            </>
          )}

          {/* TEACHER COMMAND CENTER & NAVIGATION */}
          {role === 'teacher' && (
            <>
              {activeNav === 'dashboard' && (
                <TeacherCommandCenter
                  currentStageId={activeStage}
                  onSelectStage={handleSelectStage}
                  onNavigateTab={(tab) => {
                    if (tab === 'topic_intelligence') setActiveNav('analytics');
                    else if (tab === 'ai_command') setActiveNav('ai');
                    else setActiveNav(tab);
                  }}
                />
              )}
              {activeNav === 'students' && (
                <StudentsTableView
                  onGenerateRecovery={() => setActiveNav('interventions')}
                />
              )}
              {activeNav === 'analytics' && (
                <TopicIntelligenceView
                  onGenerateIntervention={() => setActiveNav('interventions')}
                />
              )}
              {activeNav === 'risk_radar' && (
                <RiskRadarView
                  onGeneratePlan={() => setActiveNav('interventions')}
                />
              )}
              {activeNav === 'misconception_lab' && (
                <MisconceptionLabView
                  onGenerateIntervention={() => setActiveNav('interventions')}
                />
              )}
              {activeNav === 'pre_class_intelligence' && (
                <PreClassTeacherIntelligence />
              )}
              {activeNav === 'interventions' && <InterventionsView />}
              {activeNav === 'ai_question_generator' && <AIQuestionGeneratorView />}
              {(activeNav === 'ai' || activeNav === 'ai_command') && (
                <TeacherAICommand
                  onLaunchIntervention={() => setActiveNav('interventions')}
                  onNavigateTab={setActiveNav}
                />
              )}
            </>
          )}

          {/* PARENT DASHBOARD & NAVIGATION */}
          {role === 'parent' && (
            <>
              {(activeNav === 'overview' || activeNav === 'progress' || activeNav === 'support') && (
                <ParentDashboard />
              )}
              {activeNav === 'notifications' && (
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                    <Bell className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-base font-bold text-slate-900">Parent Notifications</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <div>
                        <div className="font-semibold text-slate-800">Diagnostic Practice Completed</div>
                        <div className="text-slate-500 mt-0.5">
                          Rahul completed the Quadratic Equations recovery set with an 82% accuracy score.
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">2 hours ago</div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <div>
                        <div className="font-semibold text-slate-800">Teacher Note: Dr. Radhika Sharma</div>
                        <div className="text-slate-500 mt-0.5">
                          Assigned a targeted 15-minute concept review on discriminant sign analysis before the upcoming unit assessment.
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">Yesterday</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeNav === 'profile' && <UserProfileCard />}
            </>
          )}

          {/* ADMIN DASHBOARD & NAVIGATION */}
          {role === 'admin' && (
            <AdminDashboard
              activeTab={activeNav}
              onSelectTab={setActiveNav}
            />
          )}
        </main>
      </div>

      {/* Supabase Architecture & RLS Modal */}
      <ArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />
    </div>
  );
}
