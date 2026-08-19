import { PiPauseCircleBold, PiSealCheckBold, PiTrendUpBold, PiWalletBold } from 'react-icons/pi'

// The 8 orbit nodes, evenly spaced around the ring (0° = top, clockwise) — matches the
// Figma network's own 8-point layout. Each gets its own sway/breathe timing below so the
// ring reads as an organic network, not a spinner (see .orbitSlot / .orbitArm in the scss).
export const ORBIT_NODES = [
  { id: 'og-1', label: '.og', angle: 0, swayDuration: 15, breatheDuration: 9 },
  { id: 'og-2', label: '.og', angle: 45, swayDuration: 18, breatheDuration: 11 },
  { id: 'og-3', label: '.og', angle: 90, swayDuration: 13, breatheDuration: 8 },
  { id: 'og-4', label: '.og', angle: 135, swayDuration: 20, breatheDuration: 12 },
  { id: 'og-5', label: '.og', angle: 180, swayDuration: 16, breatheDuration: 10 },
  { id: 'og-6', label: '.og', angle: 225, swayDuration: 14, breatheDuration: 13 },
  { id: 'og-7', label: '.og', angle: 270, swayDuration: 19, breatheDuration: 9.5 },
  { id: 'og-8', label: '.og', angle: 315, swayDuration: 17, breatheDuration: 11.5 },
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

// Irregular pause between activity events (requirement: "not a perfectly mechanical
// interval") — each entry is [minMs, maxMs] for the pause AFTER that row settles.
export const ACTIVITY_PAUSE_RANGE: [number, number] = [1400, 2000]
