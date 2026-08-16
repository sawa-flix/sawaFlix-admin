import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'
import { copySetCookies } from './cookies'

export async function updateSession(request: NextRequest) {
  const isDev = process.env.NODE_ENV === 'development'
  let supabaseResponse = NextResponse.next({
    request,
  })

  const { pathname } = request.nextUrl;

  // Skip middleware completely for the auth callback to prevent cookie interference during PKCE exchange
  if (pathname.startsWith('/auth/callback')) {
    return supabaseResponse;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    if (isDev) {
      console.warn('Missing Supabase environment variables in Middleware.');
    }
    return supabaseResponse;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          supabaseResponse = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          supabaseResponse.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          supabaseResponse = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          supabaseResponse.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data, error } = await supabase.auth.getUser()
  const user = data?.user;

  if (isDev) console.log(`[Middleware] Path: ${request.nextUrl.pathname}, User Found: ${!!user}`);
  if (isDev && !user && request.cookies.getAll().length > 0) {
    console.log(`[Middleware] Cookies present but no user!`, request.cookies.getAll().map(c => c.name));
  }

  if (error && error.message !== 'Auth session missing!') {
    console.error('Middleware getUser error:', error.message);

    // If the refresh token is stale/invalid, the cookie is corrupted.
    // Clear it and redirect to login — otherwise the user gets stuck in an infinite loop.
    if (
      error.message.includes('refresh_token_not_found') ||
      error.message.includes('Invalid Refresh Token') ||
      error.message.includes('does not exist')
    ) {
      const loginUrl = new URL('/login', request.url);
      const response = NextResponse.redirect(loginUrl);
      // Delete the stale auth cookie so the next visit is clean
      const authCookieName = `sb-${supabaseUrl.replace('https://', '').split('.')[0]}-auth-token`;
      response.cookies.delete(authCookieName);
      response.cookies.delete(`${authCookieName}.0`);
      response.cookies.delete(`${authCookieName}.1`);
      return response;
    }
  }

  // Helper for redirection that preserves cookies exactly
  const redirectWithCookies = (url: URL | string) => {
    const targetUrl = new URL(url, request.url);
    const redirectResponse = NextResponse.redirect(targetUrl);

    copySetCookies(supabaseResponse, redirectResponse)

    if (isDev) console.log(`Middleware Redirecting to ${url} from ${pathname}`);
    return redirectResponse;
  };

  // 1. Not logged in — redirect to /login (admin-only, so all routes are protected)
  if (!user) {
    if (pathname === '/login' || pathname === '/favicon.ico') return supabaseResponse;
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirectedFrom', pathname);
    if (isDev) console.log(`No user, redirecting to login from ${pathname}.`);
    return redirectWithCookies(redirectUrl);
  }

  return supabaseResponse;
}