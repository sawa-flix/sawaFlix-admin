import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const API_KEY = process.env.YOUTUBE_API_KEY;

    if (!API_KEY) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    // 1. Extract Search Parameters from the incoming request
    const { searchParams } = new URL(request.url);
    const customQuery = searchParams.get('q');
    const pageToken = searchParams.get('pageToken'); // The "bookmark" for infinite scroll
    
    // Default search targeting Cameroon 237 content
    const defaultQuery = "Cameroon music 2025 | 237 comedy | Cameroun culture";
    const finalQuery = customQuery || defaultQuery;

    // 2. PHASE 1: SEARCH (Find Video IDs)
    // We limit maxResults to 5 to keep the "3-at-a-time" load feel and save quota
    const searchUrl = new URL("https://www.googleapis.com/youtube/v3/search");
    searchUrl.searchParams.append("part", "id");
    searchUrl.searchParams.append("maxResults", "5"); 
    searchUrl.searchParams.append("type", "video");
    searchUrl.searchParams.append("regionCode", "CM"); // Target Cameroon region
    searchUrl.searchParams.append("relevanceLanguage", "fr"); // Cameroon is bilingual, heavy on French/Pidgin
    searchUrl.searchParams.append("q", finalQuery);
    searchUrl.searchParams.append("videoEmbeddable", "true");
    searchUrl.searchParams.append("videoDefinition", "high");
    
    // If a pageToken exists, append it to get the next batch of results
    if (pageToken) {
      searchUrl.searchParams.append("pageToken", pageToken);
    }
    
    searchUrl.searchParams.append("key", API_KEY);

    const searchRes = await fetch(searchUrl.toString(), {
      // Small cache window for search to keep content fresh but save quota
      next: { revalidate: 1800 } 
    });
    
    const searchData = await searchRes.json();

    if (!searchRes.ok) {
      throw new Error(searchData.error?.message || "YouTube Search API failed");
    }

    // Extract just the IDs to feed into the next API call
    const videoIds = searchData.items?.map((item) => item.id.videoId).join(",");

    if (!videoIds) {
      return NextResponse.json({ items: [], nextPageToken: null });
    }

    // 3. PHASE 2: STATISTICS & DETAILS (Get Likes, Comments, Channel Info)
    // This is where the "Lively" data (stats) comes from
    const statsUrl = new URL("https://www.googleapis.com/youtube/v3/videos");
    statsUrl.searchParams.append("part", "snippet,statistics,contentDetails");
    statsUrl.searchParams.append("id", videoIds);
    statsUrl.searchParams.append("key", API_KEY);

    const statsRes = await fetch(statsUrl.toString());
    const statsData = await statsRes.json();

    if (!statsRes.ok) {
      throw new Error(statsData.items?.error?.message || "YouTube Stats API failed");
    }

    // 4. COMBINED RESPONSE
    return NextResponse.json({
      items: statsData.items, // Detailed videos with real counts
      nextPageToken: searchData.nextPageToken || null // The token for the next scroll
    });

  } catch (error) {
    console.error("🔴 YouTube API Route Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch content" },
      { status: 500 }
    );
  }
}