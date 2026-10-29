import { readFile, mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { eagles } from "../data/eagles.js";

const escapeHtml = (text) => String(text).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
const template = await readFile(new URL("../eagles/index.html", import.meta.url), "utf8");
const ids = new Set();
// Validate every ID before writing anything, including accidental duplicate records.
for (const scout of eagles) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(scout.id) || ids.has(scout.id)) throw new Error(`Invalid or duplicate Eagle ID: ${scout.id}`);
  ids.add(scout.id);
}
for (const scout of eagles) {
  const directory = new URL(`../eagles/${scout.id}/`, import.meta.url);
  const html = template
    .replaceAll("../", "../../")
    .replace('<body data-site-root="../../">', `<body data-site-root="../../" data-scout-id="${escapeHtml(scout.id)}">`)
    .replace("<title>Our Eagle Scouts | Troop 1135</title>", `<title>${escapeHtml(scout.name)} | Eagle Scout | Troop 1135</title>`)
    .replace('content="Our Eagle Scouts | Troop 1135"', `content="${escapeHtml(scout.name)} | Troop 1135"`)
    .replace('content="Celebrating the leadership, service, and lasting impact of Troop 1135\'s Eagle Scouts."', `content="${escapeHtml(scout.description)}"`)
    .replace('content="The highest rank. A lifelong impact. Explore the Troop 1135 Eagle archive."', `content="${escapeHtml(scout.description)}"`)
    .replace('content="../../images/hero-mountains.jpg"', `content="../../${escapeHtml(scout.photo)}"`);
  await mkdir(directory, { recursive: true });
  await writeFile(new URL("index.html", directory), html);
  console.log(`Generated ${fileURLToPath(directory)}`);
}
console.log(`${eagles.length} Eagle profile page(s) generated. The site is ready for static hosting.`);
