"use client";
import React, { useEffect, useState } from "react";
import { Clock, CheckCircle, XCircle, Users, Activity } from "lucide-react";

interface StatsData {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  approvalRate: string;
  avgTimeHours: string;
  rejectionsByCategory: Record<string, number>;
}
const LIVEURL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sawaflix-backend.onrender.com';
export default function VerificationAnalytics() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {

        const res = await fetch(`${LIVEURL}/api/admin/stats`);
        if (res.ok) {
          const result = await res.json();
          if (result.success) {
            setStats(result.data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-900 rounded-xl border border-gray-800 p-6 animate-pulse">
            <div className="h-4 w-24 bg-gray-800 rounded mb-4" />
            <div className="h-8 w-16 bg-gray-800 rounded mb-2" />
            <div className="h-3 w-32 bg-gray-800 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const cards = [
    {
      title: "Pending Reviews",
      value: stats.pending.toString(),
      subtext: "Applications waiting for review",
      icon: <Clock size={24} className="text-yellow-500" />,
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20"
    },
    {
      title: "Approval Rate",
      value: `${stats.approvalRate}%`,
      subtext: "Of processed applications",
      icon: <CheckCircle size={24} className="text-green-500" />,
      bg: "bg-green-500/10",
      border: "border-green-500/20"
    },
    {
      title: "Total Processed",
      value: (stats.approved + stats.rejected).toString(),
      subtext: "Total verifications resolved",
      icon: <Users size={24} className="text-blue-500" />,
      bg: "bg-blue-500/10",
      border: "border-blue-500/20"
    },
    {
      title: "Avg. Turnaround",
      value: `${stats.avgTimeHours}h`,
      subtext: "Average time to resolution",
      icon: <Activity size={24} className="text-purple-500" />,
      bg: "bg-purple-500/10",
      border: "border-purple-500/20"
    }
  ];

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-white mb-4">Verification Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <div key={i} className="bg-gray-900 rounded-xl border border-gray-800 p-6 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">{card.title}</p>
                <h3 className="text-3xl font-bold text-white mb-1">{card.value}</h3>
                <p className="text-gray-500 text-xs">{card.subtext}</p>
              </div>
              <div className={`p-3 rounded-lg ${card.bg} ${card.border} border`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
