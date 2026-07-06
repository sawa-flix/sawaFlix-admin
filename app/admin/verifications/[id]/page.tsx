import React from 'react';
import VerificationDetails from '../../../../components/Admin/VerificationDetails';

export default async function VerificationDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return <VerificationDetails id={id} />;
}
