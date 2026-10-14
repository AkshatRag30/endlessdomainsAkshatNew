// Ported from the source project's src/helpers/chaincurrency/chaincurrency.tsx —
// trimmed to just the provider list this marquee needs (that file's own CURRENCY_MAP
// is unrelated to this section). All 10 icons already exist in this project's own
// public/domain/ folder, so these reference that path directly rather than importing
// them as bundled modules.
export interface DomainProvider {
  label: string
  provider: string
  image: string
  colorName: string
  // Full logo + name artwork (padding trimmed), shown instead of icon + text when set.
  // `logoAspect` is its width / height, so the marquee can size it from one height.
  logo?: string
  logoAspect?: number
  // Optical size correction: compact two-line marks read smaller than bold one-line
  // wordmarks at the same height, so each logo's height is nudged by this factor.
  logoScale?: number
}

export const DOMAIN_PROVIDERS: DomainProvider[] = [
  { label: 'Unstoppable Domains', image: '/domain/ud.svg', provider: 'UD', colorName: '#7e45e5', logo: '/new-assets/provider-logos/unstoppable.svg', logoAspect: 4.408, logoScale: 1.2 },
  { label: 'Ethereum Name Service', image: '/domain/ethereum.svg', provider: 'ENS', colorName: '#60aaf5', logo: '/new-assets/provider-logos/ens.svg', logoAspect: 2.222, logoScale: 1.15 },
  { label: 'Arbitrum', image: '/domain/arb.svg', provider: 'Arbitrum', colorName: '#1a71b1', logo: '/new-assets/provider-logos/arbitrum.svg', logoAspect: 3.811, logoScale: 1.15 },
  { label: 'Binance', image: '/domain/bnb.svg', provider: 'BinanceSmartChain', colorName: '#ffc300', logo: '/new-assets/provider-logos/binance.svg', logoAspect: 3.576, logoScale: 1.3 },
  { label: 'SNS (Solana Name Service)', image: '/domain/bonnfida.svg', provider: 'SNS', colorName: '#000', logo: '/new-assets/provider-logos/sns.svg', logoAspect: 2.761, logoScale: 1.15 },
  { label: 'Tezos', image: '/domain/tezos.svg', provider: 'Tezos', colorName: '#14216a', logo: '/new-assets/provider-logos/tezos.svg', logoAspect: 2.809, logoScale: 1.0 },
  { label: 'Aptos', image: '/domain/apt.svg', provider: 'Aptos', colorName: '#000', logo: '/new-assets/provider-logos/aptos.svg', logoAspect: 3.487, logoScale: 0.85 },
  { label: 'TON', image: '/domain/ton_symbol.png', provider: 'Ton', colorName: '#0098ea', logo: '/new-assets/provider-logos/ton.svg', logoAspect: 4.494, logoScale: 0.8 },
  { label: 'Box', image: '/domain/box_icon.png', provider: 'Box', colorName: '#000', logo: '/new-assets/provider-logos/box.svg', logoAspect: 2.529, logoScale: 0.85 },
  { label: 'Freename', image: '/domain/freename.svg', provider: 'Freename', colorName: '#4144c0', logo: '/new-assets/provider-logos/freename.svg', logoAspect: 8.915, logoScale: 0.72 },
]
