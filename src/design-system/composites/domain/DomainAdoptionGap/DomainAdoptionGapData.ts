// Content pools for the ambient wallet-address markers around the adoption bar — see
// DomainAdoptionGap.tsx. Two kinds: plain addresses that just cycle (the unresolved 80%
// gray market), and address→identity pairs that resolve into a human-readable name (the
// identity layer Endless Domains is building).

export function randomInt(min: number, max: number) {
  return Math.floor(min + Math.random() * (max - min))
}

// Ambient, never resolve — these sit in the gray "untapped market" region.
export const AMBIENT_ADDRESSES: string[] = ['0x8C21...91D', '0x42F8...A71', '0x91BD...20C', '0xA91C...7D20', '0xF3D6...B48E', '0x2E77...C915']

// Resolve into an identity — these sit at/near the blue "identity adoption" edge.
export const TRANSFORM_PAIRS: Array<{ address: string; identity: string }> = [
  { address: '0x71A9...82F', identity: 'alice.og' },
  { address: '0x8C21...91D', identity: 'alex.eth' },
  { address: '0x42F8...A71', identity: 'name.sol' },
]

export function pickAmbientAddress(exclude?: string): string {
  const pool = exclude ? AMBIENT_ADDRESSES.filter(a => a !== exclude) : AMBIENT_ADDRESSES
  return pool[randomInt(0, pool.length)]
}
