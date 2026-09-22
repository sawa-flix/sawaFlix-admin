/**
 * Maps raw technical error messages to user-friendly messages.
 * Used across all admin components to avoid exposing internal details to users.
 */

const ERROR_MAP: { pattern: RegExp; message: string }[] = [
  // Supabase / Auth errors
  { pattern: /invalid api key/i, message: "Unable to connect to the server. Please contact support." },
  { pattern: /invalid login credentials/i, message: "Incorrect email or password. Please try again." },
  { pattern: /email not confirmed/i, message: "Your email has not been verified. Please check your inbox." },
  { pattern: /user not found/i, message: "No account found with this email address." },
  { pattern: /signup is disabled/i, message: "Account registration is currently disabled." },
  { pattern: /rate limit/i, message: "Too many attempts. Please wait a moment and try again." },
  { pattern: /jwt expired/i, message: "Your session has expired. Please sign in again." },
  { pattern: /refresh_token_not_found/i, message: "Your session has expired. Please sign in again." },
  { pattern: /invalid claim|invalid token/i, message: "Authentication error. Please sign in again." },
  
  // Network / Fetch errors
  { pattern: /failed to fetch|network/i, message: "Network error. Please check your internet connection and try again." },
  { pattern: /timeout|timed out/i, message: "The request timed out. Please try again." },
  { pattern: /cors|cross-origin/i, message: "Connection blocked. Please contact support." },
  
  // HTTP status errors
  { pattern: /401|unauthorized/i, message: "You are not authorized. Please sign in again." },
  { pattern: /403|forbidden/i, message: "You do not have permission to perform this action." },
  { pattern: /404|not found/i, message: "The requested resource was not found." },
  { pattern: /500|internal server/i, message: "Something went wrong on our end. Please try again later." },
  { pattern: /502|bad gateway/i, message: "The server is temporarily unavailable. Please try again later." },
  { pattern: /503|service unavailable/i, message: "The service is temporarily down for maintenance. Please try again later." },

  // Admin-specific
  { pattern: /access denied.*admin/i, message: "Access denied. Admin privileges are required to access this portal." },

  // 2FA-specific (pattern-matched on error code strings embedded in messages)
  { pattern: /ACCOUNT_LOCKED/,  message: "Your account has been locked after too many incorrect attempts. Please wait 15 minutes and try again." },
  { pattern: /OTP_EXPIRED/,     message: "Your verification code has expired. Please request a new one." },
  { pattern: /INVALID_OTP/,     message: "Incorrect verification code. Please check the code and try again." },
  { pattern: /RATE_LIMITED|429|too many.*code/i, message: "Too many code requests. Please wait a moment before requesting a new code." },
  { pattern: /2FA_REQUIRED/,    message: "Two-factor verification is required. Please complete the security check." },
];

export function getFriendlyError(rawError: string | Error | unknown): string {
  const message = rawError instanceof Error ? rawError.message : String(rawError || '');
  
  for (const { pattern, message: friendly } of ERROR_MAP) {
    if (pattern.test(message)) {
      return friendly;
    }
  }

  // Fallback: if the message looks technical (contains code-like terms), hide it
  if (/key|token|jwt|api|null|undefined|supabase|postgres|sql/i.test(message)) {
    return "Something went wrong. Please try again or contact support.";
  }

  // If it's already somewhat readable, return it as-is
  return message || "An unexpected error occurred. Please try again.";
}

// ---------------------------------------------------------------------------
// 2FA-specific structured error helper
// ---------------------------------------------------------------------------

import type { TwoFAError } from '@/services/authService';

/**
 * Returns a user-friendly message for a TwoFAError, with optional
 * `attemptsRemaining` appended when the backend provides it.
 */
export function get2FAFriendlyError(err: TwoFAError): string {
  const base = getFriendlyError(err.code); // reuse existing pattern map
  if (err.code === 'INVALID_OTP' && typeof err.attemptsRemaining === 'number') {
    return `${base} ${err.attemptsRemaining} attempt${err.attemptsRemaining === 1 ? '' : 's'} remaining.`;
  }
  return base;
}
