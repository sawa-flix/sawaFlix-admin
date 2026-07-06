import { createClient } from "../utils/supabase/server";

export async function getUserProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch profile from users table
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  // Fetch submission status from verification_submissions
  const { data: submission } = await supabase
    .from('verification_submissions')
    .select('status')
    .eq('creator_id', user.id)
    .maybeSingle();

  return {
    ...(profile || {
        id: user.id,
        email: user.email,
        username: user.email?.split('@')[0],
        category: "viewer",
    }),
    verificationStatus: submission?.status || 'none'
  };
}
