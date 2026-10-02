import { createClient } from '@/utils/supabase/client';

const ADMIN_API_URL = (
  process.env.NEXT_PUBLIC_ADMIN_BACKEND_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  'https://sawaflix-backend.onrender.com'
).replace(/\/$/, '');

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

interface ApiErrorBody {
  error?: string;
  message?: string;
  attemptsRemaining?: number;
}

export interface AdminLoginChallenge {
  success: true;
  requiresTwoFactor: true;
  challengeId: string;
  expiresInSeconds: number;
  deliveryAddress: string;
}

interface AdminSessionPayload {
  accessToken: string;
  refreshToken: string;
  expiresAt: number | null;
}

interface VerifyAdminOtpResponse {
  success: true;
  session: AdminSessionPayload;
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

async function readJson(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) return null;
  return response.json();
}

function parseApiError(value: unknown): ApiErrorBody {
  if (!isRecord(value)) return {};
  return {
    error: typeof value.error === 'string' ? value.error : undefined,
    message: typeof value.message === 'string' ? value.message : undefined,
    attemptsRemaining:
      typeof value.attemptsRemaining === 'number'
        ? value.attemptsRemaining
        : undefined,
  };
}

function errorCode(value: string | undefined, status: number): TwoFAErrorCode {
  const knownCodes: TwoFAErrorCode[] = [
    'ACCOUNT_LOCKED',
    'AUTHENTICATION_FAILED',
    'DELIVERY_FAILED',
    'FORBIDDEN',
    'INVALID_CHALLENGE',
    'INVALID_CREDENTIALS',
    'INVALID_OTP',
    'OTP_EXPIRED',
    'RATE_LIMITED',
    'UNAUTHORIZED',
  ];
  if (value && knownCodes.includes(value as TwoFAErrorCode)) {
    return value as TwoFAErrorCode;
  }
  if (status === 401) return 'UNAUTHORIZED';
  if (status === 403) return 'FORBIDDEN';
  if (status === 423) return 'ACCOUNT_LOCKED';
  if (status === 429) return 'RATE_LIMITED';
  return 'UNKNOWN';
}

async function request<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(`${ADMIN_API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init.headers,
    },
  });
  const body = await readJson(response);

  if (!response.ok) {
    const apiError = parseApiError(body);
    throw new TwoFAError(
      errorCode(apiError.error, response.status),
      apiError.message || `Authentication request failed (${response.status}).`,
      apiError.attemptsRemaining,
    );
  }

  return body as T;
}

async function bearerHeaders(): Promise<Record<string, string>> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.access_token) {
    throw new TwoFAError('UNAUTHORIZED', 'Your admin session has expired.');
  }
  return { Authorization: `Bearer ${session.access_token}` };
}

export async function startAdminLogin(
  email: string,
  password: string,
): Promise<AdminLoginChallenge> {
  return request<AdminLoginChallenge>('/api/auth/admin/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function verifyAdminOtp(
  challengeId: string,
  code: string,
): Promise<void> {
  const result = await request<VerifyAdminOtpResponse>(
    '/api/auth/admin/verify-otp',
    {
      method: 'POST',
      body: JSON.stringify({ challengeId, code }),
    },
  );

  const supabase = createClient();
  const { error } = await supabase.auth.setSession({
    access_token: result.session.accessToken,
    refresh_token: result.session.refreshToken,
  });
  if (error) {
    throw new TwoFAError(
      'AUTHENTICATION_FAILED',
      'The verified admin session could not be established. Please sign in again.',
    );
  }
}

export async function resendAdminOtp(
  challengeId: string,
): Promise<ResendAdminOtpResponse> {
  return request<ResendAdminOtpResponse>('/api/auth/admin/resend-otp', {
    method: 'POST',
    body: JSON.stringify({ challengeId }),
  });
}

export async function check2FAStatus(): Promise<TwoFAStatusResult> {
  try {
    return await request<TwoFAStatusResult>('/api/auth/admin/2fa-status', {
      method: 'GET',
      headers: await bearerHeaders(),
    });
  } catch {
    return { success: false, isVerified: false };
  }
}

export async function signOutAdmin(): Promise<void> {
  const supabase = createClient();
  try {
    await request<void>('/api/auth/admin/logout', {
      method: 'POST',
      headers: await bearerHeaders(),
    });
  } finally {
    await supabase.auth.signOut();
  }
}
