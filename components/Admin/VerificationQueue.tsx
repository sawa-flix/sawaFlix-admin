"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
    Search,
    Filter,
    Eye,
    Clock,
    CheckCircle2,
    XCircle,
    Inbox,
    Loader2,
    CheckSquare,
    MoreVertical,
    CheckCircle
} from 'lucide-react';
import { useAdminNotifications } from '@/contexts/AdminNotificationContext';
import { createClient } from '@/utils/supabase/client';
import { getFriendlyError } from '@/utils/errorMessages';

const LIVEURL = process.env.NEXT_PUBLIC_ADMIN_BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'https://sawaflix-backend.onrender.com';
const supabase = createClient();

interface VerificationItem {
    id: string;
    slug?: string;
    full_name: string;
    legal_name?: string;
    stage_name?: string;
    category: string;
    status: "pending" | "approved" | "rejected" | "info_requested";
    submitted_at: string;
    avatar_url?: string;
    identity?: {
        legalName?: string;
        stageName?: string;
        avatarUrl?: string;
    };
}

const CATEGORIES = [
    "All",
    "Traditional Storyteller",
    "Food & Lifestyle",
    "Actor/Filmmaker",
    "Comedian",
    "Music Artist",
];

export default function VerificationQueue() {
    const [items, setItems] = useState<VerificationItem[]>([]);
    const [currentStatus, setCurrentStatus] = useState<VerificationItem['status'] | 'all'>('pending');
    const [filterCategory, setFilterCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [bulkLoading, setBulkLoading] = useState(false);
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const [pendingCount, setPendingCount] = useState<number>(0);
    const [apiError, setApiError] = useState<string | null>(null);

    const { addNotification } = useAdminNotifications();

    const getAccessToken = async (): Promise<string | null> => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) return session.access_token;
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;
        const { data: { session: freshSession } } = await supabase.auth.getSession();
        return freshSession?.access_token ?? null;
    };

    const fetchPendingCount = async () => {
        try {
            const token = await getAccessToken();
            if (!token) return;
            const res = await fetch(`${LIVEURL}/api/admin/pending-count`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setPendingCount(data.count ?? data.data?.count ?? 0);
            }
        } catch (e) {
            console.error("Failed to fetch pending count", e);
        }
    };

    const fetchData = async (isBackground = false) => {
        if (!isBackground) {
            setLoading(true);
            setApiError(null);
        }
        fetchPendingCount();
        try {
            const token = await getAccessToken();

            if (!token) {
                if (!isBackground) {
                    setApiError('Session expired. Please refresh the page.');
                    setLoading(false);
                }
                return;
            }

            const statusParam = currentStatus === 'all' ? '' : `status=${currentStatus}`;
            const categoryParam = filterCategory === 'All' ? '' : `&category=${encodeURIComponent(filterCategory)}`;
            const res = await fetch(`${LIVEURL}/api/admin/verifications?${statusParam}${categoryParam}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!res.ok) {
                if (!isBackground) setApiError(`Unable to load verification requests.`);
                if (!isBackground) setLoading(false);
                return;
            }
            const data = await res.json();
            const fetchedItems = data.data || [];

            if (isBackground && fetchedItems.length > items.length) {
                const diff = fetchedItems.length - items.length;
                addNotification({
                    type: 'new_submission',
                    title: 'New Verification Requests',
                    message: `${diff} new creator${diff > 1 ? 's have' : ' has'} applied for verification.`
                });
            }

            setItems(fetchedItems);
        } catch (error) {
            if (!isBackground) setApiError('Network error. Please check your connection.');
        } finally {
            if (!isBackground) setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const pollInterval = setInterval(() => {
            fetchData(true);
        }, 30000);
        return () => clearInterval(pollInterval);
    }, [currentStatus, filterCategory]);

    const filteredItems = items.filter(item => {
        const resolvedName = item.stage_name || item.identity?.stageName || item.legal_name || item.full_name || item.identity?.legalName || "Unknown Creator";
        const matchesSearch = resolvedName.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (filterCategory === 'All') return matchesSearch;
        const itemCat = (item.category || "").trim().toLowerCase();
        const filterCat = filterCategory.trim().toLowerCase();
        return matchesSearch && itemCat === filterCat;
    });

    const isPendingView = currentStatus === 'pending';
    const allSelected = isPendingView && filteredItems.length > 0 && selectedIds.size === filteredItems.length;

    const toggleSelectAll = () => {
        if (allSelected) {
            setSelectedIds(new Set());
        } else {
            const next = new Set<string>();
            filteredItems.forEach(i => next.add(i.slug || i.id));
            setSelectedIds(next);
        }
    };

    const toggleSelect = (id: string, isPending: boolean) => {
        if (!isPending) return;
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const handleBulkApprove = async () => {
        if (selectedIds.size === 0) return;
        setBulkLoading(true);
        try {
            const token = await getAccessToken();
            if (!token) return;

            const requests = Array.from(selectedIds).map(id => 
                fetch(`${LIVEURL}/api/admin/verifications/${id}/approve`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })
            );

            await Promise.allSettled(requests);
            setSelectedIds(new Set());
            fetchData();
        } catch (e) {
            console.error(e);
        } finally {
            setBulkLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-amber-50 text-amber-600 border-amber-200';
            case 'approved': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
            case 'rejected': return 'bg-rose-50 text-rose-600 border-rose-200';
            default: return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Verification Queue</h1>
                    <p className="text-slate-500 text-xs mt-1">
                        {currentStatus === 'all' ? 'All' : currentStatus.replace('_', ' ')} applications 
                        {filterCategory !== 'All' ? ` in ${filterCategory}` : ''}
                    </p>

                    {apiError && (
                        <div className="mt-3 bg-red-50 border border-red-200 text-red-700 px-3.5 py-2.5 rounded-2xl flex items-center gap-2.5 text-xs">
                            <span className="font-semibold">{apiError}</span>
                        </div>
                    )}

                    {selectedIds.size > 0 && (
                        <div className="mt-3 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                            <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                                {selectedIds.size} selected
                            </span>
                            <button
                                onClick={handleBulkApprove}
                                disabled={bulkLoading}
                                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                            >
                                {bulkLoading ? <Loader2 size={13} className="animate-spin" /> : <CheckSquare size={13} />}
                                Bulk Approve
                            </button>
                            <button
                                onClick={() => setSelectedIds(new Set())}
                                className="text-xs text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                    {/* Status Filter Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                            className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 flex items-center gap-2 transition-all min-w-[150px] justify-between shadow-xs cursor-pointer"
                        >
                            <div className="flex items-center gap-2">
                                <div className={currentStatus === 'all' ? 'text-slate-400' : 'text-red-500'}>
                                    {currentStatus === 'pending' && <Clock size={14} />}
                                    {currentStatus === 'approved' && <CheckCircle2 size={14} className="text-emerald-500" />}
                                    {currentStatus === 'rejected' && <XCircle size={14} className="text-rose-500" />}
                                    {currentStatus === 'all' && <Filter size={14} />}
                                    {currentStatus === 'info_requested' && <Inbox size={14} />}
                                </div>
                                <span className="capitalize">{currentStatus === 'all' ? 'All Status' : currentStatus.replace('_', ' ')}</span>
                            </div>
                            <MoreVertical size={13} className="text-slate-400" />
                        </button>

                        {isStatusDropdownOpen && (
                            <>
                                <div 
                                    className="fixed inset-0 z-10" 
                                    onClick={() => setIsStatusDropdownOpen(false)} 
                                />
                                <div className="absolute right-0 mt-1.5 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                                    <div className="p-2.5 border-b border-slate-100 bg-slate-50/70">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Filter Status</p>
                                    </div>
                                    <div className="p-1 space-y-0.5">
                                        {[
                                            { value: 'all', label: 'All Status', icon: <Filter size={13} /> },
                                            { value: 'pending', label: 'Pending', icon: <Clock size={13} />, badge: pendingCount },
                                            { value: 'approved', label: 'Approved', icon: <CheckCircle2 size={13} className="text-emerald-500" /> },
                                            { value: 'rejected', label: 'Rejected', icon: <XCircle size={13} className="text-rose-500" /> },
                                            { value: 'info_requested', label: 'Info Requested', icon: <Inbox size={13} /> }
                                        ].map((opt) => (
                                            <button
                                                key={opt.value}
                                                onClick={() => {
                                                    setCurrentStatus(opt.value as any);
                                                    setSelectedIds(new Set());
                                                    setIsStatusDropdownOpen(false);
                                                }}
                                                className={`w-full text-left px-3 py-1.5 rounded-xl text-xs transition-colors flex items-center justify-between ${
                                                    currentStatus === opt.value 
                                                    ? 'bg-red-50 text-red-600 font-bold' 
                                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    {opt.icon}
                                                    <span>{opt.label}</span>
                                                    {opt.badge !== undefined && opt.badge > 0 && (
                                                        <span className="ml-1 px-1.5 py-0.2 bg-red-600 text-[9px] text-white rounded-full font-bold">
                                                            {opt.badge}
                                                        </span>
                                                    )}
                                                </div>
                                                {currentStatus === opt.value && <CheckCircle size={13} />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                        <input
                            type="text"
                            placeholder="Search names..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 w-full transition-all shadow-xs placeholder:text-slate-400"
                        />
                    </div>
                </div>
            </div>

            {/* Category Filters */}
            <div className="flex overflow-x-auto pb-2 scrollbar-none gap-2">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setFilterCategory(cat)}
                        className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${filterCategory === cat
                            ? 'bg-red-600 text-white shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                            }`}
                    >
                        {cat === 'All' ? 'All Requests' : cat}
                    </button>
                ))}
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs min-h-[360px] flex flex-col">
                {items.length === 0 && !loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3 text-slate-400">
                            <Inbox size={26} />
                        </div>
                        <h3 className="text-sm font-bold text-slate-900">No creators available for review</h3>
                        <p className="text-xs text-slate-500 mt-1 max-w-sm">
                            There are no pending verification requests at the moment. Submissions will appear here when creators apply.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                                    <th className="px-5 py-3 w-10 text-center">
                                        <input
                                            type="checkbox"
                                            checked={allSelected}
                                            onChange={toggleSelectAll}
                                            disabled={!isPendingView || filteredItems.length === 0}
                                            className="rounded border-slate-300 text-red-600 focus:ring-red-500 cursor-pointer disabled:opacity-40"
                                        />
                                    </th>
                                    <th className="px-5 py-3 font-semibold">Creator</th>
                                    <th className="px-5 py-3 font-semibold">Category</th>
                                    <th className="px-5 py-3 font-semibold">Submitted</th>
                                    <th className="px-5 py-3 font-semibold">Status</th>
                                    <th className="px-5 py-3 font-semibold text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading && (
                                    [...Array(5)].map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-5 py-3.5"><div className="h-4 w-4 bg-slate-100 rounded"></div></td>
                                            <td className="px-5 py-3.5"><div className="h-9 w-40 bg-slate-100 rounded-xl"></div></td>
                                            <td className="px-5 py-3.5"><div className="h-6 w-24 bg-slate-100 rounded-lg"></div></td>
                                            <td className="px-5 py-3.5"><div className="h-6 w-32 bg-slate-100 rounded-lg"></div></td>
                                            <td className="px-5 py-3.5"><div className="h-6 w-20 bg-slate-100 rounded-full"></div></td>
                                            <td className="px-5 py-3.5"><div className="h-7 w-16 bg-slate-100 rounded-lg ml-auto"></div></td>
                                        </tr>
                                    ))
                                )}

                                {!loading && filteredItems.length > 0 && filteredItems.map((item) => {
                                    const isPending = item.status === 'pending';
                                    const isSelected = selectedIds.has(item.slug || item.id);
                                    const resolvedName = item.stage_name || item.identity?.stageName || item.legal_name || item.full_name || item.identity?.legalName || "Unknown Creator";

                                    return (
                                        <tr key={item.id} className={`group transition-colors ${isSelected ? 'bg-red-50/40' : 'hover:bg-slate-50/60'}`}>
                                            <td className="px-5 py-3.5 text-center" onClick={(e) => { e.stopPropagation(); toggleSelect(item.slug || item.id, isPending); }}>
                                                {isPending ? (
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedIds.has(item.slug || item.id)}
                                                        onChange={() => toggleSelect(item.slug || item.id, isPending)}
                                                        className="rounded border-slate-300 text-red-600 focus:ring-red-500 cursor-pointer"
                                                    />
                                                ) : (
                                                    <span className="w-4 h-4 block" />
                                                )}
                                            </td>
                                            <td className="px-5 py-3.5 cursor-pointer" onClick={() => toggleSelect(item.slug || item.id, isPending)}>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-slate-100 overflow-hidden relative border border-slate-200 shrink-0">
                                                        <img
                                                            src={item.avatar_url || item.identity?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(resolvedName)}`}
                                                            alt={resolvedName}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-900 text-xs">{resolvedName}</div>
                                                        <div className="text-[10px] text-slate-400">{item.legal_name || 'Creator'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <span className="text-[11px] font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/80">
                                                    {item.category}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                                    <Clock size={12} className="text-slate-400" />
                                                    <span>{formatDate(item.submitted_at)}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(item.status)}`}>
                                                    {item.status === 'approved' && <CheckCircle2 size={11} />}
                                                    {item.status === 'rejected' && <XCircle size={11} />}
                                                    {item.status === 'pending' && <Clock size={11} />}
                                                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5 text-right">
                                                <Link
                                                    href={`/admin/verifications/${item.id}?name=${encodeURIComponent(resolvedName)}&category=${encodeURIComponent(item.category)}`}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition-all shadow-2xs cursor-pointer"
                                                >
                                                    <Eye size={13} />
                                                    <span>Review</span>
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}

                                {!loading && filteredItems.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-5 py-12 text-center text-xs text-slate-400">
                                            No creators found matching "{searchTerm}" or "{filterCategory}".
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination Footer */}
                {!loading && items.length > 0 && (
                    <div className="bg-slate-50/75 px-5 py-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500 mt-auto">
                        <span>Showing {filteredItems.length} entries</span>
                        <div className="flex gap-2">
                            <button disabled className="px-3 py-1 rounded-lg border border-slate-200 bg-white text-slate-400 cursor-not-allowed">Previous</button>
                            <button className="px-3 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer">Next</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
