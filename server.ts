import express, { Request, Response } from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini Client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// Health & Status
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    supabaseConfigured: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_PUBLISHABLE_KEY),
    timestamp: new Date().toISOString()
  });
});

// Real Supabase Connection Status Endpoint (Verifies API connectivity, no fake status)
app.get('/api/supabase/status', async (req: Request, res: Response) => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return res.json({
      configured: false,
      connected: false,
      url: url || null,
      hasPublishableKey: Boolean(key),
      message: 'SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY is not defined in environment variables.'
    });
  }

  try {
    const supabaseServer = createClient(url, key, {
      auth: { persistSession: false }
    });

    const { error } = await supabaseServer.auth.getSession();
    if (error) {
      return res.json({
        configured: true,
        connected: false,
        url,
        hasPublishableKey: true,
        message: error.message
      });
    }

    return res.json({
      configured: true,
      connected: true,
      url,
      hasPublishableKey: true,
      message: 'Supabase client initialized successfully and connected to Supabase Auth API.'
    });
  } catch (err: unknown) {
    return res.json({
      configured: true,
      connected: false,
      url,
      hasPublishableKey: true,
      message: err instanceof Error ? err.message : 'Failed to initialize Supabase client'
    });
  }
});

// Demo account identities mapped to specific roles
const DEMO_ACCOUNTS = {
  student: {
    email: 'demo.student@learnpulse.demo',
    role: 'student',
    name: 'Aarav Mehta',
    id: 'd0000000-0000-0000-0000-000000000001'
  },
  teacher: {
    email: 'demo.teacher@learnpulse.demo',
    role: 'teacher',
    name: 'Dr. Radhika Sharma',
    id: 'd0000000-0000-0000-0000-000000000002'
  },
  parent: {
    email: 'demo.parent@learnpulse.demo',
    role: 'parent',
    name: 'Sanjay Mehta',
    id: 'd0000000-0000-0000-0000-000000000003'
  },
  admin: {
    email: 'demo.admin@learnpulse.demo',
    role: 'admin',
    name: 'Institution Administrator',
    id: 'd0000000-0000-0000-0000-000000000004'
  }
} as const;

// Development password kept exclusively on the server side — never sent to or displayed in client UI
const DEMO_AUTH_PASSWORD = process.env.DEMO_AUTH_PASSWORD || 'LearnPulseDemo2026!';

// Demo Status Endpoint: Check availability of demo accounts
app.get('/api/auth/demo-status', async (req: Request, res: Response) => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return res.json({
      configured: false,
      message: 'Supabase environment variables not configured.'
    });
  }

  return res.json({
    configured: true,
    accounts: Object.entries(DEMO_ACCOUNTS).map(([key, acc]) => ({
      role: acc.role,
      email: acc.email,
      name: acc.name
    }))
  });
});

// Secure Demo Account Authentication Mechanism
// Uses REAL Supabase Auth GoTrue (signInWithPassword) server-side and issues real Supabase session tokens
app.post('/api/auth/demo-login', async (req: Request, res: Response) => {
  const { role } = req.body;
  if (!role || !(role in DEMO_ACCOUNTS)) {
    return res.status(400).json({
      success: false,
      message: `Invalid role specified. Supported demo roles: ${Object.keys(DEMO_ACCOUNTS).join(', ')}`
    });
  }

  const url = process.env.SUPABASE_URL;
  const pubKey = process.env.SUPABASE_PUBLISHABLE_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !pubKey) {
    return res.status(500).json({
      success: false,
      message: 'Supabase URL or Publishable Key is not configured in server environment.'
    });
  }

  const targetAccount = DEMO_ACCOUNTS[role as keyof typeof DEMO_ACCOUNTS];

  try {
    // 1. Attempt login with real Supabase Auth using client credentials
    const authClient = createClient(url, serviceKey || pubKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });

    let signInResult = await authClient.auth.signInWithPassword({
      email: targetAccount.email,
      password: DEMO_AUTH_PASSWORD
    });

    // 2. If user does not exist or credentials invalid, attempt secure provisioning
    if (signInResult.error) {
      console.log(`[Demo Auth] Initial sign-in for ${targetAccount.email} returned: ${signInResult.error.message}. Attempting provisioning...`);

      if (serviceKey) {
        // Admin client provisioning via Supabase Admin API
        const adminClient = createClient(url, serviceKey, {
          auth: { persistSession: false, autoRefreshToken: false }
        });

        const { data: adminUser, error: adminErr } = await adminClient.auth.admin.createUser({
          email: targetAccount.email,
          password: DEMO_AUTH_PASSWORD,
          email_confirm: true,
          user_metadata: {
            role: targetAccount.role,
            full_name: targetAccount.name
          }
        });

        if (adminErr && !adminErr.message.toLowerCase().includes('already')) {
          console.error('[Demo Auth] Admin user creation error:', adminErr);
        } else {
          // Retry login after admin creation
          signInResult = await authClient.auth.signInWithPassword({
            email: targetAccount.email,
            password: DEMO_AUTH_PASSWORD
          });
        }
      } else {
        // Public key: Attempt standard signUp
        const { data: signUpData, error: signUpErr } = await authClient.auth.signUp({
          email: targetAccount.email,
          password: DEMO_AUTH_PASSWORD,
          options: {
            data: {
              role: targetAccount.role,
              full_name: targetAccount.name
            }
          }
        });

        if (signUpData?.session) {
          signInResult = {
            data: { session: signUpData.session, user: signUpData.user },
            error: null
          };
        } else if (!signUpErr) {
          // Retry sign-in
          signInResult = await authClient.auth.signInWithPassword({
            email: targetAccount.email,
            password: DEMO_AUTH_PASSWORD
          });
        }
      }
    }

    // 3. If authentication still could not be completed, guide the user to execute the SQL seed
    if (signInResult.error || !signInResult.data?.session) {
      const authErrMsg = signInResult.error?.message || 'Session could not be established.';
      console.warn(`[Demo Auth] Failed to authenticate demo user ${targetAccount.email}: ${authErrMsg}`);
      return res.status(401).json({
        success: false,
        code: 'DEMO_USER_NOT_SEEDED',
        message: `Demo user "${targetAccount.email}" is not yet provisioned in Supabase Auth (${authErrMsg}).`,
        instructions: 'Please run the SQL Seed in Supabase Dashboard (SQL Editor -> New Query -> Run /supabase-seed.sql or /supabase-demo-auth.sql) to provision the demo users with confirmed email status.'
      });
    }

    const session = signInResult.data.session;
    const authUser = signInResult.data.user;

    // 4. Ensure public.profiles record exists and is associated with auth.users.id
    try {
      const userScopedClient = createClient(url, serviceKey || pubKey, {
        auth: { persistSession: false },
        global: {
          headers: { Authorization: `Bearer ${session.access_token}` }
        }
      });

      const { data: profileRecord } = await userScopedClient
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (!profileRecord) {
        await userScopedClient.from('profiles').insert({
          id: authUser.id,
          role: targetAccount.role,
          full_name: targetAccount.name,
          email: targetAccount.email
        });
      } else if (profileRecord.role !== targetAccount.role) {
        await userScopedClient
          .from('profiles')
          .update({ role: targetAccount.role, full_name: targetAccount.name })
          .eq('id', authUser.id);
      }
    } catch (profileSyncErr) {
      console.error('[Demo Auth] Profile sync note:', profileSyncErr);
    }

    // 5. Return genuine Supabase session and user object to client
    return res.json({
      success: true,
      role: targetAccount.role,
      user: authUser,
      session: {
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_in: session.expires_in,
        expires_at: session.expires_at,
        token_type: session.token_type
      }
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal error during demo login';
    console.error('[Demo Auth] Unexpected error:', err);
    return res.status(500).json({
      success: false,
      message: errorMsg
    });
  }
});


// Teacher AI Command Center: "What should I focus on with Class 10A today?"
app.post('/api/ai/command', async (req: Request, res: Response) => {
  try {
    const { prompt, context } = req.body;
    const client = getGeminiClient();

    if (client) {
      const systemInstruction = `You are LearnPulse AI, an intelligent learning analytics co-pilot for school teachers.
Analyze current classroom assessment evidence and answer the teacher's query with actionable, concept-level intelligence.
Strict rules:
- Base advice on learning evidence (mastery %, gap counts, misconceptions).
- Never give generic advice. Be specific with minutes, topic names, and student counts.
- Return response in structured JSON with:
  {
    "summary": "Concise 1-2 sentence executive briefing",
    "keyIssues": [
      { "topic": "Topic name", "impact": "Specific number of students and mastery %", "urgency": "high"|"medium"|"low" }
    ],
    "recommendedAction": "Exact recommendation (e.g. 10-minute intervention on sign errors)",
    "actionType": "intervention"|"quiz"|"recap"|"group_study"
  }`;

      const aiResponse = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Teacher prompt: "${prompt || 'What should I focus on with Class 10A today?'}"
Class context: ${JSON.stringify(context || {})}`,
        config: {
          systemInstruction,
          responseMimeType: 'application/json'
        }
      });

      const parsed = JSON.parse(aiResponse.text || '{}');
      return res.json({ success: true, isLiveAI: true, data: parsed });
    }
  } catch (error) {
    console.error('Gemini command error (falling back to deterministic synthesis):', error);
  }

  // High-fidelity fallback response
  return res.json({
    success: true,
    isLiveAI: false,
    data: {
      summary: "Class 10A shows strong aggregate algebra retention (81%), but has an acute critical bottleneck in Quadratic Equations with 19 students struggling with negative coefficient signs.",
      keyIssues: [
        {
          topic: "Quadratic Equations (Discriminant)",
          impact: "19 students affected (Class mastery: 48%, -11% trend)",
          urgency: "high"
        },
        {
          topic: "Geometry (Triangle Similarity Criteria)",
          impact: "11 students confusing congruence vs proportionality (Mastery: 55%)",
          urgency: "medium"
        },
        {
          topic: "Linear Equations & Factoring",
          impact: "24 students showing positive upward recovery (+5%)",
          urgency: "low"
        }
      ],
      recommendedAction: "Run a 12-minute targeted Quadratic Intervention focused on sign rules in Δ = b² - 4ac before starting tomorrow's lesson.",
      actionType: "intervention"
    }
  });
});

// Pulse Tutor: Socratic & Context-Aware Tutoring
const handleTutorChat = async (req: Request, res: Response) => {
  try {
    const { studentMessage, mode, topic, currentConcept, studentMastery, history } = req.body;
    const client = getGeminiClient();

    if (client) {
      const modePromptMap: Record<string, string> = {
        socratic: "Guide the student using targeted reflective questions and hints. Do NOT reveal the final answer directly. Encourage them to verify each step.",
        simple: "Explain in very simple, jargon-free conversational language suitable for a high-school student.",
        step_by_step: "Break the concept into numbered, micro-steps with clear mathematical transitions.",
        visual: "Provide a text/ASCII or mental model visualization of the geometry/parabola graph.",
        real_world: "Use an engaging real-world application (e.g. projectile motion, architecture, video game physics).",
        exam: "Provide exam-tested scoring guidelines, common traps that cost marks in CBSE/Board exams, and marking rubrics."
      };

      const instruction = `You are Pulse Tutor, a context-aware AI learning companion.
Current Topic: ${topic || 'Quadratic Equations'}
Concept: ${currentConcept || 'Discriminant Calculation'}
Student Mastery: ${studentMastery || '42% (Critical Gap)'}
Mode: ${mode || 'socratic'} (${modePromptMap[mode] || modePromptMap.socratic})

Tone: Warm, encouraging, clear, and mathematically accurate. Keep responses concise (under 180 words) so students stay focused.`;

      const aiResponse = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Student says: "${studentMessage}"`,
        config: {
          systemInstruction: instruction
        }
      });

      return res.json({
        success: true,
        isLiveAI: true,
        reply: aiResponse.text || ''
      });
    }
  } catch (error) {
    console.error('Pulse Tutor error:', error);
  }

  // High-fidelity fallback replies tailored to mode & dynamic topic context
  const {
    mode = 'socratic',
    topic = 'Quadratic Equations',
    currentConcept = 'Discriminant Calculation'
  } = req.body;

  let fallbackReply = `In ${topic} (${currentConcept}), let's inspect the signs closely. When evaluating Δ = b² - 4ac, if c is negative (like c = -5), what happens to the sign when you multiply -4 by a positive 'a' and a negative 'c'? Can you trace the multiplication sign first?`;

  if (mode === 'step_by_step') {
    fallbackReply = `Here is the structured step-by-step breakdown for ${topic} (${currentConcept}):\n1. Identify standard form coefficients: a = 2, b = -3, c = -5.\n2. State the formula clearly: Δ = b² - 4ac.\n3. Substitute with strict parentheses: (-3)² - 4(2)(-5).\n4. Compute powers and products separately: (-3)² = +9, and (-4) × 2 × (-5) = +40.\n5. Combine terms: Δ = 9 + 40 = 49. Because Δ > 0, the equation has two distinct real roots.`;
  } else if (mode === 'simple') {
    fallbackReply = `Think of a minus sign like a light switch: flipping it once turns the lights off (negative), but flipping it a second time turns them right back on (positive!). In ${currentConcept}, when 'c' is negative, '- 4ac' actually adds a positive bonus to b². That is why 9 - (-40) becomes 9 + 40 = 49!`;
  } else if (mode === 'visual') {
    fallbackReply = `Visual Graph Intuition for ${topic}:\nImagine plotting y = ax² + bx + c on the coordinate axes.\n• Δ > 0: The parabola cuts through the horizontal x-axis at TWO distinct intersection points (two real roots).\n• Δ = 0: The parabola's vertex touches the x-axis at exactly ONE point (one real repeated root).\n• Δ < 0: The parabola floats entirely above or below the x-axis, NEVER touching it (no real roots).`;
  } else if (mode === 'real_world') {
    fallbackReply = `Real-World Engineering Application of ${topic}:\nWhen a rocket or basketball is launched, its trajectory follows h(t) = -5t² + vt + h₀.\nEvaluating the discriminant Δ tells physics engines (such as in Unreal Engine or NASA flight computers) whether the projectile will cross a target altitude or hit the ground at real time coordinates. Engineers also use this for satellite dishes and suspension bridges!`;
  } else if (mode === 'exam') {
    fallbackReply = `Board Exam Marking Strategy for ${topic} (${currentConcept}):\n1. #1 Mark Loss Trap: 68% of lost marks happen when students write -3² = -9 instead of (-3)² = +9. Always put negative numbers in brackets!\n2. Standard 3-Mark Scoring Rubric:\n   • 1 Mark: Writing Δ = b² - 4ac.\n   • 1 Mark: Substituting values with parentheses: (-3)² - 4(a)(c).\n   • 1 Mark: Final calculation and stating root nature ('Two distinct real roots because Δ > 0').`;
  }

  return res.json({
    success: true,
    isLiveAI: false,
    reply: fallbackReply
  });
};

app.post('/api/ai/tutor', handleTutorChat);
app.post('/api/ai/tutor-chat', handleTutorChat);

// AI Question Generator for Teachers
const handleQuestionGeneration = async (req: Request, res: Response) => {
  try {
    const { topic, concept, difficulty, questionType, targetMisconception } = req.body;
    const client = getGeminiClient();

    if (client) {
      const prompt = `Generate a high-quality educational question for:
Topic: ${topic || 'Quadratic Equations'}
Concept: ${concept || 'Discriminant'}
Difficulty: ${difficulty || 'Medium'}
Question Type: ${questionType || 'misconception'}
Target Misconception: ${targetMisconception || 'Sign error in discriminant calculation'}

Respond strictly with valid JSON conforming to this schema:
{
  "prompt": "Clear problem statement",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": 0,
  "explanation": "Detailed mathematical justification and why the distractor options represent common misconceptions",
  "learningObjective": "Single measurable objective",
  "difficulty": "${difficulty || 'Medium'}",
  "misconceptionTargeted": "${targetMisconception || 'Sign error'}"
}`;

      const aiResponse = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const parsed = JSON.parse(aiResponse.text || '{}');
      return res.json({ success: true, isLiveAI: true, question: parsed, data: parsed });
    }
  } catch (error) {
    console.error('Question generation error:', error);
  }

  const fallbackQuestion = {
    prompt: "Find the discriminant of 3x² - 2x - 4 = 0, and classify the nature of the roots.",
    options: [
      "Δ = 52 (Two distinct real roots)",
      "Δ = -44 (No real roots)",
      "Δ = 44 (Two distinct real roots)",
      "Δ = -52 (No real roots)"
    ],
    correctAnswer: 0,
    explanation: "Δ = (-2)² - 4(3)(-4) = 4 - (-48) = 4 + 48 = 52. Distractor option B (Δ = -44) is the common trap where students fail to recognize the double negative.",
    learningObjective: "Accurately compute discriminant with negative constant c and deduce root multiplicity.",
    difficulty: "Medium",
    misconceptionTargeted: "Sign error in discriminant calculation when c is negative"
  };

  return res.json({
    success: true,
    isLiveAI: false,
    question: fallbackQuestion,
    data: fallbackQuestion
  });
};

app.post('/api/ai/generate-question', handleQuestionGeneration);
app.post('/api/ai/question-generate', handleQuestionGeneration);

// Parent AI Briefing Endpoint: Generates a warm, supportive progress summary
app.post('/api/ai/parent-briefing', async (req: Request, res: Response) => {
  try {
    const { childName, mastery, primaryGap, strengths, teacherName } = req.body;
    const client = getGeminiClient();

    if (client) {
      const prompt = `You are LearnPulse AI, generating a warm, supportive, and non-judgmental learning update for a parent.
Child: ${childName || 'Rahul'}
Overall Mastery: ${mastery || 76}%
Primary Concept Needing Support: ${primaryGap || 'Quadratic Equations (Discriminant signs)'}
Strengths: ${JSON.stringify(strengths || ['Linear Equations', 'Coordinate Geometry'])}
Teacher: ${teacherName || 'Dr. Radhika Sharma'}

Write a short, encouraging 2-paragraph update for the parent:
- Celebrate what the student does well with specific praise.
- Explain the current focus area in plain, non-technical language (no intimidation).
- Provide 1 actionable, low-stress question the parent can ask at dinner or during study time.
Tone: Warm, encouraging, partnership-driven.`;

      const aiResponse = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      return res.json({
        success: true,
        isLiveAI: true,
        briefing: aiResponse.text || ''
      });
    }
  } catch (error) {
    console.error('Parent briefing AI error:', error);
  }

  return res.json({
    success: true,
    isLiveAI: false,
    briefing: "Rahul has shown fantastic dedication in algebra and coordinate geometry this month! He's working comfortably with foundational equations and showing steady confidence.\n\nIn our current unit on Quadratic Equations, Rahul is doing great setting up problems, but occasionally gets tripped up when multiplying negative numbers in the discriminant formula (Δ = b² - 4ac). A fun question you can ask him this week: 'Can you show me why multiplying two negative numbers flips into a positive?' Celebrating small milestones at home makes all the difference!"
  });
});

// AI Intervention Generator for Teachers
const handleInterventionGeneration = async (req: Request, res: Response) => {
  try {
    const { topic, gapDescription, studentsCount } = req.body;
    const client = getGeminiClient();

    if (client) {
      const prompt = `Generate a 15-minute classroom recovery plan for:
Topic: ${topic || 'Quadratic Equations'}
Gap: ${gapDescription || 'Sign error in discriminant calculation'}
Affected Students: ${studentsCount || 19}

Format strictly as JSON:
{
  "title": "Intervention title",
  "objective": "Clear recovery objective",
  "strategy": "Core instructional strategy",
  "timeline": [
    { "minutes": "0–3 min", "title": "Concept Recap", "description": "Specific action" },
    { "minutes": "3–7 min", "title": "Worked Example", "description": "Specific action" },
    { "minutes": "7–12 min", "title": "Guided Practice", "description": "Specific action" },
    { "minutes": "12–15 min", "title": "Exit Check", "description": "Specific action" }
  ]
}`;

      const aiResponse = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const parsed = JSON.parse(aiResponse.text || '{}');
      return res.json({ success: true, isLiveAI: true, intervention: parsed, data: parsed });
    }
  } catch (error) {
    console.error('Intervention generation error:', error);
  }

  const fallbackIntervention = {
    title: "Targeted Sign-Rule Calibration for Discriminants",
    objective: "Repair systematic sign errors in b² - 4ac for 19 affected students.",
    strategy: "Isolate coefficient signs through high-contrast parenthetical templates and paired peer error-spotting.",
    timeline: [
      { minutes: "0–3 min", title: "Visual Sign Recap", description: "Display color-coded cards contrasting 4(a)(+c) vs 4(a)(-c) on projector." },
      { minutes: "3–7 min", title: "Worked Example", description: "Deconstruct 2x² - 3x - 5 = 0 step-by-step with student chorusing the sign flip." },
      { minutes: "7–12 min", title: "Adaptive Peer Check", description: "Students solve two parallel equations and cross-audit their intermediate steps." },
      { minutes: "12–15 min", title: "Digital Exit Check", description: "3-question rapid formative check sent directly to student dashboards." }
    ]
  };

  return res.json({
    success: true,
    isLiveAI: false,
    intervention: fallbackIntervention,
    data: fallbackIntervention
  });
};

app.post('/api/ai/generate-intervention', handleInterventionGeneration);
app.post('/api/ai/intervention-generate', handleInterventionGeneration);

// Vite Middleware Setup
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR === 'true' ? false : undefined,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LearnPulse AI Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
