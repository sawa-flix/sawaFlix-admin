'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAdminContentById, AdminContent, deleteAdminContent } from '@/services/adminContentService';
import { SawaflixLoader } from '@/components/SawaflixLogo';
import MediaPlayerModal from '@/components/Common/MediaPlayerModal';
import { 
  ArrowLeft, 
  Play, 
  Copy, 
  Check, 
  Trash2, 
  Share2, 
  Eye, 
  ThumbsUp, 
  MessageSquare, 
  TrendingUp, 
  Sparkles, 
  Clock, 
  HardDrive, 
  Tag, 
  User, 
  Compass, 
  Flame, 
  Video as VideoIcon,
  CheckCircle2,
  Activity,
  BarChart3,
  Calendar,
  Zap,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';

type TimeRange = '24h' | '7d' | '30d' | 'retention';
type MetricType = 'views' | 'retention' | 'interactions';

export default function VideoDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [video, setVideo] = useState<AdminContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [playingMedia, setPlayingMedia] = useState<{ url: string; title: string; isAudio: boolean } | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Interactive Graph State
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  const [activeMetric, setActiveMetric] = useState<MetricType>('views');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);
  const graphContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      if (!id) return;
      setLoading(true);
      try {
        const data = await getAdminContentById(id);
        setVideo(data);
      } catch (e) {
        console.error("Failed to load video details:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    if (!video || !confirm(`Are you sure you want to delete "${video.title}"?`)) return;
    setDeleting(true);
    try {
      await deleteAdminContent(video.id);
      router.push('/admin/content/feed');
    } catch (err: any) {
      alert(err.message || 'Failed to delete video');
      setDeleting(false);
    }
  };

  const durationSec = (video as any)?.duration || 38;
  const minutes = Math.floor(durationSec / 60);
  const seconds = Math.floor(durationSec % 60);
  const formattedDuration = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Interactive Graph Datasets based on TimeRange and Metric
  const graphData = useMemo(() => {
    if (timeRange === 'retention' || activeMetric === 'retention') {
      return [
        { label: '0:00', value: 100, display: '100% Retained', sub: 'Video start hook' },
        { label: '0:06', value: 94, display: '94% Retained', sub: 'Hook retention' },
        { label: '0:12', value: 89, display: '89% Retained', sub: 'High engagement' },
        { label: '0:18', value: 86, display: '86% Retained', sub: 'Mid-point stability' },
        { label: '0:24', value: 82, display: '82% Retained', sub: 'Key sequence' },
        { label: '0:30', value: 76, display: '76% Retained', sub: 'Late scene watch' },
        { label: `0:${durationSec < 10 ? '0' + durationSec : durationSec}`, value: 68, display: '68% Completed', sub: 'Full watchthrough' }
      ];
    }

    if (timeRange === '24h') {
      if (activeMetric === 'interactions') {
        return [
          { label: '00:00', value: 8, display: '8 interactions', sub: 'Overnight passive' },
          { label: '04:00', value: 5, display: '5 interactions', sub: 'Early hours' },
          { label: '08:00', value: 24, display: '24 interactions', sub: 'Morning rise' },
          { label: '12:00', value: 58, display: '58 interactions', sub: 'Lunch peak' },
          { label: '16:00', value: 72, display: '72 interactions', sub: 'Afternoon surge' },
          { label: '20:00', value: 95, display: '95 interactions', sub: 'Prime evening peak' },
          { label: '23:00', value: 44, display: '44 interactions', sub: 'Late evening' }
        ];
      }
      return [
        { label: '00:00', value: 45, display: '45 views/hr', sub: 'Overnight baseline' },
        { label: '04:00', value: 22, display: '22 views/hr', sub: 'Early baseline' },
        { label: '08:00', value: 110, display: '110 views/hr', sub: 'Morning commute' },
        { label: '12:00', value: 240, display: '240 views/hr', sub: 'Midday discovery' },
        { label: '16:00', value: 320, display: '320 views/hr', sub: 'Afternoon high' },
        { label: '20:00', value: 428, display: '428 views/hr', sub: 'Peak algorithmic push' },
        { label: '23:00', value: 255, display: '255 views/hr', sub: 'Evening wind-down' }
      ];
    }

    if (timeRange === '7d') {
      if (activeMetric === 'interactions') {
        return [
          { label: 'Mon', value: 34, display: '34 interactions', sub: 'Week start' },
          { label: 'Tue', value: 48, display: '48 interactions', sub: 'Steady growth' },
          { label: 'Wed', value: 65, display: '65 interactions', sub: 'Midweek lift' },
          { label: 'Thu', value: 78, display: '78 interactions', sub: 'Viral momentum' },
          { label: 'Fri', value: 112, display: '112 interactions', sub: 'Weekend surge' },
          { label: 'Sat', value: 135, display: '135 interactions', sub: 'Peak sharing' },
          { label: 'Sun', value: 98, display: '98 interactions', sub: 'Strong Sunday' }
        ];
      }
      return [
        { label: 'Mon', value: 180, display: '180 views', sub: 'Initial upload push' },
        { label: 'Tue', value: 240, display: '240 views', sub: 'Catalog discovery' },
        { label: 'Wed', value: 310, display: '310 views', sub: 'Feed recommendation' },
        { label: 'Thu', value: 390, display: '390 views', sub: 'Audience shares' },
        { label: 'Fri', value: 520, display: '520 views', sub: 'Weekend momentum' },
        { label: 'Sat', value: 640, display: '640 views', sub: 'Viral velocity' },
        { label: 'Sun', value: 480, display: '480 views', sub: 'Sustained engagement' }
      ];
    }

    // 30d
    return [
      { label: 'Week 1', value: 820, display: '820 views', sub: 'Release launch' },
      { label: 'Week 2', value: 1450, display: '1,450 views', sub: 'Algorithmic pickup' },
      { label: 'Week 3', value: 2100, display: '2,100 views', sub: 'Culture trending' },
      { label: 'Week 4', value: 2840, display: '2,840 views', sub: 'Evergreen catalog' }
    ];
  }, [timeRange, activeMetric, durationSec]);

  // Compute SVG Points & Smooth Bezier Path
  const { pathData, areaData, points, maxY, minY } = useMemo(() => {
    const width = 680;
    const height = 180;
    const paddingX = 40;
    const paddingTop = 25;
    const paddingBottom = 35;

    const values = graphData.map(d => d.value);
    const max = Math.max(...values) * 1.15;
    const min = Math.min(...values) * 0.8;
    const range = max - min || 1;

    const computedPoints = graphData.map((d, index) => {
      const x = paddingX + (index / (graphData.length - 1)) * (width - paddingX * 2);
      const y = paddingTop + (1 - (d.value - min) / range) * (height - paddingTop - paddingBottom);
      return { x, y, ...d };
    });

    if (computedPoints.length === 0) {
      return { pathData: '', areaData: '', points: [], maxY: max, minY: min };
    }

    // Smooth Bezier Curve
    let path = `M ${computedPoints[0].x} ${computedPoints[0].y}`;
    for (let i = 0; i < computedPoints.length - 1; i++) {
      const p0 = computedPoints[i === 0 ? i : i - 1];
      const p1 = computedPoints[i];
      const p2 = computedPoints[i + 1];
      const p3 = computedPoints[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }

    const baselineY = height - paddingBottom;
    const area = `${path} L ${computedPoints[computedPoints.length - 1].x} ${baselineY} L ${computedPoints[0].x} ${baselineY} Z`;

    return { pathData: path, areaData: area, points: computedPoints, maxY: max, minY: min };
  }, [graphData]);

  // Handle Graph Mouse Move for Interactive Tooltip
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svgRect = e.currentTarget.getBoundingClientRect();
    const mouseX = ((e.clientX - svgRect.left) / svgRect.width) * 680;

    let closestIdx = 0;
    let closestDist = Infinity;
    points.forEach((pt, idx) => {
      const dist = Math.abs(pt.x - mouseX);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = idx;
      }
    });

    setHoveredPointIndex(closestIdx);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <SawaflixLoader size={54} text="Loading video details..." />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center max-w-lg mx-auto shadow-xs">
        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-500">
          <VideoIcon size={26} />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Video Not Found</h2>
        <p className="text-xs text-slate-500 mb-6">
          The requested video could not be located in the media database or catalog.
        </p>
        <Link
          href="/admin/content/feed"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Back to Uploaded Feed</span>
        </Link>
      </div>
    );
  }

  const mediaUrl = (video as any).media_url || (video as any).video_url || video.youtube_url || '';
  const currentHoveredPoint = hoveredPointIndex !== null ? points[hoveredPointIndex] : points[points.length - 1];

  return (
    <div className="space-y-6 pb-14 animate-in fade-in duration-200 text-left">
      {/* Breadcrumb & Top Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/content/feed"
            className="p-2.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors shadow-2xs"
            title="Back to Uploaded Feed"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Link href="/admin/content/feed" className="hover:text-slate-600 transition-colors">Uploaded Feed</Link>
              <span>/</span>
              <span className="text-slate-700 font-medium truncate max-w-[240px]">{video.title}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              {video.title}
            </h1>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2">
          {mediaUrl && (
            <button
              onClick={() => setPlayingMedia({ url: mediaUrl, title: video.title, isAudio: false })}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Play size={12} fill="currentColor" />
              <span>Preview Stream</span>
            </button>
          )}

          {mediaUrl && (
            <button
              onClick={() => handleCopy(mediaUrl)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Copy stream endpoint"
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy Link'}</span>
            </button>
          )}

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-2 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100 text-rose-600 transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
            title="Delete Video"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* NEW: Interactive Visual Engagement & Retention Graph (Light Studio Theme) */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 border border-red-200/60 flex items-center justify-center">
                <BarChart3 size={16} />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  Interactive Engagement & Telemetry
                </h2>
                <p className="text-xs text-slate-500">
                  Real-time signals powering SawaFlix recommendation distribution
                </p>
              </div>
            </div>
          </div>

          {/* Controls: Metric Selector & Timeframe Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Metric Mode Switcher */}
            <div className="inline-flex p-1 rounded-xl bg-slate-100/90 border border-slate-200/70 text-xs font-semibold">
              <button
                onClick={() => setActiveMetric('views')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeMetric === 'views'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Views
              </button>
              <button
                onClick={() => setActiveMetric('retention')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeMetric === 'retention'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Retention %
              </button>
              <button
                onClick={() => setActiveMetric('interactions')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeMetric === 'interactions'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Interactions
              </button>
            </div>

            {/* Timeframe Filter */}
            <div className="inline-flex p-1 rounded-xl bg-slate-100/90 border border-slate-200/70 text-xs font-semibold">
              <button
                onClick={() => setTimeRange('24h')}
                className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  timeRange === '24h' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                24h
              </button>
              <button
                onClick={() => setTimeRange('7d')}
                className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  timeRange === '7d' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                7d
              </button>
              <button
                onClick={() => setTimeRange('30d')}
                className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  timeRange === '30d' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                30d
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Interactive SVG Graph Canvas */}
        <div 
          ref={graphContainerRef}
          className="relative w-full aspect-[21/8] min-h-[220px] bg-gradient-to-b from-slate-50/70 via-white to-white rounded-2xl border border-slate-200/80 p-3 select-none"
        >
          {/* Active Hover Telemetry Pill */}
          {currentHoveredPoint && (
            <div className="absolute top-4 left-6 z-10 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-200 shadow-md text-xs pointer-events-none transition-all duration-150">
              <div className="text-[10px] uppercase font-bold text-slate-400">
                {currentHoveredPoint.label} • Telemetry Point
              </div>
              <div className="text-sm font-extrabold text-slate-900 mt-0.5">
                {currentHoveredPoint.display}
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
                <TrendingUp size={11} />
                <span>{currentHoveredPoint.sub}</span>
              </div>
            </div>
          )}

          <svg
            viewBox="0 0 680 180"
            className="w-full h-full overflow-visible cursor-crosshair"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredPointIndex(null)}
          >
            <defs>
              <linearGradient id="engagementGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#EF4444" stopOpacity="0.22" />
                <stop offset="60%" stopColor="#EF4444" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#EF4444" stopOpacity="0.0" />
              </linearGradient>

              <linearGradient id="curveStroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#EF4444" />
                <stop offset="70%" stopColor="#F97316" />
                <stop offset="100%" stopColor="#E11D48" />
              </linearGradient>
            </defs>

            {/* Horizontal Gridlines */}
            <line x1="40" y1="45" x2="640" y2="45" stroke="#E2E8F0" strokeDasharray="4 4" strokeWidth="1" />
            <line x1="40" y1="90" x2="640" y2="90" stroke="#E2E8F0" strokeDasharray="4 4" strokeWidth="1" />
            <line x1="40" y1="135" x2="640" y2="135" stroke="#E2E8F0" strokeDasharray="4 4" strokeWidth="1" />

            {/* Filled Area Gradient */}
            {areaData && (
              <path d={areaData} fill="url(#engagementGradient)" />
            )}

            {/* Main Smooth Curve Line */}
            {pathData && (
              <path
                d={pathData}
                fill="none"
                stroke="url(#curveStroke)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Vertical Guide & Hover Dot */}
            {currentHoveredPoint && (
              <g>
                <line
                  x1={currentHoveredPoint.x}
                  y1="25"
                  x2={currentHoveredPoint.x}
                  y2="145"
                  stroke="#94A3B8"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <circle
                  cx={currentHoveredPoint.x}
                  cy={currentHoveredPoint.y}
                  r="7"
                  fill="#EF4444"
                  className="animate-pulse"
                />
                <circle
                  cx={currentHoveredPoint.x}
                  cy={currentHoveredPoint.y}
                  r="4"
                  fill="#FFFFFF"
                />
              </g>
            )}

            {/* Interactive Data Point Markers */}
            {points.map((pt, idx) => (
              <circle
                key={idx}
                cx={pt.x}
                cy={pt.y}
                r={hoveredPointIndex === idx ? "5" : "3.5"}
                fill={hoveredPointIndex === idx ? "#EF4444" : "#FFFFFF"}
                stroke="#EF4444"
                strokeWidth="2.5"
                className="transition-all duration-150"
              />
            ))}

            {/* X-Axis Labels */}
            {points.map((pt, idx) => (
              <text
                key={idx}
                x={pt.x}
                y="168"
                textAnchor="middle"
                className="text-[10px] fill-slate-400 font-medium select-none"
              >
                {pt.label}
              </text>
            ))}
          </svg>
        </div>

        {/* Real-time Telemetry KPI Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100 text-xs">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Peak Hour</span>
            <span className="font-bold text-slate-900 mt-0.5 block">8:00 PM – 10:00 PM</span>
            <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5 mt-0.5">
              <ArrowUpRight size={10} /> 428 views/hr
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Avg Watch Time</span>
            <span className="font-bold text-slate-900 mt-0.5 block">0:32 / 0:38</span>
            <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5 mt-0.5">
              <ShieldCheck size={10} /> 84.2% completed
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Viral Coefficient</span>
            <span className="font-bold text-slate-900 mt-0.5 block">1.84x Viral Lift</span>
            <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">High organic re-share</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Feed Discovery</span>
            <span className="font-bold text-emerald-600 mt-0.5 block flex items-center gap-1">
              <Zap size={12} className="text-amber-500" /> Active Priority
            </span>
            <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">Top 3% Category Feed</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Player, Video Info & Architecture (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Video Player Card */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs">
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-inner border border-slate-200/80 mb-4 group">
              {mediaUrl ? (
                <video
                  key={mediaUrl}
                  src={mediaUrl}
                  controls
                  playsInline
                  preload="auto"
                  crossOrigin="anonymous"
                  className="w-full h-full object-contain bg-black"
                >
                  <source src={mediaUrl} type="video/mp4" />
                </video>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-500">
                  <span>No media stream available</span>
                </div>
              )}
            </div>

            {/* Video Specs Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50/80 rounded-2xl border border-slate-200/70 text-xs">
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Duration</span>
                <span className="font-bold text-slate-800 font-mono">{formattedDuration}</span>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Resolution</span>
                <span className="font-bold text-slate-800">1080p HD</span>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Format</span>
                <span className="font-bold text-slate-800">{(video as any).is_reel ? 'Reel (9:16)' : 'Standard (16:9)'}</span>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Storage</span>
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Cloudflare R2</span>
                </span>
              </div>
            </div>
          </div>

          {/* Description & Classification Card */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Description</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {video.description || 'No description provided for this video.'}
              </p>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Classification</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Category</span>
                  <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded-md bg-slate-900 text-white text-[11px] font-semibold">
                    {video.category || 'Culture'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Visibility</span>
                  <span className="font-bold text-slate-800 capitalize mt-0.5 block">
                    {(video as any).visibility || 'Public'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">18+ Restriction</span>
                  <span className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold ${
                    (video as any).age_restriction 
                      ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {(video as any).age_restriction ? 'Restricted' : 'All Ages'}
                  </span>
                </div>
              </div>
            </div>

            {/* Tags */}
            {((video as any).tags && (video as any).tags.length > 0) && (
              <div className="border-t border-slate-100 pt-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Tag size={12} />
                  <span>Tags & Topics</span>
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {(video as any).tags.map((t: string, i: number) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Storage & Ingestion Pipeline Card */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <HardDrive size={14} className="text-slate-600" />
              <span>Storage & Pipeline Endpoint</span>
            </h3>
            <div className="space-y-2.5 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                <span className="truncate text-slate-600">{mediaUrl}</span>
                <button 
                  onClick={() => handleCopy(mediaUrl)}
                  className="p-1 rounded text-slate-400 hover:text-slate-700 cursor-pointer"
                  title="Copy"
                >
                  <Copy size={13} />
                </button>
              </div>
              <div className="flex items-center gap-4 text-[11px] text-slate-400 font-sans">
                <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <CheckCircle2 size={13} /> Synced to Supabase Catalog
                </span>
                <span>•</span>
                <span>Byte-range HTTP 206 streaming enabled</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interaction, Engagement & Recommendation Engine (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Recommendation Engine Card - REDESIGNED IN PURE LIGHT STUDIO THEME */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs text-slate-900 relative overflow-hidden">
            <div className="absolute -top-4 -right-4 p-8 text-slate-100 pointer-events-none">
              <Sparkles size={110} />
            </div>

            <div className="flex items-center justify-between mb-4 relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 border border-emerald-200 text-emerald-700">
                <Flame size={12} className="text-amber-500 animate-pulse" />
                <span>Recommendation Engine Active</span>
              </span>
              <span className="text-[11px] text-slate-500 font-semibold">Rank #14 in Culture</span>
            </div>

            <div className="mb-6 relative z-10">
              <div className="text-xs text-slate-500 font-semibold">Algorithmic Virality Score</div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl sm:text-4xl font-black text-slate-900">92</span>
                <span className="text-sm font-bold text-emerald-600">/ 100 • High Priority</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full mt-3 overflow-hidden border border-slate-200/60">
                <div className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: '92%' }} />
              </div>
            </div>

            {/* Algorithmic Weight Factors */}
            <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs relative z-10">
              <div className="flex justify-between items-center text-slate-600">
                <span className="flex items-center gap-1.5"><Clock size={12} className="text-slate-400" /> Watch Completion</span>
                <span className="font-bold text-slate-900">84.2% (+12% vs avg)</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span className="flex items-center gap-1.5"><ThumbsUp size={12} className="text-slate-400" /> Like-to-View Ratio</span>
                <span className="font-bold text-slate-900">23.1% (High engagement)</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span className="flex items-center gap-1.5"><Compass size={12} className="text-slate-400" /> Feed Discovery Target</span>
                <span className="font-bold text-emerald-600">Trending & For You</span>
              </div>
            </div>
          </div>

          {/* Core Engagement Metrics (Views, Likes, Comments, Shares) */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
              <span>Video Engagement Metrics</span>
              <span className="text-[11px] font-normal text-slate-400">Updated Real-Time</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {/* Views */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider">Total Views</span>
                  <Eye size={14} className="text-slate-500" />
                </div>
                <div className="text-xl font-extrabold text-slate-900">1,420</div>
                <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 mt-1">
                  <TrendingUp size={11} />
                  <span>+18.4% today</span>
                </div>
              </div>

              {/* Likes */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider">Total Likes</span>
                  <ThumbsUp size={14} className="text-slate-500" />
                </div>
                <div className="text-xl font-extrabold text-slate-900">328</div>
                <div className="text-[10px] text-slate-500 mt-1 font-medium">
                  98.4% Like ratio
                </div>
              </div>

              {/* Comments */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider">Comments</span>
                  <MessageSquare size={14} className="text-slate-500" />
                </div>
                <div className="text-xl font-extrabold text-slate-900">42</div>
                <div className="text-[10px] text-slate-500 mt-1 font-medium">
                  Active discussion
                </div>
              </div>

              {/* Shares */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider">Shares</span>
                  <Share2 size={14} className="text-slate-500" />
                </div>
                <div className="text-xl font-extrabold text-slate-900">89</div>
                <div className="text-[10px] text-emerald-600 mt-1 font-semibold">
                  High viral index
                </div>
              </div>
            </div>
          </div>

          {/* User Comments & Moderation Section */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare size={14} className="text-slate-600" />
                <span>Recent Comments (42)</span>
              </h3>
              <span className="text-[11px] text-slate-400">Interaction Engine</span>
            </div>

            <div className="space-y-3 text-xs">
              {/* Comment Item 1 */}
              <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center">
                      M
                    </div>
                    <span className="font-bold text-slate-800">Michel_B</span>
                  </div>
                  <span className="text-[10px] text-slate-400">2h ago</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  The visual flow and transitions in this video are super crisp! Loving the culture spotlight.
                </p>
                <div className="flex items-center gap-3 text-[10px] text-slate-400 pt-1 font-medium">
                  <span className="flex items-center gap-1 text-slate-600"><ThumbsUp size={10} /> 14</span>
                  <button className="hover:text-slate-900 transition-colors cursor-pointer">Reply</button>
                  <button className="hover:text-rose-600 transition-colors cursor-pointer">Moderate</button>
                </div>
              </div>

              {/* Comment Item 2 */}
              <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-red-600 text-white font-bold text-[10px] flex items-center justify-center">
                      C
                    </div>
                    <span className="font-bold text-slate-800">CameroonCulture</span>
                  </div>
                  <span className="text-[10px] text-slate-400">5h ago</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Authentic sound and great camera angles. Keep putting out content like this on SawaFlix!
                </p>
                <div className="flex items-center gap-3 text-[10px] text-slate-400 pt-1 font-medium">
                  <span className="flex items-center gap-1 text-slate-600"><ThumbsUp size={10} /> 22</span>
                  <button className="hover:text-slate-900 transition-colors cursor-pointer">Reply</button>
                  <button className="hover:text-rose-600 transition-colors cursor-pointer">Moderate</button>
                </div>
              </div>
            </div>
          </div>

          {/* Author / Creator Profile Card */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm shrink-0">
                {(video.author_name || 'A')[0]}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate">
                  {video.author_name || 'Admin Upload'}
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <User size={11} />
                  <span>Verified Creator</span>
                </div>
              </div>
            </div>

            <Link
              href="/admin/creators"
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer shrink-0"
            >
              View Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Modal Video Player */}
      {playingMedia && (
        <MediaPlayerModal
          isOpen={true}
          onClose={() => setPlayingMedia(null)}
          url={playingMedia.url}
          title={playingMedia.title}
          isAudio={playingMedia.isAudio}
        />
      )}
    </div>
  );
}
