import { processVerification } from "@/utils/admin";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: creatorId } = await params;

  try {
    const body = await req.json().catch(() => ({}));
    const notes = body.notes || "Approved via detail view";

    const result = await processVerification({
      creatorId,
      status: 'approved',
      notes,
      adminId: "admin_detail_view"
    });

    return NextResponse.json({
      success: true,
      message: "Creator approved successfully.",
      ...result
    });

  } catch (err: any) {
    console.error("Approval Error:", err.message);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
