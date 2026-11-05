export type CaseStudy = {
  slug: string;
  problem: string[];
  research: string[];
  decisions: Array<{ title: string; body: string; image: string; imageAlt: string }>;
  gallery: Array<{ src: string; alt: string; caption?: string }>;
  outcome: {
    /** caption: one line of context shown under the figure. */
    metrics: Array<{ label: string; value: string; caption?: string }>;
    lessons: string;
  };
  cover: string;
  coverAlt: string;
};

const WAYFARE = {
  loading: "/projects/wayfare/Wayfare-Loading-Screen.png",
  instrumentSans: "/projects/wayfare/Instrument_Sans.png",
  cards: "/projects/wayfare/Editorial-destination-cards.png",
  itinerary: "/projects/wayfare/Itinerary.png",
};

const HEALTH = {
  loading: "/projects/healthyhub/HealthHub-Loading-Screen.png",
  color: "/projects/healthyhub/Color-code.png",
  profiles: "/projects/healthyhub/Profiles.png",
  records: "/projects/healthyhub/Records.png",
};

export const caseStudies: Record<string, CaseStudy> = {
  wayfare: {
    slug: "wayfare",
    cover: WAYFARE.loading,
    coverAlt: "Wayfare loading screen with the app logo",
    problem: [
      "Travelers today juggle five or more apps to plan a single trip: flights in one, stays in another, itinerary in Notes, tickets buried in email. The cognitive overhead kills the joy of planning a trip across Asia.",
      "Wayfare's goal was to collapse the whole trip flow, from destination discovery to day-of boarding, into a single calm, type-led app with a high-contrast white-and-dark aesthetic and editorial-style destination cards.",
    ],
    research: [
      "12 user interviews with frequent travelers planning 7+ day trips across South and Southeast Asia.",
      "Top frustration: switching contexts between booking apps to find reference numbers on day of travel.",
      "Users wanted a single chronological view of a trip. Not dashboards, not tabs.",
      "Confidence came from typography and whitespace, not from feature count or iconography.",
    ],
    decisions: [
      {
        title: "Instrument Sans as the voice",
        body: "Set Instrument Sans at display scale for city names, dates, and section labels. The type does almost all of the UI work, so there is very little chrome.",
        image: WAYFARE.instrumentSans,
        imageAlt: "Instrument Sans type specimen used across Wayfare",
      },
      {
        title: "Editorial destination cards",
        body: "Discover surfaces full-bleed photography of Asian destinations like Bali, Kyoto, Da Nang and Hoi An, with a single line of copy. Each card is a full tap target.",
        image: WAYFARE.cards,
        imageAlt: "Wayfare editorial destination cards with full-bleed photography",
      },
      {
        title: "Itinerary as a single scroll",
        body: "Replaced the typical tabbed trip IA with one vertical itinerary. Every flight, stay, and activity sits in chronological order, and day-of mode promotes the next item.",
        image: WAYFARE.itinerary,
        imageAlt: "Wayfare itinerary as a single chronological scroll",
      },
    ],
    gallery: [
      { src: "/projects/wayfare/screen-1.png", alt: "Wayfare home screen: greeting, destination search, region filters and a Tokyo destination card" },
      { src: "/projects/wayfare/screen-2.png", alt: "Wayfare Tokyo destination screen with a pagoda photo, rating, description and popular experiences" },
      { src: "/projects/wayfare/screen-3.png", alt: "Wayfare 3-day Tokyo itinerary, one card per day" },
      { src: "/projects/wayfare/screen-4.png", alt: "Wayfare tour inclusions: accommodation, local transport, guided city tours and daily breakfast" },
      { src: "/projects/wayfare/screen-5.png", alt: "Wayfare Your trips screen with a confirmed Tokyo trip and a QR ticket" },
      { src: "/projects/wayfare/screen-6.png", alt: "Wayfare More menu: profile, payment methods, notifications, help and settings" },
    ],
    outcome: {
      metrics: [
        { label: "Taps to ticket", value: "3 → 1" },
        { label: "Tested with", value: "8 users" },
        { label: "Screens designed", value: "36" },
      ],
      lessons:
        "The itinerary is the product. Instrument Sans at display scale replaces most of what a chrome-heavy travel app would have used. The rest is whitespace and photography.",
    },
  },
  healthhub: {
    slug: "healthhub",
    cover: HEALTH.loading,
    coverAlt: "HealthHub loading screen with the app logo",
    problem: [
      "Indian families share one phone, one set of health records, and zero source of truth. Reports live in WhatsApp, prescriptions in drawers, and appointments in memory.",
      "HealthHub is one calm home for the family's profiles, appointments, and records, built on a trustworthy deep-blue (#3A4F7A) palette designed to read as medical without feeling clinical.",
    ],
    research: [
      "6 contextual interviews with Indian households across Tier 1 and Tier 2 cities.",
      "Primary user: the 40 to 55 year old parent managing care for 3 or 4 family members.",
      "Most failure points happened at the clinic counter: 'which report, from which day, for which member?'",
      "Users expected a UPI-style profile switcher at the top of every screen, not a dropdown.",
    ],
    decisions: [
      {
        title: "#3A4F7A as the single anchor",
        body: "One deep-blue primary drives every surface, from the profile header to the appointment CTAs. No gradients, no secondary brand colors. It reads as trustworthy and clinical in the same breath.",
        image: HEALTH.color,
        imageAlt: "HealthHub colour palette built on deep blue #3A4F7A",
      },
      {
        title: "Profiles at the top of every screen",
        body: "A UPI-style avatar row sits above the fold on every tab. Whose profile is active is never a guess. It is always the first thing you see.",
        image: HEALTH.profiles,
        imageAlt: "HealthHub family profile avatars along the top of the screen",
      },
      {
        title: "Records as the backbone",
        body: "A dedicated Records tab stores prescriptions, lab reports, and discharge summaries, sortable by member and by date, with full-bleed viewing on tap.",
        image: HEALTH.records,
        imageAlt: "HealthHub Records tab listing prescriptions and lab reports",
      },
    ],
    gallery: [
      { src: "/projects/healthyhub/screen-1.png", alt: "HealthHub home screen with a search bar, quick actions for consults, lab tests, vaccines and pet care, and lab report and booking banners" },
      { src: "/projects/healthyhub/screen-2.png", alt: "HealthHub Records screen showing an immunization record for Joseph Carper" },
      { src: "/projects/healthyhub/screen-3.png", alt: "HealthHub Appointments screen with an annual checkup and reschedule and cancel buttons" },
      { src: "/projects/healthyhub/screen-4.png", alt: "HealthHub Appointments empty state: no appointments scheduled" },
      { src: "/projects/healthyhub/screen-5.png", alt: "HealthHub Profiles screen with cards for three family members" },
      { src: "/projects/healthyhub/screen-6.png", alt: "HealthHub Settings screen: account, preferences, privacy and support, log out" },
    ],
    outcome: {
      metrics: [
        { label: "Screens designed", value: "42" },
        {
          label: "Usability pass rate",
          value: "6/6",
          caption: "From an early usability round with 6 participants.",
        },
        { label: "Average onboarding", value: "52s" },
      ],
      lessons:
        "When one phone serves a family, the avatar row is the most important pattern in the app. A single blue and a single typeface did more than any decorative system could.",
    },
  },
};

export function getCaseStudy(slug: string) {
  return caseStudies[slug] ?? null;
}
