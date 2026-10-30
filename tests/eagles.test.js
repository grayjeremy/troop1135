import test from "node:test";
import assert from "node:assert/strict";
import { validateEagles, sortEagles, renderArchive, renderEagleCard, renderProfile, profileDescription } from "../js/eagle-content.js";

// Rendering fixtures only. These records are never added to public data or generated public pages.
const minimal = { id: "render-fixture", name: "Rendering fixture", eagleDate: "2025-06-15" };
const full = {
  ...minimal,
  portrait: "images/hero-mountains.jpg",
  portraitAlt: "Stock mountains for a rendering test, not a Scout portrait",
  troopNumber: "1452",
  scoutBio: "Approved biography fixture.",
  meritBadgeCount: 37,
  meritBadgeCountAsOf: "2025-07-01",
  eaglePalms: "One Bronze Palm",
  eaglePalmsAsOf: "2025-07-02",
  yearsInScouting: 6.5,
  yearsInScoutingAsOf: "2025-07-03",
  leadershipPositions: ["Senior Patrol Leader", "Instructor"],
  scoutingAccomplishments: ["Verified accomplishment fixture"],
  awards: [
    { name: "Award fixture with image", image: "images/favicon.svg", imageAlt: "Generic test icon", date: "2025-05-01", description: "Approved award description fixture." },
    { name: "Award fixture without optional details" },
  ],
  joinedScouting: "2019-01-01",
  scoutingStory: ["First approved story paragraph.", "Second approved story paragraph."],
  favoriteAdventure: "Favorite adventure fixture",
  favoriteMeritBadge: "Favorite badge fixture",
  favoriteMemory: "Favorite memory fixture",
  leadershipStory: "Leadership reflection fixture",
  lessonsLearned: "Lesson fixture",
  eagleReflection: "Eagle reflection fixture",
  personalQuote: "Personal reflection fixture.",
  projectTitle: "PROJECT TITLE FIXTURE",
  projectBeneficiary: "PROJECT BENEFICIARY FIXTURE",
  projectSummary: "PROJECT SUMMARY FIXTURE",
  projectPhoto: { src: "images/hero-mountains.jpg", alt: "Test-only project image placeholder" },
  galleryImages: [
    { src: "images/hero-mountains.jpg", alt: "Test landscape", caption: "Approved adventure caption fixture." },
    { src: "images/hero-mountains.jpg", alt: "Another test landscape" },
  ],
};

test("only identifying information is required; unknown sections and counts are not invented", () => {
  validateEagles([minimal]);
  const profile = renderProfile(minimal);
  assert.match(profile, /Rendering fixture/);
  assert.match(profile, /June 15, 2025/);
  assert.match(profile, /Portrait not yet shared/);
  assert.doesNotMatch(profile, /Scouting at a glance|Awards &amp; Recognition|The Scouting Journey|Eagle Scout Service Project|photo album|undefined|null/);
  assert.match(profileDescription(minimal), /Scouting journey/);
  validateEagles([{ ...minimal, scoutBio: "", awards: [], galleryImages: [], scoutingStory: [], eaglePalms: " " }]);
  assert.doesNotMatch(renderProfile({ ...minimal, eaglePalms: " " }), /Scouting at a glance/);
});

test("card fronts contain only portrait, identity, designation, year, and troop branding", () => {
  validateEagles([full]);
  const card = renderEagleCard(full);
  assert.match(card, /href="\.\.\/eagles\/render-fixture\/"/);
  assert.match(card, /src="\.\.\/images\/hero-mountains.jpg"/);
  assert.match(card, /EAGLE SCOUT/);
  assert.match(card, /2025/);
  assert.match(card, /Troop 1452/);
  assert.doesNotMatch(card, /PROJECT|biography fixture|Merit badges|37|One Bronze Palm|Volunteer hours|Benefiting/);
});

test("full profiles celebrate the Scout before a smaller service project and variable gallery", () => {
  validateEagles([full]);
  const profile = renderProfile(full);
  for (const text of [
    "Scouting at a glance", "Merit badges earned", "37", "One Bronze Palm", "6.5",
    "Senior Patrol Leader", "Instructor", "Awards &amp; Recognition", "Award fixture with image",
    "Award fixture without optional details", "The Scouting Journey", "Second approved story paragraph.",
    "Favorite adventure fixture", "Favorite badge fixture", "Favorite memory fixture", "Leadership reflection fixture",
    "Lesson fixture", "Eagle reflection fixture", "Personal reflection fixture.", "PROJECT TITLE FIXTURE",
    "PROJECT BENEFICIARY FIXTURE", "PROJECT SUMMARY FIXTURE", "Approved adventure caption fixture.",
  ]) assert.ok(profile.includes(text), `Missing ${text}`);
  assert.equal((profile.match(/As of /g) || []).length, 3);
  assert.equal((profile.match(/<figure>/g) || []).length, 2);
  assert.ok(profile.indexOf("The Scouting Journey") < profile.indexOf("Eagle Scout Service Project"));
  assert.ok(profile.indexOf("Awards &amp; Recognition") < profile.indexOf("Eagle Scout Service Project"));
  assert.doesNotMatch(profile, /Volunteer hours|Fundraising|Project volunteers|Project impact/);
  assert.equal(profileDescription(full), full.scoutBio);
});

test("optional sections render independently and explicitly verified zero counts are supported", () => {
  assert.match(renderProfile({ ...minimal, meritBadgeCount: 0 }), /<dd>0<\/dd>/);
  assert.match(renderProfile({ ...minimal, leadershipPositions: ["Instructor"] }), /Leadership positions/);
  assert.doesNotMatch(renderProfile({ ...minimal, leadershipPositions: ["Instructor"] }), /<dl class="honor-stats">/);
  assert.match(renderProfile({ ...minimal, awards: [{ name: "Verified award" }] }), /Awards &amp; Recognition/);
  assert.match(renderProfile({ ...minimal, favoriteMemory: "An approved memory." }), /The Scouting Journey/);
  assert.match(renderProfile({ ...minimal, projectSummary: "An approved project." }), /Eagle Scout Service Project/);
  assert.match(renderProfile({ ...minimal, galleryImages: full.galleryImages }), /From the Scout's photo album/);
});

test("the archive handles fifteen records, sorts full dates newest first, and preserves input order", () => {
  const records = Array.from({ length: 15 }, (_, index) => ({
    ...minimal, id: `test-${index}`, name: `Rendering fixture ${index}`,
    eagleDate: `2025-06-${String(index + 1).padStart(2, "0")}`,
    troopNumber: index % 2 ? "1135" : "1452",
  }));
  validateEagles(records);
  const original = JSON.stringify(records);
  assert.equal(sortEagles(records)[0].id, "test-14");
  assert.equal(sortEagles(records).at(-1).id, "test-0");
  const archive = renderArchive(records);
  assert.equal((archive.match(/class="honor-card reveal"/g) || []).length, 15);
  assert.ok(archive.indexOf("/test-14/") < archive.indexOf("/test-0/"));
  assert.equal(JSON.stringify(records), original);
  assert.match(archive, /Our Eagle Scouts/);
  assert.match(archive, /Leadership\. Adventure\. Achievement\./);
  assert.match(archive, /Troop 1452 to Troop 1135/);
  assert.doesNotMatch(archive, /honor-empty/);
});

test("empty archives show an intentional invitation instead of fictional cards", () => {
  const archive = renderArchive([]);
  assert.match(archive, /approved portraits and stories/);
  assert.match(archive, /class="honor-empty"/);
  assert.doesNotMatch(archive, /class="honor-card reveal"|preview-trail|Rendering fixture/);
});

test("public names, stories, awards, captions, and metadata escape markup", () => {
  const malicious = '<img src=x onerror="alert(1)">';
  const record = {
    ...minimal, name: malicious, scoutBio: malicious, scoutingStory: [malicious],
    awards: [{ name: malicious }], projectSummary: malicious,
    galleryImages: [{ src: "images/hero-mountains.jpg", alt: malicious, caption: malicious }],
  };
  validateEagles([record]);
  for (const output of [renderProfile(record), renderEagleCard(record)]) {
    assert.doesNotMatch(output, /<img src=x/);
    assert.match(output, /&lt;img src=x/);
    assert.match(output, /&quot;/);
  }
});

test("invalid records, dates, counts, legacy project metrics, and unsafe images fail explicitly", () => {
  for (const record of [
    { ...minimal, id: "../escape" }, { ...minimal, id: 123 },
    { ...minimal, name: "" }, { ...minimal, eagleDate: "2025-02-30" },
    { ...minimal, meritBadgeCount: -1 }, { ...minimal, meritBadgeCount: 1.5 },
    { ...minimal, meritBadgeCountAsOf: "2025-07-01" },
    { ...minimal, yearsInScouting: NaN }, { ...minimal, leadershipPositions: [""] },
    { ...minimal, stats: [{ label: "Project volunteer hours", value: 100 }] },
    { ...minimal, portrait: "images/hero-mountains.jpg" },
    { ...minimal, portrait: "https://example.com/image.jpg", portraitAlt: "External" },
    { ...minimal, projectPhoto: false }, { ...minimal, projectPhoto: { src: "images/../private.jpg", alt: "Bad path" } },
    { ...minimal, awards: [{ name: "Award", date: "unknown" }] },
    { ...minimal, galleryImages: [{ src: "images/hero-mountains.jpg", alt: "" }] },
  ]) assert.throws(() => validateEagles([record]), /Eagle/);
  assert.throws(() => validateEagles([minimal, minimal]), /duplicate Eagle ID/);
});
