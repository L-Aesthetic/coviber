
-- Run this in your Supabase Dashboard > SQL Editor

-- 1. Add 'archetype' column
alter table public.profiles 
add column if not exists archetype text;

-- 2. Add 'social_links' column (JSONB for flexibility)
alter table public.profiles 
add column if not exists social_links jsonb default '{}'::jsonb;

-- 3. Ensure 'verified_at' exists (saw it in code)
alter table public.profiles 
add column if not exists verified_at timestamptz;

-- 4. Add 'vibe_data' column (JSONB for chart data)
alter table public.profiles 
add column if not exists vibe_data jsonb;
