import React, { useState } from 'react';
import { Search, Filter, ArrowUpDown, ChevronRight, Sparkles, User, AlertTriangle, ArrowRight } from 'lucide-react';
import { STUDENTS_SEED } from '../../data/seedData';
import { StudentProfile } from '../../types';
import { MasteryBadge, RiskBadge, TrendBadge, DemoDataBadge } from '../shared/StatusBadge';
import { StudentIntelligenceModal } from './StudentIntelligenceModal';

interface StudentsTableViewProps {
  onSelectStudent?: (student: StudentProfile) => void;
  onGenerateRecovery?: (student: StudentProfile) => void;
}

export const StudentsTableView: React.FC<StudentsTableViewProps> = ({
  onSelectStudent,
  onGenerateRecovery
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);

  const filteredStudents = STUDENTS_SEED.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.primaryGapTopic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = 
      riskFilter === 'all' || 
      (riskFilter === 'high' && (s.riskLevel === 'critical' || s.riskLevel === 'elevated')) ||
      (riskFilter === 'medium' && s.riskLevel === 'watch') ||
      (riskFilter === 'low' && s.riskLevel === 'low');
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="space-y-6">
      {/* Table Controls & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">Student Learning Intelligence Roster</h2>
            <DemoDataBadge />
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            LearnPulse Demo Academy • Class 10A ({STUDENTS_SEED.length} Fictional Demo Students)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search student, roll, or gap..."
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800 placeholder-slate-400 w-56 sm:w-64"
            />
          </div>

          {/* Risk Level Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setRiskFilter('all')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                riskFilter === 'all' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All ({STUDENTS_SEED.length})
            </button>
            <button
              onClick={() => setRiskFilter('high')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                riskFilter === 'high' ? 'bg-rose-500 text-white shadow-xs' : 'text-rose-600 hover:bg-rose-50'
              }`}
            >
              High Risk
            </button>
            <button
              onClick={() => setRiskFilter('medium')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                riskFilter === 'medium' ? 'bg-amber-500 text-white shadow-xs' : 'text-amber-600 hover:bg-amber-50'
              }`}
            >
              Watch
            </button>
            <button
              onClick={() => setRiskFilter('low')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                riskFilter === 'low' ? 'bg-emerald-500 text-white shadow-xs' : 'text-emerald-600 hover:bg-emerald-50'
              }`}
            >
              Stable
            </button>
          </div>
        </div>
      </div>

      {/* Roster Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-3.5">Student</th>
                <th className="px-4 py-3.5">Mastery</th>
                <th className="px-4 py-3.5">Risk Signal</th>
                <th className="px-4 py-3.5">Trend</th>
                <th className="px-6 py-3.5">Primary Gap</th>
                <th className="px-4 py-3.5">Last Check</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredStudents.map(student => (
                <tr
                  key={student.id}
                  id={`student-row-${student.id}`}
                  onClick={() => {
                    setSelectedStudent(student);
                    onSelectStudent?.(student);
                  }}
                  className="hover:bg-indigo-50/40 cursor-pointer transition-colors group"
                >
                  {/* Student */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={student.avatarUrl}
                        alt={student.name}
                        className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors block">
                          {student.name}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {student.rollNumber} • {student.className}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Mastery */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-800 text-sm">
                        {student.overallMastery}%
                      </span>
                      <MasteryBadge level={student.overallMastery} />
                    </div>
                  </td>

                  {/* Risk */}
                  <td className="px-4 py-4">
                    <RiskBadge risk={student.riskLevel} />
                  </td>

                  {/* Trend */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5">
                      <span className={`font-extrabold ${student.trendDelta < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {student.trendDelta > 0 ? `+${student.trendDelta}%` : `${student.trendDelta}%`}
                      </span>
                      <TrendBadge trend={student.trend} />
                    </div>
                  </td>

                  {/* Primary Gap */}
                  <td className="px-6 py-4">
                    <div>
                      <span className="font-semibold text-slate-800 block">
                        {student.primaryGapTopic}
                      </span>
                      {student.misconceptionDetected && (
                        <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 inline-block mt-0.5">
                          {student.misconceptionDetected.title}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Last Check */}
                  <td className="px-4 py-4 text-slate-500 text-[11px]">
                    {student.lastAssessmentDate}
                  </td>

                  {/* Recommended Action */}
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedStudent(student);
                      }}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-700 text-xs font-semibold rounded-lg transition-all inline-flex items-center gap-1"
                    >
                      <span>Inspect</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Intelligence Profile Modal */}
      <StudentIntelligenceModal
        student={selectedStudent}
        isOpen={Boolean(selectedStudent)}
        onClose={() => setSelectedStudent(null)}
        onGenerateRecoveryPlan={(student) => {
          onGenerateRecovery?.(student);
        }}
      />
    </div>
  );
};
