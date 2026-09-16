"use client";

import { useState, useTransition } from "react";

type Asset = {
  id: string;
  asset_type: string;
  storage_key: string;
  public_url: string | null;
  mime_type: string | null;
  rights_status: string;
  source_url: string | null;
  source_name: string | null;
  rights_notes: string | null;
  created_at: string;
};

const STATUS_LABELS: Record<string, string> = {
  approved: "Approved",
  rejected: "Rejected",
  unknown: "Unknown",
  review_required: "Review required",
};

export function RightsReviewClient({ assets: initial }: { assets: Asset[] }) {
  const [assets, setAssets] = useState(initial);
  const [pending, startTransition] = useTransition();
  const [notice, setNotice] = useState("");

  async function updateStatus(id: string, rightsStatus: string) {
    startTransition(async () => {
      const res = await fetch("/api/admin/assets/rights", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, rightsStatus }),
      });
      if (!res.ok) {
        setNotice("Update failed.");
        return;
      }
      setAssets((prev) =>
        prev.filter((a) => a.id !== id || rightsStatus === "review_required"),
      );
      setNotice(`${STATUS_LABELS[rightsStatus] ?? rightsStatus} — done.`);
    });
  }

  if (assets.length === 0) {
    return (
      <div
        style={{
          background: "#fff",
          padding: "40px",
          borderRadius: "12px",
          border: "1px solid #e7e5e4",
          marginTop: "20px",
          textAlign: "center",
          color: "#666",
        }}
      >
        No assets pending review
      </div>
    );
  }

  return (
    <div style={{ marginTop: "20px" }}>
      {notice && (
        <div
          style={{
            padding: "10px 16px",
            background: "#dcfce7",
            color: "#166534",
            borderRadius: "8px",
            marginBottom: "16px",
            fontSize: "13px",
          }}
        >
          {notice}
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {assets.map((asset) => (
          <div
            key={asset.id}
            style={{
              background: "#fff",
              padding: "16px",
              borderRadius: "10px",
              border: "1px solid #e7e5e4",
              display: "flex",
              gap: "16px",
              alignItems: "flex-start",
            }}
          >
            {asset.public_url &&
              asset.mime_type?.startsWith("image") && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={asset.public_url}
                  alt=""
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: "6px",
                    flexShrink: 0,
                  }}
                />
              )}
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: "8px", marginBottom: "6px", flexWrap: "wrap" }}>
                <span className="tag">{asset.asset_type}</span>
                <span className="tag" style={{ background: "#fef9c3", color: "#713f12" }}>
                  Review required
                </span>
              </div>
              <p style={{ margin: "0 0 4px", fontSize: "13px", color: "#444" }}>
                {asset.storage_key}
              </p>
              {asset.source_name && (
                <p style={{ margin: "0 0 4px", fontSize: "12px", color: "#888" }}>
                  Source: {asset.source_name}
                  {asset.source_url && (
                    <a
                      href={asset.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ marginLeft: "6px", color: "#2563eb" }}
                    >
                      Link ↗
                    </a>
                  )}
                </p>
              )}
              {asset.rights_notes && (
                <p style={{ margin: "0 0 8px", fontSize: "12px", color: "#555" }}>
                  Notes: {asset.rights_notes}
                </p>
              )}
              <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                <button
                  type="button"
                  onClick={() => updateStatus(asset.id, "approved")}
                  disabled={pending}
                  style={{
                    padding: "4px 12px",
                    background: "#dcfce7",
                    color: "#166534",
                    border: "1px solid #bbf7d0",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => updateStatus(asset.id, "rejected")}
                  disabled={pending}
                  style={{
                    padding: "4px 12px",
                    background: "#fee2e2",
                    color: "#991b1b",
                    border: "1px solid #fecaca",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  Reject
                </button>
                <button
                  type="button"
                  onClick={() => updateStatus(asset.id, "unknown")}
                  disabled={pending}
                  style={{
                    padding: "4px 12px",
                    background: "#f1f5f9",
                    color: "#475569",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  Unknown
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
