// app/reels/page.tsx
import { createClient } from '../../../../utils/supabase/server';
import ReelsFeed from '../../../../components/reelsFeed';

export default async function ReelsPage() {
  const supabase = await createClient();
  
  try {
    // Fetch videos with only necessary columns and proper ordering
    // Added 'created_at' to the select - make sure this column exists in your movies table
    const { data: videos, error } = await supabase
      .from('movies')
      .select('id,title,description,release_date,producer_id,producer_name,is_featured,featured_actors,video_url,file_path,file_size,mime_type,uploaded_by,created_at')
      .order('created_at', { ascending: false })
      .limit(50); // Add limit for better performance

    if (error) {
      throw new Error(`Error loading videos: ${error.message}`);
    }

    // Transform the data to include producer info
    const transformedVideos = videos?.map(video => ({
      ...video,
      producers: video.producer_name ? { name: video.producer_name } : null
    })) || [];

    return <ReelsFeed videos={transformedVideos} />;

  } catch (error) {
    console.error('Error fetching videos:', error);
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-red-500">Error loading videos: {(error as Error).message}</p>
          <p className="text-gray-400 mt-2">Please check your database schema</p>
        </div>
      </div>
    );
  }
}