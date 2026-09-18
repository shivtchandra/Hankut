"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getDeviceId } from "@/lib/game/device";

type Puzzle = { id: string; date: string };
type HistoryRow = { game_date: string; solved: boolean; score: number };

export function ArchiveGrid({ puzzles }: { puzzles: Puzzle[] }) {
  const [history, setHistory] = useState<Record<string, HistoryRow>>({});

  useEffect(() => {
    const deviceId = getDeviceId();
    if (!deviceId) return;
    fetch(`/api/game/history?device_id=${deviceId}`)
      .then((r) => r.json())
      .then((rows: HistoryRow[]) => {
        const map: Record<string, HistoryRow> = {};
        for (const row of rows) map[row.game_date] = row;
        setHistory(map);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="archive-grid">
      {puzzles.map((item) => {
        const d = new Date(`${item.date}T12:00:00+09:00`);
        const label = new Intl.DateTimeFormat("en-GB", {
          weekday: "short", day: "numeric", month: "short", year: "numeric",
          timeZone: "Asia/Seoul",
        }).format(d).toUpperCase();

        const played = history[item.date];

        return (
          <Link key={item.id} href={`/?date=${item.date}`} className="archive-card">
            <div className="archive-card-header">
              <span className="archive-category">Scene</span>
              <span className="archive-date">{label}</span>
            </div>
            {played ? (
              <p className={`archive-played-badge ${played.solved ? "solved" : "failed"}`}>
                {played.solved ? `✓ Solved · ${played.score} pts` : "✗ Not solved"}
              </p>
            ) : (
              <p className="archive-card-hint">Tap to play — answer hidden</p>
            )}
          </Link>
        );
      })}
    </div>
  );
}
