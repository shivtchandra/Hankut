import { getDeviceId } from "@/lib/game/device";

const NICKNAME_KEY = "dramacut:nickname:v1";

export function getStoredNickname(): string | null {
  try {
    return localStorage.getItem(NICKNAME_KEY);
  } catch {
    return null;
  }
}

function storeNickname(name: string) {
  try {
    localStorage.setItem(NICKNAME_KEY, name);
  } catch {}
}

/** Sync local cache with server (e.g. after storage was copied or server row changed). */
export async function fetchNickname(): Promise<string | null> {
  const guestId = getDeviceId();
  if (!guestId) return null;
  try {
    const res = await fetch(`/api/player?guestId=${encodeURIComponent(guestId)}`);
    if (!res.ok) return getStoredNickname();
    const data = (await res.json()) as { nickname: string | null };
    if (data.nickname) storeNickname(data.nickname);
    return data.nickname;
  } catch {
    return getStoredNickname();
  }
}

export type SaveNicknameResult =
  | { ok: true; nickname: string }
  | { ok: false; error: "name_taken" | "invalid_name" | "network" };

export async function saveNickname(nickname: string): Promise<SaveNicknameResult> {
  const guestId = getDeviceId();
  if (!guestId) return { ok: false, error: "network" };
  try {
    const res = await fetch("/api/player", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guestId, nickname }),
    });
    const data = (await res.json()) as { nickname?: string; error?: string };
    if (res.ok && data.nickname) {
      storeNickname(data.nickname);
      return { ok: true, nickname: data.nickname };
    }
    if (data.error === "name_taken" || data.error === "invalid_name") {
      return { ok: false, error: data.error };
    }
    return { ok: false, error: "network" };
  } catch {
    return { ok: false, error: "network" };
  }
}
