'use client';
import React, { useState, useCallback } from 'react';
import Header from '../Dashboard/Header'; // Reusing standard header for now
import AdminSidebar from './AdminSidebar';
import AdminToast from './AdminToast';

const AdminLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = useCallback(() => {
        setSidebarOpen(prev => !prev);
    }, []);

    const closeSidebar = useCallback(() => {
        setSidebarOpen(false);
    }, []);

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Header */}
            <Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} hideSearch={true} />

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
