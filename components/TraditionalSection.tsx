"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import SectionHeader from "./SectionHeader";

export default function TraditionalSection() {
    return (
        <section className="py-20 bg-[#0F1218] scroll-mt-20" id="traditions">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeader
                    title="Traditional Music"
                    subtitle="The roots of our rhythm, preserved for eternity."
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h3 className="text-2xl font-bold text-white mb-4">
                            Experience the soulful melodies of the Sawa people.
                        </h3>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            From the ceremonial drums of the Ngondo festival to the intricate harmonies of the bottle dance,
                            dive deep into the musical heritage that has shaped generations. Our archive features rare recordings,
                            exclusive performances, and in-depth documentaries.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center text-red-500 font-bold">01</div>
                                <div>
                                    <h4 className="text-white font-semibold">Rare Archives</h4>
                                    <p className="text-sm text-gray-400">Digitally restored recordings from the 70s.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center text-red-500 font-bold">02</div>
                                <div>
                                    <h4 className="text-white font-semibold">Live Performances</h4>
                                    <p className="text-sm text-gray-400">Watch full-length traditional concerts.</p>
                                </div>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="mt-8 px-6 py-3 border border-red-600 text-red-500 rounded-full font-medium hover:bg-red-600 hover:text-white transition-colors"
                        >
                            Explore Collection
                        </motion.button>
                    </motion.div>

                    {/* Image Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl"
                    >
                        <Image
                            src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&auto=format&fit=crop"
                            alt="Traditional Drummer"
                            fill
                            className="object-cover"
                        />
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
