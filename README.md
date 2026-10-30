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

Stylesheets, JavaScript entry points, and their imported modules/data use a matching release suffix within each experience: `?v=20261029-recruitment` for the homepage and `?v=20261030-patches` for the Eagle archive and Trail to Eagle guide. This avoids mixing new markup with an older cached script.

When deploying changes, bump the relevant release value in that page's stylesheet/module URLs, the entry module's imports, and the assertions in `tests/site.test.js`. Shared-script changes should bump both experiences. Re-run `npm run build` to update the archive and generated Eagle pages, then deploy the files together. Query strings are supported by GitHub Pages and do not change the PDF URL. A visitor who already has an old page open can refresh; **Ctrl+Shift+R** bypasses the browser cache.

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

## Eagle Scout Hall of Honor

The archive at `eagles/` celebrates each Scout's whole journey. Portrait-first trading cards show only the Scout's name, Eagle designation, year, and optional troop affiliation. Cards are sorted by the full Eagle date, newest first, in a three/two/one-column responsive collection. No filters or pagination are needed for approximately 15 Scouts.

The troop's transition from 1452 to 1135 is acknowledged without inventing dates or other history. Both troop numbers belong in the same collection. The homepage and its archive link are unchanged.

The collection starts with a **Your picture here** invitation card linking to `trail-to-eagle/`, followed by the Eagle Scouts in newest-first order. It is not a Scout record and has no Eagle year or earned-rank label. The linked page presents the seven ranks as trail checkpoints, with an invitation to visit and a link to official advancement guidance. It is an introductory overview, not a replacement for current official requirements. Edit its wording in `renderEagleTrail` and the invitation in `renderEagleInvitation` in `js/eagle-content.js`, then rebuild; do not add a fictional entry to `data/eagles.js`. The guide is generated as real HTML and works without JavaScript.

Each checkpoint includes its rank patch, stored locally in `images/ranks/` so the guide does not depend on an external image host. The Scout through Life images come from the matching PNG assets under `https://www.lucyeagle.com/assets/ranks/`; the Eagle image comes from that directory's `eagle.webp`. These Scouting insignia are separate from the site's original generic outdoor icons. Web copies preserve transparency and proportions, have a maximum dimension of 256px, and contain no source metadata. Replace a patch using its existing lowercase hyphenated filename, then rebuild and check desktop/mobile previews.

The archive contains the 11 Scouts and Eagle dates supplied by the site owner. **Use first names and last initials only** in names, URLs, filenames, alt text, and metadata; do not enter middle names or full surnames. Check photographs for readable full names on signs and uniform tags too. All supplied dates are preserved, including Lily G.'s November 15, 2026 date: the site owner confirmed the website will launch later. Recheck future-dated entries before publishing. Profiles without supplied photographs or stories use the existing portrait placeholder and omit unknown details.

**Lucy G.**, at `eagles/lucy-g/`, has the first expanded profile. Her additional facts and photographs come from [Lucy's Eagle Scout website](https://www.lucyeagle.com/), reviewed October 30, 2026, with reuse permission confirmed by the site owner. The 51-merit-badge total comes from the site's badge data; its Palm count and years in Scouting come from the site's displayed counter targets. The statistics' verification dates are not award dates. Future goals are not presented as earned awards, and unknown leadership titles, favorite experiences, and joining dates are omitted.

Lucy's approved photo copies are stored in `images/eagles/lucy-g/`, optimized to a maximum dimension of 1400px and under 350KB each, with source metadata removed. The source website and its originals are unchanged; the troop profile does not depend on that website at runtime.

When no approved records remain, the archive shows a designed invitation rather than fictional Scouts or borrowed youth portraits. Development fixtures live only in `tests/eagles.test.js` and are never imported by the public website.

### Add a Scout

1. Obtain the appropriate permission for the first name and last initial, portrait, biography, awards, quotations, and every gallery photograph, including permission covering other identifiable people. Verify dates and accomplishments. Never publish full surnames, middle names, private contact details, birthdays, or private itineraries.
2. Choose a permanent lowercase hyphenated `id` using the first name and last initial (for example, `first-x`), and create `images/eagles/SCOUT-SLUG/` for approved, optimized photographs. Remove GPS/EXIF metadata before upload.
3. Add one object to `eagles` in `data/eagles.js`. Only `id`, `name`, and `eagleDate` are required. Replace these placeholders with verified information:

   ```js
   export const eagles = [
     {
       id: "first-x",
       name: "First X.",
       eagleDate: "YYYY-MM-DD",
       portrait: "images/eagles/first-x/portrait.webp",
       portraitAlt: "Describe the approved portrait.",
       troopNumber: "1452", // Or "1135", when verified.
       scoutBio: "The Scout's approved personal introduction.",
       scoutingStory: [
         "An approved paragraph about their Scouting journey.",
         "Another paragraph about adventures, friendships, or growth.",
       ],
     },
   ];
   ```

4. Run `npm run build` and `npm test` with Node.js 18+ installed (`npm.cmd` instead of `npm` if PowerShell blocks `npm.ps1`). Preview the archive and the direct profile URL.
5. When ready to publish, include the data, images, updated `eagles/index.html`, and generated `eagles/SCOUT-SLUG/index.html` in your normal deployment. Building does **not** commit, push, or deploy.

All dates use real `YYYY-MM-DD` dates. The placeholder date above is deliberately invalid until replaced. Unknown optional fields should be omitted, not filled with zero, guessed dates, or placeholder achievements. A missing portrait gets a dignified troop-motif placeholder, never somebody else's photograph.

### Enter merit badges, Palms, leadership, and awards

| Optional field | Value |
| --- | --- |
| `meritBadgeCount` | Verified total as a number, not quoted text |
| `meritBadgeCountAsOf` | Optional verification date for that count |
| `eaglePalms` | Verified number/types as text, such as a list of the Palms actually earned |
| `eaglePalmsAsOf` | Optional verification date |
| `yearsInScouting` | Verified number of years; decimals supported |
| `yearsInScoutingAsOf` | Optional verification date |
| `leadershipPositions` | Array of verified position names |
| `scoutingAccomplishments` | Array of other verified, non-project Scouting accomplishments |

Use the optional `awards` array for **Awards & Recognition**. Each award needs only its earned `name`; `date`, `description`, `image`, and `imageAlt` are optional. An image needs accessible alternative text and a local `images/` path:

```js
awards: [
  {
    name: "Verified earned award name",
    description: "Optional approved context about this recognition.",
    // date: "YYYY-MM-DD",
    // image: "images/eagles/approved-public-slug/award.webp",
    // imageAlt: "Describe the approved award image.",
  },
],
```

Only list awards the Scout actually earned. The site does not infer Eagle Palms or other recognitions from a merit badge count. Do not enter project volunteer hours, fundraising, volunteer counts, or material quantities; legacy generic `stats` fields are rejected.

### Add stories, photographs, and a service project

`scoutingStory` is an array of plain-text paragraphs. Optional reflections are `favoriteAdventure`, `favoriteMeritBadge`, `favoriteMemory`, `leadershipStory`, `lessonsLearned`, `eagleReflection`, and `personalQuote`. `joinedScouting` optionally records the date they joined. Omit unanswered prompts; the layout hides sections with no information.

Use `projectTitle`, `projectBeneficiary`, and `projectSummary` for the smaller service-project section. An optional `projectPhoto` is `{ src: "images/eagles/SCOUT-SLUG/project.webp", alt: "Approved accessible description" }`. The project is one accomplishment, not the profile's centerpiece.

`galleryImages` supports any number of approved photos from the Scout's journey:

```js
galleryImages: [
  {
    src: "images/eagles/approved-public-slug/camp.webp",
    alt: "Describe the scene and activity without adding unapproved personal information.",
    caption: "Optional approved memory or caption.",
  },
],
```

All image paths are site-root-relative in data, without a leading slash. Portraits use `portrait` and `portraitAlt`; gallery/project photos use `src` and `alt`; award images use `image` and `imageAlt`. The build reports invalid records, unsupported fields, missing alt text, unsafe paths, and missing image files explicitly.

### Permanent pages and maintenance

`npm run build` uses the same renderer as the browser to write the archive, each `/eagles/SCOUT-SLUG/` profile, and `/trail-to-eagle/` as real HTML. Direct visits, refreshes, and JavaScript-disabled browsers can read generated pages on GitHub Pages under `/troop1135/`. Titles, descriptions, social images, and canonical URLs are profile-specific. If hosting changes, update the archive's canonical URL in `eagles/index.html` before building.

Rebuild after every data edit. Do not hand-edit content between `EAGLE_CONTENT_START` / `EAGLE_CONTENT_END` in generated HTML; edit records or the reusable renderer in `js/eagle-content.js`. The archive also supports old `eagles/?scout=ID` links with JavaScript and points their canonical URL at the permanent profile.

Unknown query IDs display a not-found message, not another Scout's profile. Because this is a static site, that message has HTTP 200; missing physical directories receive GitHub Pages' usual 404.

To remove a profile, remove its record **and** its specific generated `eagles/SCOUT-SLUG/` directory and associated photos, then rebuild. The generator intentionally does not delete old archives automatically. Keep published IDs stable.

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

The mountain hero uses stock imagery. Rendering tests use stock landscape placeholders only, never real youth photographs as fictional portraits. No Eagle achievements or Scout names have been inferred from photographs. Confirm publication consent and your organization's policies before publishing identifiable youth. Strip GPS/EXIF metadata from future uploads too. Do not publish youth contact information, private rosters, birthdays, or live locations.

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
- Main editorial content, all joining links, and built Eagle archives/profiles work without JavaScript. Data-driven adventure albums, homepage FAQs, and old query-based profile links require JavaScript.
- Images below the fold are lazy-loaded; hero photography is preloaded.
- `npm test` uses Node's built-in test runner to validate data, local paths, static markup, and permanent-profile generation. No dependency installation is necessary.
- Before publishing content changes, preview at phone/tablet/desktop widths, test keyboard navigation, and confirm the official joining link still resolves.

## Structure

```text
index.html                Main scrolling experience
css/styles.css            Responsive design and reduced-motion rules
css/eagles.css            Archive-only trading card and profile styles
js/main.js                Albums, FAQs, events, section tracking, parallax
js/shared.js              Shared navigation, icons, and reveal behavior
js/eagle.js               Eagle archive/profile browser entry and query links
js/eagle-content.js       Shared validation, sorting, and static/browser rendering
data/                     Troop information, albums, Eagle records
eagles/index.html         Archive and query-based profile entry
eagles/SCOUT-SLUG/         Generated permanent real profiles
trail-to-eagle/index.html  Generated seven-rank guide linked from the invitation card
images/                   Local photographs and favicon
scripts/build-eagles.js   Static archive, profile, and trail guide generator
tests/                    Dependency-free checks
.nojekyll                 Plain GitHub Pages hosting
```
