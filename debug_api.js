
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testFetch() {
  try {
    const { data: submissions, error } = await supabase
      .from("verification_submissions")
      .select(`
        id,
        creator_id,
        status,
        category,
        created_at,
        form_data
      `)
      .limit(5);

    if (error) {
      console.error("Fetch Error:", JSON.stringify(error, null, 2));
    } else {
      console.log("Submissions Data:", JSON.stringify(submissions, null, 2));
    }
    
    const { data: profiles, error: pError } = await supabase
      .from("creator_profiles")
      .select("id, slug, full_name")
      .limit(5);
      
    if (pError) {
      console.error("Profiles Error:", JSON.stringify(pError, null, 2));
    } else {
      console.log("Profiles Data:", JSON.stringify(profiles, null, 2));
    }
  } catch (err) {
    console.error("Catch Error:", err.message);
  }
}

testFetch();
