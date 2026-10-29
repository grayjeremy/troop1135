# Scouts BSA Troop 1135

A responsive, girl-led, adventure-ready website. Plain HTML, CSS, and JavaScript; no framework, database, runtime server, or dependency installation required. The site lives at the root of **this repository** (`troop1135`), not its parent folder.

## Preview locally

From this repository folder, run:

```powershell
python -m http.server 8000
```

Open `http://localhost:8000`. Use a local server rather than double-clicking the HTML: browsers block JavaScript module imports on `file://` URLs.

## Publish on GitHub Pages

1. Push the contents of this repository to your GitHub repository. `index.html`, `css`, `js`, `images`, `data`, and `.nojekyll` must be at the repository root.
2. In GitHub, open **Settings > Pages**.
3. Choose **Deploy from a branch**, select the branch containing the site, and select **/ (root)**. Save.
4. Wait for the Pages deployment, then open the URL shown in Settings. A project site typically uses `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/`.
5. Set the absolute `og:image` URL and add `og:url` in `index.html` before sharing on social platforms. Use the full project-site prefix. The relative image is a working placeholder, but social crawlers generally need an absolute URL.

All navigation, imports, and local assets use relative paths, so the site works under a GitHub Pages project prefix or a custom domain. No secrets, environment variables, API keys, or paid services are needed. HTTPS is provided by GitHub Pages. `.nojekyll` preserves the files as a plain static site.

### Browser caching after deployments

Stylesheets, JavaScript entry points, and their imported modules/data use a matching `?v=20261029-recruitment` release suffix. This avoids mixing the new homepage markup with the previous cached script (which expected the old Eagle gallery and could stop before rendering adventure photos).

When deploying changes to CSS, JavaScript, or data, replace that release value consistently in `index.html`, `eagles/index.html`, `js/main.js`, `js/eagle.js`, and its test in `tests/site.test.js`. Re-run `npm run build` to update any generated Eagle pages, then deploy the files together. Query strings are supported by GitHub Pages and do not change the PDF URL. A visitor who already has the old page open can refresh; **Ctrl+Shift+R** bypasses the browser cache for an immediate recovery on the existing deployment.

## Update troop information

The homepage follows six sections: Hero → Adventures → About → Why Scouting → Achievement → Join. Keep `#home`, `#adventures`, `#about`, `#parents`, `#eagles`, and `#join` stable for existing links. `#join-troop` targets the formal joining steps; `#contact` remains a contact anchor within Join. Primary calls to action are labeled **Visit a Meeting**.

The forest-green Join section separates **A / Visit a Meeting** (including the optional PDF guide) from **B / Join the Troop** (official listing, electronic youth application, and initial purchases). The FAQ holds practical details rather than repeating them throughout the page. No purchases or printed guide are required to visit.

| Content | Where to edit |
| --- | --- |
| Story, meeting details, charter organization, adult contact label | `data/troop.js` |
| New-member FAQ answers | `faqs` in `data/troop.js` |
| Public events | `events` in `data/troop.js` |
| Albums, categories, photographs, captions, alt text | `data/albums.js` |
| Eagle Scout records | `data/eagles.js` |
| General editorial copy | `index.html` |
| Colors, type, layout, motion | `css/styles.css` |
| Favicon | `images/favicon.svg` |
| First-meeting download and preview | `documents/troop-1135-first-meeting-flyer.pdf` and `images/first-meeting-flyer.webp` |
| Social-sharing metadata | `<head>` in `index.html` and `eagles/index.html` |

Meeting times, location, history, and charter organization have intentionally **not** been invented. Confirm them with troop leadership before filling in the placeholders. All visit/contact/request-information links go to the supplied official BeAScout unit listing. Do not substitute children's email addresses or phone numbers.

**Still needs leader confirmation:** current meeting time/location, registration fees and troop dues, activity costs and assistance, outing frequency, and participation expectations. Until confirmed, the page directs families to adult leaders rather than publishing estimates. Confirm eligibility and the applicable youth protection/supervision arrangements with leaders as part of a visit.

The Join section includes a printable first-meeting companion with prompts for observing the meeting, meeting new friends, and next steps. The downloadable PDF is an unchanged copy of the supplied adventure flyer, hosted locally for GitHub Pages; it is not embedded or loaded until a visitor chooses to download it. To update it, replace `documents/troop-1135-first-meeting-flyer.pdf`, regenerate the small cover thumbnail at `images/first-meeting-flyer.webp`, and update the displayed file size in `index.html`. Keep the stable filename so existing links continue to work. Review each replacement for private information before publishing.

Events are optional and hidden when the array is empty. Add an event object with `title`, `date` (`YYYY-MM-DD`), and `detail`. Use public open-house information only; keep private itineraries and live youth locations off the public site. Remove expired events as part of regular maintenance.

## Add an Eagle Scout

The homepage now shows only a small, general achievement preview, not an "Our Eagle Scouts" collection. The archive displays verified records from `eagles` only; when none are available it explains that stories are being gathered. Fictional layout fixtures remain in `sampleEagles` for development tests, but are never rendered publicly, including via old sample-profile query links. Add verified records when ready; the full card/profile components and page generator are preserved.

1. Obtain consent for the public name, portrait, project story, photos, and any impact statistics.
2. Create `images/eagles/SCOUT-SLUG/` and add optimized photographs.
3. Copy the commented record example in `data/eagles.js` into the `eagles` array. Choose a stable lowercase, hyphenated `id`, such as `lucy-gray`. That name is an example, not a claim about a troop member.
4. Include `name`, `year`, `photo`, `photoAlt`, `project`, `description`, `beneficiary`, and `story` (an array of paragraphs). Optional fields: `stats` (objects with `value` and `label`), `photos` (objects with `src` and `alt`), and `projectUrl`.
5. With Node.js 18+ installed, run:

   ```powershell
   npm run build
   npm test
   ```

6. Commit the data, photographs, and generated `eagles/SCOUT-SLUG/index.html` files. GitHub Pages does **not** need Node.js or a build service: the generated pages are ordinary static files.

Cards are populated from the data automatically. The build makes permanent pages such as `/eagles/lucy-gray/`, with profile-specific title and description metadata. Re-run it after changing real records. The archive also supports `eagles/?scout=ID` links. Unknown IDs show an explicit not-found message rather than another Scout's record. Because there is no backend, that message has an HTTP 200 status; GitHub Pages handles missing physical directories with its normal 404.

To remove a public profile, remove its record **and** its specific generated `eagles/SCOUT-SLUG/` directory and photographs. The generator intentionally does not delete existing archives automatically. Do not rename published IDs casually: they are permanent links.

## Organize adventure albums

```text
images/
  hero-mountains.jpg
  favicon.svg
  albums/
    trail-days/forest-team.webp
    trail-days/rock-overhang.webp
    summer-camp/ready-to-ride.webp
    sea-base/paddling-at-sunset.webp
    marine-stewardship/coral-team.webp
  eagles/
    SCOUT-SLUG/portrait.jpg
    SCOUT-SLUG/project-01.jpg
```

The browser cannot list folders on GitHub Pages. `data/albums.js` is the explicit album manifest: add images to a folder, then list them under that album's `photos`. Each album has a cover `image`, `alt`, `title`, `label`, `description`, and `category` (`trail`, `camp`, `water`, or `service`). Filters are keyboard-accessible; clicking a cover opens an album dialog with previous/next controls, arrow-key navigation, Escape to close, and focus restored to the cover.

Use paths relative to the site root inside data files, without a leading `/` (for example, `images/albums/trail-days/photo-02.jpg`). Use lowercase names without spaces. Prefer JPEG/WebP images around 1000–1400px wide and under 350KB; the hero can be 1920px wide. Always include meaningful alt text.

### Photography and privacy

The About section and adventure gallery use 19 photographs selected from the troop leadership-supplied `1452 Pictures` collection, confirmed by the site owner as the correct troop photos. They are organized into hiking, summer camp, Sea Base, and marine-stewardship albums. Web copies are optimized WebP files with a maximum dimension of 1400px and under 350KB each. EXIF/GPS, XMP, and other source metadata have been removed; original photographs are unchanged and are not included in the website.

The mountain hero uses stock imagery. The non-public Eagle layout fixtures also reference stock images; real youth photos are deliberately **not** used for fictional profiles. No Eagle achievements or Scout names have been inferred from photographs. Confirm publication consent and your organization's policies before publishing identifiable youth. Strip GPS/EXIF metadata from future uploads too. Do not publish youth contact information, private rosters, birthdays, or live locations.

Source images (the [Unsplash license](https://unsplash.com/license) permits downloading and using images; verify applicable terms before reuse):

- Hero: [mountain landscape](https://images.unsplash.com/photo-1464822759023-fed622ff2c3b) / image ID `photo-1464822759023-fed622ff2c3b`
- Hiking: image ID `photo-1551632811-561732d1e306`
- Camping: image ID `photo-1504851149312-7a075b496cc7`
- Lake: image ID `photo-1501785888041-af3ef285b470`
- Forest: image ID `photo-1448375240586-882707db888b`

Original image endpoints follow `https://images.unsplash.com/PHOTO-ID`. Images are stored locally, so visitors do not depend on an external image host. Typefaces (DM Sans and Manrope, open-source Google Fonts) use a Google Fonts stylesheet and fall back to system fonts offline. Self-host them if you want to remove the external font request. The mountain mark, star, and compass are generic original line art, not official Scouting logos. The SVG favicon is an editable placeholder.

## Accessibility and maintenance

- Semantic landmarks, skip link, visible keyboard focus, native disclosure widgets, labeled mobile navigation, and descriptive image alternatives.
- Native modal focus containment; Escape, arrow keys, and focus restoration in albums.
- Scroll reveals and parallax respect `prefers-reduced-motion`, including preference changes.
- Main editorial content and all joining links work without JavaScript. Data-driven albums, FAQs, and profiles require JavaScript and have a no-script explanation.
- Images below the fold are lazy-loaded; hero photography is preloaded.
- `npm test` uses Node's built-in test runner to validate data, local paths, static markup, and permanent-profile generation. No dependency installation is necessary.
- Before publishing content changes, preview at phone/tablet/desktop widths, test keyboard navigation, and confirm the official joining link still resolves.

## Structure

```text
index.html                Main scrolling experience
css/styles.css            Responsive design and reduced-motion rules
js/main.js                Albums, FAQs, events, section tracking, parallax
js/shared.js              Shared navigation, reveals, Eagle cards
js/eagle.js               Data-driven Eagle archive and profiles
data/                     Troop information, albums, Eagle records
eagles/index.html         Archive and query-based profile entry
eagles/SCOUT-SLUG/         Generated permanent real profiles
images/                   Local photographs and favicon
scripts/build-eagles.js   Optional static profile generator
tests/                    Dependency-free checks
.nojekyll                 Plain GitHub Pages hosting
```
