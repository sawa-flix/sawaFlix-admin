import { createClient } from '../../../../utils/supabase/server';
// import { getValidToken } from '@/utils/youtube/refresh-token';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const supabase = await createClient();
    const { videoId, commentText } = await request.json();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const accessToken = await getValidToken(supabase, user.id);

    const youtubeRes = await fetch(
      `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          snippet: {
            videoId: videoId,
            topLevelComment: {
              snippet: {
                textOriginal: commentText,
              },
            },
          },
        }),
      }
    );

    if (!youtubeRes.ok) {
      const errorData = await youtubeRes.json();
      throw new Error(errorData.error?.message || "Failed to post comment");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}