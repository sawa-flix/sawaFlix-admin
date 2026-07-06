'use client';
import React from 'react';
import VerificationQueue from '../../components/Admin/VerificationQueue';

import VerificationAnalytics from '../../components/Admin/VerificationAnalytics';

export default function AdminDashboardPage() {
    return (
        <div className="space-y-6">
            <VerificationAnalytics />
            <VerificationQueue />
        </div>
    );
}
