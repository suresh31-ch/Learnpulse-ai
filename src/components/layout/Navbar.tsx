import React from 'react';
import { UserRole } from '../../types';
import {
  Sparkles,
  Database,
  GraduationCap,
  Users,
  UserCheck,
  ShieldCheck,
  LogOut,
  KeyRound,
  Shield
} from 'lucide-react';
import { isSupabaseConfigured } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  currentRole: UserRole;
  onChangeRole?: (role: UserRole) => void;
  onOpenArchitecture: () => void;
  onOpenLanding: () => void;
  onOpenAuth?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onChangeRole,
  onOpenArchitecture,
  onOpenLanding,
  onOpenAuth,
}) => {
  const { user: authUser, profile, role: verifiedRole, signOut } = useAuth();

  const roleLabels: Record<UserRole, { title: string; subtitle: string; icon: any }> = {
    student: {
      title: 'Student Portal',
      subtitle: 'Adaptive Learning & Diagnostics',
      icon: GraduationCap,
    },
    teacher: {
      title: 'Teacher Command Center',
      subtitle: 'Classroom & Misconception Intelligence',
      icon: Users,
    },
    parent: {
      title: 'Parent Dashboard',
      subtitle: 'Progress Tracking & Support Plan',
      icon: UserCheck,
    },
    admin: {
      title: 'Admin Dashboard',
      subtitle: 'Curriculum & School Governance',
      icon: ShieldCheck,
    },
  };

  const activeRole = verifiedRole || currentRole;
  const currentRoleInfo = roleLabels[activeRole] || roleLabels.student;
  const RoleIcon = currentRoleInfo.icon;

  const displayName = profile?.full_name || authUser?.user_metadata?.full_name || authUser?.email?.split('@')[0] || 'LearnPulse User';
  const displayEmail = authUser?.email || '';

  return (
    <header id="main-navbar" className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-4">
            <button
              id="btn-brand-home"
              onClick={onOpenLanding}
              className="flex items-center gap-2.5 group text-left focus:outline-hidden"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg tracking-tight text-white group-hover:text-indigo-200 transition-colors">
                    LearnPulse <span className="text-indigo-400">AI</span>
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Intelligence Platform
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                    Demo Data
                  </span>
                </div>
                <div className="flex items-center gap-2 -mt-0.5 hidden sm:flex">
                  <p className="text-[11px] text-slate-400">
                    LearnPulse Demo Academy • 2025–2026
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Center: When logged in, show Verified Role Badge (No unauthorized role switching) */}
          {authUser ? (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700/80 shadow-xs">
              <div className="w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <RoleIcon className="w-3.5 h-3.5" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white capitalize">
                  {currentRoleInfo.title}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Verified
                </span>
              </div>
            </div>
          ) : (
            // When logged out, show role explore tabs if provided
            onChangeRole && (
              <div className="hidden lg:flex items-center gap-1 bg-slate-800/90 p-1 rounded-xl border border-slate-700/60">
                {(['student', 'teacher', 'parent', 'admin'] as UserRole[]).map((r) => {
                  const Info = roleLabels[r];
                  const Icon = Info.icon;
                  const isCurrent = currentRole === r;
                  return (
                    <button
                      key={r}
                      id={`role-tab-${r}`}
                      onClick={() => onChangeRole(r)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        isCurrent
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span className="capitalize">{r}</span>
                    </button>
                  );
                })}
              </div>
            )
          )}

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {/* Supabase Architecture / Schema Spec Trigger */}
            <button
              id="btn-open-architecture"
              onClick={onOpenArchitecture}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700/80 rounded-lg transition-colors border border-slate-700"
              title="Inspect Supabase client connection, database schema, and RLS"
            >
              <div className="flex items-center gap-1">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isSupabaseConfigured() ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                  }`}
                />
                <Database className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <span className="hidden sm:inline">
                {isSupabaseConfigured() ? 'Supabase: Ready' : 'Supabase Client'}
              </span>
            </button>

            {/* Supabase Auth State Indicator & Sign Out */}
            {authUser ? (
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-800">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-xs text-white uppercase border border-indigo-400/30">
                    {displayName.charAt(0) || 'U'}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-xs font-semibold text-white leading-tight truncate max-w-[140px]">
                      {displayName}
                    </div>
                    <div className="text-[10px] text-slate-400 leading-tight truncate max-w-[140px]">
                      {displayEmail}
                    </div>
                  </div>
                </div>

                <button
                  id="btn-navbar-signout"
                  onClick={() => signOut()}
                  className="p-1.5 text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors border border-transparent hover:border-rose-500/20"
                  title="Sign Out of LearnPulse AI"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              onOpenAuth && (
                <button
                  id="btn-navbar-auth"
                  onClick={onOpenAuth}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-all shadow-xs shadow-indigo-600/20"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Sign In / Sign Up</span>
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
