export interface EventSummary {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  image: string
  date: string
  location: string
  attendees: string
  href: string
  status: 'upcoming' | 'ongoing' | 'concluded'
  featured: boolean
}

export const EVENTS: EventSummary[] = [
  {
    id: 'event-001',
    slug: 'token2049-dubai',
    title: 'Token2049 Dubai',
    excerpt:
      'Endless Domains took the stage at one of the world\'s largest Web3 gatherings — showcasing the future of decentralised digital identity to thousands of founders, investors, and builders.',
    category: 'Global Conference',
    image: '/events/Frame 2.jpg',
    date: '30 Apr — 1 May 2025',
    location: 'DIFC, Dubai, UAE',
    attendees: '10,000+ Attendees',
    href: '#',
    status: 'concluded',
    featured: true,
  },
  {
    id: 'event-002',
    slug: 'domainer-conference-expo',
    title: 'Domainer Conference and Expo',
    excerpt:
      'The world\'s premier domain industry gathering — TOKEN2049 Dubai brings together global blockchain leaders, NFT pioneers, and Web3 builders to shape the future of digital identity.',
    category: 'Global Conference',
    image: '/events/Frame 1.jpg',
    date: '12/3/25',
    location: 'Bangalore',
    attendees: '1.1k | 10 Apr — 15 Apr 25',
    href: '#',
    status: 'upcoming',
    featured: false,
  },
  {
    id: 'event-003',
    slug: 'ethglobal-new-delhi',
    title: 'ETHGlobal New Delhi',
    excerpt:
      'Hack, build, and innovate on Ethereum with a global community of developers. Endless Domains will be sponsoring prizes for the best Web3 identity projects.',
    category: 'Hackathon',
    image: '/events/Frame 3.jpg',
    date: '14/4/25',
    location: 'New Delhi',
    attendees: '1.1k | 10 Apr — 15 Apr 25',
    href: '#',
    status: 'upcoming',
    featured: false,
  },
  {
    id: 'event-004',
    slug: 'india-blockchain-week',
    title: 'India Blockchain Week',
    excerpt:
      'India\'s biggest blockchain event brings together founders, investors, and developers to accelerate the adoption of decentralised technology across South Asia.',
    category: 'Regional',
    image: '/events/Frame 4.jpg',
    date: '22/6/25',
    location: 'Mumbai',
    attendees: '1.1k | 10 Apr — 15 Apr 25',
    href: '#',
    status: 'upcoming',
    featured: false,
  },
  {
    id: 'event-005',
    slug: 'domain-days-dubai',
    title: 'Domain Days Dubai',
    excerpt:
      'A dedicated summit for the domain industry — connect with registrars, investors, and platform builders shaping the next generation of digital identity.',
    category: 'Global Conference',
    image: '/events/Frame 6.jpg',
    date: '10/7/25',
    location: 'Dubai',
    attendees: '1.1k | 10 Apr — 15 Apr 25',
    href: '#',
    status: 'upcoming',
    featured: false,
  },
  {
    id: 'event-006',
    slug: 'web3-identity-summit',
    title: 'Web3 Identity Summit',
    excerpt:
      'Explore the intersection of blockchain identity, NFT domains, and decentralised naming systems at this dedicated summit for Web3 identity innovators.',
    category: 'Summit',
    image: '/events/Frame 1.jpg',
    date: '18/8/25',
    location: 'Singapore',
    attendees: '1.1k | 10 Apr — 15 Apr 25',
    href: '#',
    status: 'upcoming',
    featured: false,
  },
]

export function getEventBySlug(slug: string): EventSummary | undefined {
  return EVENTS.find(e => e.slug === slug)
}

export function getAllEvents(): EventSummary[] {
  return EVENTS
}
