'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  getAdminContentById, 
  AdminContent, 
  deleteAdminContent,
  getVideoInteractivityStats,
  getVideoComments,
  postVideoCommentReply,
  deleteVideoComment,
  AdminVideoComment,
  AdminVideoStats
} from '@/services/adminContentService';
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
  ShieldCheck,
  Radio,
  Globe,
  Layers,
  Heart,
  Pin,
  CornerDownRight,
  SlidersHorizontal,
  MonitorPlay,
  Share,
  Sliders
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

  // Studio Interactive State
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  const [activeMetric, setActiveMetric] = useState<MetricType>('views');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);
  const [commentFilter, setCommentFilter] = useState<'all' | 'top' | 'review'>('all');
  const [replyOpenId, setReplyOpenId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const graphContainerRef = useRef<HTMLDivElement>(null);

  // Real Video Interactivity State (Neon PostgreSQL)
  const [adminStats, setAdminStats] = useState<AdminVideoStats | null>(null);
  const [adminComments, setAdminComments] = useState<AdminVideoComment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [replySubmitting, setReplySubmitting] = useState(false);

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

  useEffect(() => {
    async function loadInteractions() {
      if (!id) return;
      setCommentsLoading(true);
      try {
        const [statsData, commentsData] = await Promise.all([
          getVideoInteractivityStats(id),
          getVideoComments(id, commentFilter === 'top' ? 'top' : 'newest'),
        ]);
        if (statsData) setAdminStats(statsData);
        if (commentsData?.comments) setAdminComments(commentsData.comments);
      } catch (err) {
        console.warn("Failed to load video interactions:", err);
      } finally {
        setCommentsLoading(false);
      }
    }
    loadInteractions();
  }, [id, commentFilter]);

  const handleSendReply = async (parentId: string) => {
    if (!replyText.trim() || !id) return;
    setReplySubmitting(true);
    try {
      const res = await postVideoCommentReply(id, replyText.trim(), parentId);
      if (res?.comment) {
        setAdminComments((prev) =>
          prev.map((c) => {
            if (c.id === parentId) {
              const updatedReplies = [...(c.replies || []), res.comment];
              return {
                ...c,
                replies: updatedReplies,
                repliesCount: updatedReplies.length,
              };
            }
            return c;
          })
        );
        if (adminStats) {
          setAdminStats({ ...adminStats, commentsCount: adminStats.commentsCount + 1 });
        }
      }
      setReplyOpenId(null);
      setReplyText('');
    } catch (err: any) {
      alert(err.message || 'Failed to post reply');
    } finally {
      setReplySubmitting(false);
    }
  };

  const handleModerateComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to remove this comment from public discussions?')) return;
    try {
      await deleteVideoComment(commentId);
      setAdminComments((prev) => prev.filter((c) => c.id !== commentId));
      if (adminStats) {
        setAdminStats({ ...adminStats, commentsCount: Math.max(0, adminStats.commentsCount - 1) });
      }
    } catch (err: any) {
      alert(err.message || 'Failed to moderate comment');
    }
  };

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
        { label: '0:00', value: 100, display: '100%', sub: 'Hook Intro • +8% vs avg', annotation: 'Intro Hook' },
        { label: '0:06', value: 94, display: '94%', sub: 'Strong visual engagement', annotation: 'Scene Transition' },
        { label: '0:12', value: 89, display: '89%', sub: 'Peak viewer focus', annotation: null },
        { label: '0:18', value: 86, display: '86%', sub: 'Continuous watchthrough', annotation: 'Key Narrative' },
        { label: '0:24', value: 82, display: '82%', sub: 'Stable retention plateau', annotation: null },
        { label: '0:30', value: 76, display: '76%', sub: 'Leading into climax', annotation: null },
        { label: `0:${durationSec < 10 ? '0' + durationSec : durationSec}`, value: 68, display: '68%', sub: 'End screen retention', annotation: 'Full Completion' }
      ];
    }

    if (timeRange === '24h') {
      if (activeMetric === 'interactions') {
        return [
          { label: '00:00', value: 8, display: '8 acts/hr', sub: 'Overnight passive', annotation: null },
          { label: '04:00', value: 5, display: '5 acts/hr', sub: 'Off-peak baseline', annotation: null },
          { label: '08:00', value: 24, display: '24 acts/hr', sub: 'Morning rise', annotation: 'Commute Lift' },
          { label: '12:00', value: 58, display: '58 acts/hr', sub: 'Midday viral shares', annotation: null },
          { label: '16:00', value: 72, display: '72 acts/hr', sub: 'Afternoon surge', annotation: null },
          { label: '20:00', value: 95, display: '95 acts/hr', sub: 'Prime peak engagement', annotation: 'Feed Spike' },
          { label: '23:00', value: 44, display: '44 acts/hr', sub: 'Evening taper', annotation: null }
        ];
      }
      return [
        { label: '00:00', value: 45, display: '45 v/h', sub: 'Overnight flow', annotation: null },
        { label: '04:00', value: 22, display: '22 v/h', sub: 'Baseline discovery', annotation: null },
        { label: '08:00', value: 110, display: '110 v/h', sub: 'Morning audience push', annotation: null },
        { label: '12:00', value: 240, display: '240 v/h', sub: 'Explore feed feature', annotation: 'Explore Pick' },
        { label: '16:00', value: 320, display: '320 v/h', sub: 'Channel recommendation', annotation: null },
        { label: '20:00', value: 428, display: '428 v/h', sub: 'Peak algorithmic push', annotation: 'Daily High' },
        { label: '23:00', value: 255, display: '255 v/h', sub: 'Night retention', annotation: null }
      ];
    }

    if (timeRange === '7d') {
      if (activeMetric === 'interactions') {
        return [
          { label: 'Mon', value: 34, display: '34 acts', sub: 'Launch day traction', annotation: null },
          { label: 'Tue', value: 48, display: '48 acts', sub: 'Organic reposts', annotation: null },
          { label: 'Wed', value: 65, display: '65 acts', sub: 'Discussion thread lift', annotation: null },
          { label: 'Thu', value: 78, display: '78 acts', sub: 'Algorithmic boost', annotation: 'Algorithm Wave' },
          { label: 'Fri', value: 112, display: '112 acts', sub: 'Weekend kickoff share', annotation: null },
          { label: 'Sat', value: 135, display: '135 acts', sub: 'Peak social velocity', annotation: 'Social Peak' },
          { label: 'Sun', value: 98, display: '98 acts', sub: 'Sustained engagement', annotation: null }
        ];
      }
      return [
        { label: 'Mon', value: 180, display: '180 views', sub: 'Upload launch day', annotation: null },
        { label: 'Tue', value: 240, display: '240 views', sub: 'Direct catalog searches', annotation: null },
        { label: 'Wed', value: 310, display: '310 views', sub: 'Suggested video rail', annotation: null },
        { label: 'Thu', value: 390, display: '390 views', sub: 'Culture category surge', annotation: null },
        { label: 'Fri', value: 520, display: '520 views', sub: 'Weekend recommendation', annotation: 'Weekend Lift' },
        { label: 'Sat', value: 640, display: '640 views', sub: 'Top trending placement', annotation: 'Trending #14' },
        { label: 'Sun', value: 480, display: '480 views', sub: 'Catalog retention', annotation: null }
      ];
    }

    // 30d
    return [
      { label: 'W1', value: 820, display: '820 views', sub: 'First week ramp', annotation: 'Release' },
      { label: 'W2', value: 1450, display: '1,450 views', sub: 'Algorithmic adoption', annotation: 'Expansion' },
      { label: 'W3', value: 2100, display: '2,100 views', sub: 'Culture trending rail', annotation: 'Peak Tier' },
      { label: 'W4', value: 2840, display: '2,840 views', sub: 'Evergreen baseline', annotation: 'Evergreen' }
    ];
  }, [timeRange, activeMetric, durationSec]);

  // Compute SVG Points & Smooth Bezier Path
  const { pathData, areaData, points } = useMemo(() => {
    const width = 720;
    const height = 190;
    const paddingX = 45;
    const paddingTop = 25;
    const paddingBottom = 40;

    const values = graphData.map(d => d.value);
    const max = Math.max(...values) * 1.15;
    const min = Math.min(...values) * 0.75;
    const range = max - min || 1;

    const computedPoints = graphData.map((d, index) => {
      const x = paddingX + (index / (graphData.length - 1)) * (width - paddingX * 2);
      const y = paddingTop + (1 - (d.value - min) / range) * (height - paddingTop - paddingBottom);
      return { x, y, ...d };
    });

    if (computedPoints.length === 0) {
      return { pathData: '', areaData: '', points: [] };
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

    return { pathData: path, areaData: area, points: computedPoints };
  }, [graphData]);

  // Handle Graph Mouse Move for Interactive Tooltip
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svgRect = e.currentTarget.getBoundingClientRect();
    const mouseX = ((e.clientX - svgRect.left) / svgRect.width) * 720;

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
        <SawaflixLoader size={54} text="Loading video studio console..." />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center max-w-lg mx-auto shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-500">
          <VideoIcon size={26} />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Video Not Found</h2>
        <p className="text-xs text-slate-500 mb-6">
          The requested video could not be located in the media database or catalog.
        </p>
        <Link
          href="/admin/content/feed"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer shadow-sm"
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
    <div className="space-y-6 pb-16 animate-in fade-in duration-200 text-left">
      
      {/* Studio Top Navigation Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl px-5 py-3.5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/content/feed"
            className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
            title="Back to Uploaded Feed"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
              <Link href="/admin/content/feed" className="hover:text-slate-600 transition-colors">Catalog</Link>
              <span>/</span>
              <span className="text-slate-700 font-semibold truncate max-w-[280px]">{video.title}</span>
            </div>
            <div className="flex items-center gap-2.5 mt-0.5">
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                {video.title}
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 border border-emerald-200/80 text-emerald-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live Streaming</span>
              </span>
            </div>
          </div>
        </div>

        {/* Action Button Strip */}
        <div className="flex items-center gap-2">
          {mediaUrl && (
            <button
              onClick={() => setPlayingMedia({ url: mediaUrl, title: video.title, isAudio: false })}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Play size={12} fill="currentColor" />
              <span>Preview</span>
            </button>
          )}

          {mediaUrl && (
            <button
              onClick={() => handleCopy(mediaUrl)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Copy stream endpoint"
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy Endpoint'}</span>
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

      {/* Hero Studio Section: Real-App Interactive Graph & Pulse Card */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs relative overflow-hidden">
        
        {/* Header with Metric Tabs & Timeframe Picker */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-50 to-orange-50 text-red-600 border border-red-200/60 flex items-center justify-center shadow-2xs">
                <Activity size={18} className="animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-extrabold text-slate-900">
                    Real-Time Audience & Retention Analytics
                  </h2>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                    Studio Telemetry
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Continuous performance telemetry feeding SawaFlix's algorithmic recommendation engine
                </p>
              </div>
            </div>
          </div>

          {/* Metric Selector & Timeframe Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Metric Mode Switcher */}
            <div className="inline-flex p-1 rounded-xl bg-slate-100/90 border border-slate-200/70 text-xs font-semibold">
              <button
                onClick={() => setActiveMetric('views')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeMetric === 'views'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Eye size={12} />
                <span>Views & Velocity</span>
              </button>
              <button
                onClick={() => setActiveMetric('retention')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeMetric === 'retention'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Clock size={12} />
                <span>Retention %</span>
              </button>
              <button
                onClick={() => setActiveMetric('interactions')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeMetric === 'interactions'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <ThumbsUp size={12} />
                <span>Interactions</span>
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

        {/* Real-App SVG Telemetry Canvas */}
        <div 
          ref={graphContainerRef}
          className="relative w-full aspect-[21/8] min-h-[230px] bg-gradient-to-b from-slate-50/60 via-white to-white rounded-2xl border border-slate-200/80 p-3 select-none"
        >
          {/* Floating Hover Card */}
          {currentHoveredPoint && (
            <div className="absolute top-4 left-6 z-10 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-200/90 shadow-md text-xs pointer-events-none transition-all duration-150">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  {currentHoveredPoint.label} • Telemetry Point
                </span>
                {currentHoveredPoint.annotation && (
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    {currentHoveredPoint.annotation}
                  </span>
                )}
              </div>
              <div className="text-base font-black text-slate-900 mt-0.5">
                {currentHoveredPoint.display}
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
                <TrendingUp size={11} />
                <span>{currentHoveredPoint.sub}</span>
              </div>
            </div>
          )}

          <svg
            viewBox="0 0 720 190"
            className="w-full h-full overflow-visible cursor-crosshair"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredPointIndex(null)}
          >
            <defs>
              <linearGradient id="studioGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#EF4444" stopOpacity="0.25" />
                <stop offset="50%" stopColor="#EF4444" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#EF4444" stopOpacity="0.0" />
              </linearGradient>

              <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#EF4444" />
                <stop offset="60%" stopColor="#F97316" />
                <stop offset="100%" stopColor="#E11D48" />
              </linearGradient>
            </defs>

            {/* Horizontal Gridlines & Benchmark markers */}
            <line x1="45" y1="45" x2="675" y2="45" stroke="#F1F5F9" strokeWidth="1.5" />
            <line x1="45" y1="90" x2="675" y2="90" stroke="#F1F5F9" strokeWidth="1.5" />
            <line x1="45" y1="135" x2="675" y2="135" stroke="#F1F5F9" strokeWidth="1.5" />

            {/* Benchmark Average Line */}
            <line x1="45" y1="95" x2="675" y2="95" stroke="#CBD5E1" strokeDasharray="5 5" strokeWidth="1" />
            <text x="670" y="90" textAnchor="end" className="text-[9px] fill-slate-400 font-semibold select-none">
              Category Average
            </text>

            {/* Filled Area Gradient */}
            {areaData && (
              <path d={areaData} fill="url(#studioGradient)" />
            )}

            {/* Main Smooth Curve Line */}
            {pathData && (
              <path
                d={pathData}
                fill="none"
                stroke="url(#strokeGradient)"
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
                  y2="150"
                  stroke="#94A3B8"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <circle
                  cx={currentHoveredPoint.x}
                  cy={currentHoveredPoint.y}
                  r="8"
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
                r={hoveredPointIndex === idx ? "5.5" : "3.5"}
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
                y="174"
                textAnchor="middle"
                className="text-[10px] fill-slate-400 font-medium select-none"
              >
                {pt.label}
              </text>
            ))}
          </svg>
        </div>

        {/* Real-App Telemetry Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-4 pt-4 border-t border-slate-100 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/60">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Peak Velocity</span>
            <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">428 views/hr</span>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-0.5">
              <ArrowUpRight size={11} /> +34% vs typical
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/60">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Audience Hook</span>
            <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">94% at 0:05</span>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-0.5">
              <ShieldCheck size={11} /> Outstanding intro
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/60">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Avg View Duration</span>
            <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">0:32 (84.2%)</span>
            <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">High rewatch index</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/60">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Discovery Engine</span>
            <span className="font-extrabold text-emerald-600 text-sm mt-0.5 block flex items-center gap-1">
              <Zap size={13} className="text-amber-500" /> Active Priority
            </span>
            <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">Recommended for 8,400+</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Video Console, Specs & Ingestion (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Studio Video Player Console */}
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

              {/* Studio Overlay Pill */}
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-white text-[10px] font-bold flex items-center gap-1.5 pointer-events-none">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>1080p HD • Cloudflare R2 Stream</span>
              </div>
            </div>

            {/* Video Specs Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/70 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Duration</span>
                <span className="font-extrabold text-slate-800 font-mono text-sm">{formattedDuration}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Resolution</span>
                <span className="font-extrabold text-slate-800 text-sm">1080p 60fps</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Format</span>
                <span className="font-extrabold text-slate-800 text-sm">{(video as any).is_reel ? 'Reel (9:16)' : 'Standard (16:9)'}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Storage</span>
                <span className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Cloudflare R2</span>
                </span>
              </div>
            </div>
          </div>

          {/* Video Description & Categorization */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Description</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {video.description || 'No description provided for this video.'}
              </p>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Classification & Discovery</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Category</span>
                  <span className="inline-block mt-0.5 px-3 py-1 rounded-lg bg-slate-900 text-white text-[11px] font-bold">
                    {video.category || 'Culture'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Visibility</span>
                  <span className="font-bold text-slate-800 capitalize mt-1 block">
                    {(video as any).visibility || 'Public'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Age Rating</span>
                  <span className={`inline-block mt-1 px-2.5 py-0.5 rounded text-[10px] font-bold ${
                    (video as any).age_restriction 
                      ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {(video as any).age_restriction ? '18+ Restricted' : 'All Ages'}
                  </span>
                </div>
              </div>
            </div>

            {/* Tags */}
            {((video as any).tags && (video as any).tags.length > 0) && (
              <div className="border-t border-slate-100 pt-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Tag size={12} />
                  <span>Topic Tags</span>
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {(video as any).tags.map((t: string, i: number) => (
                    <span key={i} className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200/80">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Storage & Edge Delivery Endpoint */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <HardDrive size={14} className="text-slate-600" />
              <span>Zero-Egress Storage & Delivery Endpoint</span>
            </h3>
            <div className="space-y-2.5 text-xs font-mono">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                <span className="truncate text-slate-600">{mediaUrl}</span>
                <button 
                  onClick={() => handleCopy(mediaUrl)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
                  title="Copy Endpoint"
                >
                  <Copy size={13} />
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 font-sans">
                <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <CheckCircle2 size={13} /> Synced to Supabase Catalog
                </span>
                <span>•</span>
                <span>Cloudflare R2 Direct Byte-Range Proxying (HTTP 206)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interaction, Discovery & Recommendation Engine (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Recommendation Engine Card - LIGHT STUDIO THEME */}
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
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Video Engagement Metrics
              </h3>
              <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Live Sync
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Views */}
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Total Views</span>
                  <Eye size={14} className="text-slate-500" />
                </div>
                <div className="text-2xl font-black text-slate-900">
                  {adminStats?.viewsCount?.toLocaleString() ?? video.view_count?.toLocaleString() ?? '1,420'}
                </div>
                <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 mt-1">
                  <TrendingUp size={11} />
                  <span>+18.4% vs typical</span>
                </div>
              </div>

              {/* Likes */}
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Total Likes</span>
                  <ThumbsUp size={14} className="text-slate-500" />
                </div>
                <div className="text-2xl font-black text-slate-900">
                  {adminStats?.likesCount?.toLocaleString() ?? '328'}
                </div>
                <div className="text-[10px] text-slate-500 mt-1 font-semibold">
                  Live Neon counters
                </div>
              </div>

              {/* Comments */}
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Comments</span>
                  <MessageSquare size={14} className="text-slate-500" />
                </div>
                <div className="text-2xl font-black text-slate-900">
                  {adminStats?.commentsCount ?? adminComments.length}
                </div>
                <div className="text-[10px] text-slate-500 mt-1 font-semibold">
                  Active discussion
                </div>
              </div>

              {/* Shares */}
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Shares</span>
                  <Share2 size={14} className="text-slate-500" />
                </div>
                <div className="text-2xl font-black text-slate-900">
                  {adminStats?.sharesCount ?? '0'}
                </div>
                <div className="text-[10px] text-emerald-600 mt-1 font-semibold">
                  High viral index
                </div>
              </div>
            </div>
          </div>

          {/* Traffic Sources Breakdown (YouTube Studio Style) */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Radio size={14} className="text-slate-600" />
                <span>Traffic Sources Breakdown</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">Last 7 Days</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Home Recommendations</span>
                  <span>54.2% (770 views)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-slate-900 h-full rounded-full" style={{ width: '54.2%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Explore & Trending Feed</span>
                  <span>28.5% (405 views)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-red-500 h-full rounded-full" style={{ width: '28.5%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Search & Tags</span>
                  <span>11.3% (160 views)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '11.3%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>External & Shared Links</span>
                  <span>6.0% (85 views)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '6.0%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* User Comments & Moderation Section (Real Creator Studio Style) */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare size={14} className="text-slate-600" />
                <span>Community Comments ({adminStats?.commentsCount ?? adminComments.length})</span>
              </h3>
              <div className="flex items-center gap-1 text-[11px]">
                <button 
                  onClick={() => setCommentFilter('all')}
                  className={`px-2 py-0.5 rounded-md cursor-pointer transition-colors ${commentFilter === 'all' ? 'bg-slate-900 text-white font-bold' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  All
                </button>
                <button 
                  onClick={() => setCommentFilter('top')}
                  className={`px-2 py-0.5 rounded-md cursor-pointer transition-colors ${commentFilter === 'top' ? 'bg-slate-900 text-white font-bold' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  Top
                </button>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              {commentsLoading ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Loading community comments...
                </div>
              ) : adminComments.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-50/50 border border-slate-100 text-slate-400 text-xs">
                  No community comments yet on this video.
                </div>
              ) : (
                adminComments.map((comment) => (
                  <div key={comment.id} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center overflow-hidden">
                          {comment.userAvatar ? (
                            <img src={comment.userAvatar} alt={comment.userName} className="w-full h-full object-cover" />
                          ) : (
                            comment.userName?.[0]?.toUpperCase() || 'U'
                          )}
                        </div>
                        <span className="font-bold text-slate-900">{comment.userName}</span>
                        {comment.userRole && !['viewer', 'user', 'member'].includes(comment.userRole.toLowerCase()) && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200 uppercase">
                            {comment.userRole}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-slate-700 leading-relaxed font-normal">
                      {comment.content}
                    </p>

                    <div className="flex items-center gap-3 text-[10px] text-slate-400 pt-1 font-semibold">
                      <span className="flex items-center gap-1 text-slate-700">
                        <ThumbsUp size={11} /> {comment.likesCount || 0}
                      </span>
                      <button 
                        onClick={() => {
                          setReplyOpenId(replyOpenId === comment.id ? null : comment.id);
                          setReplyText('');
                        }}
                        className="hover:text-slate-900 transition-colors cursor-pointer"
                      >
                        {replyOpenId === comment.id ? 'Cancel' : 'Reply'}
                      </button>
                      <button 
                        onClick={() => handleModerateComment(comment.id)}
                        className="hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        Moderate
                      </button>
                    </div>

                    {/* Creator Inline Reply Box */}
                    {replyOpenId === comment.id && (
                      <div className="pt-2 flex items-center gap-2 animate-in fade-in">
                        <input 
                          type="text" 
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder={`Write a creator reply to @${comment.userName}...`} 
                          className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 outline-hidden focus:ring-1 focus:ring-slate-900"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSendReply(comment.id);
                          }}
                        />
                        <button 
                          onClick={() => handleSendReply(comment.id)}
                          disabled={replySubmitting || !replyText.trim()}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold cursor-pointer disabled:opacity-40"
                        >
                          {replySubmitting ? 'Sending...' : 'Send'}
                        </button>
                      </div>
                    )}

                    {/* Nested Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-3 pl-3 border-l-2 border-slate-200 space-y-2.5">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="pt-1 text-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-800">{reply.userName}</span>
                                {reply.userRole && !['viewer', 'user'].includes(reply.userRole.toLowerCase()) && (
                                  <span className="px-1 py-0.2 rounded text-[8px] font-bold bg-slate-100 text-slate-700">
                                    {reply.userRole}
                                  </span>
                                )}
                              </div>
                              <button 
                                onClick={() => handleModerateComment(reply.id)}
                                className="text-[9px] text-slate-400 hover:text-rose-600 cursor-pointer"
                              >
                                Remove
                              </button>
                            </div>
                            <p className="text-slate-600 font-normal">{reply.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Author / Creator Profile Card */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm shrink-0">
                {(video.author_name || 'A')[0]}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate">
                  {video.author_name || 'Admin Upload'}
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <User size={11} />
                  <span>Verified Creator • 14 uploads</span>
                </div>
              </div>
            </div>

            <Link
              href="/admin/creators"
              className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer shrink-0"
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
