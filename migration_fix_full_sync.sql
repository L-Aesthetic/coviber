
-- Run this in Supabase Dashboard > SQL Editor
-- It fixes 3 things: 
-- 1. Adds missing columns to 'profiles'
-- 2. Creates the 'leads' table with public access (for Landing Page)
-- 3. Sets up an auto-trigger to sync data when you signup

-- 1. FIX PROFILES SCHEMA
alter table public.profiles add column if not exists archetype text;
alter table public.profiles add column if not exists vibe_data jsonb;
alter table public.profiles add column if not exists social_links jsonb default '{}'::jsonb;
alter table public.profiles add column if not exists verified_at timestamptz;

-- 2. FIX LEADS TABLE & PERMISSIONS
create table if not exists public.leads (
    id uuid default gen_random_uuid() primary key,
    email text unique not null,
    archetype text,
    created_at timestamptz default now()
);

-- Enable RLS
alter table public.leads enable row level security;

-- Allow Landing Page (anon) to INSERT leads
drop policy if exists "Enable insert for all" on public.leads;
create policy "Enable insert for all" on public.leads for insert with check (true);

-- Allow Users to READ their own lead (matches email)
drop policy if exists "Enable read for own email" on public.leads;
create policy "Enable read for own email" on public.leads for select using (
  auth.jwt() ->> 'email' = email
);

-- 3. DATABASE TRIGGER (The "Magic" Link)
-- This runs automatically when a new user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  lead_data record;
begin
  -- Search for the lead
  select * into lead_data from public.leads where email = new.email limit 1;

  insert into public.profiles (id, email, full_name, avatar_url, archetype, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    lead_data.archetype, -- <--- MAGIC: Auto-fills from leads!
    case 
        when lead_data.archetype = 'Architect' then 'Engineering'
        when lead_data.archetype = 'Sovereign' then 'Founder'
        when lead_data.archetype = 'Operator' then 'Operations'
        else 'Founder'
    end
  )
  on conflict (id) do update set
    archetype = excluded.archetype,
    role = excluded.role;

  return new;
end;
$$;

-- Hook up the trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
