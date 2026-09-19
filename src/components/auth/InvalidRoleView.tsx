import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, RefreshCw, LogOut, Database, UserCheck, AlertCircle } from 'lucide-react';

export const InvalidRoleView: React.FC = () => {
  const { user, profile, profileError, refreshProfile, signOut, profileLoading } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setMessage(null);
    try {
      const p = await refreshProfile();
      if (p?.role) {
        setMessage(`Updated role detected: ${p.role}. Re-evaluating permissions...`);
      } else {
        setMessage('Role is still pending assignment in the profiles table.');
      }
    } catch {
      setMessage('Failed to reload profile.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const currentRoleValue = profile?.role ? String(profile.role) : 'None / Not Assigned';

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative z-10 text-center">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-4 text-amber-400">
          <ShieldAlert className="w-6 h-6" />
        </div>

        <h2 className="text-xl font-bold text-white tracking-tight">Role Assignment Required</h2>
        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
          Your account is authenticated via Supabase, but your profile does not currently have an authorized role (
          <code className="text-amber-300 font-mono">student</code>,{' '}
          <code className="text-amber-300 font-mono">teacher</code>,{' '}
          <code className="text-amber-300 font-mono">parent</code>, or{' '}
          <code className="text-amber-300 font-mono">admin</code>).
        </p>

        <div className="my-5 p-4 rounded-xl bg-slate-950 border border-slate-800 text-left text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Account:</span>
            <span className="font-mono text-white truncate max-w-[200px]">{user?.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Current Role Value:</span>
            <span className="font-mono font-bold text-amber-400">{currentRoleValue}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Access Status:</span>
            <span className="text-rose-400 font-semibold">Dashboard Access Blocked</span>
          </div>
        </div>

        {profileError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs flex items-start gap-2 text-left">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">{profileError}</div>
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-200 text-xs">
            {message}
          </div>
        )}

        <div className="space-y-2.5">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || profileLoading}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Checking...' : 'Refresh Profile & Permissions'}</span>
          </button>

          <button
            onClick={() => signOut()}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        <p className="text-[11px] text-slate-500 mt-5">
          Please ask your school administrator to assign your role in the{' '}
          <code className="text-slate-400 font-mono">profiles.role</code> column in Supabase.
        </p>
      </div>
    </div>
  );
};
