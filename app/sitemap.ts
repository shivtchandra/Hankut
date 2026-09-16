import { MetadataRoute } from "next";
import { DEMO_DRAMAS } from "@/lib/demo-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dramacut.com";

  // Static routes
  const routes = ["", "/archive", "/dramas", "/leaderboard"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === "" ? ("daily" as const) : ("weekly" as const),
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Drama detail dynamic routes
  const dramaRoutes = DEMO_DRAMAS.map((drama) => ({
    url: `${baseUrl}/dramas/${drama.id}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...routes, ...dramaRoutes];
}
