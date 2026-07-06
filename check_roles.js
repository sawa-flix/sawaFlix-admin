const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://xjxbjnjspmmpfngbdihd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqeGJqbmpzcG1tcGZuZ2JkaWhkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTExNzgxNiwiZXhwIjoyMDcwNjkzODE2fQ.a7G5CgJpz6FQFG_BistodEpidC_0zPFN6RBx60pldZg'; // service role

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('users').select('email, role');
  console.log('Error:', error);
  console.log('All users with roles:', data);
}

check();
