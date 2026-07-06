import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * @swagger
 * /api/admin/verifications/{id}:
 *   get:
 *     summary: Get verification submission details
 *     description: Fetch full verification submission details for a specific creator.
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
 *     responses:
 *       200:
 *         description: Submission details retrieved successfully
 *       404:
 *         description: No submission record found
 *       500:
 *         description: Server error
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "";

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { data: submission, error } = await supabase
      .from("verification_submissions")
      .select("*")
      .eq("creator_id", id)
      .single();

    if (error || !submission) {
      return NextResponse.json(
        { error: "Verification not found" },
        { status: 404 }
      );
    }

    // Normalise the raw Supabase row into the shape VerificationDetails.tsx expects
    const fd = submission.form_data || {};
    const identity = fd.identity || {};
    const professional = fd.professional || {};
    const portfolio = fd.portfolio || {};
    const documents = fd.documents || {};

    const formatted = {
      id: submission.creator_id,
      status: submission.status || "pending",
      identity: {
        legalName: identity.legalName || "Unknown",
        stageName: identity.stageName || "",
        email: identity.email || "",
        phone: identity.phone || "",
        dob: identity.dob || "",
        nationality: identity.nationality || "",
        location: identity.ethnicGroup || identity.residenceArea || "",
        avatarUrl: identity.avatarUrl || null,
      },
      professional: {
        category: submission.category || professional.category || "Unknown",
        bio: professional.bio || "",
        yearsActive: professional.yearsActive || 0,
        experience: professional.experienceTime || professional.yearsOfExperience || professional.yearsActive || 0,
        ethnicGroup: professional.ethnicGroup,
        languages: professional.languages,
        focusArea: professional.focusArea,
        signatureDishes: professional.signatureDishes,
        roles: professional.roles,
        filmography: professional.filmography,
        genre: professional.genre,
        label: professional.label,
      },
      portfolio: {
        links: (portfolio.links || []).filter(Boolean).map((link: string) => {
          let type = 'other';
          if(link.includes('youtube') || link.includes('youtu.be')) type = 'youtube';
          else if(link.includes('spotify')) type = 'spotify';
          return { url: link, type };
        }),
        videos: (portfolio.recordings || []).map((rec: any) => ({
          url: rec.file_url || '',
          title: rec.title || 'Untitled Recording',
          description: rec.description || ''
        })).filter((v: any) => v.url !== ''),
      },
      documents: {
        idCardUrl: documents.id_url || documents.idCardUrl || null,
        selfieUrl: documents.selfie_url || documents.selfieUrl || null,
        endorsementUrl: documents.endorsements_url || documents.endorsementUrl || null,
        distributorProofUrl: documents.distributorProofUrl || null,
        productionProofUrl: documents.productionProofUrl || null,
        foodLicenseUrl: documents.foodLicenseUrl || null,
        verificationVideoUrl: documents.verificationVideoUrl || null,
      },
    };

    return NextResponse.json({ success: true, data: formatted });
  } catch (err: any) {
    console.error("Verification detail fetch error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
