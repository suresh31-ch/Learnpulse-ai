import React, { useState } from 'react';
import { Bot, Send, Sparkles, Brain, Compass, Layers, Target, CheckCircle2, Lightbulb, ArrowRight } from 'lucide-react';
import { TutorMessage, StudentProfile, LearningGap } from '../../types';

export type TutorModeId = 'socratic' | 'simple' | 'step_by_step' | 'visual' | 'real_world' | 'exam';

export interface TutorModeConfig {
  id: TutorModeId;
  label: string;
  shortDesc: string;
  fullDesc: string;
  icon: React.ElementType;
}

export const TUTOR_MODES: TutorModeConfig[] = [
  {
    id: 'socratic',
    label: 'Socratic Mode',
    shortDesc: 'Guided inquiry & hints',
    fullDesc: 'Guiding through targeted reflective questions and hints so you discover the mathematical reasoning yourself without giving away the answer.',
    icon: Compass
  },
  {
    id: 'simple',
    label: 'Explain Simply',
    shortDesc: 'Jargon-free analogy',
    fullDesc: 'Translating complex formulas into intuitive everyday language, mental models, and clear metaphors without intimidating jargon.',
    icon: Lightbulb
  },
  {
    id: 'step_by_step',
    label: 'Step-by-Step',
    shortDesc: 'Micro-breakdowns',
    fullDesc: 'Deconstructing the problem into clear, numbered linear steps with every single mathematical transition explicitly calculated.',
    icon: Layers
  },
  {
    id: 'visual',
    label: 'Visual / Graph',
    shortDesc: 'Curves & axes',
    fullDesc: 'Providing coordinate intuition, vertex locations, parabola curvature, and visual depictions of where functions intersect axes.',
    icon: Target
  },
  {
    id: 'real_world',
    label: 'Real-World',
    shortDesc: 'Physics & trajectories',
    fullDesc: 'Connecting abstract algebra to tangible real-world phenomena like rocket trajectories, bridge suspension cables, and video game physics.',
    icon: Brain
  },
  {
    id: 'exam',
    label: 'Exam-Style',
    shortDesc: 'Board exam mark traps',
    fullDesc: 'Highlighting standard Board exam marking rubrics, common sign traps that cost marks, and optimal presentation templates.',
    icon: CheckCircle2
  }
];

interface PulseTutorViewProps {
  initialPrompt?: string;
  student?: StudentProfile;
  detectedGaps?: LearningGap[];
}

export const PulseTutorView: React.FC<PulseTutorViewProps> = ({
  initialPrompt,
  student,
  detectedGaps
}) => {
  const [mode, setMode] = useState<TutorModeId>('socratic');
  const [inputMessage, setInputMessage] = useState(initialPrompt || '');
  const [loading, setLoading] = useState(false);

  // Derive dynamic context from active student profile and detected learning gaps
  const studentName = student?.name || 'Aarav Mehta';
  const activeTopic =
    detectedGaps?.[0]?.topicName ||
    student?.primaryGapTopic ||
    student?.topicMastery?.[0]?.topicName ||
    'Quadratic Equations';
  const activeConcept =
    detectedGaps?.[0]?.conceptName ||
    'Discriminant Calculation (Δ = b² - 4ac)';
  const activeMastery =
    detectedGaps?.[0]?.currentMastery ?? student?.overallMastery ?? 42;
  const targetMisconception =
    detectedGaps?.[0]?.confidenceMismatch?.description ||
    student?.misconceptionDetected?.title ||
    'Sign Rules in Formula';

  // Dynamic suggested inquiries generated strictly according to active mode & active gap
  const getSuggestedInquiriesForMode = (targetMode: TutorModeId): string[] => {
    switch (targetMode) {
      case 'socratic':
        return [
          `Can you give me a hint on how to evaluate the signs in ${activeTopic}?`,
          `What prerequisite rule should I check before calculating ${activeConcept}?`,
          `Why does -4ac become positive when c is negative in this equation?`
        ];
      case 'simple':
        return [
          `Explain ${activeTopic} like I'm 10 years old using an everyday analogy.`,
          `Give me a simple mental picture for remembering how ${activeConcept} works.`,
          `Why does multiplying two negative numbers turn positive in plain words?`
        ];
      case 'step_by_step':
        return [
          `Walk me through solving 2x² - 3x - 5 = 0 step-by-step with every line shown.`,
          `What are the exact sequential steps to evaluate ${activeConcept}?`,
          `Show me where students usually make the arithmetic mistake in this calculation.`
        ];
      case 'visual':
        return [
          `How does the parabola y = 2x² - 3x - 5 look when plotted on the coordinate axes?`,
          `What visual effect does Δ > 0 have on the graph's x-intercepts?`,
          `Where does the vertex sit relative to the line of symmetry on the graph?`
        ];
      case 'real_world':
        return [
          `Where is ${activeTopic} applied in video game physics or sports ballistics?`,
          `How do civil engineers use parabolic curves when designing bridges and satellite dishes?`,
          `Give me an example of how quadratic trajectories model rocket motion.`
        ];
      case 'exam':
        return [
          `What is the #1 mark-loss trap in CBSE/Board exams for ${activeTopic}?`,
          `How should I write the final answer to guarantee full marks according to the rubric?`,
          `Show me a typical 3-mark Board exam question on ${activeConcept}.`
        ];
    }
  };

  const getPlaceholderForMode = (targetMode: TutorModeId): string => {
    switch (targetMode) {
      case 'socratic':
        return `Ask a question or share your reasoning in Socratic Mode... (e.g. What should I check first?)`;
      case 'simple':
        return `Ask for a simple explanation or analogy... (e.g. Explain why -4ac becomes positive)`;
      case 'step_by_step':
        return `Ask for step-by-step calculation... (e.g. Walk me through 2x² - 3x - 5 = 0)`;
      case 'visual':
        return `Ask for visual / graph intuition... (e.g. How does the parabola look on axes?)`;
      case 'real_world':
        return `Ask for real-world application... (e.g. Where is this used in physics or gaming?)`;
      case 'exam':
        return `Ask for exam strategy or mark traps... (e.g. What is the #1 Board exam trap?)`;
    }
  };

  const [messages, setMessages] = useState<TutorMessage[]>(() => [
    {
      id: 'm1',
      sender: 'tutor',
      text: `Hello ${studentName}! I have synchronized your learning profile. I see you're working on ${activeTopic}, specifically ${activeConcept} (Current Mastery: ${activeMastery}%).

I am currently in Socratic Mode—I will guide you with targeted questions and hints so you discover the mathematical reasoning yourself without giving away the answer. What would you like to explore?`,
      timestamp: 'Just now',
      mode: 'socratic',
      suggestedPrompts: [
        `Can you give me a hint on how to evaluate the signs in ${activeTopic}?`,
        `What prerequisite rule should I check before calculating ${activeConcept}?`,
        `Why does -4ac become positive when c is negative in this equation?`
      ]
    }
  ]);

  // Handle mode switching with immediate UI feedback and updated state/system message
  const handleSelectMode = (newMode: TutorModeId) => {
    if (newMode === mode) return;
    setMode(newMode);

    const config = TUTOR_MODES.find(m => m.id === newMode) || TUTOR_MODES[0];
    const newInquiries = getSuggestedInquiriesForMode(newMode);

    // Append mode-switch system event storing its actual new mode
    const modeSwitchAnnouncement: TutorMessage = {
      id: `mode-switch-${Date.now()}`,
      sender: 'system',
      isModeSwitch: true,
      text: `Switched to ${config.label}\n${config.fullDesc}`,
      timestamp: 'Just now',
      mode: newMode,
      suggestedPrompts: newInquiries
    };

    setMessages(prev => [...prev, modeSwitchAnnouncement]);
  };

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

    const activeModeAtSend = mode;

    try {
      const res = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentMessage: message,
          mode: activeModeAtSend,
          topic: activeTopic,
          currentConcept: activeConcept,
          studentMastery: `${activeMastery}%`,
          targetMisconception
        })
      });

      const data = await res.json();
      const tutorReply: TutorMessage = {
        id: `t-${Date.now()}`,
        sender: 'tutor',
        text: data.reply || getDeterministicModeFallback(activeModeAtSend, activeTopic, activeConcept),
        timestamp: 'Just now',
        mode: activeModeAtSend,
        suggestedPrompts: getSuggestedInquiriesForMode(activeModeAtSend)
      };

      setMessages(prev => [...prev, tutorReply]);
    } catch (e) {
      console.error('Tutor API fetch error:', e);
      setMessages(prev => [
        ...prev,
        {
          id: `t-${Date.now()}`,
          sender: 'tutor',
          text: getDeterministicModeFallback(activeModeAtSend, activeTopic, activeConcept),
          timestamp: 'Just now',
          mode: activeModeAtSend,
          suggestedPrompts: getSuggestedInquiriesForMode(activeModeAtSend)
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  function getDeterministicModeFallback(currentMode: TutorModeId, topic: string, concept: string): string {
    switch (currentMode) {
      case 'socratic':
        return `In ${topic} (${concept}), let's inspect the signs closely. When evaluating Δ = b² - 4ac, if c is negative (like c = -5) and a = 2, what happens to the sign when you multiply -4 by a positive 'a' and a negative 'c'? Can you trace the multiplication sign first?`;
      case 'simple':
        return `Think of a negative sign like an undo button or a light switch: flipping it once turns the lights off (negative), but flipping it a second time turns them right back on (positive!). In ${concept}, when 'c' is negative, '- 4ac' actually adds a positive bonus to b². That's why 9 - (-40) becomes 9 + 40 = 49!`;
      case 'step_by_step':
        return `Here is the clean 5-step breakdown for ${topic} (${concept}):\n1. Standard Form: a = 2, b = -3, c = -5.\n2. Formula: Δ = b² - 4ac.\n3. Parentheses Substitution: Put brackets around negative terms: (-3)² - 4(2)(-5).\n4. Multiplication: (-3)² = +9, and (-4) × 2 × (-5) = +40.\n5. Addition & Conclusion: Δ = 9 + 40 = 49. Because Δ > 0, the equation yields two distinct real roots.`;
      case 'visual':
        return `Visual Graph Intuition for ${topic}:\nPlotting y = ax² + bx + c on coordinate axes:\n• Because a > 0, the parabola opens upwards like a cup.\n• Because Δ = 49 > 0, the parabola plunges below the horizontal x-axis, slicing through it at exactly TWO distinct x-intercepts (real roots).\n• If Δ were 0, the vertex would touch the axis at exactly ONE point. If Δ < 0, it would float above without touching.`;
      case 'real_world':
        return `Real-World Engineering Application of ${topic}:\nWhen a rocket or basketball is launched, its trajectory follows h(t) = -5t² + vt + h₀.\nEvaluating the discriminant Δ tells physics engines (such as in Unreal Engine or aerospace trajectory planners) whether the projectile will reach a target height or hit the ground at real time coordinates. Engineers also use this for parabolic satellite dishes and suspension bridges!`;
      case 'exam':
        return `Board Exam Alert & Trap Checklist for ${topic} (${concept}):\n1. #1 Mark Loss Trap: 68% of lost marks happen when students write -3² = -9 instead of (-3)² = +9. Always put negative values in brackets!\n2. Standard 3-Mark Scoring Rubric:\n   • 1 Mark: Stating the formula Δ = b² - 4ac.\n   • 1 Mark: Correct substitution with parentheses: (-3)² - 4(a)(c).\n   • 1 Mark: Arithmetic simplification and stating root nature ('Two distinct real roots since Δ > 0').`;
    }
  }

  const activeModeConfig = TUTOR_MODES.find(m => m.id === mode) || TUTOR_MODES[0];
  const activeSuggestedInquiries = getSuggestedInquiriesForMode(mode);

  return (
    <div id="pulse-tutor-view" className="space-y-6 max-w-5xl mx-auto font-sans">
      {/* Dynamic Context Awareness Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Pulse AI Tutor</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Adaptive Intelligence
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  {studentName}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Active Topic: <span className="text-slate-200 font-semibold">{activeTopic}</span> • Concept: <span className="text-indigo-300 font-medium">{activeConcept}</span> • Mastery: <span className={`font-bold ${activeMastery >= 75 ? 'text-emerald-400' : 'text-rose-400'}`}>{activeMastery}%</span>
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-400 block uppercase tracking-wider font-semibold">Active Mode</span>
            <span className="text-xs font-extrabold text-indigo-400 tracking-wide uppercase px-2.5 py-1 rounded-lg bg-indigo-950/80 border border-indigo-800/80 inline-block mt-0.5">
              {activeModeConfig.label}
            </span>
          </div>
        </div>

        {/* Current Mode Focus Explanation */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-start gap-2 text-xs text-slate-300">
          <activeModeConfig.icon className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed text-slate-300">
            <strong className="text-white">{activeModeConfig.label} Focus:</strong> {activeModeConfig.fullDesc}
          </p>
        </div>
      </div>

      {/* 6 Reactive Mode Selector Chips */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Select Pedagogical Mode:
          </span>
          <span className="text-[11px] text-slate-500">
            Click any mode to immediately alter tutor reasoning, inquiries & context
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {TUTOR_MODES.map(m => {
            const Icon = m.icon;
            const isSelected = mode === m.id;
            return (
              <button
                key={m.id}
                id={`tutor-mode-${m.id}`}
                onClick={() => handleSelectMode(m.id)}
                className={`p-2.5 rounded-xl text-left transition-all border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-200'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-indigo-600'}`} />
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                </div>
                <div>
                  <span className={`text-xs font-bold block ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                    {m.label}
                  </span>
                  <span className={`text-[10px] block truncate ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                    {m.shortDesc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col h-[580px] overflow-hidden">
        {/* Messages Container */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map(msg => {
            // Mode switch system event card
            if (msg.sender === 'system' || msg.isModeSwitch) {
              const msgModeConfig = TUTOR_MODES.find(m => m.id === msg.mode) || activeModeConfig;
              const Icon = msgModeConfig.icon;
              return (
                <div key={msg.id} className="my-3 flex justify-center">
                  <div className="w-full max-w-2xl rounded-xl bg-slate-50 border border-slate-200 p-3.5 shadow-2xs">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-200/70 pb-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-md bg-indigo-600 text-white flex items-center justify-center">
                          <Icon className="w-3 h-3" />
                        </div>
                        <span className="text-xs font-bold text-slate-800">
                          Switched to {msgModeConfig.label} Mode
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                          Active
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line mb-3">
                      {msg.text.replace(/^Switched to .*\n/, '')}
                    </p>

                    {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                      <div className="pt-2.5 border-t border-slate-200/70">
                        <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-indigo-600" />
                          <span>Suggested Inquiries ({msgModeConfig.label}):</span>
                        </span>
                        <div className="space-y-1.5">
                          {msg.suggestedPrompts.map((prompt, pIdx) => (
                            <button
                              key={pIdx}
                              onClick={() => handleSendMessage(prompt)}
                              className="w-full text-left text-xs text-indigo-700 hover:text-indigo-950 bg-white hover:bg-indigo-50/80 p-2.5 rounded-lg border border-slate-200 hover:border-indigo-300 transition-all font-medium flex items-center justify-between group shadow-2xs"
                            >
                              <span>→ {prompt}</span>
                              <Send className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            }

            const isUser = msg.sender === 'user';
            const msgModeConfig = msg.mode ? TUTOR_MODES.find(m => m.id === msg.mode) : null;

            return (
              <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-br-none shadow-sm'
                      : 'bg-slate-50 text-slate-800 rounded-bl-none border border-slate-200/80'
                  }`}
                >
                  {/* Tutor header with mode badge */}
                  {!isUser && (
                    <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-200/70">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                        <Bot className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Pulse Tutor</span>
                      </div>
                      {msgModeConfig && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                          {msgModeConfig.label}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="whitespace-pre-line">{msg.text}</div>

                  {/* Suggested Inquiries inside message, strictly labeled with that message's mode */}
                  {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                    <div className="mt-3.5 pt-3 border-t border-slate-200/70 space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-indigo-600" />
                        <span>Suggested Inquiries ({msgModeConfig?.label || activeModeConfig.label}):</span>
                      </span>
                      <div className="space-y-1">
                        {msg.suggestedPrompts.map((prompt, pIdx) => (
                          <button
                            key={pIdx}
                            onClick={() => handleSendMessage(prompt)}
                            className="w-full text-left text-xs text-indigo-700 hover:text-indigo-900 bg-white hover:bg-indigo-50/60 p-2 rounded-lg border border-slate-200 hover:border-indigo-300 transition-colors font-medium flex items-center justify-between group"
                          >
                            <span>→ {prompt}</span>
                            <Send className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
                          </button>
                        ))}
                      </div>
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
              <div className="bg-slate-100 rounded-2xl p-4 rounded-bl-none border border-slate-200/60 text-xs text-slate-600 flex items-center gap-2 shadow-xs">
                <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" />
                <span>Pulse Tutor is formulating guided reasoning in {activeModeConfig.label}...</span>
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Quick Prompt Bar strictly matched to active mode */}
        <div className="px-4 py-2.5 bg-indigo-50/70 border-t border-slate-200 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-bold text-indigo-900 whitespace-nowrap flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Suggested Inquiries ({activeModeConfig.label}):
          </span>
          {activeSuggestedInquiries.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="text-[11px] font-medium text-indigo-800 bg-white hover:bg-indigo-100 px-3 py-1 rounded-full border border-indigo-200 whitespace-nowrap transition-colors shadow-2xs flex items-center gap-1"
            >
              <span>{q}</span>
              <ArrowRight className="w-2.5 h-2.5 text-indigo-500" />
            </button>
          ))}
        </div>

        {/* Input Bar with dynamic mode placeholder */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center gap-2">
          <input
            id="input-pulse-tutor"
            type="text"
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
            placeholder={getPlaceholderForMode(mode)}
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
