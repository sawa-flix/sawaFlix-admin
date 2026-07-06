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
    CheckSquare
} from 'lucide-react';
import { useAdminNotifications } from '../../contexts/AdminNotificationContext';

const LIVEURL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sawaflix-backend.onrender.com';

interface VerificationItem {
    id: string;
    full_name: string;
    category: string;
    status: "pending" | "approved" | "rejected" | "info_requested";
    submitted_at: string;
    avatar_url?: string;
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
    const [filterCategory, setFilterCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [bulkLoading, setBulkLoading] = useState(false);

    const { addNotification } = useAdminNotifications();

    const fetchData = async (isBackground = false) => {
        if (!isBackground) setLoading(true);
        try {
            const res = await fetch(`${LIVEURL}/api/admin/verifications`);
            if (res.ok) {
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
            }
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
    }, [items.length]); // Re-run effect only if items length changes to keep closure fresh

    const filteredItems = items.filter(item => {
        const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
        const matchesSearch = item.full_name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const pendingFilteredItems = filteredItems.filter(i => i.status === 'pending');
    const allSelected = pendingFilteredItems.length > 0 && pendingFilteredItems.every(i => selectedIds.has(i.id));

    const toggleSelectAll = () => {
        if (allSelected) {
            setSelectedIds(new Set());
        } else {
            const newSet = new Set(selectedIds);
            pendingFilteredItems.forEach(i => newSet.add(i.id));
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
            const promises = Array.from(selectedIds).map(id =>
                fetch(`${LIVEURL}/api/admin/verify`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ target_creator_id: id, status: 'approved', notes: 'Bulk Approved by Admin' }),
                })
            );
            await Promise.all(promises);

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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Verification Queue</h1>
                    <p className="text-gray-400 text-sm mt-1">Review pending creator applications</p>

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

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search creator..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all placeholder:text-gray-600"
                        />
                    </div>
                </div>
            </div>

            {/* Filters (Tabs) */}
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
                        {cat === 'All' ? 'All Requests' : cat}
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
                                            disabled={pendingFilteredItems.length === 0}
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
                                            <td className="px-6 py-4" onClick={(e) => { e.stopPropagation(); toggleSelect(item.id, isPending); }}>
                                                {isPending ? (
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => toggleSelect(item.id, isPending)}
                                                        className="rounded border-gray-600 bg-gray-700 text-red-500 focus:ring-red-500 focus:ring-offset-gray-900 w-4 h-4 cursor-pointer"
                                                    />
                                                ) : (
                                                    <span className="w-4 h-4 block" />
                                                )}
                                            </td>
                                            <td className="px-6 py-4 cursor-pointer" onClick={() => toggleSelect(item.id, isPending)}>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gray-800 overflow-hidden relative border border-gray-700">
                                                        <img src={item.avatar_url || `https://ui-avatars.com/api/?name=${item.full_name}`} alt={item.full_name} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-white">{item.full_name}</div>
                                                        <div className="text-xs text-gray-500">ID: #{item.id.substring(0, 8)}</div>
                                                    </div>
                                                </div>
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
                                                    href={`/admin/verifications/${item.id}`}
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
