'use server';

import { createClient } from '../../utils/supabase/server';
import { v4 as uuidv4 } from 'uuid';

interface VideoUploadMetadata {
  title: string;
  description: string;
  release_date?: string;
  producer_name?: string;
  producer_id?: string;
  is_featured: boolean;
  featured_actors?: string;
  file_path: string;
  video_url: string;
  file_size: number;
  mime_type: string;
}

/**
 * Server action to insert video metadata into the database
 * Reduces network round-trips and provides better security
 */
export async function insertVideoMetadata(metadata: VideoUploadMetadata) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('Authentication failed');
    }

    const movieId = uuidv4();
    const producerId = metadata.producer_id || uuidv4();

    // Insert video metadata
    const { data, error } = await supabase
      .from('movies')
      .insert({
        id: movieId,
        title: metadata.title.trim(),
        description: metadata.description.trim(),
        release_date: metadata.release_date || null,
        producer_id: producerId,
        producer_name: metadata.producer_name?.trim() || null,
        is_featured: metadata.is_featured,
        featured_actors: metadata.featured_actors?.trim() || null,
        file_path: metadata.file_path,
        video_url: metadata.video_url,
        file_size: metadata.file_size,
        mime_type: metadata.mime_type,
        uploaded_by: user.id,
        created_at: new Date().toISOString(),
      })
      .select();

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    return { success: true, data, movieId };
  } catch (error) {
    console.error('Insert video metadata error:', error);
    throw error;
  }
}

/**
 * Server action to fetch videos with pagination
 * Improves performance with selective columns and limit
 */
export async function fetchVideos(page: number = 1, pageSize: number = 10) {
  try {
    const supabase = await createClient();
    
    const offset = (page - 1) * pageSize;

    const { data: videos, error } = await supabase
      .from('movies')
      .select('id,title,description,release_date,producer_id,producer_name,is_featured,featured_actors,video_url,file_path,file_size,mime_type,uploaded_by,created_at')
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (error) {
      throw new Error(`Error loading videos: ${error.message}`);
    }

    return { success: true, data: videos || [] };
  } catch (error) {
    console.error('Fetch videos error:', error);
    throw error;
  }
}

/**
 * Server action to get featured videos
 * Optimized query for featured content
 */
export async function fetchFeaturedVideos(limit: number = 10) {
  try {
    const supabase = await createClient();

    const { data: videos, error } = await supabase
      .from('movies')
      .select('id,title,description,release_date,producer_id,producer_name,is_featured,featured_actors,video_url,file_path,file_size,mime_type,created_at')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Error loading featured videos: ${error.message}`);
    }

    return { success: true, data: videos || [] };
  } catch (error) {
    console.error('Fetch featured videos error:', error);
    throw error;
  }
}

/**
 * Server action to cleanup failed uploads
 * Removes files from storage if database insert fails
 */
export async function cleanupFailedUpload(filePath: string) {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase.storage
      .from('videos')
      .remove([filePath]);

    if (error) {
      console.warn(`Cleanup warning: ${error.message}`);
      // Don't throw - cleanup failures shouldn't break the user experience
    }

    return { success: true };
  } catch (error) {
    console.error('Cleanup failed upload error:', error);
    return { success: false };
  }
}
