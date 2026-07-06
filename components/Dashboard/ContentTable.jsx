"use client";

import { useState } from "react";

const mockContent = [
  {
    id: 1,
    title: "Action Thriller",
    category: "Film",
    views: 58200,
    status: "Published",
    date: "Apr 12, 2024",
  },
  {
    id: 2,
    title: "Travel Vlog",
    category: "Vlog",
    views: 2340,
    status: "Draft",
    date: "Apr 10, 2024",
  },
  {
    id: 3,
    title: "Comedy Sketch",
    category: "Comedy",
    views: 15800,
    status: "Under Review",
    date: "Apr 8, 2024",
  },
];

export default function ContentTable() {
  const [filter, setFilter] = useState("All");

  const filtered =
    filter === "All"
      ? mockContent
      : mockContent.filter((c) => c.status === filter);

  return (
    <div className="bg-[#111827] border border-gray-800 rounded-xl p-2">

      {/* Tabs */}
      <div className="flex gap-4 mb-3 text-xs">
        {["All", "Published", "Draft", "Under Review"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`transition ${filter === tab
              ? "text-red-500"
              : "text-gray-400 hover:text-gray-200"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="space-y-2">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center px-3 py-2 bg-gray-800 rounded-md text-sm"
          >
            <div>
              <p className="font-medium text-sm">{item.title}</p>
              <p className="text-[11px] text-gray-400">
                {item.category}
              </p>
            </div>

            <div className="text-xs text-gray-400">
              {item.views.toLocaleString()} views
            </div>

            <div className="text-xs text-gray-400">
              {item.date}
            </div>

            <span className="px-2 py-0.5 rounded-full text-[10px] bg-green-500/20 text-green-400">
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}