
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
        creator_id,
        status,
        category,
        created_at,
        form_data,
        users (
          email,
          username
        )
      `, { count: "exact" })
      .eq("status", "approved")
      .limit(1);

    if (error) {
      console.error("Fetch Error:", JSON.stringify(error, null, 2));
    } else {
      console.log("Fetch Success:", JSON.stringify(submissions, null, 2));
    }
  } catch (err) {
    console.error("Catch Error:", err.message);
  }
}

testFetch();
