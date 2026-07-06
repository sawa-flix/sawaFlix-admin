'use server';

import { createAdminClient } from '@/utils/supabase/server';

export async function checkAdminRole(userId: string) {
    try {
        const adminSupabase = await createAdminClient();
        
        const { data, error } = await adminSupabase
            .from('users')
            .select('role')
            .eq('id', userId)
            .single();
            
        if (error) {
            console.error('Error checking admin role (Service Key):', error);
            return { role: 'client', error: error.message };
        }
        
        return { role: data?.role || 'client', error: null };
    } catch (err: any) {
        console.error('Unexpected error checking admin role:', err);
        return { role: 'client', error: err.message };
    }
}
