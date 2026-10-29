// Paths are relative to the site root, not this file. Add approved photos to images/albums/<album>/.
// Troop photographs supplied by troop leadership. Original files are kept outside the website.
// Use descriptive alt text, remove GPS/EXIF metadata, and obtain consent before adding youth photos.
export const albums = [
  { id: "trail-days", title: "Take the long way.", category: "trail", label: "HIKING & EXPLORING", image: "images/albums/trail-days/rock-overhang.webp", alt: "Four Scouts standing together beneath a sweeping sandstone overhang", description: "Rocky trails, forest shade, and waterfall stops. The best discoveries are the ones we make together.", photos: [
    { src: "images/albums/trail-days/rock-overhang.webp", alt: "Four Scouts standing together beneath a sweeping sandstone overhang" },
    { src: "images/albums/trail-days/gorge-walk.webp", alt: "Scouts exploring a rocky gorge beneath forested cliffs" },
    { src: "images/albums/trail-days/waterfall.webp", alt: "A waterfall spilling over a sandstone ledge into a quiet pool" },
    { src: "images/albums/trail-days/waterfall-friends.webp", alt: "Two backpackers raising their arms beside a waterfall" },
    { src: "images/albums/trail-days/forest-team.webp", alt: "Scouts and adult leaders with daypacks gathered at the edge of a forest trail" },
  ] },
  { id: "summer-camp", title: "Camp days. Best days.", category: "camp", label: "CAMPING & SUMMER CAMP", image: "images/albums/summer-camp/ready-to-ride.webp", alt: "Scouts and an adult leader wearing riding helmets at the camp stables", description: "Horseback rides, a new climbing challenge, and a hammock waiting at the end of the day. There's more than one way to find your adventure at camp.", photos: [
    { src: "images/albums/summer-camp/ready-to-ride.webp", alt: "Scouts and an adult leader wearing riding helmets at the camp stables" },
    { src: "images/albums/summer-camp/horseback-trail.webp", alt: "Helmeted riders following a wooded trail on horseback" },
    { src: "images/albums/summer-camp/climbing.webp", alt: "A Scout wearing a helmet and climbing harness tackling a wooden climbing structure" },
    { src: "images/albums/summer-camp/hammock-camp.webp", alt: "A camping hammock, backpack, and chair sheltered beneath a tarp among the trees" },
    { src: "images/albums/summer-camp/camp-at-night.webp", alt: "A softly lit hammock campsite beneath the trees after dark" },
    { src: "images/albums/summer-camp/dining-hall.webp", alt: "Scouts in uniform sharing a meal in the camp dining hall" },
  ] },
  { id: "sea-base", title: "Find your own current.", category: "water", label: "PADDLING & HIGH ADVENTURE", image: "images/albums/sea-base/paddling-at-sunset.webp", alt: "Scouts wearing life jackets gathered on kayaks and paddleboards beneath a glowing evening sky", description: "Paddles out, fishing lines ready, and an ocean horizon ahead. A few favorite moments from our Sea Base adventure.", photos: [
    { src: "images/albums/sea-base/paddling-at-sunset.webp", alt: "Scouts wearing life jackets gathered on kayaks and paddleboards beneath a glowing evening sky" },
    { src: "images/albums/sea-base/kayak-launch.webp", alt: "Scouts in life jackets gathered in colorful kayaks near a dock" },
    { src: "images/albums/sea-base/fishing.webp", alt: "A Scout smiling while holding a fish aboard a boat" },
    { src: "images/albums/sea-base/ocean-sunset.webp", alt: "A warm sunset above calm ocean water" },
  ] },
  { id: "marine-stewardship", title: "Leave it better.", category: "service", label: "MARINE SCIENCE & STEWARDSHIP", image: "images/albums/marine-stewardship/coral-team.webp", alt: "Scouts gathered beside outdoor coral nursery tanks", description: "Getting hands-on at a coral nursery and learning about the water and wildlife we're here to care for.", photos: [
    { src: "images/albums/marine-stewardship/coral-team.webp", alt: "Scouts gathered beside outdoor coral nursery tanks" },
    { src: "images/albums/marine-stewardship/coral-nursery.webp", alt: "Scouts learning beside trays of coral fragments in a nursery tank" },
    { src: "images/albums/marine-stewardship/water-quality.webp", alt: "Scouts examining a water sample during a hands-on marine science activity" },
    { src: "images/albums/marine-stewardship/hands-on-learning.webp", alt: "Scouts and an instructor working together at an outdoor marine learning station" },
  ] },
];
