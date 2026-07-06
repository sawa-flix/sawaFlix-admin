// app/(auth)/update-password/page.jsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '../../../utils/supabase/client';

function UpdatePasswordContent() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function verifyResetLink() {
      try {
        const supabase = createClient();
        const code = searchParams.get('code');
        const token = searchParams.get('token');
        const type = searchParams.get('type');
        const fromCallback = searchParams.get('from_callback');

        console.log('🔵 UpdatePassword - URL parameters:', {
          code: code ? `present (${code.substring(0, 8)}...)` : 'missing',
          token: token ? 'present' : 'missing',
          type,
          fromCallback
        });

        // Check if we have authentication parameters
        if (!code && !token) {
          // Check if user already has a session (might have come from callback)
          const { data: { session } } = await supabase.auth.getSession();

          if (session) {
            console.log('🟢 User already has a session, ready for password update');
            setIsVerifying(false);
            return;
          }

          setError('❌ Invalid reset link. Please use the link from your password reset email.');
          setIsVerifying(false);
          return;
        }

        // If we have a code, try to exchange it for a session
        if (code) {
          console.log('🟡 Attempting to exchange code for session...');

          try {
            const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

            if (exchangeError) {
              console.error('🔴 Code exchange error:', exchangeError.message);

              // Don't block the user - they can still try to update password
              console.log('⚠️ Proceeding without successful session exchange...');
            } else {
              console.log('🟢 Code exchanged successfully');
            }
          } catch (exchangeErr) {
            console.error('🔴 Exchange process error:', exchangeErr);
            // Continue anyway - some flows don't need session exchange
          }
        }

        setIsVerifying(false);

      } catch (err) {
        console.error('🔴 Verification error:', err);
        setError('An error occurred during verification.');
        setIsVerifying(false);
      }
    }

    verifyResetLink();
  }, [searchParams]);

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    // Validation
    if (password !== confirmPassword) {
      setError('❌ Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('❌ Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const supabase = createClient();
      const code = searchParams.get('code');

      console.log('🟡 Starting password update process...');

      // Update the password directly
      console.log('🟡 Calling supabase.auth.updateUser()...');
      const { data, error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) {
        console.error('🔴 Password update error:', updateError);

        // Try alternative: If we have a code, try exchange then update
        if (code && updateError.message.includes('Auth session missing')) {
          console.log('🟡 Attempting code exchange first, then password update...');

          // Try to exchange code first
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

          if (exchangeError) {
            console.error('🔴 Exchange after failed update:', exchangeError);
            throw new Error('Reset link is invalid or expired. Please request a new one.');
          }

          // Try password update again after exchange
          const { error: retryError } = await supabase.auth.updateUser({
            password: password
          });

          if (retryError) {
            throw retryError;
          }

          // Success on retry
          console.log('🟢 Password updated successfully after retry');
        } else {
          throw updateError;
        }
      }

      console.log('✅ Password updated successfully!');
      setMessage('✅ Password updated successfully! Redirecting to login...');

      // Sign out and redirect after successful update
      setTimeout(async () => {
        await supabase.auth.signOut();
        router.push('/login?message=password_updated_success');
      }, 2000);

    } catch (err) {
      console.error('🔴 Password update process error:', err);

      // User-friendly error messages
      if (err.message.includes('Auth session missing')) {
        setError('❌ Session expired. Please request a new password reset link.');
      } else if (err.message.includes('invalid') || err.message.includes('expired')) {
        setError('❌ Invalid or expired reset link. Please request a new password reset.');
      } else if (err.message.includes('code verifier')) {
        setError('❌ Technical issue with reset link. Please request a new password reset.');
      } else {
        setError(`❌ Failed to update password: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="w-full max-w-md p-8 space-y-6 bg-black/40 backdrop-blur-md rounded-3xl text-white border border-gray-800">
          <h1 className="text-3xl font-bold text-center">Verifying Reset Link...</h1>
          <p className="text-gray-400 text-center">Please wait while we verify your reset request.</p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-black/40 backdrop-blur-md rounded-3xl text-white border border-gray-800">
        <h1 className="text-3xl font-bold text-center">Set New Password</h1>

        {message && (
          <div className="bg-green-900/30 border border-green-700 rounded-xl p-4">
            <p className="text-green-500 text-center font-medium">{message}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded-xl p-4">
            <p className="text-red-500 text-center font-medium">{error}</p>
            {error.includes('expired') || error.includes('invalid') || error.includes('new password reset') ? (
              <div className="text-center mt-3">
                <button
                  onClick={() => router.push('/login?tab=reset')}
                  className="text-gray-300 hover:text-white underline text-sm font-medium"
                >
                  Request New Reset Link
                </button>
              </div>
            ) : null}
          </div>
        )}

        {/* Show form if no critical error */}
        {(!error || (!error.includes('expired') && !error.includes('invalid'))) && (
          <>
            <p className="text-gray-400 text-center text-sm">
              Enter your new password below. It must be at least 6 characters long.
            </p>

            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New Password"
                  className="w-full px-5 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 pr-12 disabled:opacity-50"
                  required
                  minLength={6}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 disabled:opacity-30"
                  disabled={isLoading}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  className="w-full px-5 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 pr-12 disabled:opacity-50"
                  required
                  minLength={6}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 disabled:opacity-30"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-700 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </span>
                ) : 'Update Password'}
              </button>
            </form>
          </>
        )}

        {/* Always show back to login link */}
        <div className="text-center pt-4 border-t border-gray-800">
          <button
            onClick={() => router.push('/login')}
            className="text-gray-400 hover:text-white text-sm font-medium"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UpdatePasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="w-full max-w-md p-8 space-y-6 bg-black/40 backdrop-blur-md rounded-3xl text-white border border-gray-800">
          <h1 className="text-3xl font-bold text-center">Loading...</h1>
        </div>
      </div>
    }>
      <UpdatePasswordContent />
    </Suspense>
  );
}