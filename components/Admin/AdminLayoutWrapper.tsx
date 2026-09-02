'use client';
import React, { useState, useCallback } from 'react';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import AdminToast from './AdminToast';
import { SawaflixLoader } from '@/components/SawaflixLogo';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { checkAdminRole } from '@/app/actions/auth';

const AdminLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isVerifying, setIsVerifying] = useState(true);
    const [authorized, setAuthorized] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    React.useEffect(() => {
        const checkAuth = async () => {
            // Use getUser() instead of getSession() - it validates the JWT with the server
            // and is more reliable after a hard redirect (window.location.href)
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            console.log("AdminLayoutWrapper: user fetched:", user ? { email: user.email, id: user.id } : null, "error:", userError?.message);

            if (!user) {
                console.log("AdminLayoutWrapper: No user found, redirecting to /login");
                router.push('/login');
                return;
            }

            // Verify admin role via server action to bypass RLS
            console.log("AdminLayoutWrapper: Verifying admin role for user ID:", user.id);
            const { role, error } = await checkAdminRole(user.id);
            console.log("AdminLayoutWrapper: role check response:", { role, error });

            if (role !== 'admin') {
                console.log("AdminLayoutWrapper: Role is not admin (" + role + "), signing out and redirecting");
                await supabase.auth.signOut();
                router.push('/login?error=Access+denied.+This+portal+is+restricted+to+administrators+only.');
                return;
            }

            console.log("AdminLayoutWrapper: Authorized as admin!");
            setAuthorized(true);
            setIsVerifying(false);
        };

        checkAuth();
    }, [router, supabase]);

    const toggleSidebar = useCallback(() => {
        setSidebarOpen(prev => !prev);
    }, []);

    const closeSidebar = useCallback(() => {
        setSidebarOpen(false);
    }, []);

    if (isVerifying) {
        return (
            <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center">
                <SawaflixLoader size={64} text="Verifying Admin Access..." />
            </div>
        );
    }

    if (!authorized) return null;

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
