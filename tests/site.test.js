import test from "node:test";
import assert from "node:assert/strict";
import { readFile, access, readdir, mkdtemp, mkdir, copyFile, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { promisify } from "node:util";
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { troop, faqs, events } from "../data/troop.js";
import { albums } from "../data/albums.js";
import { eagles } from "../data/eagles.js";
import { validateEagles, getEagleImages, renderArchive, renderProfile, renderEagleTrail, escapeHtml } from "../js/eagle-content.js";

const run = promisify(execFile);
const root = new URL("../", import.meta.url);
const html = await readFile(new URL("index.html", root), "utf8");
const exists = (path) => access(new URL(path, root));

test("all primary sections, accessible landmarks, and official contact links exist", () => {
  for (const id of ["home", "about", "join", "adventures", "eagles", "parents"]) {
    assert.match(html, new RegExp(`<section[^>]*id="${id}"`));
    assert.match(html, new RegExp(`href="#${id}"`));
  }
  assert.match(html, /id="contact"/);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, "IDs must be unique");
  for (const [, anchor] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(anchor), `Missing anchor ${anchor}`);
  assert.match(html, /<main id="main">/);
  assert.match(html, /class="skip-link"/);
  assert.match(html, /aria-controls="site-nav" aria-expanded="false"/);
  assert.match(html, /<dialog[^>]*aria-labelledby="photo-title"/);
  assert.match(html, /<noscript>/);
  assert.equal(troop.joinUrl, "https://beascout.scouting.org/units/1f19a1ed-19cf-4598-9931-b2c8abd58762");
  for (const match of html.matchAll(/data-join-link href="([^"]+)"/g)) assert.equal(match[1], troop.joinUrl);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.ok(faqs.length >= 6);
  assert.ok(events.every((event) => /^\d{4}-\d{2}-\d{2}$/.test(event.date)));
});

test("static local paths resolve and never assume a domain-root deployment", async () => {
  for (const page of ["index.html", "eagles/index.html", "trail-to-eagle/index.html"]) {
    const source = await readFile(new URL(page, root), "utf8");
    const pageUrl = new URL(page, root);
    for (const [, path] of source.matchAll(/(?:src|href)="([^"#]+)"/g)) {
      if (/^(?:https?:|data:)/.test(path)) continue;
      assert.ok(!path.startsWith("/"), `Root-relative path: ${path}`);
      await access(new URL(path.split("#")[0], pageUrl));
    }
  }
  await exists(".nojekyll");
});

test("six sections follow the experience-to-membership recruitment journey", () => {
  const sections = [...html.matchAll(/<section\b[^>]*\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(sections, ["home", "adventures", "about", "parents", "eagles", "join"]);
  assert.match(html, /href="#join">Visit a Meeting/);
  assert.match(html, /href="#adventures">Explore Our Adventures/);
});

test("page assets and module dependencies use their page's release version to avoid stale deployments", async () => {
  for (const [page, entry, release, count] of [
    ["index.html", "js/main.js", "20261029-recruitment", 2],
    ["eagles/index.html", "js/eagle.js", "20261030-patches", 3],
    ["trail-to-eagle/index.html", "js/eagle.js", "20261030-patches", 3],
  ]) {
    const source = await readFile(new URL(page, root), "utf8");
    const assets = [...source.matchAll(/(?:src|href)="([^"]+\.(?:js|css)\?[^"]+)"/g)];
    assert.equal(assets.length, count, `Version all CSS and module entries in ${page}`);
    for (const [, asset] of assets) assert.equal(new URL(asset, root).searchParams.get("v"), release);
    const script = await readFile(new URL(entry, root), "utf8");
    for (const [, imported] of script.matchAll(/from "([^"]+)"/g)) {
      assert.equal(new URL(imported, root).searchParams.get("v"), release, `Unversioned dependency in ${entry}`);
    }
  }
});

test("practical FAQs cover eligibility, costs, visits, safety, and uniform essentials", () => {
  const faq = faqs.find((item) => item.question === "What do new Scouts need to buy?");
  assert.match(faq.answer, /Class A uniform shirt and a Scouts BSA Handbook/);
  assert.deepEqual(faq.link, { text: "Scout Shop", url: "https://www.scoutshop.org/" });
  assert.equal(faqs.length, 8);
  for (const topic of [/Who can join/, /When and where/, /visit/, /cost/, /commitment/, /youth-led/, /supervision/]) {
    assert.ok(faqs.some((item) => topic.test(item.question)));
  }
});

test("new members can download the first-meeting flyer from the join section", async () => {
  const joinSection = html.match(/<section id="join"[\s\S]*?<\/section>/)[0];
  assert.match(joinSection, /href="\.\/documents\/troop-1135-first-meeting-flyer\.pdf" download="Troop-1135-First-Meeting-Flyer\.pdf"/);
  assert.match(joinSection, /<article class="meeting-flyer" aria-labelledby="meeting-guide-title">/);
  assert.match(joinSection, /<h4 id="meeting-guide-title">Your First Meeting Adventure Guide<\/h4>/);
  assert.match(joinSection, /Meet the Scouts, discover what makes our troop special, and collect signatures from new friends\./);
  assert.match(joinSection, /class="button meeting-flyer-download"[^>]+>Download Your Guide/);
  assert.match(joinSection, /alt="First Meeting Adventure Guide preview[^"]*signatures"/);
  assert.match(joinSection, /OPTIONAL\. JUST FOR FUN\./);
  assert.match(joinSection, /Print it and bring it along — or just show up!/);
  assert.ok(joinSection.indexOf('class="meeting-flyer"') < joinSection.indexOf('id="join-troop"'));
  assert.match(joinSection, /Just show up\. We'll take it from there\./);
  assert.match(joinSection, /Complete the Electronic Youth Application/);
  assert.match(joinSection, /Scout Achievement Center/);
  assert.match(joinSection, /No purchases needed before your first visit/);
  const pdf = await readFile(new URL("documents/troop-1135-first-meeting-flyer.pdf", root));
  assert.equal(pdf.toString("ascii", 0, 5), "%PDF-");
  assert.equal(createHash("sha256").update(pdf).digest("hex"), "f1442aeebb68b62a180382cf3d3849ead70b3d1c3f0b62119bde132b36d8e8c0", "Preserve the original PDF exactly");
  await exists("images/first-meeting-flyer.webp");
});

test("parents section keeps all four aims compact and achievement preview has no sample cards", async () => {
  const parents = html.match(/<section id="parents"[\s\S]*?<\/section>/)[0];
  for (const aim of ["Character development", "Citizenship training", "Personal fitness", "Leadership development"]) {
    assert.ok(parents.includes(aim));
  }
  assert.equal((parents.match(/<article class="aim-card reveal"/g) || []).length, 4);
  assert.match(parents, /Who she becomes is the why\./);
  assert.ok(faqs.some((faq) => faq.answer.includes("youth protection requirements")));
  const achievement = html.match(/<section id="eagles"[\s\S]*?<\/section>/)[0];
  assert.match(achievement, /See how far/);
  assert.match(achievement, /href="\.\/eagles\/"/);
  assert.doesNotMatch(achievement, /eagle-grid|ILLUSTRATIVE|preview-trail-builder/);
  for (const file of ["js/main.js", "js/eagle.js"]) {
    const script = await readFile(new URL(file, root), "utf8");
    assert.doesNotMatch(script, /sampleEagles/);
  }
});

test("photo manifests have real local assets, alt text, unique IDs, and supported filters", async () => {
  const ids = new Set();
  for (const album of albums) {
    assert.ok(!ids.has(album.id), `Duplicate album ${album.id}`);
    ids.add(album.id);
    assert.ok(["trail", "camp", "water", "service"].includes(album.category));
    assert.ok(album.alt && album.title && album.description && album.label);
    assert.ok(album.photos.length);
    await exists(album.image);
    for (const photo of album.photos) {
      assert.ok(photo.alt);
      await exists(photo.src);
    }
  }
  const hero = await readFile(new URL("images/hero-mountains.jpg", root));
  assert.equal(hero[0], 0xff);
  assert.equal(hero[1], 0xd8);
  assert.ok(hero.length < 900_000, "Hero should stay under 900KB");
});

test("public Eagle records validate and reference existing images and permanent pages", async () => {
  validateEagles(eagles);
  for (const profile of eagles) {
    for (const image of getEagleImages(profile)) await exists(image.src);
    await exists(`eagles/${profile.id}/index.html`);
  }
  const source = await readFile(new URL("data/eagles.js", root), "utf8");
  assert.doesNotMatch(source, /export const sampleEagles/);
});

test("public Eagle names use only first names and last initials without obsolete profile pages", async () => {
  for (const scout of eagles) {
    assert.match(scout.name, /^[\p{L}\p{M}'-]+ \p{L}\.$/u, "Use only the first name and last initial");
    const [first, initial] = scout.name.split(" ");
    assert.equal(scout.id, `${first.toLowerCase()}-${initial[0].toLowerCase()}`, "Keep full surnames out of profile URLs");
  }
  for (const entry of await readdir(new URL("eagles/", root), { withFileTypes: true })) {
    if (entry.isDirectory()) {
      assert.ok(eagles.some((scout) => scout.id === entry.name), `Remove obsolete public profile: ${entry.name}`);
    }
  }
});

test("built Eagle archive and profiles contain the current approved records", async () => {
  const archive = await readFile(new URL("eagles/index.html", root), "utf8");
  assert.ok(archive.includes(renderArchive(eagles)), "Rebuild the archive after editing Eagle data");
  for (const scout of eagles) {
    const profile = await readFile(new URL(`eagles/${scout.id}/index.html`, root), "utf8");
    assert.ok(profile.includes(renderProfile(scout)), `Rebuild the profile for ${scout.id}`);
    assert.ok(profile.includes(`<title>${escapeHtml(scout.name)} | Eagle Scout | Troop 1135</title>`));
    assert.ok(profile.includes(`rel="canonical" href="https://grayjeremy.github.io/troop1135/eagles/${scout.id}/"`));
    for (const [, path] of profile.matchAll(/(?:src|href)="([^"#]+)"/g)) {
      if (/^(?:https?:|data:)/.test(path)) continue;
      assert.ok(!path.startsWith("/"), `Root-relative profile path: ${path}`);
      await access(new URL(path.split("#")[0], new URL(`eagles/${scout.id}/index.html`, root)));
    }
  }
});

test("the Trail to Eagle is a generated static guide, not a Scout profile", async () => {
  const guide = await readFile(new URL("trail-to-eagle/index.html", root), "utf8");
  assert.ok(guide.includes(renderEagleTrail()));
  assert.match(guide, /<body data-site-root="\.\.\/" data-eagle-trail="true">/);
  assert.match(guide, /<title>Your Trail to Eagle \| Troop 1135<\/title>/);
  assert.match(guide, /og:type" content="website"/);
  assert.match(guide, /rel="canonical" href="https:\/\/grayjeremy.github.io\/troop1135\/trail-to-eagle\/"/);
  assert.doesNotMatch(guide, /data-scout-id|honor-rank-date/);
  assert.ok(eagles.every((scout) => scout.id !== "trail-to-eagle"));
});

test("public photographs and rank patches are optimized and do not contain source metadata", async () => {
  const paths = new Set([
    ...albums.flatMap((album) => [album.image, ...album.photos.map((photo) => photo.src)]),
    ...eagles.flatMap((scout) => getEagleImages(scout).map((photo) => photo.src)),
    ...[...renderEagleTrail().matchAll(/src="\.\.\/([^"]+)"/g)].map((match) => match[1]),
  ]);
  for (const path of paths) {
    if (!path.endsWith(".webp")) continue;
    const bytes = await readFile(new URL(path, root));
    assert.ok(bytes.length < 350_000, `${path} exceeds the photo size budget`);
    assert.equal(bytes.toString("ascii", 0, 4), "RIFF");
    assert.equal(bytes.toString("ascii", 8, 12), "WEBP");
    for (let offset = 12; offset + 8 <= bytes.length;) {
      const type = bytes.toString("ascii", offset, offset + 4);
      assert.ok(!["EXIF", "XMP ", "ICCP"].includes(type), `${path} contains ${type} metadata`);
      const size = bytes.readUInt32LE(offset + 4);
      offset += 8 + size + (size % 2);
    }
  }
});

test("CSS includes responsive layouts, visible focus, and live reduced-motion support", async () => {
  const css = await readFile(new URL("css/styles.css", root), "utf8");
  assert.match(css, /:focus-visible/);
  assert.match(css, /@media\(max-width:650px\)/);
  assert.match(css, /@media\(prefers-reduced-motion:reduce\)/);
  const script = await readFile(new URL("js/main.js", root), "utf8");
  assert.match(script, /reducedMotion.addEventListener\("change"/);
  assert.match(script, /dialog.showModal\(\)/);
});

test("permanent profile generator writes nested project-safe pages and rejects unsafe IDs", async () => {
  const directory = await mkdtemp(join(tmpdir(), "troop1135-generator-"));
  try {
    for (const folder of ["scripts", "data", "eagles", "js", "images"]) await mkdir(join(directory, folder));
    await writeFile(join(directory, "package.json"), '{"type":"module"}');
    await copyFile(new URL("scripts/build-eagles.js", root), join(directory, "scripts", "build-eagles.js"));
    await copyFile(new URL("eagles/index.html", root), join(directory, "eagles", "index.html"));
    await copyFile(new URL("js/eagle-content.js", root), join(directory, "js", "eagle-content.js"));
    await copyFile(new URL("images/hero-mountains.jpg", root), join(directory, "images", "hero-mountains.jpg"));
    const sample = { id: "test-eagle", name: 'Test & "Scout" $&', eagleDate: "2025-06-15", portrait: "images/hero-mountains.jpg", portraitAlt: "Stock mountains for a temporary test, not a Scout portrait", scoutBio: 'An approved biography & "quote" $&.' };
    await writeFile(join(directory, "data", "eagles.js"), `export const eagles = ${JSON.stringify([sample])};`);
    await run(process.execPath, [join(directory, "scripts", "build-eagles.js")]);
    const output = await readFile(join(directory, "eagles", "test-eagle", "index.html"), "utf8");
    assert.match(output, /data-site-root="\.\.\/\.\.\/" data-scout-id="test-eagle"/);
    assert.match(output, /src="\.\.\/\.\.\/js\/eagle.js\?v=20261030-patches"/);
    assert.match(output, /Test &amp; &quot;Scout&quot; \$&amp;/);
    assert.match(output, /href="\.\.\/\.\.\/css\/eagles.css\?v=20261030-patches"/);
    assert.match(output, /og:image" content="https:\/\/grayjeremy.github.io\/troop1135\/images\/hero-mountains.jpg"/);
    assert.match(output, /rel="canonical" href="https:\/\/grayjeremy.github.io\/troop1135\/eagles\/test-eagle\/"/);
    assert.match(output, /An approved biography &amp; &quot;quote&quot; \$&amp;\./);
    assert.match(output, /<time datetime="2025-06-15">June 15, 2025<\/time>/);
    assert.doesNotMatch(output, /Scouting at a glance|Awards &amp; Recognition|Eagle Scout Service Project/);
    const archive = await readFile(join(directory, "eagles", "index.html"), "utf8");
    assert.match(archive, /href="\.\.\/eagles\/test-eagle\/"/);
    assert.match(archive, /class="honor-card reveal"/);
    assert.match(archive, /href="\.\.\/trail-to-eagle\/"/);
    const trail = await readFile(join(directory, "trail-to-eagle", "index.html"), "utf8");
    assert.ok(trail.includes(renderEagleTrail()));
    assert.match(trail, /data-eagle-trail="true"/);
    assert.match(trail, /rel="canonical" href="https:\/\/grayjeremy.github.io\/troop1135\/trail-to-eagle\/"/);
    assert.doesNotMatch(trail, /data-scout-id/);
    await writeFile(join(directory, "data", "eagles.js"), 'export const eagles = [{id: "../escape"}];');
    await assert.rejects(run(process.execPath, [join(directory, "scripts", "build-eagles.js")]), /Invalid or duplicate Eagle ID/);
    await writeFile(join(directory, "data", "eagles.js"), `export const eagles = ${JSON.stringify([{ ...sample, portrait: "images/missing.webp" }])};`);
    await assert.rejects(run(process.execPath, [join(directory, "scripts", "build-eagles.js")]), /Missing local image images\/missing.webp/);
    assert.equal(await readFile(join(directory, "eagles", "index.html"), "utf8"), archive, "Invalid records must not overwrite the archive");
    await writeFile(join(directory, "data", "eagles.js"), `export const eagles = ${JSON.stringify([sample, sample])};`);
    await assert.rejects(run(process.execPath, [join(directory, "scripts", "build-eagles.js")]), /Invalid or duplicate Eagle ID/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
