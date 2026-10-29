// Add consent-approved real profiles to this array. Cards and profile pages update automatically.
// Dates, names, organizations, statistics, and stories must be verified before publication.
// Run npm run build after edits to generate eagles/<id>/. Keep IDs stable once published.
// Query URLs (eagles/?scout=<id>) also work without generation.
// Schema example (copy into eagles, replace every value, then delete sample: true):
// {
//   id: "unique-public-slug", name: "Approved public name", year: 2026,
//   photo: "images/eagles/unique-public-slug/portrait.jpg",
//   photoAlt: "Approved portrait description", project: "Project title",
//   description: "Short project summary", beneficiary: "Organization name",
//   story: ["First paragraph.", "Second paragraph."],
//   stats: [{ value: "120", label: "Volunteer hours" }],
//   photos: [{ src: "images/eagles/unique-public-slug/project-01.jpg", alt: "Project description" }],
//   projectUrl: "https://approved-organization.example/project" // Optional.
// }
export const eagles = [];

// Layout fixtures only: kept for development tests, never rendered on the public homepage or archive.
export const sampleEagles = [
  {
    id: "preview-trail-builder", name: "The trail builder", year: "YOUR YEAR",
    photo: "images/albums/trail-days/hiking.jpg", photoAlt: "Mountain trail landscape used as a sample profile image",
    project: "A path to something bigger",
    description: "A place for a Scout's project story: the challenge she saw, the team she led, and the lasting difference she made.",
    beneficiary: "Benefiting organization goes here",
    story: ["This is a design preview, not a real Scout or completed project. Replace it by adding verified, consent-approved profiles to data/eagles.js.", "Each profile has space for a personal project story, the benefiting organization, project photographs, and optional impact statistics."],
    stats: [], photos: [{ src: "images/albums/trail-days/hiking.jpg", alt: "Mountain scenery used to demonstrate a project photo" }], sample: true,
  },
  {
    id: "preview-community-builder", name: "The changemaker", year: "YOUR YEAR",
    photo: "images/albums/under-the-stars/camping.jpg", photoAlt: "Mountain campsite used as a sample profile image",
    project: "Small acts. Lasting impact.",
    description: "Behind every Eagle project is a story of initiative, problem-solving, and a community made stronger.",
    beneficiary: "Benefiting organization goes here",
    story: ["This illustrative card shows how a future Eagle Scout's community service project can be celebrated. No Scout achievement is being claimed.", "Add approved project photographs and verified statistics to tell the complete story."],
    stats: [], photos: [], sample: true,
  },
  {
    id: "preview-outdoor-advocate", name: "The outdoor advocate", year: "YOUR YEAR",
    photo: "images/albums/giving-back/forest.jpg", photoAlt: "Green forest used as a sample profile image",
    project: "For the next generation",
    description: "Room for the stories of young women who lead with purpose and leave the world a little better than they found it.",
    beneficiary: "Benefiting organization goes here",
    story: ["This is an example layout for a future, verified Eagle Scout profile. The forest photograph is inspiration, not a project photograph.", "The archive grows simply by adding another object to the Eagle data array. No layout changes are needed."],
    stats: [], photos: [], sample: true,
  },
];
