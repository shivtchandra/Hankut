export default function AdminPeoplePage() {
  return (
    <div className="admin-page">
      <div className="admin-title">
        <div>
          <span className="eyebrow">CONTENT</span>
          <h1>인물/배우 (People) 관리자</h1>
        </div>
        <button type="button" className="primary">+ 인물 추가</button>
      </div>
      <div style={{ background: "#fff", padding: "24px", borderRadius: "12px", border: "1px solid #e7e5e4", marginTop: "20px" }}>
        <p>배우, 가수, 예능인 실루엣/얼굴 인지 퀴즈 인물 관리</p>
      </div>
    </div>
  );
}
