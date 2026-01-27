-- Enable Row Level Security (RLS) on profiles
alter table public.profiles enable row level security;

-- 1. VIEW: Authenticated users can see all profiles
drop policy if exists "Public profiles are viewable by everyone" on profiles;
create policy "Public profiles are viewable by everyone"
  on profiles for select
  to authenticated
  using ( true );

-- 2. UPDATE: Users can ONLY update their own profile
drop policy if exists "Users can update own profile" on profiles;
create policy "Users can update own profile"
  on profiles for update
  to authenticated
  using ( auth.uid() = id );

-- 3. INSERT: Users can insert their own profile
drop policy if exists "Users can insert their own profile" on profiles;
create policy "Users can insert their own profile"
  on profiles for insert
  to authenticated
  with check ( auth.uid() = id );
