import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let db;

if (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http')) {
    db = createClient(supabaseUrl, supabaseAnonKey);
} else {
    console.warn('Supabase credentials missing or invalid. Using mock client for development.');
    // Mock client to prevent crashes
    db = {
        auth: {
            getSession: () => Promise.resolve({ data: { session: null } }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
            signInWithOtp: () => Promise.resolve({ error: { message: 'Supabase not configured (Mock)' } }),
            signOut: () => Promise.resolve({ error: null })
        },
        from: () => ({
            select: () => Promise.resolve({ data: [], error: null }),
            insert: () => Promise.resolve({ data: [], error: null })
        })
    };
}

export const supabase = db;
