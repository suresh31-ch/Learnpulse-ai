import React, { useState } from 'react';
import { Bot, Send, Sparkles, Brain, Compass, BookOpen, Layers, Target, RotateCcw, CheckCircle2 } from 'lucide-react';
import { TutorMessage } from '../../types';

interface PulseTutorViewProps {
  initialPrompt?: string;
}

export const PulseTutorView: React.FC<PulseTutorViewProps> = ({ initialPrompt }) => {
  const [mode, setMode] = useState<'socratic' | 'simple' | 'step_by_step' | 'visual' | 'real_world' | 'exam'>('socratic');
  const [inputMessage, setInputMessage] = useState(initialPrompt || '');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<TutorMessage[]>([
    {
      id: 'm1',
      sender: 'tutor',
      text: "Hello Rahul! I've loaded your Class 10A context. I notice you've been working on Quadratic Equations, specifically the discriminant Δ = b² - 4ac. I am in Socratic Mode right now—I will guide you step-by-step with hints so you master the reasoning yourself. What would you like to explore?",
      timestamp: 'Just now',
      suggestedPrompts: [
        'Why does -4ac become positive when c is negative?',
        'Walk me through 2x² - 3x - 5 = 0 step-by-step',
        'How does the discriminant relate to the parabola graph?'
      ]
    }
  ]);

  const modes = [
    { id: 'socratic', label: 'Socratic Mode', desc: 'Guided inquiry & hints' },
    { id: 'simple', label: 'Explain Simply', desc: 'Jargon-free analogy' },
    { id: 'step_by_step', label: 'Step-by-Step', desc: 'Micro-breakdowns' },
    { id: 'visual', label: 'Visual / Graph', desc: 'Curves & axes' },
    { id: 'real_world', label: 'Real-World', desc: 'Physics & trajectories' },
    { id: 'exam', label: 'Exam-Style', desc: 'Board exam mark traps' }
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const message = textToSend || inputMessage;
    if (!message.trim() || loading) return;

    const userMsg: TutorMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: message,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentMessage: message,
          mode,
          topic: 'Quadratic Equations',
          currentConcept: 'Discriminant Calculation (Δ = b² - 4ac)',
          studentMastery: '42% (Critical Gap)'
        })
      });

      const data = await res.json();
      const tutorReply: TutorMessage = {
        id: `t-${Date.now()}`,
        sender: 'tutor',
        text: data.reply || "Let's break this down together. What do you notice when you multiply two negative numbers together?",
        timestamp: 'Just now',
        mode
      };

      setMessages(prev => [...prev, tutorReply]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [
        ...prev,
        {
          id: `t-${Date.now()}`,
          sender: 'tutor',
          text: "Let's examine: in Δ = b² - 4ac, if c = -5 and a = 2, calculate just the part -4 × (2) × (-5). Does that give +40 or -40?",
          timestamp: 'Just now'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Context Awareness Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">Pulse Tutor</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Context-Aware Companion
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Active Context: <span className="text-slate-200 font-semibold">Quadratic Equations</span> • Mastery: <span className="text-rose-400 font-bold">42%</span> • Target Misconception: <span className="text-amber-300 font-medium">Sign Rules in Δ</span>
            </p>
          </div>
        </div>

        <div className="text-right text-xs">
          <span className="text-slate-400">Active Mode:</span>{' '}
          <span className="font-bold text-indigo-400 uppercase tracking-wide">{mode}</span>
        </div>
      </div>

      {/* Mode Selector Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {modes.map(m => (
          <button
            key={m.id}
            id={`tutor-mode-${m.id}`}
            onClick={() => setMode(m.id as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
              mode === m.id
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>{m.label}</span>
          </button>
        ))}
      </div>

      {/* Chat Area */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col h-[520px] overflow-hidden">
        {/* Messages */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map(msg => {
            const isUser = msg.sender === 'user';
            return (
              <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200/60'
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.text}</div>

                  {/* Suggested Quick Prompts */}
                  {msg.suggestedPrompts && (
                    <div className="mt-3 pt-3 border-t border-slate-200/60 space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        Suggested Inquiries:
                      </span>
                      {msg.suggestedPrompts.map((prompt, pIdx) => (
                        <button
                          key={pIdx}
                          onClick={() => handleSendMessage(prompt)}
                          className="w-full text-left text-xs text-indigo-700 hover:text-indigo-900 bg-white/80 hover:bg-white p-2 rounded-lg border border-slate-200 transition-colors font-medium"
                        >
                          → {prompt}
                        </button>
                      ))}
                    </div>
                  )}

                  <span
                    className={`block text-[10px] mt-1.5 text-right ${
                      isUser ? 'text-indigo-200' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 rounded-2xl p-4 rounded-bl-none border border-slate-200/60 text-xs text-slate-500 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" />
                <span>Pulse Tutor is formulating guided reasoning...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center gap-2">
          <input
            id="input-pulse-tutor"
            type="text"
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
            placeholder={`Ask Pulse Tutor in ${mode} mode...`}
            className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-800 placeholder-slate-400"
          />
          <button
            id="btn-send-pulse-tutor"
            disabled={!inputMessage.trim() || loading}
            onClick={() => handleSendMessage()}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
