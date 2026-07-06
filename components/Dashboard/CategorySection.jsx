'use client';

import React from 'react';
import { Play, Music, FilmIcon, BookOpen, Zap } from 'lucide-react';
import Link from 'next/link';

const CategoryCard = ({ icon: Icon, title, description, href, color }) => (
  <Link href={href}>
    <div className={`group relative overflow-hidden rounded-2xl h-40 cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-2xl ${color}`}>
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center p-6">
        <div className="mb-3 p-3 bg-white/10 rounded-full group-hover:bg-white/20 transition-all duration-300">
          <Icon className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-black text-white mb-2">{title}</h3>
        <p className="text-sm text-white/80 line-clamp-2">{description}</p>
      </div>
    </div>
  </Link>
);

export default function CategorySection() {
  const categories = [
    {
      icon: Music,
      title: 'Music',
      description: 'Discover trending tracks and artists',
      href: '/dashboard/musicPage',
      color: 'bg-gradient-to-br from-purple-600 to-pink-600'
    },
    {
      icon: FilmIcon,
      title: 'Movies',
      description: 'Stream blockbuster films',
      href: '/dashboard/movie',
      color: 'bg-gradient-to-br from-blue-600 to-cyan-600'
    },
    {
      icon: BookOpen,
      title: 'Blogs',
      description: 'Read stories and insights',
      href: '/dashboard/blogs',
      color: 'bg-gradient-to-br from-orange-600 to-red-600'
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-black text-white mb-2">Explore Categories</h2>
        <p className="text-gray-400 font-medium">Choose what to explore today</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <CategoryCard key={category.title} {...category} />
        ))}
      </div>
    </div>
  );
}
