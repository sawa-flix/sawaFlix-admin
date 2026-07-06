"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import SectionHeader from "./SectionHeader";
import { Play } from "lucide-react";

// Mock Data
const movies = [
  {
    id: 1,
    title: "Guzman Dante",
    category: "Historical Drama",
    image:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop",
    year: "2023",
  },
  {
    id: 2,
    title: "Wanaka Women",
    category: "Documentary",
    image:
      "https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=800&auto=format&fit=crop",
    year: "2024",
  },
  {
    id: 3,
    title: "Rhythm of Art",
    category: "Musical",
    image:
      "https://images.unsplash.com/photo-1518929458119-e5bf444c30f4?w=800&auto=format&fit=crop",
    year: "2022",
  },
];

export default function MoviesSection() {
  return (
    /* FIX: Separated id from className. 
       scroll-mt-20 ensures your fixed navbar doesn't cover the title when you scroll here.
    */
    <section className="py-20 bg-[#0B0E14] scroll-mt-20" id="movies">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Cultural Movies"
          subtitle="Immerse yourself in stories told by our ancestors and new generations."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {movies.map((movie, index) => (
            <Link
              href="/dashboard/movie"
              key={movie.id}
              className="block group relative cursor-pointer"
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src={movie.image}
                    alt={movie.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 bg-red-600/90 rounded-full flex items-center justify-center backdrop-blur-sm shadow-xl transform scale-75 group-hover:scale-100 transition-transform">
                      <Play className="w-6 h-6 text-white ml-1" />
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-red-500 text-xs font-semibold uppercase tracking-wider mb-1">
                      {movie.category}
                    </p>
                    <h3 className="text-xl font-bold group-hover:text-red-400 transition-colors">
                      {movie.title}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">{movie.year}</p>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
