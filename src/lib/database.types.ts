/**
 * LearnPulse AI Database Schema Types for Supabase
 *
 * Real PostgreSQL Database Schema reflected from Supabase:
 * institutions -> programs -> subjects -> units -> topics -> concepts -> prerequisites
 * classes -> class_members -> class_sessions -> parent_student_links
 * profiles (auth.users)
 * assessments -> questions -> attempts -> responses
 * student_topic_mastery -> student_concept_mastery
 * misconceptions -> risk_signals -> interventions -> practice_sessions -> learning_events
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      institutions: {
        Row: {
          id: string;
          name: string;
          type: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: string | null;
          created_at?: string;
        };
      };
      programs: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
        };
      };
      subjects: {
        Row: {
          id: string;
          program_id: string | null;
          name: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          program_id?: string | null;
          name: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          program_id?: string | null;
          name?: string;
          description?: string | null;
          created_at?: string;
        };
      };
      units: {
        Row: {
          id: string;
          subject_id: string | null;
          name: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          subject_id?: string | null;
          name: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          subject_id?: string | null;
          name?: string;
          description?: string | null;
          created_at?: string;
        };
      };
      topics: {
        Row: {
          id: string;
          unit_id: string | null;
          name: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          unit_id?: string | null;
          name: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          unit_id?: string | null;
          name?: string;
          description?: string | null;
          created_at?: string;
        };
      };
      concepts: {
        Row: {
          id: string;
          topic_id: string | null;
          name: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          topic_id?: string | null;
          name: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          topic_id?: string | null;
          name?: string;
          description?: string | null;
          created_at?: string;
        };
      };
      prerequisites: {
        Row: {
          concept_id: string;
          prerequisite_concept_id: string;
        };
        Insert: {
          concept_id: string;
          prerequisite_concept_id: string;
        };
        Update: {
          concept_id?: string;
          prerequisite_concept_id?: string;
        };
      };
      classes: {
        Row: {
          id: string;
          name: string;
          academic_year: string | null;
          institution_id: string | null;
          program_id: string | null;
          teacher_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          academic_year?: string | null;
          institution_id?: string | null;
          program_id?: string | null;
          teacher_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          academic_year?: string | null;
          institution_id?: string | null;
          program_id?: string | null;
          teacher_id?: string | null;
          created_at?: string;
        };
      };
      class_members: {
        Row: {
          class_id: string;
          student_id: string;
        };
        Insert: {
          class_id: string;
          student_id: string;
        };
        Update: {
          class_id?: string;
          student_id?: string;
        };
      };
      class_sessions: {
        Row: {
          id: string;
          class_id: string | null;
          topic_id: string | null;
          scheduled_at: string | null;
          title: string | null;
        };
        Insert: {
          id?: string;
          class_id?: string | null;
          topic_id?: string | null;
          scheduled_at?: string | null;
          title?: string | null;
        };
        Update: {
          id?: string;
          class_id?: string | null;
          topic_id?: string | null;
          scheduled_at?: string | null;
          title?: string | null;
        };
      };
      parent_student_links: {
        Row: {
          parent_id: string;
          student_id: string;
          created_at: string;
        };
        Insert: {
          parent_id: string;
          student_id: string;
          created_at?: string;
        };
        Update: {
          parent_id?: string;
          student_id?: string;
          created_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string; // references auth.users
          full_name: string | null;
          email: string | null;
          role: 'student' | 'teacher' | 'parent' | 'admin' | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          email?: string | null;
          role?: 'student' | 'teacher' | 'parent' | 'admin' | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          email?: string | null;
          role?: 'student' | 'teacher' | 'parent' | 'admin' | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
      };
      assessments: {
        Row: {
          id: string;
          class_id: string | null;
          title: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          class_id?: string | null;
          title: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          class_id?: string | null;
          title?: string;
          created_at?: string;
        };
      };
      questions: {
        Row: {
          id: string;
          assessment_id: string | null;
          topic_id: string | null;
          concept_id: string | null;
          question_text: string | null;
          options: Json | null;
          correct_answer: string | null;
          explanation: string | null;
          difficulty: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          assessment_id?: string | null;
          topic_id?: string | null;
          concept_id?: string | null;
          question_text?: string | null;
          options?: Json | null;
          correct_answer?: string | null;
          explanation?: string | null;
          difficulty?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          assessment_id?: string | null;
          topic_id?: string | null;
          concept_id?: string | null;
          question_text?: string | null;
          options?: Json | null;
          correct_answer?: string | null;
          explanation?: string | null;
          difficulty?: string | null;
          created_at?: string;
        };
      };
      attempts: {
        Row: {
          id: string;
          student_id: string | null;
          assessment_id: string | null;
          score: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id?: string | null;
          assessment_id?: string | null;
          score?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string | null;
          assessment_id?: string | null;
          score?: number | null;
          created_at?: string;
        };
      };
      responses: {
        Row: {
          id: string;
          attempt_id: string | null;
          question_id: string | null;
          is_correct: boolean | null;
          confidence: string | number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          attempt_id?: string | null;
          question_id?: string | null;
          is_correct?: boolean | null;
          confidence?: string | number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          attempt_id?: string | null;
          question_id?: string | null;
          is_correct?: boolean | null;
          confidence?: string | number | null;
          created_at?: string;
        };
      };
      student_topic_mastery: {
        Row: {
          id: string;
          student_id: string | null;
          topic_id: string | null;
          mastery_score: number | null;
          trend: string | null;
          attempts_count: number | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id?: string | null;
          topic_id?: string | null;
          mastery_score?: number | null;
          trend?: string | null;
          attempts_count?: number | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string | null;
          topic_id?: string | null;
          mastery_score?: number | null;
          trend?: string | null;
          attempts_count?: number | null;
          updated_at?: string;
        };
      };
      student_concept_mastery: {
        Row: {
          id: string;
          student_id: string | null;
          concept_id: string | null;
          mastery_score: number | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id?: string | null;
          concept_id?: string | null;
          mastery_score?: number | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string | null;
          concept_id?: string | null;
          mastery_score?: number | null;
          updated_at?: string;
        };
      };
      misconceptions: {
        Row: {
          id: string;
          student_id: string | null;
          topic_id: string | null;
          concept_id: string | null;
          description: string | null;
          evidence: string | null;
          confidence: string | number | null;
          status: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id?: string | null;
          topic_id?: string | null;
          concept_id?: string | null;
          description?: string | null;
          evidence?: string | null;
          confidence?: string | number | null;
          status?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string | null;
          topic_id?: string | null;
          concept_id?: string | null;
          description?: string | null;
          evidence?: string | null;
          confidence?: string | number | null;
          status?: string | null;
          created_at?: string;
        };
      };
      risk_signals: {
        Row: {
          id: string;
          student_id: string | null;
          class_id: string | null;
          evidence: string | null;
          risk_level: string | null;
          explanation: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id?: string | null;
          class_id?: string | null;
          evidence?: string | null;
          risk_level?: string | null;
          explanation?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string | null;
          class_id?: string | null;
          evidence?: string | null;
          risk_level?: string | null;
          explanation?: string | null;
          created_at?: string;
        };
      };
      interventions: {
        Row: {
          id: string;
          student_id: string | null;
          topic_id: string | null;
          teacher_id: string | null;
          title: string | null;
          status: string | null;
          before_mastery: number | null;
          after_mastery: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id?: string | null;
          topic_id?: string | null;
          teacher_id?: string | null;
          title?: string | null;
          status?: string | null;
          before_mastery?: number | null;
          after_mastery?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string | null;
          topic_id?: string | null;
          teacher_id?: string | null;
          title?: string | null;
          status?: string | null;
          before_mastery?: number | null;
          after_mastery?: number | null;
          created_at?: string;
        };
      };
      practice_sessions: {
        Row: {
          id: string;
          student_id: string | null;
          topic_id: string | null;
          score: number | null;
          correct_count: number | null;
          question_count: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id?: string | null;
          topic_id?: string | null;
          score?: number | null;
          correct_count?: number | null;
          question_count?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string | null;
          topic_id?: string | null;
          score?: number | null;
          correct_count?: number | null;
          question_count?: number | null;
          created_at?: string;
        };
      };
      learning_events: {
        Row: {
          id: string;
          student_id: string | null;
          topic_id: string | null;
          event_type: string | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id?: string | null;
          topic_id?: string | null;
          event_type?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string | null;
          topic_id?: string | null;
          event_type?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
      };
    };
  };
}
