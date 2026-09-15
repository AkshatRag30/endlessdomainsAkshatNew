# Backend API & Developer Onboarding Guide
### Endless Domains Web UI — Complete Reference for the `new-design-ed` Branch

---

## Table of Contents

**Part 1 — What You Need to Study**
1. [Prerequisites — What to Learn Before Touching This Codebase](#1-prerequisites--what-to-learn-before-touching-this-codebase)
2. [Codebase-Specific Concepts to Understand First](#2-codebase-specific-concepts-to-understand-first)

**Part 2 — Architecture & API Reference**

3. [How the API Layer is Built](#3-how-the-api-layer-is-built)
4. [Base URL & Environment Variables](#4-base-url--environment-variables)
5. [Cookie-Based Auth & Token Flow](#5-cookie-based-auth--token-flow)
6. [The HTTP Wrapper — api.service.ts](#6-the-http-wrapper--apiservicets)
7. [Every Service File & Its Functions](#7-every-service-file--its-functions)
8. [All API Endpoints Reference](#8-all-api-endpoints-reference)
9. [Redux State Management](#9-redux-state-management)
10. [Data Models (TypeScript Interfaces)](#10-data-models-typescript-interfaces)
11. [The Standard Data Flow Pattern](#11-the-standard-data-flow-pattern)
12. [Web3 / Wallet Integration](#12-web3--wallet-integration)
13. [Session & Auto-Logout Logic](#13-session--auto-logout-logic)
14. [Real Integration Cheat Sheet](#14-real-integration-cheat-sheet)

---

# Part 1 — What You Need to Study

## 1. Prerequisites — What to Learn Before Touching This Codebase

These are the foundational technologies used throughout the project. You need to be comfortable with all of them before making meaningful contributions.

---

### 1.1 TypeScript (Essential)

Every file in this codebase is TypeScript. You need to know:

- **Interfaces and types** — every data shape is typed. All shared interfaces live in `src/core/model/`. You will read these constantly.
- **Generics** — used in service functions like `postApiCall<T>()`.
- **Enums** — every endpoint URL, cookie key, blockchain network, domain status, and order status is an enum value, not a raw string. Enums live in `src/core/enum/`.
- **Strict mode** — the project has `strict: true`. Understand non-nullable types and how to handle `null` vs `undefined`.
- **`as` casts** — used sparingly, but you will encounter them. Prefer type narrowing over casting.

Study priority: **High.** Nothing works without this.

---

### 1.2 React 18 (Essential)

- **`useState`, `useEffect`, `useCallback`, `useMemo`** — used in every component. Know when to use each.
- **`useCallback`** — required for any function passed as a prop or used in a `useEffect` dependency array. This is enforced by the code conventions.
- **`useRef`** — used for DOM manipulation, GSAP animation targets, and timer references.
- **`forwardRef`** — all design system primitives use this pattern for ref forwarding.
- **Conditional rendering** — loading/error/empty states are required on every async block.
- **Keys in lists** — note that TypeScript 5.2 does not allow `key` on `React.Fragment` shorthand syntax. Use `React.createElement(React.Fragment, { key }, ...children)` instead.

Study priority: **High.**

---

### 1.3 Next.js 14 — Pages Router (Essential)

This project uses the **Pages Router**, not the App Router. Do not confuse them.

- **`pages/` directory** — every file here is a route. Dynamic routes like `[slug].tsx` and `[tld]/index.tsx` are used heavily.
- **`_app.tsx`** — the global wrapper. Redux Provider, Wagmi, Solana wallet adapter, Google OAuth, and the global QueryClient are all mounted here. Read this file carefully.
- **`_document.tsx`** — custom HTML document for font loading and meta setup.
- **`getServerSideProps` / `getStaticProps`** — used on some pages for SSR. Know the difference and when each applies.
- **`useRouter`** — used for programmatic navigation (`router.push()`), reading query params, and reading the current route.
- **`next/image`** — all images use this component. Know the `alt`, `width`, `height`, `fill`, and `priority` props.
- **`next/head`** — used for per-page SEO: `<title>`, `<meta>` description, Open Graph tags.
- **`next.config.js`** — the project has webpack overrides for web3 packages (fs, net, tls, crypto fallbacks), PWA support, and CSP headers for Builder.io.

Study priority: **High.**

---

### 1.4 Redux Toolkit (Essential)

Every piece of global state — user session, cart, favorites, loading spinners, modals — lives in Redux.

- **`createSlice`** — how all 12 slices are defined. Understand `initialState`, `reducers`, and how action creators are auto-generated.
- **`useSelector`** — how components read state. Always type with `RootState`.
- **`useDispatch`** — how components trigger state changes. Import `AppDispatch` for typed dispatch.
- **`configureStore`** — how slices are combined in `src/core/redux/store.ts`.
- **The slice list** — there are 12 slices: `user`, `cart`, `fav`, `info`, `event`, `allevent`, `subscriber`, `sync`, `banner`, `unverifiedlogin`, `cryptoCurrency`, `universalReducer`, `parkedDomain`. You do not need to memorize all of them immediately, but you must know where to find them.

Study priority: **High.**

---

### 1.5 SCSS Modules (Essential for this branch)

This branch replaces scattered SCSS with a token-based design system. You need to know:

- **CSS Modules** — how `styles.className` works, why class names are locally scoped, and how you import a `.module.scss` file.
- **SCSS variables and `var(--*)`** — all tokens in `_tokens.scss` are CSS custom properties (`var(--color-blue-primary)`, etc.). Know the difference between SCSS variables (`$var`) and CSS custom properties (`var(--)`). This project uses CSS custom properties for tokens.
- **`@use` and `@forward`** — how `_tokens.scss` is imported into component SCSS files.
- **Nesting** — all hover, focus, and modifier states are nested inside the base selector.
- **`@include`** — the `focus-ring` mixin is used for all `:focus-visible` states. Do not write raw `outline` rules.
- **`min-width` media queries** — all responsive code is mobile-first.

Study priority: **High.**

---

### 1.6 Axios (High)

The entire API layer is built on axios. You need to know:

- **Interceptors** — `api.service.ts` uses a request interceptor to auto-inject the `Authorization: Bearer <token>` header from the cookie. You never manually attach headers in a component.
- **`axios.create()`** — the project creates a custom axios instance with the base URL preconfigured.
- **`AxiosResponse<T>`** — some service functions return the full typed response object.
- **Error handling** — `error.service.ts` intercepts 401 responses, calls the refresh token endpoint, and retries the original request automatically.

Study priority: **High.**

---

### 1.7 Wagmi v2 + Reown AppKit (Medium)

For every page that involves EVM wallet connection or blockchain interaction:

- **`useAccount()`** — returns `{ address, isConnected, chain }`. The most common hook.
- **`useWeb3Modal()`** — opens the connect wallet modal. Call `open()`.
- **`useSignMessage()`** or viem's `signMessage` — used in the wallet auth flow to sign nonces.
- **`WagmiProvider`** — configured in `src/config/wagmi.ts` with supported chains: Ethereum mainnet, Arbitrum, Polygon, Base, BNB.
- **Chain IDs and RPC URLs** — configured in `wagmi.ts`. Do not change them without confirming with the backend team.

Study priority: **Medium.** Only needed when working on wallet-related features.

---

### 1.8 Solana wallet-adapter-react (Medium)

For Solana domain features:

- **`useWallet()`** — returns `{ publicKey, signMessage, connected, wallet }`.
- **`useConnection()`** — returns the Solana RPC connection.
- **Adapters** — Phantom and Solflare are the configured adapters in `_app.tsx`.

Study priority: **Medium.** Only needed when working on Solana-related features.

---

### 1.9 react-hook-form (Medium)

All forms in the project use this library:

- **`useForm()`** — the main hook. Returns `register`, `handleSubmit`, `formState: { errors }`, `watch`, `setValue`, `reset`.
- **`register`** — used on input elements to bind them to the form. Replaces manual `useState` for form fields.
- **`handleSubmit`** — wraps your submit handler and validates before calling it.
- **Validation rules** — passed directly to `register`: `{ required: true, minLength: 8, pattern: /regex/ }`.

Study priority: **Medium.** Required when building login, register, profile, or any form-heavy page.

---

### 1.10 @tanstack/react-query (Low — currently minimal use)

The project has it installed and it is the preferred approach for server state going forward, but most existing data fetching still uses the manual `useEffect + service + setState` pattern. Know the basics:

- **`useQuery()`** — data fetching with built-in caching, loading/error states.
- **`useMutation()`** — for POST/PUT/DELETE operations.

Study priority: **Low.** Understand the concept but do not refactor existing patterns unless explicitly asked.

---

### 1.11 Git & Branch Strategy (Essential)

- **Current working branch**: `new-design-ed` — the design overhaul branch. All your work goes here.
- **`main`** — production branch. Bug fixes and maintenance happen here. Do not port old patterns from `main` into `new-design-ed`.
- **`uat`** — staging/review branch. PRs go from `new-design-ed` → `uat` for TPM review, not directly to `main`.
- **Conventional commits** — `feat(scope): message`, `fix(scope): message`, `refactor(scope): message`. Always use this format.
- **No deletions** — old files are renamed to `.legacy.tsx` or moved to `_deprecated/`. Never `git rm` a working file.

Study priority: **Essential.** Doing this wrong creates messy git history and breaks the PR process.

---

## 2. Codebase-Specific Concepts to Understand First

Before writing a single line of code, read and understand these five things. They are the most common source of mistakes on this project.

---

### 2.1 The Design System is the Only Source of Truth

All UI is built from `src/design-system/`. There are three layers:

- **Primitives** — atomic components (Button, Input, Badge, Card, Modal, Table, Tabs, Dropdown, Skeleton, Toast, Avatar, Tag, Tooltip)
- **Composites** — multi-primitive compositions (SearchBar, PriceTag, DomainCard, CartItem, StatsCard, EmptyState, PageHeader)
- **Layouts** — page shells (MainLayout, AuthLayout, DashboardLayout, ContentLayout)

You never import from `@component/*`, `@template/*`, or `@styles/*` in new code. You never use Reactstrap components. You never use Bootstrap component classes (`.btn`, `.card`, `.navbar`). Bootstrap utility classes (`d-flex`, `gap-*`, `mt-*`) and grid (`row`, `col-*`) are still fine.

Read `src/design-system/styles/_tokens.scss` before writing any SCSS. Every color, spacing value, font, radius, and shadow you need is defined there as a CSS custom property.

---

### 2.2 The Three-Layer API Architecture

```
Component / Page
      ↓
Service File   (src/core/services/*.ts)
      ↓
api.service.ts (the HTTP wrapper — only file that calls axios)
      ↓
Axios Interceptor (auto-injects Bearer token)
      ↓
Backend API (https://apistage.endlessdomains.io/api/v1)
      ↓
error.service.ts (handles 401 refresh, redirects)
      ↓
Redux dispatch → useSelector → component re-renders
```

Never call `fetch` or `axios` directly from a component or page file. Always go through a service function.

---

### 2.3 Enums, Not Strings

Do not hardcode API paths, cookie keys, domain statuses, or blockchain names as raw strings. Every one of these has an enum:

- API paths → `src/core/enum/api-endpoint.enum.ts`
- Cookie keys → `src/core/enum/cookie.enum.ts`
- Domain status → `src/core/enum/domain-status.enum.ts`
- Order status → `src/core/enum/order-status.enum.ts`
- Payment mode → `src/core/enum/payment-mode.enum.ts`
- Blockchain networks → `src/core/enum/blockchain-network.enum.ts`
- Domain providers → `src/core/enum/domainProvider.enum.ts`
- Toast types → `src/core/enum/toast-type.enum.ts`

---

### 2.4 Where State Lives

| Type of state | Where it lives |
|---|---|
| Logged-in user token | Redux `user` slice |
| Full user profile (name, email, wallets) | Redux `info` slice |
| Cart items | Redux `cart` slice |
| Favorited domains | Redux `fav` slice |
| Global loading spinner | Redux `universalReducer` slice |
| Cart sync errors | Redux `sync` slice |
| Parked domain page builder | Redux `parkedDomain` slice |
| Modal visibility (event, subscriber, banner) | Redux `event`, `subscriber`, `banner` slices |
| Unverified login modal | Redux `unverifiedlogin` slice |
| Auth tokens | Cookies via `cookies.service.ts` |
| Page-local async data (FAQs, orders list) | Component `useState` |

---

### 2.5 The Checklist You Run on Every Edit

Before committing any change, run through CLAUDE.md Section 11. The four most common failure modes are:

1. **Inline styles** — zero `style={{}}` props allowed. Use SCSS class toggling or `aria-*` attributes instead.
2. **Hardcoded values in SCSS** — no hex colors, bare `px` values, or font name strings. Everything traces back to a token: `var(--color-blue-primary)`, `var(--space-4)`, `var(--font-satoshi)`.
3. **Legacy imports** — no `@component/*`, `@template/*`, or `@styles/*` in any new file.
4. **Missing accessibility** — every interactive element needs `:focus-visible`, `aria-label` (if icon-only), and `aria-expanded` (if it toggles something).

---

# Part 2 — Architecture & API Reference

## 3. How the API Layer is Built

```
Component / Page
      ↓
Service File   (src/core/services/*.ts)
      ↓
HTTP Wrapper   (src/core/services/api.service.ts)
      ↓
Axios Interceptor  (auto-injects Bearer token from cookie)
      ↓
Backend REST API   (https://apistage.endlessdomains.io/api/v1)
      ↓
Error Handler  (error.service.ts — handles 401 refresh, redirects)
      ↓
Redux Dispatch (update global state)
      ↓
useSelector    (component reads updated state, re-renders)
```

Components never call `fetch` or `axios` directly. They always call a function from a service file. That service file uses helpers from `api.service.ts`. All tokens are auto-injected — you never manually attach headers in a component.

---

## 4. Base URL & Environment Variables

The full API base URL is built from three env vars:

```
BASE = {API_DOMAIN_URL}/{API}/{API_VERSION}
     = https://apistage.endlessdomains.io/api/v1
```

All critical env vars from `.env`:

| Variable | Purpose |
|---|---|
| `API_DOMAIN_URL` | Backend host (`https://apistage.endlessdomains.io`) |
| `API` | Path segment (`api`) |
| `API_VERSION` | Version segment (`v1`) |
| `RESELLER_ID` | Third-party reseller ID sent in some requests |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `ENCRYPT_SECRET_KEY` | Used to encrypt local data |
| `INFURA_ID` | Ethereum JSON-RPC provider |
| `STRIPE_KEY` | Stripe payment public key |
| `NETWORK_TYPE` | `Mainnet` or `Testnet` — controls blockchain network |
| `PINATA_IPFS_BEARER_TOKEN` | Auth for Pinata IPFS uploads |
| `WALLETCONNECT_PROJECT_ID` | Reown/WalletConnect config |
| `NEXT_PUBLIC_QUICK_RPC_NODE_URL` | Solana RPC endpoint |
| `NEXT_PUBLIC_USDC_TOKEN_ADDRESS` | USDC contract address |
| `NEXT_PUBLIC_BUILDER_API_KEY` | Builder.io public key |
| `RUNNING_ENV` | `DEV` or `PROD` |

In `next.config.js`, these are re-exported as `process.env.NEXT_PUBLIC_*` so they reach the browser. Never commit `.env.local` to git.

---

## 5. Cookie-Based Auth & Token Flow

The app uses JWT tokens stored in cookies, not localStorage.

### Cookie Keys

All cookie keys are hashed SHA256 strings. Use the `Cookie_Key` enum — never type the raw string:

```typescript
// src/core/enum/cookie.enum.ts
Cookie_Key.ACCESS_TOKEN        // Bearer token for all API calls
Cookie_Key.REFRESH_TOKEN       // Used to get a new access token
Cookie_Key.CART_ITEMS          // Cart state persistence
Cookie_Key.ORDER_ID            // Current active order
Cookie_Key.AFFILIATE_KEY       // Affiliate tracking
Cookie_Key.LOGIN_TYPE          // How user logged in (email/wallet/google)
Cookie_Key.INFLUENCER_KEY      // Influencer discount tracking
Cookie_Key.MODAL_TEMPLATE      // Parked domain modal template
Cookie_Key.SUBSCRIBER_MODAL    // Subscriber popup control
Cookie_Key.MANAGE_WALLET_ADDRESS // Active wallet for management
```

### Cookie Service

```typescript
import { setCookieValue, getCookieValue, deleteCookieAttribute, setCookieValueExpire } from '@/core/services/cookies.service'

getCookieValue(Cookie_Key.ACCESS_TOKEN)              // Read a cookie
setCookieValue(Cookie_Key.ACCESS_TOKEN, token)       // Write a cookie
deleteCookieAttribute(Cookie_Key.ACCESS_TOKEN)       // Delete a cookie
setCookieValueExpire(key, value, expiresAt)          // Set with expiry date
```

### Initial Session Check

When the app loads (`pages/_app.tsx`), it calls `getCheckSession()`. This hits the backend to check if there is a valid session and populates the access and refresh token cookies. After that, every axios request auto-injects the token.

```typescript
// Called in _app.tsx on mount
const session = await getCheckSession()
// Returns: { result: { access_token, refresh_token }, userId, email, isLoggedIn }
```

### Token Refresh

If an API call returns 401, `error.service.ts` automatically:
1. Calls `postRefreshToken()` using the refresh token cookie
2. Stores the new tokens in cookies
3. Retries the original request

If refresh fails, it clears all cookies and redirects to `/login`.

---

## 6. The HTTP Wrapper — api.service.ts

**Location**: `src/core/services/api.service.ts`

This is the only file that directly makes HTTP calls. All service files import from here.

### Core HTTP Functions

```typescript
// GET — authenticated (most common)
getApi(url: string, local?: boolean, cookie?: string): Promise<any>
// Example: getApi(`${CART_API}?limit=50`)

// POST — JSON body
postApi(url: string, formData: object, header?: object, type?: 'json' | 'form'): Promise<any>
// Example: postApi(CHECKOUT_API, { cartIds, paymentMethod })

// POST — typed response via Axios
postApiCall<T>(url: string, formData: object, header?: object): Promise<AxiosResponse<T>>

// PUT — update existing resource
putApi(url: string, formData: object, header?: object): Promise<any>
putApiCall(url: string, formData: object, header?: object): Promise<any>

// DELETE — by ID
deleteApi(url: string, id?: string, header?: object): Promise<any>
// Example: deleteApi(CART_API, cartItemId)

// DELETE — with body (bulk operations)
deleteBulkApi(url: string, formData?: object, header?: object): Promise<any>

// GET — no auth token (public endpoints)
getApiUnAuth(url: string): Promise<any>
```

### Session & Auth Functions

```typescript
getCheckSession(): Promise<ReturnSessionDto>     // Validate session on app load
postRefreshToken(): Promise<any>                 // Refresh JWT tokens
logoutUserApi(url): Promise<any>                 // Logout with credentials
postRedirect(redirectDto): Promise<any>          // Auth redirect flow
```

### Static Content Functions

```typescript
getStaticContent(url, contentKey): Promise<any>  // Fetch CMS static pages
getTldsContent(url, tld): Promise<any>           // Fetch TLD-specific content
getCryptoAddress(url, domainName): Promise<any>  // UD crypto address lookup
CheckCouponType(url, couponName): Promise<any>   // Validate coupon type
```

### Events Functions

```typescript
getAllEventsList(params?: {
  page?, limit?, search?, location?,
  status?, dateFrom?, dateTo?, type?
}): Promise<{ success, data, pagination, message }>

getEventHighlights(): Promise<{ success, images }>
getcommunityEvents(): Promise<{ success, data }>
```

### Analytics Functions

```typescript
fetchUserDomainPieChart(filters: {
  startDate?, endDate?, orderStatus?, monthsFilter?
}): Promise<any>

fetchUserDomainAnalytics(filters: {
  search?, tlds?, blockchains?, expiredStatus?,
  evmType?, listedDomains?, renewalType?
}): Promise<any>

getUserStats(userId: string): Promise<any>
getUserNFTs(walletAddress: string, chain?, page?, limit?): Promise<{ success, data, error? }>
```

### IPFS / GigaPub Functions

```typescript
createGigapubProject(domainName: string): Promise<number>  // Returns projectId
```

### Freename DNS Functions

```typescript
fetchDomainRecords(orderId: string): Promise<any>
createDomainRecord(domainId: string, recordId: string, form: { type, name, value, ttl }): Promise<any>
updateDomainRecord(recordUuid: string, form: { name, value, ttl }): Promise<any>
fetchDomainTokens(zoneUuid: string): Promise<any>
createDomainTokens(zoneUuid: string, tokens: any[]): Promise<any>
```

---

## 7. Every Service File & Its Functions

### auth.service.ts
`src/core/services/auth.service.ts`

| Function | Method | Endpoint | What it does |
|---|---|---|---|
| `sendRecoveryEmail(email)` | POST | `/auth/forgot-password` | Sends password reset email |
| `resetPassword(password, token)` | POST | `/auth/reset-password` | Resets password using token from email |
| `changePassword(oldPwd, newPwd)` | PUT | `/auth/change-password` | Change password while logged in |
| `updatePassword(oldPwd, newPwd)` | PUT | `/auth/change-password` | Alias for `changePassword` |
| `logoutUser()` | GET | `/auth/logout` | Logs out and clears all auth cookies |
| `logoutCookies()` | GET | `/auth/logout-cookies` | Clears httpOnly cookies server-side |

---

### cart.service.ts
`src/core/services/cart.service.ts`

| Function | Method | Endpoint | What it does |
|---|---|---|---|
| `getCart()` | GET | `/cart?limit=50` | Fetches all cart items |
| `checkoutCart(formData)` | POST | `/domain/order` | Places the order / checkout |
| `getOrder(status?, limit?, page?, cookies?)` | GET | `/domain/order` | Fetch user orders with filters |
| `deleteOrder(orderId)` | DELETE | `/domain/order/{orderId}` | Cancel an order |
| `syncCart(formData)` | POST | `/cart/sync` | Sync cart state with backend |
| `updateCart(cartItem)` | PUT | `/cart` | Update a cart item (e.g. years) |
| `bulkUpdateCartYear(payload)` | PUT | `/cart/bulkUpdate` | Update years for multiple cart items |
| `deleteCartItemsBulk(cartIds)` | DELETE | `/cart` | Remove multiple cart items |
| `verifyCheckoutDomains()` | GET | `/cart/verify-checkout` | Validate domains before paying |
| `getServiceFee(formData)` | POST | `/domain/order/estimate-txn-fee` | Estimate blockchain transaction fee |
| `postRequestToRegisterAPI(formData)` | POST | `/domain/order/request-register` | ENS — request registration |
| `postRegister(formData)` | POST | `/domain/order/register` | ENS — complete registration |
| `getEnsHash(orderId)` | GET | `/domain/order/transaction-hash-secret/{orderId}` | Get ENS tx hash |
| `getEnsDomainDetails(orderId)` | GET | `/domain/order/domain-order-wth-details/{orderId}` | Full order details |
| `validateCouponCode(cartIds, code)` | POST | `/coupon/validate?couponCode=code` | Validate promo code |
| `getInfluencerCoupon(influencerId, cartIds)` | POST | `/coupon/influencer-coupon?influencerId=id` | Get influencer discount |
| `getEventDomains(eventName)` | GET | `/custom-domain?event=eventName` | Domains for a specific event |
| `cryptomusPayment(formData)` | POST | `/cryptomus-integration/create` | Create Cryptomus crypto invoice |
| `coingatPayment(formData)` | POST | `/coingate-integration/coingateInvoice` | Create Coingate invoice |

---

### profile.service.ts
`src/core/services/profile.service.ts`

| Function | Method | Endpoint | What it does |
|---|---|---|---|
| `getUserDetail()` | GET | `/users/user-multiple-wallet` | Full profile with all linked wallets |
| `updateProfile(formData)` | PUT | `/users` | Update name, email, phone, etc. |
| `verifyEmail(email)` | POST | `/email-verification/send` | Send verification email (pre-login) |
| `verifyEmailPostLogin(email)` | POST | `/auth/verification-email` | Send verification email (post-login) |

---

### wallet.service.ts
`src/core/services/wallet.service.ts`

| Function | Method | Endpoint | What it does |
|---|---|---|---|
| `getNonce(url, address)` | GET | `/web3-auth/generate-nonce` | Get nonce for wallet signature |
| `connectWallet({postSignatureApi, address, signature, network, source})` | POST | `/web3-auth/authenticate` | Auth with EVM wallet signature |
| `solanaConnectWallet({postSignatureApi, address, network})` | POST | `/web3-auth/solana-authenticate` | Auth with Solana wallet |
| `getSolanNonce(url, address, network, userId?)` | POST | `/web3-auth/solana-add-wallet` | Nonce for adding Solana wallet |
| `signupSolanNonce(url, address)` | GET | nonce endpoint | Solana signup nonce |

---

### liked-domain.ts
`src/core/services/liked-domain.ts`

| Function | Method | Endpoint | What it does |
|---|---|---|---|
| `getFavDomains()` | GET | `/domain/favorite` | Fetch all favorited domains |
| `addFavDomain(formData)` | POST | `/domain/favorite` | Add domain to favorites |
| `removeFavDomain(domId)` | DELETE | `/domain/favorite/{domId}` | Remove one favorite |
| `removeBulkFavDomain(formData)` | DELETE | `/domain/favorite` | Remove multiple favorites |

---

### home.service.ts
`src/core/services/home.service.ts`

| Function | Method | Endpoint | What it does |
|---|---|---|---|
| `getFAQS()` | GET | `/landing-page/faqs` | Landing page FAQ list |
| `getSimpleSteps()` | GET | `/landing-page/simple_steps` | "How it works" steps |
| `getTestimonials()` | GET | `/landing-page/testimonials` | User testimonials |
| `getCountAnalytics()` | GET | `/landing-page/count-analytics` | Stats (domains registered, users, etc.) |

---

### ipfs.service.ts
`src/core/services/ipfs.service.ts`

| Function | Method | Endpoint | What it does |
|---|---|---|---|
| `getIpfsMetadata(domainName)` | GET | `/ipfs/{domainName}` | Get IPFS content for a domain |
| `uploadIpfsContent(domainName, formData, gigapubProjectId)` | POST | `/ipfs/store/{domainName}/{gigapubProjectId}` | Upload HTML/content to IPFS |
| `updateIpfsLinkStatus(domainName)` | GET | `/ipfs/set_on_chain/{domainName}` | Push IPFS hash on-chain |
| `deleteIpfsContent(domainName)` | DELETE | `/ipfs/{domainName}` | Remove IPFS content |
| `checkDomainIpfsStatus(domainName)` | GET | `/ipfs/{domainName}` | Returns `{ hasContent, ipfsHash, isOnChain, ... }` |
| `uploadAndGetDetails(domainName, formData, gigapubProjectId)` | POST | `/ipfs/store/...` | Upload and return full metadata |
| `getGigaPubScript(domainName)` | — | — | Generate embed script for GigaPub |

---

### affiliate.service.ts
`src/core/services/affiliate.service.ts`

| Function | Method | Endpoint | What it does |
|---|---|---|---|
| `getAffiliateSummary(key, start?, end?)` | GET | `/affiliate/dashboard/{key}` | Summary stats for one affiliate |
| `getAffiliateSummaryAll(start?, end?)` | GET | `/affiliate/dashboard/dash-summery/all/` | All affiliates summary |
| `getAffiliateChart(key, start?, end?)` | GET | `/affiliate/dashboard/chart/{key}` | Chart data for one affiliate |
| `getAffiliateChartAll(start?, end?)` | GET | `/affiliate/dashboard/chart-data/data-all/` | Chart data for all affiliates |
| `getAffiliateActivity(key, page, limit, ...)` | GET | `/affiliate/dashboard/activities/{key}` | Paginated activity log |
| `getAffiliateKeys()` | GET | `/affiliate/dashboard/user/links` | User's affiliate referral links |
| `generateAffiliateReport(key)` | POST | `/activity/generate-affiliate-for-single` | Generate downloadable report |
| `generateAffiliateKey(userId, keyName, desc)` | POST | affiliate key endpoint | Create new affiliate key |
| `registerAffiliate(payload)` | POST | register affiliate endpoint | Sign up as affiliate |
| `requestPayout(payload)` | POST | payout endpoint | Request affiliate payout |
| `getAffiliateUserByUserId()` | GET | user affiliate endpoint | Current user's affiliate record |
| `getAffiliatePayoutRequests()` | GET | payout history endpoint | User's payout history |
| `getAffilaitTransactions()` | GET | transactions endpoint | User's transaction list |

Note: `fetchUserDomainPieChart` and `fetchUserDomainAnalytics` also exist in `affiliate.service.ts` as copies. Prefer importing from `api.service.ts` in new code.

---

### error.service.ts
`src/core/services/error.service.ts`

You do not call this directly. It runs as an axios response interceptor and handles:
- **401** — calls `postRefreshToken()`, retries the original request; redirects to `/login` on second failure
- **400** — checks for unverified email; shows the unverified login modal via Redux
- **All other errors** — surfaces the error message to the calling service function

---

### cookies.service.ts
`src/core/services/cookies.service.ts`

Pure cookie management — no API calls. Used everywhere for reading/writing tokens. Functions: `setCookieValue`, `getCookieValue`, `deleteCookieAttribute`, `getAllCookies`, `setCookieValueExpire`.

---

## 8. All API Endpoints Reference

All constants live in `src/core/enum/api-endpoint.enum.ts`. The base URL is prepended by `api.service.ts`.

### Auth

| Constant | Path |
|---|---|
| `LOGIN_API` | `/auth/login` |
| `GOOGLE_AUTH_API` | `/google-auth` |
| `REGISTER_API` | `/auth/register` |
| `REFRESH_TOKEN_API` | `/auth/refresh-token` |
| `FORGOT_PASSWORD_API` | `/auth/forgot-password` |
| `RESET_PASSWORD_API` | `/auth/reset-password` |
| `CHANGE_PASSWORD_API` | `/auth/change-password` |
| `LOGOUT_API` | `/auth/logout` |
| `LOGOUT_COOKIES_API` | `/auth/logout-cookies` |
| `VERIFICATION_EMAIL_API` | `/auth/verification-email` |
| `EMAIL_VERIFICATION_API` | `/email-verification/send` |

### Web3 / Wallet

| Constant | Path |
|---|---|
| `WEB3_AUTH_NONCE` | `/web3-auth/generate-nonce` |
| `WEB3_AUTH_VERIFY` | `/web3-auth/verify` |
| `WEB3_AUTH_API` | `/web3-auth/authenticate` |
| `WEB3_AUTH_LOGIN_API` | `/web3-auth/login` |
| `SOLANA_AUTH_API` | `/web3-auth/solana-authenticate` |
| `SOLANA_ADD_WALLET_API` | `/web3-auth/solana-add-wallet` |
| `CHECK_SOLANA_WALLET` | `/web3-auth/check-solana-wallet-existence` |
| `SOLANA_LOGIN_API` | `/web3-auth/solana-login` |
| `WEB3_REFRESH_TOKEN_API` | `/web3-auth/refresh-token` |

### Domain Search & Details

| Constant | Path |
|---|---|
| `CHECK_AVAILABILITY_URL` | `/domain/search/availability` |
| `SUGGESTION_URL` | `/domain/search/suggestion` |
| `OWNER_EXPIRY_URL` | `/domain/search/owner-expiry` |
| `DOMAIN_LIST_API` | `/domain/detail` |
| `MY_DOMAINS_TLD_LIST` | `/domain/detail/available-tlds` |
| `USER_NFTS_API` | `/domain/detail/user-nfts/{walletAddress}` |
| `REFRESH_MY_DOMAINS` | `/domain/detail/refresh_domain` |
| `USER_DOMAIN_ANALYTIC_API` | `/domain/detail/user-analytic` |
| `USER_DOMAIN_PIE_CHART` | `/domain/order/pie-chart-data` |
| `FAVOURITE_API` | `/domain/favorite` |

### Cart & Orders

| Constant | Path |
|---|---|
| `CART_API` | `/cart` |
| `CART_SYNC_API` | `/cart/sync` |
| `BULK_YEAR_CART_UPDATE` | `/cart/bulkUpdate` |
| `VERIFY_CHECKOUT_DOMAIN` | `/cart/verify-checkout` |
| `CHECKOUT_API` | `/domain/order` |
| `COMPLETE_ORDER_API` | `/domain/order/complete` |
| `ORDER_DETAILS_API` | `/domain/order/domain-order-wth-details` |
| `SOLANA_ORDER_STATUS` | `/domain/order/solana-order-status` |
| `REQUEST_REGISTER_API` | `/domain/order/request-register` |
| `REGISTER_API_ENS` | `/domain/order/register` |
| `ENS_TX_HASH` | `/domain/order/transaction-hash-secret/{orderId}` |
| `GET_TXN_FEE` | `/domain/order/estimate-txn-fee` |

### User & Profile

| Constant | Path |
|---|---|
| `USER_API` | `/users` |
| `USER_API_MULTIPLE_WALLET` | `/users/user-multiple-wallet` |

### Coupons & Promotions

| Constant | Path |
|---|---|
| `VALIDATE_PROMO_CODE` | `/coupon/validate` |
| `FETCH_COUPON` | `/coupon/fetch-coupon` |
| `FETCH_COUPON_TYPE` | `/coupon/fetch-coupon-type` |
| `INFLUENCER_COUPON` | `/coupon/influencer-coupon` |

### IPFS & Parked Domains

| Constant | Path |
|---|---|
| `IPFS_GET_METADATA` | `/ipfs/` |
| `IPFS_UPLOAD` | `/ipfs/store/` |
| `IPFS_UPDATE_LINK_STATUS` | `/ipfs/set_on_chain/` |
| `GIGAPUB_PROJECT_CREATE` | `/ipfs/management/gigapub/project/create` |
| `GIGAPUB_ID_UPDATE` | `/ipfs/gigapub_id_update` |

### Payments

| Constant | Path |
|---|---|
| `CRYPTOMUS_INVOICE` | `/cryptomus-integration/create` |
| `COINGET_INVOICE` | `/coingate-integration/coingateInvoice` |

### Landing Page Content

| Constant | Path |
|---|---|
| `FAQS` | `/landing-page/faqs` |
| `SIMPLE_STEPS` | `/landing-page/simple_steps` |
| `TESTIMONIALS` | `/landing-page/testimonials` |
| `COUNT_ANALYTICS` | `/landing-page/count-analytics` |

### Events

| Constant | Path |
|---|---|
| `EVENTS_API` | `/events` |
| `EVENT_HIGHLIGHTS` | `/events/get-highlights-events` |
| `COMMUNITY_EVENTS` | `/events/get-community-events` |

### AI Features

| Constant | Path |
|---|---|
| `AI_DOMAIN_ADVISOR` | `/ai/domain-advisor` |
| `AI_ADVISOR_HISTORY` | `/ai/domain-advisor/history` |
| `AI_ADVISOR_STREAM` | `/ai/domain-advisor/stream` |
| `AI_ADVISOR_STATUS` | `/ai/domain-advisor/status` |
| `AI_PARKED_DOMAINS` | `/ai/domain/parked-domains` |
| `AI_SUBSCRIBE_INTENT` | `/ai/domain-advisor/subscribe/intent` |
| `AI_SUBSCRIBE_ACTIVATE` | `/ai/domain-advisor/subscribe/activate` |

### Affiliate

| Constant | Path |
|---|---|
| `AFFILIATE_DASHBOARD` | `/affiliate/dashboard/` |
| `AFFILIATE_CHART` | `/affiliate/dashboard/chart/` |
| `AFFILIATE_ACTIVITIES` | `/affiliate/dashboard/activities/` |
| `AFFILIATE_USER_LINKS` | `/affiliate/dashboard/user/links` |

### Activity Logging

| Constant | Path |
|---|---|
| `ACTIVITY_EXISTS` | `/activity/activity-exists` |
| `LOG_ACTIVITY` | `/activity` |

### Freename DNS (direct URL strings — no enum constants)

| Description | Path |
|---|---|
| Get minted domain records | `/internal/freename/get-minted-single/{orderId}` |
| Create DNS record | `/internal/freename/domain/{domainId}/records/{recordId}` |
| Update DNS record | `/internal/freename/records/{recordUuid}` |
| Get zone tokens | `/internal/freename/domain/tokens/{zoneUuid}` |
| Create zone tokens | `/internal/freename/domain/tokens/{zoneUuid}` |

### User Stats

| Description | Path |
|---|---|
| Per-user domain stats | `/domain/detail/user/user-stats/{userId}` |

---

## 9. Redux State Management

**Store location**: `src/core/redux/store.ts`
**Slices location**: `src/core/redux/slices/`

### How to Read State in a Component

```typescript
import { useSelector } from 'react-redux'
import { RootState } from '@/core/redux/store'

const cartItems = useSelector((state: RootState) => state.cart.cartInfo)
const userInfo = useSelector((state: RootState) => state.info)
const isLoading = useSelector((state: RootState) => state.universalReducer.isloading)
```

### How to Dispatch Actions

```typescript
import { useDispatch } from 'react-redux'
import { setCart } from '@/core/redux/slices/cart'
import { setInfo } from '@/core/redux/slices/info'

const dispatch = useDispatch()

const cart = await getCart()
dispatch(setCart(cart.data))
```

---

### Slice Reference

#### user — `src/core/redux/slices/user.ts`

```typescript
State: { token: string | null, init: boolean }
Actions:
  setUser(token: string)   // Call after login to store token
```

---

#### info — `src/core/redux/slices/info.ts`

Full user profile loaded from `/users/user-multiple-wallet`.

```typescript
State: {
  init: boolean
  name: string
  email: string
  phone: string
  walletAddress: Array<{ network: string, walletAddress: string, id?: string }>
  isAffiliateUser: boolean
}
Actions:
  setInfo(payload)   // Call after getUserDetail() resolves
```

---

#### cart — `src/core/redux/slices/cart.ts`

```typescript
State: {
  init: boolean
  cartInfo: DomainListItem[]
  disabled: boolean
  selectedCartItems: string[]
  promoCode?: string
  promoCodeDiscount?: number
  promoCodeError?: string
  promoPrsentageType?: boolean   // true = percentage, false = flat
  showCongratulation?: boolean
}
Actions:
  setCart(cartItems)
  disableCart(boolean)
  setCartSelected(selectedIds: string[])
  setPromoCode({ code, discount, error, type })
  setCongratulation(boolean)
```

---

#### fav — `src/core/redux/slices/fav-domain.ts`

```typescript
State: { init: boolean, favs: any[] }
Actions:
  setFavs(favoriteDomains)
```

---

#### universalReducer — `src/core/redux/slices/universalLoader.ts`

Global page-level loading spinner.

```typescript
State: { isloading: boolean }
Actions:
  loadingtrue()
  loadingfalse()
```

---

#### sync — `src/core/redux/slices/sync.ts`

Shows a cart sync error banner.

```typescript
State: { show: boolean, errorMessage: string, errorMessages: string[] }
Actions:
  setSync({ show, errorMessage, errorMessages })
```

---

#### parkedDomain — `src/core/redux/slices/parkedDomainSlice.ts`

Full state machine for the parked domain page builder.

```typescript
State: {
  currentStep: number
  template: 'individual' | 'influencer' | 'organization' | null
  headerInfo: IndividualHeaderInfo | OrganizationHeaderInfo | null
  socialLinks: SocialLink[]
  gigapubProjectId?: number | null
  aboutUs: { enabled: boolean, data: AboutUsData | null }
  whatWeDo: { enabled: boolean, cards: WhatWeDoCard[] }
  community: { enabled: boolean, entries: CommunityEntry[] }
  gaming: { enabled: boolean, entries: GamingEntry[] }
  nft: { enabled: boolean, entries: NFTEntry[] }
  isDirty: boolean
  lastSaved: string | null
}
Actions:
  setCurrentStep(number)
  setTemplate(template)
  updateHeaderInfo(data) / updateSocialLinks(links)
  updateAboutUs(data) / toggleAboutUs(boolean)
  addWhatWeDoCard(card) / updateWhatWeDoCard(card) / removeWhatWeDoCard(id) / toggleWhatWeDo(boolean)
  upsertCommunityEntry(entry) / removeCommunityEntry(platform) / toggleCommunity(boolean)
  upsertGameEntry(entry) / removeGameEntry(platform) / toggleGaming(boolean)
  setGigapubProjectId(id)
  markAsSaved() / resetState()
  toggleNFT(boolean) / upsertNFTEntry(nft) / removeNFTEntry(name) / setNFTEntries(nfts)
```

---

#### event, allevent, subscriber, banner — Popup/Modal slices

```typescript
// event (src/core/redux/slices/event.ts)
State: { hide: boolean }
Actions: hideEventPop() / resetEventPop()

// allevent (src/core/redux/slices/allevents.ts)
State: { events: any[], loading: boolean, initialized: boolean, error: string | null }
Actions: setEvents(events) / setEventLoading(boolean) / setEventError(message) / resetEvents()

// subscriber (src/core/redux/slices/subscriber.ts)
State: { hide: boolean }
Actions: hideSubscriberPop() / resetSubscriberPop()

// banner (src/core/redux/slices/banner.ts)
State: { hide: boolean }
Actions: hideBannerPop() / resetSubscriberPop()
```

---

#### cryptoCurrency — `src/core/redux/slices/crypto-currency.ts`

```typescript
State: { currencyList: Array<{ key: string, value: any[] }> }
Actions:
  setCurrency({ key, value })
  unsetCurrency({ key })
```

---

#### unverifiedlogin — `src/core/redux/slices/unverifiedlogin.ts`

```typescript
State: { show: boolean }
Actions: unverifiedlogin(boolean)
```

---

## 10. Data Models (TypeScript Interfaces)

All interfaces live in `src/core/model/`.

### User

```typescript
interface User {
  email: string
  id: string
  isEmailVerified: boolean
  isPhoneNumberVerified: boolean
  isRegisteredWithGoogle: boolean
  isRegisteredWithWallet: boolean
  name: string
  phoneNumber: string
  walletAddress: string
  sentEmailCount: number
  network?: string
}
```

### MultipleWalletUserType (returned by getUserDetail)

```typescript
interface Wallet {
  id: string
  walletAddress: string
  network: string
  userId: string
}

interface MultipleWalletUserType extends Omit<User, 'walletAddress'> {
  walletAddress: Wallet[]
  telegram?: string
}
```

### DomainListItem (cart items and domain results)

```typescript
interface DomainListItem {
  domainName: string
  price: number | null
  status?: DOMAIN_STATUS
  id?: string
  domainProvider?: string
  redirectUrl?: string
  img_url?: string
  network?: string
  available?: boolean
  noOfYears?: number
  tld?: string
  expiry?: string
  owner?: string
}
```

### Order

```typescript
interface Order {
  id: string
  orderNumber: string
  orderStatus: string
  orderState: number
  totalCost: number
  paymentClientId: string
  createdDateTime: string
  lastChangedDateTime: string
  domainDetailDtoList: DomainDetail[]
}

interface DomainDetail {
  domainName: string
  price: number
  blockchain: string
  ownerAddress: string | null
  node: string
  registryAddress: string | null
  resolver: string | null
  resolution: any
  domainMint: DomainMint[]
}

interface DomainMint {
  id: string
  domainProvider: string
  mintStatus: string
  transactionId: string | null
  blockchain: string
  blockchainExplorer: string | null
  isDeleted: boolean
  createdDateTime: string
  lastChangedDateTime: string
  mintingId: null
}
```

### DomainAvailability (search results)

```typescript
interface DomainAvailability {
  isTLDAvailable: boolean
  domainDetail: Domain
  domainAvailability: Availability
}

interface Availability {
  registered: boolean
  protected: boolean
  price: number
  availableForFree: boolean
  test: boolean
  expiry: string
  owner: string
}

interface Domain {
  domainName: string
  blockchain: string
  domainProvider: string
  freeToClaim: boolean
  id: number
  networkId: number
  node: string
  ownerAddress: string | null
  projectedBlockchain: string
  registryAddress: string
  resolution: Record<string, never>
  resolver?: null
  redirectUrl?: string
  img?: string
  network?: string
  tld?: string
}
```

### PaginationInfo

```typescript
interface PaginationInfo {
  count: number
  currentPage: number
  lastPage: number
  nextPage: number | null
  prevPage: number | null
}
```

### Home Content

```typescript
interface FaqsType {
  id: string
  question: string
  answer: string
  position: number
  isDeleted: boolean
}

interface SimpleStepsType {
  id: string
  title: string
  instruction: string
  position: number
  isDeleted: boolean
}

interface ReviewsType {
  id: string
  name: string
  role: string
  company_name: string
  testimonial: string
  img: string
  position: number
  isDeleted: boolean
}
```

### Event

```typescript
interface Event {
  id: number
  date: string
  time: string
  title: string
  description: string
  imageSrc: string
  routeTo: string
  expired: boolean
}
```

---

## 11. The Standard Data Flow Pattern

This is how every page fetches and displays real data. Follow this exactly.

### Pattern A — Load on Mount, Store in Redux

Use when multiple components need the same data (cart, user profile, favorites).

```typescript
import { useEffect, useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/core/redux/store'
import { setCart } from '@/core/redux/slices/cart'
import { getCart } from '@/core/services/cart.service'

export default function CartPage() {
  const dispatch = useDispatch()
  const cartItems = useSelector((state: RootState) => state.cart.cartInfo)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadCart = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getCart()
      dispatch(setCart(response.data))
    } catch (err: any) {
      setError(err.message || 'Failed to load cart')
    } finally {
      setLoading(false)
    }
  }, [dispatch])

  useEffect(() => {
    loadCart()
  }, [loadCart])
}
```

### Pattern B — Load on Mount, Store Locally

Use when only this page needs the data.

```typescript
const [faqs, setFaqs] = useState<FaqsType[]>([])
const [loading, setLoading] = useState(true)

useEffect(() => {
  getFAQS()
    .then(res => setFaqs(res.data))
    .catch(err => console.error(err))
    .finally(() => setLoading(false))
}, [])
```

### Pattern C — Action Triggered by User (POST/PUT/DELETE)

```typescript
const handleCheckout = useCallback(async () => {
  try {
    dispatch(disableCart(true))
    const response = await checkoutCart({ cartIds: selectedIds, paymentMethod: 'stripe' })
    router.push(`/payment/${response.data.orderId}`)
  } catch (err: any) {
    toast.error(err.message)
  } finally {
    dispatch(disableCart(false))
  }
}, [dispatch, selectedIds])
```

### Pattern D — Pagination

```typescript
const [page, setPage] = useState(1)
const [orders, setOrders] = useState([])
const [pagination, setPagination] = useState<PaginationInfo | null>(null)

const loadOrders = useCallback(async (pageNum: number) => {
  const res = await getOrder(undefined, 10, pageNum)
  setOrders(res.data)
  setPagination(res.pagination)
}, [])

useEffect(() => { loadOrders(page) }, [page, loadOrders])
```

---

## 12. Web3 / Wallet Integration

### EVM Wallets (Wagmi + Reown AppKit)

Config file: `src/config/wagmi.ts`

Supported networks: Ethereum mainnet, Arbitrum, Polygon, Base, BNB

```typescript
import { useAccount } from 'wagmi'
const { address, isConnected, chain } = useAccount()

import { useWeb3Modal } from '@web3modal/wagmi/react'
const { open } = useWeb3Modal()
open()  // Opens the connect wallet modal
```

**EVM wallet auth flow:**
1. User connects wallet (Wagmi handles UI)
2. Call `getNonce(WEB3_AUTH_NONCE, address)` — backend returns nonce string
3. User signs nonce with their wallet (ethers/viem)
4. Call `connectWallet({ postSignatureApi: WEB3_AUTH_API, address, signature, network, source })`
5. Backend returns `{ access_token, refresh_token }`
6. Store tokens: `setCookieValue(Cookie_Key.ACCESS_TOKEN, token)`
7. Dispatch: `dispatch(setUser(token))`

### Solana Wallets (wallet-adapter-react)

Adapters: Phantom, Solflare (configured in `_app.tsx`)

```typescript
import { useWallet } from '@solana/wallet-adapter-react'
const { publicKey, signMessage, connected } = useWallet()
```

**Solana auth flow:**
1. Call `getSolanNonce(url, address, network, userId?)` — get nonce
2. Sign nonce with `signMessage` from wallet-adapter
3. Call `solanaConnectWallet({ postSignatureApi, address, network })`

### Provider Manager (for manual Web3 operations)

```typescript
import { ProviderManager } from '@/lib/provider-manager'
const provider = ProviderManager.getWeb3Provider()   // ethers.providers.Web3Provider
```

---

## 13. Session & Auto-Logout Logic

**File**: `src/lib/AutoLogoutHandler.tsx` — mounted globally in `_app.tsx`

What it monitors:
- **Idle timeout** — 30 minutes of no mouse/keyboard activity
- **Token expiry** — checks JWT `exp` field, warns at 5 minutes before expiry
- **Multi-tab sync** — uses `localStorage` events to sync activity across browser tabs
- **Tab visibility** — detects when user switches away and back

What it does automatically:
- At 15 minutes idle — shows warning modal
- At 30 minutes idle — logs user out, clears all cookies, redirects to `/login`
- At 5 minutes before token expiry — prompts user to extend session; calls `postRefreshToken()` if confirmed
- If refresh fails — logs out immediately

You do not need to manage this. Just make sure you dispatch `setUser(null)` on logout and the handler coordinates the rest.

---

## 14. Real Integration Cheat Sheet

### Service Import Patterns

```typescript
// Auth
import { logoutUser, changePassword } from '@/core/services/auth.service'

// Cart
import { getCart, checkoutCart, updateCart, deleteCartItemsBulk, validateCouponCode } from '@/core/services/cart.service'

// Profile
import { getUserDetail, updateProfile } from '@/core/services/profile.service'

// Favorites
import { getFavDomains, addFavDomain, removeFavDomain } from '@/core/services/liked-domain'

// Home page content
import { getFAQS, getTestimonials, getCountAnalytics } from '@/core/services/home.service'

// IPFS / Parked domains
import { getIpfsMetadata, uploadIpfsContent } from '@/core/services/ipfs.service'

// Analytics, events, Freename DNS, user stats — all from api.service
import {
  fetchUserDomainPieChart, fetchUserDomainAnalytics,
  getUserStats, getUserNFTs,
  getAllEventsList, getEventHighlights, getcommunityEvents,
  fetchDomainRecords, createDomainRecord, updateDomainRecord,
  fetchDomainTokens, createDomainTokens,
  createGigapubProject
} from '@/core/services/api.service'

// Wallet auth
import { getNonce, connectWallet } from '@/core/services/wallet.service'

// Cookies
import { getCookieValue, setCookieValue, deleteCookieAttribute } from '@/core/services/cookies.service'
import { Cookie_Key } from '@/core/enum/cookie.enum'

// Endpoint constants
import { ApiEndpoint } from '@/core/enum/api-endpoint.enum'
```

### Redux Import Patterns

```typescript
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/core/redux/store'

import { setCart, disableCart, setCartSelected, setPromoCode } from '@/core/redux/slices/cart'
import { setInfo } from '@/core/redux/slices/info'
import { setUser } from '@/core/redux/slices/user'
import { setFavs } from '@/core/redux/slices/fav-domain'
import { loadingtrue, loadingfalse } from '@/core/redux/slices/universalLoader'
import { setSync } from '@/core/redux/slices/sync'
```

### "I need to..." Quick Lookup

| Task | What to call |
|---|---|
| Load cart on page mount | `getCart()` then `dispatch(setCart(res.data))` |
| Add item to cart | `syncCart(formData)` then reload cart |
| Remove cart items | `deleteCartItemsBulk(cartIds)` then reload cart |
| Checkout | `verifyCheckoutDomains()` then `checkoutCart(formData)` |
| Get logged-in user profile | `getUserDetail()` then `dispatch(setInfo(res.data))` |
| Update profile | `updateProfile(formData)` then reload user |
| Log user out | `logoutUser()` then `dispatch(setUser(null))` and redirect |
| Get user's orders | `getOrder(status, limit, page)` |
| Check domain availability | `getApiUnAuth(CHECK_AVAILABILITY_URL + '?domain=...')` |
| Add to favorites | `addFavDomain(formData)` then reload favs |
| Validate a promo code | `validateCouponCode(cartIds, code)` |
| Show global loading spinner | `dispatch(loadingtrue())` / `dispatch(loadingfalse())` |
| Read access token | `getCookieValue(Cookie_Key.ACCESS_TOKEN)` |
| Check if user is logged in | Check if `getCookieValue(Cookie_Key.ACCESS_TOKEN)` is truthy |
| Get landing page FAQs | `getFAQS()` |
| Fetch all events | `getAllEventsList(params)` |
| Connect EVM wallet | `getNonce` → sign → `connectWallet` → store cookies → dispatch |
| Upload content to IPFS | `createGigapubProject(domain)` → `uploadIpfsContent(domain, formData, projectId)` |
| Get domain pie chart data | `fetchUserDomainPieChart(filters)` from `api.service` |
| Get full domain analytics list | `fetchUserDomainAnalytics(filters)` from `api.service` |
| Get user summary stats | `getUserStats(userId)` from `api.service` |
| Get NFTs for a wallet | `getUserNFTs(walletAddress, chain?, page?, limit?)` from `api.service` |
| Read Freename DNS records | `fetchDomainRecords(orderId)` from `api.service` |
| Add Freename DNS record | `createDomainRecord(domainId, recordId, form)` from `api.service` |
| Update Freename DNS record | `updateDomainRecord(recordUuid, form)` from `api.service` |
| Read/write Freename zone tokens | `fetchDomainTokens(zoneUuid)` / `createDomainTokens(zoneUuid, tokens)` |

---

*Generated for the Endless Domains `new-design-ed` branch. Current API base: `https://apistage.endlessdomains.io/api/v1`. Last updated: 2026-06-06.*
