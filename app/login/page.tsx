"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase/client";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setMsg("");
    setLoading(true);

    const supabase = createSupabaseBrowser();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (error) {
      setMsg(error.message);
      return;
    }

    if (!data.session) {
      setMsg("Could not create a session. Check Supabase Auth settings.");
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <main className="login-page">
      <div className="login-card">
        <p className="login-eyebrow">Studio access</p>
        <h1 className="login-title">Content Studio</h1>
        <p className="login-copy">
          Sign in with email and password. Your email must be in{" "}
          <code>ADMIN_EMAILS</code>.
        </p>

        <form className="login-form" onSubmit={onSubmit}>
          <label className="login-field">
            <span>Email</span>
            <input
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
            />
          </label>

          <label className="login-field">
            <span>Password</span>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </label>

          <button className="primary-btn login-submit" type="submit" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        {msg ? <p className="danger login-error">{msg}</p> : null}

        <p className="login-back">
          <a href="/">← Back to site</a>
        </p>
      </div>
    </main>
  );
}
