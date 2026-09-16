"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { IconCalendar, IconScene, IconSearch } from "@/components/icons/Icons";

export function SiteNav() {
  const path = usePathname();
  const { locale } = useLocale();

  const navItems = [
    { href: "/", label: locale === "ko" ? "오늘의 게임" : "Today", icon: IconScene },
    { href: "/dramas", label: locale === "ko" ? "드라마 탐색" : "Browse", icon: IconSearch },
    { href: "/archive", label: locale === "ko" ? "지난 장면" : "Archive", icon: IconCalendar },
  ];

  return (
    <>
      <header className="site-header">
        <div className="site-header-inner">
          <Link href="/" className="brand">
            <span className="brand-mark">컷</span>
            <span className="brand-name">
              <span className="brand-kr">Dramacut</span>
              <span className="brand-en">Korean Culture Daily</span>
            </span>
          </Link>

          <nav className="topnav">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={path === item.href ? "active" : ""}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <nav className="site-bottom-nav" aria-label="Mobile navigation">
        <div className="site-bottom-nav-inner">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = path === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`bottom-nav-item ${isActive ? "active" : ""}`}
              >
                <span className="bottom-nav-icon">
                  <Icon size={20} />
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
