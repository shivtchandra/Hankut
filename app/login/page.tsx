"use client";

import { useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase/client";

export default function AdminLogin() {
  const [msg, setMsg] = useState("");

  async function login() {
    const supabase = createSupabaseBrowser();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/admin`,
      },
    });

    if (error) setMsg(error.message);
  }

  return (
    <main className="shell">
      <div className="eyebrow">STUDIO ACCESS</div>
      <h1
        style={{
          fontSize: "clamp(48px, 10vw, 88px)",
          letterSpacing: "-0.06em",
          margin: "18px 0",
        }}
      >
        콘텐츠 스튜디오
      </h1>
      <p className="hero-copy" style={{ marginBottom: 28 }}>
        Google로 로그인한 뒤, allowlist에 등록된 계정만 /admin에 들어갑니다.
      </p>
      <button className="primary" type="button" onClick={login}>
        Google로 로그인
      </button>
      {msg && <p className="danger">{msg}</p>}
      <p style={{ marginTop: 28 }}>
        <a href="/">← 사이트로</a>
      </p>
    </main>
  );
}
