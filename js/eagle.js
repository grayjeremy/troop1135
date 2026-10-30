import { eagles } from "../data/eagles.js?v=20261030-honor";
import { validateEagles, renderArchive, renderProfile, profileDescription } from "./eagle-content.js?v=20261030-honor";
import { element, setupNavigation, setupMotion } from "./shared.js?v=20261030-honor";

const root = document.body.dataset.siteRoot;
const content = document.querySelector("#profile-content");
const id = document.body.dataset.scoutId || new URLSearchParams(location.search).get("scout");
validateEagles(eagles);

if (!id) {
  content.innerHTML = renderArchive(eagles, root);
} else {
  const scout = eagles.find((profile) => profile.id === id);
  if (!scout) {
    document.title = "Profile not found | Troop 1135";
    const error = element("div", { class: "profile-error" });
    error.append(element("p", { class: "eyebrow" }, "A SMALL DETOUR"), element("h1", {}, "That trail isn't here."), element("p", {}, "We couldn't find that Eagle profile. Check the link or return to our Eagle collection."), element("a", { href: `${root}eagles/`, class: "button" }, "Explore the Eagle archive"));
    content.replaceChildren(error);
    document.head.append(element("meta", { name: "robots", content: "noindex" }));
  } else {
    content.innerHTML = renderProfile(scout, root);
    document.title = `${scout.name} | Eagle Scout | Troop 1135`;
    document.querySelector('meta[name="description"]').content = profileDescription(scout);
    document.querySelector('meta[property="og:title"]').content = document.title;
    document.querySelector('meta[property="og:description"]').content = profileDescription(scout);
    document.querySelector('meta[property="og:type"]').content = "profile";
    document.querySelector('meta[property="og:image"]').content = new URL(`${root}${scout.portrait || "images/hero-mountains.jpg"}`, location.href).href;
    const permanentUrl = new URL(`${root}eagles/${scout.id}/`, location.href).href;
    document.querySelector('link[rel="canonical"]').href = permanentUrl;
    document.querySelector('meta[property="og:url"]').content = permanentUrl;
  }
}
setupNavigation();
setupMotion();
