import { createClient } from '@/utils/supabase/client';

const ADMIN_API_URL = (
  process.env.NEXT_PUBLIC_ADMIN_BACKEND_URL ||
  'https://adminapi.sawaflix.com'
).replace(/\/$/, '');

// ─── Error types ─────────────────────────────────────────────────────────────

export type TwoFAErrorCode =
  | 'ACCOUNT_LOCKED'
  | 'AUTHENTICATION_FAILED'
  | 'DELIVERY_FAILED'
  | 'FORBIDDEN'
  | 'INVALID_CHALLENGE'
  | 'INVALID_CREDENTIALS'
  | 'INVALID_OTP'
  | 'OTP_EXPIRED'
  | 'RATE_LIMITED'
  | 'UNAUTHORIZED'
  | 'UNKNOWN';

// Kept for backward-compat with OtpChallenge component (not used in this flow)
export interface AdminLoginChallenge {
  success: true;
  requiresTwoFactor: boolean;
  challengeId: string;
  expiresInSeconds: number;
  deliveryAddress: string;
}

export interface ResendAdminOtpResponse {
  success: true;
  challengeId: string;
  expiresInSeconds: number;
  deliveryAddress: string;
}

export interface TwoFAStatusResult {
  success: boolean;
  isVerified: boolean;
}

export class TwoFAError extends Error {
  constructor(
    public readonly code: TwoFAErrorCode,
    message: string,
    public readonly attemptsRemaining?: number,
  ) {
    super(message);
    this.name = 'TwoFAError';
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

// ─── Core admin login ─────────────────────────────────────────────────────────
// Admin backend: POST /api/auth/login → { token, user }
// No OTP/2FA — direct JWT returned. We set the Supabase session from it
// then the login page immediately redirects to /admin.

export async function startAdminLogin(
  email: string,
  password: string,
): Promise<AdminLoginChallenge> {
  const response = await fetch(`${ADMIN_API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    const errBody = isRecord(body) ? body : {};
    const message =
      typeof errBody.error === 'string'
        ? errBody.error
        : `Authentication request failed (${response.status}).`;

    const code: TwoFAErrorCode =
      response.status === 401
        ? 'INVALID_CREDENTIALS'
        : response.status === 403
        ? 'FORBIDDEN'
        : response.status === 423
        ? 'ACCOUNT_LOCKED'
        : response.status === 429
        ? 'RATE_LIMITED'
        : 'UNKNOWN';

    throw new TwoFAError(code, message);
  }

  // Extract JWT from response body
  const token: string =
    isRecord(body) && typeof body.token === 'string' ? body.token : '';

  if (!token) {
    throw new TwoFAError('AUTHENTICATION_FAILED', 'No token received from server.');
  }

  // Set the Supabase session so middleware + protected routes recognise the user
  const supabase = createClient();
  const { error: sessionError } = await supabase.auth.setSession({
    access_token: token,
    refresh_token: token, // admin backend issues a single JWT; use it as refresh too
  });

  if (sessionError) {
    console.warn('[authService] setSession warning:', sessionError.message);
    // Fallback: store token directly so API calls can use it
    if (typeof window !== 'undefined') {
      localStorage.setItem('adminToken', token);
    }
  }

  // Return a resolved challenge with requiresTwoFactor=false so the login
  // page skips the OTP screen and goes straight to redirectToAdmin()
  return {
    success: true,
    requiresTwoFactor: false,
    challengeId: 'DIRECT_LOGIN',
    expiresInSeconds: 3600,
    deliveryAddress: email,
  };
}

// ─── OTP stubs (not applicable — admin backend has no OTP flow) ───────────────

export async function verifyAdminOtp(
  _challengeId: string,
  _code: string,
): Promise<void> {
  // No-op: admin backend uses direct JWT, no OTP step
}

export async function resendAdminOtp(
  _challengeId: string,
): Promise<ResendAdminOtpResponse> {
  throw new TwoFAError('UNKNOWN', 'OTP is not supported on the admin backend.');
}

export async function check2FAStatus(): Promise<TwoFAStatusResult> {
  return { success: true, isVerified: true };
}

// ─── Sign out ─────────────────────────────────────────────────────────────────

export async function signOutAdmin(): Promise<void> {
  const supabase = createClient();
  if (typeof window !== 'undefined') {
    localStorage.removeItem('adminToken');
  }
  await supabase.auth.signOut();
}
