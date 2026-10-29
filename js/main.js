import { troop, faqs, events } from "../data/troop.js";
import { albums } from "../data/albums.js";
import { element, setupNavigation, setupMotion } from "./shared.js";

document.querySelector("#troop-story").textContent = troop.story;
document.querySelector("#meeting-details").textContent = troop.meetingDetails;
document.querySelector("#charter-info").textContent = troop.charterOrganization;
document.querySelector("#contact-label").textContent = troop.contactLabel;
document.querySelector("#year").textContent = new Date().getFullYear();
document.querySelectorAll("[data-join-link]").forEach((link) => { link.href = troop.joinUrl; });

const faqList = document.querySelector("#faq-list");
for (const faq of faqs) {
  const details = element("details");
  const answer = element("p", {}, faq.answer);
  if (faq.link) {
    answer.append(" ", element("a", { href: faq.link.url, class: "faq-link" }, faq.link.text), ".");
  }
  details.append(element("summary", {}, faq.question), answer);
  faqList.append(details);
}
faqList.addEventListener("toggle", (event) => {
  if (event.target.open) {
    faqList.querySelectorAll("details").forEach((item) => {
      if (item !== event.target) item.open = false;
    });
  }
}, true);

const eventPanel = document.querySelector("#events");
if (events.length) {
  eventPanel.hidden = false;
  eventPanel.append(element("h3", {}, "Coming up on the trail"));
  for (const event of events) {
    const article = element("article");
    const date = new Date(`${event.date}T12:00:00`);
    article.append(element("time", { datetime: event.date }, date.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })), element("h4", {}, event.title), element("p", {}, event.detail));
    const link = element("a", { href: troop.joinUrl, class: "text-link" }, "Request visit details ↗");
    article.append(link);
    eventPanel.append(article);
  }
}

const dialog = document.querySelector("#photo-dialog");
const dialogImage = document.querySelector("#dialog-image");
const dialogTitle = document.querySelector("#photo-title");
const dialogDescription = document.querySelector("#photo-description");
const controls = element("div", { class: "album-controls" });
const previous = element("button", { type: "button", "aria-label": "Previous photograph" }, "← Previous");
const counter = element("span", { "aria-live": "polite" });
const next = element("button", { type: "button", "aria-label": "Next photograph" }, "Next →");
controls.append(previous, counter, next);
dialog.append(controls);
let currentAlbum;
let photoIndex = 0;
let photoTrigger;

function renderPhoto() {
  const photo = currentAlbum.photos[photoIndex];
  dialogImage.src = `./${photo.src}`;
  dialogImage.alt = photo.alt;
  dialogTitle.textContent = currentAlbum.title;
  dialogDescription.textContent = currentAlbum.description;
  counter.textContent = `${photoIndex + 1} / ${currentAlbum.photos.length}`;
  previous.disabled = photoIndex === 0;
  next.disabled = photoIndex === currentAlbum.photos.length - 1;
}

function openAlbum(album, trigger) {
  currentAlbum = album;
  photoIndex = 0;
  photoTrigger = trigger;
  renderPhoto();
  dialog.showModal();
}
previous.addEventListener("click", () => {
  if (photoIndex > 0) { photoIndex--; renderPhoto(); }
});
next.addEventListener("click", () => {
  if (photoIndex < currentAlbum.photos.length - 1) { photoIndex++; renderPhoto(); }
});
dialog.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});
dialog.addEventListener("close", () => photoTrigger?.focus());
dialog.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight" && !next.disabled) { event.preventDefault(); next.click(); }
  if (event.key === "ArrowLeft" && !previous.disabled) { event.preventDefault(); previous.click(); }
});

const grid = document.querySelector("#adventure-grid");
function renderAlbums(filter = "all") {
  const visibleAlbums = albums.filter((album) => filter === "all" || album.category === filter);
  grid.replaceChildren();
  grid.classList.toggle("is-filtered", filter !== "all");
  for (const album of visibleAlbums) {
    const card = element("button", { class: "adventure-card", type: "button", "aria-label": `Open ${album.label.toLowerCase()} album: ${album.title}` });
    const image = element("img", { src: `./${album.image}`, alt: album.alt, width: "1000", height: "800", loading: "lazy" });
    const caption = element("span", { class: "card-caption" });
    caption.append(element("small", {}, album.label), element("strong", {}, album.title), element("span", { class: "card-arrow", "aria-hidden": "true" }, "↗"));
    card.append(image, caption);
    card.addEventListener("click", () => openAlbum(album, card));
    grid.append(card);
  }
  document.querySelector("#gallery-status").textContent = visibleAlbums.length ? `${visibleAlbums.length} ${visibleAlbums.length === 1 ? "album" : "albums"}. Pick an adventure to see more.` : "New adventures are on the horizon. Check back for more albums.";
}
renderAlbums();
document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-filter]").forEach((filter) => {
      const active = filter === button;
      filter.classList.toggle("active", active);
      filter.setAttribute("aria-pressed", String(active));
    });
    renderAlbums(button.dataset.filter);
  });
});

setupNavigation();
setupMotion();

// A small rAF-throttled offset adds depth without a scrolling library.
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const heroImage = document.querySelector(".hero-image");
const hero = document.querySelector(".hero");
let scheduled = false;
function parallax() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    const scroll = window.scrollY;
    heroImage.style.transform = reducedMotion.matches ? "" : `translateY(${Math.min(scroll * 0.16, hero.offsetHeight * 0.12)}px)`;
    scheduled = false;
  });
}
window.addEventListener("scroll", parallax, { passive: true });
reducedMotion.addEventListener("change", parallax);

const sections = [...document.querySelectorAll("main section[id]")];
if ("IntersectionObserver" in window) {
  const navObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        document.querySelectorAll('.site-nav a[href^="#"]').forEach((link) => {
          const target = document.querySelector(link.hash);
          if (target === entry.target || entry.target.contains(target)) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      }
    }
  }, { rootMargin: "-15% 0px -65% 0px" });
  sections.forEach((section) => navObserver.observe(section));
}
