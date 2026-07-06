const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://xjxbjnjspmmpfngbdihd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqeGJqbmpzcG1tcGZuZ2JkaWhkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTExNzgxNiwiZXhwIjoyMDcwNjkzODE2fQ.a7G5CgJpz6FQFG_BistodEpidC_0zPFN6RBx60pldZg'; // service role

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('users').select('*').limit(5);
  console.log('Error:', error);
  console.log('Users:', data);
  
  // also get all auth users
  const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
  console.log('Auth error:', authError);
  console.log('Auth users:', authData?.users?.map(u => ({ email: u.email, id: u.id })));
}

check();
