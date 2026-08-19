// Pool of technical/data-event strings shown as background "packets" behind the main
// counter — see DomainOnchainStats.tsx. Mixes readable event names with intentionally
// terse hex/technical fragments so the layer reads as live chain noise, not UI copy.

export function randomInt(min: number, max: number) {
  return Math.floor(min + Math.random() * (max - min))
}

function randomHex(length: number) {
  let out = ''
  for (let i = 0; i < length; i++) out += Math.floor(Math.random() * 16).toString(16)
  return out
}

const EVENT_TEMPLATES: Array<() => string> = [
  () => 'IDENTITY_MINT',
  () => `BLOCK #${randomInt(19200000, 19999999)}`,
  () => 'WALLET_CONNECTED',
  () => 'DOMAIN_MINTED',
  () => `0x${randomHex(4)}...${randomHex(4).toUpperCase()}`,
  () => 'TX CONFIRMED',
  () => 'IDENTITY_REGISTERED',
  () => 'CHAIN_SYNC',
  () => 'MINT_SUCCESS',
  () => 'BLOCK VERIFIED',
  () => 'TLD REGISTERED',
  () => 'ONCHAIN_EVENT',
  () => randomHex(5).toUpperCase(),
  () => `0x${randomHex(5)}`,
  () => `BLOCK_${randomInt(90000, 99999)}`,
  () => 'MINT//SUCCESS',
  () => `SYNC_0${randomInt(1, 9)}`,
  () => `TX_${randomHex(4).toUpperCase()}`,
]

export function pickRandomEvent(): string {
  return EVENT_TEMPLATES[randomInt(0, EVENT_TEMPLATES.length)]()
}

export interface DataSlotConfig {
  id: string
  // percentage position within the section's decorative canvas — kept well outside the
  // central label/number/sub-label column (roughly 30%–72% horizontally, 22%–58%
  // vertically at desktop) so a slot can never render on top of the primary metric.
  top: string
  side: 'left' | 'right'
  offset: string
  align: 'left' | 'right'
  // 'core' slots stay on at every breakpoint; 'wide' slots only render tablet-up, and
  // 'desktop' slots only render on desktop-up — this is how the background layer thins
  // out on small screens instead of overlapping the number (see requirement #14).
  tier: 'core' | 'wide' | 'desktop'
}

export const DATA_SLOTS: DataSlotConfig[] = [
  { id: 'slot-top-left', top: '10%', side: 'left', offset: '3%', align: 'left', tier: 'core' },
  { id: 'slot-top-right', top: '10%', side: 'right', offset: '3%', align: 'right', tier: 'core' },
  { id: 'slot-mid-left', top: '46%', side: 'left', offset: '2%', align: 'left', tier: 'wide' },
  { id: 'slot-mid-right', top: '46%', side: 'right', offset: '2%', align: 'right', tier: 'wide' },
  { id: 'slot-low-left', top: '80%', side: 'left', offset: '9%', align: 'left', tier: 'desktop' },
  { id: 'slot-low-right', top: '80%', side: 'right', offset: '9%', align: 'right', tier: 'desktop' },
]
