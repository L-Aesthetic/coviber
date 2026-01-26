
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

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function checkSchema() {
    console.log('Checking profiles structure...');

    // Attempt to insert a dummy row to trigger column errors if possible, 
    // or just fetch one row to see keys.
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error fetching profile:', error);
        return;
    }

    if (data.length > 0) {
        console.log('Existing Columns:', Object.keys(data[0]));
    } else {
        console.log('No profiles found, cannot infer columns from data.');
    }

    console.log('\nTrying to upsert archetype to see specific error...');
    const { error: upsertError } = await supabase
        .from('profiles')
        .upsert({
            id: '00000000-0000-0000-0000-000000000000', // Dummy UUID
            archetype: 'Test'
        });

    if (upsertError) {
        console.log('Upsert Error:', upsertError);
    } else {
        console.log('Upsert with archetype succesful (dummy row created).');
    }
}

checkSchema();
