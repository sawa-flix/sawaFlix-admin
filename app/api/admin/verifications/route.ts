import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
/**
 * @swagger
 * /api/admin/verifications:
 *   get:
 *     summary: Get verification submissions
 *     description: Returns a list of creator verification submissions filtered by status. Defaults to pending submissions.
 *     tags:
 *       - Admin Verification
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         description: Filter submissions by status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected, info_requested]
 *           example: pending
 *     responses:
 *       200:
 *         description: List of verification submissions
 *       500:
 *         description: Server error
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    let query = supabase
      .from("verification_submissions")
      .select("creator_id, status, category, form_data, created_at, updated_at");

    if (status) {
      query = query.eq("status", status);
    }



    const { data: verifications, error } = await query.order("created_at", { ascending: false });

    if (error) throw error;

    // Transform for the frontend
    const categoryMapping: Record<string, string> = {
      "Music": "Music Artist",
      "Film": "Actor/Filmmaker",
      "Comedy": "Comedian",
      "Traditional storyteller": "Traditional Storyteller",
      "Food&lifestyle": "Food & Lifestyle",
      "General": "General"
    };

    const formattedData = verifications?.map((v) => ({
      id: v.creator_id,
      full_name: v.form_data?.identity?.legalName || "No Name",
      category: categoryMapping[v.category] || v.category || "Unknown",
      status: v.status || "unverified",
      submitted_at: v.created_at,
      avatar_url: v.form_data?.identity?.avatarUrl || null,
    })) || [];
    console.log("Verifications fetched:", verifications?.length);

    return NextResponse.json({
      success: true,
      data: formattedData,
    });
  } catch (err: any) {
    console.error("Admin Fetch Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
