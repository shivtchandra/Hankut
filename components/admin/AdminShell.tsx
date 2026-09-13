import Link from "next/link";

const NAV = [
  {
    label: "STUDIO",
    items: [{ href: "/admin", title: "대시보드" }],
  },
  {
    label: "CONTENT",
    items: [
      { href: "/admin/entities", title: "엔티티 관리에 (Entities)" },
      { href: "/admin/dramas", title: "드라마 (Dramas)" },
      { href: "/admin/movies", title: "영화 (Movies)" },
      { href: "/admin/music", title: "음악/OST (Music)" },
      { href: "/admin/people", title: "인물/배우 (People)" },
    ],
  },
  {
    label: "PUZZLES",
    items: [
      { href: "/admin/scenes", title: "장면 스튜디오 (Scene)" },
      { href: "/admin/audio", title: "오디오 스튜디오 (Audio)" },
      { href: "/admin/chosung", title: "초성 스튜디오 (Chosung)" },
      { href: "/admin/connections", title: "연결고리 (Connections)" },
    ],
  },
  {
    label: "PUBLISH",
    items: [
      { href: "/admin/daily", title: "오늘의 5 빌더" },
      { href: "/admin/calendar", title: "발행 달력 (Calendar)" },
    ],
  },
  {
    label: "QUALITY & MEDIA",
    items: [
      { href: "/admin/assets", title: "미디어 라이브러리" },
      { href: "/admin/content-health", title: "콘텐츠 헬스 체크" },
    ],
  },
  {
    label: "INSIGHT",
    items: [{ href: "/admin/analytics", title: "통계 및 리텐션" }],
  },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="admin-mark">스튜디오</span>
          <div>
            <strong>그 장면 뭐였지?</strong>
            <span>Content Studio</span>
          </div>
        </div>

        <nav className="admin-nav">
          {NAV.map((group) => (
            <div key={group.label}>
              <small>{group.label}</small>
              {group.items.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.title}
                </Link>
              ))}
            </div>
          ))}
          <div>
            <small>SYSTEM</small>
            <Link href="/">게임 사이트 열기 ↗</Link>
          </div>
        </nav>
      </aside>

      <main className="admin-main">{children}</main>
    </div>
  );
}
