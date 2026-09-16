import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  User as UserIcon,
  Mail,
  Shield,
  Key,
  Calendar,
  CheckCircle2,
  RefreshCw,
  LogOut,
  Database,
  ShieldCheck
} from 'lucide-react';

export const UserProfileCard: React.FC = () => {
  const { user, profile, role, refreshProfile, signOut, profileLoading } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setMessage(null);
    try {
      await refreshProfile();
      setMessage('Profile synchronized from Supabase successfully.');
    } catch {
      setMessage('Failed to refresh profile from database.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const displayName = profile?.full_name || user?.user_metadata?.full_name || 'LearnPulse User';
  const displayEmail = user?.email || 'No email provided';
  const createdAt = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : user?.created_at
    ? new Date(user.created_at).toLocaleDateString()
    : 'Unknown';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Profile Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-500/25 border border-indigo-400/30">
              {displayName.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-white">{displayName}</h2>
                {role && (
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider border border-indigo-500/30">
                    {role}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>{displayEmail}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing || profileLoading}
              className="flex-1 sm:flex-none px-3 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh Profile'}</span>
            </button>

            <button
              onClick={() => signOut()}
              className="flex-1 sm:flex-none px-3 py-2 text-xs font-semibold rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 transition-all flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {message && (
          <div className="mt-4 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>{message}</span>
          </div>
        )}
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Account & Profile Attributes */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <UserIcon className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Account Identity</h3>
          </div>

          <dl className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-slate-50">
              <dt className="text-slate-500">Full Name</dt>
              <dd className="font-semibold text-slate-800">{displayName}</dd>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-50">
              <dt className="text-slate-500">Email Address</dt>
              <dd className="font-mono text-slate-800">{displayEmail}</dd>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-50">
              <dt className="text-slate-500">Role in Profile</dt>
              <dd className="font-semibold capitalize text-indigo-600">{role || 'None'}</dd>
            </div>
            <div className="flex items-center justify-between py-1">
              <dt className="text-slate-500">Member Since</dt>
              <dd className="text-slate-700 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{createdAt}</span>
              </dd>
            </div>
          </dl>
        </div>

        {/* Database & RLS Security Status */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <Database className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Database Schema & RLS</h3>
          </div>

          <dl className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-slate-50">
              <dt className="text-slate-500">Target Table</dt>
              <dd className="font-mono font-semibold text-slate-800">public.profiles</dd>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-50">
              <dt className="text-slate-500">Primary Key</dt>
              <dd className="font-mono text-[11px] text-slate-700 truncate max-w-[180px]">
                {user?.id || 'auth.uid()'}
              </dd>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-50">
              <dt className="text-slate-500">Row Level Security</dt>
              <dd className="flex items-center gap-1 text-emerald-600 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Enforced (auth.uid = id)</span>
              </dd>
            </div>
            <div className="flex items-center justify-between py-1">
              <dt className="text-slate-500">Session Provider</dt>
              <dd className="text-indigo-600 font-semibold">Supabase Auth (JWT)</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};
