import { createClient } from "@/utils/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js"; // Add this for testing support
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
/**
 * @swagger
 * /api/verification/draft:
 *   put:
 *     summary: Save or update verification draft
 *     description: Saves a creator's verification form draft or updates it if it already exists.
 *     tags:
 *       - Creator Verification
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 example: Music
 *               formData:
 *                 type: object
 *                 example:
 *                   stage_name: "DJ Killa"
 *                   bio: "Music producer from Cameroon"
 *     responses:
 *       200:
 *         description: Draft saved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Submission locked
 *       500:
 *         description: Internal server error
 */
export async function PUT(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    let supabase;

    if (authHeader?.startsWith("Bearer ")) {
      supabase = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, 
        { global: { headers: { Authorization: authHeader } } }
      );
    } else {
      supabase = await createClient();
    }

    // 1. Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (!user || authError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const creatorId = user.id;

    // 2. Parse request body EARLY (so we have the category for the profile)
    const body = await req.json().catch(() => ({}));
    const rawCategory = body.category || "General";
    
    // Map lowercase wizard category IDs to DB-accepted values
    // DB constraint allows: Music, Film, Traditional storyteller, Comedy, Food&lifestyle, General, Storyteller, Lifestyle, etc.
    const categoryMap: Record<string, string> = {
      music: "Music",
      film: "Film",
      comedy: "Comedy",
      storyteller: "Traditional storyteller",
      lifestyle: "Food&lifestyle",
      general: "General",
      unspecified: "General",
    };
    const category = categoryMap[rawCategory.toLowerCase()] || "General";
    
    const formData = body.form_data || body.formData || {};
    const legalName = formData.legal_name || user.user_metadata?.full_name || "New Creator";
    const stageName = formData.stage_name || "TBD";

    // 3. PRE-FLIGHT: Ensure creator_profiles row exists (PK = creator_id)
    // RLS may prevent seeing the row, so we try insert and ignore duplicate key errors
    const { error: profileErr } = await supabase
      .from("creator_profiles")
      .upsert({ 
          creator_id: creatorId,
          legal_name: legalName,
          stage_name: stageName,
          category: category,
      }, { onConflict: "creator_id", ignoreDuplicates: true });
    
    // Only throw if it's NOT a duplicate key error (profile already exists = fine)
    if (profileErr && profileErr.code !== '23505') {
      console.error("Profile Creation Failed:", profileErr.message);
      throw profileErr;
    }

    // 4. Check existing submission status to prevent overwriting "Pending"
    const { data: existingSubmission } = await supabase
      .from("verification_submissions")
      .select("status")
      .eq("creator_id", creatorId)
      .maybeSingle();

    if (existingSubmission && (existingSubmission.status === "pending" || existingSubmission.status === "approved")) {
      return NextResponse.json(
        {
          error: "Submission locked",
          message: "Cannot edit a submission that is pending review or already approved."
        },
        { status: 403 }
      );
    }

    // 5. Upsert draft
    const { data, error } = await supabase
      .from("verification_submissions")
      .upsert(
        {
          creator_id: creatorId,
          category: category,
          form_data: formData,
          status: "draft",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "creator_id" }
      )
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "Draft saved successfully",
      data,
    });
  } catch (err) {
    const error = err as Error;
    console.error("Draft Save Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: err.message },
      { status: 500 }
    );
  }
}