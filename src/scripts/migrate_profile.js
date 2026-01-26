
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

const SOURCE_ID = '33138ece-08b8-4d6b-87bd-a7fc07ae40ce'; // The one with data
const TARGET_ID = '979456f7-e3cc-48e3-a901-827b8d037289'; // The new empty one

async function migrateProfile() {
    console.log(`Migrating from ${SOURCE_ID} to ${TARGET_ID}...`);

    // 1. Fetch Source Data
    const { data: sourceProfile, error: sourceError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', SOURCE_ID)
        .single();

    if (sourceError) {
        console.error('Error fetching source:', sourceError);
        return;
    }

    if (!sourceProfile) {
        console.error('Source profile not found!');
        return;
    }

    console.log('Found source profile:', sourceProfile.headline);

    // 2. Prepare Update Data (Remove ID and create audit fields)
    const { id, created_at, updated_at, ...dataToCopy } = sourceProfile;

    // 3. Update Target
    const { data: updatedTarget, error: updateError } = await supabase
        .from('profiles')
        .update({
            ...dataToCopy,
            updated_at: new Date().toISOString()
        })
        .eq('id', TARGET_ID)
        .select();

    if (updateError) {
        console.error('Error updating target:', updateError);
        return;
    }

    console.log('Migration successful!');
    console.log('Updated profile:', updatedTarget);
}

migrateProfile();
