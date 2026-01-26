-- 1. Ensure columns exist (idempotent)
alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists subscription_tier text default 'free';
alter table public.profiles add column if not exists founder_number int;

-- 2. Trigger to automatically create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, subscription_tier)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    'free'
  )
  on conflict (id) do nothing; -- Safe if profile already exists
  return new;
end;
$$;

-- Drop existing trigger if it exists to clean up old versions
drop trigger if exists on_auth_user_created on auth.users;

-- Create the trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
