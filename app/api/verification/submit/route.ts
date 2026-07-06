import { createClient } from "@/utils/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * @swagger
 * /api/verification/submit:
 *   post:
 *     summary: Submit creator verification application
 *     description: Finalizes and submits the creator verification form, changing status from 'draft' to 'pending'.
 *     tags:
 *       - Creator Verification
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *               form_data:
 *                 type: object
 *     responses:
 *       200:
 *         description: Verification submitted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Already submitted
 *       500:
 *         description: Internal server error
 */
export async function POST(req: Request) {
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

    // 2. Parse request body
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

    // 3. Check existing submission status
    const { data: existingSubmission } = await supabase
      .from("verification_submissions")
      .select("status")
      .eq("creator_id", creatorId)
      .maybeSingle();

    if (existingSubmission?.status === "approved") {
      return NextResponse.json(
        { error: "Already approved", message: "Your verification has already been approved." },
        { status: 403 }
      );
    }

    // If already pending, just return success — data was saved on a prior attempt
    if (existingSubmission?.status === "pending") {
      return NextResponse.json({
        success: true,
        message: "Your verification is already pending review.",
        data: existingSubmission,
      });
    }

    // 4. Ensure creator_profiles row exists (PK = creator_id)
    // RLS may prevent seeing the row, so we try upsert and ignore duplicate key errors
    const legalName = formData?.identity?.legalName || user.user_metadata?.full_name || "Creator";
    const stageName = formData?.identity?.creatorName || "TBD";
    
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

    // 5. Upsert verification submission with status 'pending'
    const { data, error } = await supabase
      .from("verification_submissions")
      .upsert(
        {
          creator_id: creatorId,
          category: category,
          form_data: formData,
          status: "pending",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "creator_id" }
      )
      .select()
      .single();

    if (error) throw error;

    // 6. Also update creator profile with submission data (only existing columns)
    const updateData: Record<string, unknown> = { category };
    
    if (formData?.identity?.legalName) updateData.legal_name = formData.identity.legalName;
    if (formData?.identity?.creatorName) updateData.stage_name = formData.identity.creatorName;
    if (formData?.identity?.ethnicGroup) updateData.ethnic_group = formData.identity.ethnicGroup;
    if (formData?.professional?.bio) updateData.bio = formData.professional.bio;

    const { error: updateError } = await supabase
      .from("creator_profiles")
      .update(updateData)
      .eq("creator_id", creatorId);
    
    // Non-critical — don't fail the whole submission if profile update fails
    if (updateError) {
      console.warn("Profile update warning:", updateError.message);
    }

    return NextResponse.json({
      success: true,
      message: "Verification submitted successfully! Your application is now pending review.",
      data,
    });
  } catch (err) {
    const error = err as Error;
    console.error("Submit Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
