import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
/**
 * @swagger
 * /api/admin/verifications/{id}/request-info:
 *   post:
 *     summary: Request additional information
 *     description: Requests more information from the creator before verification can proceed.
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notes:
 *                 type: string
 *                 example: Please upload a clearer photo of your ID
 *               message:
 *                 type: string
 *                 example: Your selfie is too dark, please upload a new one
 *     responses:
 *       200:
 *         description: Information request sent to creator
 *       400:
 *         description: Explanation required
 *       500:
 *         description: Server error
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // FIX: Params is a Promise
) {
  // FIX: Await the params
  const { id: creatorId } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const body = await req.json().catch(() => ({}));
    const notes = body.notes || body.message;

    // Validation: Admin must tell the creator what to fix
    if (!notes || notes.length < 5) {
      return NextResponse.json(
        { error: "A clear explanation (minimum 5 characters) is required so the creator knows what to fix." },
        { status: 400 }
      );
    }

    // Update the Submission Status
    const { error: subError } = await supabase
      .from("verification_submissions")
      .update({
        status: "info_requested",
        admin_notes: notes,
        updated_at: new Date().toISOString()
      })
      .eq("creator_id", creatorId);

    if (subError) throw subError;

    // Optional: Update global user status if you are tracking it there
    await supabase
      .from("users")
      .update({ verification_status: "info_requested" })
      .eq("id", creatorId);

    return NextResponse.json({
      success: true,
      message: "Status updated to 'Info Requested'. The creator can now edit their submission.",
      status: "info_requested"
    });

  } catch (err: any) {
    console.error("Request Info Error:", err.message);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
