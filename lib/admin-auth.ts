import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";

const ENV_ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

async function isAllowlisted(
  email: string,
  supabase: Awaited<ReturnType<typeof createSupabaseServer>>,
) {
  if (ENV_ADMIN_EMAILS.includes(email)) return true;

  const { data } = await supabase
    .from("admin_allowlist")
    .select("email")
    .eq("email", email)
    .maybeSingle();

  return Boolean(data);
}

export async function requireAdmin() {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const email = user.email?.toLowerCase();
  if (!email || !(await isAllowlisted(email, supabase))) {
    redirect("/");
  }

  return user;
}

export async function requireAdminApi() {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const email = user?.email?.toLowerCase();
  if (!user || !email || !(await isAllowlisted(email, supabase))) {
    return { ok: false as const, user: null };
  }

  return { ok: true as const, user };
}
