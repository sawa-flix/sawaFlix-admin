'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
    Search, 
    Filter, 
    ChevronLeft, 
    ChevronRight, 
    MoreVertical, 
    ExternalLink,
    User,
    Calendar,
    Tag,
    Loader2,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '../../utils/supabase/client';

interface Creator {
    id: string;
    full_name: string;
    stage_name?: string;
    category: string;
    status: 'pending' | 'approved' | 'rejected' | 'info_requested';
    approved_at?: string;
    created_at: string;
    email: string;
    avatar_url?: string;
}

const LIVEURL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sawaflix-backend.onrender.com';
const LIMIT_PER_PAGE = 10;
const supabase = createClient();

const CATEGORIES = [
    "All",
    "Traditional Storyteller",
    "Food & Lifestyle",
    "Actor/Filmmaker",
    "Comedian",
    "Music Artist",
];

export default function CreatorManagement() {
    const [creators, setCreators] = useState<Creator[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Pagination State
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    
    // Filters
    const [status] = useState<string>('approved'); // Always approved for management
    const [filterCategory, setFilterCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const fetchCreators = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            // Get session for auth token
            const { data: { session } } = await supabase.auth.getSession();
            
            // Build URL with query params
            const categoryParam = filterCategory === 'All' ? '' : `&category=${encodeURIComponent(filterCategory)}`;
            const url = `${LIVEURL}/api/admin/creators?page=${page}&limit=${LIMIT_PER_PAGE}&status=approved${categoryParam}`;
            
            const res = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${session?.access_token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            
            const result = await res.json();
            
            // Assuming response structure: { data: Creator[], meta: { total: number, pages: number } }
            // If the response is top-level array, we handle it as well
            if (Array.isArray(result)) {
                setCreators(result);
                setTotalPages(Math.ceil(result.length / LIMIT_PER_PAGE));
            } else {
                setCreators(result.data || []);
                setTotalItems(result.meta?.total || result.total || 0);
                setTotalPages(result.meta?.pages || Math.ceil((result.meta?.total || 0) / LIMIT_PER_PAGE) || 1);
            }
        } catch (err: any) {
            console.error('Fetch creators failed:', err);
            setError('Something went wrong while loading the creators. Please check your connection or try again later.');
        } finally {
            setLoading(false);
        }
    }, [page, status, filterCategory]);

    useEffect(() => {
        fetchCreators();
    }, [fetchCreators]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '---';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getStatusStyles = (status: Creator['status']) => {
        switch (status) {
            case 'approved': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'rejected': return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'info_requested': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            default: return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
        }
    };

    const getStatusIcon = (status: Creator['status']) => {
        switch (status) {
            case 'approved': return <CheckCircle size={14} />;
            case 'rejected': return <XCircle size={14} />;
            case 'info_requested': return <AlertCircle size={14} />;
            default: return <Clock size={14} />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <User className="text-red-600" />
                        Creator Management
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">Manage and view all registered platform creators</p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Category Dropdown Filter */}
                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 text-sm text-gray-300 hover:text-white hover:border-red-600/50 flex items-center gap-2 transition-all min-w-[160px] justify-between shadow-lg"
                        >
                            <div className="flex items-center gap-2">
                                <Filter size={16} className={filterCategory !== 'All' ? 'text-red-500' : 'text-gray-500'} />
                                <span>{filterCategory}</span>
                            </div>
                            <MoreVertical size={14} className="text-gray-500" />
                        </button>

                        {isDropdownOpen && (
                            <>
                                <div 
                                    className="fixed inset-0 z-10" 
                                    onClick={() => setIsDropdownOpen(false)} 
                                />
                                <div className="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                                    <div className="p-2 border-b border-gray-800 bg-gray-950/50">
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-2">Filter by Category</p>
                                    </div>
                                    <div className="p-1">
                                        {CATEGORIES.map((cat) => (
                                            <button
                                                key={cat}
                                                onClick={() => {
                                                    setFilterCategory(cat);
                                                    setPage(1);
                                                    setIsDropdownOpen(false);
                                                }}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                                                    filterCategory === cat 
                                                    ? 'bg-red-600/10 text-red-500 font-bold' 
                                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                                }`}
                                            >
                                                {cat}
                                                {filterCategory === cat && <CheckCircle size={14} />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search names, email..."
                            className="bg-gray-900 border border-gray-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-red-600/50 focus:ring-1 focus:ring-red-600/50 w-full md:w-64 transition-all shadow-lg"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>


            {/* Data Table */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
                {loading && creators.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <Loader2 className="animate-spin text-red-600" size={40} />
                        <p className="text-gray-500 animate-pulse">Fetching creators list...</p>
                    </div>
                ) : error ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                            <AlertCircle className="text-red-500" size={32} />
                        </div>
                        <h3 className="text-white font-bold text-lg mb-2">Failed to load creators</h3>
                        <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">{error}</p>
                        <button 
                            onClick={fetchCreators}
                            className="px-6 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-colors"
                        >
                            Retry Request
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-800 bg-gray-950/50">
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Creator</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Category</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Date Approved</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {creators.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500 text-sm">
                                            No creators found matching the current filters.
                                        </td>
                                    </tr>
                                ) : (
                                    creators.map((creator) => (
                                        <tr key={creator.id} className="group hover:bg-gray-800/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-gray-800 border border-gray-700 overflow-hidden flex-shrink-0 flex items-center justify-center text-white font-bold">
                                                        {creator.avatar_url ? (
                                                            <img src={creator.avatar_url} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            creator.full_name.charAt(0).toUpperCase()
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-bold text-white truncate group-hover:text-red-500 transition-colors">
                                                            {creator.full_name}
                                                        </p>
                                                        <p className="text-xs text-gray-500 truncate">{creator.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-gray-300">
                                                    <Tag size={14} className="text-gray-500" />
                                                    <span className="text-sm">{creator.category}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <Calendar size={14} />
                                                    <span className="text-sm">{formatDate(creator.approved_at)}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusStyles(creator.status)}`}>
                                                    {getStatusIcon(creator.status)}
                                                    {creator.status.toUpperCase().replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link 
                                                    href={`/admin/verifications/${creator.id}`}
                                                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-red-600 transition-all"
                                                >
                                                    <ExternalLink size={16} />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination Bar */}
                {!loading && creators.length > 0 && (
                    <div className="px-6 py-4 bg-gray-950/50 border-t border-gray-800 flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                            Page <span className="text-white font-bold">{page}</span> of <span className="text-white font-bold">{totalPages}</span>
                        </p>
                        
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page === 1}
                                className="p-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <button
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page === totalPages}
                                className="p-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
