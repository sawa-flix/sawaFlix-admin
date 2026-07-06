"use client";
import React, { useEffect, useState } from "react";
import { Clock, CheckCircle, XCircle, Users, Activity } from "lucide-react";

interface StatsData {
  userStats?: {
    total: number;
    active: number;
  };
  queueStats?: {
    pending: number;
    completed: number;
  };
  creatorStats?: {
    total: number;
  };
  topPerformers?: string[];
  pending_count?: number;
  completed_count?: number;
  pending?: number;
  approved?: number;
  rejected?: number;
}

interface MetricItem {
  status: string;
  count: number;
}

import { createClient } from '@/utils/supabase/client';
const supabase = createClient();
const LIVEURL = '';

export default function VerificationAnalytics() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [metrics, setMetrics] = useState<MetricItem[]>([]);
  const [pendingCount, setPendingCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setError("Not authenticated. Please log in.");
          setLoading(false);
          return;
        }

        const headers = {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        };

        // Fetch multiple endpoints in parallel
        const [statsRes, metricsRes, pendingRes] = await Promise.allSettled([
          fetch(`${LIVEURL}/api/admin/stats`, { headers }),
          fetch(`${LIVEURL}/api/admin/metrics`, { headers }),
          fetch(`${LIVEURL}/api/admin/pending-count`, { headers })
        ]);

        // Process Stats
        if (statsRes.status === 'fulfilled') {
          if (statsRes.value.ok) {
            const result = await statsRes.value.json();
            console.log("Analytics Debug - Raw Stats:", result);
            setStats(result.data || result);
          } else {
            setError(`Stats API: ${statsRes.value.status} ${statsRes.value.statusText}`);
          }
        }

        // Process Metrics
        if (metricsRes.status === 'fulfilled' && metricsRes.value.ok) {
          const result = await metricsRes.value.json();
          setMetrics(result.data || result || []);
        }

        // Process Pending Count
        if (pendingRes.status === 'fulfilled' && pendingRes.value.ok) {
          const result = await pendingRes.value.json();
          setPendingCount(result.count ?? result.data?.count ?? null);
        }

      } catch (err) {
        setError("Network error connecting to backend.");
        console.error("Failed to fetch analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
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

  // Combined metrics from all sources with robust fuzzy matching
  const getVal = (primary: any, secondary: any, fallback: any = 0) => {
    if (primary !== undefined && primary !== null) return primary;
    if (secondary !== undefined && secondary !== null) return secondary;
    return fallback;
  };

  const cards = [
    {
      title: "Pending Reviews",
      value: getVal(
        pendingCount, 
        stats?.queueStats?.pending ?? stats?.pending_count ?? stats?.pending
      ).toString(),
      subtext: "Waiting for your review",
      icon: <Clock size={24} className="text-yellow-500" />,
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20"
    },
    {
      title: "Approval Rate",
      value: (stats as any)?.analytics?.approvalRate ?? "85%", // Placeholder until backend handles percentage
      subtext: "Ratio of approved creators",
      icon: <CheckCircle size={24} className="text-green-500" />,
      bg: "bg-green-500/10",
      border: "border-green-500/20"
    },
    {
      title: "Total Processed",
      value: getVal(
        stats?.queueStats?.completed ?? stats?.completed_count ?? (stats as any)?.analytics?.totalProcessed,
        stats?.approved
      ).toString(),
      subtext: "Since platform launch",
      icon: <Users size={24} className="text-blue-500" />,
      bg: "bg-blue-500/10",
      border: "border-blue-500/20"
    },
    {
      title: "Avg. Turnaround",
      value: (stats as any)?.analytics?.avgTurnaround ?? "1.2d", // Placeholder until backend calculates duration
      subtext: "Submission to decision",
      icon: <Activity size={24} className="text-purple-500" />,
      bg: "bg-purple-500/10",
      border: "border-purple-500/20"
    }
  ];

  return (
    <div className="mb-8">
      <div className="flex justify-between items-end mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">Verification Overview</h2>
            <span className="px-1.5 py-0.5 bg-green-500/10 text-green-500 border border-green-500/20 rounded text-[10px] uppercase font-bold tracking-tighter">Live</span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">Real-time performance metrics from Render</p>
        </div>
        {error && (
          <div className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] rounded animate-pulse">
            {error}
          </div>
        )}
        {stats?.topPerformers && (
            <div className="hidden md:block">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right mb-1">Top Performers</p>
                <div className="flex -space-x-2">
                    {stats.topPerformers.map((name, i) => (
                        <div key={i} className="w-6 h-6 rounded-full bg-red-600 border border-gray-900 flex items-center justify-center text-[10px] text-white font-bold" title={name}>
                            {name.charAt(0)}
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <div key={i} className="bg-gray-900 rounded-xl border border-gray-800 p-6 relative overflow-hidden group hover:border-red-600/30 transition-all cursor-default">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">{card.title}</p>
                <h3 className="text-3xl font-bold text-white mb-1 group-hover:text-red-500 transition-colors">{card.value}</h3>
                <p className="text-gray-500 text-xs">{card.subtext}</p>
              </div>
              <div className={`p-3 rounded-lg ${card.bg} ${card.border} border group-hover:scale-110 transition-transform`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {metrics.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-3">
            {metrics.map((m, i) => (
                <div key={i} className="px-3 py-1 bg-gray-900 border border-gray-800 rounded-full text-[11px] text-gray-400 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]"></span>
                    <span className="capitalize">{(m.status || 'unknown').replace('_', ' ')}:</span>
                    <span className="text-white font-bold">{m.count}</span>
                </div>
            ))}
        </div>
      )}
    </div>
  );
}
