import { NextResponse } from "next/server";

// Dev-only stub: accepts PUT uploads when R2 is not configured
export async function PUT() {
  return new NextResponse(null, { status: 200 });
}
