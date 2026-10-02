const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://xjxbjnjspmmpfngbdihd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqeGJqbmpzcG1tcGZuZ2JkaWhkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTExNzgxNiwiZXhwIjoyMDcwNjkzODE2fQ.a7G5CgJpz6FQFG_BistodEpidC_0zPFN6RBx60pldZg';
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data: { users }, error } = await supabase.auth.admin.listUsers();
  if (error) {
    console.error(error);
    return;
  }
  
  console.log('Total Auth Users:', users.length);
  
  const googleUsers = users.filter(u => 
    u.app_metadata?.provider === 'google' || 
    (u.app_metadata?.providers && u.app_metadata.providers.includes('google'))
  );
  
  console.log('\n--- GOOGLE USERS ---');
  for (const u of googleUsers) {
    const { data: dbUser } = await supabase.from('users').select('role').eq('id', u.id).single();
    console.log(`ID: ${u.id}`);
    console.log(`Email: ${u.email}`);
    console.log(`DB Role: ${dbUser ? dbUser.role : 'NOT IN PUBLIC.USERS TABLE'}`);
    console.log('---');
  }
}
main();
