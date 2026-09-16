import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { createMediaUploadUrl } from "@/lib/storage/media";
import type { MediaFolder } from "@/lib/storage/media";

const ALLOWED_IMAGE = ["image/webp", "image/jpeg", "image/png", "image/gif"];
const ALLOWED_AUDIO = ["audio/mpeg", "audio/mp3", "audio/ogg", "audio/aac", "audio/wav"];

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const contentType = String(body.contentType ?? "");
  const fileName = String(body.fileName ?? "file");
  const folder = String(body.folder ?? "images") as MediaFolder;

  const allowed = folder === "audio" ? ALLOWED_AUDIO : ALLOWED_IMAGE;
  if (!allowed.includes(contentType)) {
    return NextResponse.json({ error: `Unsupported type: ${contentType}` }, { status: 400 });
  }

  if (fileName.includes("..") || fileName.includes("/")) {
    return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
  }

  try {
    const result = await createMediaUploadUrl(folder, fileName);
    return NextResponse.json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Upload URL failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
