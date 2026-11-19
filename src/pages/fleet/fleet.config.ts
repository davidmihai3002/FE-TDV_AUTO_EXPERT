/**
 * [NOT IN DESIGN] parts of /flota (ticket 06 §1, Q7). Flip to `false` if the designer rejects them.
 * Booking is mandatory (plan §9 D3) and is not behind a flag.
 */
export const FLEET_UI = {
  showFilters: true,
  showStats: true,
  showInstructor: true,
} as const;
