import { redirect } from "next/navigation";

export default function NotFound() {
  // Automatically redirect any invalid or mangled shared URLs back to the main game
  redirect("/");
}
