
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
/**
 * @swagger
 * /api/admin/creators:
 *   get:
 *     summary: Get all creator verification submissions
 *     description: Returns a paginated list of creators filtered by status.
 *     tags:
 *       - Admin Management
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
 *           default: pending
 *         description: Filter creators by status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: A paginated list of creators
 *       500:
 *         description: Internal server error
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  // 1. Pagination & Filtering Logic
  const status = searchParams.get("status") || "pending";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  const rangeStart = (page - 1) * limit;
  const rangeEnd = rangeStart + limit - 1;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    // 2. Fetch from the Submissions table (since that's where status lives)
    // We simplify the join to let Supabase detect the relationship automatically
    const { data: submissions, error, count } = await supabase
      .from("verification_submissions")
      .select(`
        creator_id,
        status,
        category,
        created_at,
        form_data,
        creator_profiles (
          legal_name,
          stage_name,
          profile_picture_url
        ),
        users (
          email,
          username
        )
      `, { count: "exact" })
      .eq("status", status)
      .order("created_at", { ascending: false })
      .range(rangeStart, rangeEnd);

    if (error) {
      console.error("Supabase Query Error:", error);
      throw error;
    }

    if (!submissions || submissions.length === 0) {
      return NextResponse.json({
        creators: [],
        totalCount: 0,
        currentPage: page,
        totalPages: 0
      });
    }

    // 3. Clean up the response structure for the frontend
    const formattedData = submissions.map(sub => {
      // Handle potential array responses for joins
      const profile = Array.isArray(sub.creator_profiles) ? sub.creator_profiles[0] : sub.creator_profiles;
      const user = Array.isArray(sub.users) ? sub.users[0] : sub.users;

      return {
        id: sub.creator_id,
        status: sub.status,
        category: sub.category,
        appliedAt: sub.created_at,
        email: user?.email || "",
        full_name: profile?.legal_name || sub.form_data?.identity?.legalName || "No Name",
        stage_name: profile?.stage_name || "",
        avatar_url: profile?.profile_picture_url || sub.form_data?.identity?.avatarUrl || null,
        user: {
          email: user?.email,
          username: user?.username
        }
      };
    });

    return NextResponse.json({
      creators: formattedData,
      totalCount: count,
      currentPage: page,
      totalPages: Math.ceil((count || 0) / limit)
    });

  } catch (err: any) {
    console.error("Creators List Error:", err.message);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
