import { Suspense } from "react";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin-auth";
import { TodaysFiveBuilder } from "@/components/admin/TodaysFiveBuilder";
import { seoulToday } from "@/lib/game/dates";
import { fetchAllRows } from "@/lib/supabase/fetch-all";

async function Builder() {
  await requireAdmin();
  const db = await createSupabaseAdmin();
  const dramas = await fetchAllRows((from, to) =>
    db
      .from("dramas")
      .select("id, title_en, title_kr, aliases")
      .neq("status", "archived")
      .order("title_en")
      .order("id")
      .range(from, to),
  );
  return <TodaysFiveBuilder dramas={dramas} today={seoulToday()} />;
}

export default function DailyPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, color: "var(--muted)" }}>Loading…</div>}>
      <Builder />
    </Suspense>
  );
}
