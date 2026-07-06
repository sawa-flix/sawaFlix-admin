"use client";

import { useEffect, useState, useRef } from "react";
import { Volume2, VolumeX, Heart, MessageCircle, UserPlus, Send, X, Check, Share2, Loader2 } from "lucide-react";

const formatCount = (num) => {
  if (!num) return 0;
  const n = parseInt(num);
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n;
};

const CATEGORIES = [
  { id: "all", label: "All 237", query: "Cameroon music 2025 | 237 comedy | Cameroun culture" },
  { id: "music", label: "Music", query: "Cameroon music hits 2025 | 237 urban music" },
  { id: "comedy", label: "Comedy", query: "Cameroun comedie | 237 comedy | Fingon Tralala" },
  { id: "news", label: "News", query: "Cameroon news | CRTV | Canal 2 International" },
];

export default function CameroonReelsPage() {
  // State Management
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [nextPageToken, setNextPageToken] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const [activeVideoId, setActiveVideoId] = useState(null);
  
  // Interaction States
  const [likedVideos, setLikedVideos] = useState([]); // Track IDs of liked videos
  const [followedChannels, setFollowedChannels] = useState([]);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [newComment, setNewComment] = useState("");

  // Progress Tracker States
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState("");

  const observerRef = useRef(null);

  // 1. Fetch Videos (Handles Initial Load, Category Switch, and Infinite Scroll)
  const fetchVideos = async (isNewCategory = false) => {
    if (loading) return;
    setLoading(true);

    try {
      const selectedCat = CATEGORIES.find(c => c.id === activeCategory);
      const tokenParam = isNewCategory ? "" : `&pageToken=${nextPageToken || ""}`;
      const res = await fetch(`/api/youtube/cameroon?q=${encodeURIComponent(selectedCat.query)}${tokenParam}`);
      const data = await res.json();

      if (isNewCategory) {
        setVideos(data.items || []);
        if (data.items?.length > 0) setActiveVideoId(data.items[0].id);
      } else {
        setVideos(prev => [...prev, ...(data.items || [])]);
      }
      setNextPageToken(data.nextPageToken);
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch on category change
  useEffect(() => {
    setNextPageToken(null);
    fetchVideos(true);
  }, [activeCategory]);

  // Load YouTube IFrame API Script
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }
  }, []);

  // 2. Intersection Observer (Scroll Detection)
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const vId = entry.target.getAttribute("data-id");
            setActiveVideoId(vId);

            // Infinite Scroll Trigger: Load more when reaching the last 2 videos
            const index = videos.findIndex(v => v.id === vId);
            if (index >= videos.length - 2 && nextPageToken && !loading) {
              fetchVideos(false);
            }
          }
        });
      },
      { threshold: 0.6 }
    );

    const elements = document.querySelectorAll(".video-container");
    elements.forEach((el) => observerRef.current.observe(el));
    return () => observerRef.current?.disconnect();
  }, [videos, nextPageToken, loading]);

  // 3. Real-time Progress Tracking
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.YT && activeVideoId) {
        const iframe = document.getElementById(`player-${activeVideoId}`);
        if (iframe) {
          const player = new window.YT.Player(iframe);
          if (player && typeof player.getCurrentTime === 'function') {
            try {
              const current = player.getCurrentTime();
              const total = player.getDuration();
              if (total > 0) {
                setProgress((current / total) * 100);
                const remaining = Math.floor(total - current);
                setTimeLeft(`${Math.floor(remaining / 60)}:${(remaining % 60).toString().padStart(2, '0')}`);
              }
            } catch (e) {}
          }
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [activeVideoId]);

  // 4. Action Handlers
  const handleLike = async (videoId) => {
    if (likedVideos.includes(videoId)) return; // Prevent double liking
    
    // Visual Change: Immediate UI feedback
    setLikedVideos(prev => [...prev, videoId]);
    setVideos(prev => prev.map(v => 
      v.id === videoId ? { ...v, statistics: { ...v.statistics, likeCount: (parseInt(v.statistics.likeCount || 0) + 1).toString() } } : v
    ));

    await fetch("/api/youtube/like", { method: "POST", body: JSON.stringify({ videoId }) });
  };

  const handleFollow = async (channelId) => {
    setFollowedChannels(prev => [...prev, channelId]);
    await fetch("/api/youtube/follow", { method: "POST", body: JSON.stringify({ channelId }) });
  };

  return (
    <div className="h-screen w-full bg-black overflow-hidden relative">
      
      {/* CATEGORY BAR */}
      <div className="absolute top-0 left-0 w-full z-50 flex gap-3 p-6 overflow-x-auto no-scrollbar bg-gradient-to-b from-black/90 to-transparent">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
              activeCategory === cat.id ? "bg-red-600 text-white shadow-lg shadow-red-600/20" : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* VIDEO FEED */}
      <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar">
        {videos.map((video) => {
          const vId = video.id;
          const isActive = activeVideoId === vId;
          const isLiked = likedVideos.includes(vId);
          const isFollowed = followedChannels.includes(video.snippet.channelId);

          return (
            <div key={vId} data-id={vId} className="video-container h-screen w-full snap-start relative bg-black">
              {/* Iframe Player */}
              <iframe
                id={`player-${vId}`}
                src={`https://www.youtube.com/embed/${vId}?enablejsapi=1&autoplay=${isActive ? 1 : 0}&mute=${isMuted ? 1 : 0}&controls=0&rel=0&modestbranding=1&iv_load_policy=3`}
                className="w-full h-full pointer-events-none"
                allow="autoplay; encrypted-media"
              />

              {/* PROGRESS BAR */}
              {isActive && (
                <div className="absolute bottom-0 left-0 w-full z-40">
                  <div className="h-[3px] w-full bg-white/10">
                    <div 
                      className="h-full bg-red-600 transition-all duration-1000 ease-linear shadow-[0_0_8px_rgba(220,38,38,0.8)]" 
                      style={{ width: `${progress}%` }} 
                    />
                  </div>
                </div>
              )}

              {/* INTERACTION COLUMN */}
              <div className="absolute right-4 bottom-28 flex flex-col gap-6 z-30">
                <button onClick={() => handleLike(vId)} className="flex flex-col items-center">
                  <div className={`p-3 rounded-full transition-all duration-300 ${isLiked ? 'bg-red-600 scale-110' : 'bg-white/10 hover:bg-white/20'}`}>
                    <Heart size={28} className={`text-white transition-all ${isLiked ? 'fill-white' : ''}`} />
                  </div>
                  <span className="text-white text-[11px] mt-1 font-bold drop-shadow-md">{formatCount(video.statistics?.likeCount)}</span>
                </button>

                <button onClick={() => setIsCommentOpen(true)} className="flex flex-col items-center">
                  <div className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors">
                    <MessageCircle size={28} className="text-white" />
                  </div>
                  <span className="text-white text-[11px] mt-1 font-bold drop-shadow-md">{formatCount(video.statistics?.commentCount)}</span>
                </button>

                <button 
                  onClick={() => handleFollow(video.snippet.channelId)} 
                  className={`p-3 rounded-full transition-all shadow-lg ${isFollowed ? 'bg-zinc-700' : 'bg-red-600 active:scale-90'}`}
                >
                  {isFollowed ? <Check size={26} className="text-white" /> : <UserPlus size={26} className="text-white" />}
                </button>
              </div>

              {/* INFO OVERLAY */}
              <div className="absolute bottom-8 left-4 z-20 max-w-[80%]">
                <div className="flex items-center gap-2 mb-2">
                   <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-[10px] font-bold text-white">237</div>
                   <p className="text-white font-bold text-base drop-shadow-md">@{video.snippet.channelTitle}</p>
                </div>
                <h2 className="text-white/90 text-sm line-clamp-2 leading-relaxed drop-shadow-md">{video.snippet.title}</h2>
                {isActive && <p className="text-white/50 text-[10px] mt-2 font-mono">Time left: {timeLeft}</p>}
              </div>

              {/* MUTE TOGGLE */}
              <button onClick={() => setIsMuted(!isMuted)} className="absolute top-24 right-6 z-30 bg-black/40 backdrop-blur-md p-2.5 rounded-full text-white">
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
            </div>
          );
        })}
        
        {loading && (
          <div className="h-screen flex flex-col items-center justify-center bg-black text-white gap-4">
            <Loader2 className="animate-spin text-red-600" size={40} />
            <p className="text-sm font-medium animate-pulse">Loading more 237 vibes...</p>
          </div>
        )}
      </div>

      {/* COMMENT DRAWER */}
      {isCommentOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col justify-end bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="flex-grow" onClick={() => setIsCommentOpen(false)} />
          <div className="bg-zinc-900 w-full rounded-t-[2.5rem] p-8 h-[65vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-white font-extrabold text-xl">Comments</h3>
              <button onClick={() => setIsCommentOpen(false)} className="text-zinc-500 hover:text-white transition-colors"><X size={28} /></button>
            </div>
            
            <div className="flex-grow flex flex-col items-center justify-center text-zinc-500 gap-2">
              <MessageCircle size={48} className="opacity-20" />
              <p className="text-sm italic">Loading YouTube conversation...</p>
            </div>

            <div className="flex gap-3 border-t border-zinc-800 pt-6">
              <input 
                type="text" 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                className="bg-zinc-800 text-white rounded-2xl px-5 py-4 flex-grow outline-none focus:ring-2 ring-red-600 transition-all"
              />
              <button className="bg-red-600 text-white px-6 rounded-2xl font-bold hover:bg-red-700 active:scale-95 transition-all">
                <Send size={22} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}