import Link from "next/link";
export function Brand() {
  return (
    <Link href="/" className="brand">
      <span className="brandmark">컷</span>
      <span>Dramacut</span>
    </Link>
  );
}
