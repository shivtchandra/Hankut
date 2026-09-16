"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { EntityRow } from "@/app/admin/entities/actions";

const STATUS_COLORS: Record<string, string> = {
  published: "#dcfce7",
  draft: "#fef9c3",
  review: "#dbeafe",
  archived: "#f1f5f9",
  rejected: "#fee2e2",
};
const STATUS_TEXT: Record<string, string> = {
  published: "#166534",
  draft: "#713f12",
  review: "#1e40af",
  archived: "#475569",
  rejected: "#991b1b",
};

export function EntityTable({
  entities,
  total,
  currentPage,
}: {
  entities: EntityRow[];
  total: number;
  currentPage: number;
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  function applyFilter() {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (typeFilter !== "all") params.set("type", typeFilter);
    params.set("page", "0");
    router.push(`/admin/entities?${params.toString()}`);
  }

  return (
    <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e7e5e4", marginTop: "20px" }}>
      <div style={{ display: "flex", gap: "12px", marginBottom: "16px", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Search entities (Korean / English title)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && applyFilter()}
          style={{ flex: 1, minWidth: "200px", padding: "8px 12px", borderRadius: "6px", border: "1px solid #ccc" }}
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #ccc" }}
        >
          <option value="all">All types</option>
          <option value="drama">Drama</option>
          <option value="movie">Movie</option>
          <option value="song">Music / OST</option>
          <option value="person">Person / Actor</option>
          <option value="place">Place</option>
          <option value="food">Food</option>
          <option value="show">Variety show</option>
          <option value="brand">Brand</option>
          <option value="meme">Meme</option>
          <option value="slang">Slang</option>
        </select>
        <button type="button" className="secondary" onClick={applyFilter}>
          Search
        </button>
      </div>

      <p style={{ fontSize: "13px", color: "#666", marginBottom: "12px" }}>
        {total} entities · page {currentPage + 1}
      </p>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Entity</th>
            <th>Type</th>
            <th>Aliases</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {entities.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: "center", padding: "40px", color: "#888" }}>
                No entities found.
              </td>
            </tr>
          ) : (
            entities.map((item) => (
              <tr key={item.id}>
                <td>
                  <strong>{item.titleKr}</strong>
                  <span style={{ display: "block", fontSize: "12px", color: "#666" }}>{item.titleEn}</span>
                </td>
                <td>
                  <span className="tag">{item.type}</span>
                </td>
                <td style={{ fontSize: "13px" }}>{item.aliases.length}</td>
                <td>
                  <span
                    className="tag"
                    style={{
                      background: STATUS_COLORS[item.status] ?? "#f1f5f9",
                      color: STATUS_TEXT[item.status] ?? "#475569",
                    }}
                  >
                    {item.status}
                  </span>
                </td>
                <td style={{ fontSize: "12px", color: "#888" }}>
                  {item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-US") : "—"}
                </td>
                <td>
                  <a
                    href={`/admin/entities/${item.id}`}
                    className="secondary"
                    style={{ padding: "4px 8px", fontSize: "12px", display: "inline-block" }}
                  >
                    Edit
                  </a>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div style={{ display: "flex", gap: "8px", marginTop: "16px", justifyContent: "flex-end" }}>
        {currentPage > 0 && (
          <a
            href={`/admin/entities?page=${currentPage - 1}`}
            className="secondary"
            style={{ padding: "6px 12px", fontSize: "13px" }}
          >
            ← Prev
          </a>
        )}
        {entities.length === 50 && (
          <a
            href={`/admin/entities?page=${currentPage + 1}`}
            className="secondary"
            style={{ padding: "6px 12px", fontSize: "13px" }}
          >
            Next →
          </a>
        )}
      </div>
    </div>
  );
}
