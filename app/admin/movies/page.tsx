export default function AdminMoviesPage() {
  return (
    <div className="admin-page">
      <div className="admin-title">
        <div>
          <span className="eyebrow">CONTENT</span>
          <h1>영화 (Movies) 관리자</h1>
        </div>
        <button type="button" className="primary">+ 영화 추가</button>
      </div>
      <div style={{ background: "#fff", padding: "24px", borderRadius: "12px", border: "1px solid #e7e5e4", marginTop: "20px" }}>
        <p>한국 영화 엔티티 및 명장면 퀴즈 후보 관리</p>
      </div>
    </div>
  );
}
