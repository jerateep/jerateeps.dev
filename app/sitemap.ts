import type { MetadataRoute } from "next";
import { locales } from "@/content/profile";

const SITE = "https://jerateeps-dev.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.map((lang) => ({
    url: `${SITE}/${lang}`,
    lastModified: new Date(),
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, `${SITE}/${l}`])),
    },
  }));
}
