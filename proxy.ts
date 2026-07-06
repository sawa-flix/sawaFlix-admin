import { NextResponse } from 'next/server'
import { createClient } from './utils/supabase/middleware'
import { type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const { supabase, response } = createClient(request)
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const { pathname } = request.nextUrl;

    const publicRoutes = ["/login", "/sign-up", "/sign-in", "/verify-otp"];
    const authRoutes = ["/login", "/sign-up", "/sign-in"];
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

    // 1. Not logged in
    if (!user) {
      if (isPublicRoute || pathname === '/' || pathname === '/favicon.ico') return response;
      const redirectUrl = new URL("/login", request.url);
      redirectUrl.searchParams.set("redirectedFrom", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // 2. Fetch profile and submission data
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("id, role, verification_status")
      .eq("id", user.id)
      .maybeSingle();

    const { data: submission } = await supabase
      .from("verification_submissions")
      .select("status")
      .eq("creator_id", user.id)
      .maybeSingle();

    if (profileError) console.error("Proxy: profile fetch error:", profileError);

    // 3. Logged in and on auth pages (or home) -> redirect to appropriate dashboard
    if (isAuthRoute || pathname === '/') {
      const role = profile?.role || 'client';
      const isApprovedCreator = role === 'creator' || submission?.status === 'approved';
      
      let target = "/dashboard";
      if (role === 'admin') target = "/admin";
      else if (isApprovedCreator) target = "/creator-dashboard";
      
      return NextResponse.redirect(new URL(target, request.url));
    }

    // 4. Reset/Missing profile safety
    if (!profile) return response;

    // 5. OTP Check for all users except admins
    if (profile.role !== 'admin' && profile.verification_status !== "approved") {
        if (isPublicRoute) return response;
        if (pathname.startsWith("/creator/verify")) return response;
        if (pathname.startsWith("/creator/pending")) return response;
        
        return NextResponse.redirect(new URL("/verify-otp", request.url));
    }

    // 6. Access Control for /creator-dashboard
    if (pathname.startsWith("/creator-dashboard")) {
       const isApprovedCreator = profile.role === "creator" || submission?.status === "approved" || profile.role === 'admin';
       
       if (!isApprovedCreator) {
          return NextResponse.redirect(new URL("/dashboard", request.url));
       }
    }

    // 7. Access Control for /creator/ (Verify/Pending)
    if (pathname.startsWith("/creator/")) {
       const isApprovedCreator = profile.role === "creator" || submission?.status === "approved";
       
       if (isApprovedCreator) {
         return NextResponse.redirect(new URL("/creator-dashboard", request.url));
       }
       
       if (pathname === "/creator/pending") {
         if (!submission || (submission.status !== "pending" && submission.status !== "approved")) {
            return NextResponse.redirect(new URL("/creator/verify", request.url));
         }
       }
    }

    return response;
  } catch (error) {
    console.error('Proxy auth error:', error);
    return response;
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
