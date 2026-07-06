import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { createHash } from 'crypto';

function stringToUuid(str: string) {
    const hash = createHash('sha256').update(str).digest('hex');
    return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-4${hash.slice(13, 16)}-${((parseInt(hash.slice(16, 17), 16) & 0x3) | 0x8).toString(16)}${hash.slice(17, 20)}-${hash.slice(20, 32)}`;
}

export async function GET(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        const visitorId = req.headers.get("x-visitor-id");

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 1. Fetch user basic info
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('username, profile_image_url, cover_image_url, bio, social_links, verification_status')
            .eq('id', user.id)
            .single();

        if (userError && userError.code !== 'PGRST116') {
            console.error('Error fetching user:', userError);
        }

        // 2. Fetch verification status
        let { data: submission, error: subError } = await supabase
            .from('verification_submissions')
            .select('status, category, admin_notes, form_data')
            .eq('creator_id', user.id)
            .maybeSingle();

        // 3. ANONYMOUS LINKAGE: If no submission for user.id, check if visitorId has one
        if (!submission && visitorId) {
            const anonId = stringToUuid(`anon-${visitorId}`);
            console.log(`🔍 Checking for anonymous submission: ${anonId}`);
            
            const { data: anonSubmission } = await supabase
                .from('verification_submissions')
                .select('*')
                .eq('creator_id', anonId)
                .maybeSingle();
            
            if (anonSubmission) {
                console.log(`🔗 Linking anonymous submission ${anonId} to user ${user.id}`);
                // Link it to the real user
                await supabase
                    .from('verification_submissions')
                    .update({ creator_id: user.id })
                    .eq('creator_id', anonId);
                
                submission = anonSubmission;
            }
        }

        return NextResponse.json({
            displayName: userData?.username || user.email?.split('@')[0],
            bio: userData?.bio || '',
            profileImage: userData?.profile_image_url || '',
            bannerImage: userData?.cover_image_url || '',
            socialLinks: userData?.social_links || [],
            category: submission?.category || '',
            emailVerified: userData?.verification_status === 'approved',
            verificationStatus: submission?.status || 'none', // pending, approved, rejected, none
            rejectionFeedback: submission?.admin_notes || '',
            formData: submission?.form_data || {},
        });

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { displayName, bio, profileImage, bannerImage, socialLinks } = body;

        const { error } = await supabase
            .from('users')
            .update({
                username: displayName,
                bio,
                profile_image_url: profileImage,
                cover_image_url: bannerImage,
                social_links: socialLinks
            })
            .eq('id', user.id);

        if (error) {
            console.error('Update profile error:', error);
            // If social_links doesn't exist, we might get an error. 
            // In a real app we'd need a migration.
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ message: "Profile updated successfully" });

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
