export default function AdminMusicPage() {
  return (
    <div className="admin-page">
      <div className="admin-title">
        <div>
          <span className="eyebrow">CONTENT</span>
          <h1>음악/OST (Music) 관리자</h1>
        </div>
        <button type="button" className="primary">+ OST 추가</button>
      </div>
      <div style={{ background: "#fff", padding: "24px", borderRadius: "12px", border: "1px solid #e7e5e4", marginTop: "20px" }}>
        <p>OST 및 명곡 오디오 퍼즐 카탈로그 관리</p>
      </div>
    </div>
  );
}
