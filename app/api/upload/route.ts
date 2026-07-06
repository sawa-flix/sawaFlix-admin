import { createClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { fileTypeFromBuffer } from "file-type";
import { z } from "zod";

const UploadSchema = z.object({
  category: z.enum([
    "national_id",
    "selfie",
    "endorsement_letter",
    "content_sample",
    "id",
    "endorsements",
    "recording",
    "profile_image",
    "cover_image",
  ]),
});

export async function POST(req: Request) {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    console.warn("⚠️ SUPABASE_SERVICE_ROLE_KEY is missing. Falling back to regular user client.");
  }

  let supabase;
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
  const isServiceRole = serviceKey && token === serviceKey;

  if (token) {
    if (isServiceRole) {
      supabase = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceKey,
        { global: { headers: { Authorization: authHeader } } },
      );
    } else {
      // Fallback: Use provided user token with anon client
      supabase = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { global: { headers: { Authorization: authHeader } } },
      );
    }
  } else {
    supabase = await createClient();
  }



  try {
    let creator_id: string;

    /**
     * 2. Authentication Check
     * Priority: Service Role Key (for testing/admin) -> User Session (for users)
     */
    const isServiceRole = authHeader === `Bearer ${serviceKey}`;

    if (isServiceRole) {
      creator_id = "admin-tester";
    } else {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        creator_id = user.id;
      } else {
        const visitorId = req.headers.get("x-visitor-id");
        if (visitorId) {
          creator_id = `anonymous/${visitorId}`;
          console.log(`👤 Anonymous Upload: ${creator_id}`);
        } else {
          console.error("❌ Auth Error: No user or visitor ID found");
          return NextResponse.json(
            {
              error: "Unauthorized",
              details: "No active session or visitor ID found",
            },
            { status: 401 },
          );
        }
      }
    }


    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const categoryInput = formData.get("category");

    const validation = UploadSchema.safeParse({ category: categoryInput });

    if (!file || !validation.success) {
      console.error("❌ Validation Error:", validation.success ? "Missing file" : validation.error.message);
      return NextResponse.json(
        { error: "Invalid file or category", details: validation.success ? "File is missing" : validation.error.format() },
        { status: 400 },
      );
    }

    /**
     * 4. File Type Detection
     */
    const buffer = Buffer.from(await file.arrayBuffer());
    const type = await fileTypeFromBuffer(buffer);

    // Determine MIME type and extension, with fallback to file name
    let mimeType = type?.mime || file.type || "application/octet-stream";
    let ext = type?.ext || file.name.split('.').pop() || "bin";

    // If file-type couldn't detect it, use the file extension mapping
    if (!type) {
      const extMap: Record<string, string> = {
        mp4: "video/mp4", mp3: "audio/mpeg", wav: "audio/wav", ogg: "audio/ogg",
        webm: "video/webm", m4a: "audio/mp4", aac: "audio/aac", flac: "audio/flac",
        avi: "video/x-msvideo", mov: "video/quicktime", mkv: "video/x-matroska",
        jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", gif: "image/gif",
        pdf: "application/pdf", doc: "application/msword",
      };
      ext = file.name.split('.').pop()?.toLowerCase() || "bin";
      mimeType = extMap[ext] || file.type || "application/octet-stream";
    }

    const storageClient = serviceKey
      ? createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey)
      : supabase;

    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    const filePath = `${creator_id}/${validation.data.category}/${fileName}`;

    // Choose bucket based on category — recordings/content go to content-uploads
    const isMediaUpload = validation.data.category === "recording" || validation.data.category === "content_sample";
    let usedBucket = "verification-docs";

    console.log(`📤 Uploading: ${filePath} (${mimeType}) using ${serviceKey ? 'Admin' : 'User'} Client`);

    // For media uploads, first try content-uploads bucket, fall back to verification-docs
    let uploadResult;
    if (isMediaUpload) {
      // Try content-uploads first
      uploadResult = await storageClient.storage
        .from("content-uploads")
        .upload(filePath, buffer, { contentType: mimeType });
      
      if (!uploadResult.error) {
        usedBucket = "content-uploads";
      } else {
        console.log(`⚠️ content-uploads bucket failed: ${uploadResult.error.message}. Trying verification-docs with generic type...`);
        // Fall back to verification-docs with application/octet-stream to bypass MIME restrictions
        uploadResult = await storageClient.storage
          .from("verification-docs")
          .upload(filePath, buffer, { contentType: "application/octet-stream" });
        usedBucket = "verification-docs";
      }
    } else {
      uploadResult = await storageClient.storage
        .from("verification-docs")
        .upload(filePath, buffer, { contentType: mimeType });
    }
    
    const { data, error: uploadError } = uploadResult;

    if (uploadError) {
      console.error("❌ Storage Upload Error:", uploadError.message);

      // Provide a friendlier explanation for RLS violations without the service key
      if (uploadError.message.includes("row-level security") && !serviceKey) {
        return NextResponse.json(
          {
            error: "Configuration Error",
            details: "Anonymous uploads require SUPABASE_SERVICE_ROLE_KEY to be set in the backend environment. Please add it to your .env file."
          },
          { status: 500 }
        );
      }

      throw uploadError;
    }

    // Get Public URL from the bucket that was actually used
    const { data: { publicUrl } } = storageClient.storage
      .from(usedBucket)
      .getPublicUrl(filePath);


    console.log("✅ Upload Success:", publicUrl);

    return NextResponse.json({
      message: "Success!",
      url: publicUrl,
      file_path: data.path,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("❌ Critical Error:", errorMessage);
    return NextResponse.json(
      { error: "Internal Server Error", details: errorMessage },
      { status: 500 },
    );
  }
}

