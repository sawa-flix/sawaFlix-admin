import { processVerification } from "@/utils/admin";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: creatorId } = await params;

  try {
    const body = await req.json().catch(() => ({}));
    const notes = body.notes || body.reason;

    if (!notes || notes.length < 5) {
      return NextResponse.json(
        { error: "A valid rejection reason (minimum 5 characters) is required." },
        { status: 400 }
      );
    }

    const result = await processVerification({
      creatorId,
      status: 'rejected',
      notes,
      adminId: "admin_detail_view"
    });

    return NextResponse.json({
      success: true,
      message: "Creator rejected successfully.",
      ...result
    });

  } catch (err: any) {
    console.error("Rejection Error:", err.message);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
