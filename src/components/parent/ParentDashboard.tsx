import React, { useState } from 'react';
import {
  Heart,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Home,
  Calendar,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Send,
  Check,
  RotateCcw,
  Loader2
} from 'lucide-react';
import { PARENT_STUDENT_INFO, DEMO_METADATA } from '../../data/seedData';
import { MasteryBadge, DemoDataBadge } from '../shared/StatusBadge';

export const ParentDashboard: React.FC = () => {
  const data = PARENT_STUDENT_INFO;
  const [messageOpen, setMessageOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [sent, setSent] = useState(false);

  // AI Weekly Summary
  const [aiBriefing, setAiBriefing] = useState<string>(
    `Rahul has shown fantastic dedication in algebra and coordinate geometry this month! He's working comfortably with foundational equations and showing steady confidence.\n\nIn our current unit on Quadratic Equations, Rahul is doing great setting up problems, but occasionally gets tripped up when multiplying negative numbers in the discriminant formula (Δ = b² - 4ac). A fun question you can ask him this week: 'Can you show me why multiplying two negative numbers flips into a positive?' Celebrating small milestones at home makes all the difference!`
  );
  const [aiLoading, setAiLoading] = useState(false);
  const [isLiveAI, setIsLiveAI] = useState<boolean | null>(null);

  const handleGenerateAiBriefing = async () => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/parent-briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childName: data.childName,
          mastery: 76,
          primaryGap: data.needsSupport[0]?.topic || 'Quadratic Equations (Sign error)',
          strengths: data.strengths.map(s => s.topic),
          teacherName: data.teacherName
        })
      });
      const resData = await res.json();
      if (resData.briefing) {
        setAiBriefing(resData.briefing);
        setIsLiveAI(resData.isLiveAI);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    setSent(true);
    setTimeout(() => {
      setMessageText('');
      setMessageOpen(false);
      setSent(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Warm, Supportive Parent Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80"
              alt={data.childName}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-400"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-white">{data.childName}'s Learning Journey</h1>
                <DemoDataBadge />
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                  {data.className}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-indigo-200 mt-1">
                {DEMO_METADATA.institutionName} • Parent: <span className="font-semibold text-white">{data.parentName}</span> • Educator: <span className="text-white font-semibold">{data.teacherName}</span>
              </p>
            </div>
          </div>

          <button
            id="btn-parent-message-teacher"
            onClick={() => setMessageOpen(true)}
            className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
          >
            <MessageSquare className="w-4 h-4 text-indigo-600" />
            <span>Message {data.teacherName}</span>
          </button>
        </div>

        {/* Supportive Status Callout */}
        <div className="mt-6 p-4 rounded-2xl bg-indigo-950/60 border border-indigo-800/60 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
            <Heart className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Supportive Journey Status
            </h4>
            <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed mt-0.5 font-medium">
              "{data.summaryNotice}"
            </p>
          </div>
        </div>
      </div>

      {/* AI Plain-English Weekly Synthesis for Parents */}
      <div className="bg-gradient-to-br from-indigo-50/90 via-white to-violet-50/50 rounded-2xl border border-indigo-200/80 p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-indigo-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">AI Plain-Language Progress Briefing</h3>
                {isLiveAI && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Live Gemini AI
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                A warm, jargon-free summary translating diagnostic data into supportive home conversations.
              </p>
            </div>
          </div>

          <button
            id="btn-regenerate-parent-briefing"
            onClick={handleGenerateAiBriefing}
            disabled={aiLoading}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
          >
            {aiLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Synthesizing...</span>
              </>
            ) : (
              <>
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Refresh AI Briefing</span>
              </>
            )}
          </button>
        </div>

        <div className="p-4 rounded-xl bg-white border border-indigo-100/80 shadow-xs">
          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line font-normal">
            {aiBriefing}
          </div>
        </div>
      </div>

      {/* 2 Main Columns: Strengths & Support Needed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* What your child knows well */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900">What {data.childName} Knows Well</h2>
              <p className="text-xs text-slate-500">Solid foundations built through regular practice.</p>
            </div>
          </div>

          <div className="space-y-3">
            {data.strengths.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-emerald-50/40 border border-emerald-200/70 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">{item.topic}</span>
                  <span className="text-[11px] text-emerald-800 font-medium">{item.note}</span>
                </div>
                <MasteryBadge level={item.mastery} showPercent />
              </div>
            ))}
          </div>
        </div>

        {/* Where support is needed */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900">Where Support is Needed</h2>
              <p className="text-xs text-slate-500">Expressed in plain language without intimidating jargon.</p>
            </div>
          </div>

          <div className="space-y-3">
            {data.needsSupport.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{item.topic}</span>
                  <MasteryBadge level={item.mastery} showPercent />
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-normal">
                  "{item.plainLanguageExplanation}"
                </p>
                <div className="pt-2 border-t border-amber-200/60 text-[11px] text-amber-900 font-medium">
                  <strong>School action:</strong> {item.schoolAction}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2 Practical Columns: Home Support Actions & Upcoming Milestones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Practical Things to Do at Home */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Home className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">Practical Support Actions at Home</h3>
              <p className="text-xs text-slate-500">Simple ways to encourage progress without needing to be a math expert.</p>
            </div>
          </div>

          <div className="space-y-3">
            {data.practicalHomeActions.map((action, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{action.title}</h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{action.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Milestones */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Calendar className="w-5 h-5 text-slate-700" />
            <div>
              <h3 className="text-base font-bold text-slate-900">Upcoming Assessments & Milestones</h3>
              <p className="text-xs text-slate-500">Scheduled classroom checks for Rahul's section.</p>
            </div>
          </div>

          <div className="space-y-3">
            {data.upcomingAssessments.map((a, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">{a.title}</span>
                  <span className="text-[11px] text-indigo-600 font-semibold">{a.focusTopic}</span>
                </div>
                <span className="text-xs font-bold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                  {a.date}
                </span>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-900">
            <strong>Parent-Teacher Partnership:</strong> All recommendations are synchronized with Dr. Sharma's classroom telemetry.
          </div>
        </div>
      </div>

      {/* Message Modal */}
      {messageOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Message {data.teacherName}</h3>
              <button onClick={() => setMessageOpen(false)} className="text-slate-400 hover:text-slate-700 text-xs">
                Cancel
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Inquire directly about Rahul's quadratic equation recovery or coordinate on homework habits.
            </p>

            <textarea
              rows={4}
              value={messageText}
              onChange={e => setMessageText(e.target.value)}
              placeholder="Hi Dr. Sharma, I saw the note about negative signs in quadratic equations. How can we best support Rahul this week?..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-800"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setMessageOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Close
              </button>
              <button
                disabled={!messageText.trim() || sent}
                onClick={handleSendMessage}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
              >
                {sent ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Message Sent!</span>
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
