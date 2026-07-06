import { NextResponse } from "next/server";
import { redis, otpSendRateLimit, rateLimit } from "@/lib/redis";
import sgMail from "@sendgrid/mail";

// Validate SendGrid configuration
if (!process.env.SENDGRID_API_KEY) {
    throw new Error("SENDGRID_API_KEY is not configured in environment variables");
}
if (!process.env.SENDGRID_FROM_EMAIL) {
    throw new Error("SENDGRID_FROM_EMAIL is not configured in environment variables");
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        // Input validation
        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        // Rate limiting — 5 OTP sends per 15 minutes per email
        const { success } = await otpSendRateLimit.limit(`otp_send:${email}`);
        if (!success) {
            return NextResponse.json(
                { error: "Too many OTP requests. Try again in 15 minutes." },
                { status: 429 }
            );
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Store in Redis with 5-minute expiration
        await redis.set(`otp:${email}`, otp, { ex: 300 });

        // Send via SendGrid
        await sgMail.send({
            to: email,
            from: process.env.SENDGRID_FROM_EMAIL!,
            subject: "🔐 Your SawaFlix Verification Code",
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #0f0f0f; border-radius: 12px;">
          <h2 style="color: #FF6B35; margin-bottom: 8px;">Welcome to SawaFlix</h2>
          <p style="color: #ccc; font-size: 16px;">Your verification code is:</p>
          <div style="background: #1a1a1a; border-radius: 8px; padding: 24px; text-align: center; margin: 24px 0;">
            <h1 style="color: #FF6B35; font-size: 48px; letter-spacing: 10px; margin: 0; font-family: monospace;">
              ${otp}
            </h1>
          </div>
          <p style="color: #888; font-size: 14px;">This code expires in <strong>5 minutes</strong>.</p>
          <p style="color: #555; font-size: 12px; margin-top: 24px;">
            If you did not request this code, please ignore this email. Never share this code with anyone.
          </p>
        </div>
      `,
        });

        // Audit log, not exposing the otp
        console.log(
            `[OTP Sent] Email: ${email}, Timestamp: ${new Date().toISOString()}`
        );

        return NextResponse.json({
            message: "OTP sent to your email successfully",
            // Only expose OTP in development for easy testing
            ...(process.env.NODE_ENV === "development" && { debug_otp: otp }),
        });
    } catch (error) {
        console.error("Error sending OTP:", error);

        // Handle SendGrid authentication errors
        if (error instanceof Error) {
            if (error.message.includes("401") || error.message.includes("Unauthorized")) {
                console.error("SendGrid authentication failed. Check SENDGRID_API_KEY in environment variables.");
                return NextResponse.json(
                    { error: "Email service configuration error. Please contact support." },
                    { status: 500 }
                );
            }
            if (error.message.includes("Invalid email")) {
                return NextResponse.json(
                    { error: "Invalid email address" },
                    { status: 400 }
                );
            }
        }

        return NextResponse.json(
            { error: "Failed to send OTP. Please try again." },
            { status: 500 }
        );
    }
}