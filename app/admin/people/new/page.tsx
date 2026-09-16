import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { createPuzzle } from "@/app/admin/puzzles/actions";

async function handleCreate(formData: FormData) {
  "use server";
  const title = formData.get("title") as string;
  const result = await createPuzzle({ type: "people", title, difficulty: 5 });
  if ("id" in result) {
    redirect(`/admin/people/${result.id}`);
  }
}

export default async function NewPeoplePuzzlePage() {
  await requireAdmin();

  return (
    <div className="admin-page">
      <div className="admin-title">
        <div>
          <span className="eyebrow">PEOPLE STUDIO</span>
          <h1>New People Puzzle</h1>
        </div>
        <a href="/admin/people" className="secondary">
          ← Back
        </a>
      </div>

      <div
        style={{
          background: "var(--paper)",
          padding: "24px",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border)",
          marginTop: "20px",
          maxWidth: "480px",
        }}
      >
        <form action={handleCreate}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>
            Puzzle title (person name)
          </label>
          <input
            name="title"
            type="text"
            placeholder="e.g. IU silhouette quiz"
            required
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border)",
              background: "var(--paper-soft)",
              color: "var(--ink)",
              fontSize: "14px",
              boxSizing: "border-box",
              marginBottom: "16px",
            }}
          />
          <button type="submit" className="primary" style={{ width: "100%" }}>
            Create &amp; edit puzzle
          </button>
        </form>
      </div>
    </div>
  );
}
