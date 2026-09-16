import { cache } from "react";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";

export type AdminRole = "owner" | "admin" | "editor" | "reviewer" | "analytics";

const ENV_ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

async function getAdminRoleForUser(
  userId: string,
  email: string | undefined,
  supabase: Awaited<ReturnType<typeof createSupabaseServer>>,
): Promise<AdminRole | null> {
  // Primary: check admin_users table
  const { data: adminRow } = await supabase
    .from("admin_users")
    .select("role, status")
    .eq("auth_user_id", userId)
    .maybeSingle();

  if (adminRow && adminRow.status === "active") {
    return adminRow.role as AdminRole;
  }

  // Bootstrap fallback: env email allowlist grants editor role
  if (email && ENV_ADMIN_EMAILS.includes(email.toLowerCase())) {
    return "editor";
  }

  return null;
}

export const requireAdmin = cache(async () => {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const role = await getAdminRoleForUser(user.id, user.email, supabase);
  if (!role) {
    redirect("/");
  }

  return { user, role };
});

export async function requireAdminApi() {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false as const, user: null, role: null };
  }

  const role = await getAdminRoleForUser(user.id, user.email, supabase);
  if (!role) {
    return { ok: false as const, user: null, role: null };
  }

  return { ok: true as const, user, role };
}

export async function getAdminRole(): Promise<AdminRole | null> {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  return getAdminRoleForUser(user.id, user.email, supabase);
}
