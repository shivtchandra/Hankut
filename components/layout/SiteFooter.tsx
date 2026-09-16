import Link from "next/link";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer-full">
      <div className="site-footer-inner">
        <div className="footer-brand">
          <Link href="/" className="brand" style={{ gap: "10px" }}>
            <span className="brand-mark" style={{ width: "28px", height: "28px", fontSize: "12px" }}>컷</span>
            <span>
              <strong style={{ display: "block", fontSize: "14px", letterSpacing: "-0.02em" }}>Dramacut</strong>
              <span style={{ fontSize: "11px", color: "var(--muted)", fontFamily: "var(--font-mono, 'DM Mono', monospace)" }}>Korean Culture Daily Game</span>
            </span>
          </Link>
          <p className="footer-tagline">
            One scene, one song, one face.<br />
            <span>A new K-culture puzzle every day.</span>
          </p>
        </div>

        <div className="footer-links">
          <div className="footer-col">
            <strong>Play</strong>
            <Link href="/">Today</Link>
            <Link href="/archive">Archive</Link>
          </div>
          <div className="footer-col">
            <strong>Explore</strong>
            <Link href="/dramas">Dramas</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {year} Dramacut. All rights reserved.</span>
        <span>Made with ♡ for K-culture fans</span>
      </div>
    </footer>
  );
}
