import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import {
  User,
  Shield,
  GraduationCap,
  Users,
  HeartHandshake,
  ShieldAlert,
  Loader2,
  RefreshCw,
  LogOut,
  AlertCircle,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface ProfileSetupViewProps {
  onProfileCreated?: () => void;
}

export const ProfileSetupView: React.FC<ProfileSetupViewProps> = ({ onProfileCreated }) => {
  const { user, profile, profileError, createProfileIfMissing, refreshProfile, signOut, profileLoading } =
    useAuth();

  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (selectedRole === 'admin') {
      setErrorMessage(
        'Security Restriction: Admin role cannot be self-assigned. Contact your system administrator.'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const { profile: newProf, error } = await createProfileIfMissing({
        role: selectedRole,
        fullName: fullName.trim(),
      });

      if (error) {
        setErrorMessage(error.message);
      } else if (newProf) {
        setSuccessMessage('Profile initialized successfully! Routing to your workspace...');
        if (onProfileCreated) onProfileCreated();
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to create profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefresh = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const p = await refreshProfile();
      if (p) {
        setSuccessMessage('Profile found! Routing to your dashboard...');
      } else {
        setErrorMessage('Profile still not found. Please complete the setup below.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative z-10">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mx-auto mb-3 text-indigo-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Complete Profile Setup</h2>
          <p className="text-xs text-slate-400 mt-1">
            Authenticated as <span className="text-indigo-300 font-mono">{user?.email}</span>. A profile record is required in the Supabase{' '}
            <code className="text-indigo-400">profiles</code> table.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">{errorMessage}</div>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>{successMessage}</div>
          </div>
        )}

        <form onSubmit={handleCreateProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Rahul Kumar"
              className="w-full px-3 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Select Your Role
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedRole('student')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedRole === 'student'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-indigo-400 mb-1" />
                <div className="text-xs font-bold">Student</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('teacher')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedRole === 'teacher'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Users className="w-4 h-4 text-indigo-400 mb-1" />
                <div className="text-xs font-bold">Teacher</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('parent')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedRole === 'parent'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <HeartHandshake className="w-4 h-4 text-indigo-400 mb-1" />
                <div className="text-xs font-bold">Parent</div>
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              Institution Admin privileges cannot be self-assigned.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || profileLoading}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Initializing Profile...</span>
              </>
            ) : (
              <span>Save & Enter LearnPulse</span>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3 text-xs">
          <button
            onClick={handleRefresh}
            disabled={isSubmitting || profileLoading}
            className="text-slate-400 hover:text-indigo-300 flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Check Database Again</span>
          </button>

          <button
            onClick={() => signOut()}
            className="text-rose-400 hover:text-rose-300 flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
