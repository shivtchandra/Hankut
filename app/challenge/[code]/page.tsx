import { redirect } from "next/navigation";

export default function ChallengePage() {
  // Direct simple game flow: any shared link takes users directly to the main game cut
  redirect("/");
}
