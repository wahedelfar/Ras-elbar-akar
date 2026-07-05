import * as db from "./db";

export async function generateSitemap(): Promise<string> {
  const baseUrl = "https://raselbarrealtor-6ucdba76.manus.space";
  
  // Get all active properties
  const properties = await db.getActiveProperties();
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

  // Add static pages
  const staticPages = [
    { url: "/", priority: "1.0", changefreq: "daily" },
    { url: "/properties", priority: "0.9", changefreq: "daily" },
    { url: "/add-property", priority: "0.8", changefreq: "weekly" },
  ];

  for (const page of staticPages) {
    sitemap += `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
  }

  // Add property pages
  for (const property of properties) {
    const propertyUrl = `${baseUrl}/property/${property.id}`;
    const lastmod = new Date(property.updatedAt).toISOString();
    
    sitemap += `  <url>
    <loc>${propertyUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
`;

    // Add images if available
    const images = await db.getPropertyImages(property.id);
    for (const image of images) {
      sitemap += `    <image:image>
      <image:loc>${image.imageUrl}</image:loc>
      <image:title>${property.title}</image:title>
    </image:image>
`;
    }

    sitemap += `  </url>
`;
  }

  sitemap += `</urlset>`;
  
  return sitemap;
}
