import Link from 'next/link';
import CreatorWizard from '@/components/creator-wizard/CreatorWizard';
import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/getUserProfile"; 
import DashboardWrapper from '@/components/Dashboard/DashboardWrapper';

export const dynamic = "force-dynamic";

export const metadata = {
    title: 'Creator Verification | SawaFlix',
    description: 'Join SawaFlix as a verified creator and share your cultural story.',
};

export default async function CreatorVerifyPage() {
    const profile = await getUserProfile();
    
    // Debug logging removed, logic simplified for production
    const status = profile?.verificationStatus || 'none';

    if (!profile) {
        redirect("/login");
    }

    if (status === "pending") {
        redirect("/creator/pending");
    }

    if (status === "approved") {
        redirect("/creator-dashboard");
    }


    return (
        <DashboardWrapper>
            <CreatorWizard />
        </DashboardWrapper>
    );
}