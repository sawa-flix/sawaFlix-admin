'use client';

// pages/artist/index.js


import Image from "next/image";
import { Play } from "lucide-react";
import { useState } from "react";

export default function ArtistPage() {
  const [followed, setFollowed] = useState(false);
  const [playingAlbum, setPlayingAlbum] = useState(null);

  return (
    <>
   
    <div className="bg-[#0f172a] text-white min-h-screen">
      {/* Hero Section */}
      <div className="relative w-full h-72">
        <Image
          src="/Benylee.jpg"
          alt="Benylee"
          fill
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 p-4 flex flex-col justify-end">
          <h1 className="text-3xl font-bold">Benylee</h1>
          <p className="text-sm text-gray-300 mt-1">
            Rapper-songwriter known for narrative songs about true life story.
          </p>
          <div className="flex gap-3 mt-3">
            <button
              onClick={() => setPlayingAlbum("hero")}
              className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${
                playingAlbum === "hero"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-700 hover:bg-orange-500"
              }`}
            >
              <Play size={16} /> Play
            </button>
            <button
              onClick={() => setFollowed(!followed)}
              className={`px-4 py-2 rounded-full text-sm border ${
                followed
                  ? "bg-orange-500 border-orange-500 text-white"
                  : "border-gray-400 hover:bg-orange-500"
              }`}
            >
              {followed ? "Following" : "Follow"}
            </button>
          </div>
          <div className="flex gap-6 mt-4 text-xs">
            <div>
              <span className="font-bold text-lg">200M+</span>
              <p className="text-gray-400">Streams</p>
            </div>
            <div>
              <span className="font-bold text-lg">12M</span>
              <p className="text-gray-400">Followers</p>
            </div>
            <div>
              <span className="font-bold text-lg">50+</span>
              <p className="text-gray-400">Albums</p>
            </div>
          </div>
        </div>
      </div>

      {/* Discography */}
      <section className="p-4">
        <h2 className="text-lg font-semibold mb-3">Discography</h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            {
              title: "Greenlight(Benylee)",
              img: "/Greenlight.jpg",
              year: "2025",
              description: "Hit rap single with energetic beats."
            },
            {
              title: "Gene(Benylee ft Triumf)",
              img: "/Gene.jpg",
              year: "2023",
              description: "Collaboration with Triumf blending rap & soul."
            },
            {
              title: "Let Me Go(Benylee x Juvani)",
              img: "/music.jpg",
              year: "2024",
              description: "Emotional track featuring Juvani."
            },
            {
              title: "Lover(Ko-c)",
              img: "/music4.jpg",
              year: "2019",
              description: "Smooth romantic vibes."
            },
          ].map((album, i) => (
            <div
              key={i}
              className="bg-[#1e293b] p-2 rounded-lg lg:flex lg:items-center lg:gap-4"
            >
              <Image
                src={album.img}
                alt={album.title}
                width={200}
                height={200}
                className="rounded-lg object-cover lg:w-28 lg:h-28"
              />
              <div className="mt-2 lg:mt-0">
                <p className="text-sm font-medium">{album.title}</p>
                <span className="text-xs text-gray-400">{album.year}</span>
                {/* Desktop-only extra details */}
                <p className="hidden lg:block text-xs text-gray-300 mt-2">
                  {album.description}
                </p>
                <div className="hidden lg:flex gap-2 mt-2">
                  <button
                    onClick={() => setPlayingAlbum(i)}
                    className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${
                      playingAlbum === i
                        ? "bg-orange-500 text-white"
                        : "bg-gray-700 hover:bg-orange-500"
                    }`}
                  >
                    <Play size={14} /> Play
                  </button>
                  <button
                    onClick={() =>
                      setFollowed((prev) =>
                        typeof prev === "object"
                          ? { ...prev, [i]: !prev[i] }
                          : { [i]: true }
                      )
                    }
                    className={`px-3 py-1 rounded-full text-xs border ${
                      typeof followed === "object" && followed[i]
                        ? "bg-orange-500 border-orange-500 text-white"
                        : "border-gray-400 hover:bg-orange-500"
                    }`}
                  >
                    {typeof followed === "object" && followed[i]
                      ? "Following"
                      : "Follow"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Similar Artists */}
      <section className="p-4">
        <h2 className="text-lg font-semibold mb-3">Similar Artists</h2>
        <div className="flex gap-10 overflow-x-auto no-scrollbar">
          {[
            { name: "Locko", img: "/pic2.jpeg" },
            { name: "Lemon Blaise", img: "/pic3.jpeg" },
            { name: "Billie Eilish", img: "/pic4.jpeg" },
          ].map((artist, i) => (
            <div key={i} className="flex-shrink-0 w-28 text-center">
              <Image
                src={artist.img}
                alt={artist.name}
                width={112}
                height={112}
                className="rounded-full"
              />
              <p className="mt-2 text-sm">{artist.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="p-4">
        <h2 className="text-lg font-semibold mb-3">Upcoming Events</h2>
        <div className="space-y-4">
          {[
            { title: "Madison Square Garden", date: "Dec 16, 2024" },
            { title: "Crypto.com Arena", date: "Dec 21, 2024" },
          ].map((event, i) => (
            <div
              key={i}
              className="bg-[#1e293b] p-4 rounded-lg flex items-center justify-between"
            >
              <div>
                <p className="font-medium">{event.title}</p>
                <span className="text-xs text-gray-400">{event.date}</span>
              </div>
              <button className="bg-orange-500 px-3 py-1 rounded-full text-xs">
                Get Tickets
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
    
    </>
  );
}
