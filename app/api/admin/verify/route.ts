import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import { processVerification } from "@/utils/admin";
import { z } from "zod";

const VerifySchema = z.object({
  target_creator_id: z.string().uuid(),
  status: z.enum(['approved', 'rejected', 'info_requested']),
  notes: z.string().optional()
});

export async function PUT(req: Request) {
  const authHeader = req.headers.get("Authorization");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // 1. Determine which Admin is performing the action
    let adminId = "system_admin";
    if (authHeader?.startsWith("Bearer ")) {
      try {
        const token = authHeader.substring(7);
        const decoded: any = jwtDecode(token);
        adminId = decoded.sub || "service_role";
      } catch (e) {
        adminId = "token_auth"; 
      }
    }

    const body = await req.json();
    const result = VerifySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.format() },
        { status: 400 }
      );
    }

    const { target_creator_id, status, notes } = result.data;

    // Use shared utility
    const verifyResult = await processVerification({
      creatorId: target_creator_id,
      status,
      notes,
      adminId
    });

    return NextResponse.json({
      success: true,
      message: `Creator status updated to ${status}`,
      ...verifyResult
    });

  } catch (err: any) {
    console.error("Master Verify Endpoint Error:", err.message);
    return NextResponse.json(
      { error: "Verification processing failed", details: err.message },
      { status: 500 }
    );
  }
}
