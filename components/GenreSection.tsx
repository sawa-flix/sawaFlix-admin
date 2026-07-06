"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import SectionHeader from "./SectionHeader";
import Link from "next/link";
import { Music, Mic2, Drum, Globe } from "lucide-react";

const genres = [
  {
    id: 1,
    name: "Makossa",
    icon: <Music />,
    color: "from-purple-600 to-blue-600",
    image: "/Makossa.png",
  },
  {
    id: 2,
    name: "Bikutsi",
    icon: <Drum />,
    color: "from-red-600 to-orange-600",
    image: "/Bikutsi.jpg",
  },
  {
    id: 3,
    name: "Hip-Hop",
    icon: <Mic2 />,
    color: "from-pink-600 to-rose-600",
    image: "/Hip hop.jpg",
  },
  {
    id: 4,
    name: "Afrobeat",
    icon: <Globe />,
    color: "from-amber-500 to-yellow-600",
    image: "/afrobeats.jpg",
  },
  {
    id: 5,
    name: "Assiko",
    icon: <Music />,
    color: "from-green-600 to-emerald-600",
    image: "/Assiko.jpeg",
  },
];

export default function GenreSection() {
  return (
    // Adjusted padding: pt-0 on mobile to sit right under Hero buttons,
    // py-20 on larger screens for better spacing.
    <section className="py-20 bg-[#0B0E14] scroll-mt-20" id="music">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Container for the title to control mobile spacing specifically */}
        <div className="mt-[-20px] md:mt-0 mb-8 md:mb-12">
          <SectionHeader
            title="Explore Music Genres"
            subtitle="Discover the vibrant rhythms and melodies that define our culture."
          />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {genres.map((genre, index) => (
            <Link href="/dashboard/music" key={genre.id} className="block">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="relative group cursor-pointer overflow-hidden rounded-xl h-40"
              >
                <Image
                  src={genre.image}
                  alt={genre.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors" />

                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <div
                    className={`p-3 rounded-full bg-gradient-to-br ${genre.color} mb-2 shadow-lg`}
                  >
                    {genre.icon}
                  </div>
                  <h3 className="font-bold text-lg">{genre.name}</h3>
                  <span className="text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore
                  </span>
                </div>
              </motion.div>
            </Link>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            className="relative group cursor-pointer overflow-hidden rounded-xl h-40 bg-red-600 flex items-center justify-center"
          >
            <Link
              href="/dashboard/music"
              className="w-full h-full flex items-center justify-center"
            >
              <h3 className="font-bold text-lg text-white">Explore More</h3>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
