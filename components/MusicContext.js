'use client';
import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

const MusicContext = createContext();

export const useMusic = () => useContext(MusicContext);

export const MusicProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Player state managed globally for UI sync
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);

  // Reference to the ReactPlayer instance (set by BottomPlayer)
  const playerRef = useRef(null);

  const playTrack = useCallback((track, newPlaylist = []) => {
    if (newPlaylist.length > 0) {
      setPlaylist(newPlaylist);
      // Using loose comparison for ID in case of string/number mismatch
      const index = newPlaylist.findIndex(t => t.id == track.id);
      setCurrentIndex(index !== -1 ? index : 0);
    }
    setCurrentTrack(track);
    setIsPlaying(true);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const toggleMute = useCallback(() => {
    setMuted(prev => !prev);
  }, []);

  const playNext = useCallback(() => {
    if (playlist.length === 0) return;
    const nextIndex = (currentIndex + 1) % playlist.length;
    setCurrentIndex(nextIndex);
    setCurrentTrack(playlist[nextIndex]);
    setIsPlaying(true);
  }, [currentIndex, playlist]);

  const playPrev = useCallback(() => {
    if (playlist.length === 0) return;
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    setCurrentIndex(prevIndex);
    setCurrentTrack(playlist[prevIndex]);
    setIsPlaying(true);
  }, [currentIndex, playlist]);

  // Seeks to a specific time (in seconds)
  const seekTo = useCallback((amount) => {
    if (playerRef.current) {
      playerRef.current.seekTo(amount, 'seconds');
      setCurrentTime(amount);
    }
  }, []);

  const value = {
    currentTrack,
    isPlaying,
    playlist,
    playerRef,
    duration,
    currentTime,
    volume,
    muted,
    setDuration,
    setCurrentTime,
    setVolume,
    toggleMute,
    seekTo,
    playTrack,
    togglePlay,
    playNext,
    playPrev
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};
