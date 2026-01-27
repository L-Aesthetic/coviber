-- 1. Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    
    -- Core Identity
    full_name TEXT,
    display_name TEXT,
    headline TEXT,
    bio TEXT,
    location TEXT,
    role TEXT,
    avatar_url TEXT,
    
    -- App Specific
    archetype TEXT,
    subscription_tier TEXT DEFAULT 'free',
    
    -- Vibe Data
    vibe_data JSONB, -- Radar chart data
    comm_style TEXT,
    trigger_warning TEXT,
    superpower TEXT,
    kryptonite TEXT,
    anti_pitch TEXT[], -- Array of strings
    
    -- Lists
    skills TEXT[],
    interests TEXT[]
);

-- 2. Create leads table if it doesn't exist (for email capture)
CREATE TABLE IF NOT EXISTS leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE,
    name TEXT,
    archetype TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Add columns if they are missing (Idempotent updates)
DO $$
BEGIN
    -- Add subscription_tier
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='subscription_tier') THEN
        ALTER TABLE profiles ADD COLUMN subscription_tier TEXT DEFAULT 'free';
    END IF;
    
    -- Add archetype
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='archetype') THEN
        ALTER TABLE profiles ADD COLUMN archetype TEXT;
    END IF;

    -- Add anti_pitch
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='anti_pitch') THEN
        ALTER TABLE profiles ADD COLUMN anti_pitch TEXT[];
    END IF;

    -- Add vibe_data
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='vibe_data') THEN
        ALTER TABLE profiles ADD COLUMN vibe_data JSONB;
    END IF;
END $$;

-- 4. Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 5. Policies (Check if they exist before creating, or drop and recreate)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);
