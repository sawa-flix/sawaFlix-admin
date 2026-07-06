import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/admin/creator
 * The Queue — Returns a paginated list of creators, supporting filters
 * like ?status=pending for the review queue.
 *
 * Query params:
 *   status  — Filter by status (default: "pending")
 *   page    — Page number (default: 1)
 *   limit   — Items per page (default: 20)
 */
export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const status = searchParams.get('status') || 'pending';
        const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
        const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
        const offset = (page - 1) * limit;

        // ─────────────────────────────────────────────────────────────────
        // TODO: Backend Proxy
        //  const qs = new URLSearchParams({ status, page: String(page), limit: String(limit) });
        //  const res = await fetch(`${process.env.BACKEND_API_URL}/api/admin/creator?${qs}`, {
        //      method: 'GET',
        //      headers: { 'Authorization': `Bearer ${adminJwt}` },
        //  });
        //  if (!res.ok) return NextResponse.json({ error: 'Failed to fetch' }, { status: res.status });
        //  return NextResponse.json(await res.json());
        // ─────────────────────────────────────────────────────────────────

        const supabase = await createClient();

        // Get total count for pagination metadata
        const { count, error: countErr } = await supabase
            .from('verification_submissions')
            .select('*', { count: 'exact', head: true })
            .eq('status', status);

        if (countErr) {
            console.error('Error counting creators:', countErr);
            return NextResponse.json({ error: countErr.message }, { status: 500 });
        }

        // Fetch the page
        const { data, error } = await supabase
            .from('verification_submissions')
            .select('creator_id, category, status, created_at, form_data')
            .eq('status', status)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) {
            console.error('Error fetching creators:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        const mappedData = (data || []).map((row) => {
            const fd = (row.form_data as Record<string, unknown>) ?? {};
            return {
                id: row.creator_id,
                full_name: fd.full_name ?? 'Unknown Creator',
                category: row.category,
                status: row.status,
                submitted_at: row.created_at,
                avatar_url: fd.avatar_url ?? '',
            };
        });

        return NextResponse.json({
            data: mappedData,
            pagination: {
                page,
                limit,
                total: count ?? 0,
                total_pages: Math.ceil((count ?? 0) / limit),
            },
        });
    } catch (err) {
        console.error('Unexpected error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
