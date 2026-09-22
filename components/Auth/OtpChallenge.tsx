'use client';

/**
 * OtpChallenge.tsx
 *
 * A fully self-contained 2FA OTP challenge UI component.
 *
 * Props:
 *   onSuccess   — called when backend confirms isVerified: true
 *   onCancel    — called when the user explicitly goes back to the login form
 *   deliveryAddress — masked destination returned by the backend
 *
 * Internal states:
 *   idle          — initial, waiting for user to type
 *   submitting    — verify request in flight
 *   wrong_code    — INVALID_OTP; shows attemptsRemaining
 *   expired       — OTP_EXPIRED; resend button enabled
 *   locked        — ACCOUNT_LOCKED; all input disabled, countdown/message shown
 *   rate_limited  — 429 on send; brief cooldown message
 *   resending     — send request in flight
 *
 * Countdown:
 *   5-minute window exactly matching backend OTP TTL.
 *   Resend is disabled while the countdown is active AND a live code exists.
 *   After expiry the code clears and resend becomes available.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Mail,
  RefreshCw,
  AlertTriangle,
  Lock,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { resendAdminOtp, verifyAdminOtp, TwoFAError } from '@/services/authService';
import { get2FAFriendlyError } from '@/utils/errorMessages';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DIGIT_COUNT = 6;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ChallengeState =
  | 'idle'
  | 'submitting'
  | 'wrong_code'
  | 'expired'
  | 'locked'
  | 'rate_limited'
  | 'resending'
  | 'success';

export interface OtpChallengeProps {
  /** Called after backend confirms isVerified: true */
  onSuccess: () => void;
  /** Called when user clicks "← Back" to return to login form */
  onCancel: () => void;
  challengeId: string;
  deliveryAddress: string;
  expiresInSeconds: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function OtpChallenge({
  onSuccess,
  onCancel,
  challengeId,
  deliveryAddress,
  expiresInSeconds,
}: OtpChallengeProps) {
  // ----- digit inputs -----
  const [digits, setDigits] = useState<string[]>(Array(DIGIT_COUNT).fill(''));
  const inputRefs = useRef<Array<HTMLInputElement | null>>(Array(DIGIT_COUNT).fill(null));

  // ----- UI state -----
  const [challengeState, setChallengeState] = useState<ChallengeState>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);

  // ----- countdown -----
  const [countdown, setCountdown] = useState<number>(expiresInSeconds);
  const [countdownActive, setCountdownActive] = useState<boolean>(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ----- derived -----
  const code = digits.join('');
  const isComplete = code.length === DIGIT_COUNT;
  const isInputDisabled =
    challengeState === 'submitting' ||
    challengeState === 'locked' ||
    challengeState === 'resending' ||
    challengeState === 'success';
  const isResendDisabled =
    challengeState === 'submitting' ||
    challengeState === 'resending' ||
    challengeState === 'locked' ||
    challengeState === 'success' ||
    (countdownActive && challengeState !== 'expired');

  // ---------------------------------------------------------------------------
  // Countdown timer management
  // ---------------------------------------------------------------------------

  const startCountdown = useCallback((seconds = expiresInSeconds) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCountdown(seconds);
    setCountdownActive(true);

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setCountdownActive(false);
          // Only switch to expired if we haven't already locked out
          setChallengeState((s) => (s !== 'locked' ? 'expired' : s));
          setStatusMessage('Your verification code has expired. Please request a new one.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [expiresInSeconds]);

  useEffect(() => {
    startCountdown(expiresInSeconds);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [expiresInSeconds, startCountdown]);

  // ---------------------------------------------------------------------------
  // Digit input handlers
  // ---------------------------------------------------------------------------

  const handleDigitChange = (index: number, value: string) => {
    if (isInputDisabled) return;

    // Accept only digits
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);

    // Clear any previous error state when typing
    if (challengeState === 'wrong_code' || challengeState === 'expired') {
      setChallengeState('idle');
      setStatusMessage('');
    }

    // Auto-advance to next field
    if (digit && index < DIGIT_COUNT - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when last digit entered
    if (digit && index === DIGIT_COUNT - 1) {
      const fullCode = [...next].join('');
      if (fullCode.length === DIGIT_COUNT) {
        setTimeout(() => handleVerify(fullCode), 50);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      // Jump back on backspace when current field is empty
      const next = [...digits];
      next[index - 1] = '';
      setDigits(next);
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'Enter' && isComplete && !isInputDisabled) {
      handleVerify(code);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, DIGIT_COUNT);
    if (!pasted) return;
    const next = Array(DIGIT_COUNT).fill('');
    pasted.split('').forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    // Focus last filled or last
    const lastIdx = Math.min(pasted.length, DIGIT_COUNT - 1);
    inputRefs.current[lastIdx]?.focus();

    if (pasted.length === DIGIT_COUNT) {
      setTimeout(() => handleVerify(pasted), 50);
    }
  };

  // ---------------------------------------------------------------------------
  // Verify
  // ---------------------------------------------------------------------------

  const handleVerify = useCallback(async (codeToVerify: string) => {
    if (codeToVerify.length !== DIGIT_COUNT) return;
    setChallengeState('submitting');
    setStatusMessage('');

    try {
      await verifyAdminOtp(challengeId, codeToVerify);
      setChallengeState('success');
      if (timerRef.current) clearInterval(timerRef.current);
      setTimeout(onSuccess, 400); // brief pause for success animation
    } catch (err) {
      if (err instanceof TwoFAError) {
        switch (err.code) {
          case 'INVALID_OTP':
            setChallengeState('wrong_code');
            setAttemptsLeft(typeof err.attemptsRemaining === 'number' ? err.attemptsRemaining : null);
            setStatusMessage(get2FAFriendlyError(err));
            // Clear digits so user can re-enter
            setDigits(Array(DIGIT_COUNT).fill(''));
            inputRefs.current[0]?.focus();
            break;
          case 'OTP_EXPIRED':
            setChallengeState('expired');
            setCountdownActive(false);
            if (timerRef.current) clearInterval(timerRef.current);
            setStatusMessage(get2FAFriendlyError(err));
            setDigits(Array(DIGIT_COUNT).fill(''));
            break;
          case 'ACCOUNT_LOCKED':
            setChallengeState('locked');
            if (timerRef.current) clearInterval(timerRef.current);
            setCountdownActive(false);
            setStatusMessage(get2FAFriendlyError(err));
            break;
          default:
            setChallengeState('idle');
            setStatusMessage(get2FAFriendlyError(err));
        }
      } else {
        setChallengeState('idle');
        setStatusMessage('Verification failed. Please try again.');
      }
    }
  }, [challengeId, onSuccess]);

  // ---------------------------------------------------------------------------
  // Resend
  // ---------------------------------------------------------------------------

  const handleResend = useCallback(async () => {
    if (isResendDisabled) return;
    setChallengeState('resending');
    setStatusMessage('');
    setDigits(Array(DIGIT_COUNT).fill(''));

    try {
      const result = await resendAdminOtp(challengeId);
      setChallengeState('idle');
      setAttemptsLeft(null);
      startCountdown(result.expiresInSeconds);
      inputRefs.current[0]?.focus();
    } catch (err) {
      if (err instanceof TwoFAError) {
        switch (err.code) {
          case 'ACCOUNT_LOCKED':
            setChallengeState('locked');
            setStatusMessage(get2FAFriendlyError(err));
            break;
          case 'RATE_LIMITED':
            setChallengeState('rate_limited');
            setStatusMessage(get2FAFriendlyError(err));
            // Auto-clear rate-limited state after 30 s to re-enable resend
            setTimeout(() => {
              setChallengeState((s) => (s === 'rate_limited' ? 'idle' : s));
              setStatusMessage('');
            }, 30_000);
            break;
          default:
            setChallengeState('idle');
            setStatusMessage(get2FAFriendlyError(err));
        }
      } else {
        setChallengeState('idle');
        setStatusMessage('Failed to send a new code. Please try again.');
      }
    }
  }, [challengeId, isResendDisabled, startCountdown]);

  // ---------------------------------------------------------------------------
  // Derived UI helpers
  // ---------------------------------------------------------------------------

  const isLocked = challengeState === 'locked';
  const isSuccess = challengeState === 'success';
  const isWrong = challengeState === 'wrong_code';
  const isExpired = challengeState === 'expired';
  const isRateLimited = challengeState === 'rate_limited';

  const digitBorderClass = (i: number) => {
    if (isLocked) return 'border-rose-300 bg-rose-50';
    if (isSuccess) return 'border-emerald-400 bg-emerald-50';
    if (isWrong) return 'border-rose-400 bg-rose-50/50';
    if (digits[i]) return 'border-slate-700 bg-white';
    return 'border-slate-200 bg-white focus-within:border-slate-700';
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <motion.div
      key="otp-challenge"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="space-y-6"
    >
      {/* ---- Header ---- */}
      <div className="text-center">
        <motion.div
          animate={isSuccess ? { scale: [1, 1.15, 1] } : {}}
          transition={{ duration: 0.4 }}
          className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3 border ${
            isLocked
              ? 'bg-rose-50 border-rose-200'
              : isSuccess
              ? 'bg-emerald-50 border-emerald-200'
              : 'bg-slate-50 border-slate-200'
          }`}
        >
          {isLocked ? (
            <Lock size={24} className="text-rose-500" />
          ) : isSuccess ? (
            <CheckCircle2 size={24} className="text-emerald-500" />
          ) : (
            <ShieldCheck size={24} className="text-slate-700" />
          )}
        </motion.div>

        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
          {isLocked ? 'Account Locked' : isSuccess ? 'Verified!' : 'Security Check'}
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          {isLocked
            ? 'Too many failed attempts.'
            : isSuccess
            ? 'Redirecting to the Admin Dashboard…'
            : deliveryAddress
            ? `A 6-digit code was sent to ${deliveryAddress}`
            : 'Enter the 6-digit code sent to your registered email.'}
        </p>
      </div>

      {/* ---- Countdown Timer ---- */}
      {!isLocked && !isSuccess && (
        <div className="flex items-center justify-center gap-1.5">
          <Clock
            size={13}
            className={countdownActive ? 'text-slate-400' : 'text-rose-400'}
          />
          <span
            className={`text-xs font-semibold tabular-nums ${
              countdown <= 60 && countdownActive ? 'text-rose-500' : 'text-slate-500'
            }`}
          >
            {isExpired ? 'Code expired' : `Code expires in ${formatCountdown(countdown)}`}
          </span>
        </div>
      )}

      {/* ---- Status Banner ---- */}
      <AnimatePresence mode="wait">
        {statusMessage && (
          <motion.div
            key={challengeState + statusMessage}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className={`p-3 rounded-xl text-xs font-medium text-center flex items-start gap-2 ${
                isLocked || isWrong
                  ? 'bg-rose-50 border border-rose-200 text-rose-800'
                  : isExpired
                  ? 'bg-amber-50 border border-amber-200 text-amber-800'
                  : isRateLimited
                  ? 'bg-orange-50 border border-orange-200 text-orange-800'
                  : 'bg-slate-50 border border-slate-200 text-slate-700'
              }`}
            >
              <AlertTriangle size={14} className="shrink-0 mt-0.5" />
              <span className="text-left">{statusMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---- 6-Digit Inputs ---- */}
      <div className="flex justify-center gap-2.5">
        {digits.map((digit, i) => (
          <motion.input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={1}
            value={digit}
            disabled={isInputDisabled}
            onChange={(e) => handleDigitChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={i === 0 ? handlePaste : undefined}
            aria-label={`Digit ${i + 1} of ${DIGIT_COUNT}`}
            id={`otp-digit-${i}`}
            animate={isWrong ? { x: [0, -4, 4, -4, 4, 0] } : {}}
            transition={{ duration: 0.3 }}
            className={`
              w-11 h-14 text-center text-xl font-bold rounded-xl border-2 transition-all
              focus:outline-none focus:ring-2 focus:ring-slate-900/15
              disabled:opacity-50 disabled:cursor-not-allowed
              ${digitBorderClass(i)}
            `}
          />
        ))}
      </div>

      {/* ---- Attempts Remaining (INVALID_OTP) ---- */}
      {isWrong && attemptsLeft !== null && (
        <p className="text-center text-xs text-rose-600 font-semibold">
          {attemptsLeft === 0
            ? 'No more attempts remaining.'
            : `${attemptsLeft} attempt${attemptsLeft === 1 ? '' : 's'} remaining before lockout.`}
        </p>
      )}

      {/* ---- Verify Button (shown when not auto-submitting) ---- */}
      {!isLocked && !isSuccess && (
        <button
          type="button"
          onClick={() => handleVerify(code)}
          disabled={!isComplete || isInputDisabled}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-semibold text-sm shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          id="otp-verify-btn"
        >
          {challengeState === 'submitting' ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              <span>Verifying…</span>
            </>
          ) : (
            <>
              <ShieldCheck size={15} />
              <span>Verify Code</span>
            </>
          )}
        </button>
      )}

      {/* ---- Resend Row ---- */}
      {!isLocked && !isSuccess && (
        <div className="flex items-center justify-between">
          {/* Back to login */}
          <button
            type="button"
            onClick={onCancel}
            disabled={
              challengeState === 'submitting' ||
              challengeState === 'resending'
            }
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            id="otp-back-btn"
          >
            <ArrowLeft size={13} />
            Back
          </button>

          {/* Resend code */}
          <button
            type="button"
            onClick={handleResend}
            disabled={isResendDisabled}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            id="otp-resend-btn"
          >
            {challengeState === 'resending' ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                Sending…
              </>
            ) : (
              <>
                <RefreshCw size={13} className={countdownActive ? '' : 'text-slate-900'} />
                {countdownActive
                  ? `Resend in ${formatCountdown(countdown)}`
                  : 'Resend code'}
              </>
            )}
          </button>
        </div>
      )}

      {/* ---- Locked: contact support note ---- */}
      {isLocked && (
        <div className="text-center">
          <p className="text-xs text-slate-500">
            Please wait 15 minutes and try again, or contact{' '}
            <a
              href="mailto:support@sawaflix.com"
              className="underline text-slate-700 hover:text-slate-900"
            >
              support@sawaflix.com
            </a>
          </p>
          <button
            type="button"
            onClick={onCancel}
            className="mt-3 flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 transition-colors mx-auto"
            id="otp-locked-back-btn"
          >
            <ArrowLeft size={13} />
            Back to Login
          </button>
        </div>
      )}
    </motion.div>
  );
}
