import { access, readFile, mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { eagles } from "../data/eagles.js";
import { escapeHtml, validateEagles, getEagleImages, renderArchive, renderProfile, renderEagleTrail, profileDescription } from "../js/eagle-content.js";

const siteRoot = new URL("../", import.meta.url);
const template = await readFile(new URL("eagles/index.html", siteRoot), "utf8");
const canonical = template.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
const contentPattern = /<!-- EAGLE_CONTENT_START -->[\s\S]*?<!-- EAGLE_CONTENT_END -->/;
if (!canonical || !contentPattern.test(template)) throw new Error("Eagle template needs a canonical archive URL and content markers.");
const publicRoot = new URL("../", canonical);

function pageHtml({ content, title, description, path, root, bodyAttribute, type = "website", image = "images/hero-mountains.jpg" }) {
  const publicUrl = escapeHtml(new URL(path, publicRoot).href);
  const imageUrl = escapeHtml(new URL(image, publicRoot).href);
  return template
    .replaceAll("../", root)
    .replace(`<body data-site-root="${root}">`, `<body data-site-root="${root}" ${bodyAttribute}>`)
    .replace(/<title>[^<]*<\/title>/, () => `<title>${escapeHtml(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, () => `<meta name="description" content="${escapeHtml(description)}">`)
    .replace(/<meta property="og:title" content="[^"]*">/, () => `<meta property="og:title" content="${escapeHtml(title)}">`)
    .replace(/<meta property="og:description" content="[^"]*">/, () => `<meta property="og:description" content="${escapeHtml(description)}">`)
    .replace(/<meta property="og:type" content="[^"]*">/, `<meta property="og:type" content="${type}">`)
    .replace(/<meta property="og:image" content="[^"]*">/, `<meta property="og:image" content="${imageUrl}">`)
    .replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${publicUrl}">`)
    .replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${publicUrl}">`)
    .replace(contentPattern, () => `<!-- EAGLE_CONTENT_START -->\n${content}\n<!-- EAGLE_CONTENT_END -->`);
}

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
  const html = pageHtml({
    content: renderProfile(scout),
    title: `${scout.name} | Eagle Scout | Troop 1135`,
    description: profileDescription(scout),
    path: `eagles/${scout.id}/`,
    root: "../../",
    bodyAttribute: `data-scout-id="${scout.id}"`,
    type: "profile",
    image: scout.portrait || "images/hero-mountains.jpg",
  });
  await mkdir(directory, { recursive: true });
  await writeFile(new URL("index.html", directory), html);
  console.log(`Generated ${fileURLToPath(directory)}`);
}
const trailDirectory = new URL("trail-to-eagle/", siteRoot);
await mkdir(trailDirectory, { recursive: true });
await writeFile(new URL("index.html", trailDirectory), pageHtml({
  content: renderEagleTrail(),
  title: "Your Trail to Eagle | Troop 1135",
  description: "Explore the seven ranks from Scout to Eagle, with outdoor adventures, leadership, and service along the way. Start your own journey with Troop 1135.",
  path: "trail-to-eagle/",
  root: "../",
  bodyAttribute: 'data-eagle-trail="true"',
}));
console.log(`Generated ${fileURLToPath(trailDirectory)}`);
const archive = template
  .replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${escapeHtml(canonical)}">`)
  .replace(/<meta property="og:image" content="[^"]*">/, `<meta property="og:image" content="${escapeHtml(new URL("images/hero-mountains.jpg", publicRoot).href)}">`)
  .replace(contentPattern, () => `<!-- EAGLE_CONTENT_START -->\n${renderArchive(eagles)}\n<!-- EAGLE_CONTENT_END -->`);
await writeFile(new URL("eagles/index.html", siteRoot), archive);
console.log(`${eagles.length} Eagle profile page(s) generated. The site is ready for static hosting.`);
