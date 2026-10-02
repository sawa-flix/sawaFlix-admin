'use client';

import React from 'react';
import VerificationAnalytics from '@/components/Admin/VerificationAnalytics';
import VerificationQueue from '@/components/Admin/VerificationQueue';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <VerificationAnalytics />
      <VerificationQueue />
    </div>
  );
}
