import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { data: allSubmissions, error } = await supabase
      .from("verification_submissions")
      .select("status, category, created_at, updated_at");

    if (error) throw error;

    const total = allSubmissions.length;
    const pending = allSubmissions.filter(s => s.status === 'pending').length;
    const approved = allSubmissions.filter(s => s.status === 'approved').length;
    const rejected = allSubmissions.filter(s => s.status === 'rejected').length;

    // Approval Rate
    const resolvedCount = approved + rejected;
    const approvalRate = resolvedCount > 0 ? ((approved / resolvedCount) * 100).toFixed(1) : 0;

    // Average Verification Time (for approved/rejected)
    let totalTimeMs = 0;
    let timedCount = 0;
    allSubmissions.forEach(sub => {
      if ((sub.status === 'approved' || sub.status === 'rejected') && sub.created_at && sub.updated_at) {
        const created = new Date(sub.created_at).getTime();
        const updated = new Date(sub.updated_at).getTime();
        if (updated > created) {
          totalTimeMs += (updated - created);
          timedCount++;
        }
      }
    });

    const avgTimeHours = timedCount > 0 ? (totalTimeMs / timedCount / (1000 * 60 * 60)).toFixed(1) : 0;

    const categoryMapping: Record<string, string> = {
      "Music": "Music Artist",
      "Film": "Actor/Filmmaker",
      "Comedy": "Comedian",
      "Traditional storyteller": "Traditional Storyteller",
      "Food&lifestyle": "Food & Lifestyle",
      "General": "General"
    };

    // Rejections by category
    const rejectionsByCategory = allSubmissions
      .filter(s => s.status === 'rejected' && s.category)
      .reduce((acc: Record<string, number>, sub) => {
        const catName = categoryMapping[sub.category] || sub.category || "Unknown";
        acc[catName] = (acc[catName] || 0) + 1;
        return acc;
      }, {});

    return NextResponse.json({
      success: true,
      data: {
        total,
        pending,
        approved,
        rejected,
        approvalRate,
        avgTimeHours,
        rejectionsByCategory
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
