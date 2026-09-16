export default function AdminLoading() {
  return (
    <div style={{ padding: "16px 0", opacity: 0.7 }}>
      <div className="admin-title">
        <div>
          <div
            style={{
              width: 100,
              height: 14,
              background: "var(--paper-soft)",
              borderRadius: 4,
              marginBottom: 8,
            }}
          />
          <div
            style={{
              width: 240,
              height: 28,
              background: "var(--paper-soft)",
              borderRadius: 6,
              marginBottom: 8,
            }}
          />
          <div
            style={{
              width: 320,
              height: 16,
              background: "var(--paper-soft)",
              borderRadius: 4,
            }}
          />
        </div>
      </div>

      <div
        className="admin-grid"
        style={{ marginTop: 24, marginBottom: 28, gridTemplateColumns: "repeat(4, 1fr)" }}
      >
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="metric" style={{ minHeight: 70, background: "var(--paper-soft)" }} />
        ))}
      </div>

      <div
        style={{
          width: "100%",
          height: 320,
          background: "var(--paper-soft)",
          borderRadius: "var(--radius-md)",
        }}
      />
    </div>
  );
}
