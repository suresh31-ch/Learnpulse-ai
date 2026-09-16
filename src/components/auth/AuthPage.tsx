import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import {
  Sparkles,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User as UserIcon,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Shield,
  ArrowLeft,
  LogOut,
  Database,
  GraduationCap,
  Users,
  HeartHandshake,
  ShieldAlert,
  ShieldCheck
} from 'lucide-react';

interface AuthPageProps {
  onBackToLanding?: () => void;
  onContinueToDashboard?: () => void;
  onOpenArchitecture?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  onBackToLanding,
  onContinueToDashboard,
  onOpenArchitecture,
}) => {
  const {
    user,
    profile,
    role,
    loading: authLoading,
    signIn,
    signUp,
    signOut,
    error: contextError,
    profileError,
    clearError,
  } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleToggleMode = (newMode: 'signin' | 'signup') => {
    setMode(newMode);
    setLocalError(null);
    setSuccessMessage(null);
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSuccessMessage(null);
    clearError();

    // Client-side validations
    if (!email.trim()) {
      setLocalError('Please enter your email address.');
      return;
    }

    if (!password) {
      setLocalError('Please enter your password.');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setLocalError('Passwords do not match. Please verify and try again.');
        return;
      }

      // Security requirement: Normal user cannot give themselves admin privileges through frontend code
      if (selectedRole === 'admin') {
        setLocalError(
          'Security Policy: Institution Admin accounts cannot be self-provisioned via public signup. Please select Student, Teacher, or Parent/Guardian to proceed.'
        );
        return;
      }
    }

    setIsSubmitting(true);

    try {
      if (mode === 'signin') {
        const { user: signedInUser, profile: loadedProfile, error } = await signIn(email, password);
        if (error) {
          setLocalError(error.message);
        } else if (signedInUser) {
          const roleLabel = loadedProfile?.role ? ` (${loadedProfile.role})` : '';
          setSuccessMessage(`Welcome back, ${signedInUser.email}! Authenticated via Supabase${roleLabel}.`);
        }
      } else {
        const { user: createdUser, session: newSession, profile: createdProfile, error } = await signUp(
          email,
          password,
          {
            role: selectedRole,
            fullName: fullName.trim(),
          }
        );

        if (error) {
          setLocalError(error.message);
        } else if (createdUser) {
          if (newSession) {
            setSuccessMessage(
              `Account created successfully as ${selectedRole.toUpperCase()}! Your profile has been initialized.`
            );
          } else {
            setSuccessMessage(
              `Registration initiated for ${createdUser.email}! Please check your email to confirm your account.`
            );
          }
        }
      }
    } catch (err: unknown) {
      setLocalError(err instanceof Error ? err.message : 'An unexpected error occurred during authentication.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    setIsSubmitting(true);
    setSuccessMessage(null);
    setLocalError(null);
    try {
      const { error } = await signOut();
      if (error) {
        setLocalError(error.message);
      } else {
        setSuccessMessage('You have been signed out of Supabase successfully.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayError = localError || contextError || profileError;

  const roleOptions: { id: UserRole; title: string; desc: string; icon: any; restricted?: boolean }[] = [
    {
      id: 'student',
      title: 'Student',
      desc: 'Adaptive practice, knowledge gaps, recovery missions',
      icon: GraduationCap,
    },
    {
      id: 'teacher',
      title: 'Teacher',
      desc: 'Command center, risk radar, misconception diagnostics',
      icon: Users,
    },
    {
      id: 'parent',
      title: 'Parent / Guardian',
      desc: 'Progress tracking, support plans, mastery updates',
      icon: HeartHandshake,
    },
    {
      id: 'admin',
      title: 'Institution Admin',
      desc: 'Organization governance, school curricula oversight',
      icon: ShieldCheck,
      restricted: true,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 right-10 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBackToLanding && (
              <button
                onClick={onBackToLanding}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors mr-1"
                title="Back to Landing Page"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-500/25">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-white">
              LearnPulse <span className="text-indigo-400">AI</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {onOpenArchitecture && (
              <button
                onClick={onOpenArchitecture}
                className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border border-slate-700/60"
              >
                <Database className="w-3.5 h-3.5 text-indigo-400" />
                <span>Supabase Specs</span>
              </button>
            )}

            {user && role && onContinueToDashboard && (
              <button
                onClick={onContinueToDashboard}
                className="text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-sm flex items-center gap-1.5"
              >
                <span>Enter {role.toUpperCase()} Dashboard</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12 relative z-10">
        <div className="w-full max-w-lg">
          {/* Active Session Card (If user is already signed in) */}
          {user && (
            <div className="mb-6 p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 backdrop-blur-md shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                      Authenticated
                    </span>
                    {role && (
                      <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider border border-indigo-500/30">
                        {role}
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-bold text-white truncate mt-0.5">
                    {user.email}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">
                    UID: {user.id}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                {onContinueToDashboard && role ? (
                  <button
                    onClick={onContinueToDashboard}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all flex items-center gap-1.5"
                  >
                    <span>Go to {role} Dashboard</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                ) : (
                  <div className="text-[11px] text-slate-400">
                    Status: <span className="text-emerald-400 font-medium">Verified in Supabase Auth</span>
                  </div>
                )}

                <button
                  onClick={handleSignOut}
                  disabled={isSubmitting}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}

          {/* Card Container */}
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl">
            {/* Header Badge & Title */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3">
                <Shield className="w-3.5 h-3.5 text-indigo-400" />
                <span>Supabase Secure Authentication</span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {mode === 'signin' ? 'Sign in to LearnPulse' : 'Create your account'}
              </h2>
              <p className="text-xs text-slate-400 mt-1.5 max-w-sm mx-auto">
                {mode === 'signin'
                  ? 'Access your role-specific learning intelligence, diagnostics, and curriculum insights.'
                  : 'Select your role and create your credentials to begin tracking learning mastery.'}
              </p>
            </div>

            {/* Mode Toggle Tabs */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-950 border border-slate-800 mb-6">
              <button
                type="button"
                id="btn-tab-signin"
                onClick={() => handleToggleMode('signin')}
                className={`py-2 text-xs font-semibold rounded-lg transition-all text-center ${
                  mode === 'signin'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                id="btn-tab-signup"
                onClick={() => handleToggleMode('signup')}
                className={`py-2 text-xs font-semibold rounded-lg transition-all text-center ${
                  mode === 'signup'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Success Notification */}
            {successMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs flex items-start gap-2.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">{successMessage}</div>
              </div>
            )}

            {/* Error Notification */}
            {displayError && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1 leading-relaxed">{displayError}</div>
                <button
                  onClick={() => {
                    setLocalError(null);
                    clearError();
                  }}
                  className="text-rose-400 hover:text-rose-200 font-bold ml-1 text-xs"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Selection (Signup only) */}
              {mode === 'signup' && (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">
                    Select Your Role
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {roleOptions.map((opt) => {
                      const Icon = opt.icon;
                      const isSelected = selectedRole === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          id={`role-option-${opt.id}`}
                          onClick={() => {
                            setSelectedRole(opt.id);
                            if (opt.id === 'admin') {
                              setLocalError(
                                'Security Restriction: Institution Admin accounts cannot be self-provisioned via public signup. Please contact your organization administrator.'
                              );
                            } else if (localError?.includes('Institution Admin')) {
                              setLocalError(null);
                            }
                          }}
                          className={`p-3 rounded-xl border text-left transition-all relative ${
                            isSelected
                              ? opt.restricted
                                ? 'bg-amber-500/10 border-amber-500/40 text-white ring-1 ring-amber-500/40'
                                : 'bg-indigo-600/20 border-indigo-500 text-white ring-1 ring-indigo-500'
                              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Icon
                              className={`w-4 h-4 ${
                                isSelected
                                  ? opt.restricted
                                    ? 'text-amber-400'
                                    : 'text-indigo-400'
                                  : 'text-slate-500'
                              }`}
                            />
                            <span className="text-xs font-bold text-white">{opt.title}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-tight">{opt.desc}</p>
                          {opt.restricted && (
                            <span className="mt-1.5 inline-block text-[9px] font-semibold text-amber-300 px-1.5 py-0.5 rounded-sm bg-amber-500/20 border border-amber-500/30">
                              Admin Invite Required
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Admin Warning Guard */}
                  {selectedRole === 'admin' && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5">
                      <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div className="leading-relaxed">
                        <strong>Security Guard:</strong> Normal users cannot grant themselves admin privileges through public signup. Administrator access requires an invitation from an existing institution administrator. Please choose Student, Teacher, or Parent/Guardian to create an account.
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Full Name (Signup only) */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Full Name <span className="text-slate-500 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <input
                      id="input-auth-name"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Rahul Kumar or Dr. Radhika Sharma"
                      disabled={isSubmitting}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all disabled:opacity-50"
                    />
                  </div>
                </div>
              )}

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="input-auth-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@school.edu or user@example.com"
                    disabled={isSubmitting}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Password
                  </label>
                  <span className="text-[11px] text-slate-500">
                    Min 6 characters
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="input-auth-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={isSubmitting}
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all disabled:opacity-50 font-mono text-[13px]"
                  />
                  <button
                    type="button"
                    id="btn-toggle-password-visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password (Signup only) */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="input-auth-confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      disabled={isSubmitting}
                      className="w-full pl-9 pr-10 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all disabled:opacity-50 font-mono text-[13px]"
                    />
                    <button
                      type="button"
                      id="btn-toggle-confirm-password-visibility"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                id="btn-submit-auth"
                disabled={isSubmitting || authLoading || (mode === 'signup' && selectedRole === 'admin')}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 mt-2 ${
                  mode === 'signup' && selectedRole === 'admin'
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    : 'bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white shadow-indigo-600/25'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{mode === 'signin' ? 'Authenticating...' : 'Creating Account...'}</span>
                  </>
                ) : mode === 'signup' && selectedRole === 'admin' ? (
                  <span>Admin Self-Signup Disabled (Invite Required)</span>
                ) : (
                  <>
                    <span>
                      {mode === 'signin'
                        ? 'Sign In with Email'
                        : `Create ${selectedRole.toUpperCase()} Account`}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            {/* Mode Switch Footer */}
            <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
              <p className="text-xs text-slate-400">
                {mode === 'signin' ? (
                  <>
                    Don't have an account yet?{' '}
                    <button
                      type="button"
                      onClick={() => handleToggleMode('signup')}
                      className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2 ml-1"
                    >
                      Create one now
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => handleToggleMode('signin')}
                      className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2 ml-1"
                    >
                      Sign in here
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Supabase Security Guarantee Badge */}
          <div className="mt-6 p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/60 text-center">
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Protected by Supabase Auth with PostgreSQL Row Level Security.
              <br />
              Zero credentials or private service keys are exposed to the client.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
