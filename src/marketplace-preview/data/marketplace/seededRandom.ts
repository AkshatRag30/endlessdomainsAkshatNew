// STATIC MOCK DATA helper (domain-overview plan §6.3). Every per-domain
// number on the overview page comes from a generator seeded by the domain
// name, so the same name always renders the same page (stable across reloads
// and screenshots) while different names look visibly different. Delete with
// the rest of the mock data once real endpoints exist (plan §8.3 item 7).

/** FNV-1a string hash, 32-bit. */
const hashString = (value: string): number => {
  let hash = 0x811c9dc5
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return hash >>> 0
}

export interface SeededRandom {
  /** Float in [0, 1). */
  next: () => number
  /** Integer in [min, max], inclusive. */
  int: (min: number, max: number) => number
  /** Float in [min, max), rounded to `decimals`. */
  float: (min: number, max: number, decimals?: number) => number
  pick: <T>(items: readonly T[]) => T
}

/** mulberry32, seeded from the hashed key. */
export function seededRandom(key: string): SeededRandom {
  let state = hashString(key)
  const next = () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }

  return {
    next,
    int: (min, max) => Math.floor(next() * (max - min + 1)) + min,
    float: (min, max, decimals = 1) => Number((next() * (max - min) + min).toFixed(decimals)),
    pick: (items) => items[Math.floor(next() * items.length)],
  }
}
