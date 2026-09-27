import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { normalize } from "@/lib/game/normalization";

// Spotify exposes no audio we're allowed to use, so a Spotify link only gives us
// metadata (title, artist, cover). The playable audio is Apple's official 30s
// preview for the same track: its URL is stable and meant for sampling.

type PreviewCandidate = {
  trackName: string;
  artistName: string;
  previewUrl: string;
  storeUrl: string;
  artworkUrl: string | null;
};

const TIMEOUT = 8000;

function spotifyTrackId(input: string): string | null {
  const uri = input.match(/^spotify:track:([A-Za-z0-9]{22})$/);
  if (uri) return uri[1];
  try {
    const url = new URL(input);
    if (url.hostname !== "open.spotify.com") return null;
    const match = url.pathname.match(/\/track\/([A-Za-z0-9]{22})/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

function decodeEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function metaContent(html: string, key: string): string | null {
  const re = new RegExp(`<meta (?:property|name)="${key}" content="([^"]*)"`);
  const match = html.match(re);
  return match ? decodeEntities(match[1]) : null;
}

async function spotifyMetadata(trackUrl: string) {
  const res = await fetch(trackUrl, {
    headers: { "Accept-Language": "ko,en;q=0.8", "User-Agent": "Mozilla/5.0" },
    signal: AbortSignal.timeout(TIMEOUT),
  });
  if (!res.ok) throw new Error(`Spotify returned ${res.status}`);
  const html = await res.text();

  const title = metaContent(html, "og:title");
  // og:description looks like "Artist · Album · Song · 2016"
  const description = metaContent(html, "og:description") ?? "";
  const artist =
    metaContent(html, "music:musician_description") ?? description.split(" · ")[0] ?? "";
  if (!title) throw new Error("Couldn't read track info from Spotify");

  return {
    title,
    artist,
    cover: metaContent(html, "og:image"),
  };
}

async function itunesPreviews(title: string, artist: string): Promise<PreviewCandidate[]> {
  const params = new URLSearchParams({
    term: `${title} ${artist}`.trim(),
    entity: "song",
    limit: "10",
    country: "US", // Apple has no KR music store; the US store carries K-OSTs with Korean titles.
  });
  const res = await fetch(`https://itunes.apple.com/search?${params}`, {
    signal: AbortSignal.timeout(TIMEOUT),
  });
  if (!res.ok) return [];
  const json = (await res.json()) as {
    results?: {
      trackName?: string;
      artistName?: string;
      previewUrl?: string;
      trackViewUrl?: string;
      artworkUrl100?: string;
    }[];
  };

  const wantTitle = normalize(title);
  const wantArtist = normalize(artist);
  const score = (c: PreviewCandidate) => {
    const t = normalize(c.trackName);
    const a = normalize(c.artistName);
    return (
      (t === wantTitle ? 4 : t.includes(wantTitle) || wantTitle.includes(t) ? 2 : 0) +
      (a && wantArtist && (a.includes(wantArtist) || wantArtist.includes(a)) ? 2 : 0)
    );
  };

  return (json.results ?? [])
    .filter((r) => r.previewUrl && r.trackName)
    .map((r) => ({
      trackName: r.trackName!,
      artistName: r.artistName ?? "",
      previewUrl: r.previewUrl!,
      storeUrl: r.trackViewUrl ?? "",
      artworkUrl: r.artworkUrl100 ?? null,
    }))
    .sort((a, b) => score(b) - score(a))
    .slice(0, 5);
}

export async function GET(req: Request) {
  const auth = await requireAdminApi();
  if (!auth.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const input = new URL(req.url).searchParams.get("url")?.trim() ?? "";
  const id = spotifyTrackId(input);
  if (!id) {
    return NextResponse.json(
      { error: "Paste a Spotify track link (open.spotify.com/track/…)" },
      { status: 400 },
    );
  }
  const spotifyUrl = `https://open.spotify.com/track/${id}`;

  try {
    const meta = await spotifyMetadata(spotifyUrl);
    const previews = await itunesPreviews(meta.title, meta.artist);
    return NextResponse.json({ spotifyUrl, ...meta, previews });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Lookup failed" },
      { status: 502 },
    );
  }
}
