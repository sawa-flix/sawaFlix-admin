"use client";
import { useState } from "react";
import Image from "next/image";
import { Heart, MessageCircle, Eye, X } from "lucide-react";

export default function BlogsPage() {
  const blogs = [
    {
      id: 1,
      type: "movie",
      title: "Humans",
      author: "daisy la belle",
      thumbnail: "/movie.jpg",
      profilePic: "/wed-image 1.jpg",
      preview:
        "This is the preview of the blog text, only first few lines shown...",
      fullText:
        "This is the full blog text for Wednesday. You can write and expand the whole story here. Add as much detail as needed about the blog...",
      likes: 120,
      comments: 34,
      views: 540,
      date: "Aug 25, 2025",
    },
    {
      id: 2,
      type: "music",
      title: "Let me go",
      author: "Tiliazelle",
      thumbnail: "/music.jpg",
      profilePic: "/pic1.jpeg",
      preview:
        "This is the preview of the blog text, only first few lines shown...",
      fullText:
        "This is the full blog text for 'Let me go'. Here you can display the entire article or review written by the user...",
      likes: 95,
      comments: 20,
      views: 320,
      date: "Aug 24, 2025",
    },
    {
      id: 3,
      type: "movie",
      title: "Black Panther",
      author: "favour the great",
      thumbnail: "/black.jpg",
      profilePic: "/music2.jpg",
      preview:
        "This is the preview of the blog text, only first few lines shown...",
      fullText:
        "This is the full blog text for Black Panther. Write about the storyline, actors, themes, or music here...",
      likes: 90,
      comments: 10,
      views: 550,
      date: "Aug 30, 2025",
    },
  ];

  // State for favorite icons
  const [favorites, setFavorites] = useState({});
  // State for modal popup
  const [selectedBlog, setSelectedBlog] = useState(null);

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <main className="min-h-screen bg-[#0a0f29] text-white px-6 py-12">
      {/* Header */}
      <div className="mb-8 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold">Blogs</h1>
        <p className="text-gray-400">Share your thoughts on movies & music</p>
        <div className="h-[1px] bg-gray-700 mt-2" />
      </div>

      {/* Blog List */}
      <div className="space-y-6 max-w-3xl mx-auto">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-[#101936] rounded-2xl p-6 shadow-md"
          >
            {/* Top Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Image
                  src={blog.thumbnail}
                  alt={blog.title}
                  width={60}
                  height={60}
                  className="rounded-lg object-cover"
                />
                <div>
                  <h2 className="text-lg font-semibold">{blog.title}</h2>
                  <p className="text-gray-400 text-sm">by {blog.author}</p>
                </div>
              </div>
              <Image
                src={blog.profilePic}
                alt={blog.author}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
            </div>

            {/* Preview */}
            <p className="mt-4 text-gray-300">{blog.preview}</p>

            {/* Meta Info */}
            <div className="flex items-center gap-6 text-sm text-gray-400 mt-4">
              {/* Like Toggle */}
              <button
                onClick={() => toggleFavorite(blog.id)}
                className="flex items-center gap-1"
              >
                <Heart
                  size={18}
                  className={
                    favorites[blog.id] ? "text-red-500 fill-red-500" : ""
                  }
                />
                {blog.likes}
              </button>

              <span className="flex items-center gap-1">
                <MessageCircle size={16} /> {blog.comments}
              </span>
              <span className="flex items-center gap-1">
                <Eye size={16} /> {blog.views}
              </span>
              <span>{blog.date}</span>
            </div>

            {/* View All Button */}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setSelectedBlog(blog)}
                className="px-4 py-2 rounded-full cursor-pointer bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm transition"
              >
                View All
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Write Blog Button */}
      <div className="flex justify-center mt-10">
        <button className="px-6 py-3 rounded-full bg-red-600 cursor-pointer hover:bg-red-500 text-white font-medium transition">
          + Write Blog
        </button>
      </div>

      {/* Modal Popup */}
      {selectedBlog && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#101936] max-w-lg w-full p-6 rounded-2xl relative shadow-lg">
            {/* Close button */}
            <button
              onClick={() => setSelectedBlog(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>

            {/* Blog details */}
            <div className="flex items-center gap-4 mb-4">
              <Image
                src={selectedBlog.thumbnail}
                alt={selectedBlog.title}
                width={60}
                height={60}
                className="rounded-lg object-cover"
              />
              <div>
                <h2 className="text-xl font-bold">{selectedBlog.title}</h2>
                <p className="text-sm text-gray-400">by {selectedBlog.author}</p>
              </div>
            </div>

            <p className="text-gray-300">{selectedBlog.fullText}</p>

            {/* Stats inside modal */}
            <div className="flex items-center gap-6 text-sm text-gray-400 mt-4">
              <span className="flex items-center gap-1">
                <Heart
                  size={16}
                  className={
                    favorites[selectedBlog.id] ? "text-red-500 fill-red-500" : ""
                  }
                />
                {selectedBlog.likes}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle size={16} /> {selectedBlog.comments}
              </span>
              <span className="flex items-center gap-1">
                <Eye size={16} /> {selectedBlog.views}
              </span>
              <span>{selectedBlog.date}</span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
