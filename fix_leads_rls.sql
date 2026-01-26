-- Enable RLS on leads
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Allow ANYONE (including anon) to insert leads
CREATE POLICY "Allow anon insert leads" ON leads
FOR INSERT
WITH CHECK (true);

-- Allow authenticated users to READ leads that match their email
-- This is critical for the sync to work
CREATE POLICY "Allow users to read own leads" ON leads
FOR SELECT
USING (
  auth.email() = email 
  OR 
  lower(auth.email()) = lower(email) -- Case insensitive check
);

-- Grant permissions
GRANT ALL ON leads TO anon, authenticated, service_role;
