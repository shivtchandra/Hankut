"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { publishSceneForDate } from "@/app/admin/scenes/actions";

type Cell = { day: number; iso: string } | null;

type Row = {
  id: string;
  game_date: string;
  status: string;
  difficulty?: number;
  scene?: {
    id?: string;
    scene_code?: string;
    drama?: { title_kr?: string; title_en?: string } | { title_kr?: string; title_en?: string }[];
  } | {
    id?: string;
    scene_code?: string;
    drama?: { title_kr?: string; title_en?: string } | { title_kr?: string; title_en?: string }[];
  }[];
  title?: string;
};

type Props = {
  today: string;
  monthLabel: string;
  cells: Cell[];
  rowsByDate: [string, Row][];
  publishSceneId?: string;
  publishTitle?: string;
  publishedDate?: string;
  publishedTitle?: string;
};

export function CalendarPickerView({
  today,
  monthLabel,
  cells,
  rowsByDate,
  publishSceneId,
  publishTitle,
  publishedDate,
  publishedTitle,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [selectedIso, setSelectedIso] = useState<string | null>(null);
  const [overrides, setOverrides] = useState<Record<string, Row>>({});

  const byDate = new Map(rowsByDate);

  async function handlePublishToDate(isoDate: string) {
    if (!publishSceneId) return;
    setSelectedIso(isoDate);

    startTransition(async () => {
      try {
        const res = await publishSceneForDate(publishSceneId, isoDate);
        const resolvedTitle = res.title || publishTitle || "Scene";

        setOverrides((prev) => ({
          ...prev,
          [isoDate]: {
            id: res.gameDate,
            game_date: isoDate,
            status: "published",
            scene: {
              scene_code: res.sceneCode,
              drama: { title_kr: resolvedTitle, title_en: resolvedTitle },
            },
          },
        }));

        router.refresh();
        router.push(
          `/admin/calendar?publishedDate=${res.gameDate}&publishedTitle=${encodeURIComponent(resolvedTitle)}`,
        );
      } catch (err) {
        alert("Publishing failed: " + (err instanceof Error ? err.message : "Unknown error"));
        setSelectedIso(null);
      }
    });
  }

  return (
    <>
      {/* Mode / Success Banners */}
      {publishSceneId && (
        <div
          style={{
            padding: "16px 20px",
            borderRadius: "var(--radius-lg, 12px)",
            background: "rgba(245, 158, 11, 0.12)",
            border: "1.5px solid #f59e0b",
            color: "#92400e",
            marginBottom: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <strong style={{ fontSize: 14, display: "block", color: "#b45309" }}>
              📍 Select Target Date to Publish
            </strong>
            <span style={{ fontSize: 13, marginTop: 2, display: "block", color: "#78350f" }}>
              Click any calendar day below to schedule &amp; publish{" "}
              <strong>{publishTitle ?? "your selected scene"}</strong>.
            </span>
          </div>
          <Link
            href="/admin/calendar"
            className="secondary"
            style={{ fontSize: 12, textDecoration: "none", padding: "6px 14px" }}
          >
            Cancel
          </Link>
        </div>
      )}

      {publishedDate && (
        <div
          style={{
            padding: "14px 18px",
            borderRadius: "var(--radius-lg, 12px)",
            background: "rgba(34, 197, 94, 0.12)",
            border: "1.5px solid #22c55e",
            color: "#15803d",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 600 }}>
            ✓ Successfully published &quot;{publishedTitle ?? "Scene"}&quot; for {publishedDate}!
          </span>
          <Link
            href="/admin/calendar"
            style={{ fontSize: 12, color: "#15803d", textDecoration: "underline" }}
          >
            Dismiss
          </Link>
        </div>
      )}

      {/* Header Title */}
      <div className="admin-title">
        <div>
          <div className="eyebrow">PUBLISH ENGINE</div>
          <h1>Schedule Calendar</h1>
          <p className="muted">{monthLabel} — click any date to manage or schedule puzzles</p>
        </div>
        <Link href="/admin/daily" className="primary">
          + New Puzzle Set
        </Link>
      </div>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          gap: 16,
          marginBottom: 20,
          fontSize: 12,
          fontFamily: "'DM Mono', monospace",
          alignItems: "center",
        }}
      >
        <span style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: "#22c55e", display: "inline-block" }} />{" "}
          published
        </span>
        <span style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: "#3b82f6", display: "inline-block" }} />{" "}
          scheduled
        </span>
        <span style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: "#f59e0b", display: "inline-block" }} />{" "}
          draft
        </span>
        <span style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: "var(--line)", display: "inline-block" }} />{" "}
          empty
        </span>
      </div>

      {/* Grid Headers */}
      <div
        className="calendar-grid"
        style={{ marginBottom: 10, color: "var(--muted)", fontSize: 11, fontFamily: "'DM Mono', monospace" }}
      >
        {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((d) => (
          <div key={d} style={{ padding: "4px 10px", textAlign: "center", letterSpacing: "0.06em" }}>
            {d}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid">
        {cells.map((cell, index) => {
          if (!cell) return <div key={`pad-${index}`} style={{ minHeight: 80 }} />;
          const row = overrides[cell.iso] ?? byDate.get(cell.iso);
          const scene = Array.isArray(row?.scene) ? row?.scene[0] : row?.scene;
          const drama = Array.isArray(scene?.drama) ? scene?.drama[0] : scene?.drama;
          const isPast = cell.iso < today;
          const isToday = cell.iso === today;
          const isSelected = selectedIso === cell.iso;

          const statusColor =
            row?.status === "published"
              ? "#22c55e"
              : row?.status === "scheduled"
              ? "#3b82f6"
              : row?.status === "draft"
              ? "#f59e0b"
              : undefined;

          const displayTitle =
            drama?.title_kr ?? drama?.title_en ?? scene?.scene_code ?? row?.title ?? "Daily Game";

          // If in publish mode, clicking date publishes scene for this date
          if (publishSceneId) {
            return (
              <button
                key={cell.iso}
                type="button"
                onClick={() => handlePublishToDate(cell.iso)}
                disabled={pending}
                className={isToday ? "calendar-cell today" : "calendar-cell"}
                style={{
                  textAlign: "left",
                  background: isSelected ? "var(--paper-soft)" : "transparent",
                  border: isSelected ? "2px solid #f59e0b" : undefined,
                  cursor: pending ? "wait" : "pointer",
                  color: "inherit",
                  display: "block",
                  position: "relative",
                  opacity: isPast ? 0.75 : 1,
                  padding: 12,
                  width: "100%",
                }}
              >
                {statusColor && (
                  <span
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: statusColor,
                    }}
                  />
                )}
                <div
                  className="day"
                  style={{
                    fontSize: 13,
                    fontWeight: isToday ? 700 : 400,
                    color: isToday ? "var(--accent)" : "var(--ink)",
                  }}
                >
                  {cell.day}
                  {isToday && (
                    <span
                      style={{
                        marginLeft: 4,
                        fontSize: 10,
                        fontFamily: "'DM Mono', monospace",
                        color: "var(--accent)",
                      }}
                    >
                      TODAY
                    </span>
                  )}
                </div>

                <div
                  style={{
                    marginTop: 6,
                    padding: "4px 8px",
                    borderRadius: 4,
                    background: "#fef3c7",
                    border: "1px dashed #f59e0b",
                    fontSize: 11,
                    color: "#92400e",
                    fontWeight: 600,
                    textAlign: "center",
                  }}
                >
                  {isSelected ? "Publishing…" : "Publish Here →"}
                </div>

                {row && (
                  <div style={{ marginTop: 4, opacity: 0.7 }}>
                    <span
                      style={{
                        display: "block",
                        fontSize: 10,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        color: "var(--muted)",
                      }}
                    >
                      (Replaces {displayTitle})
                    </span>
                  </div>
                )}
              </button>
            );
          }

          // Normal Navigation Mode
          return (
            <Link
              key={cell.iso}
              href={`/admin/daily?date=${cell.iso}`}
              className={isToday ? "calendar-cell today" : "calendar-cell"}
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "block",
                position: "relative",
                opacity: isPast ? 0.65 : 1,
              }}
            >
              {statusColor && (
                <span
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: statusColor,
                  }}
                />
              )}
              <div
                className="day"
                style={{
                  fontSize: 13,
                  fontWeight: isToday ? 700 : 400,
                  color: isToday ? "var(--accent)" : "var(--ink)",
                }}
              >
                {cell.day}
                {isToday && (
                  <span
                    style={{
                      marginLeft: 4,
                      fontSize: 10,
                      fontFamily: "'DM Mono', monospace",
                      color: "var(--accent)",
                    }}
                  >
                    TODAY
                  </span>
                )}
              </div>
              {row ? (
                <div style={{ marginTop: 4 }}>
                  <strong
                    style={{
                      display: "block",
                      fontSize: 11,
                      lineHeight: 1.3,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {displayTitle}
                  </strong>
                  <span className="tag" style={{ marginTop: 4, display: "inline-block", fontSize: 10 }}>
                    {row.status}
                  </span>
                </div>
              ) : (
                <span style={{ fontSize: 11, color: "var(--muted)", marginTop: 6, display: "block" }}>
                  + Schedule
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </>
  );
}
