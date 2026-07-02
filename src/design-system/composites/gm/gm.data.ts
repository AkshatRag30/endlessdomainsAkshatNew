export interface GmChain {
  id: string
  name: string
  logo: string          // path inside /public/gm/
  gasFee: string
  gasFeeUsd: string
  lastGm: string        // e.g. "2m ago" | "just now"
  hot: boolean
  favorite: boolean
}

export interface GmLiveEvent {
  address: string       // e.g. "0x360a...f2e6"
  action: string        // e.g. "Deployed NFT on"
  chain: string
  chainColor: string
  time: string          // e.g. "5 ago"
}

export interface GmStats {
  totalGms: string      // e.g. "1.2M"
  wallets: string       // e.g. "42.1K"
  chains: string        // e.g. "21"
  gmsToday: string      // e.g. "8.4K"
}

// ── Demo chains ───────────────────────────────────────────────────────────────
// Logos are placeholder — swap in real SVGs to /public/gm/ when available

export const GM_CHAINS: GmChain[] = [
  { id: 'base',      name: 'Base',      logo: '/gm/base.svg',      gasFee: '0.002',  gasFeeUsd: '-0.0021 ETH', lastGm: '2m ago',    hot: true,  favorite: false },
  { id: 'ethereum',  name: 'Ethereum',  logo: '/gm/ethereum.svg',  gasFee: '0.002',  gasFeeUsd: '0.002',       lastGm: 'just now',  hot: true,  favorite: true  },
  { id: 'optimism',  name: 'Optimism',  logo: '/gm/optimism.svg',  gasFee: '0.002',  gasFeeUsd: '0.002',       lastGm: '2m ago',    hot: false, favorite: false },
  { id: 'arbitrum',  name: 'Arbitrum',  logo: '/gm/arbitrum.svg',  gasFee: '0.002',  gasFeeUsd: '0.002',       lastGm: '2m ago',    hot: true,  favorite: false },
  { id: 'polygon',   name: 'Polygon',   logo: '/gm/polygon.svg',   gasFee: '0.002',  gasFeeUsd: '0.002',       lastGm: '2m ago',    hot: false, favorite: true  },
  { id: 'avalanche', name: 'Avalanche', logo: '/gm/avalanche.svg', gasFee: '0.002',  gasFeeUsd: '0.002',       lastGm: '2m ago',    hot: false, favorite: false },
  { id: 'bnb',       name: 'BNB Chain', logo: '/gm/bnb.svg',       gasFee: '0.002',  gasFeeUsd: '0.002',       lastGm: '2m ago',    hot: true,  favorite: false },
  { id: 'linea',     name: 'Linea',     logo: '/gm/linea.svg',     gasFee: '0.002',  gasFeeUsd: '0.002',       lastGm: '2m ago',    hot: false, favorite: false },
  { id: 'zksync',    name: 'zkSync',    logo: '/gm/zksync.svg',    gasFee: '0.002',  gasFeeUsd: '0.002',       lastGm: '2m ago',    hot: false, favorite: false },
  { id: 'scroll',    name: 'Scroll',    logo: '/gm/scroll.svg',    gasFee: '0.002',  gasFeeUsd: '0.002',       lastGm: '2m ago',    hot: false, favorite: false },
  { id: 'mantle',    name: 'Mantle',    logo: '/gm/mantle.svg',    gasFee: '0.002',  gasFeeUsd: '0.002',       lastGm: '5m ago',    hot: false, favorite: false },
  { id: 'blast',     name: 'Blast',     logo: '/gm/blast.svg',     gasFee: '0.002',  gasFeeUsd: '0.002',       lastGm: '8m ago',    hot: false, favorite: false },
  { id: 'mode',      name: 'Mode',      logo: '/gm/mode.svg',      gasFee: '0.002',  gasFeeUsd: '0.002',       lastGm: '10m ago',   hot: false, favorite: false },
  { id: 'manta',     name: 'Manta',     logo: '/gm/manta.svg',     gasFee: '0.002',  gasFeeUsd: '0.002',       lastGm: '12m ago',   hot: false, favorite: false },
  { id: 'celo',      name: 'Celo',      logo: '/gm/celo.svg',      gasFee: '0.002',  gasFeeUsd: '0.002',       lastGm: '15m ago',   hot: false, favorite: false },
]

// ── Demo live activity ────────────────────────────────────────────────────────

export const GM_LIVE_EVENTS: GmLiveEvent[] = [
  { address: '0x360a...f2e6', action: 'Deployed NFT on', chain: 'Base',     chainColor: '#0052FF', time: '5 ago'  },
  { address: '0x360a...f2e6', action: 'Deployed NFT on', chain: 'Base',     chainColor: '#0052FF', time: '5 ago'  },
  { address: '0x360a...f2e6', action: 'Deployed NFT on', chain: 'Base',     chainColor: '#0052FF', time: '1 ago'  },
  { address: '0x360a...f2e6', action: 'Deployed NFT on', chain: 'Base',     chainColor: '#0052FF', time: '2 ago'  },
  { address: '0x360a...f2e6', action: 'Deployed NFT on', chain: 'Base',     chainColor: '#0052FF', time: '3 ago'  },
]

// ── Demo stats ────────────────────────────────────────────────────────────────

export const GM_STATS: GmStats = {
  totalGms:  '1.2M',
  wallets:   '42.1K',
  chains:    '21',
  gmsToday:  '8.4K',
}
