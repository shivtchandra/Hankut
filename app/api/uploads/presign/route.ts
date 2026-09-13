import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { requireAdminApi } from "@/lib/admin-auth";
import { createR2Client, publicAssetUrl } from "@/lib/r2/client";

const ALLOWED_TYPES = [
  "image/webp",
  "image/jpeg",
  "image/png",
  "image/svg+xml",
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/ogg",
  "audio/aac",
];

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (!auth.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const contentType = String(body.contentType ?? "");
  const fileName = String(body.fileName ?? "");
  const folder = String(body.folder ?? "scenes");

  if (!ALLOWED_TYPES.includes(contentType)) {
    return NextResponse.json(
      { error: "Unsupported media type" },
      { status: 400 },
    );
  }

  if (!fileName || fileName.includes("..")) {
    return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
  }

  const objectKey = `${folder}/${crypto.randomUUID()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

  // If R2 is not configured in local dev environment, return fallback path
  if (!process.env.R2_ACCOUNT_ID || !process.env.R2_BUCKET) {
    const fallbackUrl = contentType.startsWith("audio/")
      ? "/demo/sample-audio.mp3"
      : "/demo/frame-1.svg";
    return NextResponse.json({
      uploadUrl: "/api/uploads/mock-upload",
      publicUrl: fallbackUrl,
      objectKey,
      isMock: true,
    });
  }

  try {
    const client = createR2Client();
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: objectKey,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(client, command, { expiresIn: 300 });
    const publicUrl = publicAssetUrl(objectKey) || `/api/r2/download?key=${objectKey}`;

    return NextResponse.json({
      uploadUrl,
      publicUrl,
      objectKey,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to generate presigned upload URL" },
      { status: 500 },
    );
  }
}
