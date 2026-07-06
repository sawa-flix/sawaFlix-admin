import React from 'react';
import AdminLayoutWrapper from '../../components/Admin/AdminLayoutWrapper';

export const metadata = {
    title: 'Admin Portal | SawaFlix',
    description: 'SawaFlix Administration and Verification Portal',
};

import { redirect } from 'next/navigation';
import { checkAuth } from '../(auth)/actions';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const { authenticated, role } = await checkAuth();

    // Temporarily disabled per user request to "forget about middleware logic for now"
    /*
    if (!authenticated || role !== 'admin') {
        redirect('/login?error=Unauthorized+access');
    }
    */

    return (
        <AdminLayoutWrapper>
            {children}
        </AdminLayoutWrapper>
    );
}
