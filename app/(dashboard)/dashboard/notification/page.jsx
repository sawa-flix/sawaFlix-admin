
'use client'
import React, { useState } from 'react';
import { Bell, Home, Compass, Play, User, MoreHorizontal } from 'lucide-react';
import Image from 'next/image';
import blackImage from '../../../../public/images/Black.jpg';

const notification = () => {
  const [playingVideo, setPlayingVideo] = useState(null);

  const recentNotifications = [
    {
      id: 1,
      channel: "Tech Reviews Pro",
      title: "iPhone 15 Pro Max - Complete Review & Camera Test",
      description: "After 2 weeks of testing, here's everything you need to know about Apple's flagship phone.",
      thumbnail: blackImage,
      timeAgo: "2 hours ago",
      type: "upload"
    },
    {
      id: 2,
      channel: "Cooking Masters",
      title: "Perfect Pasta Carbonara in 15 Minutes",
      description: "Learn the authentic Italian recipe that will change how you make pasta forever.",
      thumbnail: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=120&h=90&fit=crop&crop=center",
      timeAgo: "5 hours ago",
      type: "upload"
    },
    {
      id: 3,
      channel: "Travel Wanderer",
      title: "Hidden Gems of Tokyo - Places Locals Actually Visit",
      description: "Discover 10 incredible spots in Tokyo that most tourists never see.",
      thumbnail: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=120&h=90&fit=crop&crop=center",
      timeAgo: "1 day ago",
      type: "upload"
    }
  ];

  const olderNotifications = [
    {
      id: 4,
      channel: "Fitness Journey",
      title: "Morning Workout Routine - No Equipment Needed",
      description: "Start your day right with this energizing 20-minute home workout routine.",
      thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=120&h=90&fit=crop&crop=center",
      timeAgo: "2 days ago",
      type: "upload"
    },
    {
      id: 5,
      channel: "Music Studio",
      title: "Behind the Scenes: Recording Our New Album",
      description: "Take a look at our creative process and studio sessions for our upcoming release.",
      thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=120&h=90&fit=crop&crop=center",
      timeAgo: "3 days ago",
      type: "upload"
    },
    {
      id: 6,
      channel: "DIY Creator",
      title: "Build Your Own Smart Mirror in One Weekend",
      description: "Complete tutorial with code, wiring diagrams, and troubleshooting tips included.",
      thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=120&h=90&fit=crop&crop=center",
      timeAgo: "1 week ago",
      type: "upload"
    },
    {
      id: 7,
      channel: "Gaming Hub",
      title: "Top 10 Indie Games You Missed This Year",
      description: "Hidden gaming gems that deserve your attention, from puzzle games to RPGs.",
      thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=120&h=90&fit=crop&crop=center",
      timeAgo: "2 weeks ago",
      type: "upload"
    }
  ];

  const handlePlayVideo = (videoId) => {
    setPlayingVideo(videoId);
    // Simulate video playing - in a real app, this would navigate to the video or open a player
    setTimeout(() => {
      setPlayingVideo(null);
    }, 2000);
  };

  const NotificationItem = ({ notification }) => (
    <div className="flex items-start px-2 py-3 border-b border-gray-800/50 hover:bg-gray-900/50 transition-colors">
      {/* Thumbnail (Left Side) */}
      <div className="flex-shrink-0 mr-3">
        <div className="relative cursor-pointer" onClick={() => handlePlayVideo(notification.id)}>
          <img 
            src={typeof notification.thumbnail === 'string' ? notification.thumbnail : notification.thumbnail.src} 
            alt={notification.title}
            className="w-16 h-12 sm:w-20 sm:h-14 md:w-24 md:h-16 rounded object-cover"
          />
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${
            playingVideo === notification.id ? 'bg-black bg-opacity-80' : 'bg-black bg-opacity-40 hover:bg-opacity-70'
          }`}>
            {playingVideo === notification.id ? (
              <div className="text-white text-xs font-medium">Playing...</div>
            ) : (
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all">
                <Play className="w-3 h-3 sm:w-4 sm:h-4 fill-black ml-0.5" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Text Content (Right Side) */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-white text-sm sm:text-base leading-tight mb-1 truncate pr-2">
              {notification.title}
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm mb-1">
              {notification.channel}
            </p>
            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-2 line-clamp-2 hidden sm:block">
              {notification.description}
            </p>
            <span className="text-gray-500 text-xs sm:text-sm">
              {notification.timeAgo}
            </span>
          </div>
        </div>
      </div>

      {/* More Options */}
      <div className="ml-2 flex-shrink-0">
        <MoreHorizontal className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-300 transition-colors" />
      </div>
    </div>
  );

  return (
    <div className="bg-[#0f172a] text-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 sticky top-0 bg-[#0f181a] z-10">
        <h1 className="text-lg sm:text-xl font-3xl">Notifications</h1>
       
      </div>

      {/* Notification Content */}
      <div className="pb-20 max-w-7xl mx-auto">
        {/* Recent Section */}
        <div className="px-4 py-3 bg-gray-900/30">
          <h2 className="text-sm sm:text-base font-semibold text-gray-300 uppercase tracking-wide">Recent</h2>
        </div>
        
        <div>
          {recentNotifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </div>

        {/* Older Section */}
        <div className="px-4 py-3 bg-gray-900/30 mt-4">
          <h2 className="text-sm sm:text-base font-semibold text-gray-300 uppercase tracking-wide">Older</h2>
        </div>
        
        <div>
          {olderNotifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default notification;