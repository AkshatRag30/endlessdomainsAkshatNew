export interface EventDetail {
  slug: string
  heroImage: string
  status: 'upcoming' | 'ongoing' | 'concluded'
  statusLabel: string
  recapUrl?: string
  shareUrl?: string
  details: {
    date: string
    location: string
    locationUrl?: string
    duration: string
    attendees: string
    eventType: string
    language: string
  }
  organisedBy: {
    roleLabel: string
    name: string
    logoLabel?: string
    eventOrganiser: string
  }
  galleryImages: string[]
  galleryTitle: string
  galleryEyebrow: string
  galleryTags: string[]
  aboutTitle: string
  aboutTags: string[]
  aboutContent: string
  sidebarImage?: string
  seo: {
    title: string
    description: string
    keywords: string[]
  }
}

export const EVENT_DETAILS: EventDetail[] = [
  {
    slug: 'token2049-dubai',
    heroImage: '/events/Frame 2.jpg',
    status: 'concluded',
    statusLabel: 'This event has concluded. Watch the recap below.',
    recapUrl: '#',
    shareUrl: '#',
    details: {
      date: '30 Apr — 1 May 2025',
      location: 'DIFC, Dubai, UAE',
      locationUrl: '#',
      duration: '2 Days · 9:00 AM — 8:00 PM',
      attendees: '10,000+ Attendees',
      eventType: 'Global Conference',
      language: 'English',
    },
    organisedBy: {
      roleLabel: 'World & Featured Exhibitor',
      name: 'Endless Domains',
      eventOrganiser: 'Token2049',
    },
    galleryImages: [
      '/events/Frame 1.jpg',
      '/events/Frame 2.jpg',
      '/events/Frame 3.jpg',
      '/events/Frame 4.jpg',
      '/events/Frame 6.jpg',
      '/events/Frame 1.jpg',
    ],
    galleryTitle: 'Moments from Dubai',
    galleryEyebrow: 'EVENT GALLERY',
    galleryTags: ['WEB3', 'WEB3', 'WEB3', 'WEB3', 'WEB3'],
    aboutTitle: 'Where Web3 Meets the World',
    aboutTags: ['WEB3', 'WEB3', 'WEB3', 'WEB3', 'WEB3'],
    aboutContent: `<p>Token2049 Dubai is one of the world's most prominent Web3 events, bringing together the global crypto ecosystem under one roof. Endless Domains participated as a featured exhibitor and speaker, presenting the vision of a self-sovereign digital identity layer for the open internet.</p>
<p>Our team engaged with thousands of founders, investors, developers, and enthusiasts across two days of panels, demos, and one-on-one conversations — making the case that every human deserves to own their corner of the internet. The response was overwhelming, and we left Dubai with new partnerships, users, and believers in the mission.</p>`,
    sidebarImage: '/events/Frame 4.jpg',
    seo: {
      title: 'Token2049 Dubai — Endless Domains at the World\'s Largest Web3 Conference',
      description:
        'Endless Domains showcased the future of decentralised digital identity at Token2049 Dubai, one of the world\'s largest Web3 gatherings, reaching 10,000+ founders, investors, and builders.',
      keywords: ['Token2049', 'Dubai', 'Web3', 'blockchain', 'digital identity', 'Endless Domains', 'NFT domains'],
    },
  },
  {
    slug: 'domainer-conference-expo',
    heroImage: '/events/Frame 1.jpg',
    status: 'upcoming',
    statusLabel: 'Registration is open. Secure your spot now.',
    recapUrl: undefined,
    shareUrl: '#',
    details: {
      date: '12 Mar 2025',
      location: 'Bangalore, India',
      duration: '1 Day · 10:00 AM — 6:00 PM',
      attendees: '1,100+ Expected',
      eventType: 'Global Conference',
      language: 'English',
    },
    organisedBy: {
      roleLabel: 'Featured Exhibitor',
      name: 'Endless Domains',
      eventOrganiser: 'Domainer Expo',
    },
    galleryImages: [
      '/events/Frame 1.jpg',
      '/events/Frame 2.jpg',
      '/events/Frame 3.jpg',
      '/events/Frame 4.jpg',
    ],
    galleryTitle: 'From Past Editions',
    galleryEyebrow: 'EVENT GALLERY',
    galleryTags: ['DOMAINS', 'WEB3', 'NFT', 'BLOCKCHAIN'],
    aboutTitle: 'The Premier Domain Industry Gathering',
    aboutTags: ['DOMAINS', 'WEB3', 'NFT', 'BLOCKCHAIN', 'IDENTITY'],
    aboutContent: `<p>The Domainer Conference and Expo is the world's premier domain industry event, bringing together registrars, investors, and digital asset platform builders for an immersive day of talks, panels, and networking.</p>
<p>Endless Domains will be exhibiting as a featured sponsor, showcasing our multi-chain domain management platform and the future of Web3 identity for retail and enterprise users alike.</p>`,
    seo: {
      title: 'Domainer Conference and Expo — Endless Domains',
      description:
        'Endless Domains exhibits at the world\'s premier domain industry gathering in Bangalore — showcasing multi-chain domain management and Web3 identity.',
      keywords: ['Domainer', 'Bangalore', 'domain conference', 'Web3', 'Endless Domains'],
    },
  },
  {
    slug: 'ethglobal-new-delhi',
    heroImage: '/events/Frame 3.jpg',
    status: 'upcoming',
    statusLabel: 'Hackathon registrations are open.',
    details: {
      date: '14 Apr 2025',
      location: 'New Delhi, India',
      duration: '2 Days · 9:00 AM — 9:00 PM',
      attendees: '1,100+ Expected',
      eventType: 'Hackathon',
      language: 'English',
    },
    organisedBy: {
      roleLabel: 'Prize Sponsor',
      name: 'Endless Domains',
      eventOrganiser: 'ETHGlobal',
    },
    galleryImages: [
      '/events/Frame 3.jpg',
      '/events/Frame 1.jpg',
      '/events/Frame 4.jpg',
      '/events/Frame 6.jpg',
    ],
    galleryTitle: 'Previous ETHGlobal Moments',
    galleryEyebrow: 'EVENT GALLERY',
    galleryTags: ['ETH', 'WEB3', 'HACK', 'BUILD'],
    aboutTitle: 'Build the Future of Web3 Identity',
    aboutTags: ['ETH', 'WEB3', 'HACKATHON', 'IDENTITY', 'BUILD'],
    aboutContent: `<p>ETHGlobal New Delhi brings together the brightest Ethereum developers for an intense multi-day hackathon focused on pushing the boundaries of on-chain applications, identity systems, and decentralised infrastructure.</p>
<p>Endless Domains is sponsoring prizes for the best Web3 identity projects — teams building on top of our domain resolution APIs, wallet address mapping, or cross-chain identity primitives are especially encouraged to apply.</p>`,
    seo: {
      title: 'ETHGlobal New Delhi — Endless Domains Prize Sponsor',
      description:
        'Endless Domains sponsors prizes at ETHGlobal New Delhi for the best Web3 identity and on-chain domain projects.',
      keywords: ['ETHGlobal', 'New Delhi', 'hackathon', 'Web3', 'Ethereum', 'Endless Domains'],
    },
  },
  {
    slug: 'india-blockchain-week',
    heroImage: '/events/Frame 4.jpg',
    status: 'upcoming',
    statusLabel: 'Registrations opening soon.',
    details: {
      date: '22 Jun 2025',
      location: 'Mumbai, India',
      duration: '3 Days · 10:00 AM — 7:00 PM',
      attendees: '1,100+ Expected',
      eventType: 'Regional Conference',
      language: 'English, Hindi',
    },
    organisedBy: {
      roleLabel: 'Featured Speaker',
      name: 'Endless Domains',
      eventOrganiser: 'India Blockchain Week',
    },
    galleryImages: [
      '/events/Frame 4.jpg',
      '/events/Frame 1.jpg',
      '/events/Frame 2.jpg',
      '/events/Frame 3.jpg',
    ],
    galleryTitle: 'India Blockchain Moments',
    galleryEyebrow: 'EVENT GALLERY',
    galleryTags: ['INDIA', 'BLOCKCHAIN', 'WEB3', 'CRYPTO'],
    aboutTitle: 'India\'s Biggest Blockchain Event',
    aboutTags: ['INDIA', 'BLOCKCHAIN', 'WEB3', 'CRYPTO', 'DEFI'],
    aboutContent: `<p>India Blockchain Week is the country's most significant blockchain and Web3 event, drawing together founders, investors, regulators, and developers to shape the trajectory of decentralised technology in South Asia.</p>
<p>Endless Domains will be speaking on the main stage about the future of on-chain identity, exploring how multi-chain domain names can serve as the foundation for a new generation of digital citizens.</p>`,
    seo: {
      title: 'India Blockchain Week — Endless Domains',
      description:
        'Endless Domains speaks at India Blockchain Week in Mumbai on the future of on-chain identity and multi-chain domain infrastructure.',
      keywords: ['India Blockchain Week', 'Mumbai', 'blockchain', 'Web3', 'Endless Domains'],
    },
  },
  {
    slug: 'domain-days-dubai',
    heroImage: '/events/Frame 6.jpg',
    status: 'upcoming',
    statusLabel: 'Registrations opening soon.',
    details: {
      date: '10 Jul 2025',
      location: 'Dubai, UAE',
      duration: '2 Days · 9:00 AM — 6:00 PM',
      attendees: '1,100+ Expected',
      eventType: 'Industry Summit',
      language: 'English',
    },
    organisedBy: {
      roleLabel: 'Featured Exhibitor',
      name: 'Endless Domains',
      eventOrganiser: 'Domain Days',
    },
    galleryImages: [
      '/events/Frame 6.jpg',
      '/events/Frame 2.jpg',
      '/events/Frame 1.jpg',
      '/events/Frame 3.jpg',
    ],
    galleryTitle: 'Domain Days Highlights',
    galleryEyebrow: 'EVENT GALLERY',
    galleryTags: ['DOMAINS', 'DUBAI', 'WEB3', 'REGISTRAR'],
    aboutTitle: 'Where the Domain Industry Meets',
    aboutTags: ['DOMAINS', 'DUBAI', 'WEB3', 'REGISTRAR', 'IDENTITY'],
    aboutContent: `<p>Domain Days Dubai is the most focused and intimate summit in the domain industry calendar — bringing together registrars, domain investors, and digital platform builders for two days of deal-making, education, and networking in the heart of Dubai.</p>
<p>As a multi-chain domain registrar operating across ENS, BNB, Arbitrum, and Solana, Endless Domains will be exhibiting our platform and engaging directly with the traditional domain industry about the convergence of Web2 and Web3 naming infrastructure.</p>`,
    seo: {
      title: 'Domain Days Dubai — Endless Domains',
      description:
        'Endless Domains exhibits at Domain Days Dubai — connecting the traditional domain industry with the future of Web3 naming infrastructure.',
      keywords: ['Domain Days', 'Dubai', 'domain industry', 'Web3', 'Endless Domains'],
    },
  },
  {
    slug: 'web3-identity-summit',
    heroImage: '/events/Frame 1.jpg',
    status: 'upcoming',
    statusLabel: 'Early bird tickets available.',
    details: {
      date: '18 Aug 2025',
      location: 'Singapore',
      duration: '1 Day · 9:00 AM — 7:00 PM',
      attendees: '1,100+ Expected',
      eventType: 'Summit',
      language: 'English',
    },
    organisedBy: {
      roleLabel: 'Keynote Speaker',
      name: 'Endless Domains',
      eventOrganiser: 'Web3 Identity Alliance',
    },
    galleryImages: [
      '/events/Frame 1.jpg',
      '/events/Frame 3.jpg',
      '/events/Frame 6.jpg',
      '/events/Frame 4.jpg',
    ],
    galleryTitle: 'Identity Summit Moments',
    galleryEyebrow: 'EVENT GALLERY',
    galleryTags: ['IDENTITY', 'WEB3', 'SUMMIT', 'SINGAPORE'],
    aboutTitle: 'The Future of On-Chain Identity',
    aboutTags: ['IDENTITY', 'WEB3', 'SUMMIT', 'SINGAPORE', 'DOMAINS'],
    aboutContent: `<p>The Web3 Identity Summit is a dedicated gathering for builders, researchers, and founders working at the intersection of decentralised identity, NFT domains, and blockchain naming systems — the fastest growing sector in the open internet stack.</p>
<p>Endless Domains is keynoting this year's summit, presenting a comprehensive look at multi-chain identity infrastructure and the roadmap for a unified, portable digital identity layer that spans every major blockchain.</p>`,
    seo: {
      title: 'Web3 Identity Summit — Endless Domains Keynote',
      description:
        'Endless Domains keynotes the Web3 Identity Summit in Singapore, presenting the vision for multi-chain on-chain identity infrastructure.',
      keywords: ['Web3 Identity Summit', 'Singapore', 'identity', 'domains', 'Endless Domains'],
    },
  },
]

export function getEventDetailBySlug(slug: string): EventDetail | undefined {
  return EVENT_DETAILS.find(d => d.slug === slug)
}
