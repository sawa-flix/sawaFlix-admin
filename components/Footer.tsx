"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, Mail } from "lucide-react";
import SawaflixLogo from "./SawaflixLogo";

export default function Footer() {
    return (
        <footer className="bg-[#05070a] border-t border-gray-800 text-gray-400 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-1">
                        <SawaflixLogo className="mb-4" />
                        <p className="text-sm leading-relaxed mb-4">
                            Your premium destination for Sawa cultural heritage. preserving our stories for future generations.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="hover:text-red-500 transition-colors"><Facebook size={20} /></a>
                            <a href="#" className="hover:text-red-500 transition-colors"><Twitter size={20} /></a>
                            <a href="#" className="hover:text-red-500 transition-colors"><Instagram size={20} /></a>
                            <a href="#" className="hover:text-red-500 transition-colors"><Youtube size={20} /></a>
                        </div>
                    </div>

                    {/* Links Column 1 */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Platform</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/dashboard/movie" className="hover:text-white transition-colors">Movies</Link></li>
                            <li><Link href="/dashboard/music" className="hover:text-white transition-colors">Music</Link></li>
                            <li><Link href="/dashboard" className="hover:text-white transition-colors">Traditions</Link></li>
                            <li><Link href="/dashboard/youtubeVids" className="hover:text-white transition-colors">Events</Link></li>
                            <li><Link href="/dashboard/sawaSmart" className="hover:text-white transition-colors">SawaSmart AI</Link></li>
                        </ul>
                    </div>

                    {/* Links Column 2 */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Company</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Press</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter Column */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Support</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Cookie Preferences</Link></li>
                        </ul>
                        <div className="mt-4 flex items-center gap-2 p-2 bg-gray-900 rounded-lg border border-gray-800">
                            <Mail size={16} />
                            <span className="text-xs">contact@sawaflix.com</span>
                        </div>
                    </div>

                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
                    <p>&copy; {new Date().getFullYear()} SawaFlix. All rights reserved.</p>
                    <div className="flex gap-4 mt-4 md:mt-0">
                        <span>English</span>
                        <span>Français</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
