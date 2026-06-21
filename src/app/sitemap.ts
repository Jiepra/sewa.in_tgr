import type { MetadataRoute } from "next";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sewaintgr.vercel.app";
  const supabase = createAdminClient();

  // Fetch all active item slugs to populate dynamic page sitemap entries
  const { data: items } = await supabase
    .from("items")
    .select("slug, updated_at")
    .eq("is_active", true);

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/katalog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/syarat-ketentuan`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/booking`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];

  const dynamicPages: MetadataRoute.Sitemap = (items ?? []).map((item) => ({
    url: `${siteUrl}/katalog/${item.slug}`,
    lastModified: new Date(item.updated_at),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticPages, ...dynamicPages];
}
