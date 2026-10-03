import { MetadataRoute } from "next";
import { fetchDramasList } from "@/lib/game/today";
import { DEMO_DRAMAS } from "@/lib/demo-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "https://hankut.shivachandra.work");

  // Static routes
  const routes = ["", "/archive", "/dramas", "/leaderboard"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === "" ? ("daily" as const) : ("weekly" as const),
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Drama detail dynamic routes
  let dramas: Array<{ id: string }> = [];
  try {
    const list = await fetchDramasList();
    dramas = list && list.length > 0 ? list : DEMO_DRAMAS;
  } catch {
    dramas = DEMO_DRAMAS;
  }

  const dramaRoutes = dramas.map((drama) => ({
    url: `${baseUrl}/dramas/${drama.id}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...routes, ...dramaRoutes];
}
