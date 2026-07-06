import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
/**
 * @swagger
 * /api/admin/verifications/{id}/approve:
 *   post:
 *     summary: Approve creator verification
 *     description: Approves a creator verification request and marks the creator profile as verified.
 *     tags:
 *       - Admin Verification
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Creator ID
 *         schema:
 *           type: string
 *           example: 123e4567-e89b
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notes:
 *                 type: string
 *                 example: Approved by admin after verification review
 *     responses:
 *       200:
 *         description: Creator successfully approved
 *       500:
 *         description: Server error
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // FIX 1: Params is a Promise
) {
  // FIX 2: Await the params
  const { id: creatorId } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // Always use Service Role for Admin actions
  );

  try {
    const body = await req.json().catch(() => ({}));
    const notes = body.notes || "Approved by admin";

    // 1. Update the Submission Status
    const { error: subError } = await supabase
      .from("verification_submissions")
      .update({
        status: "approved",
        admin_notes: notes,
        updated_at: new Date().toISOString() // Using updated_at for consistency
      })
      .eq("creator_id", creatorId);

    if (subError) throw subError;

    // 2. Update Creator Profile (To show blue checkmark on profile)
    const { error: profileError } = await supabase
      .from("creator_profiles")
      .update({
        is_verified: true
      })
      .eq("creator_id", creatorId);

    if (profileError) throw profileError;

    // 3. Update Global User Record (For Auth/Permissions)
    // Note: Ensure your table is named 'users' and not 'profiles'
    const { error: userError } = await supabase
      .from("users") 
      .update({
        is_verified: true,
        verification_status: "approved"
      })
      .eq("id", creatorId);

    if (userError) {
       console.warn("User table update failed, check if 'users' table exists:", userError.message);
       // We don't necessarily want to crash the whole request if only this part fails, 
       // but it's good to log it.
    }

    return NextResponse.json({
      success: true,
      message: "Creator has been officially approved and verified",
      status: "approved"
    });

  } catch (err: any) {
    console.error("Approve Error:", err.message);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
