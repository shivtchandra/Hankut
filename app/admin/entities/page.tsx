import { DEMO_DRAMAS } from "@/lib/demo-data";

export default function EntitiesManagerPage() {
  return (
    <div className="admin-entities-page">
      <div className="admin-title">
        <div>
          <span className="eyebrow">CONTENT GRAPH</span>
          <h1>엔티티 통합 관리자 (Entities)</h1>
          <p className="muted">드라마, 영화, 음악, 인물, 장소, 브랜드, 음식 등 전체 지식 그래프 관리</p>
        </div>
        <button type="button" className="primary">
          + 신규 엔티티 등록
        </button>
      </div>

      <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e7e5e4", marginTop: "20px" }}>
        <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
          <input
            type="text"
            placeholder="엔티티 검색 (한글/영문 제목)"
            style={{ flex: 1, padding: "8px 12px", borderRadius: "6px", border: "1px solid #ccc" }}
          />
          <select style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #ccc" }}>
            <option value="all">전체 타입</option>
            <option value="drama">드라마</option>
            <option value="movie">영화</option>
            <option value="song">음악/OST</option>
            <option value="person">인물/배우</option>
            <option value="place">장소</option>
            <option value="food">음식</option>
          </select>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>엔티티 명</th>
              <th>타입</th>
              <th>연도</th>
              <th>플랫폼 / 카테고리</th>
              <th>상태</th>
              <th>작동</th>
            </tr>
          </thead>
          <tbody>
            {DEMO_DRAMAS.map((item) => (
              <tr key={item.id}>
                <td>
                  <strong>{item.titleKr}</strong>
                  <span style={{ display: "block", fontSize: "12px", color: "#666" }}>{item.titleEn}</span>
                </td>
                <td><span className="tag">Drama</span></td>
                <td>{item.year}</td>
                <td>{item.network}</td>
                <td><span className="tag" style={{ background: "#dcfce7", color: "#166534" }}>Published</span></td>
                <td>
                  <button type="button" className="secondary" style={{ padding: "4px 8px", fontSize: "12px" }}>편집</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
