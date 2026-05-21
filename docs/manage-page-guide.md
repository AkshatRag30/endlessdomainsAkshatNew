# Manage Page Guide — UD, ARB, BNB, ENS

A complete breakdown of the UD manage page architecture, every component and how they relate, and a step-by-step approach to replicating the same pattern for ARB, BNB, and ENS.

---

## 1. What the Manage Page Does

The manage page is the post-purchase control panel for a user's domain. After buying a domain, the user lands here to:

- Set crypto payment addresses (UD only has this because it supports multi-chain address records)
- Configure reverse resolution (map their wallet address back to a human-readable domain name)
- Transfer ownership of the domain permanently
- View or manage parked domains

Each chain (UD, ARB, BNB, ENS) has its own version of this page, but the conceptual structure is the same across all of them.

---

## 2. UD Manage Page — Full File Map

```
pages/ud/
├── manage.tsx                     The page entry point (route: /ud/manage)
└── manage.module.scss             Page-level styles

src/components/manage-ud/
├── UDSidebar.tsx                  Left-side nav — switches between the 4 sections
├── UDSidebar.module.scss
├── UdDomainDetails.tsx            Top banner — domain name, owner address, expiry
├── UdDomainDetails.module.scss
├── UDCrypto.tsx                   Crypto addresses tab — add/remove/save coin addresses
├── UDCrypto.module.scss
├── UDReverseNew.tsx               Reverse resolution tab — link wallet to domain name
├── UDReverseNew.module.scss
├── UDTransfer.tsx                 Transfer tab — permanently send domain to new wallet
├── UDTransfer.module.scss
├── CurrencyModal.tsx              Searchable picker modal (opened from UDCrypto)
├── CurrencyModal.module.scss
├── CurrencyList.json              ~400 coins with multi-chain variants (~1888 lines)
└── types.ts                       Shared type definitions for this section
```

---

## 3. Component Relationships — How They Connect

```
manage.tsx (page)
│
│  state: selectedMenu ('crypto' | 'reverse' | 'transfer' | 'pd')
│  state: domain, owner, expiry (demo data today, API later)
│
├── TopNavBar (layout header)
├── DashboardTabBar (layout sub-nav)
│
├── UdDomainDetails
│     props: domain, owner, expiry
│     role: always visible at the top — shows domain identity info
│
├── UDSidebar
│     props: selectedMenu, setSelectedMenu
│     role: drives the active tab — clicking an item changes selectedMenu
│
└── [Dynamic content panel — renders based on selectedMenu]
      │
      ├── selectedMenu === 'crypto'   → UDCrypto
      │     props: domain
      │     local state: entries[], isModalOpen, showSuccess
      │     opens: CurrencyModal
      │              props: onClose, onAdd
      │              data source: CurrencyList.json
      │
      ├── selectedMenu === 'reverse'  → UDReverseNew
      │     props: domain, currentRecord
      │     local state: showSuccess
      │
      ├── selectedMenu === 'transfer' → UDTransfer
      │     props: domain
      │     local state: recipient, agreed, showConfirmModal
      │
      └── selectedMenu === 'pd'       → [Parked Domains — placeholder]
```

Key point: **UDSidebar does not render content — it only updates `selectedMenu` in the page**. The page itself decides what to render. This keeps the sidebar dumb and the page in control.

---

## 4. Component-by-Component Breakdown

### 4.1 manage.tsx — The Orchestrator

```tsx
// pages/ud/manage.tsx
const [selectedMenu, setSelectedMenu] = useState<UDViewMenu>('crypto')

// Demo data (replace with API call when ready)
const domain = 'myawesomeudomain.crypto'
const owner = '0xaBcD...1234'
const expiry = '2027-01-01'
```

Responsibilities:
- Holds the `selectedMenu` state and passes it down to both the sidebar and the content area
- Owns the top-level domain data (domain name, owner, expiry) — these will eventually come from a `useEffect` + API call
- Decides which content component to render based on `selectedMenu`

Nothing complex happens here — it is intentionally thin. All component logic lives inside the individual components.

---

### 4.2 UdDomainDetails — Domain Identity Banner

Always visible at the top of the page regardless of which tab is active.

What it shows:
- Domain name split into base + TLD (e.g., "myawesomeudomain" and ".crypto") with a badge for the TLD
- Chain badge — currently hardcoded to Polygon (will come from domain metadata)
- Owner wallet address with a copy-to-clipboard button
- Expiry date with a red dot if expired or approaching expiry

Props:
```ts
domain: string      // full domain e.g. "myawesomeudomain.crypto"
owner: string       // wallet address e.g. "0xaBcD...1234"
expiry: string      // date string e.g. "2027-01-01"
```

---

### 4.3 UDSidebar — Tab Navigation

A vertical nav list on desktop, a 4-column grid on mobile.

Four menu options:
- Reverse Resolution
- Crypto
- Transfer
- Parked Domains

Props:
```ts
selectedMenu: UDViewMenu
setSelectedMenu: (menu: UDViewMenu) => void
```

Active state: the selected item gets a blue background and an inset white glow effect (defined purely in SCSS using `&.active` modifier). No JS logic needed for styling — the active class is toggled via `selectedMenu === item.key`.

---

### 4.4 UDCrypto — Crypto Address Manager

The most complex component in the flow — unique to UD because UD domains support multi-chain address records.

What it does:
- Shows a list of `CryptoEntry` objects (currency symbol, chain, address string)
- Each entry has an input field to type the address and a remove button
- An "Add Currency" button opens `CurrencyModal`
- A "Save Changes" button (currently shows a success modal — no backend call yet)

Local state:
```ts
entries: CryptoEntry[]       // list of currencies the user has added
isModalOpen: boolean         // whether CurrencyModal is open
showSuccess: boolean         // whether the save success modal is showing
```

CryptoEntry shape:
```ts
{ key: string, name: string, address: string }
// e.g. { key: 'ETH', name: 'Ethereum', address: '' }
```

---

### 4.5 CurrencyModal — The Currency Picker

Opened by UDCrypto. A scrollable, searchable list of ~400 coins.

Data source: `CurrencyList.json` — each entry has a key (coin symbol) and name. Many coins have multiple blockchain variants (e.g., USDC has ERC20, MATIC, SOL, BEP20 versions — each is a separate entry).

Props:
```ts
onClose: () => void
onAdd: (currency: { key: string, name: string }) => void
```

On "Add" click, it calls `onAdd` and closes itself. The parent (UDCrypto) then appends the new currency to its `entries` array.

---

### 4.6 UDReverseNew — Reverse Resolution

Lets the user point their wallet address back to their domain name (so dApps can show the domain instead of the hex address).

Two visual states:
- **Already set**: Shows a seal/checkmark card confirming the current domain is the reverse record
- **Not set**: Shows a before/after card comparison (wallet address → domain name) with an "Update" button

Props:
```ts
domain: string          // domain to set as reverse record
currentRecord: string   // current reverse record (empty string if none)
```

Local state:
```ts
showSuccess: boolean    // controls the success confirmation modal
```

---

### 4.7 UDTransfer — Domain Transfer

Lets the user permanently transfer the domain to a new wallet address.

Warning design: the component opens with a prominent warning banner because this action is irreversible. The "Transfer Domain" button is disabled until both conditions are met:
- A valid 42-character recipient address is entered
- The confirmation checkbox is checked

Props:
```ts
domain: string
```

Local state:
```ts
recipient: string         // target wallet address input
agreed: boolean           // confirmation checkbox state
showConfirmModal: boolean // "are you sure?" modal before final transfer
```

---

## 5. State Flow Summary

```
User clicks sidebar item
  → setSelectedMenu('reverse') in manage.tsx
  → UDSidebar re-renders with new active item styled
  → manage.tsx renders UDReverseNew instead of UDCrypto

User clicks "Add Currency" in UDCrypto
  → setIsModalOpen(true) — local to UDCrypto
  → CurrencyModal renders as overlay
  → User picks a coin → onAdd({ key, name }) fires
  → UDCrypto appends { key, name, address: '' } to entries
  → CurrencyModal closes

User clicks "Save Changes" in UDCrypto
  → setShowSuccess(true) — local to UDCrypto
  → Success modal renders
  → (future: also calls API to persist addresses)
```

---

## 6. What Is Demo Data Today (needs API wiring)

In `manage.tsx` around line 15 there is a comment: "Demo data (replace with API call when ready)". The following are hardcoded and need to be replaced with real API calls:

| Data | Currently | Should become |
|---|---|---|
| `domain` | `'myawesomeudomain.crypto'` | From URL query param (`router.query.domain`) |
| `owner` | Hardcoded address | From UD API or on-chain read |
| `expiry` | Hardcoded date | From UD API |
| `currentRecord` in UDReverseNew | `''` | From UD reverse resolution API |
| Save Changes in UDCrypto | Shows success only | POST to UD API to set records |
| Update in UDReverseNew | Shows success only | Call UD API to set reverse record |
| Transfer in UDTransfer | Shows success only | Call contract / UD API to transfer |

---

## 7. Approach for Building ARB, BNB, ENS Manage Pages

The UD manage page is the design reference. For ARB, BNB, and ENS, the page shape is the same — the differences are in what tabs exist and what APIs/contracts are called.

### 7.1 What Stays Identical

- Page layout: TopNavBar + DashboardTabBar + UdDomainDetails-equivalent + Sidebar + Content panel
- Sidebar navigation pattern (selectedMenu state driving content)
- Transfer component (same UX, different contract call)
- Reverse resolution component (same UX, different contract call)
- Design system usage — all tokens, all primitives, no legacy imports

### 7.2 What Differs Per Chain

| Feature | UD | ARB | BNB | ENS |
|---|---|---|---|---|
| Crypto address records | Yes (CurrencyList.json) | No | No | Limited (ETH, BTC) |
| Reverse resolution | Yes (UD API) | Yes (ARB contract) | Yes (BNB contract) | Yes (ENS contract) |
| Transfer | Yes | Yes | Yes | Yes |
| Parked domains | Yes | Yes | Yes | Yes |
| Chain badge on details banner | Polygon | Arbitrum | BNB Chain | Ethereum |
| Owner data source | UD API | on-chain read (wagmi) | on-chain read (wagmi) | on-chain read (wagmi) |
| Expiry source | UD API | contract read | contract read | ENS contract read |
| Tab: Subdomains | No | Maybe | No | Yes (ENS supports it) |

### 7.3 File Naming Convention

Follow the same pattern as manage-ud:

```
pages/arb/manage.tsx
pages/arb/manage.module.scss
src/components/manage-arb/
├── ARBSidebar.tsx
├── ARBSidebar.module.scss
├── ArbDomainDetails.tsx
├── ArbDomainDetails.module.scss
├── ARBReverseNew.tsx
├── ARBReverseNew.module.scss
├── ARBTransfer.tsx
├── ARBTransfer.module.scss
└── types.ts

pages/bnb/manage.tsx
src/components/manage-bnb/
├── BNBSidebar.tsx
├── BNBDomainDetails.tsx
├── BNBReverseNew.tsx
├── BNBTransfer.tsx
└── types.ts

pages/ens/manage.tsx
src/components/manage-ens/
├── ENSSidebar.tsx
├── ENSDomainDetails.tsx
├── ENSReverseNew.tsx
├── ENSTransfer.tsx
└── types.ts
```

### 7.4 Step-by-Step Implementation Order

For each chain, follow this exact sequence:

**Step 1 — Create the page shell**
Copy the UD `manage.tsx` structure. Replace the `UDViewMenu` type with the chain-specific menu options. For ARB/BNB/ENS, the initial menu type is `'reverse' | 'transfer' | 'pd'` (no crypto tab). Replace demo data with `router.query.domain`.

**Step 2 — Build DomainDetails banner**
Copy `UdDomainDetails` structure. Change the chain badge icon and label to match the chain (ArbitrumIcon, BNBIcon, EthereumIcon). Wire the owner address to the appropriate on-chain read (wagmi `useReadContract` for ARB/BNB/ENS). Wire expiry similarly.

**Step 3 — Build the Sidebar**
Copy `UDSidebar`. Remove the "Crypto" menu item since ARB/BNB/ENS do not have multi-chain address records. Keep: Reverse, Transfer, Parked Domains. For ENS, optionally add a Subdomains item.

**Step 4 — Build the Transfer component**
The UX is identical to `UDTransfer` — warning banner, recipient input, checkbox, confirmation modal. Only the actual transfer call changes: replace the UD placeholder with the appropriate wagmi `useWriteContract` call to the chain's registry/registrar contract.

**Step 5 — Build the Reverse Resolution component**
Copy `UDReverseNew`. Replace the update call with the chain-specific reverse resolver contract write.
- ARB: call the ARB Name Service resolver
- BNB: call the SPACE ID resolver
- ENS: call ENS Public Resolver `setName`

**Step 6 — Wire real data**
Replace all demo/placeholder values with real data from services (`src/core/services/`) or on-chain reads. Do not add API calls directly to components — add them to the appropriate service file and call the service from the page or a custom hook.

**Step 7 — Connect Redux if needed**
If manage page data needs to be shared with other parts of the app (cart, profile), dispatch to the appropriate Redux slice. If the data is local to this page only, keep it in local component state.

---

## 8. Reusable Pieces You Can Share Across All Chains

These components are chain-agnostic and can be abstracted into `src/design-system/composites/` or a shared `manage-shared/` directory if the codebase reaches a point where duplication becomes a problem:

- Success modal (currently copy-pasted into each content component)
- Confirmation modal (used in Transfer — same structure each time)
- Domain details banner (same layout, different badge icon)
- Sidebar navigation (same structure, different menu items)

Until you have built all four manage pages, do not abstract prematurely. Build UD, then ARB, then extract the shared pieces once you can see the actual overlap.

---

## 9. Services and Helpers to Know

| Module | Purpose | Used by |
|---|---|---|
| `src/core/services/api.service.ts` | Core HTTP client, auth interceptor | All API calls |
| `src/helpers/ud/` | UD-specific domain operations | UD manage |
| `src/helpers/arb/` | ARB-specific domain operations | ARB manage |
| `src/helpers/bnb/` | BNB-specific domain operations | BNB manage |
| `src/helpers/ens/` | ENS-specific domain operations | ENS manage |
| `src/config/wagmi.ts` | Wagmi + AppKit config | ARB, BNB, ENS (EVM chains) |

For UD, most operations go through the UD API (HTTP). For ARB, BNB, ENS, operations are split between HTTP (for metadata) and on-chain contract calls (via wagmi).

---

## 10. Quick Reference — UDViewMenu Type

```ts
// src/components/manage-ud/types.ts (or wherever it lives)
type UDViewMenu = 'crypto' | 'reverse' | 'transfer' | 'pd'

// For ARB/BNB/ENS — no crypto tab
type EVMViewMenu = 'reverse' | 'transfer' | 'pd'

// For ENS — add subdomains if needed
type ENSViewMenu = 'reverse' | 'transfer' | 'pd' | 'subdomains'
```

---

## 11. Design System Rules Reminder (applies to all manage pages)

- All colors from `var(--color-*)` tokens in `_tokens.scss` — no hardcoded hex values
- All spacing from `var(--space-*)` tokens — no bare `px` values
- No inline `style={{}}` props — dynamic states via CSS class toggling or `aria-expanded`
- No Bootstrap component classes — use design system primitives
- No Reactstrap imports
- All interactive elements need `:focus-visible` via `@include focus-ring`
- Mobile-first breakpoints at 375px / 768px / 1024px / 1440px
- Every icon-only button needs `aria-label`
- Every toggle needs `aria-expanded`
