// Ported from the source project's src/helpers/chaincurrency/chaincurrency.tsx —
// trimmed to just the provider list this marquee needs (that file's own CURRENCY_MAP
// is unrelated to this section). All 11 icons already exist in this project's own
// public/domain/ folder, so these reference that path directly rather than importing
// them as bundled modules.
export interface DomainProvider {
  label: string
  provider: string
  image: string
  colorName: string
}

export const DOMAIN_PROVIDERS: DomainProvider[] = [
  { label: 'Unstoppable Domains', image: '/domain/ud.svg', provider: 'UD', colorName: '#7e45e5' },
  { label: 'Ethereum Name Service', image: '/domain/ethereum.svg', provider: 'ENS', colorName: '#60aaf5' },
  { label: 'Arbitrum', image: '/domain/arb.svg', provider: 'Arbitrum', colorName: '#1a71b1' },
  { label: 'Binance', image: '/domain/bnb.svg', provider: 'BinanceSmartChain', colorName: '#ffc300' },
  { label: 'Bonfida', image: '/domain/bonnfida.svg', provider: 'Bonfida', colorName: '#000' },
  { label: 'Tezos', image: '/domain/tezos.svg', provider: 'Tezos', colorName: '#14216a' },
  { label: 'Aptos', image: '/domain/apt.svg', provider: 'Aptos', colorName: '#000' },
  { label: 'TON', image: '/domain/ton_symbol.png', provider: 'Ton', colorName: '#0098ea' },
  { label: 'Box', image: '/domain/box_icon.png', provider: 'Box', colorName: '#000' },
  { label: 'Starknet', image: '/domain/starknet_icon.png', provider: 'Starknet', colorName: '#19aa6e' },
  { label: 'Freename', image: '/domain/freename.svg', provider: 'Freename', colorName: '#4144c0' },
]
