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

const LIVEURL = ''; // Use relative paths to avoid CORS 403 issues on local dev
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

    const { addNotification } = useAdminNotifications();

    const fetchData = async (isBackground = false) => {
        if (!isBackground) setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            
            if (!session) {
                console.warn('No auth session available. Redirecting to login...');
                window.location.href = '/login';
                if (!isBackground) setLoading(false);
                return;
            }

            const statusParam = currentStatus === 'all' ? '' : `status=${currentStatus}`;
            const categoryParam = filterCategory === 'All' ? '' : `&category=${encodeURIComponent(filterCategory)}`;
            const res = await fetch(`${LIVEURL}/api/admin/verifications?${statusParam}${categoryParam}`, {
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!res.ok) {
                if (res.status === 401 || res.status === 403) {
                     console.error(`Verifications API returned ${res.status}: Forbidden.`);
                     await supabase.auth.signOut();
                     window.location.href = '/login?error=You+do+not+have+permission+to+access+this+page.';
                     if (!isBackground) setLoading(false);
                     return;
                }
                console.error(`Verifications API returned ${res.status}: ${res.statusText}`);
                if (!isBackground) setLoading(false);
                return;
            }
            const data = await res.json();
            const fetchedItems = data.data || [];

            // If it's a background fetch and we have more items now, notify!
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
            console.error("Failed to fetch verifications:", error);
        } finally {
            if (!isBackground) setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        // Auto-poll for new submissions every 30 seconds
        const pollInterval = setInterval(() => {
            fetchData(true);
        }, 30000);

        return () => clearInterval(pollInterval);
    }, [currentStatus, filterCategory]); // Re-run effect when status or category changes

    const filteredItems = items.filter(item => {
        const name = item.legal_name || item.stage_name || item.full_name || item.identity?.legalName || "Unknown Creator";
        const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const isPendingView = currentStatus === 'pending';
    const allSelected = isPendingView && filteredItems.length > 0 && filteredItems.every(i => selectedIds.has(i.id));

    const toggleSelectAll = () => {
        if (allSelected) {
            setSelectedIds(new Set());
        } else {
            const newSet = new Set(selectedIds);
            filteredItems.forEach(i => newSet.add(i.id));
            setSelectedIds(newSet);
        }
    };

    const toggleSelect = (id: string, isPending: boolean) => {
        if (!isPending) return;
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedIds(newSet);
    };

    const handleBulkApprove = async () => {
        if (selectedIds.size === 0) return;
        if (!confirm(`Are you sure you want to approve ${selectedIds.size} creators?`)) return;

        setBulkLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const approvePromises = Array.from(selectedIds).map(slug => 
                fetch(`${LIVEURL}/api/admin/verifications/${slug}/approve`, {
                    method: 'POST',
                    headers: { 
                        'Authorization': `Bearer ${session?.access_token}`,
                        'Content-Type': 'application/json' 
                    },
                    body: JSON.stringify({ notes: 'Bulk approved by admin' })
                })
            );
            await Promise.all(approvePromises);

            addNotification({
                type: 'approved',
                title: 'Bulk Approval Complete',
                message: `Successfully approved ${selectedIds.size} creator accounts.`
            });

            setSelectedIds(new Set());
            fetchData(); // Refresh data without reload
        } catch (error) {
            console.error("Bulk approve failed", error);
            alert("Some approvals failed. Please check the queue.");
        } finally {
            setBulkLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/20';
            case 'approved': return 'bg-green-500/20 text-green-500 border-green-500/20';
            case 'rejected': return 'bg-red-500/20 text-red-500 border-red-500/20';
            default: return 'bg-gray-500/20 text-gray-500 border-gray-500/20';
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
                    <h1 className="text-2xl font-bold text-white">Verification Queue</h1>
                    <p className="text-gray-400 text-sm mt-1">
                        {currentStatus === 'all' ? 'All' : currentStatus.replace('_', ' ')} applications 
                        {filterCategory !== 'All' ? ` in ${filterCategory}` : ''}
                    </p>

                    {selectedIds.size > 0 && (
                        <div className="mt-4 flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
                            <span className="text-sm font-medium text-white bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-700">
                                {selectedIds.size} selected
                            </span>
                            <button
                                onClick={handleBulkApprove}
                                disabled={bulkLoading}
                                className="flex items-center gap-2 px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-green-900/20 disabled:opacity-50"
                            >
                                {bulkLoading ? <Loader2 size={16} className="animate-spin" /> : <CheckSquare size={16} />}
                                Bulk Approve
                            </button>
                            <button
                                onClick={() => setSelectedIds(new Set())}
                                className="text-sm text-gray-400 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                    {/* Status Filter (Custom Dropdown) */}
                    <div className="relative">
                        <button
                            onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                            className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 text-sm text-gray-300 hover:text-white hover:border-red-600/50 flex items-center gap-2 transition-all min-w-[170px] justify-between shadow-lg"
                        >
                            <div className="flex items-center gap-2">
                                <div className={currentStatus === 'all' ? 'text-gray-500' : 'text-red-500'}>
                                    {currentStatus === 'pending' && <Clock size={16} />}
                                    {currentStatus === 'approved' && <CheckCircle2 size={16} className="text-green-500" />}
                                    {currentStatus === 'rejected' && <XCircle size={16} className="text-red-500" />}
                                    {currentStatus === 'all' && <Filter size={16} />}
                                    {currentStatus === 'info_requested' && <Inbox size={16} />}
                                </div>
                                <span className="capitalize">{currentStatus === 'all' ? 'All Status' : currentStatus.replace('_', ' ')}</span>
                            </div>
                            <MoreVertical size={14} className="text-gray-500" />
                        </button>

                        {isStatusDropdownOpen && (
                            <>
                                <div 
                                    className="fixed inset-0 z-10" 
                                    onClick={() => setIsStatusDropdownOpen(false)} 
                                />
                                <div className="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                                    <div className="p-2 border-b border-gray-800 bg-gray-950/50">
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-2">Filter Status</p>
                                    </div>
                                    <div className="p-1">
                                        {[
                                            { value: 'all', label: 'All Status', icon: <Filter size={14} /> },
                                            { value: 'pending', label: 'Pending', icon: <Clock size={14} /> },
                                            { value: 'approved', label: 'Approved', icon: <CheckCircle2 size={14} className="text-green-500" /> },
                                            { value: 'rejected', label: 'Rejected', icon: <XCircle size={14} className="text-red-500" /> },
                                            { value: 'info_requested', label: 'Info Requested', icon: <Inbox size={14} /> }
                                        ].map((opt) => (
                                            <button
                                                key={opt.value}
                                                onClick={() => {
                                                    setCurrentStatus(opt.value as any);
                                                    setSelectedIds(new Set());
                                                    setIsStatusDropdownOpen(false);
                                                }}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                                                    currentStatus === opt.value 
                                                    ? 'bg-red-600/10 text-red-500 font-bold' 
                                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    {opt.icon}
                                                    {opt.label}
                                                </div>
                                                {currentStatus === opt.value && <CheckCircle size={14} />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search names..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-gray-900 border border-gray-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-red-600/50 focus:ring-1 focus:ring-red-600/50 w-full transition-all shadow-lg"
                        />
                    </div>
                </div>
            </div>

            {/* Category Filters (Tabs - Reverted) */}
            <div className="flex overflow-x-auto pb-2 scrollbar-none gap-2 border-b border-gray-800/50">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setFilterCategory(cat)}
                        className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${filterCategory === cat
                            ? 'bg-red-600 text-white shadow-lg shadow-red-900/20'
                            : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-800 hover:cursor-pointer'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Data Table */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden shadow-xl min-h-[400px] flex flex-col">
                {items.length === 0 && !loading ? (
                    // Empty State
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                            <Inbox size={32} className="text-gray-500" />
                        </div>
                        <h3 className="text-lg font-medium text-white">No creators available for review</h3>
                        <p className="text-gray-400 mt-2 max-w-sm">
                            There are no pending verification requests at the moment. Submissions will appear here when creators apply.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-800/50 border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                                    <th className="px-6 py-4 w-12">
                                        <input
                                            type="checkbox"
                                            checked={allSelected}
                                            onChange={toggleSelectAll}
                                            disabled={!isPendingView || filteredItems.length === 0}
                                            className="rounded border-gray-600 bg-gray-700 text-red-500 focus:ring-red-500 focus:ring-offset-gray-900 w-4 h-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                    </th>
                                    <th className="px-6 py-4 font-medium">Creator</th>
                                    <th className="px-6 py-4 font-medium">Category</th>
                                    <th className="px-6 py-4 font-medium">Submitted</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {loading && (
                                    [...Array(5)].map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-6 py-4"><div className="h-4 w-4 bg-gray-800 rounded"></div></td>
                                            <td className="px-6 py-4"><div className="h-10 w-40 bg-gray-800 rounded"></div></td>
                                            <td className="px-6 py-4"><div className="h-6 w-24 bg-gray-800 rounded"></div></td>
                                            <td className="px-6 py-4"><div className="h-6 w-32 bg-gray-800 rounded"></div></td>
                                            <td className="px-6 py-4"><div className="h-6 w-20 bg-gray-800 rounded"></div></td>
                                            <td className="px-6 py-4"></td>
                                        </tr>
                                    ))
                                )}

                                {!loading && filteredItems.length > 0 && filteredItems.map((item) => {
                                    const isPending = item.status === 'pending';
                                    const isSelected = selectedIds.has(item.id);
                                    return (
                                        <tr key={item.id} className={`group transition-colors ${isSelected ? 'bg-red-500/5' : 'hover:bg-gray-800/50'}`}>
                                            <td className="px-6 py-4" onClick={(e) => { e.stopPropagation(); toggleSelect(item.slug || item.id, isPending); }}>
                                                {isPending ? (
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedIds.has(item.slug || item.id)}
                                                        onChange={() => toggleSelect(item.slug || item.id, isPending)}
                                                        className="rounded border-gray-600 bg-gray-700 text-red-500 focus:ring-red-500 focus:ring-offset-gray-900 w-4 h-4 cursor-pointer"
                                                    />
                                                ) : (
                                                    <span className="w-4 h-4 block" />
                                                )}
                                            </td>
                                            <td className="px-6 py-4 cursor-pointer" onClick={() => toggleSelect(item.id, isPending)}>
                                                {(() => {
                                                    const resolvedName = item.legal_name || item.stage_name || item.full_name || item.identity?.legalName || "Unknown Creator";
                                                    return (
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-gray-800 overflow-hidden relative border border-gray-700">
                                                                <img
                                                                    src={item.avatar_url || item.identity?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(resolvedName)}`}
                                                                    alt={resolvedName}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                            <div>
                                                                <div className="font-medium text-white">{resolvedName}</div>
                                                                <div className="text-xs text-gray-500">ID: #{item.id.substring(0, 8)}</div>
                                                            </div>
                                                        </div>
                                                    );
                                                })()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-300 bg-gray-800 px-2 py-1 rounded border border-gray-700">
                                                    {item.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                                    <Clock size={14} />
                                                    {formatDate(item.submitted_at)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                                                    {item.status === 'approved' && <CheckCircle2 size={12} />}
                                                    {item.status === 'rejected' && <XCircle size={12} />}
                                                    {item.status === 'pending' && <Clock size={12} />}
                                                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    href={`/admin/verifications/${item.slug || item.id}`}
                                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-red-900/20"
                                                >
                                                    <Eye size={16} />
                                                    Review
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}

                                {!loading && filteredItems.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                            No creators found matching "{searchTerm}" or "{filterCategory}".
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination Logic (Visual Only for now) */}
                {!loading && items.length > 0 && (
                    <div className="bg-gray-800/30 px-6 py-4 border-t border-gray-800 flex justify-between items-center text-sm text-gray-400 mt-auto">
                        <span>Showing {filteredItems.length} entries</span>
                        <div className="flex gap-2">
                            <button disabled className="px-3 py-1 rounded bg-gray-800 text-gray-600 cursor-not-allowed hover:cursor-pointer">Previous</button>
                            <button className="px-3 py-1 rounded bg-gray-800 hover:bg-gray-700 text-white transition-colors hover:cursor-pointer">Next</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
