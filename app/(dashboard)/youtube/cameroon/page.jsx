"use client";

import { useEffect, useState } from "react";

export default function CameroonReelsPage() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    async function loadVideos() {
      const res = await fetch("/api/youtube/cameroon");
      const data = await res.json();

      // Filter only valid video items
      const validVideos = (data.items || []).filter(
        (item) => item.id && item.id.videoId
      );

      setVideos(validVideos);
    }

    loadVideos();
  }, []);

  return (
    <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory bg-black">
      {videos.map((video) => (
        <div
          key={video.id.videoId}
          className="h-screen w-full snap-start flex items-center justify-center relative"
        >
          {/* YouTube Player */}
          <iframe
            src={`https://www.youtube.com/embed/${video.id.videoId}?autoplay=1&mute=1&controls=0&playsinline=1`}
            className="w-full h-full"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />

          {/* Overlay */}
          <div className="absolute bottom-20 left-4 text-white">
            <h2 className="text-lg font-semibold">{video.snippet.title}</h2>
            <p className="text-sm opacity-80">{video.snippet.channelTitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
