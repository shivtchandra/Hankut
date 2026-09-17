import { Suspense } from "react";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin-auth";
import { TodaysFiveBuilder } from "@/components/admin/TodaysFiveBuilder";
import { seoulToday } from "@/lib/game/dates";

async function Builder() {
  await requireAdmin();
  const db = await createSupabaseAdmin();
  const { data: dramas } = await db
    .from("dramas")
    .select("id, title_en, title_kr")
    .order("title_en");
  return <TodaysFiveBuilder dramas={dramas ?? []} today={seoulToday()} />;
}

export default function DailyPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, color: "var(--muted)" }}>Loading…</div>}>
      <Builder />
    </Suspense>
  );
}
