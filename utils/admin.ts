import { createClient } from "@supabase/supabase-js";
import { sendApprovalEmail, sendRejectionEmail } from "./email";

interface VerificationOptions {
  creatorId: string;
  status: 'approved' | 'rejected' | 'info_requested';
  notes?: string;
  adminId?: string;
}

/**
 * Shared utility to process creator verification actions.
 * Updates verification_submissions, creator_profile, and global users table.
 * Triggers email notifications and audit logs.
 */
export async function processVerification({ 
  creatorId, 
  status, 
  notes, 
  adminId = "system" 
}: VerificationOptions) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const isApproved = status === "approved";

  // 1. Fetch submission data for email/name
  const { data: submission, error: fetchError } = await supabase
    .from("verification_submissions")
    .select("creator_id, form_data")
    .eq("creator_id", creatorId)
    .single();

  if (fetchError || !submission) {
    throw new Error("Verification submission not found.");
  }

  const email = submission.form_data?.identity?.email;
  const fullName = submission.form_data?.identity?.legalName || submission.form_data?.identity?.fullName || 'Creator';

  // 2. Update Submission Table
  const { error: subError } = await supabase
    .from("verification_submissions")
    .update({
      status,
      admin_notes: notes || "",
      updated_at: new Date().toISOString()
    })
    .eq("creator_id", creatorId);

  if (subError) throw subError;

  // 3. Update Creator Profile
  // We use .update().eq() which is okay if the profile doesn't exist (0 rows updated)
  const { error: profileError } = await supabase
    .from("creator_profile")
    .update({
      is_verified: isApproved
    })
    .eq("creator_id", creatorId);

  // If creator_profile uses 'creator_profiles' (plural), handle both just in case
  await supabase
    .from("creator_profiles")
    .update({
      is_verified: isApproved
    })
    .eq("creator_id", creatorId);

  // 4. Update Global Users table
  const { error: userError } = await supabase
    .from("users")
    .update({
      verification_status: status,
      is_verified: isApproved
    })
    .eq("id", creatorId);

  if (userError) console.error("Global users update error:", userError.message);

  // 5. Audit Logging
  try {
    await supabase.from("admin_actions").insert({
      admin_id: adminId,
      submission_id: creatorId,
      action_type: status,
      notes: notes || ""
    });
  } catch (auditErr) {
    console.warn("Audit logging skipped - table admin_actions likely missing or inaccessible.");
  }

  // 6. Notifications
  if (email) {
    if (status === "approved") {
      await sendApprovalEmail(email, fullName, "");
    } else if (status === "rejected") {
      await sendRejectionEmail(email, fullName, notes || "Your application was reviewed and could not be approved at this time.");
    }
  }

  return { success: true, status };
}
