"use client";

import { motion } from "framer-motion";

export default function FestivalBanner() {
  return (
    <section
      // Add the id that matches your Navbar href="#festival"
      id="festival"
      // Add scroll-mt-20 to prevent the fixed navbar from overlapping the section
      className="py-10 bg-[#0B0E14] scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden p-8 md:p-16 flex flex-col items-center text-center"
        >
          {/* Background with Dark Red Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-[#2A0505] to-black z-0"></div>

          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/20 rounded-full blur-[80px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-600/10 rounded-full blur-[80px] pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl">
            <span className="text-red-400 font-semibold tracking-widest uppercase text-sm mb-4 block">
              Coming Soon
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-serif">
              Maaval Heritage Festival
            </h2>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Join us in celebrating the diverse culture of the Sawa people
              through music, dance, digital arts, and culinary traditions. An
              immersive experience awaiting you.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition-colors shadow-lg">
                Join the Waitlist
              </button>
              <div className="flex items-center gap-4 text-gray-400 text-sm justify-center mt-4 sm:mt-0">
                <span className="flex items-center gap-1">• December 2026</span>
                <span className="flex items-center gap-1">• Douala, CMR</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
