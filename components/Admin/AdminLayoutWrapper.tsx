'use client';
import React, { useState, useCallback } from 'react';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import AdminToast from './AdminToast';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

const AdminLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isVerifying, setIsVerifying] = useState(true);
    const [authorized, setAuthorized] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    React.useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            
            if (!session) {
                router.push('/login');
                return;
            }

            // Verify admin role
            const { data: userData } = await supabase
                .from('users')
                .select('role')
                .eq('id', session.user.id)
                .single();

            if (userData?.role !== 'admin') {
                await supabase.auth.signOut();
                router.push('/login?error=Access+denied.+This+portal+is+restricted+to+administrators+only.');
                return;
            }

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
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-400 font-medium">Verifying Admin Access...</p>
                </div>
            </div>
        );
    }

    if (!authorized) return null;

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Header */}
            <AdminHeader sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />


            <div className="flex pt-16">
                {/* Mobile sidebar overlay */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
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
                w-64 h-[calc(100vh-4rem)] bg-gray-900
                transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:block
                overflow-y-auto scrollbar-none
                border-r border-gray-800
              `}
                >
                    <AdminSidebar onNavigate={closeSidebar} />
                </aside>

                {/* Main Content Area - Full width (No Right Sidebar) */}
                <main className="flex-1 min-h-[calc(100vh-4rem)] overflow-auto bg-gray-950/50">
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
