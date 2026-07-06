export async function getValidToken(supabase, userId) {
  const { data: user, error } = await supabase
    .from('users')
    .select('google_access_token, google_refresh_token, updated_at')
    .eq('id', userId)
    .single();

  // Basic check: Is the token older than 50 minutes? (YouTube tokens last 60)
  const isExpired = new Date() - new Date(user.updated_at) > 50 * 60 * 1000;

  if (!isExpired) return user.google_access_token;

  // If expired, ask Google for a new one
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: user.google_refresh_token,
    }),
  });

  const tokens = await response.json();

  // Update Supabase with the new short-lived token
  await supabase
    .from('users')
    .update({ 
      google_access_token: tokens.access_token, 
      updated_at: new Date().toISOString() 
    })
    .eq('id', userId);

  return tokens.access_token;
}