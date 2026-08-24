/**
 * Utility to extract YouTube video ID from various YouTube URL formats.
 */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

/**
 * Returns a high quality YouTube thumbnail URL for a given video URL or ID.
 */
export function getYouTubeThumbnailUrl(urlOrId: string): string | null {
  const videoId = extractYouTubeId(urlOrId) || (urlOrId.length === 11 ? urlOrId : null);
  if (!videoId) return null;
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

/**
 * Gets the best thumbnail for any video item:
 * 1. Returns existing non-placeholder thumbnail if present
 * 2. If YouTube URL, returns YouTube thumbnail
 * 3. Returns null (signaling video frame element playback with #t=0.5 for direct video files)
 */
export function getEffectiveThumbnail(
  thumbnailUrl?: string | null,
  mediaUrl?: string | null,
  youtubeUrl?: string | null
): string | null {
  // If thumbnail exists and is not an unsplash placeholder or empty
  if (thumbnailUrl && !thumbnailUrl.includes('unsplash.com') && thumbnailUrl.trim() !== '') {
    return thumbnailUrl;
  }

  // Try extracting YouTube thumbnail
  const targetUrl = youtubeUrl || mediaUrl || '';
  const ytThumb = getYouTubeThumbnailUrl(targetUrl);
  if (ytThumb) {
    return ytThumb;
  }

  return null;
}
