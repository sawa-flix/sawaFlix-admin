import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ username: string }> }) {
    try {
        const { username: rawUsername } = await params;
        const username = rawUsername.replace(/-/g, ' '); // Decode username Slug
        const supabase = await createClient();

        // 1. Fetch user profile by name-slug (this is a simple implementation)
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id, username, profile_image_url, cover_image_url, bio, social_links')
            .ilike('username', username)
            .single();

        if (userError) {
            console.error('Creator not found:', username, userError);
            return NextResponse.json({ error: "Creator not found" }, { status: 404 });
        }

        // 2. IMPORTANT: Only show public profiles if verification is 'approved'
        const { data: submission, error: subError } = await supabase
            .from('verification_submissions')
            .select('status')
            .eq('creator_id', userData.id)
            .eq('status', 'approved')
            .single();

        if (subError) {
            console.error('Verification check error:', subError);
            // In a real app we'd want to allow some public exposure maybe, 
            // but the prompt says they must be approved to render ApprovedDashboard.
            return NextResponse.json({ error: "Creator hasn't been approved yet" }, { status: 403 });
        }

        return NextResponse.json({
            displayName: userData.username,
            bio: userData.bio || '',
            profileImage: userData.profile_image_url || '',
            bannerImage: userData.cover_image_url || '',
            socialLinks: userData.social_links || [],
            createdAt: new Date().toISOString(), // Mocked
        });

    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
