const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xjxbjnjspmmpfngbdihd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqeGJqbmpzcG1tcGZuZ2JkaWhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMTc4MTYsImV4cCI6MjA3MDY5MzgxNn0.ypBgjbNyptFwP_tsETjGTwCWzacfq62l9YyCH1P-gKw'; // anon role

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSignIn() {
  console.log("Attempting sign in...");
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'desleyboyema@gmail.com',
    password: 'wrongpassword123',
  });
  
  if (error) {
    console.log("ERROR RETURNED:", error.message);
  } else {
    console.log("SUCCESS:", data.user.id);
  }
}

testSignIn();
