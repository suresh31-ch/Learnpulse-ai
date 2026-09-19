import React, { useState, useEffect } from 'react';
import {
  Building2,
  Users,
  GraduationCap,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Layers,
  ChevronRight,
  ShieldCheck,
  Zap,
  ArrowRight,
  Settings as SettingsIcon,
  Shield,
  FileText,
  Sliders
} from 'lucide-react';
import { ADMIN_ANALYTICS_SEED } from '../../data/seedData';
import { MasteryBadge, DemoDataBadge } from '../shared/StatusBadge';

interface AdminDashboardProps {
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  activeTab: propTab = 'dashboard',
  onSelectTab
}) => {
  const data = ADMIN_ANALYTICS_SEED;
  const [selectedTab, setSelectedTab] = useState(propTab);

  useEffect(() => {
    if (propTab) setSelectedTab(propTab);
  }, [propTab]);

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
    onSelectTab?.(tab);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {data.institutionName}
            </h1>
            <DemoDataBadge />
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
              District Macro Intelligence
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Systemic multi-school gap detection, teacher adoption analytics, and curriculum efficacy.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="font-semibold text-slate-500">Live Sync:</span>
          <span className="font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            4 Campuses Reporting
          </span>
        </div>
      </div>

      {/* Admin Tab Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 overflow-x-auto text-xs font-bold">
        {[
          { id: 'dashboard', label: 'Macro Overview', icon: Building2 },
          { id: 'institutions', label: 'Campuses (4)', icon: Layers },
          { id: 'users', label: 'Users & Adoption', icon: Users },
          { id: 'analytics', label: 'Curriculum Gaps', icon: AlertTriangle },
          { id: 'settings', label: 'District Governance', icon: SettingsIcon }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = selectedTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 6 Macro High-Level KPI Cards (Visible in Dashboard & Analytics) */}
      {(selectedTab === 'dashboard' || selectedTab === 'analytics') && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Schools</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{data.totalSchools}</div>
            <span className="text-[11px] text-slate-400">Delhi-NCR Cluster</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Total Students</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{data.totalStudents.toLocaleString()}</div>
            <span className="text-[11px] text-slate-400">Active enrollments</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Faculty Count</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{data.totalTeachers}</div>
            <span className="text-[11px] text-emerald-600 font-semibold">{data.dailyActiveTeachers} active daily</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">District Mastery</span>
            <div className="text-2xl font-extrabold text-indigo-600 mt-1">{data.averageMastery}%</div>
            <span className="text-[11px] text-slate-400">Mean academic score</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-rose-100 bg-rose-50/20 shadow-xs">
            <span className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider block">Gaps Detected</span>
            <div className="text-2xl font-extrabold text-rose-600 mt-1">{data.gapsDetected}</div>
            <span className="text-[11px] text-rose-600/80">Concept-level friction</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-emerald-100 bg-emerald-50/20 shadow-xs">
            <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider block">Recovery Efficacy</span>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">{data.interventionSuccessRate}%</div>
            <span className="text-[11px] text-emerald-600/80 font-semibold">{data.activeInterventions} active plans</span>
          </div>
        </div>
      )}

      {/* Systemic Gaps Across Campuses (Visible in Dashboard & Analytics) */}
      {(selectedTab === 'dashboard' || selectedTab === 'analytics') && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <h2 className="text-base font-bold text-slate-900">Systemic Multi-School Curriculum Gaps</h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Identifies bottlenecks that span multiple independent campuses, signaling potential curriculum pacing or pedagogical material friction.
              </p>
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              Cross-School Pattern
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.systemicGaps.map((gap, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200/80 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{gap.topic}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                    {gap.schoolsAffected} of 4 Campuses
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{gap.commonBottleneck}</p>
                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Total impacted:</span>
                  <span className="font-bold text-rose-700">{gap.totalStudentsImpacted} students</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* School-by-School Benchmark Breakdown (Dashboard & Institutions) */}
      {(selectedTab === 'dashboard' || selectedTab === 'institutions') && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-6 pb-4 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Campus Benchmark Comparison</h3>
            <p className="text-xs text-slate-500">Comparative formative indicators across the 4 member institutions.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-3.5">Campus Name</th>
                  <th className="px-4 py-3.5">Students</th>
                  <th className="px-4 py-3.5">Avg Mastery</th>
                  <th className="px-4 py-3.5">Active Gaps</th>
                  <th className="px-4 py-3.5">Intervention Rate</th>
                  <th className="px-6 py-3.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {data.schools.map((school) => (
                  <tr key={school.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{school.name}</td>
                    <td className="px-4 py-4 text-slate-700">{school.studentsCount}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900">{school.avgMastery}%</span>
                        <MasteryBadge level={school.avgMastery} />
                      </div>
                    </td>
                    <td className="px-4 py-4 text-rose-600 font-semibold">{school.gapsDetected}</td>
                    <td className="px-4 py-4 text-emerald-600 font-bold">{school.recoveryEfficacy}%</td>
                    <td className="px-6 py-4 text-right">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200">
                        Healthy Sync
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users & Adoption Tab */}
      {selectedTab === 'users' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Faculty Adoption</h3>
            <div className="text-3xl font-extrabold text-slate-900">{data.dailyActiveTeachers} / {data.totalTeachers}</div>
            <p className="text-xs text-slate-500">
              88% of teachers actively generate interventions or log pre-class diagnoses weekly.
            </p>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div className="bg-indigo-600 h-full rounded-full" style={{ width: '88%' }} />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Student Daily Recovery</h3>
            <div className="text-3xl font-extrabold text-emerald-600">82.4%</div>
            <p className="text-xs text-slate-500">
              Percentage of assigned recovery missions completed within 48 hours of detection.
            </p>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '82.4%' }} />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Parent Engagement</h3>
            <div className="text-3xl font-extrabold text-indigo-600">71.2%</div>
            <p className="text-xs text-slate-500">
              Parents accessing AI progress briefings and conversation guides bi-weekly.
            </p>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div className="bg-indigo-500 h-full rounded-full" style={{ width: '71.2%' }} />
            </div>
          </div>
        </div>
      )}

      {/* District Governance & Settings Tab */}
      {selectedTab === 'settings' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">District Policy & Curriculum Standards</h3>
            <p className="text-xs text-slate-500 mt-1">
              Cluster-wide academic thresholds, curriculum frameworks, and RLS security enforcement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <span className="text-xs font-bold text-slate-900 block">Curriculum Alignment</span>
              <p className="text-xs text-slate-600">Active standard: CBSE Mathematics Class 10 (2025-2026 syllabus)</p>
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                Aligned to NCERT + Bloom's Taxonomy
              </span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <span className="text-xs font-bold text-slate-900 block">Supabase Row-Level Security</span>
              <p className="text-xs text-slate-600">Enforcing strict tenant isolation between campuses and student profiles.</p>
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                RLS Status: Strict / Active
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
