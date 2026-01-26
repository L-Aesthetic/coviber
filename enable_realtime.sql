-- Enable Realtime for founder_audits table
-- This is required for clients to listen to changes
alter publication supabase_realtime add table founder_audits;
