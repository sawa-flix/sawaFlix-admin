'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signInWithPassword, resetPassword, checkAuth } from '@/app/(auth)/actions';

import { Suspense } from 'react';

const AuthButton = ({ children, isLoading, variant = 'primary', className = '', ...props }) => {
  const baseStyles = "w-full flex items-center justify-center font-bold py-2.5 sm:py-3 px-4 rounded-xl transition-all duration-300 transform active:scale-95 disabled:transform-none disabled:cursor-not-allowed shadow-lg";

  const variants = {
    primary: "bg-red-700 hover:bg-red-600 disabled:bg-red-900 text-white hover:shadow-red-500/70 hover:scale-[1.02]",
    google: "bg-gray-900 border border-gray-700 text-white hover:bg-gray-800 hover:shadow-red-500/30",
  };

  return (
    <button
      disabled={isLoading}
      className={`${baseStyles} ${variants[variant]} ${className}`}
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
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [resetMessage, setResetMessage] = useState(null);
  const [email, setEmail] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const hasAttemptedRedirect = useRef(false);

  // Removed auto-redirect to allow users to see the login page even if logged in
  // Check if user is already logged in (optional check, but don't force redirect now)
  useEffect(() => {
    async function checkIfLoggedIn() {
      try {
        const result = await checkAuth();
        if (result.authenticated) {
          console.log('🟢 User already logged in, role:', result.role);
          const targetPath = result.role === 'admin' ? '/admin' : '/dashboard';
          router.push(targetPath);
        }
      } catch (err) {
        console.log('Not logged in');
      }
    }
    checkIfLoggedIn();
  }, [router]);

  // Handle URL messages (password reset, sign out)
  useEffect(() => {
    const message = searchParams.get('message');
    const errorParam = searchParams.get('error');

    if (message === 'password_updated_success' || message === 'password_updated') {
      setSuccessMessage('✅ Password updated successfully! You can now login with your new password.');
    } else if (message === 'signed_out') {
      setSuccessMessage('You have been signed out successfully.');
    } else if (errorParam) {
      setError(decodeURIComponent(errorParam));
    }

    if (message || errorParam) {
      // Clean URL after consuming messages
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('message');
      newUrl.searchParams.delete('error');
      router.replace(newUrl.pathname + newUrl.search);
    }
  }, [searchParams, router]);

  /**
   * Handle Password Login
   */
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Reset state before attempt
    setError(null);
    setSuccessMessage(null);
    setResetMessage(null);
    setIsLoading(true);
    setIsRedirecting(false);

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    try {
      const result = await signInWithPassword(formData);

      if (result?.error) {
        setError(result.error);
        setIsLoading(false);
      } else if (result?.success) {
        // Login successful - redirect based on role
        const targetPath = result.redirectTo || (result.role === 'admin' ? '/admin' : '/dashboard');
        console.log(`🟢 Login successful, redirecting to ${targetPath}`);
        setIsRedirecting(true);
        
        // Short delay to show loading state
        setTimeout(() => {
          router.push(targetPath);
        }, 100);
      } else {
        // Unexpected response
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      // Handle Next.js redirect errors correctly
      if (err?.digest?.startsWith('NEXT_REDIRECT')) {
        setIsRedirecting(true);
        return;
      }

      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  /**
   * Handle Password Reset
   */
  const handleResetPassword = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setResetMessage(null);
    setIsResetting(true);

    if (!email) {
      setError('Please enter your email to reset the password.');
      setIsResetting(false);
      return;
    }

    const formData = new FormData();
    formData.append('email', email);

    try {
      const result = await resetPassword(formData);

      if (result?.error) {
        setError(result.error);
      } else {
        setResetMessage(result.message || '✅ Password reset link sent to your email.');
        setEmail('');
      }
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsResetting(false);
    }
  };


  return (
    <div className="h-screen w-full relative overflow-hidden font-inter">
      <Image
        src="/hero-bg.png"
        alt="Background"
        fill
        quality={100}
        className="z-0 object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black opacity-70 z-10"></div>

      <div className="relative z-20 flex items-center justify-center h-screen px-4 py-4 sm:px-6 lg:px-8">
        <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl shadow-red-500/50">
          {/* Glowing Border Animation */}
          <div className="absolute inset-0 z-0 animate-spin-border-gradient" style={{
            background: 'conic-gradient(from var(--angle), #000000 0%, #ff0000 10%, #8b0000 20%, #000000 30%, #000000 100%)',
            borderRadius: '1.5rem',
            padding: '2px',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            WebkitMaskComposite: 'exclude'
          }}></div>

          <div className="relative z-10 bg-black/40 backdrop-blur-md rounded-3xl p-6 sm:p-8 w-full border border-gray-800">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white text-center mb-4 tracking-wide drop-shadow-[0_0_8px_rgba(255,0,0,0.7)]">
              Sign In
            </h1>

            {/* Success/Error Alerts */}
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

              {resetMessage && !isRedirecting && (
                <div className="p-3 bg-blue-900/30 border border-blue-700 rounded-lg animate-fadeIn text-blue-400 text-sm text-center">
                  {resetMessage}
                </div>
              )}
            </div>

            {!isRedirecting && (
              <>
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
                      disabled={isLoading}
                      autoComplete="username email"
                    />
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      className="w-full px-5 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all duration-300 shadow-inner shadow-gray-950 pr-12"
                      required
                      disabled={isLoading}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors disabled:cursor-not-allowed"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395m-4.64-2.115a4.5 4.5 0 113.35-6.425M21.75 12C20.462 7.662 16.44 4.5 12 4.5c-.993 0-1.953.138-2.863.395m-4.64-2.115a4.5 4.5 0 113.35-6.425" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <label className="flex items-center text-gray-300 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        className="w-5 h-5 mr-2 appearance-none border border-gray-600 rounded-md bg-gray-800 checked:bg-red-600 checked:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
                        disabled={isLoading}
                      />
                      Remember me
                    </label>
                    <button
                      type="button"
                      onClick={handleResetPassword}
                      disabled={isResetting || isLoading}
                      className="text-blue-400 hover:text-blue-300 transition-colors duration-200 hover:underline disabled:text-gray-500 disabled:cursor-not-allowed"
                    >
                      {isResetting ? 'Sending...' : 'Forgot password?'}
                    </button>
                  </div>

                  <AuthButton type="submit" isLoading={isLoading}>
                    Sign In
                  </AuthButton>
                </form>

                <div className="text-gray-400 text-center mt-6 text-sm sm:text-base">
                  <p>
                    Are you new to SawaFlix?{" "}
                    <Link
                      href="/sign-up"
                      className="text-red-500 hover:underline hover:text-red-400 transition-colors font-medium"
                    >
                      Sign up
                    </Link>
                  </p>
                </div>
              </>
            )}

            <div className="mt-8 text-xs text-gray-600 text-center leading-relaxed">
              This page is protected by Google reCAPTCHA to ensure you're not a bot.{' '}
              <button
                className="text-blue-400 hover:text-blue-300 transition-colors hover:underline"
                onClick={() => window.open('https://www.google.com/recaptcha/about/', '_blank')}
              >
                Learn more
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');

        .font-inter {
          font-family: 'Inter', sans-serif;
        }

        @keyframes rotate-gradient {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-spin-border-gradient {
          animation: rotate-gradient 8s linear infinite;
          transform-origin: center;
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px #111827 inset !important;
          box-shadow: 0 0 0 1000px #111827 inset !important;
          -webkit-text-fill-color: white !important;
        }
      `}</style>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="h-screen w-full bg-black flex items-center justify-center text-white">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}