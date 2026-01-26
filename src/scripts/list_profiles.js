

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars manually
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../../.env');
const envContent = fs.readFileSync(envPath, 'utf8');

const env = {};
envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim();
        if (key && value) {
            env[key] = value;
        }
    }
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function listProfiles() {
    console.log('Fetching profiles...');
    const { data, error } = await supabase
        .from('profiles')
        .select('id, name, headline, role, created_at, updated_at')
        .order('updated_at', { ascending: false });

    if (error) {
        console.error('Error fetching profiles:', error);
        return;
    }

    console.log(`Found ${data.length} profiles:`);
    data.forEach(p => {
        console.log(`----------------------------------------`);
        console.log(`ID: ${p.id}`);
        console.log(`Name: ${p.name}`);
        console.log(`Headline: ${p.headline || '(none)'}`);
        console.log(`Role: ${p.role}`);
        console.log(`Updated: ${p.updated_at}`);
    });
}

listProfiles();
