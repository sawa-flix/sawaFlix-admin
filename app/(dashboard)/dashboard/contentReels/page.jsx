// /app/reels/page.jsx
import path from 'path';
import { promises as fs } from 'fs';
import VideoPlayer from './VideoPlayer';

// This is a Server Component and can safely use Node.js modules like 'fs'
// to read from the local file system during the build process or on a server request.
async function getVideos() {
  const videosDir = path.join(process.cwd(), 'public', 'contentReels');

  try {
    const filenames = await fs.readdir(videosDir);
    const videoFiles = filenames.filter(file => file.endsWith('.mp4'));
    return videoFiles.map(file => `/contentReels/${file}`);
  } catch (error) {
    console.error('Failed to read videos directory:', error);
    return []; // Return an empty array on error
  }
}

export default async function ReelsPage() {
  const videoUrls = await getVideos();

  // Your page must return a single element. You can use a fragment or a div.
  return (
    <div>
      <div className="reels-container">
        {videoUrls.length > 0 ? (
          videoUrls.map((url) => (
            <VideoPlayer key={url} src={url} />
          ))
        ) : (
          <p>No videos found in the public/videos folder.</p>
        )}
      </div>
    </div>
  );
}