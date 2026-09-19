import React from 'react';
import { UserRole } from '../../types';
import {
  Home,
  BookOpen,
  Dumbbell,
  LineChart,
  User,
  Users,
  ShieldCheck,
  Brain,
  HeartHandshake,
  Bell,
  Building2,
  Settings,
  Shield,
  Clock,
  Target,
  AlertTriangle,
  Zap,
  CheckCircle2,
  Flame,
  Layers,
  HelpCircle,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  currentRole: UserRole;
  activeNav?: string;
  activeTab?: string;
  onSelectNav?: (navId: string) => void;
  onTabChange?: (tabId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRole,
  activeNav,
  activeTab,
  onSelectNav,
  onTabChange,
}) => {
  const currentActive = activeNav || activeTab || 'home';

  const handleSelect = (id: string) => {
    if (onSelectNav) onSelectNav(id);
    if (onTabChange) onTabChange(id);
  };

  const getNavItems = () => {
    switch (currentRole) {
      case 'student':
        return [
          { id: 'home', label: 'Dashboard', icon: Home },
          { id: 'gaps', label: 'Learning Gaps', icon: AlertTriangle },
          { id: 'preview', label: 'Pre-Class Preview', icon: Clock },
          { id: 'check', label: 'Understanding Check', icon: CheckCircle2 },
          { id: 'learn', label: 'Knowledge Map', icon: BookOpen },
          { id: 'practice', label: 'Adaptive Practice', icon: Dumbbell },
          { id: 'recovery', label: 'Recovery Mission', icon: Zap },
          { id: 'tutor', label: 'Pulse AI Tutor', icon: Brain, badge: 'Socratic' },
          { id: 'insights', label: 'Insights & PDF', icon: LineChart },
          { id: 'profile', label: 'Profile', icon: User },
        ];

      case 'teacher':
        return [
          { id: 'dashboard', label: 'Command Center', icon: Home },
          { id: 'students', label: 'Students Roster', icon: Users },
          { id: 'analytics', label: 'Topic Intelligence', icon: LineChart },
          { id: 'risk_radar', label: 'Risk Radar', icon: AlertTriangle },
          { id: 'misconception_lab', label: 'Misconception Lab', icon: Layers },
          { id: 'pre_class_intelligence', label: 'Pre-Class Intel', icon: Clock },
          { id: 'interventions', label: 'Interventions', icon: Target },
          { id: 'ai_question_generator', label: 'Question Studio', icon: HelpCircle },
          { id: 'ai', label: 'AI Co-Pilot', icon: Brain, badge: 'Signature' },
        ];

      case 'parent':
        return [
          { id: 'overview', label: 'Overview', icon: Home },
          { id: 'progress', label: 'Progress', icon: LineChart },
          { id: 'support', label: 'Support', icon: HeartHandshake },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'profile', label: 'Profile', icon: User },
        ];

      case 'admin':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: Home },
          { id: 'institutions', label: 'Institutions', icon: Building2 },
          { id: 'users', label: 'Users', icon: Users },
          { id: 'analytics', label: 'Analytics', icon: LineChart },
          { id: 'settings', label: 'Settings', icon: Settings },
        ];

      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <aside
      id="app-sidebar"
      className="w-64 shrink-0 hidden lg:block bg-slate-900 text-slate-300 border-r border-slate-800 min-h-[calc(100vh-4rem)] p-4"
    >
      {/* Current Verified Role Indicator */}
      <div className="mb-4 px-3 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 shadow-xs">
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
          Verified Workspace
        </span>
        <div className="text-xs font-bold text-white capitalize mt-0.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
            <span>{currentRole} Workspace</span>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-500/20" />
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentActive === item.id;

          return (
            <button
              key={item.id}
              id={`sidebar-nav-${item.id}`}
              onClick={() => handleSelect(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                    isActive
                      ? 'bg-indigo-700 text-white'
                      : 'bg-slate-800 text-indigo-300 border border-indigo-500/20'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer System Status */}
      <div className="mt-8 pt-4 border-t border-slate-800/80 px-3 text-[11px] text-slate-500 space-y-1.5">
        <div className="flex items-center justify-between">
          <span>Security Layer</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Supabase RLS
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Role Isolation</span>
          <span className="text-indigo-400 font-medium capitalize">{currentRole}</span>
        </div>
      </div>
    </aside>
  );
};
