'use client';

import { Suspense, useState } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react';
import OtpChallenge from '@/components/Auth/OtpChallenge';
import { SawaflixLoader } from '@/components/SawaflixLogo';
import {
  AdminLoginChallenge,
  startAdminLogin,
  TwoFAError,
} from '@/services/authService';
import { getFriendlyError } from '@/utils/errorMessages';

type LoginStep = 'credentials' | 'challenge' | 'redirecting';

function LoginContent() {
  const searchParams = useSearchParams();
  const urlError = searchParams.get('error');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<LoginStep>('credentials');
  const [challenge, setChallenge] = useState<AdminLoginChallenge | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    urlError ? getFriendlyError(urlError) : null,
  );

  const redirectToAdmin = () => {
    setStep('redirecting');
    window.location.assign('/admin');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const nextChallenge = await startAdminLogin(email, password);
      setChallenge(nextChallenge);
      setPassword('');
      setStep('challenge');
    } catch (loginError) {
      setError(
        loginError instanceof TwoFAError
          ? loginError.message
          : getFriendlyError(loginError),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const cancelChallenge = () => {
    setChallenge(null);
    setStep('credentials');
    setError(null);
  };

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#F8F9FB] p-4 font-inter sm:p-6">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-red-100/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-slate-200/60 blur-3xl" />

      <section className="relative z-10 w-full max-w-md rounded-3xl border border-slate-200/90 bg-white p-7 text-left shadow-xl shadow-slate-200/50 sm:p-9">
        <header className="mb-6 text-center">
          <div className="mb-3 inline-flex rounded-2xl border border-slate-200/80 bg-slate-50 p-3 shadow-2xs">
            <Image
              src="/loaderLogo.png"
              alt="SawaFlix"
              width={40}
              height={40}
              priority
              className="h-10 w-10 object-contain"
            />
          </div>
          <h1 className="text-2xl font-extrabold tracking-normal text-slate-900">
            SawaFlix Admin
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Secure management portal
          </p>
        </header>

        {step === 'redirecting' && (
          <div className="mb-5 flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800">
            <ShieldCheck size={16} className="text-emerald-600" />
            Verification complete. Opening dashboard...
          </div>
        )}

        {error && step === 'credentials' && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-center text-xs font-medium text-rose-800"
          >
            {error}
          </div>
        )}

        {step === 'credentials' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="admin-email"
                className="mb-1.5 block text-xs font-semibold text-slate-700"
              >
                Admin email address
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="username email"
                  required
                  disabled={isLoading}
                  placeholder="admin@sawaflix.com"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 shadow-2xs outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10 disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="mb-1.5 block text-xs font-semibold text-slate-700"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                  disabled={isLoading}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-11 text-sm text-slate-900 shadow-2xs outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10 disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  disabled={isLoading}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 transition hover:text-slate-700"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Checking credentials...
                </>
              ) : (
                <>
                  Continue securely <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>
        )}

        {step === 'challenge' && challenge && (
          <OtpChallenge
            challengeId={challenge.challengeId}
            deliveryAddress={challenge.deliveryAddress}
            expiresInSeconds={challenge.expiresInSeconds}
            onSuccess={redirectToAdmin}
            onCancel={cancelChallenge}
          />
        )}

        <p className="mt-6 text-center text-[11px] text-slate-400">
          Authorized personnel only - SawaFlix Media Network
        </p>
      </section>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F8F9FB]">
          <SawaflixLoader size={48} text="Loading secure sign-in..." />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
