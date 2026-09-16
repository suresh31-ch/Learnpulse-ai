/**
 * Client-side persistence for student learning events.
 * Uses the authenticated Supabase client (RLS). Failures are logged, never thrown to UI.
 */

import { getSupabase } from './supabase';
import type { ConfidenceRating } from '../types';

function safeLog(label: string, err: unknown) {
  const msg = err instanceof Error ? err.message : String(err);
  console.warn(`[studentPersistence] ${label}:`, msg);
}

export async function persistLearningEvent(params: {
  studentId: string;
  topicId?: string | null;
  eventType: string;
  metadata?: Record<string, unknown>;
}): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('learning_events').insert({
      student_id: params.studentId,
      topic_id: params.topicId ?? null,
      event_type: params.eventType,
      metadata: params.metadata ?? {},
    });
    if (error) {
      safeLog('learning_events insert', error);
      return false;
    }
    return true;
  } catch (err) {
    safeLog('learning_events insert', err);
    return false;
  }
}

export async function persistReadinessCheck(params: {
  studentId: string;
  topicId?: string | null;
  quizAccuracy: number;
  readiness: number;
  missedConcepts: string[];
}): Promise<boolean> {
  return persistLearningEvent({
    studentId: params.studentId,
    topicId: params.topicId,
    eventType: 'preclass_readiness',
    metadata: {
      source: 'student_pre_class_preview',
      quizAccuracy: params.quizAccuracy,
      readiness: params.readiness,
      missedConcepts: params.missedConcepts,
      persistedAt: new Date().toISOString(),
    },
  });
}

export async function persistPracticeSession(params: {
  studentId: string;
  topicId?: string | null;
  correctCount: number;
  questionCount: number;
}): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase || params.questionCount <= 0) return false;
  const score = Math.round((params.correctCount / params.questionCount) * 100);
  try {
    const { error } = await supabase.from('practice_sessions').insert({
      student_id: params.studentId,
      topic_id: params.topicId ?? null,
      score,
      correct_count: params.correctCount,
      question_count: params.questionCount,
    });
    if (error) {
      safeLog('practice_sessions insert', error);
      return false;
    }
    await persistLearningEvent({
      studentId: params.studentId,
      topicId: params.topicId,
      eventType: 'adaptive_practice',
      metadata: { score, correctCount: params.correctCount, questionCount: params.questionCount },
    });
    return true;
  } catch (err) {
    safeLog('practice_sessions insert', err);
    return false;
  }
}

export async function persistAttemptResponses(params: {
  studentId: string;
  responses: Array<{
    questionId?: string | null;
    isCorrect: boolean;
    confidence: ConfidenceRating | null;
  }>;
  score: number;
}): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;
  try {
    const { data: attempt, error: attemptErr } = await supabase
      .from('attempts')
      .insert({
        student_id: params.studentId,
        score: params.score,
      })
      .select('id')
      .maybeSingle();
    if (attemptErr || !attempt?.id) {
      safeLog('attempts insert', attemptErr);
      return false;
    }
    const rows = params.responses.map((r) => ({
      attempt_id: attempt.id,
      question_id: r.questionId ?? null,
      is_correct: r.isCorrect,
      confidence: r.confidence,
    }));
    const { error: respErr } = await supabase.from('responses').insert(rows);
    if (respErr) {
      safeLog('responses insert', respErr);
      return false;
    }
    return true;
  } catch (err) {
    safeLog('attempts/responses insert', err);
    return false;
  }
}
