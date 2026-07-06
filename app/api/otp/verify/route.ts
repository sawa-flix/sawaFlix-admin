import { NextResponse } from "next/server";
import { redis, otpVerifyRateLimit } from "@/lib/redis";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    try {
        const { email, code } = await req.json();

        // Input validation
        if (!email || !code) {
            return NextResponse.json(
                { error: "Email and code are required" },
                { status: 400 }
            );
        }

        // Rate limiting — 10 verification attempts per hour per email (brute-force protection)
        const { success } = await otpVerifyRateLimit.limit(
            `otp_verify:${email}`
        );
        if (!success) {
            return NextResponse.json(
                { error: "Too many verification attempts. Try again in 15 minutes." },
                { status: 429 }
            );
        }

        // Lookup stored OTP
        const storedOtp = await redis.get(`otp:${email}`);
        if (!storedOtp) {
            return NextResponse.json(
                { error: "OTP expired or not found. Request a new code." },
                { status: 400 }
            );
        }

        // Compare OTP
        if (String(storedOtp).trim() !== String(code).trim()) {
            // Do NOT delete OTP on wrong attempt — let the rate limiter protect it
            return NextResponse.json(
                { error: "Invalid OTP" },
                { status: 400 }
            );
        }

        // OTP is correct — delete it so it can't be reused
        await redis.del(`otp:${email}`);

        // Fetch current user status AND role to decide what transition to make
        const { data: user, error: fetchError } = await supabaseAdmin
            .from("users")
            .select("verification_status, role")
            .eq("email", email)
            .single();
        console.log(`${user.verification_status} ${user.role}`);

        if (fetchError || !user) {
            console.error("Error fetching user:", fetchError);
            return NextResponse.json(
                { error: "User not found. Please sign up first." },
                { status: 404 }
            );
        }

        const currentStatus = user.verification_status;
        const userRole = user.role;

        // If already approved, nothing to do
        if (currentStatus === "approved") {
            return NextResponse.json({
                message: "User already verified",
                verified: true,
            });
        }

        // Step 1: If 'unverified', move to 'pending' first (required by DB state machine)
        if (currentStatus === "unverified") {
            const { error: step1Error } = await supabaseAdmin
                .from("users")
                .update({ verification_status: "pending" })
                .eq("email", email);

            if (step1Error) {
                console.error("Error transitioning to pending:", step1Error);
                return NextResponse.json(
                    { error: "Verification failed. Please try again." },
                    { status: 500 }
                );
            }
        }

        // Step 2: Role-based decision
        if (userRole === "creator") {
            console.log(
                `[OTP Verified - Pending Admin Review] Email: ${email}, Role: creator`
            );
            return NextResponse.json({
                message: "Email verified. Your creator account is pending admin approval.",
                verified: false,
                pendingReview: true,
            });
        }

        // Viewer auto-approve
        // DB trigger automatically sets is_verified = true when status = 'approved'
        const { error: step2Error } = await supabaseAdmin
            .from("users")
            .update({ verification_status: "approved" })
            .eq("email", email);

        if (step2Error) {
            console.error("Error transitioning to approved:", step2Error);
            return NextResponse.json(
                { error: "Verification failed. Please try again." },
                { status: 500 }
            );
        }

        console.log(
            `[OTP Verified] Email: ${email}, Timestamp: ${new Date().toISOString()}`
        );

        return NextResponse.json({
            message: "User verified successfully",
            verified: true,
        });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}