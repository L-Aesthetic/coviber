CREATE TABLE IF NOT EXISTS founder_audits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  founder_a_name TEXT,
  founder_b_name TEXT,
  answers_a JSONB DEFAULT '{}',
  answers_b JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending_b', -- 'pending_b', 'complete'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE founder_audits ENABLE ROW LEVEL SECURITY;

-- Allow public access for now (prototype phase)
-- In production, this should be restricted to authenticated users or signed tokens
CREATE POLICY "Public read access" ON founder_audits FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON founder_audits FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON founder_audits FOR UPDATE USING (true);
