# Web3 Domain Marketplace Feature and UX Guide

This document is a companion to ONBOARDING.md. Where that document explains how our code works, this one is about the product itself, what a strong secondary marketplace for web3 domains actually needs to feel like, what the best platforms in this space are doing right now, and where our current implementation stands against that bar. It's meant to be read by anyone thinking about what to build next, whether that's a designer, a product person, or a developer picking their next ticket.

## The landscape today

Before getting into features, it helps to understand who the real players are and what each one is actually known for, since "web3 domain marketplace" covers a few genuinely different products wearing similar clothes.

Vision.io, formerly known as ENS.Vision, is the closest thing to a category leader for ENS specifically. It reportedly handled over a fifth of all ENS secondary sales within two days of launching, and the reason is simple, it was the first product to treat ENS names as their own category instead of just another NFT collection. It pulls listings from OpenSea, X2Y2 and LooksRare into a single view, so a buyer never has to check multiple sites for the same name, and it built filtering and bulk tools specifically shaped around how domain names actually get bought and sold.

OpenSea is not a dedicated domain marketplace at all, it just treats ENS names as a standard NFT collection alongside everything else it sells. It remains relevant because of raw liquidity, and because it's the aggregation target every ENS specific tool pulls from, but its filtering, discovery and domain specific trust signals are all noticeably weaker than the purpose built players, precisely because it wasn't designed for this category.

Unstoppable Domains runs the most "feels like a real business" marketplace of the group, selling its own web3 domains like .wallet and .crypto plus tokenized traditional domains through partners. It has invested the most visibly in bridging web2 and web3 buyers, letting people check out with a credit card or PayPal instead of needing a wallet already funded with crypto, and most recently, in shipping AI agent integration so tools like ChatGPT can search, register and manage domains through plain conversation.

3DNS and the Doma Protocol represent the newest and most structurally different direction in the category, actual traditional domains like .com and .io tokenized directly as NFTs, in partnership with real registrars, with the wildest part being that Doma's marketplace, launched inside the Base app in December 2025, lets a domain be split into fractional, tradeable shares, turning a domain from something you flip whole into something you can own a slice of the way you'd own a slice of a stock.

Smaller, more specialized tools round out the ecosystem. ENS.Tools is built almost entirely around watching domains as they approach expiry and grace period, since that moment is the highest intent event in the whole category. NameApes leans into social curation, organizing hundreds of community built "clubs" like the 999 Club or the 10K Club that act as a taxonomy for rarity and desirability that no generic NFT trait system could ever capture on its own.

## The features that actually matter, and why

Rather than listing every feature every platform has, here are the patterns that show up again and again across the strongest performers, because that repetition is the signal. If several unrelated teams independently converged on the same idea, it's probably not a stylistic choice, it's what users actually need.

### Domain aware filtering, not generic NFT filtering

The single most repeated piece of feedback across every review and comparison is that generic NFT style filtering, price and trait based, fundamentally does not work for domain names. Buyers think in terms of character length, whether a name is letters only or numbers only, how many words or segments it has, whether it's a real dictionary word, and what state its lifecycle is in. A filter panel that treats a domain the same way it would treat a PFP's hat color is going to frustrate anyone who actually knows this market. The strongest platforms let you filter by exact or range character length, by letters versus numbers versus mixed, by registration and expiry date, and by pattern based categories like palindromes or repeating digits.

### Lifecycle awareness as a first class feature, not a detail

A domain isn't a static object the way a piece of art is, it has an active state, a grace period after it lapses, and an available to register state, and the exact moment it crosses between those states is often the single highest intent moment for a buyer in the entire product. ENS.Tools built essentially their whole product around this one insight, letting people watch a specific name and get notified the instant it enters its grace period, showing a live countdown and a decaying premium price as it approaches becoming freely available again. Any serious competitor needs expiry countdowns, grace period status, and alerting to be core, not something added later.

### Cross marketplace aggregation is now the baseline expectation

Vision.io didn't win share by being prettier than OpenSea, it won by refusing to make users check five different sites for the same domain. Pulling listings from multiple sources into one place, or at minimum being honest with yourself about whether you're a walled garden and what you're offering to justify that, is table stakes now, not a nice to have.

### Bulk tools, because real sellers hold portfolios, not single names

Every mature platform put serious engineering effort into bulk registration, bulk listing, bulk renewal and bulk transfer, consistently advertising real gas savings, often cited around 17 to 20 percent, as the actual selling point. A power seller managing dozens or hundreds of domains will simply not tolerate a one at a time flow, and will leave for whichever platform respects that.

### Removing the wallet and gas barrier for buyers, without removing it for people who want it

Unstoppable's approach is the clearest example here. They let a buyer check out with a credit card, PayPal, Google Pay or Apple Pay, auto generating a lightweight wallet behind the scenes if the buyer doesn't already have one, while sellers still get paid out in stable value regardless of how the buyer paid. At the same time, a crypto native buyer can still connect their own wallet and pay directly on chain. The winning pattern is offering both paths from the same listing page, not forcing a choice between "crypto only" and "fiat only."

### Listing without requiring custody transfer first

Unstoppable again, their marketplace lets a seller list a domain they hold anywhere, verified through DNS records, without first having to transfer or wrap it into the platform's own custody. Every account of seller friction in this space points at custody transfer as a major drop off point, so removing it before a listing can even go live is a real competitive advantage.

### Social curation and pattern based rarity as pricing signal

In the absence of a formal, trusted appraisal model, the entire industry currently answers "is this a good domain and what should it cost" through community built taxonomy, NameApes' hundreds of curated "clubs," their homegrown Ape Score valuation heuristic, and informally recognized categories like the 999 Club for three digit names. This isn't decoration, it's doing real pricing and discovery work that no platform has fully replaced with something more rigorous yet, which means it's also an open opportunity for whoever builds a genuinely trustworthy appraisal tool first.

### Trust signals specific to how these assets actually break

A generic NFT marketplace has no concept of a wrapped ENS name having its permissions modified, or a fuse burned, or a resolver misconfigured, all of which are real, name breaking risks specific to this category. Vision.io explicitly surfaces wrapped state and permission warnings right at the point of purchase. Showing an avatar next to every name, bidder and owner reference is a small but consistently used trust device across the strongest platforms, since it turns an anonymous wallet address into something that feels like it belongs to a real identity.

### Conversational and AI driven interfaces are a live, current differentiator

This is genuinely new, not a prediction. Unstoppable already ships an integration that lets tools like ChatGPT or Claude search, register and manage a domain portfolio through plain natural language conversation, in production today. No ENS specific marketplace has matched this yet, and it changes two things at once, it removes the need for a new user to ever learn a filter UI at all, and it lets a power user express a bulk action as a single sentence instead of a multi step flow.

### Domains as financial assets, not just collectibles to flip

The Doma Protocol's launch inside the Base app in December 2025, bringing over 40 million traditional domains on chain with the ability to fractionalize a single domain into tradeable, fungible shares, is the biggest structural shift happening in this category right now. Even a marketplace that has no near term plan to build fractionalization itself should not architect around the assumption that a domain is always one single indivisible unit, because that assumption is already being broken by a major, mainstream competitor.

## How it should all feel

Beyond individual features, there's a consistent feel across the strongest products worth naming directly. The best domain marketplaces read closer to a trading terminal than an art gallery, dense with real information like live price in both crypto and local currency, expiry countdowns, and offer history, but never cluttered, because every piece of density is something a domain buyer actually needs to make a decision, not decoration. Avatars and identity are everywhere, next to every name and every wallet reference, because in a market built on anonymous addresses, a small human touch does a lot of trust building work cheaply. Card grids dominate over plain tables for browsing, but power tools like bulk actions and portfolio management lean back into dense, table like views once a user is clearly in a "managing my stuff" mindset rather than a "browsing to discover" one. And critically, the best flows treat the buyer's crypto fluency as a spectrum, not a gate, letting a complete newcomer check out with a credit card in the same interface a crypto native uses to connect a wallet and sign a transaction directly.

## Where our marketplace stands today

Having read through our own codebase in detail, here's an honest comparison against everything above.

We already have a genuinely good foundation for domain aware discovery. Our home page and web3 domain listing pages already fetch and filter listings by TLD and network, and our ENS marketplace page already has its own dedicated filtered experience for .eth names specifically with a price range slider, which is exactly the right instinct, treating ENS as its own category rather than folding it into a generic listing page. That said, based on what I found, our filtering doesn't yet go as deep as the strongest players on character length, letters only versus numbers only, or lifecycle state like grace period, all of which are proven to matter a lot to this specific buyer.

We do have real bulk listing tooling already built, a dedicated bulk listing modal exists in our components, which puts us ahead of a lot of newer entrants on that front. Where we're behind is on bulk renewal, bulk transfer, and gas savings messaging, none of which I found evidence of in the current codebase.

Our wallet connection flow is solid and follows web3 best practice, a proper nonce and signature challenge rather than trusting a connected address blindly. What we don't have is any fallback path for a buyer without an existing wallet or crypto, no card or PayPal checkout option, which based on the research is one of the most consistently cited friction points that the strongest platforms have specifically solved.

We have a watchlist feature already, which is good, since watchlisting is foundational to this category. What I didn't find evidence of is the specific lifecycle alerting that makes ENS.Tools so effective, notification the moment a watched domain enters grace period or becomes available, with a live decaying price shown against a countdown.

We have analytics pages and charts for a seller's own portfolio, which is a good sign, but I didn't see evidence of the kind of social or community curation layer, clubs, pattern based rarity, leaderboards, that's currently doing a lot of the pricing and discovery work across this whole industry. That's a bigger, more strategic build than a quick feature add, but it's worth knowing it's a real gap rather than a nice to have.

We don't currently aggregate listings from other marketplaces, so if a domain we don't have listed is sitting on OpenSea, our users simply won't see it. That's the single feature most directly responsible for Vision.io's early market share, so it's worth a real conversation about whether that's a fit for our roadmap or whether our differentiation should come from somewhere else entirely, like the community curation gap above.

We have no AI or conversational interface today, which given how new this pattern is industry wide isn't really a gap so much as an open door, since literally no ENS specific competitor has built this yet either.

## Suggested next moves, roughly in order of effort versus impact

If I were prioritizing where to invest first, I'd start with the cheapest, highest leverage items and work up toward the bigger strategic bets.

Tightening up domain specific filters, character length, letters only versus numbers only, and surfacing grace period and expiry state directly in the listing cards, is relatively contained work given we already have the listing data flowing through Redux, and it directly addresses the most commonly repeated piece of user frustration across the whole category.

Extending our existing watchlist feature with real lifecycle alerting, a notification when a watched domain enters grace period or becomes available, would turn a feature we already half have into one of the most genuinely valuable tools in the product, since that's the exact moment buyers care most.

Adding a non wallet checkout path, even something as simple as accepting a card payment and custodying the domain briefly before transfer, would meaningfully widen who can actually buy from us, since right now we're gated entirely behind already owning and funding a crypto wallet.

Longer term and bigger in scope, building some form of community curation or pattern based rarity, even something as simple as auto tagging domains into recognizable categories like palindromes or repeating digits, would give buyers a pricing anchor the market currently doesn't have in a trustworthy form anywhere, which is a real opportunity to differentiate rather than just catch up.

And worth just keeping on the radar rather than acting on immediately, the shift toward domains as fractionalizable financial assets is moving fast enough, backed by a major platform like Base, that it's worth revisiting this document again in a few months rather than treating it as settled.
