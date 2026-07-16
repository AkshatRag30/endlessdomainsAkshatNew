import type { IconType } from 'react-icons'
import { SiEthereum, SiSolana, SiBinance, SiBox, SiTon } from 'react-icons/si'
import { CiLogin } from 'react-icons/ci'
import {
  PiStorefrontBold,
  PiSealCheckBold,
  PiCubeBold,
  PiLightningBold,
  PiCoinBold,
  PiStackBold,
  PiPolygonBold,
} from 'react-icons/pi'
import { BsCurrencyDollar } from 'react-icons/bs'

export interface TldStat {
  value: string
  label: string
}

export interface TldFeature {
  id: string
  iconSrc: string
  title: string
  desc: string
}

export interface TldWhyRow {
  id: string
  left: string
  right: string
}

export interface TldUtilityItem {
  id: string
  Icon: IconType
  title: string
}

export interface TldFaqItem {
  q: string
  a: string
}

export interface TldPageData {
  slug: string
  tld: string
  providerShort: string
  providerFull: string
  providerIcon: IconType

  hero: {
    label: string
    headingLine1: string
    headingLine2: string
    description: string
    stats: TldStat[]
  }

  about: {
    label: string
    headingLine1: string
    headingLine2: string
    description: string
    features: TldFeature[]
  }

  why: {
    label: string
    headingLine1: string
    headingLine2: string
    rows: TldWhyRow[]
  }

  utility: {
    label: string
    headingLine1: string
    headingLine2: string
    items: TldUtilityItem[]
  }

  faq: {
    description: string
    items: TldFaqItem[]
  }
}

// design-specific: About-section icons and the Utility dome background reuse ENS's existing
// artwork as shared placeholders across every TLD until bespoke per-chain art is commissioned —
// swapping these later means only touching this file, not any composite
const SHARED_FEATURE_ICONS = {
  ethereumNative: '/ens/icon-ethereum-native.svg',
  universalRecognition: '/ens/icon-universal-recognition.svg',
  ownPresence: '/ens/icon-own-presence.svg',
}

export const TLD_PAGES: TldPageData[] = [
  {
    slug: 'ens',
    tld: '.eth',
    providerShort: 'ENS',
    providerFull: 'Ethereum Name Service (ENS)',
    providerIcon: SiEthereum,
    hero: {
      label: 'On-Chain Identity',
      headingLine1: 'Register Your',
      headingLine2: '.eth Identity',
      description: 'The original on-chain identity on Ethereum. One name for payments, login, governance, and digital ownership.',
      stats: [
        { value: 'Millions', label: 'Registered Identities' },
        { value: '1000+', label: 'Integrations' },
        { value: '$5', label: 'Starting Price' },
      ],
    },
    about: {
      label: 'About The Identity',
      headingLine1: 'Everything',
      headingLine2: 'About .eth',
      description: 'Every .eth identity is registered through Ethereum Name Service (ENS), allowing users to replace complex wallet addresses with a simple, human-readable name that works across wallets, applications, DAOs, and protocols.',
      features: [
        { id: 'ethereum-native', iconSrc: SHARED_FEATURE_ICONS.ethereumNative, title: 'Ethereum-Native Identity', desc: "Built on Ethereum and secured by the world's largest smart contract ecosystem." },
        { id: 'universal-recognition', iconSrc: SHARED_FEATURE_ICONS.universalRecognition, title: 'Universal Recognition', desc: 'Supported by wallets, marketplaces, DAOs, applications, and Web3 services worldwide.' },
        { id: 'own-presence', iconSrc: SHARED_FEATURE_ICONS.ownPresence, title: 'Own Your Presence', desc: 'Create a memorable on-chain identity that travels with you across the Ethereum ecosystem.' },
      ],
    },
    why: {
      label: 'Why .eth',
      headingLine1: 'The Identity Standard',
      headingLine2: 'For Ethereum',
      rows: [
        { id: 'row-1', left: 'Human-readable payments', right: 'Wallet-bound ownership' },
        { id: 'row-2', left: 'DAO and dApp compatible', right: 'Most recognized identity' },
        { id: 'row-3', left: 'Ethereum-native', right: 'Starting from $5/year' },
      ],
    },
    utility: {
      label: 'Utility',
      headingLine1: 'What Your',
      headingLine2: '.eth Unlocks',
      items: [
        { id: 'universal-login', Icon: CiLogin, title: 'Universal Login' },
        { id: 'marketplace', Icon: PiStorefrontBold, title: 'Marketplace' },
        { id: 'park-and-earn', Icon: PiCoinBold, title: 'Park And Earn' },
        { id: 'show-digital-ownership', Icon: PiSealCheckBold, title: 'Show Digital Ownership' },
        { id: 'receive-payments', Icon: BsCurrencyDollar, title: 'Receive Payments' },
      ],
    },
    faq: {
      description: 'Answers to your most common .eth identity questions',
      items: [
        { q: 'What is a .eth identity?', a: 'A .eth identity is a blockchain-based name registered through Ethereum Name Service (ENS) that replaces long wallet addresses with a human-readable identity.' },
        { q: 'How much does a .eth identity cost?', a: 'Registration typically starts at $5 per year for names with five or more characters, with shorter names carrying premium pricing.' },
        { q: 'Do .eth identities expire?', a: 'Yes. ENS identities require periodic renewal to maintain ownership.' },
        { q: 'What blockchain does .eth run on?', a: '.eth identities are built and secured on the Ethereum blockchain.' },
        { q: 'Can I receive payments with my .eth identity?', a: 'Yes. Supported wallets can send funds directly to your .eth name instead of a wallet address.' },
        { q: 'Can I transfer or sell my .eth identity?', a: 'Yes. .eth identities are wallet-owned assets and can be transferred, traded, or sold at any time.' },
      ],
    },
  },

  {
    slug: 'bonfida',
    tld: '.sol',
    providerShort: 'Bonfida',
    providerFull: 'Bonfida Name Service',
    providerIcon: SiSolana,
    hero: {
      label: 'On-Chain Identity',
      headingLine1: 'Register Your',
      headingLine2: '.sol Identity',
      description: 'The native identity of Solana. One name for payments, login, governance, and digital ownership at lightning speed.',
      stats: [
        { value: '500K+', label: 'Registered Identities' },
        { value: '400+', label: 'Integrations' },
        { value: '$3', label: 'Starting Price' },
      ],
    },
    about: {
      label: 'About The Identity',
      headingLine1: 'Everything',
      headingLine2: 'About .sol',
      description: 'Every .sol identity is registered through Bonfida Name Service, allowing users to replace complex wallet addresses with a simple, human-readable name that works across Solana wallets, applications, and protocols.',
      features: [
        { id: 'solana-native', iconSrc: SHARED_FEATURE_ICONS.ethereumNative, title: 'Solana-Native Identity', desc: "Built on Solana and secured by one of the fastest, lowest-cost blockchains in Web3." },
        { id: 'universal-recognition', iconSrc: SHARED_FEATURE_ICONS.universalRecognition, title: 'Universal Recognition', desc: 'Supported by wallets, marketplaces, DAOs, applications, and Web3 services across Solana.' },
        { id: 'own-presence', iconSrc: SHARED_FEATURE_ICONS.ownPresence, title: 'Own Your Presence', desc: 'Create a memorable on-chain identity that travels with you across the Solana ecosystem.' },
      ],
    },
    why: {
      label: 'Why .sol',
      headingLine1: 'The Identity Standard',
      headingLine2: 'For Solana',
      rows: [
        { id: 'row-1', left: 'Human-readable payments', right: 'Wallet-bound ownership' },
        { id: 'row-2', left: 'DAO and dApp compatible', right: 'Most recognized Solana identity' },
        { id: 'row-3', left: 'Solana-native', right: 'Starting from $3/year' },
      ],
    },
    utility: {
      label: 'Utility',
      headingLine1: 'What Your',
      headingLine2: '.sol Unlocks',
      items: [
        { id: 'universal-login', Icon: CiLogin, title: 'Universal Login' },
        { id: 'marketplace', Icon: PiStorefrontBold, title: 'Marketplace' },
        { id: 'park-and-earn', Icon: PiCoinBold, title: 'Park And Earn' },
        { id: 'show-digital-ownership', Icon: PiSealCheckBold, title: 'Show Digital Ownership' },
        { id: 'receive-payments', Icon: BsCurrencyDollar, title: 'Receive Payments' },
      ],
    },
    faq: {
      description: 'Answers to your most common .sol identity questions',
      items: [
        { q: 'What is a .sol identity?', a: 'A .sol identity is a blockchain-based name registered through Bonfida Name Service that replaces long wallet addresses with a human-readable identity on Solana.' },
        { q: 'How much does a .sol identity cost?', a: 'Registration typically starts at $3 per year for names with five or more characters, with shorter names carrying premium pricing.' },
        { q: 'Do .sol identities expire?', a: 'Yes. .sol identities require periodic renewal to maintain ownership.' },
        { q: 'What blockchain does .sol run on?', a: '.sol identities are built and secured on the Solana blockchain.' },
        { q: 'Can I receive payments with my .sol identity?', a: 'Yes. Supported wallets can send funds directly to your .sol name instead of a wallet address.' },
        { q: 'Can I transfer or sell my .sol identity?', a: 'Yes. .sol identities are wallet-owned assets and can be transferred, traded, or sold at any time.' },
      ],
    },
  },

  {
    slug: 'arbitrum',
    tld: '.arb',
    providerShort: 'Arbitrum',
    providerFull: 'Arbitrum Name Service',
    providerIcon: PiCubeBold,
    hero: {
      label: 'On-Chain Identity',
      headingLine1: 'Register Your',
      headingLine2: '.arb Identity',
      description: 'The native identity of Arbitrum. One name for payments, login, governance, and digital ownership on Ethereum’s leading rollup.',
      stats: [
        { value: '200K+', label: 'Registered Identities' },
        { value: '300+', label: 'Integrations' },
        { value: '$4', label: 'Starting Price' },
      ],
    },
    about: {
      label: 'About The Identity',
      headingLine1: 'Everything',
      headingLine2: 'About .arb',
      description: 'Every .arb identity is registered through Arbitrum Name Service, allowing users to replace complex wallet addresses with a simple, human-readable name that works across Arbitrum wallets, applications, and protocols.',
      features: [
        { id: 'arbitrum-native', iconSrc: SHARED_FEATURE_ICONS.ethereumNative, title: 'Arbitrum-Native Identity', desc: 'Built on Arbitrum and secured by Ethereum’s largest layer-2 rollup network.' },
        { id: 'universal-recognition', iconSrc: SHARED_FEATURE_ICONS.universalRecognition, title: 'Universal Recognition', desc: 'Supported by wallets, marketplaces, DAOs, applications, and Web3 services across Arbitrum.' },
        { id: 'own-presence', iconSrc: SHARED_FEATURE_ICONS.ownPresence, title: 'Own Your Presence', desc: 'Create a memorable on-chain identity that travels with you across the Arbitrum ecosystem.' },
      ],
    },
    why: {
      label: 'Why .arb',
      headingLine1: 'The Identity Standard',
      headingLine2: 'For Arbitrum',
      rows: [
        { id: 'row-1', left: 'Human-readable payments', right: 'Wallet-bound ownership' },
        { id: 'row-2', left: 'DAO and dApp compatible', right: 'Most recognized Arbitrum identity' },
        { id: 'row-3', left: 'Low gas fees', right: 'Starting from $4/year' },
      ],
    },
    utility: {
      label: 'Utility',
      headingLine1: 'What Your',
      headingLine2: '.arb Unlocks',
      items: [
        { id: 'universal-login', Icon: CiLogin, title: 'Universal Login' },
        { id: 'marketplace', Icon: PiStorefrontBold, title: 'Marketplace' },
        { id: 'park-and-earn', Icon: PiCoinBold, title: 'Park And Earn' },
        { id: 'show-digital-ownership', Icon: PiSealCheckBold, title: 'Show Digital Ownership' },
        { id: 'receive-payments', Icon: BsCurrencyDollar, title: 'Receive Payments' },
      ],
    },
    faq: {
      description: 'Answers to your most common .arb identity questions',
      items: [
        { q: 'What is a .arb identity?', a: 'A .arb identity is a blockchain-based name registered through Arbitrum Name Service that replaces long wallet addresses with a human-readable identity on Arbitrum.' },
        { q: 'How much does a .arb identity cost?', a: 'Registration typically starts at $4 per year for names with five or more characters, with shorter names carrying premium pricing.' },
        { q: 'Do .arb identities expire?', a: 'Yes. .arb identities require periodic renewal to maintain ownership.' },
        { q: 'What blockchain does .arb run on?', a: '.arb identities are built and secured on the Arbitrum network, a layer-2 rollup on Ethereum.' },
        { q: 'Can I receive payments with my .arb identity?', a: 'Yes. Supported wallets can send funds directly to your .arb name instead of a wallet address.' },
        { q: 'Can I transfer or sell my .arb identity?', a: 'Yes. .arb identities are wallet-owned assets and can be transferred, traded, or sold at any time.' },
      ],
    },
  },

  {
    slug: 'bnb',
    tld: '.bnb',
    providerShort: 'BNB',
    providerFull: 'BNB Name Service',
    providerIcon: SiBinance,
    hero: {
      label: 'On-Chain Identity',
      headingLine1: 'Register Your',
      headingLine2: '.bnb Identity',
      description: 'The native identity of BNB Smart Chain. One name for payments, login, governance, and digital ownership.',
      stats: [
        { value: '800K+', label: 'Registered Identities' },
        { value: '500+', label: 'Integrations' },
        { value: '$2', label: 'Starting Price' },
      ],
    },
    about: {
      label: 'About The Identity',
      headingLine1: 'Everything',
      headingLine2: 'About .bnb',
      description: 'Every .bnb identity is registered through BNB Name Service, allowing users to replace complex wallet addresses with a simple, human-readable name that works across BNB Smart Chain wallets, applications, and protocols.',
      features: [
        { id: 'bnb-native', iconSrc: SHARED_FEATURE_ICONS.ethereumNative, title: 'BNB Chain-Native Identity', desc: "Built on BNB Smart Chain and secured by one of the world's largest blockchain networks." },
        { id: 'universal-recognition', iconSrc: SHARED_FEATURE_ICONS.universalRecognition, title: 'Universal Recognition', desc: 'Supported by wallets, marketplaces, DAOs, applications, and Web3 services across BNB Chain.' },
        { id: 'own-presence', iconSrc: SHARED_FEATURE_ICONS.ownPresence, title: 'Own Your Presence', desc: 'Create a memorable on-chain identity that travels with you across the BNB Chain ecosystem.' },
      ],
    },
    why: {
      label: 'Why .bnb',
      headingLine1: 'The Identity Standard',
      headingLine2: 'For BNB Chain',
      rows: [
        { id: 'row-1', left: 'Human-readable payments', right: 'Wallet-bound ownership' },
        { id: 'row-2', left: 'DAO and dApp compatible', right: 'Most recognized BNB identity' },
        { id: 'row-3', left: 'BNB Chain-native', right: 'Starting from $2/year' },
      ],
    },
    utility: {
      label: 'Utility',
      headingLine1: 'What Your',
      headingLine2: '.bnb Unlocks',
      items: [
        { id: 'universal-login', Icon: CiLogin, title: 'Universal Login' },
        { id: 'marketplace', Icon: PiStorefrontBold, title: 'Marketplace' },
        { id: 'park-and-earn', Icon: PiCoinBold, title: 'Park And Earn' },
        { id: 'show-digital-ownership', Icon: PiSealCheckBold, title: 'Show Digital Ownership' },
        { id: 'receive-payments', Icon: BsCurrencyDollar, title: 'Receive Payments' },
      ],
    },
    faq: {
      description: 'Answers to your most common .bnb identity questions',
      items: [
        { q: 'What is a .bnb identity?', a: 'A .bnb identity is a blockchain-based name registered through BNB Name Service that replaces long wallet addresses with a human-readable identity on BNB Smart Chain.' },
        { q: 'How much does a .bnb identity cost?', a: 'Registration typically starts at $2 per year for names with five or more characters, with shorter names carrying premium pricing.' },
        { q: 'Do .bnb identities expire?', a: 'Yes. .bnb identities require periodic renewal to maintain ownership.' },
        { q: 'What blockchain does .bnb run on?', a: '.bnb identities are built and secured on BNB Smart Chain.' },
        { q: 'Can I receive payments with my .bnb identity?', a: 'Yes. Supported wallets can send funds directly to your .bnb name instead of a wallet address.' },
        { q: 'Can I transfer or sell my .bnb identity?', a: 'Yes. .bnb identities are wallet-owned assets and can be transferred, traded, or sold at any time.' },
      ],
    },
  },

  {
    slug: 'tezos',
    tld: '.tez',
    providerShort: 'Tezos',
    providerFull: 'Tezos Domains',
    providerIcon: PiPolygonBold,
    hero: {
      label: 'On-Chain Identity',
      headingLine1: 'Register Your',
      headingLine2: '.tez Identity',
      description: 'The native identity of Tezos. One name for payments, login, governance, and digital ownership on a self-amending blockchain.',
      stats: [
        { value: '50K+', label: 'Registered Identities' },
        { value: '150+', label: 'Integrations' },
        { value: '$3', label: 'Starting Price' },
      ],
    },
    about: {
      label: 'About The Identity',
      headingLine1: 'Everything',
      headingLine2: 'About .tez',
      description: 'Every .tez identity is registered through Tezos Domains, allowing users to replace complex wallet addresses with a simple, human-readable name that works across Tezos wallets, applications, and protocols.',
      features: [
        { id: 'tezos-native', iconSrc: SHARED_FEATURE_ICONS.ethereumNative, title: 'Tezos-Native Identity', desc: 'Built on Tezos and secured by a self-amending, energy-efficient blockchain.' },
        { id: 'universal-recognition', iconSrc: SHARED_FEATURE_ICONS.universalRecognition, title: 'Universal Recognition', desc: 'Supported by wallets, marketplaces, DAOs, applications, and Web3 services across Tezos.' },
        { id: 'own-presence', iconSrc: SHARED_FEATURE_ICONS.ownPresence, title: 'Own Your Presence', desc: 'Create a memorable on-chain identity that travels with you across the Tezos ecosystem.' },
      ],
    },
    why: {
      label: 'Why .tez',
      headingLine1: 'The Identity Standard',
      headingLine2: 'For Tezos',
      rows: [
        { id: 'row-1', left: 'Human-readable payments', right: 'Wallet-bound ownership' },
        { id: 'row-2', left: 'DAO and dApp compatible', right: 'Most recognized Tezos identity' },
        { id: 'row-3', left: 'Energy-efficient', right: 'Starting from $3/year' },
      ],
    },
    utility: {
      label: 'Utility',
      headingLine1: 'What Your',
      headingLine2: '.tez Unlocks',
      items: [
        { id: 'universal-login', Icon: CiLogin, title: 'Universal Login' },
        { id: 'marketplace', Icon: PiStorefrontBold, title: 'Marketplace' },
        { id: 'park-and-earn', Icon: PiCoinBold, title: 'Park And Earn' },
        { id: 'show-digital-ownership', Icon: PiSealCheckBold, title: 'Show Digital Ownership' },
        { id: 'receive-payments', Icon: BsCurrencyDollar, title: 'Receive Payments' },
      ],
    },
    faq: {
      description: 'Answers to your most common .tez identity questions',
      items: [
        { q: 'What is a .tez identity?', a: 'A .tez identity is a blockchain-based name registered through Tezos Domains that replaces long wallet addresses with a human-readable identity on Tezos.' },
        { q: 'How much does a .tez identity cost?', a: 'Registration typically starts at $3 per year for names with five or more characters, with shorter names carrying premium pricing.' },
        { q: 'Do .tez identities expire?', a: 'Yes. .tez identities require periodic renewal to maintain ownership.' },
        { q: 'What blockchain does .tez run on?', a: '.tez identities are built and secured on the Tezos blockchain.' },
        { q: 'Can I receive payments with my .tez identity?', a: 'Yes. Supported wallets can send funds directly to your .tez name instead of a wallet address.' },
        { q: 'Can I transfer or sell my .tez identity?', a: 'Yes. .tez identities are wallet-owned assets and can be transferred, traded, or sold at any time.' },
      ],
    },
  },

  {
    slug: 'aptos',
    tld: '.apt',
    providerShort: 'Aptos',
    providerFull: 'Aptos Name Service',
    providerIcon: PiLightningBold,
    hero: {
      label: 'On-Chain Identity',
      headingLine1: 'Register Your',
      headingLine2: '.apt Identity',
      description: 'The native identity of Aptos. One name for payments, login, governance, and digital ownership on a high-throughput Move-based blockchain.',
      stats: [
        { value: '100K+', label: 'Registered Identities' },
        { value: '200+', label: 'Integrations' },
        { value: '$4', label: 'Starting Price' },
      ],
    },
    about: {
      label: 'About The Identity',
      headingLine1: 'Everything',
      headingLine2: 'About .apt',
      description: 'Every .apt identity is registered through Aptos Name Service, allowing users to replace complex wallet addresses with a simple, human-readable name that works across Aptos wallets, applications, and protocols.',
      features: [
        { id: 'aptos-native', iconSrc: SHARED_FEATURE_ICONS.ethereumNative, title: 'Aptos-Native Identity', desc: 'Built on Aptos and secured by a high-throughput, Move-based blockchain.' },
        { id: 'universal-recognition', iconSrc: SHARED_FEATURE_ICONS.universalRecognition, title: 'Universal Recognition', desc: 'Supported by wallets, marketplaces, DAOs, applications, and Web3 services across Aptos.' },
        { id: 'own-presence', iconSrc: SHARED_FEATURE_ICONS.ownPresence, title: 'Own Your Presence', desc: 'Create a memorable on-chain identity that travels with you across the Aptos ecosystem.' },
      ],
    },
    why: {
      label: 'Why .apt',
      headingLine1: 'The Identity Standard',
      headingLine2: 'For Aptos',
      rows: [
        { id: 'row-1', left: 'Human-readable payments', right: 'Wallet-bound ownership' },
        { id: 'row-2', left: 'DAO and dApp compatible', right: 'Most recognized Aptos identity' },
        { id: 'row-3', left: 'High-throughput Move chain', right: 'Starting from $4/year' },
      ],
    },
    utility: {
      label: 'Utility',
      headingLine1: 'What Your',
      headingLine2: '.apt Unlocks',
      items: [
        { id: 'universal-login', Icon: CiLogin, title: 'Universal Login' },
        { id: 'marketplace', Icon: PiStorefrontBold, title: 'Marketplace' },
        { id: 'park-and-earn', Icon: PiCoinBold, title: 'Park And Earn' },
        { id: 'show-digital-ownership', Icon: PiSealCheckBold, title: 'Show Digital Ownership' },
        { id: 'receive-payments', Icon: BsCurrencyDollar, title: 'Receive Payments' },
      ],
    },
    faq: {
      description: 'Answers to your most common .apt identity questions',
      items: [
        { q: 'What is a .apt identity?', a: 'A .apt identity is a blockchain-based name registered through Aptos Name Service that replaces long wallet addresses with a human-readable identity on Aptos.' },
        { q: 'How much does a .apt identity cost?', a: 'Registration typically starts at $4 per year for names with five or more characters, with shorter names carrying premium pricing.' },
        { q: 'Do .apt identities expire?', a: 'Yes. .apt identities require periodic renewal to maintain ownership.' },
        { q: 'What blockchain does .apt run on?', a: '.apt identities are built and secured on the Aptos blockchain.' },
        { q: 'Can I receive payments with my .apt identity?', a: 'Yes. Supported wallets can send funds directly to your .apt name instead of a wallet address.' },
        { q: 'Can I transfer or sell my .apt identity?', a: 'Yes. .apt identities are wallet-owned assets and can be transferred, traded, or sold at any time.' },
      ],
    },
  },

  {
    slug: 'ton',
    tld: '.ton',
    providerShort: 'TON',
    providerFull: 'TON DNS',
    providerIcon: SiTon,
    hero: {
      label: 'On-Chain Identity',
      headingLine1: 'Register Your',
      headingLine2: '.ton Identity',
      description: 'The native identity of The Open Network. One name for payments, login, governance, and digital ownership at massive scale.',
      stats: [
        { value: '300K+', label: 'Registered Identities' },
        { value: '250+', label: 'Integrations' },
        { value: '$3', label: 'Starting Price' },
      ],
    },
    about: {
      label: 'About The Identity',
      headingLine1: 'Everything',
      headingLine2: 'About .ton',
      description: 'Every .ton identity is registered through TON DNS, allowing users to replace complex wallet addresses with a simple, human-readable name that works across TON wallets, applications, and protocols.',
      features: [
        { id: 'ton-native', iconSrc: SHARED_FEATURE_ICONS.ethereumNative, title: 'TON-Native Identity', desc: 'Built on The Open Network and secured by a massively scalable, sharded blockchain.' },
        { id: 'universal-recognition', iconSrc: SHARED_FEATURE_ICONS.universalRecognition, title: 'Universal Recognition', desc: 'Supported by wallets, marketplaces, DAOs, applications, and Web3 services across TON.' },
        { id: 'own-presence', iconSrc: SHARED_FEATURE_ICONS.ownPresence, title: 'Own Your Presence', desc: 'Create a memorable on-chain identity that travels with you across the TON ecosystem.' },
      ],
    },
    why: {
      label: 'Why .ton',
      headingLine1: 'The Identity Standard',
      headingLine2: 'For TON',
      rows: [
        { id: 'row-1', left: 'Human-readable payments', right: 'Wallet-bound ownership' },
        { id: 'row-2', left: 'DAO and dApp compatible', right: 'Most recognized TON identity' },
        { id: 'row-3', left: 'Massively scalable', right: 'Starting from $3/year' },
      ],
    },
    utility: {
      label: 'Utility',
      headingLine1: 'What Your',
      headingLine2: '.ton Unlocks',
      items: [
        { id: 'universal-login', Icon: CiLogin, title: 'Universal Login' },
        { id: 'marketplace', Icon: PiStorefrontBold, title: 'Marketplace' },
        { id: 'park-and-earn', Icon: PiCoinBold, title: 'Park And Earn' },
        { id: 'show-digital-ownership', Icon: PiSealCheckBold, title: 'Show Digital Ownership' },
        { id: 'receive-payments', Icon: BsCurrencyDollar, title: 'Receive Payments' },
      ],
    },
    faq: {
      description: 'Answers to your most common .ton identity questions',
      items: [
        { q: 'What is a .ton identity?', a: 'A .ton identity is a blockchain-based name registered through TON DNS that replaces long wallet addresses with a human-readable identity on The Open Network.' },
        { q: 'How much does a .ton identity cost?', a: 'Registration typically starts at $3 per year for names with five or more characters, with shorter names carrying premium pricing.' },
        { q: 'Do .ton identities expire?', a: 'Yes. .ton identities require periodic renewal to maintain ownership.' },
        { q: 'What blockchain does .ton run on?', a: '.ton identities are built and secured on The Open Network (TON).' },
        { q: 'Can I receive payments with my .ton identity?', a: 'Yes. Supported wallets can send funds directly to your .ton name instead of a wallet address.' },
        { q: 'Can I transfer or sell my .ton identity?', a: 'Yes. .ton identities are wallet-owned assets and can be transferred, traded, or sold at any time.' },
      ],
    },
  },

  {
    slug: 'starknet',
    tld: '.stark',
    providerShort: 'Starknet',
    providerFull: 'Starknet ID',
    providerIcon: PiStackBold,
    hero: {
      label: 'On-Chain Identity',
      headingLine1: 'Register Your',
      headingLine2: '.stark Identity',
      description: 'The native identity of Starknet. One name for payments, login, governance, and digital ownership on Ethereum’s leading ZK-rollup.',
      stats: [
        { value: '80K+', label: 'Registered Identities' },
        { value: '180+', label: 'Integrations' },
        { value: '$4', label: 'Starting Price' },
      ],
    },
    about: {
      label: 'About The Identity',
      headingLine1: 'Everything',
      headingLine2: 'About .stark',
      description: 'Every .stark identity is registered through Starknet ID, allowing users to replace complex wallet addresses with a simple, human-readable name that works across Starknet wallets, applications, and protocols.',
      features: [
        { id: 'starknet-native', iconSrc: SHARED_FEATURE_ICONS.ethereumNative, title: 'Starknet-Native Identity', desc: 'Built on Starknet and secured by Ethereum’s leading ZK-rollup technology.' },
        { id: 'universal-recognition', iconSrc: SHARED_FEATURE_ICONS.universalRecognition, title: 'Universal Recognition', desc: 'Supported by wallets, marketplaces, DAOs, applications, and Web3 services across Starknet.' },
        { id: 'own-presence', iconSrc: SHARED_FEATURE_ICONS.ownPresence, title: 'Own Your Presence', desc: 'Create a memorable on-chain identity that travels with you across the Starknet ecosystem.' },
      ],
    },
    why: {
      label: 'Why .stark',
      headingLine1: 'The Identity Standard',
      headingLine2: 'For Starknet',
      rows: [
        { id: 'row-1', left: 'Human-readable payments', right: 'Wallet-bound ownership' },
        { id: 'row-2', left: 'DAO and dApp compatible', right: 'Most recognized Starknet identity' },
        { id: 'row-3', left: 'ZK-rollup secured', right: 'Starting from $4/year' },
      ],
    },
    utility: {
      label: 'Utility',
      headingLine1: 'What Your',
      headingLine2: '.stark Unlocks',
      items: [
        { id: 'universal-login', Icon: CiLogin, title: 'Universal Login' },
        { id: 'marketplace', Icon: PiStorefrontBold, title: 'Marketplace' },
        { id: 'park-and-earn', Icon: PiCoinBold, title: 'Park And Earn' },
        { id: 'show-digital-ownership', Icon: PiSealCheckBold, title: 'Show Digital Ownership' },
        { id: 'receive-payments', Icon: BsCurrencyDollar, title: 'Receive Payments' },
      ],
    },
    faq: {
      description: 'Answers to your most common .stark identity questions',
      items: [
        { q: 'What is a .stark identity?', a: 'A .stark identity is a blockchain-based name registered through Starknet ID that replaces long wallet addresses with a human-readable identity on Starknet.' },
        { q: 'How much does a .stark identity cost?', a: 'Registration typically starts at $4 per year for names with five or more characters, with shorter names carrying premium pricing.' },
        { q: 'Do .stark identities expire?', a: 'Yes. .stark identities require periodic renewal to maintain ownership.' },
        { q: 'What blockchain does .stark run on?', a: '.stark identities are built and secured on Starknet, a ZK-rollup on Ethereum.' },
        { q: 'Can I receive payments with my .stark identity?', a: 'Yes. Supported wallets can send funds directly to your .stark name instead of a wallet address.' },
        { q: 'Can I transfer or sell my .stark identity?', a: 'Yes. .stark identities are wallet-owned assets and can be transferred, traded, or sold at any time.' },
      ],
    },
  },

  {
    slug: 'box',
    tld: '.box',
    providerShort: 'Box',
    providerFull: 'Box Domains',
    providerIcon: SiBox,
    hero: {
      label: 'On-Chain Identity',
      headingLine1: 'Register Your',
      headingLine2: '.box Identity',
      description: 'A multi-chain identity built for Web3. One name for payments, login, governance, and digital ownership across every supported network.',
      stats: [
        { value: '150K+', label: 'Registered Identities' },
        { value: '220+', label: 'Integrations' },
        { value: '$5', label: 'Starting Price' },
      ],
    },
    about: {
      label: 'About The Identity',
      headingLine1: 'Everything',
      headingLine2: 'About .box',
      description: 'Every .box identity is registered through Box Domains, allowing users to replace complex wallet addresses with a simple, human-readable name that works across multiple chains, wallets, applications, and protocols.',
      features: [
        { id: 'multichain-native', iconSrc: SHARED_FEATURE_ICONS.ethereumNative, title: 'Multi-Chain Identity', desc: 'Built to resolve across multiple blockchains instead of being locked to a single network.' },
        { id: 'universal-recognition', iconSrc: SHARED_FEATURE_ICONS.universalRecognition, title: 'Universal Recognition', desc: 'Supported by wallets, marketplaces, DAOs, applications, and Web3 services across every supported chain.' },
        { id: 'own-presence', iconSrc: SHARED_FEATURE_ICONS.ownPresence, title: 'Own Your Presence', desc: 'Create a memorable on-chain identity that travels with you across the entire multi-chain ecosystem.' },
      ],
    },
    why: {
      label: 'Why .box',
      headingLine1: 'The Identity Standard',
      headingLine2: 'For Multi-Chain Web3',
      rows: [
        { id: 'row-1', left: 'Human-readable payments', right: 'Wallet-bound ownership' },
        { id: 'row-2', left: 'DAO and dApp compatible', right: 'Most recognized multi-chain identity' },
        { id: 'row-3', left: 'Multi-chain native', right: 'Starting from $5/year' },
      ],
    },
    utility: {
      label: 'Utility',
      headingLine1: 'What Your',
      headingLine2: '.box Unlocks',
      items: [
        { id: 'universal-login', Icon: CiLogin, title: 'Universal Login' },
        { id: 'marketplace', Icon: PiStorefrontBold, title: 'Marketplace' },
        { id: 'park-and-earn', Icon: PiCoinBold, title: 'Park And Earn' },
        { id: 'show-digital-ownership', Icon: PiSealCheckBold, title: 'Show Digital Ownership' },
        { id: 'receive-payments', Icon: BsCurrencyDollar, title: 'Receive Payments' },
      ],
    },
    faq: {
      description: 'Answers to your most common .box identity questions',
      items: [
        { q: 'What is a .box identity?', a: 'A .box identity is a blockchain-based name registered through Box Domains that replaces long wallet addresses with a human-readable identity across multiple chains.' },
        { q: 'How much does a .box identity cost?', a: 'Registration typically starts at $5 per year for names with five or more characters, with shorter names carrying premium pricing.' },
        { q: 'Do .box identities expire?', a: 'Yes. .box identities require periodic renewal to maintain ownership.' },
        { q: 'What blockchains does .box support?', a: '.box identities are designed to resolve across multiple supported blockchains rather than a single network.' },
        { q: 'Can I receive payments with my .box identity?', a: 'Yes. Supported wallets can send funds directly to your .box name instead of a wallet address.' },
        { q: 'Can I transfer or sell my .box identity?', a: 'Yes. .box identities are wallet-owned assets and can be transferred, traded, or sold at any time.' },
      ],
    },
  },
]

export function getTldPageData(slug: string): TldPageData | undefined {
  return TLD_PAGES.find(page => page.slug === slug)
}
