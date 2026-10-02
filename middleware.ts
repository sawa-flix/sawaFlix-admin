import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from './utils/supabase/middleware'

export default async function middleware(request: NextRequest) {
  // Skip PWA static files — never redirect these
  const pathname = request.nextUrl.pathname;
  if (
    pathname === '/manifest.json' ||
    pathname === '/sw.js' ||
    pathname.startsWith('/icons/')
  ) {
    return NextResponse.next();
  }

  try {
    return await updateSession(request);
  } catch (error) {
    console.error('Middleware auth error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/ (API routes)
     * - manifest.json, sw.js, icons/ (PWA files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|manifest\\.json|sw\\.js|icons|login|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|webm)$).*)',
  ],
}
