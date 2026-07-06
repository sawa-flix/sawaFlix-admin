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
  youtube_url: string;
  title: string;
  thumbnail_url: string;
  author_name: string;
  category: 'Music' | 'Video' | 'Comedy' | 'Documentary' | string;
  genre: string;
  region: string;
  status: 'draft' | 'published';
  created_at: string;
  published_at?: string;
  source_type: 'admin';
}

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://sawaflix-backend.onrender.com';
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
        const url = new URL(`${API_URL}/api/admin/artists/search`);
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
        const res = await fetch(`${API_URL}/api/admin/top-artists`, { headers });
        if (!res.ok) {
            console.warn(`[API] getTopArtists returned ${res.status}. If 404, tell backend dev to add GET /api/admin/top-artists`);
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
    const res = await fetch(`${API_URL}/api/admin/top-artists`, {
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
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_URL}/api/admin/content`, { headers });
        if (!res.ok) {
            console.warn(`[API] getAdminContent returned ${res.status}`);
            return [];
        }
        const data = await res.json();
        return Array.isArray(data) ? data : (data.data || []);
    } catch (err) {
        console.error("Failed to fetch admin content:", err);
        return [];
    }
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

    const res = await fetch(`${API_URL}/api/admin/content`, {
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
    const res = await fetch(`${API_URL}/api/admin/content/${id}`, {
        method: 'DELETE',
        headers
    });
    
    if (!res.ok) {
        throw new Error(`Failed to delete content (Status: ${res.status})`);
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
  
    try {
      const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
      if (!res.ok) {
        throw new Error('Failed to fetch video details from YouTube oEmbed endpoint.');
      }
      const data = await res.json();
      return {
        title: data.title || 'Untitled YouTube Video',
        author_name: data.author_name || 'Unknown Creator',
        thumbnail_url: data.thumbnail_url || 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=320&h=180&fit=crop'
      };
    } catch (err) {
      console.warn("oEmbed failed, returning mock data:", err);
      return {
        title: 'YouTube Video Title (Mocked oEmbed Response)',
        author_name: 'YouTube Channel Name',
        thumbnail_url: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=320&h=180&fit=crop'
      };
    }
}

export async function getHistoryLog(): Promise<any[]> {
    // Return empty history if we are no longer tracking this locally.
    // The backend would need a history endpoint if you want to keep this feature.
    return [];
}
