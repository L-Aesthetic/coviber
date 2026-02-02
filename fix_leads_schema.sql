-- Run this in Supabase -> SQL Editor
-- This fixes the error: "Could not find the 'name' column of 'leads'"

ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS name text;
