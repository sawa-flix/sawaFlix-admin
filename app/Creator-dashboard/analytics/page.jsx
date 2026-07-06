"use client";

import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell
} from "recharts";
import { TrendingUp, Users, Eye, Clock, DollarSign } from "lucide-react";

// Mock Data
const viewsData = [
    { name: "Jan", views: 4000 },
    { name: "Feb", views: 3000 },
    { name: "Mar", views: 2000 },
    { name: "Apr", views: 2780 },
    { name: "May", views: 1890 },
    { name: "Jun", views: 2390 },
    { name: "Jul", views: 3490 },
];

const demographicData = [
    { name: "18-24", value: 400 },
    { name: "25-34", value: 300 },
    { name: "35-44", value: 300 },
    { name: "45+", value: 200 },
];

const COLORS = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b"];

export default function AnalyticsPage() {
    return (
        <div className="p-6 space-y-6 bg-transparent min-h-screen text-white">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">Detailed Analytics</h1>
                <p className="text-gray-400">Deep dive into your content performance and audience.</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Reach", value: "84.2K", icon: Eye, change: "+12.5%", color: "text-blue-400" },
                    { label: "New Followers", value: "1,204", icon: Users, change: "+8.2%", color: "text-purple-400" },
                    { label: "Avg. Watch Time", value: "4m 32s", icon: Clock, change: "-2.1%", color: "text-orange-400" },
                    { label: "Estimated Revenue", value: "$4,280", icon: DollarSign, change: "+15.3%", color: "text-green-400" },
                ].map((stat, i) => (
                    <div key={i} className="bg-[#111827] border border-gray-800 p-5 rounded-2xl shadow-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                            </div>
                            <div className={`p-2 rounded-lg bg-gray-800/50 ${stat.color}`}>
                                <stat.icon size={20} />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-xs">
                            <span className={stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}>
                                {stat.change}
                            </span>
                            <span className="text-gray-500 ml-2">from last month</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Growth Chart */}
                <div className="lg:col-span-2 bg-[#111827] border border-gray-800 p-6 rounded-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold">Audience Growth</h3>
                        <select className="bg-gray-800 border-none rounded-lg text-sm p-2 outline-none">
                            <option>Last 7 Months</option>
                            <option>Last Year</option>
                        </select>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={viewsData}>
                                <defs>
                                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                                <XAxis dataKey="name" stroke="#9ca3af" axisLine={false} tickLine={false} />
                                <YAxis stroke="#9ca3af" axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="views"
                                    stroke="#ef4444"
                                    fillOpacity={1}
                                    fill="url(#colorViews)"
                                    strokeWidth={3}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Demographics */}
                <div className="bg-[#111827] border border-gray-800 p-6 rounded-2xl">
                    <h3 className="text-lg font-semibold mb-6">Audience Demographics</h3>
                    <div className="h-60">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={demographicData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {demographicData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 space-y-2">
                        {demographicData.map((item, i) => (
                            <div key={i} className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                                    <span className="text-gray-400">{item.name}</span>
                                </div>
                                <span className="font-medium">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Engagement Table/List */}
            <div className="bg-[#111827] border border-gray-800 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-gray-800">
                    <h3 className="text-lg font-semibold">Top Performing Content</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-gray-500 text-sm">
                                <th className="px-6 py-4 font-medium">Video Title</th>
                                <th className="px-6 py-4 font-medium">Views</th>
                                <th className="px-6 py-4 font-medium">Avg. View Duration</th>
                                <th className="px-6 py-4 font-medium">Engagement</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {[
                                { title: "React Tips and Tricks", views: "12,402", duration: "8:24", engagement: "94%" },
                                { title: "Next.js 15 Tutorial", views: "8,920", duration: "12:15", engagement: "88%" },
                                { title: "Tailwind CSS Layouts", views: "7,543", duration: "6:54", engagement: "91%" },
                                { title: "Modern Web Design 2024", views: "6,120", duration: "10:30", engagement: "85%" },
                            ].map((row, i) => (
                                <tr key={i} className="hover:bg-gray-800/30 transition">
                                    <td className="px-6 py-4 font-medium">{row.title}</td>
                                    <td className="px-6 py-4">{row.views}</td>
                                    <td className="px-6 py-4">{row.duration}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-red-500" style={{ width: row.engagement }} />
                                            </div>
                                            <span className="text-xs text-gray-400">{row.engagement}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
