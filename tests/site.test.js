import test from "node:test";
import assert from "node:assert/strict";
import { readFile, access, mkdtemp, mkdir, copyFile, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { promisify } from "node:util";
import { execFile } from "node:child_process";
import { troop, faqs, events } from "../data/troop.js";
import { albums } from "../data/albums.js";
import { eagles, sampleEagles } from "../data/eagles.js";

const run = promisify(execFile);
const root = new URL("../", import.meta.url);
const html = await readFile(new URL("index.html", root), "utf8");
const exists = (path) => access(new URL(path, root));

test("all primary sections, accessible landmarks, and official contact links exist", () => {
  for (const id of ["home", "about", "join", "adventures", "eagles", "parents", "contact"]) {
    assert.match(html, new RegExp(`<section[^>]*id="${id}"`));
    assert.match(html, new RegExp(`href="#${id}"`));
  }
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
  for (const page of ["index.html", "eagles/index.html"]) {
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

test("new-member invitation immediately follows the troop introduction", () => {
  const sections = [...html.matchAll(/<section\b[^>]*\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(sections, ["home", "about", "join", "adventures", "eagles", "parents", "contact"]);
});

test("joining costs FAQ includes uniform essentials and the official Scout Shop link", () => {
  const faq = faqs.find((item) => item.question === "Who can join, and what does it cost?");
  assert.match(faq.answer, /uniform shirt and a Scouts BSA handbook/);
  assert.deepEqual(faq.link, { text: "Scout Shop", url: "https://www.scoutshop.org/" });
});

test("new members can download the first-meeting flyer from the join section", async () => {
  const joinSection = html.match(/<section id="join"[\s\S]*?<\/section>/)[0];
  assert.match(joinSection, /href="\.\/documents\/troop-1135-first-meeting-flyer\.pdf" download="Troop-1135-First-Meeting-Flyer\.pdf"/);
  assert.match(joinSection, /Bring this to your first meeting\./);
  const pdf = await readFile(new URL("documents/troop-1135-first-meeting-flyer.pdf", root));
  assert.equal(pdf.toString("ascii", 0, 5), "%PDF-");
  await exists("images/first-meeting-flyer.webp");
});

test("parents section explains all four aims and retains practical family support", () => {
  const parents = html.match(/<section id="parents"[\s\S]*?<\/section>/)[0];
  for (const aim of ["Character development", "Citizenship training", "Personal fitness", "Leadership development"]) {
    assert.ok(parents.includes(aim));
  }
  assert.equal((parents.match(/<article class="aim-card reveal"/g) || []).length, 4);
  assert.equal((parents.match(/<article class="parent-card reveal">/g) || []).length, 3);
  assert.match(parents, /Who she becomes is the why\./);
  assert.match(parents, /Scouting's youth protection requirements/);
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

test("Eagle data is consent-ready, explicit about samples, and references existing photos", async () => {
  const ids = new Set();
  for (const profile of [...eagles, ...sampleEagles]) {
    assert.match(profile.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(!ids.has(profile.id));
    ids.add(profile.id);
    for (const field of ["name", "photo", "photoAlt", "project", "description", "beneficiary"]) assert.ok(profile[field], `Missing ${field}`);
    assert.ok(profile.year);
    assert.ok(Array.isArray(profile.story));
    await exists(profile.photo);
    for (const photo of profile.photos || []) {
      assert.ok(photo.alt);
      await exists(photo.src);
    }
    if (!profile.sample) await exists(`eagles/${profile.id}/index.html`);
  }
  assert.ok(sampleEagles.every((profile) => profile.sample));
});

test("public troop photos are optimized and do not contain source metadata", async () => {
  const paths = new Set(albums.flatMap((album) => [album.image, ...album.photos.map((photo) => photo.src)]));
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
  for (const profile of sampleEagles) {
    assert.ok(!paths.has(profile.photo), "Real troop photographs must not illustrate fictional Eagle profiles");
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
    for (const folder of ["scripts", "data", "eagles"]) await mkdir(join(directory, folder));
    await writeFile(join(directory, "package.json"), '{"type":"module"}');
    await copyFile(new URL("scripts/build-eagles.js", root), join(directory, "scripts", "build-eagles.js"));
    await copyFile(new URL("eagles/index.html", root), join(directory, "eagles", "index.html"));
    const sample = { ...sampleEagles[0], id: "test-eagle", name: 'Test & "Scout"', sample: false };
    await writeFile(join(directory, "data", "eagles.js"), `export const eagles = ${JSON.stringify([sample])};`);
    await run(process.execPath, [join(directory, "scripts", "build-eagles.js")]);
    const output = await readFile(join(directory, "eagles", "test-eagle", "index.html"), "utf8");
    assert.match(output, /data-site-root="\.\.\/\.\.\/" data-scout-id="test-eagle"/);
    assert.match(output, /src="\.\.\/\.\.\/js\/eagle.js"/);
    assert.match(output, /Test &amp; &quot;Scout&quot;/);
    assert.match(output, /href="\.\.\/\.\.\/css\/styles.css"/);
    assert.match(output, /og:image" content="\.\.\/\.\.\/images\/albums\/trail-days\/hiking.jpg"/);
    await writeFile(join(directory, "data", "eagles.js"), 'export const eagles = [{id: "../escape"}];');
    await assert.rejects(run(process.execPath, [join(directory, "scripts", "build-eagles.js")]), /Invalid or duplicate Eagle ID/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
