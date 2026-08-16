'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { createClient } from '@/utils/supabase/client';
import { getFriendlyError } from '@/utils/errorMessages';
import { checkAdminRole } from '@/app/actions/auth';

const supabase = createClient();

const AuthButton = ({ children, isLoading, variant = 'primary', className = '', ...props }: any) => {
  const baseStyles = "w-full flex items-center justify-center font-bold py-2.5 sm:py-3 px-4 rounded-xl transition-all duration-300 transform active:scale-95 disabled:transform-none disabled:cursor-not-allowed shadow-lg";

  const variants = {
    primary: "bg-red-700 hover:bg-red-600 disabled:bg-red-900 text-white hover:shadow-red-500/70 hover:scale-[1.02]",
    google: "bg-gray-900 border border-gray-700 text-white hover:bg-gray-800 hover:shadow-red-500/30",
  };

  return (
    <button
      disabled={isLoading}
      className={`${baseStyles} ${variants[variant as keyof typeof variants]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        children
      )}
    </button>
  );
};

function LoginContent() {
  const searchParams = useSearchParams();
  const urlError = searchParams.get('error');
  const [error, setError] = useState<string | null>(urlError ? getFriendlyError(urlError) : null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setError(null);
    setSuccessMessage(null);
    setIsGoogleLoading(true);
    try {
      const redirectTo = `${window.location.origin}/auth/callback`;
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (oauthError) {
        throw oauthError;
      }
    } catch (err: any) {
      console.error('Google Sign In error:', err);
      setError(getFriendlyError(err));
      setIsGoogleLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);
    setIsRedirecting(false);

    try {
      // Step 1: Sign in using standard Supabase Auth
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      // Step 2: Confirm they are actually an admin by checking users table via Server Action (bypasses RLS)
      const { role, error: roleError } = await checkAdminRole(data.user.id);

      if (roleError) {
        console.warn('Could not fetch role via Server Action, continuing anyway', roleError);
      }

      if (role !== 'admin') {
        await supabase.auth.signOut();
        throw new Error('Access denied. Admin privileges required.');
      }

      setSuccessMessage('Admin Login successful, redirecting...');
      setIsRedirecting(true);
      
      setTimeout(() => {
        window.location.href = '/admin';
      }, 500);

    } catch (err: any) {
      console.error('Login error:', err);
      setError(getFriendlyError(err));
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full relative overflow-hidden font-inter bg-black">
      <div className="absolute inset-0 bg-black opacity-70 z-10"></div>

      <div className="relative z-20 flex items-center justify-center h-screen px-4 py-4 sm:px-6 lg:px-8">
        <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl shadow-red-500/50">
          <div className="absolute inset-0 z-0 animate-spin-border-gradient" style={{
            background: 'conic-gradient(from var(--angle), #000000 0%, #ff0000 10%, #8b0000 20%, #000000 30%, #000000 100%)',
            borderRadius: '1.5rem',
            padding: '2px',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude'
          }}></div>

          <div className="relative z-10 bg-black/40 backdrop-blur-md rounded-3xl p-6 sm:p-8 w-full border border-gray-800">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white text-center mb-4 tracking-wide drop-shadow-[0_0_8px_rgba(255,0,0,0.7)]">
              Admin Portal
            </h1>

            <div className="space-y-4 mb-4">
              {isRedirecting && (
                <div className="p-3 bg-green-900/30 border border-green-700 rounded-lg animate-fadeIn flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 text-green-400 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-green-400 text-sm">Logging in... Redirecting...</p>
                </div>
              )}

              {successMessage && !isRedirecting && (
                <div className="p-3 bg-green-900/30 border border-green-700 rounded-lg animate-fadeIn text-green-400 text-sm text-center">
                  {successMessage}
                </div>
              )}

              {error && !isRedirecting && (
                <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg animate-fadeIn text-red-400 text-sm text-center">
                  {error}
                </div>
              )}
            </div>

            {!isRedirecting && (
              <div className="space-y-4">
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-5 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all duration-300 shadow-inner shadow-gray-950"
                      required
                      disabled={isLoading || isGoogleLoading}
                      autoComplete="username email"
                    />
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-5 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all duration-300 shadow-inner shadow-gray-950 pr-12"
                      required
                      disabled={isLoading || isGoogleLoading}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading || isGoogleLoading}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors disabled:cursor-not-allowed text-sm font-medium"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>

                  <AuthButton type="submit" isLoading={isLoading} disabled={isLoading || isGoogleLoading}>
                    Sign In
                  </AuthButton>
                </form>

                <div className="relative my-4 flex items-center justify-center">
                  <div className="border-t border-gray-800 w-full"></div>
                  <span className="bg-black/80 px-3 text-xs text-gray-400 uppercase font-semibold absolute">
                    Or
                  </span>
                </div>

                <AuthButton
                  type="button"
                  variant="google"
                  onClick={handleGoogleSignIn}
                  isLoading={isGoogleLoading}
                  disabled={isLoading || isGoogleLoading}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  Sign in with Google
                </AuthButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginClient() {
  return (
    <Suspense fallback={<div className="h-screen w-full bg-black flex items-center justify-center text-white">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
