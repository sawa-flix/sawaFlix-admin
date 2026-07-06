'use client';
import React, { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';

const ArtistUploadPage = () => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    contentType: '',
    genre: '',
    privacy: '',
    description: '',
    tags: ''
  });
  
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files) => {
    const fileArray = Array.from(files);
    setSelectedFiles(prev => [...prev, ...fileArray]);
  };

  const handleFileInput = (e) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (isDraft = false) => {
    console.log('Form submitted:', { ...formData, files: selectedFiles, isDraft });
    // Handle form submission logic here
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-2xl">
          
          {/* File Upload Section */}
          <div className="p-6 lg:p-8 border-b border-slate-700/50">
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 lg:p-12 text-center transition-all duration-300 ${
                dragActive
                  ? 'border-blue-400 bg-blue-500/10'
                  : 'border-slate-600 hover:border-slate-500 hover:bg-slate-700/30'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center">
                  <Upload className="w-6 h-6 text-amber-400" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-white">
                    Drag and drop your files here
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Or click to browse from your device
                  </p>
                </div>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
                >
                  choose file
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileInput}
                  className="hidden"
                  accept="audio/,video/,.mp3,.wav,.mp4,.mov,.avi"
                />

                <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-xs text-slate-500 mt-6">
                  <div>
                  
                  
                 <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, contentType: 'music' }))
                }
                className={`flex-1 px-6 py-3 rounded-lg font-medium transition ${
                  formData.contentType === 'music'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600'
                }`}
              >
                Music Formats
                <p>MP3, WAV, FLAC, AAC</p>
              </button>

                  </div>
                  <div>
                    
                    <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, contentType: 'music' }))
                }
                className={`flex-1 px-6 py-3 rounded-lg font-medium transition ${
                  formData.contentType === 'music'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600'
                }`}
              >
                Movies Formats
                <p>MP3, WAV, FLAC, AAC</p>
              </button>
                  </div>
                </div>

                <p className="text-xs text-slate-500 mt-4">Maximum file Size: 1GB per file</p>
              </div>
            </div>

            {/* Selected Files Display */}
            {selectedFiles.length > 0 && (
              <div className="mt-6 space-y-3">
                <h4 className="text-white font-medium">Selected Files:</h4>
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-slate-700/50 rounded-lg p-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{file.name}</p>
                      <p className="text-slate-400 text-sm">{formatFileSize(file.size)}</p>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="ml-3 p-1 text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Section */}
          <div className="p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-white mb-8">Content Details</h2>

            {/* Title and Content Type Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Title */}
              <div>
                <label className="block text-white font-medium mb-3">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter title"
                  required
                />
              </div>

              {/* Content Type */}
              <div>
                <label className="block text-white font-medium mb-3">
                  Content type <span className="text-red-400">*</span>
                </label>
                <select
                  name="contentType"
                  value={formData.contentType}
                  onChange={handleInputChange}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="">Select content type</option>
                  <option value="music">Music</option>
                  <option value="video">Video</option>
                  <option value="podcast">Podcast</option>
                  <option value="album">Album</option>
                </select>
              </div>
            </div>

            {/* Genre and Privacy Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Genre */}
              <div>
                <label className="block text-white font-medium mb-3">Genre</label>
                <input
                  type="text"
                  name="genre"
                  value={formData.genre}
                  onChange={handleInputChange}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g., Pop, Rock, Hip-Hop"
                />
              </div>

              {/* Privacy */}
              <div>
                <label className="block text-white font-medium mb-3">Privacy</label>
                <select
                  name="privacy"
                  value={formData.privacy}
                  onChange={handleInputChange}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Select privacy setting</option>
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="unlisted">Unlisted</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-white font-medium mb-3">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Describe your content..."
              />
            </div>

            {/* Tags */}
            <div className="mb-8">
              <label className="block text-white font-medium mb-3">Tags</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Add tags separated by commas"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => handleSubmit(false)}
                className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-800"
              >
                Publish Now
              </button>
              
              <button
                onClick={() => handleSubmit(true)}
                className="flex-1 sm:flex-none bg-slate-600 hover:bg-slate-700 text-white font-medium py-3 px-8 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-800"
              >
                Save as draft
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistUploadPage;