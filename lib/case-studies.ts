/** A phone screenshot shown in a device frame. */
export type Screen = { src: string; alt: string; caption?: string };

export type CaseStudy = {
  slug: string;
  /** One sentence under the title: what it is and what was done. */
  tagline: string;
  meta: Array<{ label: string; value: string }>;
  links?: Array<{ label: string; href: string; note?: string }>;
  /**
   * A short screen recording of the app in use, shown above the links. Most
   * reviewers won't install an APK, so this is the main demo once it exists.
   * Put the file in /public, e.g. "/projects/healthhub-v2/walkthrough.mp4".
   */
  video?: { src: string; poster?: string; caption?: string };
  /** The project's own brand colours, used for the hero panel and swatches. */
  brand: { primary: string; tint: string };
  hero: Screen[];
  /** The short version, for readers who only skim. */
  tldr: Array<{ value: string; label: string }>;
  context: { problem: string[]; honesty: string };
  assumptions: Array<{ title: string; body: string }>;
  references: string;
  flows: Array<{ title: string; body: string; screens: Screen[] }>;
  decisions: Array<{ title: string; why: string; tradeoff?: string; screen: Screen }>;
  iteration: {
    intro: string;
    pairs: Array<{ before: Screen; after: Screen; note: string }>;
    review?: { title: string; body: string; fixes: string[] };
  };
  system: {
    colors: Array<{ name: string; hex: string; role: string }>;
    type: string;
    note: string;
  };
  build: { intro: string; stack: string[]; points: Array<{ title: string; body: string }> };
  outcome: {
    metrics: Array<{ value: string; label: string }>;
    next: string[];
    lesson: string;
  };
};

const HH = (n: string) => `/projects/healthhub-v2/${n}.webp`;
const WF = (n: string) => `/projects/wayfare-v2/${n}.webp`;

export const caseStudies: Record<string, CaseStudy> = {
  healthhub: {
    slug: "healthhub",
    tagline:
      "A family health app I designed in Figma, then built and shipped myself as a working Android app with a real backend.",
    meta: [
      { label: "Role", value: "Solo product designer and developer" },
      { label: "Timeline", value: "2025 concept, rebuilt and shipped Nov 2026" },
      { label: "Platform", value: "Android, iOS and web (Expo)" },
      { label: "Type", value: "Self-initiated concept" },
    ],
    // TODO(Sreeraj): record a 60–90s walkthrough of the main flow and add it:
    // video: { src: "/projects/healthhub-v2/walkthrough.mp4", poster: "/projects/healthhub-v2/home.webp", caption: "60-second walkthrough" },
    links: [
      {
        label: "Android demo (APK)",
        href: "https://expo.dev/accounts/sreerajh/projects/healthhub/builds/b35526d4-75e7-4168-b37f-1922fb397516",
        note: "Tap “Try the demo” on the sign-in screen. Sample data only.",
      },
    ],
    brand: { primary: "#1F2E5C", tint: "#EEF0FF" },
    hero: [
      { src: HH("records"), alt: "HealthHub Records tab filtered by family member" },
      { src: HH("home"), alt: "HealthHub Home with family switcher and a navy ‘coming up’ card" },
      { src: HH("doctor-book"), alt: "HealthHub slot picker for a paediatrician with Kabir selected" },
    ],
    tldr: [
      { value: "4", label: "Assumptions written down before any screen" },
      { value: "9", label: "Must-fix issues from a design review, all fixed before shipping" },
      { value: "37", label: "Screens designed and built" },
      { value: "1 tap", label: "Demo sign-in on a real APK" },
    ],
    context: {
      problem: [
        "In many Indian homes one person, usually a parent, looks after the health of three to five people from one phone. Reports arrive on WhatsApp, prescriptions end up in a drawer, and the next vaccine date lives in someone’s memory.",
        "HealthHub puts the whole family in one calm place: who is due for what, every record sorted by person and date, booking a doctor or a home lab test, and medicine reminders you can tick off from the lock screen.",
      ],
      honesty:
        "This is a self-initiated project. I didn’t run user interviews, so instead of inventing research I wrote down my assumptions, designed against them, and pressure-tested the result by using the app on my own phone and running a structured design review before shipping.",
    },
    assumptions: [
      {
        title: "One phone, many patients",
        body: "Every screen has to answer “for whom?” before anything else. Getting the person wrong is worse than a slow flow.",
      },
      {
        title: "The clinic counter is the real test",
        body: "The moment that matters is a receptionist asking for last month’s report. Finding it has to take seconds, not a scroll through WhatsApp.",
      },
      {
        title: "Health data feels risky",
        body: "People should see exactly what they’ve agreed to, be asked at the moment it matters, and be able to take it back.",
      },
      {
        title: "Not everyone is a power user",
        body: "Large type, plain words, one primary action per screen. Built for the parent, not just for me.",
      },
    ],
    references:
      "Reference points: Practo and Apollo 24/7 for booking patterns, Google Pay’s avatar row for switching people, and the DocNow and Elli concepts on Behance for a calmer, more modern visual direction.",
    flows: [
      {
        title: "Know what’s next",
        body: "Home opens on the person you’re looking after. The next thing due gets the one loud card; everything else stays quiet underneath.",
        screens: [
          { src: HH("home"), alt: "Home screen", caption: "Family switcher and the next appointment" },
          { src: HH("home-2"), alt: "Home screen scrolled", caption: "That person’s latest records" },
          { src: HH("notifications"), alt: "Notifications", caption: "Reports, vaccines and bookings in one feed" },
        ],
      },
      {
        title: "Find any record in seconds",
        body: "Records are filtered by person and type, grouped by month, and every record can be shared or saved as a PDF to hand over at the counter.",
        screens: [
          { src: HH("records"), alt: "Records list", caption: "Filter by person, then by type" },
          { src: HH("record"), alt: "Record details", caption: "Details plus Share and Save as PDF" },
          { src: HH("upload"), alt: "Upload a record", caption: "Camera, gallery or PDF, tagged to a person" },
        ],
      },
      {
        title: "Book a doctor or a home lab test",
        body: "Specialties in plain words, honest “next available” times, and a slot picker that already knows who the appointment is for.",
        screens: [
          { src: HH("specialties"), alt: "Choose a specialty", caption: "Plain-language specialties" },
          { src: HH("doctors"), alt: "Doctor list", caption: "Fees and next slot up front" },
          { src: HH("doctor-book"), alt: "Pick a time", caption: "Patient chosen before the time" },
          { src: HH("lab"), alt: "Lab package", caption: "Fasting and report time, before you pay" },
        ],
      },
      {
        title: "Privacy you can see",
        body: "Consent is split by purpose and can be withdrawn at any time. You can download everything as a zip, or delete the account and all its files.",
        screens: [
          { src: HH("privacy"), alt: "Privacy and data", caption: "Each purpose has its own switch" },
          { src: HH("profile"), alt: "Profile", caption: "Family, bookings and reminders at a glance" },
          { src: HH("reminder-new"), alt: "Add a reminder", caption: "Reminders by meal time, not by clock" },
        ],
      },
    ],
    decisions: [
      {
        title: "Ask “for whom?” first, and guess well",
        why: "Every booking, upload and reminder starts with the family member. The slot picker pre-selects someone the specialty actually sees, so a paediatrician defaults to a child and a gynaecologist to a woman, with a gentle warning if you change it.",
        tradeoff: "One extra row on every form, in exchange for never filing a report under the wrong person.",
        screen: { src: HH("doctor-book"), alt: "Slot picker with patient chips" },
      },
      {
        title: "Only the next thing is loud",
        why: "The first ‘coming up’ item becomes a navy hero card with one lime chip for the time. It is the only dark surface on Home, so your eye lands on it before anything else.",
        tradeoff: "Later items are deliberately plain. Home is a to-do list, not a dashboard.",
        screen: { src: HH("home"), alt: "Home with the navy hero card" },
      },
      {
        title: "Consent at the moment it matters",
        why: "Instead of a wall of checkboxes at sign-up, HealthHub asks for family, records or booking consent the first time you actually do that thing, then keeps every switch in one Privacy screen.",
        tradeoff: "More states to design and test, but every ask has an obvious reason behind it.",
        screen: { src: HH("privacy"), alt: "Privacy and data settings" },
      },
      {
        title: "Lab facts before the price",
        why: "Fasting rules, report time and home collection sit above the fold on every package, because “do I need to skip breakfast?” is the first question people ask.",
        screen: { src: HH("lab"), alt: "Lab package details" },
      },
    ],
    iteration: {
      intro:
        "The first version was a Figma concept from 2025. When I rebuilt it as a real app, most of its screens didn’t survive contact with real data.",
      pairs: [
        {
          before: { src: "/projects/healthyhub/screen-1.png", alt: "v1 Home with promo banners" },
          after: { src: HH("home"), alt: "v2 Home" },
          note: "v1’s Home was two promo banners. v2 leads with whose day it is and what’s next.",
        },
        {
          before: { src: "/projects/healthyhub/screen-2.png", alt: "v1 Records with a single card" },
          after: { src: HH("records"), alt: "v2 Records" },
          note: "One record per screen became a filterable, month-grouped list.",
        },
        {
          before: { src: "/projects/healthyhub/screen-5.png", alt: "v1 Profiles" },
          after: { src: HH("family"), alt: "v2 Family" },
          note: "Profiles now carry what you need at a glance: age, blood group, and what’s due.",
        },
      ],
      review: {
        title: "A design review before shipping",
        body: "With the build working, I reviewed it the way a senior designer would review someone else’s work, comparing the palette against DocNow and Elli. It produced nine must-fix issues, all fixed before the APK.",
        fixes: [
          "Deepened the navy from #3A4F7A to #1F2E5C and added one soft lime highlight per screen",
          "‘Taken’ is only offered from 60 minutes before a dose, so it can’t be tapped by accident",
          "‘Overdue’ moved onto its own line so it no longer crowds the buttons",
          "Next-available times use the same one-hour notice as booking, so they never lie",
          "Records without files say so plainly instead of showing an empty paperclip",
        ],
      },
    },
    system: {
      colors: [
        { name: "Navy", hex: "#1F2E5C", role: "Primary, hero card, buttons" },
        { name: "Mist", hex: "#F1F3F8", role: "App background" },
        { name: "Lavender", hex: "#EEF0FF", role: "Home greeting only" },
        { name: "Lime", hex: "#E4F98A", role: "One highlight per screen" },
        { name: "Teal", hex: "#0F7A68", role: "Positive health actions" },
      ],
      type: "Instrument Sans, set large with generous line height for older eyes",
      note: "Navy reads as trustworthy without the cold hospital blue. Lime is rationed: if everything is highlighted, nothing is.",
    },
    build: {
      intro:
        "I built it myself to find out where the design breaks, and it broke in useful places: empty states, slow networks, permission prompts, and what happens after a notification is tapped.",
      stack: ["Figma", "Expo", "React Native", "TypeScript", "Supabase", "EAS"],
      points: [
        { title: "Real data, private by default", body: "Postgres with row-level security on all 13 tables; record files sit in private storage." },
        { title: "Booking on the server", body: "Edge Functions hold slots, price bookings and handle cancel or reschedule, so the app can’t double-book." },
        { title: "Reminders that work offline", body: "Local notifications with Taken and Skip actions straight from the lock screen." },
        { title: "Protection where it counts", body: "Optional fingerprint lock, screenshot blocking on records, and an offline banner." },
        { title: "Your data, your call", body: "One-tap export of everything as a zip, and full account deletion." },
        { title: "Shipped", body: "Built with EAS into an installable APK, with a one-tap demo account for reviewers." },
      ],
    },
    outcome: {
      metrics: [
        { value: "37", label: "Screens built" },
        { value: "9", label: "Review fixes shipped" },
        { value: "APK", label: "Running on a real phone" },
      ],
      next: [
        "Test with five real families, focusing on the person switcher and the consent prompts",
        "Hindi and Malayalam, with larger text as a first-class setting",
        "Link to ABHA so records can come straight from labs and hospitals",
      ],
      lesson:
        "Designing it in Figma taught me the screens. Building it taught me the states: loading, empty, offline, denied, overdue. That is where most of the real design work was.",
    },
  },

  wayfare: {
    slug: "wayfare",
    tagline:
      "A travel app I redesigned from my own first concept, then built end to end, from discovering a city to a server-priced booking.",
    meta: [
      { label: "Role", value: "Solo product designer and developer" },
      { label: "Timeline", value: "2025 concept, redesigned and built Nov 2026" },
      { label: "Platform", value: "Android, iOS and web (Expo)" },
      { label: "Type", value: "Self-initiated concept" },
    ],
    // TODO(Sreeraj): record a 60–90s walkthrough of the main flow and add it:
    // video: { src: "/projects/wayfare-v2/walkthrough.mp4", poster: "/projects/wayfare-v2/home.webp", caption: "60-second walkthrough" },
    links: [
      {
        label: "Android demo (APK)",
        href: "https://expo.dev/artifacts/eas/8p7EdVSZGV-nvEvOSIA4q9m3WpIBZF1HPAx9MU7yYII.apk",
        note: "Browse as a guest, or sign in with an email code to book.",
      },
    ],
    brand: { primary: "#0B6B55", tint: "#E6F6F0" },
    hero: [
      { src: WF("destination"), alt: "Wayfare Tokyo destination screen" },
      { src: WF("home"), alt: "Wayfare Home with destination cards" },
      { src: WF("experience-2"), alt: "Wayfare day-by-day itinerary" },
    ],
    tldr: [
      { value: "9", label: "v1 screens rebuilt after critiquing my own concept" },
      { value: "19", label: "Screens built in Expo" },
      { value: "4", label: "Assumptions written down before any screen" },
      { value: "OTA", label: "Design updates without a reinstall" },
    ],
    context: {
      problem: [
        "Planning a trip means hopping between apps: inspiration on Instagram, tours on one site, dates in a calendar, tickets buried in email. Each hop costs confidence.",
        "Wayfare keeps one path: find a place, understand exactly what a trip includes day by day, see the real total, book, and keep the ticket.",
      ],
      honesty:
        "Self-initiated, with no user research. I started from my own 2025 concept, critiqued it as if it were someone else’s, and rebuilt it in Figma and then in code.",
    },
    assumptions: [
      { title: "Inspiration first, certainty second", body: "People browse with photos, then need hard facts (days, inclusions, price) before they commit." },
      { title: "Price surprises kill trust", body: "Show the per-person price and the real total, taxes included, before the Book button." },
      { title: "Itineraries are read on the move", body: "One day at a time, collapsible, with the next step obvious." },
      { title: "Browsing shouldn’t need an account", body: "Sign-in is asked for only when saving or booking." },
    ],
    references:
      "Reference points: Airbnb Experiences for trust signals, GetYourGuide for inclusions and cancellation, and editorial travel magazines for type-led layouts.",
    flows: [
      {
        title: "Discover",
        body: "Region chips, big photographic cards and ‘most popular’ and ‘best value’ rails, with search one tap away.",
        screens: [
          { src: WF("home"), alt: "Home", caption: "Destinations by region" },
          { src: WF("home-2"), alt: "Home rails", caption: "Popular and best-value rails" },
          { src: WF("search"), alt: "Search", caption: "Every destination, filterable" },
        ],
      },
      {
        title: "Decide",
        body: "A destination page with ratings you can read, popular experiences, and real reviews with dates and home towns.",
        screens: [
          { src: WF("destination"), alt: "Destination", caption: "One city, one story" },
          { src: WF("destination-2"), alt: "Reviews", caption: "Reviews with context" },
          { src: WF("experience"), alt: "Experience", caption: "Highlights and free cancellation up front" },
        ],
      },
      {
        title: "Know the plan, then book",
        body: "The itinerary lives inside the experience, a day at a time. What’s included is shown with photos, and the date picker suggests the next good weekend.",
        screens: [
          { src: WF("experience-2"), alt: "Itinerary", caption: "Day by day, one open at a time" },
          { src: WF("experience-3"), alt: "What’s included", caption: "Inclusions and exclusions, honestly" },
          { src: WF("book"), alt: "Dates and travellers", caption: "Smart default dates and a live total" },
        ],
      },
    ],
    decisions: [
      {
        title: "Type does the work",
        why: "Instrument Sans at display sizes carries the hierarchy, so the UI needs very little chrome. One pine green is the only action colour, kept for actions.",
        tradeoff: "Swapped v1’s icon-only black tab bar for labelled tabs. It’s less striking, but nobody has to guess.",
        screen: { src: WF("home"), alt: "Wayfare home" },
      },
      {
        title: "The price you see is the price you pay",
        why: "A sticky footer shows the price per person and the total for your group, taxes included. The server calculates the final price (children half price, 5% tax), so what the app shows and what you pay always match.",
        screen: { src: WF("experience"), alt: "Experience with sticky price footer" },
      },
      {
        title: "The itinerary is part of the product",
        why: "In v1 the itinerary was a separate screen. Now it sits inside the experience as a numbered, collapsible timeline, so you understand the trip before you book it.",
        screen: { src: WF("experience-2"), alt: "Itinerary timeline" },
      },
      {
        title: "Dates that think for you",
        why: "The date picker opens on the next weekend that fits the trip’s length and explains why. Weekend starts are marked as popular, so you see demand without a scarcity banner.",
        screen: { src: WF("book"), alt: "Date and traveller picker" },
      },
    ],
    iteration: {
      intro:
        "v1 looked good in a Dribbble shot but left real questions unanswered: how much is it, what’s included, which tab is which? The redesign added 19 screens and rebuilt 9.",
      pairs: [
        {
          before: { src: "/projects/wayfare/screen-1.png", alt: "v1 Home" },
          after: { src: WF("home"), alt: "v2 Home" },
          note: "Icon-only nav became labelled tabs; one hero card became a browsable row with ratings.",
        },
        {
          before: { src: "/projects/wayfare/screen-2.png", alt: "v1 Tokyo" },
          after: { src: WF("destination"), alt: "v2 Tokyo" },
          note: "The same structure, with clearer reviews, a save action and a calmer photo treatment.",
        },
        {
          before: { src: "/projects/wayfare/screen-3.png", alt: "v1 Itinerary" },
          after: { src: WF("experience-2"), alt: "v2 Itinerary" },
          note: "Day cards became a numbered timeline with photos, plus a price and Book button that stay visible.",
        },
      ],
    },
    system: {
      colors: [
        { name: "Pine", hex: "#0B6B55", role: "Actions and selection" },
        { name: "Charcoal", hex: "#1E1F21", role: "Type, tab bar, splash" },
        { name: "Paper", hex: "#FFFFFF", role: "Surfaces" },
        { name: "Mint", hex: "#27C197", role: "Logo and small highlights" },
      ],
      type: "Instrument Sans, 400 to 700, display sizes for places and dates",
      note: "Photography carries the colour. The interface stays quiet so the destination can be loud.",
    },
    build: {
      intro:
        "Building it forced decisions Figma let me postpone: what a guest can do, how prices are calculated, and what the itinerary looks like with real, uneven content.",
      stack: ["Figma", "Expo", "React Native", "TypeScript", "Supabase", "EAS Update"],
      points: [
        { title: "Real catalog", body: "Destinations, experiences, itineraries and reviews in Postgres, across 13 migrations." },
        { title: "Booking on the server", body: "An Edge Function prices and creates every booking. The app never sends a price." },
        { title: "Sign-in when it matters", body: "Email codes and Google sign-in, asked for only when you save or book." },
        { title: "Light and dark themes", body: "A token-based theme, with a first-run tour of the key features." },
        { title: "Ships like a product", body: "APK builds plus over-the-air updates, so design changes reach the phone without a reinstall." },
      ],
    },
    outcome: {
      metrics: [
        { value: "28", label: "Figma screens redesigned" },
        { value: "19", label: "Screens built" },
        { value: "Server", label: "Sets every price; the app never sends one" },
      ],
      next: [
        "Test the booking path with five travellers and time each step",
        "Real payments, then offline tickets for the day of travel",
        "A shared trip, so friends can plan together",
      ],
      lesson:
        "Critiquing my own v1 was harder than starting fresh, and far more useful. Most of the improvements weren’t visual; they were the answers v1 never gave.",
    },
  },
};

export function getCaseStudy(slug: string) {
  return caseStudies[slug] ?? null;
}
