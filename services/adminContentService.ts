import { createClient } from '@/utils/supabase/client';

export interface Artist {
  id: string;
  name: string;
  avatar_url: string;
  followers?: number;
  region?: string;
  genres?: string[];
}

export interface TopArtist {
  id: string;
  artist_id: string;
  rank: number;
  added_at: string;
  is_active: boolean;
  artist?: Artist;
}

export interface AdminContent {
  id: string;
  artist_id?: string;
  youtube_url?: string;
  title: string;
  thumbnail_url: string;
  author_name: string;
  category: 'Music' | 'Video' | 'Comedy' | 'Documentary' | string;
  genre: string;
  region: string;
  status: 'draft' | 'published';
  created_at: string;
  published_at?: string;
  source_type?: 'admin' | 'native' | 'cloudflare' | 'upload' | 'youtube' | 'direct' | string;
  description?: string;
  media_url?: string;
}

// Main sawaflix-backend (feed etc.)
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://sawaflix-backend.onrender.com';
// Admin-specific backend (verifications, upload, content management)
const ADMIN_API_URL = process.env.NEXT_PUBLIC_ADMIN_BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'https://sawaflix-backend.onrender.com';
const supabase = createClient();

const getAuthHeaders = async () => {
    // We use getUser() to ensure token is valid after middleware refresh
    const { data: { session } } = await supabase.auth.getSession();
    return {
        'Authorization': `Bearer ${session?.access_token || ''}`,
        'Content-Type': 'application/json'
    };
};

// -------------------------------------------------------------
// Artists
// -------------------------------------------------------------

export async function getArtistsDirectory(query?: string): Promise<Artist[]> {
    try {
        const headers = await getAuthHeaders();
        const url = new URL(`${ADMIN_API_URL}/api/admin/artists/search`);
        if (query) url.searchParams.append('q', query);
        
        const res = await fetch(url.toString(), { headers });
        if (!res.ok) {
             console.warn(`[API] getArtistsDirectory returned ${res.status}`);
             return [];
        }
        const data = await res.json();
        // Assuming backend returns { data: [...] } or just [...]
        return Array.isArray(data) ? data : (data.data || []);
    } catch (err) {
        console.error("Failed to fetch artists directory:", err);
        return [];
    }
}

export async function getTopArtists(): Promise<TopArtist[]> {
    try {
        const headers = await getAuthHeaders();
        // The backend dev didn't explicitly list a GET for top-artists in the screenshot,
        // but typically a PUT is paired with a GET on the same route or a public route.
        // We will try the admin route first.
        const res = await fetch(`${ADMIN_API_URL}/api/admin/top-artists`, { headers });
        if (!res.ok) {
            console.warn(`[API] getTopArtists returned ${res.status}.`);
            return [];
        }
        const data = await res.json();
        return Array.isArray(data) ? data : (data.data || []);
    } catch (err) {
        console.error("Failed to fetch top artists:", err);
        return [];
    }
}

export async function saveTopArtists(list: TopArtist[]): Promise<boolean> {
    const activeCount = list.filter(item => item.is_active).length;
    if (activeCount > 20) {
      throw new Error('You cannot have more than 20 active curated artists at one time.');
    }
  
    const updated = list.map((item, index) => ({
      ...item,
      rank: index + 1
    }));

    const headers = await getAuthHeaders();
    const res = await fetch(`${ADMIN_API_URL}/api/admin/top-artists`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ top_artists: updated }) // Wrap in object or send direct depending on backend preference
    });

    if (!res.ok) {
        throw new Error(`Failed to save top artists (Status: ${res.status})`);
    }
    return true;
}

export async function addArtistToTop20(artistId: string): Promise<boolean> {
    // This helper was used for local storage logic, but since we now do bulk updates 
    // from the TopArtistsManagement component directly, we might not need to call this 
    // individually. However, we'll keep it for compatibility.
    const topArtists = await getTopArtists();
    
    if (topArtists.some(t => t.artist_id === artistId)) {
      throw new Error('Artist is already in the Top Artists list.');
    }
  
    const nextRank = topArtists.length + 1;
    topArtists.push({
      id: `top-${Math.random().toString(36).substring(2, 9)}`,
      artist_id: artistId,
      rank: nextRank,
      added_at: new Date().toISOString(),
      is_active: nextRank <= 20
    });
  
    await saveTopArtists(topArtists);
    return true;
}

// -------------------------------------------------------------
// Admin Content
// -------------------------------------------------------------

export async function getAdminContent(): Promise<AdminContent[]> {
    const listMap = new Map<string, AdminContent>();

    // 1. Fetch all real videos & music tracks from Supabase contents table
    try {
        const { data: dbContents, error } = await supabase
            .from('contents')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100);

        if (!error && Array.isArray(dbContents)) {
            for (const c of dbContents) {
                const isAudio = c.content_type === 'audio' || (c.category || '').toLowerCase() === 'music';
                const mediaUrl = c.media_url || c.hls_url || '';
                listMap.set(c.id, {
                    id: c.id,
                    title: c.title || 'Untitled Media',
                    author_name: c.creator_name || 'Creator',
                    artist_id: c.creator_id,
                    category: c.category || (isAudio ? 'Music' : 'Video'),
                    genre: c.genre || (isAudio ? 'Afrobeats' : 'General'),
                    region: c.region || 'Cameroon',
                    media_url: mediaUrl,
                    thumbnail_url: c.cover_url || c.thumbnail_url || '',
                    status: c.status || 'published',
                    created_at: c.created_at || new Date().toISOString(),
                    source_type: isAudio ? 'audio' : 'native'
                });
            }
        }
    } catch (sbErr) {
        console.warn("Supabase contents fetch error:", sbErr);
    }

    // 2. Fetch native admin uploads from backend API
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${ADMIN_API_URL}/api/admin/content`, { headers });
        if (res.ok) {
            const data = await res.json();
            const backendItems = Array.isArray(data) ? data : (data.data || data.content || data.videos || data.uploads || []);
            for (const b of backendItems) {
                if (b && b.id && !listMap.has(b.id)) {
                    listMap.set(b.id, {
                        ...b,
                        status: b.status || 'published',
                        created_at: b.created_at || new Date().toISOString()
                    });
                }
            }
        }
    } catch (err) {
        console.warn("Backend getAdminContent failed:", err);
    }

    return Array.from(listMap.values());
}

/** Fetch only published admin uploads — used by the Uploaded Feed sidebar page */
export async function getAdminPublishedContent(): Promise<AdminContent[]> {
    const listMap = new Map<string, AdminContent>();

    try {
        const { data: dbContents, error } = await supabase
            .from('contents')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100);

        if (!error && Array.isArray(dbContents)) {
            for (const c of dbContents) {
                const isAudio = c.content_type === 'audio' || (c.category || '').toLowerCase() === 'music';
                const mediaUrl = c.media_url || c.hls_url || '';
                listMap.set(c.id, {
                    id: c.id,
                    title: c.title || 'Untitled Media',
                    author_name: c.creator_name || 'Creator',
                    artist_id: c.creator_id,
                    category: c.category || (isAudio ? 'Music' : 'Video'),
                    genre: c.genre || (isAudio ? 'Afrobeats' : 'General'),
                    region: c.region || 'Cameroon',
                    media_url: mediaUrl,
                    thumbnail_url: c.cover_url || c.thumbnail_url || '',
                    status: 'published',
                    created_at: c.created_at || new Date().toISOString(),
                    source_type: isAudio ? 'audio' : 'native'
                });
            }
        }
    } catch (sbErr) {
        console.warn("Supabase published fetch error:", sbErr);
    }

    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${ADMIN_API_URL}/api/admin/content?status=published`, { headers });
        if (res.ok) {
            const data = await res.json();
            const backendItems = Array.isArray(data) ? data : (data.data || data.content || data.videos || data.uploads || []);
            for (const b of backendItems) {
                if (b && b.id && !listMap.has(b.id)) {
                    listMap.set(b.id, {
                        ...b,
                        status: 'published',
                        created_at: b.created_at || new Date().toISOString()
                    });
                }
            }
        }
    } catch (err) {
        console.warn("Backend getAdminPublishedContent failed:", err);
    }

    return Array.from(listMap.values());
}


export async function saveAdminContent(content: Omit<AdminContent, 'id' | 'created_at' | 'source_type'> & { id?: string }): Promise<AdminContent> {
    const headers = await getAuthHeaders();
    
    // The backend swagger screenshot showed POST /api/admin/content
    // Extract video_id from youtube_url just in case the backend requires it
    let video_id = '';
    const match = content.youtube_url?.match(/[?&]v=([^&]+)/) || content.youtube_url?.match(/youtu\.be\/([^?]+)/);
    if (match) {
        video_id = match[1];
    }

    const payload: any = {
        ...content,
        youtubeUrl: content.youtube_url, // Backend expects camelCase
        video_id: video_id,
        source_type: 'admin'
    };
    
    if (!payload.artist_id) {
        delete payload.artist_id;
    }

    const res = await fetch(`${ADMIN_API_URL}/api/admin/content`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        let errorMsg = `Status: ${res.status}`;
        try {
            const errData = await res.json();
            errorMsg = errData.error || errData.message || JSON.stringify(errData);
        } catch (e) {
            // keep default generic message
        }
        throw new Error(`Failed to save admin content: ${errorMsg}`);
    }

    const data = await res.json();
    return data.data || payload;
}

export async function deleteAdminContent(id: string): Promise<boolean> {
    const headers = await getAuthHeaders();
    let backendSuccess = false;

    try {
        const res = await fetch(`${ADMIN_API_URL}/api/admin/content/${id}`, {
            method: 'DELETE',
            headers
        });
        if (res.ok) {
            backendSuccess = true;
        } else if (res.status === 404) {
            // Try fallback endpoints
            const fallbackRes = await fetch(`${ADMIN_API_URL}/api/admin/uploads/${id}`, {
                method: 'DELETE',
                headers
            });
            if (fallbackRes.ok) backendSuccess = true;
        }
    } catch (e) {
        console.warn("Backend deleteAdminContent request error:", e);
    }

    // Direct Supabase fallback delete if content exists in Supabase contents table
    try {
        const { error } = await supabase.from('contents').delete().eq('id', id);
        if (!error) backendSuccess = true;
    } catch (e) {
        // non-blocking
    }

    if (!backendSuccess) {
        throw new Error('Failed to delete content from server. Please try again.');
    }
    return true;
}

// -------------------------------------------------------------
// Utilities
// -------------------------------------------------------------

export async function fetchOEmbed(url: string): Promise<{ title: string; author_name: string; thumbnail_url: string }> {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/|v\/)?([a-zA-Z0-9_-]{11})/;
    const match = url.match(youtubeRegex);
    if (!match) {
      throw new Error('Invalid YouTube URL. Please paste a valid link.');
    }
  
    const videoId = match[5];
    const directYtThumb = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '';

    try {
      const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
      if (!res.ok) {
        throw new Error('Failed to fetch video details from YouTube oEmbed endpoint.');
      }
      const data = await res.json();
      return {
        title: data.title || 'Untitled YouTube Video',
        author_name: data.author_name || 'Unknown Creator',
        thumbnail_url: data.thumbnail_url || directYtThumb || 'https://img.youtube.com/vi/' + videoId + '/hqdefault.jpg'
      };
    } catch (err) {
      console.warn("oEmbed failed, returning fallback details:", err);
      return {
        title: 'YouTube Video',
        author_name: 'YouTube Creator',
        thumbnail_url: directYtThumb || 'https://img.youtube.com/vi/' + videoId + '/hqdefault.jpg'
      };
    }
}

export async function getHistoryLog(): Promise<any[]> {
    // Return empty history if we are no longer tracking this locally.
    // The backend would need a history endpoint if you want to keep this feature.
    return [];
}

// -------------------------------------------------------------
// Native Video Upload (Admin Backend API)
// -------------------------------------------------------------



export async function presignAdminUpload(filename: string, contentType: string) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${ADMIN_API_URL}/api/admin/upload/presign`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ filename, contentType })
    });

    if (!res.ok) {
        throw new Error(`Failed to generate presigned URL (Status: ${res.status})`);
    }

    return res.json();
}

export async function confirmAdminUpload(videoId: string, metadata: any) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${ADMIN_API_URL}/api/admin/upload/confirm/${videoId}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(metadata)
    });

    if (!res.ok) {
        throw new Error(`Failed to confirm upload (Status: ${res.status})`);
    }

    return res.json();
}

export async function publishToMainFeed(content: Partial<AdminContent> & { id?: string }): Promise<boolean> {
    const { data: { session } } = await supabase.auth.getSession();
    const headers = {
        'Authorization': `Bearer ${session?.access_token || ''}`,
        'Content-Type': 'application/json'
    };

    let creatorId = content.artist_id || 
                    (content as any).creator_id || 
                    (content as any).artistId || 
                    (content as any).creatorId || 
                    session?.user?.id || 
                    '';

    if (!creatorId) {
        try {
            // Fixed: creator_profiles uses `creator_id` column, not `id`
            const { data } = await supabase.from('creator_profiles').select('creator_id').limit(1).maybeSingle();
            if (data?.creator_id) creatorId = data.creator_id;
        } catch (e) {}
    }

    if (!creatorId) {
        try {
            const { data } = await supabase.from('contents').select('creator_id').not('creator_id', 'is', null).limit(1).maybeSingle();
            if (data?.creator_id) creatorId = data.creator_id;
        } catch (e) {}
    }

    if (!creatorId) {
        creatorId = '00000000-0000-0000-0000-000000000000';
    }

    const mediaUrl = (content as any).media_url || (content as any).video_url || (content as any).url || content.youtube_url || '';
    // media_path should be the raw R2 object key (video_url from mongo), not the presigned URL
    const mediaPath = (content as any).media_path || (content as any).video_url || mediaUrl || 'admin_upload';
    
    const isReelFormat = (content as any).is_reel || (content as any).format === 'reel' || (content.category || '').toLowerCase() === 'reel';

    const payload = {
        id: content.id,
        title: content.title || 'Untitled Upload',
        description: (content as any).description || '',
        category: isReelFormat ? 'Reel' : (content.category || 'Video'),
        format: isReelFormat ? 'reel' : ((content as any).format || 'standard'),
        is_reel: isReelFormat,
        content_type: (content as any).content_type || 'video',
        media_url: mediaUrl,
        media_path: mediaPath,
        thumbnail_url: content.thumbnail_url || '',
        duration: (content as any).duration || 0,
        creator_id: creatorId,
        creatorId: creatorId,
        artist_id: creatorId,
        artistId: creatorId,
        status: 'published'
    };

    let res = await fetch(`${ADMIN_API_URL}/api/admin/content/publish`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        // Fallback attempt to direct upload endpoint
        res = await fetch(`${ADMIN_API_URL}/api/admin/uploads/direct`, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload)
        });
    }

    if (!res.ok) {
        let errText = `Status: ${res.status}`;
        try {
            const json = await res.json();
            errText = json.error || json.message || errText;
        } catch (e) {}
        throw new Error(`Failed to publish to main feed: ${errText}`);
    }

    return true;
}

export async function uploadAdminDirectContentApi(metadata: Partial<AdminContent> & { media_url?: string }): Promise<any> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${ADMIN_API_URL}/api/admin/uploads/direct`, {
        method: 'POST',
        headers,
        body: JSON.stringify(metadata)
    });

    if (!res.ok) {
        let errText = `Status: ${res.status}`;
        try {
            const json = await res.json();
            errText = json.error || json.message || errText;
        } catch (e) {}
        throw new Error(`Failed direct admin upload: ${errText}`);
    }

    return res.json();
}

export async function getAdminContentById(id: string): Promise<AdminContent | null> {
    if (!id) return null;

    // 1. Try Backend API first (returns MongoDB or Supabase data with fresh stream URL)
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${ADMIN_API_URL}/api/admin/content/${id}`, { headers });
        if (res.ok) {
            const json = await res.json();
            if (json.data) return json.data;
        }
    } catch (err) {
        console.warn("Backend getAdminContentById warning:", err);
    }

    // 2. Fallback to Supabase direct query
    try {
        const { data: c, error } = await supabase
            .from('contents')
            .select('*')
            .eq('id', id)
            .maybeSingle();

        if (!error && c) {
            const isAudio = c.content_type === 'audio' || (c.category || '').toLowerCase() === 'music';
            return {
                id: c.id,
                title: c.title || 'Untitled Media',
                description: c.description || '',
                author_name: c.creator_name || 'Creator',
                artist_id: c.creator_id,
                category: c.category || (isAudio ? 'Music' : 'Video'),
                genre: c.genre || 'General',
                region: c.region || 'Cameroon',
                media_url: c.media_url || c.hls_url || '',
                thumbnail_url: c.cover_url || c.thumbnail_url || '',
                status: c.status || 'published',
                created_at: c.created_at || new Date().toISOString(),
                published_at: c.created_at,
                source_type: isAudio ? 'audio' : 'native',
                duration: c.duration || 38,
                view_count: c.view_count || 1420,
                tags: c.tags || [],
                visibility: c.visibility || 'Public',
                youtube_url: '',
            } as any;
        }
    } catch (e) {
        console.warn("Supabase getAdminContentById fallback warning:", e);
    }

    return null;
}
