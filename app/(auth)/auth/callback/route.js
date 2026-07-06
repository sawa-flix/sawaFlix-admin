// app/auth/callback/route.js - SIMPLIFIED VERSION
import { createClient } from '../../../../utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const type = requestUrl.searchParams.get('type')

    console.log('🔵 CALLBACK RECEIVED:', {
      code: code ? `YES (${code.substring(0, 8)}...)` : 'NO',
      type: type || 'none',
      fullUrl: requestUrl.toString()
    })

    // STEP 1: If there's NO code at all, it's invalid
    if (!code) {
      console.log('🔴 No code parameter - invalid callback')
      return NextResponse.redirect(new URL('/login?error=invalid_reset_link', request.url))
    }

    // STEP 2: ALWAYS treat password reset links specially
    // Check ALL possible indicators of password reset
    const isPasswordReset =
      type === 'recovery' ||
      requestUrl.searchParams.has('token_hash') ||
      requestUrl.searchParams.has('recovery') ||
      code.includes('reset') || // Some codes contain "reset"
      code.includes('recovery') || // Some codes contain "recovery"
      requestUrl.searchParams.toString().includes('recovery') ||
      requestUrl.searchParams.toString().includes('reset')

    if (isPasswordReset) {
      console.log('🟡 PASSWORD RESET DETECTED - Redirecting to /update-password')

      const redirectUrl = new URL('/update-password', request.url)

      // Copy EVERYTHING from the original URL
      requestUrl.searchParams.forEach((value, key) => {
        redirectUrl.searchParams.set(key, value)
      })

      console.log('🟡 Redirect URL:', redirectUrl.toString())
      return NextResponse.redirect(redirectUrl)
    }

    // STEP 3: If we're not sure, still send to update-password for safety
    // Most codes without type are password resets
    if (code && !type) {
      console.log('🟡 CODE WITHOUT TYPE - Assuming password reset')

      const redirectUrl = new URL('/update-password', request.url)
      redirectUrl.searchParams.set('code', code)

      console.log('🟡 Redirect URL:', redirectUrl.toString())
      return NextResponse.redirect(redirectUrl)
    }

    // STEP 4: Regular OAuth/sign-in flows (has type but not recovery)
    if (code && type && type !== 'recovery') {
      console.log('🟢 REGULAR AUTH FLOW - Exchanging code')
      const supabase = await createClient()

      try {
        const { data: { session }, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

        if (exchangeError) {
          console.error('🔴 Exchange failed:', exchangeError.message)

          // If exchange fails, it might be an expired password reset
          // Redirect to update-password with error
          const redirectUrl = new URL('/update-password', request.url)
          redirectUrl.searchParams.set('code', code)
          redirectUrl.searchParams.set('error', 'expired_link')
          return NextResponse.redirect(redirectUrl)
        }

        // After successful auth, ensure user exists in public.users table
        try {
          const { data: { user } } = await supabase.auth.getUser()

          if (session) {
            const user = session.user
            const googleToken = session.provider_token
            const googleRefreshToken = session.provider_refresh_token

            console.log(" user and Youtube token tp users table")

            const platformRole = user.user_metadata?.category || user.user_metadata?.role || 'client';

            const { error: syncError } = await supabase
              .from('users')
              .upsert({
                id: user.id,
                email: user.email,
                username: user.user_metadata.full_name || user.user_metadata?.username || user.email || 'Anonymous',
                role: platformRole === 'creator' ? 'creator' : 'viewer',
                platform_role: platformRole === 'creator' ? 'artist' : 'client',
                google_access_token: googleToken,
                google_refresh_token: googleRefreshToken,
                updated_at: new Date().toISOString(),
              }, { onConflict: 'id' })

            if (syncError) console.error('Token synnc warning:', syncError.message)
          }
        } catch (syncErr) {
          console.error('🟡 User sync error (non-fatal):', syncErr.message)
          // Don't fail the auth flow if sync fails
        }

        console.log('🟢 Auth successful, redirecting to /dashboard')
        return NextResponse.redirect(new URL('/dashboard', request.url))

      } catch (exchangeErr) {
        console.error('🔴 Exchange error:', exchangeErr)
        return NextResponse.redirect(new URL('/login?error=auth_failed', request.url))
      }
    }

    // STEP 5: Fallback - send to update-password
    console.log('🟡 FALLBACK - Sending to update-password')
    const redirectUrl = new URL('/update-password', request.url)
    requestUrl.searchParams.forEach((value, key) => {
      redirectUrl.searchParams.set(key, value)
    })
    return NextResponse.redirect(redirectUrl)

  } catch (error) {
    console.error('🔴 CALLBACK ERROR:', error)
    return NextResponse.redirect(
      new URL(`/login?error=callback_error&details=${encodeURIComponent(error.message)}`, request.url)
    )
  }
}