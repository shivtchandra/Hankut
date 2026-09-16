"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { VIEWER_TZ_COOKIE } from "@/lib/game/dates";

/**
 * Reports the device's UTC offset so the server can pick the puzzle for the
 * viewer's own calendar day. Refreshes once when the offset is new or changed
 * (first visit, travel, DST); afterwards the cookie already matches.
 */
export function ViewerClockSync() {
  const router = useRouter();

  useEffect(() => {
    const offset = String(new Date().getTimezoneOffset());
    const stored = document.cookie
      .split("; ")
      .find((entry) => entry.startsWith(`${VIEWER_TZ_COOKIE}=`))
      ?.split("=")[1];

    if (stored === offset) return;

    document.cookie = `${VIEWER_TZ_COOKIE}=${offset}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  }, [router]);

  return null;
}
