-- ==============================================================================
-- LearnPulse AI — Step 6: Realistic Demonstration Dataset (Seed Data)
-- Institution: LearnPulse Demo Academy
-- Curriculum: Mathematics, Science, Physics (CBSE 10 & JEE Batch Alpha)
-- ==============================================================================
-- Execution Guide:
-- Paste and execute this script inside your Supabase Project Dashboard:
-- SQL Editor -> New Query -> Run.
-- ==============================================================================

-- 0. Real Supabase Auth Demo Identities & Profiles
-- Enables pgcrypto and seeds the 4 official demo identities into auth.users and public.profiles
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Demo Student
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, confirmed_at, raw_app_meta_data, raw_user_meta_data, role, aud, created_at, updated_at)
VALUES ('d0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'demo.student@learnpulse.demo', crypt('LearnPulseDemo2026!', gen_salt('bf')), NOW(), NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"role":"student","full_name":"Aarav Mehta"}'::jsonb, 'authenticated', 'authenticated', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email, encrypted_password = crypt('LearnPulseDemo2026!', gen_salt('bf')), email_confirmed_at = COALESCE(auth.users.email_confirmed_at, NOW()), confirmed_at = COALESCE(auth.users.confirmed_at, NOW()), raw_user_meta_data = '{"role":"student","full_name":"Aarav Mehta"}'::jsonb, updated_at = NOW();

-- Demo Teacher
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, confirmed_at, raw_app_meta_data, raw_user_meta_data, role, aud, created_at, updated_at)
VALUES ('d0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'demo.teacher@learnpulse.demo', crypt('LearnPulseDemo2026!', gen_salt('bf')), NOW(), NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"role":"teacher","full_name":"Dr. Radhika Sharma"}'::jsonb, 'authenticated', 'authenticated', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email, encrypted_password = crypt('LearnPulseDemo2026!', gen_salt('bf')), email_confirmed_at = COALESCE(auth.users.email_confirmed_at, NOW()), confirmed_at = COALESCE(auth.users.confirmed_at, NOW()), raw_user_meta_data = '{"role":"teacher","full_name":"Dr. Radhika Sharma"}'::jsonb, updated_at = NOW();

-- Demo Parent
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, confirmed_at, raw_app_meta_data, raw_user_meta_data, role, aud, created_at, updated_at)
VALUES ('d0000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'demo.parent@learnpulse.demo', crypt('LearnPulseDemo2026!', gen_salt('bf')), NOW(), NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"role":"parent","full_name":"Sanjay Mehta"}'::jsonb, 'authenticated', 'authenticated', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email, encrypted_password = crypt('LearnPulseDemo2026!', gen_salt('bf')), email_confirmed_at = COALESCE(auth.users.email_confirmed_at, NOW()), confirmed_at = COALESCE(auth.users.confirmed_at, NOW()), raw_user_meta_data = '{"role":"parent","full_name":"Sanjay Mehta"}'::jsonb, updated_at = NOW();

-- Demo Admin
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, confirmed_at, raw_app_meta_data, raw_user_meta_data, role, aud, created_at, updated_at)
VALUES ('d0000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000000', 'demo.admin@learnpulse.demo', crypt('LearnPulseDemo2026!', gen_salt('bf')), NOW(), NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"role":"admin","full_name":"Institution Administrator"}'::jsonb, 'authenticated', 'authenticated', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email, encrypted_password = crypt('LearnPulseDemo2026!', gen_salt('bf')), email_confirmed_at = COALESCE(auth.users.email_confirmed_at, NOW()), confirmed_at = COALESCE(auth.users.confirmed_at, NOW()), raw_user_meta_data = '{"role":"admin","full_name":"Institution Administrator"}'::jsonb, updated_at = NOW();

-- Auth Identities
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.identities WHERE user_id = 'd0000000-0000-0000-0000-000000000001') THEN
    INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
    VALUES ('d0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', json_build_object('sub', 'd0000000-0000-0000-0000-000000000001', 'email', 'demo.student@learnpulse.demo'), 'email', 'demo.student@learnpulse.demo', NOW(), NOW(), NOW());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM auth.identities WHERE user_id = 'd0000000-0000-0000-0000-000000000002') THEN
    INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
    VALUES ('d0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000002', json_build_object('sub', 'd0000000-0000-0000-0000-000000000002', 'email', 'demo.teacher@learnpulse.demo'), 'email', 'demo.teacher@learnpulse.demo', NOW(), NOW(), NOW());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM auth.identities WHERE user_id = 'd0000000-0000-0000-0000-000000000003') THEN
    INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
    VALUES ('d0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000003', json_build_object('sub', 'd0000000-0000-0000-0000-000000000003', 'email', 'demo.parent@learnpulse.demo'), 'email', 'demo.parent@learnpulse.demo', NOW(), NOW(), NOW());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM auth.identities WHERE user_id = 'd0000000-0000-0000-0000-000000000004') THEN
    INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
    VALUES ('d0000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000004', json_build_object('sub', 'd0000000-0000-0000-0000-000000000004', 'email', 'demo.admin@learnpulse.demo'), 'email', 'demo.admin@learnpulse.demo', NOW(), NOW(), NOW());
  END IF;
END $$;

-- Public Profiles for Demo Accounts
INSERT INTO public.profiles (id, full_name, email, role, avatar_url, created_at)
VALUES 
  ('d0000000-0000-0000-0000-000000000001', 'Aarav Mehta', 'demo.student@learnpulse.demo', 'student', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80', NOW()),
  ('d0000000-0000-0000-0000-000000000002', 'Dr. Radhika Sharma', 'demo.teacher@learnpulse.demo', 'teacher', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', NOW()),
  ('d0000000-0000-0000-0000-000000000003', 'Sanjay Mehta', 'demo.parent@learnpulse.demo', 'parent', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', NOW()),
  ('d0000000-0000-0000-0000-000000000004', 'Institution Administrator', 'demo.admin@learnpulse.demo', 'admin', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', NOW())
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name, email = EXCLUDED.email, role = EXCLUDED.role, updated_at = NOW();

-- 1. Fictional Institution: LearnPulse Demo Academy
INSERT INTO public.institutions (id, name, type, created_at)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'LearnPulse Demo Academy',
  'k12_academy',
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type;

-- 2. Programs
INSERT INTO public.programs (id, name, description, created_at)
VALUES 
  ('22222222-1111-1111-1111-111111111111', 'Class 10 CBSE Secondary', 'Central Board of Secondary Education Class 10 Curriculum', NOW()),
  ('22222222-2222-2222-2222-222222222222', 'JEE Advanced Preparation (Batch Alpha)', 'Advanced Competitive Engineering Entrance Training Track', NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- 3. Subjects
INSERT INTO public.subjects (id, program_id, name, description, created_at)
VALUES 
  ('33333333-1111-1111-1111-111111111111', '22222222-1111-1111-1111-111111111111', 'Mathematics', 'CBSE Class 10 Mathematics', NOW()),
  ('33333333-2222-2222-2222-222222222222', '22222222-1111-1111-1111-111111111111', 'Science', 'CBSE Class 10 Integrated Science', NOW()),
  ('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'Physics', 'JEE Advanced Mechanics & Modern Physics', NOW()),
  ('33333333-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'Advanced Mathematics', 'JEE Advanced Calculus & Coordinate Geometry', NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- 4. Units
INSERT INTO public.units (id, subject_id, name, description, created_at)
VALUES 
  ('44444444-1111-1111-1111-111111111111', '33333333-1111-1111-1111-111111111111', 'Algebra', 'Quadratic and linear algebraic systems', NOW()),
  ('44444444-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'Mechanics', 'Kinematics, dynamics, and force systems', NOW()),
  ('44444444-3333-3333-3333-333333333333', '33333333-2222-2222-2222-222222222222', 'Electricity', 'Electrostatics, current, resistance and circuits', NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- 5. Topics
INSERT INTO public.topics (id, unit_id, name, description, created_at)
VALUES 
  ('55555555-1111-1111-1111-111111111111', '44444444-1111-1111-1111-111111111111', 'Quadratic Equations', 'Standard form, discriminant, and root nature', NOW()),
  ('55555555-2222-2222-2222-222222222222', '44444444-1111-1111-1111-111111111111', 'Linear Equations', 'Pairs of linear equations in two variables', NOW()),
  ('55555555-3333-3333-3333-333333333333', '44444444-2222-2222-2222-222222222222', 'Kinematics', 'Rectilinear motion, vectors, velocity and acceleration', NOW()),
  ('55555555-4444-4444-4444-444444444444', '44444444-2222-2222-2222-222222222222', 'Newton''s Laws', 'Inertia, momentum, Newton''s 3 laws and free-body diagrams', NOW()),
  ('55555555-5555-5555-5555-555555555555', '44444444-3333-3333-3333-333333333333', 'Electricity', 'Electric current, potential difference, and Ohm''s Law', NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- 6. Concepts
INSERT INTO public.concepts (id, topic_id, name, description, created_at)
VALUES 
  -- Quadratic Equations Concepts
  ('66666666-1111-1111-1111-111111111111', '55555555-1111-1111-1111-111111111111', 'Factorisation', 'Splitting the middle term and algebraic factorisation', NOW()),
  ('66666666-1111-1111-1111-111111111112', '55555555-1111-1111-1111-111111111111', 'Roots of Quadratic Equations', 'Finding real and repeated zeroes using quadratic formula', NOW()),
  ('66666666-1111-1111-1111-111111111113', '55555555-1111-1111-1111-111111111111', 'Discriminant', 'Analyzing Δ = b² - 4ac for root characterization', NOW()),
  -- Linear Equations Concepts
  ('66666666-2222-2222-2222-222222222221', '55555555-2222-2222-2222-222222222222', 'Solving Linear Equations', 'Algebraic representation and consistency conditions', NOW()),
  ('66666666-2222-2222-2222-222222222222', '55555555-2222-2222-2222-222222222222', 'Substitution and Elimination', 'Simultaneous equation solution methodologies', NOW()),
  -- Kinematics Concepts
  ('66666666-3333-3333-3333-333333333331', '55555555-3333-3333-3333-333333333333', 'Motion in One Dimension', 'Position, distance, displacement, and time graphing', NOW()),
  ('66666666-3333-3333-3333-333333333332', '55555555-3333-3333-3333-333333333333', 'Velocity and Acceleration', 'Instantaneous vs average rates of velocity change', NOW()),
  -- Newton's Laws Concepts
  ('66666666-4444-4444-4444-444444444441', '55555555-4444-4444-4444-444444444444', 'Forces', 'Fundamental contact and non-contact forces and tension', NOW()),
  ('66666666-4444-4444-4444-444444444442', '55555555-4444-4444-4444-444444444444', 'Free Body Diagrams', 'Resolving orthogonal components and equilibrium states', NOW()),
  -- Electricity Concepts
  ('66666666-5555-5555-5555-555555555551', '55555555-5555-5555-5555-555555555555', 'Ohm''s Law', 'V = IR linear relationship across ohmic conductors', NOW()),
  ('66666666-5555-5555-5555-555555555552', '55555555-5555-5555-5555-555555555555', 'Resistance and Current', 'Resistivity, temperature coefficient, and series-parallel networks', NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- 7. Prerequisite Graph
INSERT INTO public.prerequisites (concept_id, prerequisite_concept_id)
VALUES 
  -- Factorisation -> Roots of Quadratic Equations
  ('66666666-1111-1111-1111-111111111112', '66666666-1111-1111-1111-111111111111'),
  -- Solving Linear Equations -> Factorisation
  ('66666666-1111-1111-1111-111111111111', '66666666-2222-2222-2222-222222222221'),
  -- Solving Linear Equations -> Discriminant
  ('66666666-1111-1111-1111-111111111113', '66666666-2222-2222-2222-222222222221'),
  -- Velocity and Acceleration -> Motion in One Dimension
  ('66666666-3333-3333-3333-333333333332', '66666666-3333-3333-3333-333333333331'),
  -- Motion in One Dimension -> Forces
  ('66666666-4444-4444-4444-444444444441', '66666666-3333-3333-3333-333333333332'),
  -- Forces -> Free Body Diagrams
  ('66666666-4444-4444-4444-444444444442', '66666666-4444-4444-4444-444444444441'),
  -- Resistance and Current -> Ohm's Law
  ('66666666-5555-5555-5555-555555555551', '66666666-5555-5555-5555-555555555552')
ON CONFLICT DO NOTHING;

-- 8. Classes
INSERT INTO public.classes (id, name, academic_year, institution_id, program_id, created_at)
VALUES 
  ('77777777-1111-1111-1111-111111111111', 'Class 10A — Mathematics', '2025–2026', '11111111-1111-1111-1111-111111111111', '22222222-1111-1111-1111-111111111111', NOW()),
  ('77777777-2222-2222-2222-222222222222', 'Class 10A — Science', '2025–2026', '11111111-1111-1111-1111-111111111111', '22222222-1111-1111-1111-111111111111', NOW()),
  ('77777777-3333-3333-3333-333333333333', 'JEE Batch Alpha — Physics', '2025–2026', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', NOW()),
  ('77777777-4444-4444-4444-444444444444', 'JEE Batch Alpha — Mathematics', '2025–2026', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  academic_year = EXCLUDED.academic_year;

-- 9. Class Sessions (Pre-Class Readiness Calendar)
INSERT INTO public.class_sessions (id, class_id, topic_id, scheduled_at, title)
VALUES 
  ('88888888-1111-1111-1111-111111111111', '77777777-1111-1111-1111-111111111111', '55555555-1111-1111-1111-111111111111', NOW() + INTERVAL '1 day', 'Quadratic Equations: Discriminant & Root Form')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title;

-- 10. Assessments
INSERT INTO public.assessments (id, class_id, title, created_at)
VALUES 
  ('99999999-1111-1111-1111-111111111111', '77777777-1111-1111-1111-111111111111', 'Algebra Diagnostic', NOW() - INTERVAL '7 days'),
  ('99999999-2222-2222-2222-222222222222', '77777777-1111-1111-1111-111111111111', 'Quadratic Equations Check', NOW() - INTERVAL '3 days'),
  ('99999999-3333-3333-3333-333333333333', '77777777-3333-3333-3333-333333333333', 'Kinematics Quick Assessment', NOW() - INTERVAL '5 days'),
  ('99999999-4444-4444-4444-444444444444', '77777777-3333-3333-3333-333333333333', 'Newton''s Laws Assessment', NOW() - INTERVAL '2 days'),
  ('99999999-5555-5555-5555-555555555555', '77777777-2222-2222-2222-222222222222', 'Electricity Fundamentals', NOW() - INTERVAL '4 days')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title;

-- 11. Questions
INSERT INTO public.questions (id, assessment_id, topic_id, concept_id, question_text, options, correct_answer, explanation, difficulty, created_at)
VALUES 
  (
    'aaaa1111-1111-1111-1111-111111111111',
    '99999999-2222-2222-2222-222222222222',
    '55555555-1111-1111-1111-111111111111',
    '66666666-1111-1111-1111-111111111113',
    'For the equation 2x² - 4x - 6 = 0, what is the value of the constant term c?',
    '["6", "-6", "-4", "2"]'::json,
    '-6',
    'In ax² + bx + c = 0, here a = 2, b = -4, and c = -6 (including the sign).',
    'easy',
    NOW()
  ),
  (
    'aaaa1111-1111-1111-1111-111111111112',
    '99999999-2222-2222-2222-222222222222',
    '55555555-1111-1111-1111-111111111111',
    '66666666-1111-1111-1111-111111111113',
    'If b² - 4ac > 0, how many distinct real roots exist for the quadratic equation?',
    '["0 real roots", "1 equal real root", "2 distinct real roots", "Infinitely many"]'::json,
    '2 distinct real roots',
    'A positive discriminant produces two distinct real roots through ±√Δ.',
    'medium',
    NOW()
  ),
  (
    'aaaa1111-1111-1111-1111-111111111113',
    '99999999-3333-3333-3333-333333333333',
    '55555555-3333-3333-3333-333333333333',
    '66666666-3333-3333-3333-333333333332',
    'Can an object have a velocity directed north while accelerating south?',
    '["No, acceleration must match velocity direction", "Yes, when the object is decelerating", "Only at zero velocity", "Impossible in 1D motion"]'::json,
    'Yes, when the object is decelerating',
    'Acceleration opposing velocity indicates slowing down along that axis.',
    'medium',
    NOW()
  ),
  (
    'aaaa1111-1111-1111-1111-111111111114',
    '99999999-5555-5555-5555-555555555555',
    '55555555-5555-5555-5555-555555555555',
    '66666666-5555-5555-5555-555555555551',
    'According to Ohm''s Law, if voltage across a fixed resistor is tripled, the current will:',
    '["Decrease by factor of 3", "Remain constant", "Triple", "Ninefold"]'::json,
    'Triple',
    'I = V/R; current is directly proportional to voltage at constant resistance.',
    'easy',
    NOW()
  )
ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options;
