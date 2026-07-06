// components/ReelsFeed.tsx
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface Video {
  id: string;
  title: string;
  description: string;
  release_date: string | null;
  producer_id: string | null;
  producer_name?: string | null;
  producers: {
    name: string;
  } | null;
  is_featured: boolean;
  featured_actors: string | null;
  video_url: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  created_at: string;
  uploaded_by: string;
}

interface ReelsFeedProps {
  videos: Video[];
}

interface VideoState {
  isPlaying: boolean;
  isMuted: boolean;
  hasBeenViewed: boolean;
}

export default function ReelsFeed({ videos }: ReelsFeedProps) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [videoStates, setVideoStates] = useState<Map<number, VideoState>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [showMuteButton, setShowMuteButton] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);
  const muteTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize video states
  useEffect(() => {
    const newVideoStates = new Map<number, VideoState>();
    videos.forEach((_, index) => {
      newVideoStates.set(index, {
        isPlaying: false,
        isMuted: false, // Sound ON by default for each video
        hasBeenViewed: false
      });
    });
    // Set first video to play
    if (videos.length > 0) {
      newVideoStates.set(0, {
        isPlaying: true,
        isMuted: false,
        hasBeenViewed: true
      });
    }
    setVideoStates(newVideoStates);
  }, [videos]);

  // Helper function to get producer name
  const getProducerName = (video: Video) => {
    return video.producers?.name || video.producer_name || null;
  };

  // Initialize video refs array
  useEffect(() => {
    videoRefs.current = videoRefs.current.slice(0, videos.length);
  }, [videos]);

  // Safe video play function
  const safePlay = async (video: HTMLVideoElement, index: number) => {
    try {
      // Clear any existing play promise
      if (playPromiseRef.current) {
        playPromiseRef.current = null;
      }

      // Set mute state for this specific video
      const videoState = videoStates.get(index);
      video.muted = videoState?.isMuted || false;

      // Create new play promise
      playPromiseRef.current = video.play();
      
      await playPromiseRef.current;
      setIsLoading(false);

      // Update video state
      setVideoStates(prev => {
        const newStates = new Map(prev);
        newStates.set(index, {
          ...(newStates.get(index) || { isMuted: false, hasBeenViewed: false }),
          isPlaying: true,
          hasBeenViewed: true
        });
        return newStates;
      });

    } catch (error) {
      console.log('Video play interrupted or failed:', error);
      setIsLoading(false);
    }
  };

  // Safe video pause function - IMMEDIATE
  const safePause = (video: HTMLVideoElement, index: number) => {
    try {
      if (playPromiseRef.current) {
        playPromiseRef.current.then(() => {
          video.pause();
        }).catch(() => {
          video.pause();
        });
        playPromiseRef.current = null;
      } else {
        video.pause();
      }

      // Update video state immediately
      setVideoStates(prev => {
        const newStates = new Map(prev);
        const currentState = newStates.get(index);
        if (currentState) {
          newStates.set(index, {
            ...currentState,
            isPlaying: false
          });
        }
        return newStates;
      });
    } catch (error) {
      console.log('Video pause failed:', error);
    }
  };

  // Play/pause videos based on intersection - IMMEDIATE
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = videoRefs.current.findIndex(ref => ref === entry.target);
          if (index === -1) return;

          const video = videoRefs.current[index];
          if (!video) return;

          const videoState = videoStates.get(index);
          const isIntersecting = entry.isIntersecting;
          const intersectionRatio = entry.intersectionRatio;

          if (isIntersecting && intersectionRatio >= 0.4) {
            // Video is 40% in view - play it immediately
            if (!videoState?.isPlaying) {
              setIsLoading(true);
              safePlay(video, index);
              setCurrentVideoIndex(index);
              
              // Pause all other videos immediately
              videoRefs.current.forEach((otherVideo, otherIndex) => {
                if (otherVideo && otherIndex !== index && videoStates.get(otherIndex)?.isPlaying) {
                  safePause(otherVideo, otherIndex);
                }
              });
            }
          } else if (!isIntersecting || intersectionRatio < 0.4) {
            // Video is less than 40% in view - pause it immediately
            if (videoState?.isPlaying) {
              safePause(video, index);
            }
          }
        });
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        rootMargin: '0px 0px 0px 0px'
      }
    );

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => {
      observer.disconnect();
    };
  }, [videos.length, videoStates]);

  // Handle scroll to switch videos
  const handleScroll = useCallback((event: React.WheelEvent) => {
    event.preventDefault();
    
    if (event.deltaY > 0) {
      // Scroll down - next video
      setCurrentVideoIndex(prev => Math.min(prev + 1, videos.length - 1));
    } else {
      // Scroll up - previous video
      setCurrentVideoIndex(prev => Math.max(prev - 1, 0));
    }
    
    // Show mute button temporarily when scrolling
    setShowMuteButton(true);
    if (muteTimeoutRef.current) {
      clearTimeout(muteTimeoutRef.current);
    }
    muteTimeoutRef.current = setTimeout(() => {
      setShowMuteButton(false);
    }, 3000);
  }, [videos.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setCurrentVideoIndex(prev => Math.min(prev + 1, videos.length - 1));
          break;
        case 'ArrowUp':
          event.preventDefault();
          setCurrentVideoIndex(prev => Math.max(prev - 1, 0));
          break;
        case ' ':
          event.preventDefault();
          // Toggle play/pause for current video
          const currentVideo = videoRefs.current[currentVideoIndex];
          const currentState = videoStates.get(currentVideoIndex);
          if (currentVideo && currentState) {
            if (currentState.isPlaying) {
              safePause(currentVideo, currentVideoIndex);
            } else {
              setIsLoading(true);
              safePlay(currentVideo, currentVideoIndex);
            }
          }
          break;
        case 'm':
        case 'M':
          event.preventDefault();
          handleToggleMute(currentVideoIndex);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [videos.length, currentVideoIndex, videoStates]);

  // Touch/swipe handling for mobile
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // Swipe up - next video
      setCurrentVideoIndex(prev => Math.min(prev + 1, videos.length - 1));
    } else if (touchEnd - touchStart > 50) {
      // Swipe down - previous video
      setCurrentVideoIndex(prev => Math.max(prev - 1, 0));
    }
  };

  // Handle video ended event - loop current video
  const handleVideoEnd = useCallback((index: number) => {
    if (index === currentVideoIndex) {
      const video = videoRefs.current[index];
      if (video) {
        video.currentTime = 0;
        safePlay(video, index);
      }
    }
  }, [currentVideoIndex]);

  // Toggle mute for specific video
  const handleToggleMute = (index: number) => {
    setVideoStates(prev => {
      const newStates = new Map(prev);
      const currentState = newStates.get(index);
      if (currentState) {
        newStates.set(index, {
          ...currentState,
          isMuted: !currentState.isMuted
        });
        
        // Update the actual video element
        const video = videoRefs.current[index];
        if (video) {
          video.muted = !currentState.isMuted;
        }
      }
      return newStates;
    });
    
    // Show mute button temporarily when toggling
    setShowMuteButton(true);
    if (muteTimeoutRef.current) {
      clearTimeout(muteTimeoutRef.current);
    }
    muteTimeoutRef.current = setTimeout(() => {
      setShowMuteButton(false);
    }, 3000);
  };

  // Show mute button on mouse move
  const handleMouseMove = () => {
    setShowMuteButton(true);
    if (muteTimeoutRef.current) {
      clearTimeout(muteTimeoutRef.current);
    }
    muteTimeoutRef.current = setTimeout(() => {
      setShowMuteButton(false);
    }, 3000);
  };

  // Fixed ref callback function
  const setVideoRef = (index: number) => (el: HTMLVideoElement | null) => {
    videoRefs.current[index] = el;
    
    if (el) {
      // Set initial mute state from videoStates
      const videoState = videoStates.get(index);
      if (videoState) {
        el.muted = videoState.isMuted;
      }
      
      // Add event listeners for each video
      el.addEventListener('ended', () => handleVideoEnd(index));
      el.addEventListener('canplay', () => {
        const currentState = videoStates.get(index);
        if (index === currentVideoIndex && currentState?.isPlaying) {
          safePlay(el, index);
        }
      });
    }
  };

  // Clean up event listeners and timeouts
  useEffect(() => {
    return () => {
      videoRefs.current.forEach((video) => {
        if (video) {
          video.removeEventListener('ended', () => {});
          video.removeEventListener('canplay', () => {});
        }
      });
      
      if (muteTimeoutRef.current) {
        clearTimeout(muteTimeoutRef.current);
      }
    };
  }, []);

  if (videos.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-xl mb-4">No videos yet</p>
          <p className="text-gray-400">Upload the first video to get started!</p>
        </div>
      </div>
    );
  }

  const currentVideoState = videoStates.get(currentVideoIndex);

  return (
    <div 
      ref={containerRef}
      className="h-screen bg-black overflow-hidden relative"
      onWheel={handleScroll}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseMove={handleMouseMove}
    >
      {/* Video Container */}
      <div className="h-full snap-y snap-mandatory overflow-y-scroll scrollbar-hide">
        {videos.map((video, index) => (
          <div
            key={video.id}
            className="h-full snap-start relative flex items-center justify-center"
          >
            {/* Video Player */}
            <video
              ref={setVideoRef(index)}
              className="h-full w-full object-cover"
              loop={false}
              playsInline
              preload="auto"
              onClick={() => {
                const videoState = videoStates.get(index);
                if (videoState?.isPlaying) {
                  safePause(videoRefs.current[index]!, index);
                } else {
                  setIsLoading(true);
                  safePlay(videoRefs.current[index]!, index);
                }
              }}
            >
              <source src={video.video_url} type={video.mime_type} />
              Your browser does not support the video tag.
            </video>

            {/* Loading Spinner */}
            {isLoading && index === currentVideoIndex && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            {/* Large Mute/Unmute Button (Center) - Only for current video */}
            {showMuteButton && index === currentVideoIndex && (
              <button 
                onClick={() => handleToggleMute(currentVideoIndex)}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 bg-black/50 rounded-full p-4 transition-all duration-200 hover:bg-black/70"
              >
                {currentVideoState?.isMuted ? (
                  <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3.63 3.63a.996.996 0 000 1.41L7.29 9H6c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h1.29l3.66 3.66c.39.39 1.02.39 1.41 0l5.34-5.34-7.07-7.07-5.34 5.34zM14 7v10c0 .55-.45 1-1 1s-1-.45-1-1v-3.17l-2-2V14h-.17l-2-2H8V9.17l-2-2V7c0-.55.45-1 1-1h6c.55 0 1 .45 1 1zm4 0v10c0 .55.45 1 1 1s1-.45 1-1V7c0-.55-.45-1-1-1s-1 .45-1 1z"/>
                  </svg>
                ) : (
                  <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                  </svg>
                )}
              </button>
            )}

            {/* Video Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none">
              
              {/* Bottom Info */}
              <div className="absolute bottom-20 left-4 right-4 text-white">
                <h3 className="text-xl font-bold mb-2 line-clamp-2">{video.title}</h3>
                <p className="text-gray-200 text-sm mb-3 line-clamp-2">{video.description}</p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-300">
                  {getProducerName(video) && (
                    <span>By {getProducerName(video)}</span>
                  )}
                  {video.featured_actors && (
                    <span>• {video.featured_actors}</span>
                  )}
                </div>
              </div>

              {/* Right Side Actions */}
              <div className="absolute right-4 bottom-20 flex flex-col items-center space-y-6">
                {/* Like Button */}
                <button className="flex flex-col items-center text-white">
                  <div className="w-12 h-12 rounded-full bg-black/30 flex items-center justify-center mb-1">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </div>
                  <span className="text-xs">24.5K</span>
                </button>

                {/* Comment Button */}
                <button className="flex flex-col items-center text-white">
                  <div className="w-12 h-12 rounded-full bg-black/30 flex items-center justify-center mb-1">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h11c.55 0 1-.45 1-1z"/>
                    </svg>
                  </div>
                  <span className="text-xs">1.2K</span>
                </button>

                {/* Share Button */}
                <button className="flex flex-col items-center text-white">
                  <div className="w-12 h-12 rounded-full bg-black/30 flex items-center justify-center mb-1">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
                    </svg>
                  </div>
                  <span className="text-xs">Share</span>
                </button>

                {/* Mute/Unmute Button (Small in action bar) - Only for current video */}
                {index === currentVideoIndex && (
                  <button 
                    onClick={() => handleToggleMute(currentVideoIndex)}
                    className="flex flex-col items-center text-white"
                  >
                    <div className="w-12 h-12 rounded-full bg-black/30 flex items-center justify-center mb-1">
                      {currentVideoState?.isMuted ? (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M3.63 3.63a.996.996 0 000 1.41L7.29 9H6c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h1.29l3.66 3.66c.39.39 1.02.39 1.41 0l5.34-5.34-7.07-7.07-5.34 5.34zM14 7v10c0 .55-.45 1-1 1s-1-.45-1-1v-3.17l-2-2V14h-.17l-2-2H8V9.17l-2-2V7c0-.55.45-1 1-1h6c.55 0 1 .45 1 1zm4 0v10c0 .55.45 1 1 1s1-.45 1-1V7c0-.55-.45-1-1-1s-1 .45-1 1z"/>
                        </svg>
                      ) : (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                        </svg>
                      )}
                    </div>
                    <span className="text-xs">{currentVideoState?.isMuted ? 'Unmute' : 'Mute'}</span>
                  </button>
                )}
              </div>

              {/* Top Controls */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="text-white font-semibold">Reels</span>
                </div>
                
                <div className="flex items-center space-x-4">
                  {/* Play/Pause Button - Only for current video */}
                  {index === currentVideoIndex && (
                    <button 
                      onClick={() => {
                        const videoState = videoStates.get(index);
                        if (videoState?.isPlaying) {
                          safePause(videoRefs.current[index]!, index);
                        } else {
                          setIsLoading(true);
                          safePlay(videoRefs.current[index]!, index);
                        }
                      }}
                      className="text-white"
                    >
                      {currentVideoState?.isPlaying ? (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                        </svg>
                      ) : (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gray-600">
                <div 
                  className="h-full bg-white transition-all duration-100"
                  style={{ 
                    width: `${((currentVideoIndex + 1) / videos.length) * 100}%` 
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Hints */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {videos.map((_, index) => (
          <div
            key={index}
            className={`h-1 rounded-full transition-all duration-300 ${
              index === currentVideoIndex ? 'bg-white w-8' : 'bg-gray-500 w-2'
            }`}
          />
        ))}
      </div>
    </div>
  );
}