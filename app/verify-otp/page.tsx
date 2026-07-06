'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Suspense } from 'react';
import {
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RefreshCcw,
  ChevronLeft
} from 'lucide-react';

import { createClient } from '@/utils/supabase/client';

const RESEND_TIMER_SECONDS = 60; // 1 Minute to resend
const EXPIRY_TIMER_SECONDS = 300; // 5 Minutes for code expiry

const VerifyOtpPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlEmail = searchParams.get('email');

  // --- State Management ---
  const [step, setStep] = useState<'email' | 'otp'>(urlEmail ? 'otp' : 'email');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [email, setEmail] = useState(urlEmail || '');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);
  const [expiryTimer, setExpiryTimer] = useState(0);
  const [hasAutoSent, setHasAutoSent] = useState(false);

  // Refs for OTP inputs
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // --- Logic: Auto-send OTP if email in URL ---
  useEffect(() => {
    if (urlEmail && !hasAutoSent) {
      setHasAutoSent(true);
      handleSendOtp();
    }
  }, [urlEmail, hasAutoSent]);

  // --- Logic: Timer ---
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0 || expiryTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
        setExpiryTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer, expiryTimer]);

  // --- Logic: API Handlers ---
  const handleSendOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        setStep('otp');
        setResendTimer(RESEND_TIMER_SECONDS);
        setExpiryTimer(EXPIRY_TIMER_SECONDS);
        setMessage({ type: 'success', text: `Verification code sent to ${email}.` });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to send OTP.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Connection error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const otpString = otp.join('');

    if (otpString.length < 6) {
      setMessage({ type: 'error', text: 'Please enter the 6-digit code.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otpString }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: data.message || 'Account verified! Redirecting...' });
        setTimeout(() => {
          data.pendingReview ? router.push('/creator/pending') : router.push('/dashboard');
        }, 2000);
      } else {
        setMessage({ type: 'error', text: data.error || 'Invalid or expired code.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Verification failed. Try again.' });
    } finally {
      setLoading(false);
    }
  };

  // --- Logic: OTP Input Interaction ---
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
    const newOtp = [...otp];
    pastedData.forEach((char, idx) => { if (/^\d$/.test(char)) newOtp[idx] = char; });
    setOtp(newOtp);
    const nextIdx = Math.min(pastedData.length, 5);
    inputRefs.current[nextIdx]?.focus();
  };

  return (
    <div className="h-screen w-full relative overflow-hidden font-inter">
      {/* Background Image (Same as Signup) */}
      <Image
        src="/hero-bg.png"
        alt="Background"
        fill
        quality={100}
        className="z-0 object-cover"
        priority
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black opacity-75 z-10"></div>

      {/* Branding Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center px-6 h-14 bg-transparent backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-600 rounded-md flex items-center justify-center shadow-lg shadow-red-600/20">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <span className="text-white font-black tracking-tight text-xl">
            Sawa<span className="text-red-500">flix</span>
          </span>
        </div>
      </header>

      <main className="relative z-20 flex items-center justify-center h-screen px-4 pt-14">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-red-500/10">

              <AnimatePresence mode="wait">
                {step === 'email' ? (
                  /* --- EMAIL STEP --- */
                  <motion.div
                    key="email-step"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-8">
                      <h1 className="text-3xl font-black text-white mb-2">Welcome Back</h1>
                      <p className="text-gray-400 text-sm">Enter your email to receive a secure code.</p>
                    </div>

                    <form onSubmit={handleSendOtp} className="space-y-5">
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-red-500 transition-colors">
                          <Mail size={18} />
                        </div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-red-500/60 focus:ring-4 focus:ring-red-500/10 transition-all placeholder:text-gray-600"
                          required
                          disabled={loading}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading || !email}
                        className="w-full bg-red-700 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all text-sm uppercase tracking-widest active:scale-[0.98] shadow-lg shadow-red-900/20"
                      >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : (
                          <>Send Code <ArrowRight size={18} /></>
                        )}
                      </button>
                    </form>
                  </motion.div>
                ) : (
                  /* --- OTP STEP --- */
                  <motion.div
                    key="otp-step"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-6 flex items-start justify-between">
                      <div>
                        <h1 className="text-3xl font-black text-white mb-2">Verify OTP</h1>
                        <p className="text-gray-400 text-sm">
                          Sent to <span className="text-white font-bold">{email}</span>
                        </p>
                      </div>
                      <button
                        onClick={() => { setStep('email'); setMessage(null); }}
                        className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400"
                      >
                        <ChevronLeft size={24} />
                      </button>
                    </div>

                    <div className="text-center mb-6">
                      <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest bg-white/5 py-2 px-4 rounded-full inline-block">
                        Expires in <span className="text-red-500 tabular-nums">
                          {Math.floor(expiryTimer / 60)}:{String(expiryTimer % 60).padStart(2, '0')}
                        </span>
                      </p>
                    </div>

                    <form onSubmit={handleVerifyOtp} className="space-y-8">
                      <div className="flex justify-between gap-2" onPaste={handlePaste}>
                        {otp.map((digit, idx) => (
                          <input
                            key={idx}
                            ref={(el) => { inputRefs.current[idx] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(idx, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(idx, e)}
                            className="w-12 h-14 text-center text-2xl font-black bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all text-white"
                            disabled={loading}
                          />
                        ))}
                      </div>

                      <div className="space-y-4">
                        <button
                          type="submit"
                          disabled={loading || otp.join('').length < 6}
                          className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all uppercase tracking-widest active:scale-[0.98]"
                        >
                          {loading ? <Loader2 className="animate-spin" size={20} /> : (
                            <>Verify Account <Lock size={18} /></>
                          )}
                        </button>

                        <div className="text-center">
                          {resendTimer === 0 ? (
                            <button
                              type="button"
                              onClick={handleSendOtp}
                              className="text-red-500 hover:text-red-400 text-xs font-bold underline underline-offset-4 flex items-center justify-center gap-2 mx-auto transition-all"
                            >
                              <RefreshCcw size={14} /> Resend New Code
                            </button>
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Wait <span className="text-white">{resendTimer}s</span> to resend</p>
                                <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-red-600 transition-all duration-1000" 
                                        style={{ width: `${(resendTimer / RESEND_TIMER_SECONDS) * 100}%` }}
                                    />
                                </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* --- Feedback Banner --- */}
              <AnimatePresence>
                {message && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`mt-6 p-4 rounded-2xl border flex items-center gap-3 ${message.type === 'success'
                        ? 'bg-green-500/10 border-green-500/20 text-green-400'
                        : 'bg-red-500/10 border-red-500/20 text-red-400'
                      }`}
                  >
                    {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    <p className="text-xs font-bold leading-tight">{message.text}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          <p className="text-center text-gray-600 text-[10px] mt-8 uppercase tracking-[0.2em] font-bold opacity-40">
            Protected by Sawaflix Identity Guard
          </p>
        </motion.div>
      </main>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
        .font-inter { font-family: 'Inter', sans-serif; }
      `}</style>
    </div>
  );
};

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="h-screen w-full bg-black flex items-center justify-center text-white">Loading...</div>}>
      <VerifyOtpPageContent />
    </Suspense>
  );
}