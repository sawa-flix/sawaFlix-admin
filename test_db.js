
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load .env.local
dotenv.config({ path: path.join(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function inspectPolicies() {
    const { data, error } = await supabase.rpc('inspect_rls_policies'); // or just query pg_policies if possible via rpc or something

    if (error) {
        // If RPC doesn't exist, try raw SQL if it's possible through standard client (usually not for pg_policies)
        // Actually, service role key MIGHT allow us to query pg_policies if we use the right interface
        // but the JS client is restricted to postgrest.

        // Let's try to query pg_policies via a generic query if possible, but the client doesn't support that directly.
        // However, we can use the pg library if we had the connection string.

        console.error('Error fetching policies:', error);
    } else {
        console.log(JSON.stringify(data, null, 2));
    }
}

// Since we might not have the RPC, let's try to get ALL tables first to see if we can reach it
async function checkConnection() {
    const { data, error } = await supabase.from('users').select('*').limit(1);
    if (error) {
        console.error('Connection failed:', error);
    } else {
        console.log('Successfully connected to users table');
    }
}

checkConnection();
