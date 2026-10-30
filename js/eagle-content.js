export const escapeHtml = (text) => String(text).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[character]);

const hasText = (value) => typeof value === "string" && value.trim().length > 0;
const textFields = [
  "name", "portrait", "portraitAlt", "troopNumber", "scoutBio", "eaglePalms",
  "favoriteAdventure", "favoriteMeritBadge", "favoriteMemory", "leadershipStory",
  "lessonsLearned", "eagleReflection", "personalQuote", "projectTitle",
  "projectBeneficiary", "projectSummary",
];
const dateFields = ["eagleDate", "meritBadgeCountAsOf", "eaglePalmsAsOf", "yearsInScoutingAsOf", "joinedScouting"];
const listFields = ["leadershipPositions", "scoutingAccomplishments", "scoutingStory"];
const allowedFields = new Set(["id", ...textFields, ...dateFields, ...listFields,
  "meritBadgeCount", "yearsInScouting", "awards", "projectPhoto", "galleryImages"]);

function validDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function getEagleImages(scout) {
  return [
    ...(hasText(scout.portrait) ? [{ src: scout.portrait, alt: scout.portraitAlt }] : []),
    ...(scout.awards || []).filter((award) => hasText(award.image)).map((award) => ({ src: award.image, alt: award.imageAlt })),
    ...(scout.projectPhoto ? [scout.projectPhoto] : []),
    ...(scout.galleryImages || []),
  ];
}

export function validateEagles(records) {
  if (!Array.isArray(records)) throw new Error("Eagle records must be an array.");
  const ids = new Set();
  for (const scout of records) {
    if (!scout || typeof scout.id !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(scout.id) || ids.has(scout.id)) {
      throw new Error(`Invalid or duplicate Eagle ID: ${scout?.id}`);
    }
    ids.add(scout.id);
    const fail = (message) => { throw new Error(`Eagle ${scout.id}: ${message}`); };
    for (const key of Object.keys(scout)) {
      if (!allowedFields.has(key)) fail(`Unsupported field "${key}". Use the documented Scout-centered fields, not project statistics.`);
    }
    if (!hasText(scout.name)) fail("An approved public name is required.");
    if (!validDate(scout.eagleDate)) fail("eagleDate must be a real YYYY-MM-DD date.");
    for (const field of textFields) {
      if (scout[field] !== undefined && typeof scout[field] !== "string") fail(`${field} must be text.`);
    }
    for (const field of dateFields) {
      if (scout[field] !== undefined && !validDate(scout[field])) fail(`${field} must be a real YYYY-MM-DD date.`);
    }
    for (const field of listFields) {
      if (scout[field] !== undefined && (!Array.isArray(scout[field]) || !scout[field].every(hasText))) fail(`${field} must be an array of nonempty text.`);
    }
    if (scout.meritBadgeCount !== undefined && (!Number.isInteger(scout.meritBadgeCount) || scout.meritBadgeCount < 0)) fail("meritBadgeCount must be a nonnegative integer.");
    if (scout.yearsInScouting !== undefined && (!Number.isFinite(scout.yearsInScouting) || scout.yearsInScouting < 0)) fail("yearsInScouting must be a nonnegative number.");
    for (const [date, value] of [["meritBadgeCountAsOf", "meritBadgeCount"], ["eaglePalmsAsOf", "eaglePalms"], ["yearsInScoutingAsOf", "yearsInScouting"]]) {
      if (scout[date] && (scout[value] === undefined || (typeof scout[value] === "string" && !hasText(scout[value])))) fail(`${date} needs a corresponding ${value}.`);
    }
    if (scout.awards !== undefined && !Array.isArray(scout.awards)) fail("awards must be an array.");
    for (const award of scout.awards || []) {
      if (!award || !hasText(award.name)) fail("Every award needs its verified name.");
      if (award.date !== undefined && !validDate(award.date)) fail("Award dates must be real YYYY-MM-DD dates.");
      for (const field of ["description", "image", "imageAlt"]) {
        if (award[field] !== undefined && typeof award[field] !== "string") fail(`Award ${field} must be text.`);
      }
    }
    if (scout.galleryImages !== undefined && !Array.isArray(scout.galleryImages)) fail("galleryImages must be an array.");
    if (scout.projectPhoto !== undefined && (!scout.projectPhoto || typeof scout.projectPhoto !== "object" || Array.isArray(scout.projectPhoto))) fail("projectPhoto must be an image object.");
    if (scout.portraitAlt && !hasText(scout.portrait)) fail("portraitAlt needs a portrait.");
    for (const image of getEagleImages(scout)) {
      if (!image || typeof image.src !== "string" || !/^images\/[a-z0-9._/-]+\.(?:avif|gif|jpe?g|png|svg|webp)$/i.test(image.src) || image.src.split("/").includes("..")) fail("Photographs and award images must use a local images/ path without traversal.");
      if (!hasText(image.alt)) fail(`Accessible alternative text is required for ${image.src}.`);
      if (image.caption !== undefined && typeof image.caption !== "string") fail("Image captions must be text.");
    }
  }
}

export function sortEagles(records) {
  return [...records].sort((a, b) => b.eagleDate.localeCompare(a.eagleDate) || a.name.localeCompare(b.name) || a.id.localeCompare(b.id));
}

export function profileDescription(scout) {
  return hasText(scout.scoutBio) ? scout.scoutBio : `Celebrate ${scout.name}'s Scouting journey, leadership, adventures, and Eagle Scout achievement in our troop's Hall of Honor.`;
}

const emblem = (id = "star") => `<svg class="icon" aria-hidden="true"><use href="#i-${id}"/></svg>`;
const dateText = (value) => new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
const time = (value) => `<time datetime="${value}">${dateText(value)}</time>`;
const affiliation = (scout) => hasText(scout.troopNumber) ? `Troop ${escapeHtml(scout.troopNumber)}` : "Troop Hall of Honor";
const paragraphs = (items = []) => items.map((item) => `<p>${escapeHtml(item)}</p>`).join("");
const imageHtml = (image, root, className = "", lazy = true) => `<img class="${className}" src="${root}${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}"${lazy ? ' loading="lazy"' : ""} width="900" height="1125">`;
const portrait = (scout, root, lazy = true) => hasText(scout.portrait)
  ? imageHtml({ src: scout.portrait, alt: scout.portraitAlt }, root, "honor-portrait", lazy)
  : `<div class="honor-portrait-placeholder" role="img" aria-label="Portrait not yet shared for ${escapeHtml(scout.name)}">${emblem("mountain")}<span>THE JOURNEY TO EAGLE</span></div>`;

export function renderEagleCard(scout, root = "../") {
  return `<a class="honor-card reveal" href="${root}eagles/${scout.id}/" aria-label="Explore ${escapeHtml(scout.name)}'s Scouting journey">
    <div class="honor-card-photo">${portrait(scout, root)}
      <span class="honor-card-year">${scout.eagleDate.slice(0, 4)}</span>
      <span class="honor-card-emblem">${emblem()}</span>
    </div>
    <div class="honor-card-copy"><p class="honor-kicker">EAGLE SCOUT</p><h2>${escapeHtml(scout.name)}</h2>
      <div class="honor-card-footer"><span>${affiliation(scout)}</span>${emblem("arrow")}</div>
    </div>
  </a>`;
}

export function renderArchive(records, root = "../") {
  const collection = records.length
    ? `<div class="honor-collection-heading"><p class="eyebrow">THE HALL OF HONOR</p><p>Newest Eagle achievements first</p></div>
       <div class="honor-grid">${sortEagles(records).map((scout) => renderEagleCard(scout, root)).join("")}</div>`
    : `<section class="honor-empty" aria-labelledby="honor-empty-title">
        <div class="honor-seal" aria-hidden="true">${emblem()}</div>
        <div><p class="eyebrow">A LEGACY WORTH KEEPING</p><h2 id="honor-empty-title">Every journey deserves to be remembered.</h2>
        <p>We're gathering approved portraits and stories from our Eagle Scouts. This Hall of Honor will grow as those profiles are ready to share.</p>
        <a class="text-link" href="${root}index.html#contact">Connect with our adult leaders ${emblem("arrow")}</a></div>
      </section>`;
  return `<header class="honor-intro"><p class="eyebrow">THE TROOP LEGACY COLLECTION</p>
    <h1 class="honor-title">Our Eagle Scouts</h1><p class="honor-tagline">Leadership. Adventure. Achievement.</p>
    <p class="honor-introduction">Every Eagle Scout has a story. Years of adventures, friendships, challenges, and leadership shape the journey to Scouting's highest rank. Here we celebrate the Scouts who earned their Eagle and the experiences that helped them get there.</p>
    </header>${collection}
    <aside class="honor-history"><span class="honor-history-mark" aria-hidden="true">1452 <span>→</span> 1135</span>
    <div><h2>One troop story. Two troop numbers.</h2><p>Our troop is transitioning from Troop 1452 to Troop 1135. This collection honors Eagle Scouts from both chapters.</p></div></aside>`;
}

function renderStats(scout) {
  const stats = [
    ["Merit badges earned", scout.meritBadgeCount, scout.meritBadgeCountAsOf],
    ["Eagle Palms", scout.eaglePalms, scout.eaglePalmsAsOf],
    ["Years in Scouting", scout.yearsInScouting, scout.yearsInScoutingAsOf],
  ].filter(([, value]) => value !== undefined && (typeof value !== "string" || hasText(value)));
  const list = (items, title) => items?.length ? `<div class="honor-accomplishments"><h3>${title}</h3><ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div>` : "";
  if (!stats.length && !scout.leadershipPositions?.length && !scout.scoutingAccomplishments?.length) return "";
  return `<section class="honor-stats-panel" aria-labelledby="honor-stats-title"><p class="eyebrow">BEYOND THE BADGE</p><h2 id="honor-stats-title">Scouting at a glance</h2>
    ${stats.length ? `<dl class="honor-stats">${stats.map(([label, value, asOf]) => `<div><dt>${label}</dt><dd>${escapeHtml(value)}${asOf ? `<small>As of ${time(asOf)}</small>` : ""}</dd></div>`).join("")}</dl>` : ""}
    ${list(scout.leadershipPositions, "Leadership positions")}${list(scout.scoutingAccomplishments, "Other Scouting accomplishments")}
    </section>`;
}

function renderAwards(scout, root) {
  if (!scout.awards?.length) return "";
  return `<section class="honor-section" aria-labelledby="honor-awards-title"><p class="eyebrow">EARNED ALONG THE WAY</p><h2 id="honor-awards-title">Awards &amp; Recognition</h2>
    <ul class="honor-awards">${scout.awards.map((award) => `<li>
      <div class="honor-award-mark">${hasText(award.image) ? imageHtml({ src: award.image, alt: award.imageAlt }, root) : emblem()}</div>
      <div><h3>${escapeHtml(award.name)}</h3>${award.date ? `<p class="honor-date">${time(award.date)}</p>` : ""}${hasText(award.description) ? `<p>${escapeHtml(award.description)}</p>` : ""}</div>
    </li>`).join("")}</ul></section>`;
}

function renderJourney(scout) {
  const memories = [
    ["Joined Scouting", scout.joinedScouting ? time(scout.joinedScouting) : ""],
    ["Favorite adventure", escapeHtml(scout.favoriteAdventure || "")],
    ["Favorite merit badge", escapeHtml(scout.favoriteMeritBadge || "")],
    ["Favorite troop memory", escapeHtml(scout.favoriteMemory || "")],
    ["Learning to lead", escapeHtml(scout.leadershipStory || "")],
    ["Lessons from the trail", escapeHtml(scout.lessonsLearned || "")],
    ["On earning Eagle", escapeHtml(scout.eagleReflection || "")],
  ].filter(([, value]) => value);
  if (!scout.scoutingStory?.length && !memories.length) return "";
  return `<section class="honor-section honor-journey" aria-labelledby="honor-journey-title"><p class="eyebrow">THE MOMENTS THAT MATTER</p><h2 id="honor-journey-title">The Scouting Journey</h2>
    <div class="honor-story">${paragraphs(scout.scoutingStory)}</div>
    ${memories.length ? `<dl class="honor-memories">${memories.map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join("")}</dl>` : ""}</section>`;
}

function renderProject(scout, root) {
  if (![scout.projectTitle, scout.projectBeneficiary, scout.projectSummary].some(hasText) && !scout.projectPhoto) return "";
  return `<section class="honor-section honor-project" aria-labelledby="honor-project-heading">
    <div><p class="eyebrow">ONE MEANINGFUL PART OF THE JOURNEY</p><h2 id="honor-project-heading">Eagle Scout Service Project</h2>
    ${hasText(scout.projectTitle) ? `<h3>${escapeHtml(scout.projectTitle)}</h3>` : ""}
    ${hasText(scout.projectBeneficiary) ? `<p class="honor-beneficiary">Benefiting ${escapeHtml(scout.projectBeneficiary)}</p>` : ""}
    ${hasText(scout.projectSummary) ? `<p>${escapeHtml(scout.projectSummary)}</p>` : ""}</div>
    ${scout.projectPhoto ? imageHtml(scout.projectPhoto, root, "honor-project-photo") : ""}</section>`;
}

export function renderProfile(scout, root = "../../") {
  const gallery = scout.galleryImages?.length ? `<section class="honor-section" aria-labelledby="honor-gallery-title"><p class="eyebrow">A LIFE OUTSIDE</p><h2 id="honor-gallery-title">From the Scout's photo album</h2>
    <div class="honor-gallery">${scout.galleryImages.map((photo) => `<figure>${imageHtml(photo, root)}${hasText(photo.caption) ? `<figcaption>${escapeHtml(photo.caption)}</figcaption>` : ""}</figure>`).join("")}</div></section>` : "";
  return `<a class="text-link honor-profile-back" href="${root}eagles/">← All Eagle Scouts</a>
    <header class="honor-profile-header">
    <div class="honor-profile-card"><div class="honor-profile-photo">${portrait(scout, root, false)}</div>
      <div class="honor-profile-card-label"><span>EAGLE SCOUT · ${scout.eagleDate.slice(0, 4)}</span>${emblem()}</div>
    </div>
    <div class="honor-profile-intro"><p class="eyebrow">${affiliation(scout)} · HALL OF HONOR</p><h1 class="honor-title">${escapeHtml(scout.name)}</h1>
    <p class="honor-rank-date">Eagle Scout · ${time(scout.eagleDate)}</p>
    ${hasText(scout.scoutBio) ? `<p class="honor-bio">${escapeHtml(scout.scoutBio)}</p>` : ""}
    ${hasText(scout.personalQuote) ? `<blockquote class="honor-quote">${escapeHtml(scout.personalQuote)}</blockquote>` : ""}</div></header>
    ${renderStats(scout)}${renderAwards(scout, root)}${renderJourney(scout)}${renderProject(scout, root)}${gallery}`;
}
