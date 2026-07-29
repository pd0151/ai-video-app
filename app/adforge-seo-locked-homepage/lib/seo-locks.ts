/**
 * PERMANENT SEO LOCKS
 *
 * These values are the approved primary SEO signals for AdForge.
 * Do not edit them during page redesigns, visual updates or content additions.
 * Only change them when the site owner deliberately approves a new SEO strategy.
 */

export const HOME_SEO = Object.freeze({
  title:
    "24 Hour Mobile Tyre Fitting & Vehicle Recovery | Liverpool | AdForge",
  h1: "24 Hour Mobile Tyre Fitting & Vehicle Recovery",
  description:
    "Find 24-hour mobile tyre fitting, emergency tyre repair, puncture repairs, locking wheel nut removal, wheel balancing, new and part-worn tyres, breakdown recovery, vehicle recovery, roadside assistance and emergency call-outs across Liverpool, Wirral and Merseyside.",
  canonical: "https://adforge.uk/",
} as const);

/**
 * Stable templates for future service/location pages.
 * Existing database values should not be overwritten automatically.
 */
export const SEO_PAGE_PATTERNS = Object.freeze({
  mobileTyre: {
    title: (location: string) =>
      `24 Hour Mobile Tyre Fitting ${location} | Emergency Tyres | AdForge`,
    h1: (location: string) => `24 Hour Mobile Tyre Fitting ${location}`,
  },
  vehicleRecovery: {
    title: (location: string) =>
      `24 Hour Vehicle Recovery ${location} | Breakdown Recovery | AdForge`,
    h1: (location: string) => `24 Hour Vehicle Recovery ${location}`,
  },
} as const);
