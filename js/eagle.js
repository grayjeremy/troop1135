import { eagles, sampleEagles } from "../data/eagles.js";
import { troop } from "../data/troop.js";
import { element, createEagleCard, setupNavigation, setupMotion } from "./shared.js";

const root = document.body.dataset.siteRoot;
const content = document.querySelector("#profile-content");
const id = document.body.dataset.scoutId || new URLSearchParams(location.search).get("scout");
document.querySelectorAll("[data-section]").forEach((link) => { link.href = `${root}index.html#${link.dataset.section}`; });
document.querySelectorAll("[data-home-link]").forEach((link) => { link.href = `${root}index.html`; });
document.querySelectorAll("[data-join-link]").forEach((link) => { link.href = troop.joinUrl; });
content.replaceChildren();

if (!id) {
  content.append(element("p", { class: "eyebrow" }, "THE TROOP 1135 LEGACY COLLECTION"), element("h1", { style: "color:var(--forest);font-size:clamp(40px,6vw,72px)" }, "Our Eagle Scouts"));
  if (!eagles.length) content.append(element("p", { class: "sample-notice", style: "color:var(--plum)" }, "Our archive is ready to grow. These are illustrative design previews, not real Scout records."));
  const grid = element("div", { class: "eagle-grid" });
  (eagles.length ? eagles : sampleEagles).forEach((scout) => grid.append(createEagleCard(scout, root)));
  content.append(grid);
} else {
  const scout = [...eagles, ...sampleEagles].find((profile) => profile.id === id);
  if (!scout) {
    document.title = "Profile not found | Troop 1135";
    const error = element("div", { class: "profile-error" });
    error.append(element("p", { class: "eyebrow" }, "A SMALL DETOUR"), element("h1", {}, "That trail isn't here."), element("p", {}, "We couldn't find that Eagle profile. Check the link or return to our Eagle collection."), element("a", { href: `${root}eagles/`, class: "button" }, "Explore the Eagle archive"));
    content.append(error);
  } else {
    document.title = `${scout.name} | Eagle Scout Archive | Troop 1135`;
    document.querySelector('meta[name="description"]').content = scout.description;
    document.querySelector('meta[property="og:title"]').content = document.title;
    document.querySelector('meta[property="og:description"]').content = scout.description;
    if (scout.sample) content.append(element("p", { class: "card-kicker" }, "ILLUSTRATIVE DESIGN PREVIEW · NOT A REAL SCOUT OR PROJECT"));
    const header = element("div", { class: "profile-header" });
    header.append(element("img", { class: "profile-portrait", src: `${root}${scout.photo}`, alt: scout.photoAlt, width: "800", height: "1000" }));
    const intro = element("div");
    intro.append(element("p", { class: "eyebrow" }, `${scout.sample ? "SAMPLE EAGLE ARCHIVE" : "EAGLE SCOUT"} · ${scout.year}`), element("h1", {}, scout.name), element("h2", {}, scout.project), element("p", { class: "section-intro" }, scout.description), element("p", { class: "profile-beneficiary" }, `Benefiting organization: ${scout.beneficiary}`));
    if (scout.stats?.length) {
      const stats = element("div", { class: "profile-stats" });
      for (const stat of scout.stats) {
        const item = element("div");
        item.append(element("strong", {}, stat.value), element("span", {}, stat.label));
        stats.append(item);
      }
      intro.append(stats);
    }
    header.append(intro);
    const story = element("article", { class: "profile-story" });
    story.append(element("h2", {}, "The story behind the service."));
    for (const paragraph of scout.story || []) story.append(element("p", {}, paragraph));
    if (scout.projectUrl) story.append(element("a", { class: "text-link", href: scout.projectUrl }, "More about the project ↗"));
    content.append(header, story);
    if (scout.photos?.length) {
      const gallery = element("div", { class: "profile-gallery" });
      for (const photo of scout.photos) {
        const figure = element("figure");
        figure.append(element("img", { src: `${root}${photo.src}`, alt: photo.alt, loading: "lazy", width: "1000", height: "700" }), element("figcaption", {}, photo.alt));
        gallery.append(figure);
      }
      content.append(gallery);
    }
  }
}
setupNavigation();
setupMotion();
