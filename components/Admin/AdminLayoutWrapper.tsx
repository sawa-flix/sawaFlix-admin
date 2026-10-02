'use client';
import React, { useState, useCallback } from 'react';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import AdminToast from './AdminToast';
import { SawaflixLoader } from '@/components/SawaflixLogo';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { checkAdminRole } from '@/app/actions/auth';
import { check2FAStatus, signOutAdmin } from '@/services/authService';

/**
 * AdminLayoutWrapper
 *
 * Guards the entire /admin tree with three checks on mount:
 *   1. Supabase session validity  (getUser — validates JWT with server)
 *   2. DB role check              (checkAdminRole — bypasses RLS)
 *   3. Session-bound 2FA status   (check2FAStatus — /api/auth/admin/2fa-status)
 *
 * The OTP challenge only exists in the login flow. A stale or unverified
 * Supabase session is revoked and must pass the complete login flow again.
 */

const AdminLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    /**
     * authState:
     *   'verifying'  — initial; checks running
     *   'authorized' — all checks passed
     *   'denied'     — redirecting to login
     */
    type AuthState = 'verifying' | 'authorized' | 'denied';
    const [authState, setAuthState] = useState<AuthState>('verifying');

    const router = useRouter();
    const supabase = createClient();

    React.useEffect(() => {
        const checkAuth = async () => {
            // ── 1. Session validity ──────────────────────────────────────────
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setAuthState('denied');
                router.push('/login');
                return;
            }

            // ── 2. Role check ────────────────────────────────────────────────
            const { role, error } = await checkAdminRole(user.id);

            if (role !== 'admin') {
                await signOutAdmin();
                setAuthState('denied');
                const message = error || 'Access denied. This portal is restricted to administrators only.';
                router.push(`/login?error=${encodeURIComponent(message)}`);
                return;
            }

            // ── 3. 2FA session status ────────────────────────────────────────
            const status = await check2FAStatus();
            if (!status.isVerified) {
                await signOutAdmin();
                setAuthState('denied');
                router.push('/login?error=Your+verified+admin+session+has+expired.+Please+sign+in+again.');
                return;
            }

            setAuthState('authorized');
        };

        checkAuth().catch(async () => {
            await supabase.auth.signOut();
            setAuthState('denied');
            router.push('/login?error=Unable+to+verify+your+admin+session.');
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toggleSidebar = useCallback(() => {
        setSidebarOpen(prev => !prev);
    }, []);

    const closeSidebar = useCallback(() => {
        setSidebarOpen(false);
    }, []);

    if (authState === 'verifying' || authState === 'denied') {
        return (
            <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center">
                <SawaflixLoader size={64} text="Verifying Admin Access…" />
            </div>
        );
    }

    // authState === 'authorized'
    return (
        <div className="min-h-screen bg-[#F8F9FB]">
            {/* Header */}
            <AdminHeader sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

            <div className="flex pt-16">
                {/* Mobile sidebar overlay */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-xs"
                        onClick={closeSidebar}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Escape') closeSidebar();
                        }}
                        aria-label="Close sidebar"
                    />
                )}

                {/* Left Sidebar (Admin) */}
                <aside
                    className={`
                fixed lg:sticky top-16 left-0 z-50 lg:z-auto
                w-64 h-[calc(100vh-4rem)] bg-white
                transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:block
                overflow-y-auto scrollbar-none
                border-r border-slate-200/80 shadow-sm
              `}
                >
                    <AdminSidebar onNavigate={closeSidebar} />
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 min-h-[calc(100vh-4rem)] overflow-auto bg-[#F8F9FB]">
                    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>

            {/* Global Admin Toasts */}
            <AdminToast />

            <style jsx global>{`
            .scrollbar-none::-webkit-scrollbar {
              display: none;
            }
            .scrollbar-none {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>
        </div>
    );
};

export default AdminLayoutWrapper;
