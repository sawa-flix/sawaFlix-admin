require('dotenv').config({ path: '.env' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function test() {
  console.log("Testing fetch submissions...");
  const { data: submissions, error: subError } = await supabase
    .from("verification_submissions")
    .select('*')
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  if (subError) {
    console.error("Submission error:", subError);
    return;
  }
  console.log("Submissions Data:", submissions);
  
  if (!submissions || submissions.length === 0) return;

  const userIds = submissions.map(s => s.creator_id);
  
  console.log("Testing fetch users...");
  const { data: users, error: userError } = await supabase
    .from("users")
    .select("id, username, email, profile_image_url")
    .in("id", userIds);

  if (userError) {
    console.error("User error:", userError);
  } else {
    console.log("Users Data:", users);
  }
}

test().catch(console.error);
