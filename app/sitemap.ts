import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo/site";

const routes = ["", "/projects", "/services", "/process", "/team", "/blog", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
    return routes.map((route) => ({
        url: `${siteUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "weekly" : "monthly",
        priority: route === "" ? 1 : 0.8,
    }));
}
