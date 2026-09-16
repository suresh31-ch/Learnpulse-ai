-- ==============================================================================
-- LearnPulse AI — Real Supabase Authentication Demo Users Provisioning Script
-- Safe to run in Supabase Project Dashboard -> SQL Editor -> New Query -> Run
-- Idempotent: Can be run multiple times safely without generating duplicate key errors
-- ==============================================================================

-- 1. Ensure cryptographic functions are enabled for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Provision / Update Demo Users directly in Supabase Auth (auth.users)
-- All accounts are pre-confirmed (email_confirmed_at = NOW()) with matching roles in user_metadata

-- Demo Student
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  role,
  aud,
  created_at,
  updated_at
)
VALUES (
  'd0000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'demo.student@learnpulse.demo',
  crypt('LearnPulseDemo2026!', gen_salt('bf')),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"role":"student","full_name":"Aarav Mehta"}'::jsonb,
  'authenticated',
  'authenticated',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  encrypted_password = crypt('LearnPulseDemo2026!', gen_salt('bf')),
  email_confirmed_at = COALESCE(auth.users.email_confirmed_at, NOW()),
  confirmed_at = COALESCE(auth.users.confirmed_at, NOW()),
  raw_user_meta_data = '{"role":"student","full_name":"Aarav Mehta"}'::jsonb,
  updated_at = NOW();

-- Demo Teacher
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  role,
  aud,
  created_at,
  updated_at
)
VALUES (
  'd0000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000000',
  'demo.teacher@learnpulse.demo',
  crypt('LearnPulseDemo2026!', gen_salt('bf')),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"role":"teacher","full_name":"Dr. Radhika Sharma"}'::jsonb,
  'authenticated',
  'authenticated',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  encrypted_password = crypt('LearnPulseDemo2026!', gen_salt('bf')),
  email_confirmed_at = COALESCE(auth.users.email_confirmed_at, NOW()),
  confirmed_at = COALESCE(auth.users.confirmed_at, NOW()),
  raw_user_meta_data = '{"role":"teacher","full_name":"Dr. Radhika Sharma"}'::jsonb,
  updated_at = NOW();

-- Demo Parent
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  role,
  aud,
  created_at,
  updated_at
)
VALUES (
  'd0000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000000',
  'demo.parent@learnpulse.demo',
  crypt('LearnPulseDemo2026!', gen_salt('bf')),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"role":"parent","full_name":"Sanjay Mehta"}'::jsonb,
  'authenticated',
  'authenticated',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  encrypted_password = crypt('LearnPulseDemo2026!', gen_salt('bf')),
  email_confirmed_at = COALESCE(auth.users.email_confirmed_at, NOW()),
  confirmed_at = COALESCE(auth.users.confirmed_at, NOW()),
  raw_user_meta_data = '{"role":"parent","full_name":"Sanjay Mehta"}'::jsonb,
  updated_at = NOW();

-- Demo Admin
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  role,
  aud,
  created_at,
  updated_at
)
VALUES (
  'd0000000-0000-0000-0000-000000000004',
  '00000000-0000-0000-0000-000000000000',
  'demo.admin@learnpulse.demo',
  crypt('LearnPulseDemo2026!', gen_salt('bf')),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"role":"admin","full_name":"Institution Administrator"}'::jsonb,
  'authenticated',
  'authenticated',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  encrypted_password = crypt('LearnPulseDemo2026!', gen_salt('bf')),
  email_confirmed_at = COALESCE(auth.users.email_confirmed_at, NOW()),
  confirmed_at = COALESCE(auth.users.confirmed_at, NOW()),
  raw_user_meta_data = '{"role":"admin","full_name":"Institution Administrator"}'::jsonb,
  updated_at = NOW();

-- 3. Register Auth Identities for Supabase GoTrue email provider
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

-- 4. Associate with public.profiles (profiles.id = auth.users.id)
INSERT INTO public.profiles (
  id,
  full_name,
  email,
  role,
  avatar_url,
  created_at
)
VALUES 
  (
    'd0000000-0000-0000-0000-000000000001',
    'Aarav Mehta',
    'demo.student@learnpulse.demo',
    'student',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    NOW()
  ),
  (
    'd0000000-0000-0000-0000-000000000002',
    'Dr. Radhika Sharma',
    'demo.teacher@learnpulse.demo',
    'teacher',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    NOW()
  ),
  (
    'd0000000-0000-0000-0000-000000000003',
    'Sanjay Mehta',
    'demo.parent@learnpulse.demo',
    'parent',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    NOW()
  ),
  (
    'd0000000-0000-0000-0000-000000000004',
    'Institution Administrator',
    'demo.admin@learnpulse.demo',
    'admin',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    NOW()
  )
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  updated_at = NOW();

-- 5. Class Membership & Parent Dependent Linkage (Foreign key associations)
-- Link Aarav Mehta (demo student) to Class 10A (Mathematics) if class exists
INSERT INTO public.class_members (class_id, student_id)
SELECT '77777777-1111-1111-1111-111111111111', 'd0000000-0000-0000-0000-000000000001'
WHERE EXISTS (SELECT 1 FROM public.classes WHERE id = '77777777-1111-1111-1111-111111111111')
ON CONFLICT DO NOTHING;

-- Link Sanjay Mehta (demo parent) to Aarav Mehta (demo student)
INSERT INTO public.parent_student_links (parent_id, student_id, created_at)
VALUES ('d0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000001', NOW())
ON CONFLICT DO NOTHING;
