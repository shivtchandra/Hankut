"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  IconCalendar,
  IconScene,
  IconMusic,
  IconHangul,
  IconConnections,
  IconPeople,
  IconSearch,
  IconTrophy,
} from "@/components/icons/Icons";

const NAV = [
  {
    label: "DAILY GAME ENGINE",
    items: [
      { href: "/admin/daily", label: "Daily Builder", icon: IconCalendar },
      { href: "/admin/calendar", label: "Schedule Calendar", icon: IconCalendar },
    ],
  },
  {
    label: "PUZZLE VAULT",
    items: [
      { href: "/admin/scenes", label: "Scene Puzzles", icon: IconScene },
      { href: "/admin/audio", label: "Song Puzzles", icon: IconMusic },
      { href: "/admin/chosung", label: "Chosung Puzzles", icon: IconHangul },
      { href: "/admin/connections", label: "Connections", icon: IconConnections },
      { href: "/admin/people", label: "People Puzzles", icon: IconPeople },
    ],
  },
  {
    label: "CONTENT ARCHIVE",
    items: [
      { href: "/admin/dramas", label: "Dramas & Movies", icon: IconSearch },
      { href: "/admin/entities", label: "Entity Graph", icon: IconConnections },
      { href: "/admin/assets", label: "Media & Rights", icon: IconScene },
    ],
  },
  {
    label: "SYSTEM & INSIGHTS",
    items: [
      { href: "/admin", label: "Dashboard", icon: IconTrophy },
      { href: "/admin/analytics", label: "Analytics", icon: IconTrophy },
      { href: "/admin/audit", label: "Audit Log", icon: IconCalendar },
    ],
  },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="admin-mark">컷</span>
          <div>
            <strong>그 장면 뭐였지?</strong>
            <span>Content Studio</span>
          </div>
        </div>

        <nav className="admin-nav">
          {NAV.map((group) => (
            <div key={group.label}>
              <small>{group.label}</small>
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch={true}
                    className={isActive(item.href) ? "active" : ""}
                  >
                    <Icon size={16} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <small>SITE</small>
            <Link href="/" prefetch={false}>← Open Game Site</Link>
          </div>
        </nav>
      </aside>

      <main className="admin-main">{children}</main>
    </div>
  );
}
