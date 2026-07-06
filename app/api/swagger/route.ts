// app/api/swagger/route.ts
import { getApiDocs } from "@/lib/swagger";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const spec = await getApiDocs();
    return NextResponse.json(spec);
  } catch (error) {
    return NextResponse.json({ error: "Failed to load API docs" }, { status: 500 });
  }
}