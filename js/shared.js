export function element(tag, attributes = {}, text) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, value);
  if (text !== undefined) node.textContent = text;
  return node;
}

export function icon(id) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "icon");
  svg.setAttribute("aria-hidden", "true");
  const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
  use.setAttribute("href", `#i-${id}`);
  svg.append(use);
  return svg;
}

export function setupNavigation() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");
  if (!toggle || !nav) return;
  document.documentElement.classList.add("navigation-ready");
  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    nav.classList.toggle("is-open", open);
  };
  toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      toggle.focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".site-header")) setOpen(false);
  });
  matchMedia("(min-width: 901px)").addEventListener("change", () => setOpen(false));
}

export function setupMotion() {
  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  if (!("IntersectionObserver" in window)) return;
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.08 });
  const reveal = () => {
    document.documentElement.classList.toggle("motion-ready", !preference.matches);
    document.querySelectorAll(".reveal").forEach((node) => observer.observe(node));
  };
  reveal();
  preference.addEventListener("change", reveal);
  return reveal;
}

export function createEagleCard(scout, prefix = "./") {
  const url = scout.sample ? `${prefix}eagles/?scout=${encodeURIComponent(scout.id)}` : `${prefix}eagles/${encodeURIComponent(scout.id)}/`;
  const card = element("a", { class: "eagle-card reveal", href: url });
  const image = element("div", { class: "eagle-card-image" });
  image.append(element("img", { src: `${prefix}${scout.photo}`, alt: scout.photoAlt, loading: "lazy", width: "650", height: "700" }));
  image.append(element("span", { class: "eagle-year" }, `${scout.sample ? "EAGLE ARCHIVE" : "EAGLE SCOUT"} · ${scout.year}`));
  const rank = element("span", { class: "eagle-rank" });
  rank.append(icon("star"));
  image.append(rank);
  const body = element("div", { class: "eagle-card-body" });
  body.append(
    element("span", { class: "card-kicker" }, scout.sample ? "ILLUSTRATIVE PROFILE · NOT A REAL SCOUT" : "SCOUTS BSA · TROOP 1135"),
    element("h3", {}, scout.name),
    element("h4", {}, scout.project),
    element("p", {}, scout.description),
  );
  const bottom = element("span", { class: "eagle-card-bottom" });
  bottom.append(element("span", {}, scout.sample ? "Explore the sample story" : "Discover her project"), icon("arrow"));
  body.append(bottom);
  card.append(image, body);
  return card;
}
