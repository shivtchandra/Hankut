import Link from "next/link";

export default function AssetsPage() {
  return (
    <>
      <div className="admin-title">
        <div>
          <div className="eyebrow">CONTENT</div>
          <h1>Assets</h1>
          <p className="muted">
            Frames are uploaded inside Scene Studio via R2 presigned PUT.
          </p>
        </div>
        <Link className="primary" href="/admin/scenes">
          Open scenes
        </Link>
      </div>
      <div className="upload-zone">
        Asset library browsing comes next. For now, attach frames on a scene
        detail page so position uniqueness stays enforced.
      </div>
    </>
  );
}
