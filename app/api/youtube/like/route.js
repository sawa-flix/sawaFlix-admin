import { createClient } from '../../../../utils/supabase/server';
// import { getValidToken } from '../../../../utils/youtube/refresh-token';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const supabase = await createClient();
    const { videoId } = await request.json();

    // 1. Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 2. Get a valid (refreshed) access token
    const accessToken = await getValidToken(supabase, user.id);

    // 3. Call YouTube API to 'rate' the video
    // Rating can be: 'like', 'dislike', or 'none'
    const youtubeRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos/rate?id=${videoId}&rating=like`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!youtubeRes.ok) {
      const errorData = await youtubeRes.json();
      throw new Error(errorData.error?.message || "YouTube API failed");
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Like Route Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}