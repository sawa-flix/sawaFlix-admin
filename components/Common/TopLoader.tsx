'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function TopLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  // Reset/complete loader whenever pathname or search parameters change
  useEffect(() => {
    if (visible) {
      setProgress(100);
      const timer = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    // Global event listeners for manual triggering (e.g. during content fetching)
    const handleStart = () => {
      setVisible(true);
      setProgress(25);
      setTimeout(() => setProgress(prev => (prev < 65 ? 65 : prev)), 100);
      setTimeout(() => setProgress(prev => (prev < 85 ? 85 : prev)), 250);
    };

    const handleStop = () => {
      setProgress(100);
      setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 300);
    };

    window.addEventListener('toploader:start', handleStart);
    window.addEventListener('toploader:stop', handleStop);

    // Global link click handler for instant feedback before navigation starts
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a');
      if (!target) return;
      const href = target.getAttribute('href');
      const targetAttr = target.getAttribute('target');

      // Only handle internal links without new tab or download
      if (
        href &&
        href.startsWith('/') &&
        !href.startsWith('//') &&
        targetAttr !== '_blank' &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey &&
        !e.altKey
      ) {
        if (href !== pathname) {
          handleStart();
        }
      }
    };

    document.addEventListener('click', handleClick, { capture: true });

    return () => {
      window.removeEventListener('toploader:start', handleStart);
      window.removeEventListener('toploader:stop', handleStop);
      document.removeEventListener('click', handleClick, { capture: true });
    };
  }, [pathname]);

  if (!visible && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[99999] pointer-events-none transition-opacity duration-200"
      style={{ opacity: visible || progress > 0 ? 1 : 0 }}
      aria-hidden="true"
    >
      <div
        className="h-[3px] bg-gradient-to-r from-red-600 via-red-500 to-rose-400 transition-all duration-300 ease-out shadow-[0_0_12px_rgba(239,68,68,0.8)]"
        style={{
          width: `${progress}%`,
        }}
      />
      {/* Glowing tip */}
      <div
        className="absolute top-0 right-0 h-[3px] w-24 bg-gradient-to-r from-transparent to-white/90 blur-[1px]"
        style={{
          transform: `translateX(${progress - 100}%)`,
          display: progress > 0 && progress < 100 ? 'block' : 'none',
        }}
      />
    </div>
  );
}
