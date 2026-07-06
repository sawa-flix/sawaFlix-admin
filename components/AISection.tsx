"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Sparkles } from "lucide-react";

const features = [
    "Advanced translation for local dialects",
    "Smart recommendations based on your taste",
    "Historical context for every piece of content"
];

export default function AISection() {
    return (
        <section className="py-20 bg-[#0B0E14] relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none transform -translate-y-1/2"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-16">

                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex-1"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="text-red-500 w-6 h-6" />
                            <span className="text-red-500 font-semibold tracking-wider uppercase">SawaSmart AI</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                            Personalized Discovery <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Powered by Intelligence</span>
                        </h2>
                        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                            Our AI understands the nuances of Sawa culture to bring you content that resonates.
                            From dialect translation to lineage-based recommendations, experience culture like never before.
                        </p>

                        <ul className="space-y-4 mb-10">
                            {features.map((feature, index) => (
                                <li key={index} className="flex items-center gap-3 text-gray-300">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <Link href="/dashboard/sawaSmart" className="inline-block px-8 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg font-semibold shadow-lg shadow-red-600/20 hover:shadow-red-600/40 transition-shadow">
                            Experience Beta
                        </Link>
                    </motion.div>

                    {/* Image/Visual */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="flex-1 relative"
                    >
                        <div className="relative aspect-square rounded-3xl overflow-hidden border border-gray-800 shadow-2xl bg-[#151C25]">
                            <Image
                                src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop"
                                alt="AI Interface"
                                fill
                                className="object-cover opacity-80"
                            />
                            {/* UI Overlay Mockup */}
                            <div className="absolute inset-x-8 bottom-8 p-6 bg-black/60 backdrop-blur-xl rounded-xl border border-white/10">
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                                        <Sparkles className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-white font-medium text-sm">Suggestion</p>
                                        <p className="text-gray-400 text-xs">Based on "Makossa Classics"</p>
                                    </div>
                                </div>
                                <div className="h-2 bg-gray-700 rounded-full w-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: "85%" }}
                                        transition={{ duration: 1.5, delay: 0.5 }}
                                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                    ></motion.div>
                                </div>
                                <p className="text-right text-xs text-blue-400 mt-1">98% Match</p>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
