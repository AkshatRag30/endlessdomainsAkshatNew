export interface JourneyScreen {
  id: string
  number: string
  title: string
  description: string
  // null while final artwork isn't ready yet — the component renders a neutral
  // placeholder panel instead. Swap in a real path here to replace it, nothing
  // else needs to change.
  image: string | null
  imageAlt: string
  placeholderLabel: string
}

export interface Journey {
  id: string
  tabLabel: string
  leftTitle: string[]
  leftDescription: string
  screens: JourneyScreen[]
}

export const JOURNEYS: Journey[] = [
  {
    id: 'mint',
    tabLabel: 'Mint your identity',
    leftTitle: ['Mint your', 'identity'],
    leftDescription: 'Get your name on-chain',
    screens: [
      {
        id: 'mint-01',
        number: '01',
        title: 'Log In To Endless Domains',
        description: 'Connect your wallet to get started. No email or password.',
        image: '/landing/how-it-works/mint/screen-01.png',
        imageAlt: 'Endless Domains login screen with wallet and email options',
        placeholderLabel: 'Mint UI',
      },
      {
        id: 'mint-02',
        number: '02',
        title: 'Search Your Web3 Domain',
        description: 'Type any name and check availability across 70+ TLDs.',
        image: '/landing/how-it-works/mint/screen-02.png',
        imageAlt: 'Domain search screen showing name availability',
        placeholderLabel: 'Mint UI',
      },
      {
        id: 'mint-03',
        number: '03',
        title: 'Add To Cart',
        description: 'Pick your favourite and add it to cart. Pay with crypto or card.',
        image: '/landing/how-it-works/mint/screen-03.png',
        imageAlt: 'Cart screen with a selected domain ready for checkout',
        placeholderLabel: 'Mint UI',
      },
      {
        id: 'mint-04',
        number: '04',
        title: 'Mint Your Domain',
        description: "Confirm and it's minted on-chain, permanently yours.",
        image: '/landing/how-it-works/mint/screen-04.png',
        imageAlt: 'Confirmation screen for a newly minted domain',
        placeholderLabel: 'Mint UI',
      },
    ],
  },
  {
    id: 'reputation',
    tabLabel: 'Enable reputation',
    leftTitle: ['Enable', 'reputation'],
    leftDescription: 'Build your on-chain reputation',
    screens: [
      {
        id: 'reputation-01',
        number: '01',
        title: 'Open Your Minted Domain',
        description: 'Head to your dashboard and select the domain you own.',
        image: null,
        imageAlt: 'Dashboard screen showing an owned minted domain',
        placeholderLabel: 'Reputation UI',
      },
      {
        id: 'reputation-02',
        number: '02',
        title: 'Enable Reputation',
        description: 'Flip it on and your wallet history starts building a portable score.',
        image: null,
        imageAlt: 'Reputation toggle screen',
        placeholderLabel: 'Reputation UI',
      },
      {
        id: 'reputation-03',
        number: '03',
        title: 'Watch It Compound',
        description: 'Every on-chain action adds up into a sybil-resistant reputation.',
        image: null,
        imageAlt: 'Reputation score compounding screen',
        placeholderLabel: 'Reputation UI',
      },
    ],
  },
  {
    id: 'parking',
    tabLabel: 'Domain parking',
    leftTitle: ['Domain', 'parking'],
    leftDescription: 'Put your identity to work',
    screens: [
      {
        id: 'parking-01',
        number: '01',
        title: 'Open Your Domain',
        description: 'Head to Manage Domains and pick the name you want to put to work.',
        image: null,
        imageAlt: 'Manage Domains screen with a domain selected',
        placeholderLabel: 'Parking UI',
      },
      {
        id: 'parking-02',
        number: '02',
        title: 'Switch On Parking',
        description: 'One click. Your parked landing page publishes and goes live automatically.',
        image: null,
        imageAlt: 'Domain parking toggle screen',
        placeholderLabel: 'Parking UI',
      },
      {
        id: 'parking-03',
        number: '03',
        title: 'Start Earning',
        description: 'Collect ad revenue and buyer offers while you hold.',
        image: null,
        imageAlt: 'Parked domain earnings screen',
        placeholderLabel: 'Parking UI',
      },
    ],
  },
  {
    id: 'marketplace',
    tabLabel: 'Marketplace',
    leftTitle: ['Marketplace'],
    leftDescription: 'Trade identities with confidence',
    screens: [
      {
        id: 'marketplace-01',
        number: '01',
        title: 'Go To The Marketplace',
        description: 'Browse thousands of live domain listings.',
        image: null,
        imageAlt: 'Marketplace listings browse screen',
        placeholderLabel: 'Marketplace UI',
      },
      {
        id: 'marketplace-02',
        number: '02',
        title: 'List Or Purchase',
        description: 'List your domain for sale, or buy any listed name.',
        image: null,
        imageAlt: 'Marketplace list-or-buy screen',
        placeholderLabel: 'Marketplace UI',
      },
      {
        id: 'marketplace-03',
        number: '03',
        title: 'Make An Offer',
        description: 'Bid on the name you want, settled trustlessly on-chain.',
        image: null,
        imageAlt: 'Marketplace offer screen',
        placeholderLabel: 'Marketplace UI',
      },
    ],
  },
  {
    id: 'perks',
    tabLabel: 'Perks',
    leftTitle: ['Perks'],
    leftDescription: 'Unlock more from your identity',
    screens: [
      {
        id: 'perks-01',
        number: '01',
        title: 'Build Your Reputation',
        description: 'Grow your score through on-chain activity.',
        image: null,
        imageAlt: 'Reputation score building screen',
        placeholderLabel: 'Perks UI',
      },
      {
        id: 'perks-02',
        number: '02',
        title: 'Enable Perks',
        description: 'Turn on perks from your dashboard.',
        image: null,
        imageAlt: 'Perks toggle screen',
        placeholderLabel: 'Perks UI',
      },
      {
        id: 'perks-03',
        number: '03',
        title: 'Claim Your Perks',
        description: 'Example: 30% off Ledger hardware, reputation score above 500 required.',
        image: null,
        imageAlt: 'Perk claim screen',
        placeholderLabel: 'Perks UI',
      },
    ],
  },
]
