'use client';

import React, { useEffect, useState } from 'react';
import { useAdminNotifications } from '../../contexts/AdminNotificationContext';
import { CheckCircle, XCircle, Bell, UserPlus, Info, X } from 'lucide-react';

export default function AdminToast() {
  const { notifications } = useAdminNotifications();
  const [visibleQueue, setVisibleQueue] = useState<string[]>([]);

  // Monitor notifications and add to visible queue
  useEffect(() => {
    if (notifications.length > 0) {
      const latest = notifications[0];
      if (!latest.read) {
        setVisibleQueue(prev => [latest.id, ...prev].slice(0, 3));
        const timer = setTimeout(() => {
          setVisibleQueue(prev => prev.filter(id => id !== latest.id));
        }, 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [notifications]);

  if (visibleQueue.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      {visibleQueue.map(id => {
        const n = notifications.find(notif => notif.id === id);
        if (!n) return null;

        const Icon = {
          approved: CheckCircle,
          rejected: XCircle,
          new_submission: Bell,
          new_user: UserPlus,
          info: Info
        }[n.type];

        const colors = {
          approved: 'text-green-500 border-green-500/20 bg-green-900/40',
          rejected: 'text-red-500 border-red-500/20 bg-red-900/40',
          new_submission: 'text-yellow-500 border-yellow-500/20 bg-yellow-900/40',
          new_user: 'text-blue-500 border-blue-500/20 bg-blue-900/40',
          info: 'text-gray-400 border-gray-700 bg-gray-900/80'
        }[n.type];

        return (
          <div
            key={id}
            className={`flex items-start gap-4 p-4 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-300 transform animate-in slide-in-from-right-10 pointer-events-auto ${colors} w-80`}
          >
            <div className="mt-1 shrink-0">
              <Icon size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-white mb-1 line-clamp-1">{n.title}</h4>
              <p className="text-xs text-gray-300 line-clamp-2">{n.message}</p>
            </div>
            <button
              onClick={() => setVisibleQueue(prev => prev.filter(vid => vid !== id))}
              className="mt-1 opacity-50 hover:opacity-100 transition-opacity"
            >
              <X size={14} className="text-white" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
