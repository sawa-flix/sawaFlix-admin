import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Force Next.js to fetch fresh data every time the admin refreshes
export const dynamic = "force-dynamic";
/**
 * @swagger
 * /api/admin/metrics:
 *   get:
 *     summary: Get admin dashboard metrics
 *     description: Returns aggregated counts of verification submissions grouped by status for the admin dashboard.
 *     tags:
 *       - Admin Management
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Metrics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 metrics:
 *                   type: object
 *                   properties:
 *                     total_pending:
 *                       type: integer
 *                       example: 12
 *                     total_approved:
 *                       type: integer
 *                       example: 4
 *                     total_rejected:
 *                       type: integer
 *                       example: 2
 *                     total_info_requested:
 *                       type: integer
 *                       example: 1
 *                     total_submissions:
 *                       type: integer
 *                       example: 19
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       500:
 *         description: Failed to fetch dashboard metrics
 */
export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    // Fire all queries in parallel for maximum speed
    const [pending, approved, rejected, infoRequested] = await Promise.all([
      supabase
        .from("verification_submissions")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending"),

      supabase
        .from("verification_submissions")
        .select("*", { count: "exact", head: true })
        .eq("status", "approved"),

      supabase
        .from("verification_submissions")
        .select("*", { count: "exact", head: true })
        .eq("status", "rejected"),

      supabase
        .from("verification_submissions")
        .select("*", { count: "exact", head: true })
        .eq("status", "info_requested")
    ]);

    // Check for any errors in the responses
    if (pending.error) throw pending.error;
    if (approved.error) throw approved.error;
    if (rejected.error) throw rejected.error;
    if (infoRequested.error) throw infoRequested.error;

    const p = pending.count || 0;
    const a = approved.count || 0;
    const r = rejected.count || 0;
    const i = infoRequested.count || 0;

    return NextResponse.json({
      metrics: {
        total_pending: p,
        total_approved: a,
        total_rejected: r,
        total_info_requested: i,
        total_submissions: p + a + r + i
      },
      timestamp: new Date().toISOString()
    });

  } catch (err: any) {
    console.error("Metrics API Error:", err.message);
    return NextResponse.json(
      {
        error: "Failed to fetch dashboard metrics",
        details: err.message
      },
      { status: 500 }
    );
  }
}
