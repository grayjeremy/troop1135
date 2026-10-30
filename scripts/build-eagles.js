import { access, readFile, mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { eagles } from "../data/eagles.js";
import { escapeHtml, validateEagles, getEagleImages, renderArchive, renderProfile, profileDescription } from "../js/eagle-content.js";

const siteRoot = new URL("../", import.meta.url);
const template = await readFile(new URL("eagles/index.html", siteRoot), "utf8");
const canonical = template.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
const contentPattern = /<!-- EAGLE_CONTENT_START -->[\s\S]*?<!-- EAGLE_CONTENT_END -->/;
if (!canonical || !contentPattern.test(template)) throw new Error("Eagle template needs a canonical archive URL and content markers.");
const publicRoot = new URL("../", canonical);

// Validate the full collection and its assets before writing any public pages.
validateEagles(eagles);
for (const scout of eagles) {
  for (const image of getEagleImages(scout)) {
    try {
      await access(new URL(image.src, siteRoot));
    } catch (error) {
      throw new Error(`Eagle ${scout.id}: Missing local image ${image.src}`, { cause: error });
    }
  }
}

for (const scout of eagles) {
  const directory = new URL(`eagles/${scout.id}/`, siteRoot);
  const description = escapeHtml(profileDescription(scout));
  const title = escapeHtml(`${scout.name} | Eagle Scout | Troop 1135`);
  const publicUrl = new URL(`eagles/${scout.id}/`, publicRoot).href;
  const imageUrl = new URL(scout.portrait || "images/hero-mountains.jpg", publicRoot).href;
  const html = template
    .replaceAll("../", "../../")
    .replace('<body data-site-root="../../">', `<body data-site-root="../../" data-scout-id="${scout.id}">`)
    .replace(/<title>[^<]*<\/title>/, () => `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, () => `<meta name="description" content="${description}">`)
    .replace(/<meta property="og:title" content="[^"]*">/, () => `<meta property="og:title" content="${title}">`)
    .replace(/<meta property="og:description" content="[^"]*">/, () => `<meta property="og:description" content="${description}">`)
    .replace(/<meta property="og:type" content="[^"]*">/, '<meta property="og:type" content="profile">')
    .replace(/<meta property="og:image" content="[^"]*">/, `<meta property="og:image" content="${escapeHtml(imageUrl)}">`)
    .replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${escapeHtml(publicUrl)}">`)
    .replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${escapeHtml(publicUrl)}">`)
    .replace(contentPattern, () => `<!-- EAGLE_CONTENT_START -->\n${renderProfile(scout)}\n<!-- EAGLE_CONTENT_END -->`);
  await mkdir(directory, { recursive: true });
  await writeFile(new URL("index.html", directory), html);
  console.log(`Generated ${fileURLToPath(directory)}`);
}
const archive = template
  .replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${escapeHtml(canonical)}">`)
  .replace(/<meta property="og:image" content="[^"]*">/, `<meta property="og:image" content="${escapeHtml(new URL("images/hero-mountains.jpg", publicRoot).href)}">`)
  .replace(contentPattern, () => `<!-- EAGLE_CONTENT_START -->\n${renderArchive(eagles)}\n<!-- EAGLE_CONTENT_END -->`);
await writeFile(new URL("eagles/index.html", siteRoot), archive);
console.log(`${eagles.length} Eagle profile page(s) generated. The site is ready for static hosting.`);
