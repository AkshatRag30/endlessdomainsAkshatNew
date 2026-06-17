export interface Author {
  id: string
  name: string
  role: string
  avatar: string
  bio: string
  twitter?: string
  linkedin?: string
}

export const AUTHORS: Author[] = [
  {
    id: 'author-1',
    name: 'Priya Nair',
    role: 'Head of Growth',
    avatar: '/blog/authors/priya-nair.jpg',
    bio: 'Priya leads growth and ecosystem strategy at Endless Domains. She has 8 years of experience in Web3 and previously built developer communities at two L1 protocols.',
    twitter: 'https://twitter.com/priyanair_web3',
    linkedin: 'https://linkedin.com/in/priyanair',
  },
  {
    id: 'author-2',
    name: 'Marcus Obi',
    role: 'Protocol Engineer',
    avatar: '/blog/authors/marcus-obi.jpg',
    bio: 'Marcus works on the resolver and cross-chain interoperability layer at Endless Domains. He has contributed to ENS, Arbitrum name service, and several DeFi protocols.',
    twitter: 'https://twitter.com/marcobi_dev',
    linkedin: 'https://linkedin.com/in/marcobi',
  },
  {
    id: 'author-3',
    name: 'Lena Voronova',
    role: 'Research Lead',
    avatar: '/blog/authors/lena-voronova.jpg',
    bio: 'Lena focuses on on-chain reputation, identity primitives, and decentralized governance. She holds a PhD in distributed systems and has published research on cryptographic attestations.',
    twitter: 'https://twitter.com/lenavoronova',
    linkedin: 'https://linkedin.com/in/lenavoronova',
  },
  {
    id: 'author-4',
    name: 'Jin Park',
    role: 'TON Ecosystem Lead',
    avatar: '/blog/authors/jin-park.jpg',
    bio: "Jin oversees Endless Domains' integration with the TON blockchain. He was previously a core contributor to the TON DNS working group and built several TON-native dApps.",
    twitter: 'https://twitter.com/jinpark_ton',
    linkedin: 'https://linkedin.com/in/jinpark',
  },
  {
    id: 'author-5',
    name: 'Amara Diallo',
    role: 'Community Manager',
    avatar: '/blog/authors/amara-diallo.jpg',
    bio: 'Amara runs events, ambassador programs, and community initiatives for Endless Domains. She has been active in African Web3 communities since 2020 and organizes blockchain meetups across three continents.',
    twitter: 'https://twitter.com/amaradiallo_web3',
    linkedin: 'https://linkedin.com/in/amaradiallo',
  },
  {
    id: 'author-6',
    name: 'Endless Domains',
    role: 'Editorial Team',
    avatar: '/blog/authors/endless-domains.jpg',
    bio: 'The Endless Domains editorial team covers product updates, ecosystem news, and educational content about multi-chain domain infrastructure and Web3 identity.',
    twitter: 'https://twitter.com/EndlessDomains',
    linkedin: 'https://linkedin.com/company/endless-domains',
  },
]

export const getAuthorById = (id: string): Author | undefined =>
  AUTHORS.find(a => a.id === id)
