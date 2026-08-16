import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/admin';

  if (code) {
    const supabase = await createClient();
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && session?.user) {
      // Confirm the user has admin role
      const adminSupabase = await createAdminClient();
      const { data: userData, error: roleError } = await adminSupabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (roleError || userData?.role !== 'admin') {
        // Sign out if not admin
        await supabase.auth.signOut();
        return NextResponse.redirect(`${origin}/login?error=Access denied. Admin privileges required.`);
      }

      const forwardUrl = next.startsWith('/') ? `${origin}${next}` : `${origin}/admin`;
      return NextResponse.redirect(forwardUrl);
    }
  }

  // Return the user to an error page or login with an error
  return NextResponse.redirect(`${origin}/login?error=Could not authenticate with Google.`);
}
