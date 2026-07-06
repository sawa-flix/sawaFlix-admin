"use client";
import React from 'react';
import { useState } from "react";
import { Star, Search } from "lucide-react";
import Lottie from 'lottie-react'; // Remove curly braces
import animationData from "../../../../public/animation/Lines.json"

export default function SawaSmart() {

  const [query, setQuery] = useState("");

  const cards = [
    { id: 1, title: "Movies", image:"../mfy2.jpg" },
    { id: 2, title: "Music", image:"../music2.jpg" },
    { id: 3, title: "Trending", image:"../headset.jpg"},
    { id: 4, title: "Series",  image:"../mfy4.jpg" },
  ];

  return (
    <div className="h-screen w-full bg-black text-white flex flex-col relative">

      {/* Animation Background - Now properly behind everything */}
      <div className="absolute inset-0 z-0">
        <Lottie
          animationData={animationData}
          loop={true}
          autoplay={true}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: -1, // This ensures it stays behind everything
          }}
        />
      </div>
      
      {/* All content now has relative positioning to appear above the animation */}
      <header className="flex-1 text-center relative z-10">
        <h1 className="text-4xl font-bold p-4 flex bg-neutral-900 bg-opacity-70 border-5px">SawaSmart</h1>
        <h1 className="text-3xl font-meduim mx-5 mt-20">Let's create something mind blowing 🎼💥 </h1>
      </header>

      {/* Search / Chat Bar */}
      <div className="max-w-5xl mx-auto w-full px-4 relative z-10">
        <div className="flex items-center gap-2 bg-zinc-900 rounded-full px-4 py-6 shadow-md mt-13">
          <Search className="w-12 h-7 text-gray-600 text-2xl" />
          <textarea
            rows={1}
            placeholder="Lets Create something 😎😎..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 resize-none bg-transparent text-whitesmoke placeholder-gray-300 focus:outline-none text-xl"
          />
          <span className="flex items-center justify-center mx-10 text-2xl w-10 h-10 rounded-full bg-black cursor-pointer">+</span>
        </div>
        <div className="flex justify-center mt-10">
          <button className="px-10 py-4 bg-red-600 rounded-full text-white font-semibold shadow-lg hover:bg-red-500 transition mt-0">
            Create
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 px-6 py-10 flex-1 place-items-center mt-20 mb-20 relative z-10">
        {cards.map((card) => (
          <div
            key={card.id}
            className="w-full h-60 bg-neutral-900 rounded-2xl flex flex-col items-center justify-center text-lg font-medium hover:bg-neutral-800 transition cursor-pointer shadow-md overflow-hidden border-absolute"
          >
            <img 
              src={card.image}
              alt={card.title}
              className="w-full h-55 object-cover rounded-t-2xl"
            />
            <div className="text-center text-white">
              {card.title}
            </div>
          </div>
        ))}
      </div>

      {/* Floating Star Icon */}
      <button className="absolute bottom-6 right-6 w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center shadow-lg hover:bg-neutral-800 transition z-20">
        <Star className="w-6 h-6 text-white" />
      </button>
    </div>
  );
}