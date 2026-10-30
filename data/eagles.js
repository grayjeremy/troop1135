// Publish only verified information and photographs with permission for this public website.
// Add one record per Scout, then run npm run build to update the archive and eagles/<id>/.
// Keep published IDs stable. Never add private contact information or project statistics.
//
// Essential fields (replace every placeholder before publishing):
// {
//   id: "approved-public-slug",
//   name: "Approved public name",
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
export const eagles = [];
