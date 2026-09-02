// Type + static data for the landing page copy's blog teaser section only.
// Kept separate from ./blogs.ts (a different, incompatible BlogSummary shape already
// used elsewhere in this project) so this replica doesn't touch that existing type.
// This static list stands in for what the live site pulls from Ghost CMS at build time —
// this project has no Ghost credentials, so the teaser is baked in with a real content
// snapshot (fetched once from the live Ghost Content API) instead of an empty state.

export interface BlogSummary {
  slug: string
  title: string
  excerpt: string
  image: string
  imageAlt: string
  category: string
  categorySlug: string
  publishedAt: string
  readingTime: number
  views: number
  author: { name: string; avatar: string | null }
  tags: string[]
}

export const LANDING_BLOG_POSTS: BlogSummary[] = [
  {
    slug: 'ibw-2025-recap-shaping-the-future-of-web-3-identity-with-endless-domains',
    title: 'IBW 2025 Recap: Shaping the Future of Web3 Identity with Endless Domains',
    excerpt:
      "India Blockchain Week 2025 wasn't just another conference: it was a reset moment for Web3 in India. As Silver Sponsors, Endless Domains stepped into an ecosystem that felt quieter than previous years, yet clearer in purpose.",
    image:
      'https://endless-domains.ghost.io/content/files/images/cdn-builder-io/api/v1/image/assets/4dd0d1579bb546e085ffc2bb54b6a7cb/1214c7ba0efa4f86bed28faaed4b1d3d.jpg',
    imageAlt: 'IBW 2025 Recap',
    category: 'Endless Academy',
    categorySlug: 'endless-academy',
    publishedAt: '2025-12-30T10:30:37.000+00:00',
    readingTime: 3,
    views: 10,
    author: {
      name: 'Bhavuk Kathuria',
      avatar: 'https://storage.ghost.io/c/42/c1/42c19b7d-a1c0-4d79-8168-da4f82c8308a/content/images/2026/06/ChatGPT-Image-Jun-24--2026--11_55_11-AM-2-1-1.png',
    },
    tags: [],
  },
  {
    slug: 'digital-identity-web3-decentralized-freedom',
    title: 'Digital Identity: The New Claim to Freedom in a Decentralised World',
    excerpt:
      "Digital identity is no longer a profile picture, it is the sovereign infrastructure of our online lives. As we move into a decentralized world, owning your identity via Web3 domains has become a modern claim to freedom.",
    image:
      'https://endless-domains.ghost.io/content/files/images/cdn-builder-io/api/v1/image/assets/4dd0d1579bb546e085ffc2bb54b6a7cb/62be6b09a627489c9fdba66bb351db97.jpg',
    imageAlt: 'Digital Identity',
    category: 'General',
    categorySlug: 'general',
    publishedAt: '2025-12-18T06:46:03.000+00:00',
    readingTime: 3,
    views: 8,
    author: {
      name: 'Bhavuk Kathuria',
      avatar: 'https://storage.ghost.io/c/42/c1/42c19b7d-a1c0-4d79-8168-da4f82c8308a/content/images/2026/06/ChatGPT-Image-Jun-24--2026--11_55_11-AM-2-1-1.png',
    },
    tags: [],
  },
  {
    slug: 'brand-crypto-wallet-domain',
    title: 'Best Practices for Branding Your Cryptocurrency Wallet with a .wallet Domain',
    excerpt:
      'Elevate your crypto wallet! Brand it with a .wallet domain for enhanced trust, professionalism, and recognition in the Web3 world.',
    image: 'https://storage.ghost.io/c/42/c1/42c19b7d-a1c0-4d79-8168-da4f82c8308a/content/images/2026/07/ChatGPT-Image-Jul-23--2026--11_44_21-AM.png',
    imageAlt: 'Best Practices for Branding Your Cryptocurrency Wallet with a .wallet Domain',
    category: 'Identity Usecases',
    categorySlug: 'identity-usecases',
    publishedAt: '2025-02-28T07:57:55.000+00:00',
    readingTime: 9,
    views: 3,
    author: {
      name: 'Bhavuk Kathuria',
      avatar: 'https://storage.ghost.io/c/42/c1/42c19b7d-a1c0-4d79-8168-da4f82c8308a/content/images/2026/06/ChatGPT-Image-Jun-24--2026--11_55_11-AM-2-1-1.png',
    },
    tags: [],
  },
  {
    slug: 'domain-platforms-web3-adoption',
    title: 'How Domain Platforms Are Helping Drive Mass Adoption of Web3 Technologies',
    excerpt: 'Web3 for everyone! See how domain platforms are bridging the gap between traditional internet and decentralized technologies.',
    image: 'https://storage.ghost.io/c/42/c1/42c19b7d-a1c0-4d79-8168-da4f82c8308a/content/images/2026/07/ChatGPT-Image-Jul-23--2026--11_46_03-AM.png',
    imageAlt: 'How Domain Platforms Are Helping Drive Mass Adoption of Web3 Technologies',
    category: "What's New",
    categorySlug: 'whats-new',
    publishedAt: '2025-02-28T07:38:24.000+00:00',
    readingTime: 5,
    views: 3,
    author: {
      name: 'Bhavuk Kathuria',
      avatar: 'https://storage.ghost.io/c/42/c1/42c19b7d-a1c0-4d79-8168-da4f82c8308a/content/images/2026/06/ChatGPT-Image-Jun-24--2026--11_55_11-AM-2-1-1.png',
    },
    tags: [],
  },
  {
    slug: 'metaverse-web3-virtual-reality',
    title: 'Metaverse and Web3: The Future of Virtual Reality',
    excerpt: "Web3 domains: Your key to a decentralized future. Explore how they're changing online interactions and ownership.",
    image: 'https://storage.ghost.io/c/42/c1/42c19b7d-a1c0-4d79-8168-da4f82c8308a/content/images/2026/07/ChatGPT-Image-Jul-23--2026--11_52_36-AM.png',
    imageAlt: 'Metaverse and Web3: The Future of Virtual Reality',
    category: 'General',
    categorySlug: 'general',
    publishedAt: '2025-02-27T10:22:10.000+00:00',
    readingTime: 6,
    views: 2,
    author: {
      name: 'Himanshu Sachan',
      avatar: 'https://storage.ghost.io/c/42/c1/42c19b7d-a1c0-4d79-8168-da4f82c8308a/content/images/2026/06/1778248567277.jpg',
    },
    tags: [],
  },
  {
    slug: 'freename-web3-domain-business-uses',
    title: '15 Ways to Utilize Freename Web3 Domain for Business Projects',
    excerpt: 'Explore 15 creative uses for businesses in the decentralized web.',
    image: 'https://storage.ghost.io/c/42/c1/42c19b7d-a1c0-4d79-8168-da4f82c8308a/content/images/2026/07/ChatGPT-Image-Jul-23--2026--12_03_42-PM.png',
    imageAlt: '15 Ways to Utilize Freename Web3 Domain for Business Projects',
    category: 'General',
    categorySlug: 'general',
    publishedAt: '2025-02-27T08:57:18.000+00:00',
    readingTime: 7,
    views: 1,
    author: {
      name: 'Himanshu Sachan',
      avatar: 'https://storage.ghost.io/c/42/c1/42c19b7d-a1c0-4d79-8168-da4f82c8308a/content/images/2026/06/1778248567277.jpg',
    },
    tags: [],
  },
]
