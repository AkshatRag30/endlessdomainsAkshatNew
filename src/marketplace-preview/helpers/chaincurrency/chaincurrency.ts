/**
 * Ported from endlessdomainsAkshatNew's src/helpers/chaincurrency —
 * same module name/location convention, same data, adapted only where the
 * two projects differ mechanically:
 *   - DOMAIN_PROVIDERS' logos were static webpack imports from that repo's
 *     own public/domain/ folder (`import x from '../../../public/domain/x.svg'`).
 *     This repo doesn't import images that way anywhere — every asset here
 *     is referenced by its public/ URL string instead (see ChainBadge,
 *     ExtensionBadge, etc.) — so `image` is a plain string path into this
 *     repo's own public/assets/img/marketplace/providers/ instead, where
 *     the same logo files were copied byte-for-byte.
 *   - CURRENCY_MAP/getCurrencyInfo needed no changes — its icons are
 *     already remote URLs (cryptologos.cc / coinmarketcap.com), portable
 *     as-is. Not wired into anything in this project yet; ported because
 *     it's part of the same helper module, available if a price-currency
 *     icon is ever needed (e.g. a payment/checkout flow).
 */

export type CurrencySymbol = keyof typeof CURRENCY_MAP

export const CURRENCY_MAP = {
  BTC: { name: 'Bitcoin', icon: 'https://cryptologos.cc/thumbs/bitcoin.png' },
  ETH: { name: 'Ethereum', icon: 'https://cryptologos.cc/thumbs/ethereum.png' },
  USDT: { name: 'Tether USD', icon: 'https://cryptologos.cc/thumbs/tether.png' },
  USDC: { name: 'USD Coin', icon: 'https://cryptologos.cc/thumbs/usd-coin.png' },
  BNB: { name: 'Binance Coin', icon: 'https://cryptologos.cc/thumbs/binance-usd.png' },
  XRP: { name: 'XRP', icon: 'https://cryptologos.cc/thumbs/xrp.png' },
  ADA: { name: 'Cardano', icon: 'https://cryptologos.cc/thumbs/cardano.png' },
  SOL: { name: 'Solana', icon: 'https://cryptologos.cc/thumbs/solana.png' },
  DOGE: { name: 'Dogecoin', icon: 'https://cryptologos.cc/thumbs/dogecoin.png' },
  DOT: { name: 'Polkadot', icon: 'https://cryptologos.cc/thumbs/polkadot-new.png' },
  MATIC: { name: 'Polygon', icon: 'https://cryptologos.cc/thumbs/polygon.png' },
  AVAX: { name: 'Avalanche', icon: 'https://cryptologos.cc/thumbs/Avalanche.png' },
  TRX: { name: 'TRON', icon: 'https://cryptologos.cc/thumbs/tron.png' },
  LTC: { name: 'Litecoin', icon: 'https://cryptologos.cc/thumbs/litecoin.png' },
  BCH: { name: 'Bitcoin Cash', icon: 'https://cryptologos.cc/thumbs/bitcoin-cash.png' },
  LINK: { name: 'Chainlink', icon: 'https://cryptologos.cc/thumbs/chainlink.png' },
  ATOM: { name: 'Cosmos', icon: 'https://cryptologos.cc/thumbs/cosmos.png' },
  XLM: { name: 'Stellar', icon: 'https://cryptologos.cc/thumbs/stellar.png' },
  ETC: { name: 'Ethereum Classic', icon: 'https://cryptologos.cc/thumbs/ethereum-classic.png' },
  XMR: { name: 'Monero', icon: 'https://cryptologos.cc/thumbs/monero.png' },
  EOS: { name: 'EOS', icon: 'https://cryptologos.cc/thumbs/eos.png' },
  NEO: { name: 'NEO', icon: 'https://cryptologos.cc/thumbs/neo.png' },
  XTZ: { name: 'Tezos', icon: 'https://cryptologos.cc/thumbs/tezos.png' },
  VET: { name: 'VeChain', icon: 'https://cryptologos.cc/thumbs/vechain.png' },
  ALGO: { name: 'Algorand', icon: 'https://cryptologos.cc/thumbs/algorand.png' },
  FIL: { name: 'Filecoin', icon: 'https://cryptologos.cc/thumbs/filecoin.png' },
  ICP: { name: 'Internet Computer', icon: 'https://cryptologos.cc/thumbs/internet-computer.png' },
  AAVE: { name: 'Aave', icon: 'https://cryptologos.cc/thumbs/aave.png' },
  UNI: { name: 'Uniswap', icon: 'https://cryptologos.cc/thumbs/uniswap.png' },
  SUSHI: { name: 'SushiSwap', icon: 'https://cryptologos.cc/thumbs/sushiswap.png' },
  SHIB: { name: 'Shiba Inu', icon: 'https://cryptologos.cc/thumbs/shiba-inu.png' },
  HBAR: { name: 'Hedera', icon: 'https://cryptologos.cc/thumbs/hedera.png' },
  NEAR: { name: 'NEAR Protocol', icon: 'https://cryptologos.cc/thumbs/near-protocol.png' },
  FTM: { name: 'Fantom', icon: 'https://cryptologos.cc/thumbs/fantom.png' },
  KSM: { name: 'Kusama', icon: 'https://cryptologos.cc/thumbs/kusama.png' },
  OKB: { name: 'OKB', icon: 'https://cryptologos.cc/thumbs/okb.png' },
  LEO: { name: 'UNUS SED LEO', icon: 'https://cryptologos.cc/thumbs/unus-sed-leo.png' },
  THETA: { name: 'Theta Network', icon: 'https://cryptologos.cc/thumbs/theta-network.png' },
  GALA: { name: 'Gala', icon: 'https://cryptologos.cc/thumbs/gala.png' },
  SAND: { name: 'The Sandbox', icon: 'https://cryptologos.cc/thumbs/the-sandbox.png' },
  MANA: { name: 'Decentraland', icon: 'https://cryptologos.cc/thumbs/decentraland.png' },
  AXS: { name: 'Axie Infinity', icon: 'https://cryptologos.cc/thumbs/axie-infinity.png' },
  APT: { name: 'Aptos', icon: 'https://cryptologos.cc/thumbs/aptos.png' },
  SUI: { name: 'Sui', icon: 'https://cryptologos.cc/thumbs/sui.png' },
  TON: { name: 'Toncoin', icon: 'https://cryptologos.cc/thumbs/toncoin.png' },
  ARB: { name: 'Arbitrum', icon: 'https://cryptologos.cc/thumbs/arbitrum.png' },
  OP: { name: 'Optimism', icon: 'https://cryptologos.cc/thumbs/optimism-ethereum.png' },
  WETH: { name: 'Wrapped Ethereum', icon: 'https://cryptologos.cc/thumbs/ethereum.png' },
  DAI: { name: 'Dai', icon: 'https://cryptologos.cc/thumbs/multi-collateral-dai.png' },
  BUSD: { name: 'BUSD', icon: 'https://cryptologos.cc/thumbs/binance-usd.png' },
  WBTC: { name: 'WBTC', icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3717.png' },
} as const

type CurrencyInfo = {
  name: string
  icon: string
}

export const getCurrencyInfo = (symbol: string): CurrencyInfo => {
  const key = symbol?.toUpperCase() as keyof typeof CURRENCY_MAP

  return (
    CURRENCY_MAP[key] ?? {
      name: key,
      icon: '',
    }
  )
}

// ── Domain / chain providers ────────────────────────────────────────────

const PROVIDER_LOGO_BASE = '/assets/img/marketplace/providers'

export type DomainProviderKey =
  | 'UD'
  | 'ENS'
  | 'Arbitrum'
  | 'BinanceSmartChain'
  | 'Bonfida'
  | 'Tezos'
  | 'Aptos'
  | 'Ton'
  | 'Box'
  | 'Starknet'
  | 'Freename'

export interface DomainProvider {
  label: string
  provider: DomainProviderKey
  image: string
  colorName: string
}

export const DOMAIN_PROVIDERS: DomainProvider[] = [
  { label: 'Unstoppable Domains', image: `${PROVIDER_LOGO_BASE}/ud.svg`, provider: 'UD', colorName: '#7e45e5' },
  { label: 'Ethereum Name Service', image: `${PROVIDER_LOGO_BASE}/ethereum.svg`, provider: 'ENS', colorName: '#60aaf5' },
  { label: 'Arbitrum', image: `${PROVIDER_LOGO_BASE}/arb.svg`, provider: 'Arbitrum', colorName: '#1a71b1' },
  { label: 'Binance', image: `${PROVIDER_LOGO_BASE}/bnb.svg`, provider: 'BinanceSmartChain', colorName: '#ffc300' },
  { label: 'Bonfida', image: `${PROVIDER_LOGO_BASE}/bonnfida.svg`, provider: 'Bonfida', colorName: '#000' },
  { label: 'Tezos', image: `${PROVIDER_LOGO_BASE}/tezos.svg`, provider: 'Tezos', colorName: '#14216a' },
  { label: 'Aptos', image: `${PROVIDER_LOGO_BASE}/apt.svg`, provider: 'Aptos', colorName: '#000' },
  { label: 'TON', image: `${PROVIDER_LOGO_BASE}/ton_symbol.png`, provider: 'Ton', colorName: '#0098ea' },
  { label: 'Box', image: `${PROVIDER_LOGO_BASE}/box_icon.png`, provider: 'Box', colorName: '#000' },
  { label: 'Starknet', image: `${PROVIDER_LOGO_BASE}/starknet_icon.png`, provider: 'Starknet', colorName: '#19aa6e' },
  { label: 'Freename', image: `${PROVIDER_LOGO_BASE}/freename.svg`, provider: 'Freename', colorName: '#4144c0' },
]

export const getDomainProvider = (provider: DomainProviderKey) =>
  DOMAIN_PROVIDERS.find((p) => p.provider === provider)

export const getProviderLogo = (provider: DomainProviderKey) =>
  getDomainProvider(provider)?.image

export const getProviderLabel = (provider: DomainProviderKey) =>
  getDomainProvider(provider)?.label

export const getProviderColor = (provider: DomainProviderKey) =>
  getDomainProvider(provider)?.colorName

export const getAllDomainProviders = () => DOMAIN_PROVIDERS

// This project's Chain.id values ('polygon'/'ethereum'/'arbitrum'/'bsc',
// from src/types/marketplace/domain.ts) predate this ported helper, which
// keys off the domain-provider name instead. Shared by ChainBadge and
// DomainAvatar — both places a chain's real logo needs resolving — rather
// than each keeping its own copy of this mapping. 'UD' stands in for
// Polygon specifically: Unstoppable Domains' NFTs are minted on Polygon in
// this app, and UD's own brand purple already near-matches Polygon's, which
// is why the old dot-only ChainBadge used --color-purple-primary for
// 'polygon' too.
const CHAIN_ID_TO_PROVIDER: Record<string, DomainProviderKey> = {
  polygon: 'UD',
  ethereum: 'ENS',
  arbitrum: 'Arbitrum',
  bsc: 'BinanceSmartChain',
}

export const getProviderForChainId = (chainId: string) => {
  const providerKey = CHAIN_ID_TO_PROVIDER[chainId]
  return providerKey ? getDomainProvider(providerKey) : undefined
}
