// app/reels/VideoPlayer.jsx
'use client';

import React, { useRef, useState, useEffect } from 'react';
import { FaHeart, FaComment, FaVolumeUp, FaVolumeMute, FaCheckCircle, FaExpand, FaCompress } from 'react-icons/fa';

const VideoPlayer = ({ src }) => {
  const videoRef = useRef(null);
  const [isLiked, setIsLiked] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (videoRef.current) {
              if (entry.isIntersecting) {
                // This line will likely cause an error in modern browsers
                videoRef.current.play().catch(error => {
                  console.error("Video play failed:", error);
                });
              } else {
                videoRef.current.pause();
              }
            }
          });
        },
        { threshold: 0.8 }
      );
      observer.observe(videoRef.current);

      const handleFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
      };
      document.addEventListener('fullscreenchange', handleFullscreenChange);

      return () => {
        if (videoRef.current) {
          observer.unobserve(videoRef.current);
        }
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
      };
    }
  }, []);

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      setComments([...comments, commentText]);
      setCommentText('');
      setShowComments(false);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black flex justify-center items-center">
      <video
        ref={videoRef}
        src={src}
        loop
        playsInline
        // The 'muted' attribute is removed here
        className="max-h-full max-w-full object-contain"
      />

      {showNotification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-green-600 text-white py-2 px-4 rounded-full flex items-center gap-2 z-50 animate-fade-in-out">
          <FaCheckCircle />
          <span>Comment added!</span>
        </div>
      )}

      <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
        <div className="flex justify-between items-end">
          <div className="mb-5">
            <h2 className="text-xl font-bold">Video Title</h2>
            <p className="text-sm">@username</p>
          </div>

          <div className="flex flex-col gap-6 items-center">
            <div className="flex flex-col items-center cursor-pointer" onClick={handleLikeClick}>
              <FaHeart
                size={32}
                className={`transition-colors duration-300 ${isLiked ? 'text-red-500' : 'text-white'}`}
              />
              <span className="text-sm mt-1">123k</span>
            </div>
            
            <div className="flex flex-col items-center cursor-pointer" onClick={() => setShowComments(!showComments)}>
              <FaComment
                size={32}
                className="text-white transition-colors duration-300 hover:text-gray-300"
              />
              <span className="text-sm mt-1">456</span>
            </div>

            <div className="hidden md:flex flex-col items-center cursor-pointer" onClick={toggleFullscreen}>
              {isFullscreen ? (
                <FaCompress size={32} className="text-white transition-colors duration-300 hover:text-gray-300" />
              ) : (
                <FaExpand size={32} className="text-white transition-colors duration-300 hover:text-gray-300" />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={`
        absolute bottom-0 left-0 w-full bg-black bg-opacity-80 p-6 box-border
        transform transition-transform duration-300 ease-in-out z-40
        ${showComments ? 'translate-y-0' : 'translate-y-full'}
      `}>
        <div className="max-h-64 overflow-y-auto mb-4">
          {comments.map((comment, index) => (
            <p key={index} className="text-white py-1 border-b border-gray-700">{comment}</p>
          ))}
        </div>
        <form onSubmit={handleCommentSubmit} className="flex gap-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-grow p-3 rounded-full border-none bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
          />
          <button type="submit" className="p-3 rounded-full bg-blue-500 text-white font-semibold cursor-pointer">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default VideoPlayer;