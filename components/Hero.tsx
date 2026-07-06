"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Play } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="home"
      // Changed h-screen to h-[85vh] on mobile to show the next section title
      className="relative h-[70vh] md:h-screen w-full overflow-hidden flex items-center justify-center scroll-mt-20"
    >
      {/* Background with Overlay - UNTOUCHED as requested */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/Hero-background.jpg')",
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#8B0000]/25 via-[#E50914]/10 to-[#0B0E14]"></div>
        <div className="absolute inset-0 bg-[#0B0E14]/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-10 md:pt-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Typography adjusted for mobile visibility */}
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold tracking-tight text-white mb-4 md:mb-6 drop-shadow-xl leading-tight">
            Preserving Culture <br />
            <span className="inline-block text-red-600 px-4 py-1 rounded-md mt-2">
              Sharing Stories.
            </span>{" "}
            <br />
            Connecting Generations
          </h1>

          <p className="text-gray-300 mb-8 md:mb-10 max-w-xl mx-auto text-lg md:text-xl leading-relaxed">
            Discover the rich heritage of Africa through music, movies, and
            traditions. A platform dedicated to keeping our stories alive.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="px-8 py-3.5 bg-red-600 text-white rounded-full font-semibold text-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-600/30"
            >
              Get Started
            </Link>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3.5 bg-white text-red-600 rounded-full font-semibold text-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition-all cursor-pointer shadow-lg shadow-white/30"
            >
              <Play className="w-5 h-5 fill-red-600 text-red-600" />
              Watch Demo
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
