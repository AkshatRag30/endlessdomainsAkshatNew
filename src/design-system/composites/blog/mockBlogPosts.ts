import type { BlogPost } from './types'

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'understanding-on-chain-identity',
    title: 'Understanding On-Chain Identity: Your Digital Legacy',
    excerpt:
      'Your blockchain activity tells a story. Discover how on-chain identity is reshaping how we think about digital reputation and what it means to truly own your presence across chains.',
    category: 'Identity',
    publishedAt: 'June 10, 2026',
    readTime: '5 min read',
    coverImage: '/blog/on-chain-identity.jpg',
    author: { name: 'Endless Domains', avatar: '/blog/author-default.jpg' },
    featured: true,
    content: `
      <p>Your blockchain activity is more than a ledger. Every transaction, every domain registered, every protocol you have interacted with — it all forms a permanent, verifiable record of who you are in the decentralized world.</p>
      <p>On-chain identity is the idea that this history can be aggregated, interpreted, and presented as a coherent identity layer. Unlike traditional identity systems that rely on centralized databases and gatekeepers, on-chain identity is self-sovereign: you own it, and no single entity can revoke it.</p>
      <h2>Why It Matters Now</h2>
      <p>As Web3 matures, the question of trust and reputation becomes central. Who are you interacting with? Can a protocol trust that this wallet address belongs to a reliable actor? These questions drive the need for robust on-chain identity infrastructure.</p>
      <p>Endless Domains is building the scaffolding for this future — a system where your domain names, wallet activity, and cross-chain history collapse into a single verifiable score.</p>
    `,
  },
  {
    slug: 'how-to-register-bnb-domain',
    title: 'How to Register a .bnb Domain: Step-by-Step Guide',
    excerpt:
      'A complete walkthrough for registering your first BNB Chain domain. From wallet setup to final confirmation, we cover every step of the process clearly and concisely.',
    category: 'Tutorials',
    publishedAt: 'June 7, 2026',
    readTime: '8 min read',
    coverImage: '/blog/bnb-domain-guide.jpg',
    author: { name: 'Endless Domains', avatar: '/blog/author-default.jpg' },
    content: `
      <p>Registering a .bnb domain through Endless Domains is a straightforward process once you know the steps. This guide walks you through everything from connecting your wallet to completing your first registration on the BNB Chain.</p>
      <h2>Step 1: Connect Your Wallet</h2>
      <p>Navigate to the registration page and click "Connect Wallet." Endless Domains supports MetaMask, WalletConnect, and Coinbase Wallet for BNB Chain registrations.</p>
      <h2>Step 2: Search for Your Domain</h2>
      <p>Use the search bar to find the .bnb domain you want. The system will show you availability status and current pricing in real time.</p>
      <h2>Step 3: Select Registration Period</h2>
      <p>Choose how long you want to register the domain — options typically range from 1 to 5 years. Longer registrations often come with a discounted per-year rate.</p>
      <h2>Step 4: Confirm the Transaction</h2>
      <p>Review the transaction details in your wallet and confirm. Once the transaction is mined, the domain is yours and will appear in your profile dashboard.</p>
    `,
  },
  {
    slug: 'future-of-web3-domains',
    title: 'The Future of Web3 Domains: Beyond .eth',
    excerpt:
      'The domain landscape is expanding beyond Ethereum. Explore how multi-chain domain systems are creating a more connected, interoperable Web3 ecosystem for everyone.',
    category: 'Web3',
    publishedAt: 'June 3, 2026',
    readTime: '6 min read',
    coverImage: '/blog/web3-domains-future.jpg',
    author: { name: 'Endless Domains', avatar: '/blog/author-default.jpg' },
    content: `
      <p>When most people think of Web3 domains, they think of .eth — the Ethereum Name Service that pioneered on-chain human-readable addresses. But the space has grown dramatically, and today there are thriving domain ecosystems across BNB Chain, Arbitrum, Solana, and more.</p>
      <p>This expansion reflects a broader truth about the decentralized web: no single chain will win. The future is multi-chain, and your identity layer needs to reflect that reality.</p>
      <h2>Why Multi-Chain Domains Matter</h2>
      <p>A .eth domain works within the Ethereum ecosystem. A .bnb domain works within BNB Chain. But what if you operate across both? Multi-chain domain management tools like Endless Domains let you hold, manage, and present a unified identity regardless of which chain you are active on.</p>
    `,
  },
  {
    slug: 'building-reputation-decentralized-networks',
    title: 'Building Reputation in Decentralized Networks',
    excerpt:
      'Reputation in Web3 is not granted — it is earned and verifiable. Learn how decentralized reputation systems work and why they matter for the open internet.',
    category: 'Identity',
    publishedAt: 'May 28, 2026',
    readTime: '7 min read',
    coverImage: '/blog/decentralized-reputation.jpg',
    author: { name: 'Endless Domains', avatar: '/blog/author-default.jpg' },
    content: `
      <p>In the traditional internet, reputation is platform-specific. Your Twitter follower count, your Airbnb host rating, your GitHub contribution graph — each of these exists in a silo, owned by the platform, not by you.</p>
      <p>Decentralized reputation flips this model. Your on-chain activity — transactions, protocol interactions, domain registrations, governance votes — is all public, verifiable, and portable. No platform can take it away.</p>
    `,
  },
  {
    slug: 'ens-vs-unstoppable-domains',
    title: 'ENS vs Unstoppable Domains: A Detailed Comparison',
    excerpt:
      'Two of the biggest names in Web3 domains take different approaches. Here is a side-by-side breakdown of features, costs, and use cases to help you make the right choice.',
    category: 'Domains',
    publishedAt: 'May 21, 2026',
    readTime: '9 min read',
    coverImage: '/blog/ens-vs-ud.jpg',
    author: { name: 'Endless Domains', avatar: '/blog/author-default.jpg' },
    content: `
      <p>ENS (Ethereum Name Service) and Unstoppable Domains are two of the most prominent players in the Web3 domain space. Both allow you to replace long wallet addresses with human-readable names, but they differ significantly in their approach, cost model, and supported ecosystems.</p>
      <h2>ENS: The Original</h2>
      <p>ENS is a decentralized, open protocol running on Ethereum. Domain ownership is time-based — you pay an annual renewal fee to maintain control. This model ensures that abandoned domains can eventually be reclaimed.</p>
      <h2>Unstoppable Domains: One-Time Purchase</h2>
      <p>Unstoppable Domains uses a one-time purchase model — pay once, own forever. No renewals. This is appealing but means truly abandoned domains are locked permanently.</p>
    `,
  },
  {
    slug: 'multi-chain-domain-management',
    title: 'Multi-Chain Domain Management: Tips and Best Practices',
    excerpt:
      'Managing domains across multiple blockchains can be complex. These strategies and best practices will help you keep your portfolio organized, secure, and easy to manage.',
    category: 'Domains',
    publishedAt: 'May 15, 2026',
    readTime: '6 min read',
    coverImage: '/blog/multi-chain-management.jpg',
    author: { name: 'Endless Domains', avatar: '/blog/author-default.jpg' },
    content: `
      <p>If you hold domains across ENS, BNB Chain, Arbitrum, and Solana, keeping track of renewals, resolvers, and wallet assignments can quickly become a management challenge. Here are the practices that help.</p>
      <h2>Centralize Your View</h2>
      <p>Use a dashboard that aggregates all your domains in one place regardless of chain. Endless Domains' My Domains tab does exactly this — pulling in your portfolio across every supported provider.</p>
      <h2>Set Renewal Reminders</h2>
      <p>For expiry-based domains (ENS, for example), missing a renewal means losing your domain. Set calendar reminders at 90 days and 30 days before expiry.</p>
      <h2>Keep Resolver Records Updated</h2>
      <p>If you change wallets, update the resolver records on your domains promptly. Outdated resolvers mean payments and messages go to an address you no longer control.</p>
    `,
  },
]

export const ALL_CATEGORIES = ['All', ...Array.from(new Set(BLOG_POSTS.map(p => p.category)))]
