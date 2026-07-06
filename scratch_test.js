require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("URL:", supabaseUrl);
console.log("Service Key is Present:", !!serviceKey);

const supabase = createClient(supabaseUrl, serviceKey);

async function check() {
  const userId = 'a97fb999-2fc4-47e6-932c-c48cd388919f';
  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .single();

  console.log('Error:', error);
  console.log('Data:', data);
}

check();
