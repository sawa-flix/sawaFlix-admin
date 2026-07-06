import { createClient } from "@/utils/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
/**
 * @swagger
 * /api/verification/upload:
 *   post:
 *     summary: Upload verification documents
 *     description: Final step before submission. Ensures required documents (selfie and national ID) exist before submitting.
 *     tags:
 *       - Creator Verification
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Application submitted successfully
 *       400:
 *         description: Missing required documents
 *       403:
 *         description: Submission already under review
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "application/pdf", "video/mp4"];

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    let supabase;

    // 1. Auth Setup
    if (authHeader?.startsWith("Bearer ")) {
      supabase = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { global: { headers: { Authorization: authHeader } } }
      );
    } else {
      supabase = await createClient();
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (!user || authError) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 2. Fetch current submission state to prevent overwriting other files
    const { data: existingSubmission } = await supabase
      .from("verification_submissions")
      .select("form_data")
      .eq("creator_id", user.id)
      .maybeSingle();

    const currentFormData = existingSubmission?.form_data || {};

    // 3. Parse Multipart Data
    const formData = await req.formData();
    const filesToUpload = [
      { file: formData.get("selfie") as File, key: "selfie_path" },
      { file: formData.get("national_id") as File, key: "national_id_path" },
      { file: formData.get("endorsement_letter") as File, key: "endorsement_letter_path" }
    ];

    const newUploadedPaths: Record<string, string> = {};

    // 4. Flexible Validation & Upload Loop
    for (const item of filesToUpload) {
      // We ONLY process the file if it actually exists in this request
      if (item.file && item.file instanceof File && item.file.size > 0) {
        
        // Security: Size & Type Check
        if (item.file.size > MAX_FILE_SIZE) {
          return NextResponse.json({ error: "File too large", detail: `${item.file.name} exceeds 10MB` }, { status: 400 });
        }
        if (!ALLOWED_MIME_TYPES.includes(item.file.type)) {
          return NextResponse.json({ error: "Invalid type", detail: `${item.file.name} is not an allowed format.` }, { status: 400 });
        }

        const fileExt = item.file.name.split('.').pop();
        const fileName = `${user.id}/${item.key}_${Date.now()}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("verification-docs")
          .upload(fileName, item.file, { upsert: true });

        if (uploadError) throw new Error(`Failed to upload ${item.key}`);
        
        newUploadedPaths[item.key] = uploadData.path;
      }
    }

    // 5. Merge new paths with existing paths
    const finalFormData = { ...currentFormData, ...newUploadedPaths };

    // 6. Logic: Is the application complete now?
    const isComplete = 
      finalFormData.selfie_path && 
      finalFormData.national_id_path && 
      finalFormData.endorsement_letter_path;

    const { data: updated, error: dbError } = await supabase
      .from("verification_submissions")
      .upsert({
        creator_id: user.id,
        form_data: finalFormData,
        status: isComplete ? "pending" : "draft", // Only "pending" if all 3 are present
        updated_at: new Date().toISOString()
      }, { onConflict: "creator_id" })
      .select()
      .single();

    if (dbError) throw dbError;

    return NextResponse.json({
      success: true,
      message: isComplete ? "Application Submitted Successfully!" : "Progress saved as draft.",
      status: updated.status,
      data: updated
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