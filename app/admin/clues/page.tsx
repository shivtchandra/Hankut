import Link from "next/link";

export default function CluesPage() {
  return (
    <>
      <div className="admin-title">
        <div>
          <div className="eyebrow">CONTENT</div>
          <h1>Clues</h1>
          <p className="muted">
            Clues are edited in the Scene Studio clue ladder.
          </p>
        </div>
        <Link className="primary" href="/admin/scenes">
          Open scenes
        </Link>
      </div>
    </>
  );
}
