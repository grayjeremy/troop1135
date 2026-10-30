// Publish only verified information and photographs with permission for this public website.
// Add one record per Scout, then run npm run build to update the archive and eagles/<id>/.
// Use first names and last initials only, including in URLs, filenames, and alt text.
// Keep published IDs stable. Never add private contact information or project statistics.
//
// Essential fields (replace every placeholder before publishing):
// {
//   id: "approved-public-slug",
//   name: "First X.",
//   eagleDate: "YYYY-MM-DD",
// }
//
// Optional fields; omit anything unknown or not approved:
// portrait: "images/eagles/approved-public-slug/portrait.webp"
// portraitAlt: "Description of the approved portrait" // Required when using a portrait.
// troopNumber: "1452" // Or "1135"; use the Scout's verified troop affiliation.
// scoutBio: "A short personal introduction."
// meritBadgeCount: a verified nonnegative integer
// meritBadgeCountAsOf: "YYYY-MM-DD"
// eaglePalms: "Verified number or types of Palms"
// eaglePalmsAsOf: "YYYY-MM-DD"
// yearsInScouting: a verified number
// yearsInScoutingAsOf: "YYYY-MM-DD"
// leadershipPositions: ["Verified position"]
// scoutingAccomplishments: ["Other verified Scouting accomplishment"]
// awards: [{ name: "Earned award", date: "YYYY-MM-DD", description: "Optional context",
//            image: "images/eagles/approved-public-slug/award.webp", imageAlt: "Award description" }]
// joinedScouting: "YYYY-MM-DD"
// favoriteAdventure, favoriteMeritBadge, favoriteMemory, leadershipStory,
// lessonsLearned, eagleReflection, personalQuote: optional approved text
// scoutingStory: ["An approved paragraph.", "Another paragraph."]
// projectTitle, projectBeneficiary, projectSummary: optional approved text
// projectPhoto: { src: "images/eagles/approved-public-slug/project.webp", alt: "Description" }
// galleryImages: [{ src: "images/eagles/approved-public-slug/camp.webp",
//                   alt: "Accessible description", caption: "Optional approved caption" }]
//
// See README.md for a complete entry guide. No fictional profiles are published.
// Names and Eagle dates supplied by the site owner. Lily's future date is intentional;
// the site owner confirmed the website will not go live until later.
export const eagles = [
  { id: "emily-c", name: "Emily C.", eagleDate: "2021-08-24" },
  { id: "nicole-d", name: "Nicole D.", eagleDate: "2021-12-28" },
  { id: "abigail-c", name: "Abigail C.", eagleDate: "2022-08-04" },
  { id: "hannah-s", name: "Hannah S.", eagleDate: "2022-09-01" },
  { id: "savannah-d", name: "Savannah D.", eagleDate: "2022-09-29" },
  { id: "ava-r", name: "Ava R.", eagleDate: "2023-10-01" },
  { id: "lauren-s", name: "Lauren S.", eagleDate: "2025-08-10" },
  { id: "isabelle-j", name: "Isabelle J.", eagleDate: "2025-10-05" },
  { id: "cadence-w", name: "Cadence W.", eagleDate: "2026-04-19" },
  // Additional Lucy information/photos: https://www.lucyeagle.com/ (reviewed October 30, 2026).
  // Reuse permission confirmed. Statistics reflect the source review, not her Eagle date.
  // Future awards and unverified leadership titles are omitted.
  {
    id: "lucy-g",
    name: "Lucy G.",
    eagleDate: "2026-09-27",
    portrait: "images/eagles/lucy-g/portrait.webp",
    portraitAlt: "Lucy G. outdoors in her Scout uniform and merit badge sash",
    scoutBio: "Backpacking, summer camp, marine science, and the National Scout Jamboree are all part of Lucy's Scouting story. Along the way, she has explored new skills, taken on leadership challenges, and put service into action.",
    meritBadgeCount: 51,
    meritBadgeCountAsOf: "2026-10-30",
    eaglePalms: "6",
    eaglePalmsAsOf: "2026-10-30",
    yearsInScouting: 7,
    yearsInScoutingAsOf: "2026-10-30",
    scoutingAccomplishments: [
      "100+ nights camping",
      "500+ hours of service",
      "Florida Sea Base Marine STEM Adventure",
      "2026 National Scout Jamboree at the Summit Bechtel Reserve",
    ],
    scoutingStory: [
      "Lucy's early Scouting experiences included fishing at an Arrow of Light campout and earning her first merit badges. Backpacking and summer camp became part of the journey as she progressed through the ranks.",
      "At Florida Sea Base, Lucy explored coral and shells, learned about marine conservation, and helped her crew build an underwater remotely operated vehicle during a Marine STEM Adventure.",
      "The 2026 National Scout Jamboree took her to the Summit Bechtel Reserve in West Virginia. Shooting sports, virtual reality, and adventure activities were part of the experience, alongside cooking with her crew and making friends at camp.",
    ],
    leadershipStory: "For her Eagle project, Lucy organized volunteers into patrols and coordinated the work through patrol leaders. Rain, crowded work areas, and a late mulch delivery required her to adjust assignments and keep the crews moving safely.",
    projectTitle: "Small Garden, Big Impact",
    projectBeneficiary: "Anderson Park District",
    projectSummary: "Lucy planned and led the creation of native pollinator gardens at Johnson Hills Park. The plantings and interpretive signs help visitors learn how even a small garden can support pollinators and biodiversity.",
    projectPhoto: {
      src: "images/eagles/lucy-g/project.webp",
      alt: "Lucy kneeling among native plants during her Eagle Scout planting project",
    },
    galleryImages: [
      {
        src: "images/eagles/lucy-g/first-merit-badges.webp",
        alt: "Lucy in uniform with her first merit badge cards on a table",
        caption: "Early milestones: her first merit badges.",
      },
      {
        src: "images/eagles/lucy-g/backpacking.webp",
        alt: "Lucy wearing a loaded backpack before setting out on the trail",
        caption: "Ready for a backpacking adventure.",
      },
      {
        src: "images/eagles/lucy-g/summer-camp.webp",
        alt: "Lucy in uniform holding a troop flag at summer camp",
        caption: "Summer camp, 2025.",
      },
      {
        src: "images/eagles/lucy-g/sea-base-coral.webp",
        alt: "Lucy examining coral with other Scouts at Florida Sea Base",
        caption: "Exploring marine science at Florida Sea Base.",
      },
      {
        src: "images/eagles/lucy-g/sea-base-rov.webp",
        alt: "Lucy and her Sea Base crew with their underwater remotely operated vehicle",
        caption: "Building an underwater ROV with her Sea Base crew.",
      },
      {
        src: "images/eagles/lucy-g/jamboree.webp",
        alt: "Lucy beside the Summit Bechtel Reserve entrance sign",
        caption: "Arriving at the Summit for the 2026 National Scout Jamboree.",
      },
    ],
  },
  { id: "lily-g", name: "Lily G.", eagleDate: "2026-11-15" },
];
