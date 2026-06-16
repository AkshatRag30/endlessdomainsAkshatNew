# Web3 Complete Guide: Beginner to Advanced
### The Official Knowledge Base for Endless Domains & the Reputation Platform

> This document is written for anyone — whether you have never heard of blockchain before or are a seasoned developer. Read it from top to bottom to build a complete mental model, or jump to any section that interests you. Every term used anywhere in the Endless Domains platform is defined and explained here in context.

---

## Table of Contents

1. [The Evolution of the Web](#1-the-evolution-of-the-web)
2. [Blockchain — The Core Technology](#2-blockchain--the-core-technology)
3. [Cryptography & Wallets](#3-cryptography--wallets)
4. [Transactions & Gas](#4-transactions--gas)
5. [Tokens, NFTs & Digital Assets](#5-tokens-nfts--digital-assets)
6. [Smart Contracts](#6-smart-contracts)
7. [Blockchain Networks & the Multi-Chain World](#7-blockchain-networks--the-multi-chain-world)
8. [Web3 Identity & Domain Names](#8-web3-identity--domain-names)
9. [Reputation Systems in Web3](#9-reputation-systems-in-web3)
10. [Endless Domains Reputation System — Deep Dive](#10-endless-domains-reputation-system--deep-dive)
11. [The GM Check-In System](#11-the-gm-check-in-system)
12. [Perks & Rewards](#12-perks--rewards)
13. [Leaderboards & Analytics](#13-leaderboards--analytics)
14. [Advanced Web3 Concepts](#14-advanced-web3-concepts)
15. [Developer Reference — APIs, ABIs & Integrations](#15-developer-reference--apis-abis--integrations)
16. [Complete Glossary A–Z](#16-complete-glossary-az)

---

## 1. The Evolution of the Web

### Web1 — Read-Only Internet (1991–2004)

The first version of the internet was a collection of static pages. Users could visit a website and read information, but could not interact with it. Pages were published by a small number of creators and consumed passively by everyone else. Think of early news websites, directories, and plain HTML pages. Data was scattered across thousands of independently hosted servers, and no single company owned it all. This era had its problems — it was hard to use and hard to build — but it was fundamentally decentralized.

### Web2 — Read-Write Internet (2004–Present)

Web2 gave rise to social media, e-commerce, streaming, and user-generated content. Suddenly, anyone could write to the web: post a photo, leave a review, send a message. This era created massive value and connected billions of people. However, it also created a fundamental problem: centralization of power and data. When you post on a social platform, you do not own that content. When you create an account, your identity lives on someone else's servers. When a platform shuts down or bans you, everything you built disappears. The business model of Web2 is surveillance capitalism — your personal data, behavior, and attention are the product being sold to advertisers.

### Web3 — Read-Write-Own Internet (2015–Present)

Web3 is built on a simple but radical idea: **ownership**. Instead of trusting a company to hold your data, your assets, and your identity, Web3 puts that ownership directly in your hands through cryptography and distributed ledgers called blockchains. In Web3 you can own digital assets the same way you own physical objects. You can own a domain name that no company can take from you. You can own tokens that represent real value. You can prove your identity and history without relying on any central authority.

**The Three Pillars of Web3:**

- **Decentralization**: No single entity controls the network. Thousands of independent computers called nodes collectively validate and store data.
- **Trustlessness**: You do not need to trust any company or person. The rules are enforced by code that runs automatically on a blockchain. This code is called a smart contract.
- **Permissionlessness**: Anyone can participate without asking for approval from a gatekeeper. You do not need a bank account to send money. You do not need a company's permission to deploy an application.

---

## 2. Blockchain — The Core Technology

### What is a Blockchain?

A blockchain is a special kind of database. Unlike a traditional database that lives on a single company's server, a blockchain is replicated across thousands of computers simultaneously. Every computer in the network holds the same complete copy of the data. When someone wants to add new information, the entire network must agree before it gets recorded. Once information is recorded, it is virtually impossible to change or delete it.

The name "blockchain" comes from how data is stored: information is grouped into **blocks**, and each block is cryptographically linked to the one before it, forming a **chain**. If you tried to change old data, you would break the cryptographic link between blocks, which the entire network would immediately detect and reject.

### Blocks

A block is a container that holds a batch of validated transactions along with some important metadata. Every block contains:

- **Block Number (Block Height)**: Its position in the chain. Block 0 is called the Genesis Block — the very first block ever created.
- **Timestamp**: The exact moment the block was created.
- **Transactions**: A list of all the actions that happened in this block (transfers, contract calls, etc.).
- **Previous Block Hash**: A fingerprint of the block before it, which is how blocks are chained together.
- **Nonce**: A number that validators adjust to produce a valid hash (used in Proof of Work systems).
- **State Root**: A compact summary of the entire current state of the blockchain (all balances, all contract storage) encoded as a Merkle root.

### Hashing — The Fingerprint Mechanism

A hash function is a mathematical algorithm that takes any input — a word, a document, a block of transactions — and produces a fixed-length output called a hash or digest. The SHA-256 algorithm, for example, always produces a 64-character hexadecimal string. Two critical properties make hashes perfect for blockchains:

1. **Deterministic**: The same input always produces the same output.
2. **Avalanche effect**: Changing even one character in the input produces a completely different output.

This means if someone tampers with a transaction inside a historical block, the block's hash changes, which invalidates the next block's reference to it, which cascades through every block after it. The tampering is immediately and provably obvious to the whole network.

### Consensus Mechanisms

Since no central authority decides what gets added to the blockchain, the network needs a way for all participants to agree on the truth. This agreement process is called a consensus mechanism.

#### Proof of Work (PoW)

The original consensus mechanism, used by Bitcoin. To add a new block, a computer (called a miner) must solve an extremely difficult mathematical puzzle that requires massive computational effort. The first miner to solve it gets to add the block and earns a reward in the blockchain's native token. The difficulty of the puzzle is what makes it expensive to attack the network — you would need to control more than 50% of the world's mining power, which is economically infeasible.

**Analogy**: Imagine a lottery where getting a ticket requires solving a very hard sudoku. The more puzzles you solve per second, the more lottery tickets you hold. But every puzzle wastes electricity, which is why PoW is criticized for energy consumption.

#### Proof of Stake (PoS)

Used by Ethereum (since The Merge in 2022) and most modern blockchains. Instead of using computational power, validators must lock up (stake) a certain amount of the native token as collateral. If a validator tries to cheat — for example, by approving a fraudulent transaction — they lose their staked tokens in a process called slashing. This makes dishonesty financially ruinous.

**Analogy**: To vote on what gets added to the ledger, you must put money into an escrow account. If you vote honestly, you get a reward. If you cheat, you lose your escrow.

#### Delegated Proof of Stake (DPoS)

A variation where token holders vote for a set of trusted delegates who do the actual block validation. This is faster and more scalable than standard PoS but is somewhat more centralized.

#### Proof of History (PoH)

Used by Solana. A cryptographic proof that creates a historical record proving that an event occurred at a specific moment in time. It acts as a decentralized clock, allowing the network to process transactions at extremely high speed without waiting for validators to communicate timestamps.

### Nodes

A node is any computer participating in a blockchain network. There are different types:

- **Full Node**: Downloads and validates every single block and transaction since the genesis block. Stores the complete blockchain history. This is the most trustless way to interact with the network.
- **Light Node**: Only downloads block headers (the metadata) rather than every transaction. Relies on full nodes for some validation. Uses far less storage and bandwidth, which makes it suitable for mobile apps and browsers.
- **Validator Node / Miner**: A full node that also participates in the consensus process — either mining new blocks (PoW) or staking tokens to vote on new blocks (PoS).
- **Archive Node**: Like a full node but also stores historical state data (every account balance at every block). Essential for analytics and explorers but requires enormous storage.

### Finality

Finality refers to the point at which a transaction is irreversible. On Bitcoin, a transaction is considered final after 6 block confirmations (roughly 60 minutes). On Ethereum PoS, finality is reached after the network achieves a "checkpoint" roughly every 12 minutes. On Solana, transactions reach finality in about 0.4 seconds. Different applications require different levels of finality — a high-value international transfer might wait for multiple confirmations, while a casual in-game action might proceed after just one.

---

## 3. Cryptography & Wallets

### Public-Key Cryptography

The security of all Web3 systems rests on a branch of mathematics called asymmetric (or public-key) cryptography. Here is how it works:

Every wallet generates a mathematically linked pair of keys:

- **Private Key**: A secret 256-bit number that only you should ever know. This is like the master password to your entire on-chain identity. Anyone who has your private key has complete control over your wallet. It looks like: `0x4c0883a69102937d6231471b5dbb6e538ebb2d12345678...`
- **Public Key**: Derived mathematically from your private key, but the math only works in one direction — you cannot reverse-engineer the private key from the public key. It is safe to share freely.
- **Wallet Address**: A shorter version of your public key, derived by hashing it. On Ethereum it is 42 characters starting with `0x`. Example: `0xAbCd1234...`. On Solana it is a Base58-encoded string of 32-44 characters.

The elegant magic of this system: when you want to authorize a transaction (like sending tokens or calling a smart contract), you sign it with your private key. Anyone on the network can use your public key to verify that the signature is valid — without ever needing to know your private key. The blockchain does not ask "who are you?" It asks "can you prove you own this key?"

### Seed Phrases (Mnemonic Phrases)

A private key is a 256-bit number. It is hard to write down or memorize accurately. To solve this, a standard called BIP-39 converts your private key into a sequence of 12 or 24 common English words. This sequence is your **seed phrase** (also called a recovery phrase or mnemonic phrase).

Example (never use this one): `witch collapse practice feed shame open despair creek road again ice least`

From this phrase, a deterministic algorithm can regenerate your private key (and actually generate dozens of separate private keys for different blockchains — all from one phrase). This is why:

- **Never share your seed phrase with anyone, ever.** Not a support agent, not a website, not an app. Any legitimate wallet or application will never ask for it.
- **Store it offline.** Write it on paper (or engrave it in metal for fire/water resistance) and keep it somewhere physically secure.
- **If you lose your seed phrase and also lose access to your device, your funds are gone forever.** There is no "forgot password" button in Web3.

### HD Wallets — Hierarchical Deterministic Wallets

Modern wallets are "hierarchical deterministic," meaning from one seed phrase they can generate a virtually unlimited tree of key pairs following a path notation like `m/44'/60'/0'/0/0`. The `44'` means ERC-20 tokens, `60'` means Ethereum, `0'` means the first account, `0` means the external chain, and the final `0` is the address index. This is how one seed phrase manages dozens of different wallet addresses across many blockchains.

### Wallet Types

#### Hot Wallets

A hot wallet is one that is connected to the internet. It is convenient for everyday use but is more exposed to hacking risk.

- **Browser Extension Wallets**: Software installed as a browser plugin. MetaMask is the most widely used EVM wallet. Phantom is the dominant Solana wallet. These inject a Web3 provider object (`window.ethereum` for EVM, `window.phantom.solana`) that web applications use to request signatures and send transactions.
- **Mobile App Wallets**: Apps on your phone that manage keys and allow you to scan QR codes to connect to dApps. Examples include Trust Wallet, Rainbow, and SafePal.
- **Web Wallets**: Custodial services that manage keys on your behalf, like Coinbase. Convenient but reintroduce centralization.

#### Cold Wallets (Hardware Wallets)

A cold wallet stores your private key on a physical device — a dedicated USB-like hardware wallet such as Ledger or Trezor — that is never directly connected to the internet. When you want to sign a transaction, the device signs it internally and outputs only the signed result, never exposing the private key. This is the gold standard for security of large holdings.

#### Custodial vs Non-Custodial

- **Custodial**: A third party (exchange, platform) holds your private key. You trust them to keep it safe. If they get hacked or go bankrupt, you can lose your funds. Example: keeping funds on Coinbase or Binance.
- **Non-Custodial**: You and only you hold your private key. You are entirely responsible for its security. This is the true Web3 model — "not your keys, not your coins."

### WalletConnect / Reown AppKit

WalletConnect is an open protocol that creates an encrypted connection between a web application (dApp) and a mobile wallet. Instead of building integrations for every possible wallet, a dApp can implement WalletConnect once and connect to hundreds of wallets that support the protocol.

**Reown AppKit** (formerly WalletConnect) is the modern SDK that wraps this protocol into a ready-to-use UI component. The Endless Domains platform uses Reown AppKit to provide a single "Connect Wallet" button that supports all major EVM wallets and Solana wallets simultaneously. When you click "Connect Wallet" on Endless Domains, you are using Reown AppKit.

The flow works like this:
1. The dApp generates a connection URI.
2. The URI is displayed as a QR code or deep link.
3. Your wallet app scans the QR or opens the deep link.
4. An encrypted WebSocket tunnel is established between the dApp and your wallet.
5. All transaction requests go through this tunnel — your private key never leaves your wallet.

### Wallet Addresses — EVM vs Solana

**EVM Addresses**: All EVM-compatible chains (Ethereum, Polygon, Base, Arbitrum, etc.) use the same address format — a 40-character hexadecimal string prefixed with `0x`. Importantly, the same private key produces the same address on every EVM chain. Your MetaMask address on Ethereum is identical to your address on Polygon, Base, and Arbitrum. The funds on each chain are separate, but the address is shared.

**Solana Addresses**: Solana uses a completely different cryptography (Ed25519 curve instead of secp256k1). Solana addresses are 32-byte public keys encoded in Base58, typically 32–44 characters. They look like: `DjVE6JNiYqPL2QXyCUfdT3DpNmkkLNJkM2aTBnkRSaLZ`

---

## 4. Transactions & Gas

### What is a Transaction?

A transaction is any action that changes the state of the blockchain. Every transaction has:

- **From**: The sending wallet address.
- **To**: The receiving address (another wallet or a smart contract).
- **Value**: Amount of native token being sent (can be 0 for contract calls that do not transfer funds).
- **Data**: Optional payload. For simple token transfers, this is empty. For smart contract calls, this field contains the encoded function call and parameters.
- **Nonce**: A sequential counter that prevents replay attacks. Your first-ever transaction from a wallet has nonce 0, the next is 1, and so on. The network will reject a transaction whose nonce does not match the expected next number.
- **Gas Limit**: The maximum amount of computational work the sender is willing to pay for.
- **Gas Price / Max Fee**: How much the sender is willing to pay per unit of gas.
- **Signature**: The cryptographic proof that the sender authorized this transaction.

### Gas

Gas is the unit that measures the computational effort required to execute a specific operation on the EVM (Ethereum Virtual Machine). Every instruction — an addition, reading from storage, writing to storage, calling another contract — costs a specific number of gas units defined in the protocol specification.

Simple ETH transfer = 21,000 gas units.
ERC-20 token transfer ≈ 45,000–65,000 gas units.
Complex DeFi interaction = can be hundreds of thousands of gas units.

**Gas Price** is how much ETH (or the chain's native token) you pay per gas unit. It is measured in Gwei (one billionth of ETH, or 10⁻⁹ ETH).

**Transaction Fee = Gas Used × Gas Price**

For example: 21,000 gas × 20 Gwei = 420,000 Gwei = 0.00042 ETH.

### EIP-1559 — The Fee Market Reform

In 2021, Ethereum upgraded its fee model via EIP-1559. Instead of a pure auction, transactions now include:

- **Base Fee**: A protocol-determined minimum fee that is burned (destroyed) rather than paid to validators. It automatically adjusts up or down based on network congestion.
- **Max Fee**: The absolute maximum you are willing to pay per gas unit.
- **Max Priority Fee (Tip)**: An extra amount paid directly to the validator as an incentive to include your transaction sooner.

The actual fee you pay is: `min(Max Fee, Base Fee + Max Priority Fee) × Gas Used`. If the base fee is lower than expected, you pay less than your maximum and the difference is refunded.

### Gas Estimation

Before broadcasting a transaction, wallets simulate the transaction on their end to estimate how much gas it will use. This estimate is returned as `gasEstimate`. The wallet typically adds a 10–20% buffer on top of the estimate as the gas limit, to account for any state changes that occur between the simulation and the actual execution.

On Endless Domains, when you initiate an on-chain GM check-in, the platform estimates the gas cost in USD terms so you know what the transaction will cost before you confirm it.

### Transaction Lifecycle

1. **Created**: You initiate an action (e.g., click the "Say GM" button). The dApp constructs a transaction object.
2. **Signed**: Your wallet signs the transaction with your private key. The signature is attached to the transaction.
3. **Broadcast**: The signed transaction is sent to one or more nodes in the network, which add it to the **mempool** (memory pool) — a waiting room for unconfirmed transactions.
4. **Pending**: The transaction waits in the mempool. Validators/miners pick transactions from the mempool, typically prioritizing those with higher fees.
5. **Included in Block**: A validator picks your transaction, includes it in a new block, and broadcasts that block.
6. **Confirmed**: Other nodes verify the block and add it to their copy of the chain. After the first confirmation, the transaction has one block on top of it.
7. **Finalized**: After enough confirmations (or a finality checkpoint), the transaction is considered irreversible.

### Transaction Hash (txHash)

When a transaction is included in a block, it is assigned a unique identifier called the transaction hash or `txHash`. It is a 66-character hexadecimal string (0x + 64 hex characters) that uniquely identifies your transaction forever. You can paste any txHash into a block explorer like Etherscan to see every detail of the transaction: who sent it, who received it, what data was in it, which block it ended up in, how much gas was used, and its current status.

In the Endless Domains platform, txHash values are stored as on-chain proof for GM check-ins, creating an immutable record of your activity on the blockchain.

### Block Explorers

A block explorer is a website that indexes blockchain data and provides a human-readable interface for searching transactions, addresses, blocks, and smart contracts. Every chain has at least one:

| Chain | Explorer |
|---|---|
| Ethereum | etherscan.io |
| Polygon | polygonscan.com |
| Arbitrum | arbiscan.io |
| Base | basescan.org |
| BNB Chain | bscscan.com |
| Optimism | optimistic.etherscan.io |
| Avalanche | snowtrace.io |
| Solana | solscan.io or explorer.solana.com |

---

## 5. Tokens, NFTs & Digital Assets

### Native Tokens

Every blockchain has a native token that is built into the protocol itself. It is used to pay for gas fees and to reward validators. Native tokens are not smart contracts — they exist at the protocol level.

| Chain | Native Token | Symbol |
|---|---|---|
| Ethereum | Ether | ETH |
| Polygon | MATIC (now POL) | MATIC |
| BNB Chain | Binance Coin | BNB |
| Avalanche | Avax | AVAX |
| Solana | Sol | SOL |
| Arbitrum | Ether (bridged) | ETH |
| Base | Ether (bridged) | ETH |
| Optimism | Ether (bridged) | ETH |

### Fungible Tokens — ERC-20

A fungible token is one where every unit is identical and interchangeable. One US dollar is worth the same as any other US dollar. The ERC-20 standard defines a common interface for fungible tokens on EVM chains. Any contract that implements the ERC-20 interface (functions like `transfer`, `approve`, `balanceOf`, `totalSupply`) is an ERC-20 token.

When Endless Domains rewards users with USDT (Tether USD), USDT is an ERC-20 token on Ethereum/Polygon/etc. It follows the ERC-20 standard, which is why any wallet and any dApp can handle it without special customization.

### Stablecoins

A stablecoin is a token designed to maintain a stable value, typically pegged 1:1 to the US dollar. There are three main types:

- **Fiat-backed**: Centralized companies hold real US dollars in bank accounts and issue tokens at a 1:1 ratio. Examples: USDT (Tether), USDC (Circle). They are audited and centrally managed.
- **Crypto-backed**: Smart contracts lock up collateral (usually ETH) worth more than the stablecoins issued. The overcollateralization provides a buffer against price swings. Example: DAI.
- **Algorithmic**: Uses programmatic mechanisms to maintain the peg. These have historically been more risky. Example: UST (which collapsed in 2022).

On Endless Domains, **USDT** is used as a perk reward type, meaning users can earn real US dollar-equivalent value through their reputation activity.

### NFTs — Non-Fungible Tokens

An NFT is a token where every unit is unique and not interchangeable. Owning an NFT means owning a specific, one-of-a-kind digital record on the blockchain. The most common standards are:

**ERC-721**: Each token has a unique `tokenId`. You can transfer token #47 to someone and keep token #112. These are true one-of-one tokens.

**ERC-1155**: A more efficient multi-token standard that supports both fungible and non-fungible tokens in a single contract. You can have 1000 copies of token #1 (fungible batch) and only 1 copy of token #2 (NFT). This is used when a project has both unique items and editions.

**What Does NFT "Ownership" Actually Mean?**

The blockchain records that your wallet address is the owner of a specific token ID in a specific contract. The NFT's on-chain data typically stores a URI pointing to a JSON metadata file hosted elsewhere (IPFS, Arweave, or a centralized server). That JSON file describes the token's attributes and links to its image.

Crucially: when you buy an NFT, you own the token record on the blockchain. Whether that ownership grants copyright to the underlying artwork, access to a community, or redeemable value depends entirely on the project's terms — the blockchain itself does not enforce these.

**Domain NFTs on Endless Domains**

In the Endless Domains ecosystem, every domain name you register is an NFT. Owning the NFT of `yourname.og` means you have verifiable, uncensorable ownership of that domain. No company can revoke it. You can sell it, transfer it, or hold it forever without renewal fees. This is the fundamental value proposition: permanent, self-sovereign digital identity.

### Token Standards Beyond Ethereum

Solana uses a different token standard called the **SPL Token Program**. SPL (Solana Program Library) tokens are functionally similar to ERC-20 and ERC-721 but use Solana's account model and are processed by Solana's programs (equivalent to smart contracts) rather than EVM bytecode.

---

## 6. Smart Contracts

### What is a Smart Contract?

A smart contract is a program that lives on a blockchain. Once deployed, it runs exactly as written — no one can stop it, censor it, or modify its behavior (unless the contract itself includes upgrade mechanisms). It automatically executes when specific conditions are met or specific functions are called. Think of it as a vending machine: you put in the right input, and it automatically gives you the predetermined output, without needing a cashier to verify or process anything.

Smart contracts are written in high-level languages like **Solidity** (for EVM chains) or **Rust / Move** (for Solana / Aptos). They are compiled into bytecode that runs on the Ethereum Virtual Machine (EVM) or Solana's runtime.

### Why Smart Contracts Matter

Before smart contracts, if two parties wanted to execute an agreement on the internet, they needed to trust a third party (a bank, a notary, a platform) to enforce it. Smart contracts replace that trusted third party with code. The code is public (anyone can verify it), runs on a decentralized network (no one controls it), and executes automatically (no human discretion). This enables financial agreements, identity systems, voting mechanisms, and marketplaces that are transparent and permissionless by design.

### Contract Addresses

When a smart contract is deployed to a blockchain, it receives a unique address — just like a wallet address. You interact with a contract by sending transactions to its address. Every chain has its own copy of a contract at potentially different addresses. This is why the Endless Domains platform maintains a mapping of `chainId → contractAddress` for every chain where the GM smart contract is deployed.

### ABI — Application Binary Interface

The ABI is a JSON file that describes the interface of a smart contract: what functions it has, what parameters each function takes, and what data types it uses. Without the ABI, your frontend application would not know how to encode a function call or decode the results.

The Endless Domains GM contract ABI defines:

```json
{
  "name": "sayGM",
  "type": "function",
  "inputs": [
    { "name": "domainName", "type": "string" }
  ],
  "outputs": [],
  "stateMutability": "nonpayable"
}
```

This tells the frontend: "To check in, call the function named `sayGM`, pass one string argument (the domain name), expect no return value, and this call changes blockchain state (nonpayable = does not require ETH payment but does require gas)."

### Reading vs Writing to Contracts

**Read (Call)**: Fetches data from the contract's storage without changing anything. Does not require a signature or gas payment. Instant and free. Examples: `balanceOf(address)`, `ownerOf(tokenId)`.

**Write (Transaction)**: Changes the contract's state. Requires a signed transaction and gas payment. Goes through the full transaction lifecycle. Examples: `transfer(to, amount)`, `sayGM(domainName)`.

### Events and Logs

Smart contracts can emit events — log entries stored on-chain that signal that something happened. Events are cheaper to emit than storing data in contract storage, and they are indexed for efficient querying.

The Endless Domains GM contract emits:

```
GM(address indexed wallet, string domain, uint256 timestamp)
```

This means: whenever a wallet successfully calls `sayGM`, the blockchain permanently logs an entry containing the wallet address, the domain name used, and the exact timestamp. This on-chain event log is the irrefutable record of a user's check-in history — it cannot be altered or deleted.

### Libraries for Smart Contract Interaction

**ethers.js**: The most popular JavaScript library for interacting with EVM smart contracts. It abstracts wallet connections, transaction construction, contract calls, and event listening into a clean API.

**viem**: A modern, TypeScript-first alternative to ethers.js used in newer projects. It is lighter, fully typed, and tree-shakeable.

**@solana/web3.js**: The JavaScript SDK for interacting with Solana programs (Solana's equivalent of smart contracts).

**wagmi**: A collection of React hooks built on top of viem/ethers.js that makes EVM wallet connections and contract interactions reactive and easy to use in React applications.

---

## 7. Blockchain Networks & the Multi-Chain World

### Layer 1 vs Layer 2

**Layer 1 (L1)** is the base blockchain itself — the foundational network with its own consensus mechanism, security, and native token. Bitcoin, Ethereum, Solana, and Avalanche are all Layer 1 networks.

**Layer 2 (L2)** is a secondary framework built on top of a Layer 1 to improve scalability. L2s process transactions off the L1 (faster and cheaper) and then batch those transactions back to the L1 for final security. The L1 acts as the ultimate arbiter of truth. 

There are two main types of Ethereum L2s:

- **Optimistic Rollups**: Assume transactions are valid by default and only check them if someone raises a challenge (fraud proof). Arbitrum and Optimism are optimistic rollups. They have a withdrawal delay of ~7 days to allow time for challenges.
- **ZK Rollups**: Use zero-knowledge proofs to mathematically prove that every transaction in a batch is valid before submitting to L1. No challenge period needed. Faster finality but more computationally intensive to generate proofs. Examples: zkSync, Linea, Polygon zkEVM.

### EVM Compatibility

The Ethereum Virtual Machine (EVM) is the runtime environment that executes smart contract bytecode on Ethereum. The EVM has become an industry standard. Dozens of other blockchains have implemented their own EVM-compatible runtimes, meaning that smart contracts written for Ethereum can be deployed on these chains with little to no modification.

This is why one Solidity contract for the GM check-in can be deployed on Ethereum, Polygon, Base, Arbitrum, BNB Chain, Optimism, and more — they all speak the same EVM bytecode language.

### Chain IDs

Every EVM network has a unique **chainId** — a number that distinguishes it from other networks. ChainId is critical because signed transactions include the chainId to prevent **replay attacks** (someone copying a valid signature from one network and replaying it on another).

When you switch networks in MetaMask, you are telling the wallet to use a different chainId. When Endless Domains displays different GM contract addresses per network, it maps them by chainId.

**Supported Networks on Endless Domains:**

| Network | Chain ID | Type | Notes |
|---|---|---|---|
| Ethereum | 1 | L1 | Most secure, highest gas fees |
| BNB Chain | 56 | L1 | Binance ecosystem |
| Polygon | 137 | L1/Sidechain | High throughput, low fees |
| Optimism | 10 | L2 Optimistic | Coinbase-backed chain |
| Arbitrum One | 42161 | L2 Optimistic | Largest L2 by TVL |
| Base | 8453 | L2 Optimistic | Coinbase's official L2 |
| Avalanche C-Chain | 43114 | L1 (EVM subnet) | High speed, Avalanche consensus |
| Celo | 42220 | L1 | Mobile-first, carbon negative |
| Linea | 59144 | L2 ZK | Consensys's ZK rollup |
| Sonic | 146 | L1 | High performance EVM |
| Unichain | 130 | L2 | Uniswap's own chain |
| Monad | 10143 | L1 | Parallel EVM execution |
| MegaETH | 6342 | L2 | Real-time blockchain |
| Hemi | 43111 | L2 | Bitcoin and Ethereum combined |
| Fluent | 20994 | L2 | Wasm + EVM dual-VM |
| Plasma | 9745 | L2 | Plasma-based scaling |
| Robinhood | 46630 | L2 | Robinhood's chain |
| Arc | 5042002 | L2 | Gaming-focused chain |
| Tempo | 4217 | L2 | High-throughput L2 |
| Katana | 747474 | L2 | DeFi-optimized chain |
| Solana | N/A | L1 | Non-EVM, PoH consensus |

### Bridges

A bridge is a protocol that moves assets from one blockchain to another. Since blockchains are isolated systems, tokens on Ethereum cannot natively appear on Polygon. Bridges lock your tokens on the source chain and mint equivalent "wrapped" tokens on the destination chain.

**How a bridge typically works:**
1. You send 1 ETH to the bridge contract on Ethereum.
2. The bridge locks it.
3. On Polygon, the bridge mints 1 WETH (wrapped ETH) and sends it to your address.
4. To reverse it, you burn the WETH on Polygon and the bridge releases your ETH on Ethereum.

Bridges are one of the most targeted attack vectors in Web3 — billions of dollars have been lost to bridge hacks. The security model of a bridge is entirely separate from the security of the chains it connects.

### RPC — Remote Procedure Call

An RPC endpoint is how your frontend application communicates with a blockchain node. Instead of running your own full node (expensive and slow to sync), you connect to an RPC provider who runs nodes for you.

**RPC Providers**: Infura, Alchemy, QuickNode, Ankr, and public endpoints from chains themselves.

**RPC URL format**: `https://mainnet.infura.io/v3/YOUR_API_KEY`

When a wallet or dApp fetches your token balance, checks transaction status, or estimates gas, it is making RPC calls to a node. The Endless Domains frontend uses configured RPC endpoints for all 19+ supported chains to read contract data and broadcast transactions.

---

## 8. Web3 Identity & Domain Names

### The Problem with Traditional Domains

In the traditional internet, domain names (like `endless.com`) are rented, not owned. You pay a registrar annually to hold your name. ICANN (Internet Corporation for Assigned Names and Numbers) is the central authority that ultimately governs all domain names. Your registrar can suspend or revoke your domain. Governments can order domain seizures. If you forget to renew, you lose your identity.

This is fundamentally incompatible with the Web3 principle of sovereignty. You cannot have a truly self-sovereign digital identity if a centralized entity can revoke your name.

### Blockchain Domain Names

Web3 domain names are NFTs stored on a blockchain. Owning the NFT means you own the domain forever, with no recurring fees. No company can take it from you. No government can seize it from a registrar. You are the exclusive, verifiable owner as long as you hold the private key to the wallet that owns the NFT.

Blockchain domains serve several purposes:

1. **Wallet Address Alias**: Instead of giving someone your 42-character wallet address, you give them `yourname.eth` and they can send funds directly to it. The domain resolves to your wallet address.
2. **Decentralized Website**: You can host a censorship-resistant website on IPFS (InterPlanetary File System) and point your blockchain domain at it. No web host can take it down.
3. **Web3 Identity/Username**: Your blockchain domain becomes your persistent, provable identity across all Web3 apps.

### ENS — Ethereum Name Service

ENS is the most established Web3 naming system, deployed on Ethereum and operating since 2017. ENS names end in `.eth`. They are ERC-721 NFTs held in your wallet.

When you register `yourname.eth`:
1. You interact with the ENS smart contracts to claim the name.
2. You set a **resolver** — a contract address that knows how to look up records for your name.
3. You set records: a wallet address for ETH, other coin addresses, an IPFS hash for a website, social profiles, etc.
4. Anyone can query the ENS resolver to get your wallet address from your name: `resolve('yourname.eth') → '0xAbCd...'`

ENS names require annual renewal (unlike Endless Domains which are permanent). The ENS DAO governs the protocol through the ENS token.

### Unstoppable Domains (UD)

Unstoppable Domains is the registry behind many popular Web3 TLDs. They pioneered the "pay once, own forever" model that Endless Domains also uses. UD-registered domains include `.crypto`, `.wallet`, `.nft`, `.dao`, `.blockchain`, `.x`, `.bitcoin`, `.zil`, `.coin`, `.nft`, and many others.

Unstoppable Domains integrates with 900+ apps, wallets, and exchanges. The Endless Domains platform recognizes UD domains as valid identity providers.

### Bonfida / Solana Name Service (SNS)

Bonfida is the primary name service on Solana. Domain names end in `.sol`. They are stored as Solana accounts (not EVM NFTs) and can be used as readable aliases for Solana wallet addresses. Bonfida domains appear in the Endless Domains platform as part of Solana-based identity.

### Freename

Freename is another Web3 domain registrar that allows anyone to create and register their own custom TLDs as well as second-level domains within existing TLDs. They focus on user-owned TLD namespaces where the TLD owner earns royalties on all registrations within that TLD.

### TLDs — Top-Level Domains

A Top-Level Domain (TLD) is the suffix of a domain name — the part after the last dot. In Web2, familiar TLDs are `.com`, `.org`, `.net`. In Web3, TLDs are issued by registries (ENS, Unstoppable Domains, Freename, Endless Domains) and each has its own significance.

**TLDs Supported on Endless Domains:**

The platform supports 50+ TLDs across different categories:

*Identity & Utility TLDs*: `.og`, `.blockchain`, `.crypto`, `.wallet`, `.nft`, `.dao`, `.web3`, `.x`

*Chain-Specific TLDs*: `.eth` (Ethereum), `.sol` (Solana), `.bnb` (BNB Chain), `.arb` (Arbitrum), `.polygon`

*Community & Culture TLDs*: `.pog`, `.doga`, `.gm`, `.bitcoin`, `.coin`, `.zil`

*Brand & Specialized TLDs*: Dozens more registered through Freename and partner registries.

### Primary Domain — Your Web3 Identity

On Endless Domains, you can own multiple domain NFTs in your wallet. The **primary domain** is the one you designate as your main identity for the reputation system. It is the domain that:

- Represents you in the leaderboard
- Is submitted when you do a GM check-in on-chain
- Appears as your public profile name across the platform
- Accrues your domain tenure score
- Receives credit for your domain count score

Setting a primary domain is a choice, not automatic. If your primary domain NFT is transferred or sold to another wallet, it is marked as **stale** and you will need to set a new primary domain to maintain your reputation tracking.

### Domain Tenure

Domain tenure refers to how long you have held a specific domain. In the Endless Domains reputation system, longer tenure translates to a higher domain tenure score (up to 150 points). This rewards long-term commitment and discourages people from gaming the system by registering many domains right before a snapshot. Tenure is calculated from the blockchain timestamp of when the domain NFT was first minted to your address.

### Domain Count Score

Owning more domains signals deeper commitment to the Web3 identity ecosystem. The reputation system awards up to 150 points based on the number of domains you hold. This incentivizes building a portfolio of meaningful domain names rather than relying on a single registration.

---

## 9. Reputation Systems in Web3

### Why Reputation Matters in Web3

One of the most powerful things about Web3 is pseudonymity: you can interact with any protocol using just a wallet address. But pseudonymity is a double-edged sword. It is great for privacy and accessibility, but it makes it hard to establish trust. How do you know if a wallet address belongs to a genuine long-term participant or a bot created yesterday?

Reputation systems solve this by looking at on-chain activity history to build a trust score. Instead of trusting a username on a centralized platform (which can be faked), you look at what a wallet has actually done on-chain — transactions, holdings, interactions, history — and derive a score from that verifiable data.

### On-Chain vs Off-Chain Reputation

**On-Chain Reputation**: Directly derived from data recorded on blockchains. Every transaction, every contract interaction, every token holding is public and verifiable. Cannot be fabricated. Examples: number of transactions, protocols used, tokens held, NFTs owned, governance participation.

**Off-Chain Reputation**: Derived from activity on centralized platforms — Twitter followers, Discord activity, forum posts. This data is controlled by private companies, can be deleted, and is easy to fake. Less reliable for trustless systems.

Endless Domains prioritizes **on-chain reputation signals** because they are the only signals that are truly verifiable and tamper-proof.

### Sybil Attacks

A Sybil attack is when one person creates many fake identities (wallets) to game a system. If a platform gives rewards based on "number of wallets," a bad actor can create 1000 wallets and claim 1000 times the rewards.

Reputation systems mitigate Sybil attacks by weighting signals that are hard or expensive to fake at scale:

- **EVM transaction history**: Requires real activity over time. Hard to fake for thousands of addresses.
- **Domain tenure**: Requires holding a domain for a long time. Cannot be manufactured retroactively.
- **GM streaks**: Requires daily on-chain transactions. Costs real gas money to maintain across many addresses.

By combining these signals with diminishing returns for each additional point of score, the system makes Sybil attacks economically unattractive.

### Score-Based vs Binary Reputation

**Binary reputation** is simple: you either have access or you do not (e.g., NFT gating: hold this NFT = access). It is easy to implement but coarse — it treats a whale who has been in the ecosystem for five years the same as someone who bought an NFT yesterday.

**Score-based reputation** is graduated: your score reflects the depth and breadth of your engagement. The Endless Domains system uses a 0–1000 score, allowing for nuanced tiering and rewards that scale with genuine participation.

### Decay and Freshness

Some reputation systems apply decay — older activity contributes less to your current score than recent activity. This ensures that people who were active in 2020 but have been inactive since do not perpetually outrank people who are actively participating today. The Endless Domains system incorporates freshness through the GM streak component: your streak only stays alive through daily activity, giving active participants a continuous edge.

---

## 10. Endless Domains Reputation System — Deep Dive

### Overview

The Endless Domains reputation system is an on-chain scoring framework that measures genuine ecosystem participation and rewards it with exclusive perks and recognition. The system is entirely opt-in, non-custodial, and transparent.

**Total Score Range**: 0 to 1000 points

**Score Components:**

| Component | Max Points | What it Measures |
|---|---|---|
| EVM Activity Score | 250 | Transaction history and protocol usage across EVM chains |
| GM Streak Score | 200 | Daily on-chain check-in consistency |
| Domain Count Score | 150 | Number of Web3 domains owned |
| Domain Tenure Score | 150 | How long you have held your domains |
| Solana Activity Score | 250 | Transaction history on Solana (future expansion) |

### Opt-In System

The reputation system is **opt-in by design**. This respects privacy: your on-chain activity is public on the blockchain, but aggregating and displaying it on a platform is a choice you make consciously.

**Opting In (`isReputationOptedIn = true`):**
- Your wallet's on-chain data is analyzed to compute your reputation score.
- Your score and tier appear on your public profile.
- You become eligible for perks and leaderboard ranking.
- You must set a primary domain at the time of opting in.

**Opting Out (`isReputationOptedIn = false`):**
- Your score is no longer computed or updated.
- Your profile is removed from public leaderboards.
- You lose access to tier-gated perks.
- Your historical data is retained but not displayed.

### Score Components in Detail

#### EVM Activity Score (0–250 points)

This component analyzes your EVM wallet's on-chain history. The analysis considers:

- **Total transaction count**: How many transactions have you sent across all supported EVM chains?
- **Transaction recency and spread**: Are you currently active, or was all your activity years ago?
- **Protocol diversity**: Have you interacted with DeFi protocols, NFT marketplaces, DAOs, lending platforms? Broad participation indicates genuine ecosystem membership rather than a single narrow use case.
- **Token holdings**: Do you hold meaningful assets that indicate you are an active participant?
- **Contract interactions**: On-chain interactions with smart contracts (not just ETH transfers) demonstrate technical sophistication and real engagement.

This score is the hardest to game at scale because it requires real, gas-costing transactions across years of activity. A wallet created today cannot fake a deep transaction history.

#### GM Streak Score (0–200 points)

The GM score rewards **daily consistency**. Every day that you perform an on-chain GM check-in, your streak grows. Missing a day resets your current streak to zero (though your longest-ever streak is preserved).

**Why this works**: A bot farm maintaining daily streaks across 1000 wallets must pay gas fees every day. At scale, this becomes expensive, making Sybil attacks economically irrational for the streak component. Meanwhile, genuine community members naturally perform this small daily ritual.

The score calculation considers both your current active streak and your longest historical streak, so you are not fully penalized for a brief gap after a long run.

#### Domain Count Score (0–150 points)

A higher number of owned domain NFTs signals a stronger investment in Web3 identity. The scoring uses a diminishing-returns curve: the jump from 0 to 3 domains gives you more points per domain than the jump from 20 to 23. This prevents gaming by buying 100 cheap domains purely for score, since the marginal point gain eventually approaches zero.

#### Domain Tenure Score (0–150 points)

This rewards the oldest domains in your portfolio — or specifically, your primary domain's age. The longer you have held your primary domain, the higher your tenure score. This creates a strong incentive to register early and hold long-term, rewarding the community's most committed members.

**Stale Domain**: If you transfer your primary domain to another wallet, the domain becomes stale for your account. Your tenure score resets, and you need to designate a new primary domain. This prevents gaming by quickly transferring a long-tenured domain from a "veteran" wallet to a fresh one.

#### Solana Activity Score (0–250 points)

A mirror of the EVM Activity Score but for Solana. This is noted as a future expansion in the platform, acknowledging that a significant portion of the Web3 community operates primarily in the Solana ecosystem. The scoring methodology will follow similar principles: transaction count, recency, protocol diversity, and asset holdings on Solana.

### Tier System

Your total score maps to one of four tiers. Tiers are the primary gates for perk access and social recognition.

| Tier | Score Range | Character |
|---|---|---|
| BRONZE | 0 – 249 | Just getting started in the ecosystem |
| SILVER | 250 – 499 | Established community member with real activity |
| GOLD | 500 – 749 | Power user with significant on-chain history |
| PLATINUM | 750 – 1000 | Top-tier Web3 native with deep engagement |

**Points Needed**: This field (`pointsNeeded`) is dynamically calculated per user, showing exactly how many more points are required to reach the next tier. It helps users understand what activities to focus on to level up.

**isTop_500**: A special boolean flag awarded to the first 500 users to opt into the reputation system. These founding participants receive special recognition and early access to exclusive perks, acknowledging their role in bootstrapping the reputation ecosystem.

### Score Breakdown

The score breakdown is a detailed view of how your total score is composed. It shows:

- How many points each component contributes to your total.
- The maximum possible points per component (allowing you to see your "efficiency" per category).
- Which areas have room for improvement (e.g., your EVM activity score is high but your GM streak score is zero because you have not started checking in).

The `scoreHistory` tracks how your score has changed over time on a daily basis. This gives users insight into the impact of their actions — for example, seeing the point jump after establishing a 30-day GM streak.

---

## 11. The GM Check-In System

### What is GM?

"GM" stands for "Good Morning" — a cultural greeting that originated in crypto Twitter circles around 2020–2021. It became a daily ritual in Web3 communities: posting "GM" every morning to signal that you are awake, active, and engaged. It evolved from a simple social gesture into a symbol of community participation and consistency.

The Endless Domains platform elevated this cultural practice to an **on-chain action**: instead of just tweeting "GM," you call a smart contract. This turns the greeting into a verifiable, permanent, cryptographically signed on-chain record of your daily participation.

### The GM Smart Contract

The core of the GM system is a smart contract deployed on every supported chain. Its primary function is:

```solidity
function sayGM(string memory domainName) external {
    // Records that msg.sender said GM with their domain on this date
    emit GM(msg.sender, domainName, block.timestamp);
}
```

When you click "Say GM" on Endless Domains:
1. Your wallet is prompted to sign a transaction calling `sayGM(yourDomain.og)`.
2. The transaction is broadcast to the network.
3. When mined, an on-chain `GM` event is permanently emitted with your address, domain, and timestamp.
4. The Endless Domains backend listens for these events and updates your streak counter.

### Contract Addresses by Chain

The GM contract is deployed at different addresses on each supported chain. The frontend maintains a mapping of chain ID → contract address. When you choose to GM on Base vs. Arbitrum, the platform automatically uses the correct contract address for that chain.

### Streak Mechanics

**Current Streak (`currentStreak`)**: The number of consecutive days you have checked in. If you say GM on Monday, Tuesday, and Wednesday, your current streak is 3. If you miss Thursday and check in on Friday, your current streak resets to 1.

**Longest Streak (`longestStreak`)**: The highest current streak you have ever achieved. Never decreases. This is your personal record and a testament to your consistency over the platform's history.

**Total Check-Ins (`totalCheckins`)**: The cumulative count of every GM you have ever performed on-chain, regardless of streaks. This counts every transaction that successfully called `sayGM` with your address.

**Checked In Today (`checkedInToday` / `hasCheckedInToday`)**: A boolean that indicates whether you have already checked in for the current calendar day (UTC). Once true, you cannot earn streak credit for checking in again today — one check-in per calendar day maintains the streak, additional check-ins have no effect on the streak counter.

**Check-In Date (`checkinDate`)**: The specific date of an individual check-in, stored in `YYYY-MM-DD` format. This allows the backend to determine with certainty which days you checked in and detect gaps.

**Favorite GM Chain (`favoriteGmChain`)**: The chain you most frequently choose for your GM check-ins. Users often pick the chain with the lowest gas fees or the one they are most active on.

### Founding Member Status

**Founding Member (`foundingMember`)**: A permanent badge awarded to users who participated in the GM system in its earliest phase. This is a non-revocable status — once earned, it stays on your profile forever. It signals that you were part of the community before it became mainstream, a high-value social signal in Web3 culture where being early is celebrated.

Founding members receive:
- A special badge on their profile.
- Priority access to certain perk drops.
- Historical recognition in the leaderboard.

### Gas Costs for GM

Every GM check-in is an on-chain transaction and requires gas. The Endless Domains platform shows you an estimated gas cost in USD before you confirm. This is why many users choose to GM on lower-fee chains like Polygon, Base, or Arbitrum rather than Ethereum mainnet — the same contract interaction might cost $0.01 on Base but $3–5 on Ethereum mainnet during periods of high congestion.

**Tip for beginners**: If you want to maintain a GM streak with minimal cost, choose a chain where your gas fees will be under $0.05 per transaction. Base, Polygon, and Arbitrum are excellent choices for this.

### Why On-Chain GM Matters

The on-chain nature of GM check-ins creates several important properties:

1. **Verifiability**: Anyone can independently verify your streak by reading the blockchain. Your streak count is not a number the Endless Domains platform can manipulate — it is derived from public blockchain events.
2. **Portability**: Your history exists on the blockchain, not in a private database. Even if Endless Domains ceased to exist, your GM record would remain on-chain.
3. **Sybil cost**: Maintaining 1000 fake streaks costs 1000× the gas. This makes automated farming of GM rewards expensive enough to be unprofitable.
4. **Cultural participation**: Signing a transaction requires active attention. Unlike passively holding a token, GM check-ins require daily intentional engagement.

---

## 12. Perks & Rewards

### What are Perks?

Perks are exclusive benefits unlocked by your reputation tier. They are the direct value output of the reputation system: the higher your score, the more valuable the perks you can access. Perks are provided by Endless Domains partners as well as by the platform itself.

Think of perks as the practical answer to the question: "Why should I care about my reputation score?" The answer is that higher scores unlock real, tangible value — discounts, tokens, exclusive access, and partner benefits.

### Perk Types

The platform supports multiple categories of perks:

**COUPON**: A discount code redeemable on a partner's platform or store. The coupon code value (`couponCode`) is hidden until you claim the perk — this prevents people from free-riding on others' claims.

**PROMO_CODE**: Similar to a coupon but typically for digital services — free subscriptions, free credits, or trial activations on partner platforms.

**USDT**: Direct stablecoin rewards. Real money equivalent sent to your wallet. This is the highest-value perk type for most users. The `perkValue` field shows the USDT amount.

**NFT_TOKEN**: An NFT airdropped to your wallet. Could be a collectible, a membership token, a piece of digital art, or an access pass to another platform.

**WHITELIST**: Access to a whitelist for an upcoming NFT mint, token sale, or product launch. Whitelists are often worth significant money if the project becomes popular, since they give you early access at a lower price.

**EARLY_ACCESS**: Beta access or advance entry to a product, feature, or event before it is publicly available. Common in the Web3 space where early community members are rewarded for their support.

**EXCLUSIVE_CONTENT**: Access to gated content — educational material, research reports, private community channels, or exclusive media.

### Tier-Gated Access

Every perk has a minimum tier requirement (`tierRequired`) and optionally a minimum reputation score (`minReputationScore`). The tier system ensures that the most valuable perks are reserved for the most engaged users.

Example perk configuration:
```
Perk: "50 USDT Reward"
Tier Required: GOLD
Min Reputation Score: 500
Total Supply: 200
```

A user with a SILVER tier (450 points) cannot claim this perk. A user with a GOLD tier (530 points) can claim it — but only while supplies last.

### Supply Management

Each perk has a finite supply (`totalSupply`). Once all copies are claimed, the perk is exhausted. This creates real scarcity and urgency:

- **totalSupply**: The total number of times this perk can be claimed across all eligible users.
- **claimedCount**: How many have already been claimed. Displayed to users so they can see remaining availability.
- **isUnlocked**: Whether your current tier meets the requirements to access this perk.
- **isClaimed**: Whether you specifically have already claimed this perk.

### The Claiming Process

When you claim a perk:
1. The platform verifies your current tier meets `tierRequired`.
2. It verifies the perk still has unclaimed supply (`claimedCount < totalSupply`).
3. It records your claim in the database.
4. It reveals the `perkValue` — the actual coupon code, USDT amount, NFT metadata, etc.
5. For USDT perks, the reward is queued for distribution to your wallet.
6. The `isClaimed` flag becomes true for your account, preventing double-claiming.

The two-step design (claim first, then reveal value) is intentional: it prevents users from looking up the perk value without committing to a claim, which would allow free-riding.

### My Perks — Claimed Rewards Dashboard

The "My Perks" section shows all perks you have claimed, including their revealed values. This is your rewards portfolio — a record of the tangible value you have extracted from your reputation.

---

## 13. Leaderboards & Analytics

### The Leaderboard

The leaderboard ranks all opted-in users by their total reputation score. It serves both social and competitive functions: recognition for top performers and motivation for others to increase their engagement.

**Rank (`rank`)**: Your position in the global leaderboard, where rank 1 is the highest score. Your rank is dynamic — it changes as others increase their scores.

**Period**: Leaderboards can be filtered by time period:
- **All-Time**: Cumulative reputation since you joined. The most comprehensive ranking.
- **Weekly**: Score gained in the past 7 days. Rewards recent activity over historical accumulation.
- **Daily**: Score gained today. Highlights the most active users on any given day.

Period-based leaderboards create recurring competition: even if you cannot catch up to someone on the all-time board, you can win the weekly board through consistent recent activity.

### Pagination

The leaderboard uses server-side pagination to handle potentially thousands of users efficiently:

- **page**: Current page number (starting at 1).
- **limit**: Number of results per page.
- **nextPage**: The next page number if more results exist.
- **lastPage**: The final page number, indicating total result size.

### Analytics and Score History

`scoreHistory` tracks your score over time in daily granularity. This time-series data enables:
- Visualizing your growth trajectory.
- Identifying the impact of specific activities (e.g., a spike after establishing a long GM streak).
- Comparing your current engagement rate to historical periods.

---

## 14. Advanced Web3 Concepts

### DeFi — Decentralized Finance

DeFi refers to financial applications built on blockchains that replicate and expand on traditional financial services — lending, borrowing, trading, earning interest — without banks or intermediaries.

**Key DeFi Primitives:**

**DEX (Decentralized Exchange)**: A protocol for trading tokens directly between users via smart contracts, without a central order book or custodian. The most famous is Uniswap, which uses Automated Market Makers (AMMs). Instead of matching buyers and sellers, AMMs use liquidity pools — reserves of token pairs. The price is determined algorithmically based on the ratio of tokens in the pool.

**Liquidity Pools**: Smart contracts holding reserves of two tokens. Liquidity providers (LPs) deposit equal values of both tokens and earn a percentage of every trade that happens in the pool as a fee.

**Lending/Borrowing (Aave, Compound)**: Deposit tokens to earn interest. Borrow tokens by providing collateral worth more than what you borrow. If your collateral value drops below a threshold, it is liquidated automatically by the smart contract.

**Yield Farming**: Providing liquidity or staking tokens in DeFi protocols to earn rewards (usually in the protocol's governance token). The returns can be very high but also involve significant risk (impermanent loss, smart contract risk, token price risk).

**TVL — Total Value Locked**: The total value of assets deposited in a DeFi protocol. Used as a proxy for the protocol's size and trust level. A protocol with $5B TVL is trusted by more users than one with $50M TVL.

### DAOs — Decentralized Autonomous Organizations

A DAO is an organization governed by smart contracts and token-based voting rather than traditional management structures. Token holders propose and vote on changes to the protocol, treasury spending, and governance rules. The votes are executed by smart contracts automatically.

Web3 domain registries like ENS are governed by DAOs. ENS token holders vote on fee structures, integration policies, and protocol upgrades. This is a radical experiment in internet governance: the infrastructure for millions of digital identities is collectively owned and managed by its users.

### IPFS — InterPlanetary File System

IPFS is a peer-to-peer, content-addressed file system. Unlike HTTP, where files are retrieved from a specific server at a specific address, IPFS addresses files by their content (a hash of the file's data). If multiple nodes host the same file, requesting that file returns it from the closest/fastest available node.

This is critical for NFT metadata: if an NFT's image is stored on a centralized server, the server can go offline and your NFT becomes a broken link. If the image is stored on IPFS and pinned by multiple nodes, it is much more resilient. The gold standard is Arweave, which offers permanent, blockchain-based file storage for a one-time fee.

### Account Abstraction (ERC-4337)

Traditional Ethereum wallets are EOAs (Externally Owned Accounts) — accounts controlled by a private key. ERC-4337 introduces "smart accounts" — wallets that are themselves smart contracts. This enables:

- **Social recovery**: Designate trusted "guardians" who can help recover your account if you lose your key.
- **Gas sponsorship**: A third party (like Endless Domains) can pay the gas for your transactions so you do not need native tokens to interact.
- **Batch transactions**: Multiple operations in a single atomic transaction.
- **Passkey signing**: Use your phone's biometric authentication (Face ID, fingerprint) instead of a seed phrase.

Account abstraction is considered the key to Web3 mass adoption because it removes the biggest UX barrier: the complexity of managing private keys and gas.

### Zero-Knowledge Proofs (ZK Proofs)

A zero-knowledge proof is a cryptographic method by which one party (the prover) can prove to another (the verifier) that they know a value, or that a statement is true, without revealing any information beyond the validity of the statement itself.

**Real-world analogy**: Imagine proving to a bouncer that you are over 21 without showing your birthdate, name, address, or any other information on your ID. A ZK proof would let you prove only "I am old enough" without revealing anything else.

In Web3, ZK proofs are used for:

- **ZK Rollups (L2 scaling)**: Proving that a batch of thousands of transactions is all valid without the L1 needing to re-execute each one.
- **Private transactions**: Proving you have enough balance to make a payment without revealing your full balance (Tornado Cash, Zcash).
- **Identity verification**: Proving you are a unique human or that you hold a certain credential without revealing your full identity (Sismo, Worldcoin).

### MEV — Maximal Extractable Value

MEV (formerly Miner Extractable Value) refers to the profit that block producers (miners/validators) can extract by reordering, including, or excluding transactions within the blocks they produce. Since validators can see all pending transactions in the mempool before deciding which to include, they can:

- **Front-run**: See a large pending buy order for a token, insert their own buy order just before it, and then let the original order push the price up, then sell at a profit.
- **Sandwich attack**: Front-run a swap AND back-run it to extract the maximum slippage from the victim.
- **Liquidation sniping**: Race to be the first to liquidate an undercollateralized loan and claim the liquidation bonus.

MEV is a multi-hundred-million-dollar-per-year ecosystem that operates in the background of every EVM blockchain. MEV-aware users use tools like Flashbots to protect themselves.

### Cross-Chain Messaging

As the multi-chain ecosystem grows, the need to pass messages and value between chains becomes critical. Cross-chain messaging protocols allow a smart contract on Chain A to trigger an action on Chain B.

**Examples:**
- Chainlink CCIP (Cross-Chain Interoperability Protocol)
- LayerZero
- Wormhole (used heavily in the Solana ecosystem)
- Axelar

These protocols are the infrastructure for a truly multi-chain future where your identity, assets, and reputation on Endless Domains could be recognized and used across dozens of different blockchain ecosystems simultaneously.

### The Solana Architecture Difference

Solana is fundamentally different from EVM chains in architecture:

- **Programs vs Contracts**: Solana calls smart contracts "programs." Programs are stateless — they contain only logic, no storage.
- **Accounts**: All state (data storage) lives in "accounts" separate from programs. A program reads and writes to accounts passed to it as parameters.
- **Transaction Model**: Solana transactions declare all accounts they will read and write upfront. This allows the runtime to process non-conflicting transactions in parallel, which is why Solana achieves 65,000+ transactions per second.
- **Rent**: Accounts on Solana must maintain a minimum SOL balance ("rent-exempt reserve") to stay alive. Below this threshold, the account can be garbage-collected by the runtime.
- **PDAs (Program Derived Addresses)**: Special accounts whose address is derived deterministically from a program's ID and some seeds. They are controlled by programs, not wallets, and are used to hold program state.

Understanding this helps explain why Solana activity scoring requires separate analysis from EVM activity scoring — the data structures, account models, and interaction patterns are meaningfully different.

### NFT Metadata Standards

NFT metadata follows a JSON standard that defines what attributes an NFT has. A typical metadata JSON:

```json
{
  "name": "yourname.og",
  "description": "Endless Domains Web3 identity for yourname.og",
  "image": "ipfs://QmXyz.../yourname.og.png",
  "attributes": [
    { "trait_type": "TLD", "value": ".og" },
    { "trait_type": "Length", "value": "8" },
    { "trait_type": "Registered", "value": "2024-01-15" }
  ]
}
```

The `attributes` array is how rarity and traits are defined for NFT collections. Marketplaces like OpenSea and Blur read this JSON to display your NFT's properties and calculate its rarity within a collection.

### Signatures vs Transactions

There are two common ways a wallet interacts with a dApp:

**Transaction**: Changes blockchain state. Costs gas. Broadcasts to the network. Is permanently recorded on-chain. Used for token transfers, contract calls like GM check-ins.

**Signature (Sign Message / Sign Typed Data)**: Does not change blockchain state. Costs no gas. Not broadcast to the network. Used for authentication (proving wallet ownership), off-chain agreements, or generating permits. When you "sign in with Ethereum" (EIP-4361), you sign a message — not a transaction — to prove you control the wallet without paying gas.

Endless Domains uses signatures for authentication (logging in) and transactions for on-chain GM check-ins.

### EIP Standards — Ethereum Improvement Proposals

EIPs are formal documents proposing changes to the Ethereum protocol or its ecosystem standards. Once accepted, they become the standards that wallets, dApps, and smart contracts follow.

Key EIPs relevant to Endless Domains:

- **EIP-20 (ERC-20)**: Fungible token standard.
- **EIP-721 (ERC-721)**: Non-fungible token standard. Domain NFTs use this.
- **EIP-1155 (ERC-1155)**: Multi-token standard.
- **EIP-1559**: Fee market reform (base fee + tip).
- **EIP-4361 (SIWE — Sign In With Ethereum)**: Standard for wallet-based authentication.
- **EIP-4337**: Account abstraction.
- **EIP-712**: Typed structured data hashing for signatures. Enables human-readable signature requests in wallets.

---

## 15. Developer Reference — APIs, ABIs & Integrations

### API Architecture

The Endless Domains backend exposes a REST API consumed by the frontend. Key endpoint categories:

**Reputation Endpoints:**
- `GET /reputation/score/:walletAddress` — Fetch current score and breakdown for a wallet.
- `POST /reputation/opt-in` — Opt a wallet into the reputation system.
- `POST /reputation/opt-out` — Opt a wallet out.
- `GET /reputation/leaderboard` — Fetch paginated leaderboard.
- `GET /reputation/score-history/:walletAddress` — Historical score data.

**GM Endpoints:**
- `POST /gm/checkin` — Record an on-chain GM (after the transaction is confirmed).
- `GET /gm/streak/:walletAddress` — Get current streak, longest streak, and total check-ins.
- `GET /gm/status/:walletAddress` — Check if the wallet has checked in today.

**Perks Endpoints:**
- `GET /perks/catalog` — All available perks with tier requirements and supply info.
- `POST /perks/claim/:perkId` — Claim a specific perk.
- `GET /perks/my-perks/:walletAddress` — All perks claimed by a wallet.

**Domain Endpoints:**
- `GET /domains/:walletAddress` — All domains owned by a wallet.
- `POST /domains/set-primary` — Set a domain as the primary identity.

### API Response Shape

Standard API responses follow:

```json
{
  "isSuccess": true,
  "message": "Score fetched successfully",
  "result": {
    "totalScore": 620,
    "tier": "GOLD",
    "breakdown": {
      "evmActivityScore": 210,
      "gmStreakScore": 140,
      "domainCountScore": 120,
      "domainTenureScore": 150,
      "solanaActivityScore": 0
    },
    "pointsNeeded": 130
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "nextPage": 2,
    "lastPage": 45
  }
}
```

- `isSuccess`: Boolean indicating operation success.
- `message`: Human-readable status message.
- `result` / `resultData`: The payload data.
- `pagination`: Present on list endpoints; contains navigation info.

### GM Contract ABI (Simplified)

```json
[
  {
    "name": "sayGM",
    "type": "function",
    "inputs": [
      { "name": "domainName", "type": "string" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "name": "GM",
    "type": "event",
    "inputs": [
      { "name": "wallet", "type": "address", "indexed": true },
      { "name": "domain", "type": "string", "indexed": false },
      { "name": "timestamp", "type": "uint256", "indexed": false }
    ],
    "anonymous": false
  }
]
```

### Wagmi & Reown AppKit Configuration

The frontend configures 19+ EVM chains and Solana in a single `wagmi.ts` config, passing it to Reown AppKit. This config object defines:

- Each chain's RPC endpoint (how to talk to the network).
- Each chain's native currency (for gas display).
- Block explorer URLs (for linking to transactions).
- Chain metadata (name, icon, etc.).

When a user connects their wallet, AppKit uses this config to show available networks and handle chain-switching prompts.

### Domain Resolution Flow

When a user enters a domain name on the platform:

1. The frontend determines the TLD (`.eth` → ENS, `.sol` → SNS/Bonfida, `.crypto` → Unstoppable Domains, etc.).
2. It calls the appropriate resolver contract (or UD/ENS API) for that TLD.
3. The resolver returns the wallet address mapped to that domain.
4. The frontend can now display profile information for that wallet.

### Multi-Chain Transaction Signing with ethers.js/viem

```typescript
// Using viem to call sayGM on the connected chain
const { writeContract } = useWriteContract();

const handleGM = async () => {
  const txHash = await writeContract({
    address: GM_CONTRACT_ADDRESSES[chainId],
    abi: GM_ABI,
    functionName: 'sayGM',
    args: [primaryDomain],
  });
  // txHash is the on-chain proof of the check-in
};
```

---

## 16. Complete Glossary A–Z

**Account Abstraction (ERC-4337)**: A standard enabling smart contract wallets that support features like social recovery, gas sponsorship, and batch transactions.

**Address**: A unique identifier on a blockchain representing a wallet or smart contract. EVM addresses are 42-character hex strings starting with `0x`.

**ABI (Application Binary Interface)**: A JSON specification defining a smart contract's functions, events, and data types — the interface between your frontend and the contract.

**Airdrop**: Free distribution of tokens or NFTs to wallet addresses, typically as a reward for past activity or as a marketing mechanism.

**AMM (Automated Market Maker)**: A DEX protocol that uses mathematical formulas and liquidity pools to price and execute token swaps, without a traditional order book.

**Arbitrum**: An Ethereum Layer 2 scaling solution using optimistic rollups, offering lower gas fees and faster transactions while inheriting Ethereum's security.

**Archive Node**: A blockchain node that stores not just the current state but the complete state history at every past block. Required for historical queries.

**Base**: An Ethereum Layer 2 built by Coinbase using the Optimism tech stack, focused on accessibility and low fees.

**Base Fee**: In EIP-1559, the minimum gas price per unit set by the protocol based on network congestion. It is burned rather than paid to validators.

**BIP-39**: Bitcoin Improvement Proposal 39. The standard that defines how seed phrases (mnemonics) are generated and used to derive wallet keys.

**Block**: A container of validated transactions linked to the previous block via its hash, forming the blockchain.

**Block Explorer**: A web interface for browsing blockchain data. Etherscan, Polygonscan, Solscan are examples.

**Block Height**: The sequential number of a block in the chain, starting from 0 (the genesis block).

**Blockchain**: A distributed, cryptographically linked ledger replicated across a peer-to-peer network of nodes, where data is immutable once recorded.

**BNB Chain**: Binance's EVM-compatible blockchain with high throughput and low fees.

**Bonfida**: The primary Solana name service provider, issuing `.sol` domain names as Solana NFTs.

**Bridge**: A protocol for transferring assets between two different blockchains by locking them on one chain and minting equivalent tokens on another.

**Bronze**: The first tier in the Endless Domains reputation system, representing scores from 0 to 249.

**Burn**: Permanently destroying tokens by sending them to an unspendable address (often address `0x000...dead`). ETH base fees are burned.

**Celo**: An EVM-compatible Layer 1 blockchain designed for mobile-first DeFi with a focus on emerging markets.

**Chain ID**: A unique numeric identifier for an EVM network, included in signed transactions to prevent replay attacks across networks.

**Check-In Date**: The specific calendar date (YYYY-MM-DD) of an individual GM check-in, used to calculate streaks.

**Checked In Today**: A boolean flag indicating whether a wallet has already performed its GM check-in for the current UTC calendar day.

**claimedCount**: The number of times a specific perk has been claimed across all users.

**Cold Wallet**: A wallet whose private key is stored offline (hardware wallet), providing maximum security for large holdings.

**Consensus Mechanism**: The protocol by which all nodes in a blockchain network agree on the valid state of the ledger. Examples: Proof of Work, Proof of Stake, Proof of History.

**Contract Address**: The address of a deployed smart contract on a specific blockchain. Different from a wallet address — contract addresses hold code, not just balance.

**couponCode**: The specific string value of a coupon perk, revealed only after the user claims it.

**currentStreak**: The number of consecutive days a user has performed on-chain GM check-ins without missing a day.

**Custodial**: A service where a third party holds your private keys on your behalf. The opposite of self-custody.

**DAO (Decentralized Autonomous Organization)**: An organization governed by token-based voting and smart contracts rather than traditional management hierarchies.

**dApp (Decentralized Application)**: A web application that interacts with smart contracts on a blockchain for its core functionality, rather than relying solely on centralized servers.

**Decentralization**: The distribution of control and data across many independent parties rather than a single central authority.

**DeFi (Decentralized Finance)**: Financial services (trading, lending, borrowing, earning yield) implemented as permissionless smart contracts on blockchains.

**DEX (Decentralized Exchange)**: A smart contract-based exchange where users trade tokens directly without a centralized custodian. Uniswap, Curve, and Orca are examples.

**Domain Count Score**: The component of the Endless Domains reputation score (max 150 points) based on the number of Web3 domain NFTs in your wallet.

**Domain Tenure**: How long you have held your primary domain NFT, measured from the original mint timestamp to today.

**Domain Tenure Score**: The reputation score component (max 150 points) based on how long you have held your primary domain.

**Ed25519**: The elliptic curve signature algorithm used by Solana, different from the secp256k1 curve used by EVM chains.

**EIP (Ethereum Improvement Proposal)**: A formal document proposing changes to the Ethereum protocol or ecosystem standards.

**ENS (Ethereum Name Service)**: The primary domain naming system on Ethereum, issuing `.eth` NFT domains that serve as wallet address aliases and Web3 identities.

**ERC-20**: The standard interface for fungible tokens on EVM blockchains (transfer, approve, balanceOf functions).

**ERC-721**: The standard for non-fungible tokens (NFTs) on EVM blockchains, where each tokenId is unique.

**ERC-1155**: A multi-token standard supporting both fungible and non-fungible tokens within a single contract.

**ETH (Ether)**: The native token of the Ethereum blockchain, used for gas fees and as a store of value.

**EVM (Ethereum Virtual Machine)**: The runtime environment that executes smart contract bytecode on Ethereum and all EVM-compatible chains.

**EVM Activity Score**: The reputation score component (max 250 points) derived from your transaction history, protocol usage, and asset holdings across EVM chains.

**EVM-Compatible**: A blockchain that implements the EVM standard, allowing Ethereum smart contracts to run on it with minimal or no modification.

**Fiat-Backed Stablecoin**: A stablecoin backed by real fiat currency held in reserve. Examples: USDT, USDC.

**Finality**: The point at which a transaction is irreversible and permanently recorded on the blockchain.

**Founding Member**: A special status on Endless Domains awarded to early participants in the GM check-in system, granting them permanent recognition and special perk access.

**Freename**: A Web3 domain registrar allowing users to register custom TLDs and second-level domains with decentralized ownership.

**Full Node**: A blockchain node that downloads and validates every block and transaction since genesis, maintaining a complete copy of the chain.

**Fungible**: Interchangeable. Every unit of a fungible asset is identical and of equal value (like US dollars or ERC-20 tokens).

**Gas**: The unit measuring computational work required to execute operations on the EVM. Every transaction consumes gas, which must be paid in the chain's native token.

**Gas Estimate (`gasEstimate`)**: A pre-transaction simulation of how much gas a transaction will use, shown to users before they confirm. Endless Domains shows this in USD.

**Gas Limit**: The maximum amount of gas a sender is willing to use for a transaction. If the actual gas used exceeds this, the transaction reverts.

**Gas Price**: The amount of ETH (in Gwei) paid per unit of gas consumed.

**Genesis Block**: The very first block in a blockchain (block 0), hardcoded into the protocol.

**GM**: "Good Morning" — a daily on-chain greeting and cultural ritual in the Endless Domains community, recorded as a smart contract call.

**Gold**: The third tier in the Endless Domains reputation system, representing scores from 500 to 749.

**Gwei**: One billionth of ETH (10⁻⁹ ETH). The standard unit for expressing gas prices.

**Hard Fork**: A backward-incompatible protocol upgrade that creates two diverging versions of a blockchain. Example: Ethereum and Ethereum Classic.

**Hash**: A fixed-length cryptographic fingerprint of any data, produced by a hash function. Changing the input even slightly produces a completely different hash.

**HD Wallet (Hierarchical Deterministic)**: A wallet that generates a tree of key pairs from a single seed phrase, enabling management of many addresses from one backup.

**Hot Wallet**: A wallet connected to the internet, convenient for everyday use but more exposed to security risks.

**IPFS (InterPlanetary File System)**: A peer-to-peer, content-addressed file system used for decentralized storage of NFT metadata and website assets.

**isClaimed**: A boolean indicating whether a specific user has already claimed a particular perk.

**isReputationOptedIn**: A boolean flag indicating whether a wallet has enrolled in the Endless Domains reputation tracking system.

**isTop_500**: A flag on Endless Domains indicating whether a user was among the first 500 to opt into the reputation system, granting them founding member benefits.

**isUnlocked**: A boolean indicating whether a user's current tier meets the requirements to access a specific perk.

**L1 (Layer 1)**: The base blockchain protocol (Ethereum, Solana, Bitcoin) with its own consensus mechanism and security.

**L2 (Layer 2)**: A secondary protocol built on top of an L1 to improve scalability, typically by processing transactions off-chain and batching them back to L1.

**Layer Zero (L0)**: Infrastructure that enables cross-chain communication, sitting below L1 chains. LayerZero the protocol is an example.

**Leaderboard**: A ranked list of users sorted by reputation score, with optional time-period filtering (daily, weekly, all-time).

**Light Node**: A blockchain node that downloads only block headers rather than full blocks, relying on full nodes for state verification.

**Linea**: An Ethereum Layer 2 ZK rollup built by Consensys.

**Liquidity Pool**: A smart contract holding reserves of two tokens, enabling decentralized token swaps via AMM pricing.

**longestStreak**: The highest GM check-in streak a user has ever achieved. Never resets, even if the current streak is broken.

**Mempool (Memory Pool)**: The set of pending, unconfirmed transactions waiting to be picked up by validators and included in a block.

**MetaMask**: The most widely used EVM browser extension wallet, injecting `window.ethereum` for dApp connectivity.

**MEV (Maximal Extractable Value)**: Profit that block producers can extract by reordering, inserting, or censoring transactions within blocks they produce.

**minReputationScore**: The minimum reputation score required to access a specific perk on Endless Domains.

**Monad**: A high-performance EVM-compatible L1 blockchain that uses parallel transaction execution to achieve significantly higher throughput.

**Multi-Sig (Multi-Signature)**: A wallet or contract requiring signatures from multiple private keys to authorize a transaction. Common for DAO treasuries and team wallets.

**NFT (Non-Fungible Token)**: A unique digital token on a blockchain representing ownership of a one-of-a-kind item. Domain names on Endless Domains are NFTs.

**NFT_TOKEN**: A perk type on Endless Domains where the reward is an NFT airdropped to the claimer's wallet.

**Node**: Any computer participating in a blockchain network by storing and/or validating blocks and transactions.

**Nonce**: A sequential counter in transactions (preventing replay attacks) or in block mining (adjusted to find valid hashes). Also used in cryptographic contexts to mean "number used once."

**Non-Custodial**: Ownership model where the user holds their own private keys with no third-party intermediary.

**Optimism**: An Ethereum Layer 2 using optimistic rollups, backed by a foundation and governed by a DAO.

**Optimistic Rollup**: An L2 scaling approach that processes transactions off-chain and posts them to L1, assuming validity unless challenged via a fraud proof.

**optIn / optOut**: The user action of enrolling in or withdrawing from the Endless Domains reputation tracking system.

**pagination**: Server-side data navigation mechanism using page numbers and limits for efficient retrieval of large result sets.

**PDA (Program Derived Address)**: A Solana account whose address is deterministically derived from a program ID and seeds, controlled by programs rather than wallets.

**perkType**: The category of a perk reward: COUPON, PROMO_CODE, USDT, NFT_TOKEN, WHITELIST, EARLY_ACCESS, or EXCLUSIVE_CONTENT.

**perkValue**: The actual content of a claimed perk (coupon code, USDT amount, NFT metadata, etc.), revealed only after claiming.

**Phantom**: The leading Solana wallet, available as a browser extension and mobile app.

**Platinum**: The highest tier in the Endless Domains reputation system, representing scores from 750 to 1000.

**pointsNeeded**: The number of additional reputation points required to reach the next tier, dynamically calculated per user.

**Polygon**: An EVM-compatible sidechain/L2 ecosystem with high throughput and low transaction costs.

**primaryDomain**: The domain NFT a user designates as their identity in the Endless Domains reputation system, used for GM check-ins and profile display.

**primaryDomainId**: The database ID of the user's selected primary domain record.

**Private Key**: A secret cryptographic value that provides complete control over a wallet. Never share this.

**Proof of History (PoH)**: Solana's consensus mechanism that uses cryptographic proofs to create a verifiable historical record of events, acting as a decentralized clock.

**Proof of Stake (PoS)**: A consensus mechanism where validators must lock up (stake) tokens as collateral to participate in block production, with dishonest behavior resulting in loss of stake (slashing).

**Proof of Work (PoW)**: A consensus mechanism where miners solve computational puzzles to earn the right to add blocks and receive rewards. Used by Bitcoin.

**Public Key**: A cryptographic value derived from your private key, safe to share publicly. Your wallet address is derived from your public key.

**Rank**: A user's position in the Endless Domains reputation leaderboard, with rank 1 being the highest score.

**RPC (Remote Procedure Call)**: The protocol by which frontend applications communicate with blockchain nodes to read data and broadcast transactions.

**Reown AppKit**: The SDK (formerly WalletConnect) providing a unified wallet connection UI supporting hundreds of EVM wallets and Solana wallets simultaneously.

**Reputation Score**: A 0–1000 numerical measure of a user's on-chain engagement and ecosystem participation on Endless Domains.

**Resolver**: In ENS and other domain systems, a smart contract that stores and returns records (like wallet addresses) for a domain name.

**SafePal**: A hardware and software wallet supporting both EVM chains and Solana, integrated with Endless Domains.

**sayGM**: The smart contract function called during a GM check-in. Takes the user's domain name as a parameter and emits a GM event on-chain.

**scoreHistory**: Historical time-series data of a user's reputation score changes, tracked daily.

**secp256k1**: The elliptic curve used by Bitcoin and all EVM chains for generating key pairs and signing transactions.

**Seed Phrase (Mnemonic)**: A 12 or 24-word phrase that encodes a wallet's private key in a human-readable, writable format. The master backup for all funds in the wallet.

**Silver**: The second tier in the Endless Domains reputation system, representing scores from 250 to 499.

**Slashing**: The penalty mechanism in Proof of Stake systems where a validator's staked tokens are partially or fully destroyed for dishonest behavior.

**Smart Contract**: Self-executing code deployed on a blockchain that automatically enforces the terms of an agreement when predefined conditions are met.

**SNS (Solana Name Service)**: The domain naming standard on Solana, managed by Bonfida, issuing `.sol` names.

**Solana**: A high-performance Layer 1 blockchain using Proof of History and Proof of Stake, capable of 65,000+ transactions per second.

**Solana Activity Score**: The reputation score component (max 250 points) based on transaction history and protocol usage on the Solana network.

**SPL Token**: The Solana Program Library token standard — Solana's equivalent of ERC-20 and ERC-721.

**Stablecoin**: A token designed to maintain a stable value, typically 1:1 with the US dollar. USDT and USDC are examples.

**stale**: A flag on Endless Domains indicating that a primary domain has been transferred away from the user's wallet, requiring them to set a new primary domain.

**Staking**: Locking tokens in a smart contract to earn rewards, participate in consensus, or access features. Different from DeFi staking (which is yield farming).

**State Root**: A compact hash summarizing the entire current state of a blockchain (all balances, all contract storage) as a Merkle root stored in the block header.

**Sybil Attack**: An attack where one entity creates many fake identities to disproportionately gain influence or rewards in a system designed to treat each identity equally.

**Tenderly**: A developer platform for simulating, debugging, and monitoring EVM smart contract interactions.

**Tier**: The reputation level assigned based on a user's total score: BRONZE (0–249), SILVER (250–499), GOLD (500–749), PLATINUM (750–1000).

**tierRequired**: The minimum tier needed to claim a specific perk on Endless Domains.

**TLD (Top-Level Domain)**: The suffix of a domain name. In Web3: `.eth`, `.sol`, `.og`, `.crypto`, `.wallet`, `.nft`, `.dao`, and 50+ more on Endless Domains.

**Token**: A digital asset issued by a smart contract on a blockchain. Can be fungible (ERC-20) or non-fungible (ERC-721/ERC-1155).

**tokenId**: The unique identifier of a specific NFT within a collection. Each domain NFT has a unique tokenId.

**totalCheckins**: The cumulative number of on-chain GM check-ins a user has performed since joining Endless Domains.

**totalScore**: The sum of all score components, ranging from 0 to 1000, representing a user's total reputation on Endless Domains.

**totalSupply**: The maximum number of times a perk can be claimed across all users.

**Transaction**: Any signed operation that changes blockchain state, broadcast to the network and permanently recorded.

**Transaction Hash (txHash)**: A unique 66-character identifier assigned to a transaction when it is included in a block. Used as on-chain proof of any action.

**TVL (Total Value Locked)**: The total value of assets deposited in a DeFi protocol, used as a measure of its adoption and trust.

**Unstoppable Domains (UD)**: A Web3 domain registrar offering permanent `.crypto`, `.wallet`, `.nft`, `.dao`, and other domain names as NFTs, with no annual renewal fees.

**USDT (Tether USD)**: The most widely used fiat-backed stablecoin, available as an ERC-20 token on Ethereum, Polygon, BNB Chain, and most EVM networks. Used as a perk reward type on Endless Domains.

**Validator**: A node that participates in the consensus process — voting on new blocks in Proof of Stake systems, or mining in Proof of Work.

**viem**: A modern TypeScript-first JavaScript library for interacting with EVM blockchains, used in the Endless Domains tech stack.

**wagmi**: A collection of React hooks for EVM wallet connections and smart contract interactions, built on viem.

**Wallet**: A software or hardware tool that stores your private keys and allows you to interact with blockchains. Not a storage device for tokens — the tokens live on the chain, the wallet just holds the keys to control them.

**WalletConnect**: An open protocol for encrypted connections between dApps and mobile wallets. Now branded as Reown.

**Web3**: The vision and emerging reality of a decentralized internet built on blockchains, where users own their data, assets, and identities rather than ceding control to centralized platforms.

**WHITELIST**: A perk type on Endless Domains granting early or exclusive access to an NFT mint, token sale, or product launch.

**Zero-Knowledge Proof (ZK Proof)**: A cryptographic method allowing one party to prove knowledge of information without revealing the information itself. Used in ZK rollups and private transactions.

**ZK Rollup**: A Layer 2 scaling solution that uses zero-knowledge proofs to batch transactions and prove their validity to the L1, offering faster finality than optimistic rollups.

---

*This document is maintained by the Endless Domains team. For the latest updates, platform changes, and community discussions, visit the Endless Domains platform.*

*Last updated: June 2026*
