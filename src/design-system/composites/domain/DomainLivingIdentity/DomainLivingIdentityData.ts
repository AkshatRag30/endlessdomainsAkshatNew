import { PiPauseCircleBold, PiSealCheckBold, PiTrendUpBold, PiWalletBold } from 'react-icons/pi'

// The 8 orbit nodes, evenly spaced around the ring (0° = top, clockwise) — matches the
// Figma network's own 8-point layout. Each gets its own sway/breathe timing below so the
// ring reads as an organic network, not a spinner (see .orbitSlot / .orbitArm in the scss).
// Labels pulled from the site's real TLD catalog (src/data/allTlds.ts) — a spread across
// providers/chains instead of 8 copies of the same TLD, so the ring reads as "every
// identity, everywhere" rather than repeating one namespace.
export const ORBIT_NODES = [
  { id: 'tld-og', label: '.og', angle: 0, swayDuration: 15, breatheDuration: 9 },
  { id: 'tld-eth', label: '.eth', angle: 45, swayDuration: 18, breatheDuration: 11 },
  { id: 'tld-sol', label: '.sol', angle: 90, swayDuration: 13, breatheDuration: 8 },
  { id: 'tld-bnb', label: '.bnb', angle: 135, swayDuration: 20, breatheDuration: 12 },
  { id: 'tld-arb', label: '.arb', angle: 180, swayDuration: 16, breatheDuration: 10 },
  { id: 'tld-ton', label: '.ton', angle: 225, swayDuration: 14, breatheDuration: 13 },
  { id: 'tld-box', label: '.box', angle: 270, swayDuration: 19, breatheDuration: 9.5 },
  { id: 'tld-x', label: '.x', angle: 315, swayDuration: 17, breatheDuration: 11.5 },
]

export interface ActivityRow {
  id: string
  Icon: typeof PiWalletBold
  title: string
  desc: string
  value: string
}

// Exact copy from Figma — the four rows the activity panel cycles through.
export const ACTIVITY_ROWS: ActivityRow[] = [
  { id: 'payment', Icon: PiWalletBold, title: 'Payment received', desc: 'paid to alex.og, no address needed', value: '+0.42 ETH' },
  { id: 'parked', Icon: PiPauseCircleBold, title: 'Domain parked', desc: 'earning on offers while you hold', value: '2 offers' },
  { id: 'marketplace', Icon: PiTrendUpBold, title: 'Marketplace value rising', desc: 'digital real estate that appreciates', value: '+18%' },
  { id: 'reputation', Icon: PiSealCheckBold, title: 'Reputation building', desc: 'wallet history → portable score', value: '+38' },
]

// Fixed "ticking clock" rhythm — rotate, stop, rotate, stop, on a steady beat rather
// than the irregular random pause this used to be. Kept in one place since the ring's
// CSS transition duration (.orbitRing / .orbitNode in the stylesheet) needs to stay
// shorter than this so each tick visibly settles before the next one fires.
export const ACTIVITY_TICK_INTERVAL_MS = 2000
