# Backend API & State Management Guide
### Endless Domains Web UI — Developer Reference

---

## Table of Contents

1. [How the API Layer is Built](#1-how-the-api-layer-is-built)
2. [Base URL & Environment Variables](#2-base-url--environment-variables)
3. [Cookie-Based Auth & Token Flow](#3-cookie-based-auth--token-flow)
4. [The HTTP Wrapper — api.service.ts](#4-the-http-wrapper--apiservicets)
5. [Every Service File & Its Functions](#5-every-service-file--its-functions)
6. [All API Endpoints Reference](#6-all-api-endpoints-reference)
7. [Redux State Management](#7-redux-state-management)
8. [Data Models (TypeScript Interfaces)](#8-data-models-typescript-interfaces)
9. [The Standard Data Flow Pattern](#9-the-standard-data-flow-pattern)
10. [Web3 / Wallet Integration](#10-web3--wallet-integration)
11. [Session & Auto-Logout Logic](#11-session--auto-logout-logic)
12. [Real Integration Cheat Sheet](#12-real-integration-cheat-sheet)

---

## 1. How the API Layer is Built

The project uses a **three-layer architecture** for all backend communication:

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

**Key rule**: Components never call `fetch` or `axios` directly. They always call a function from a service file. That service file uses helpers from `api.service.ts`. All tokens are auto-injected — you never manually attach headers in a component.

---

## 2. Base URL & Environment Variables

The full API base URL is built from three env vars:

```
BASE = {API_DOMAIN_URL}/{API}/{API_VERSION}
     = https://apistage.endlessdomains.io/api/v1
```

All critical env vars from `.env`:

| Variable | Value / Purpose |
|---|---|
| `API_DOMAIN_URL` | `https://apistage.endlessdomains.io` — backend host |
| `API` | `api` — path segment |
| `API_VERSION` | `v1` — version segment |
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

## 3. Cookie-Based Auth & Token Flow

The app uses **JWT tokens stored in cookies**, not localStorage. Here is how auth works end to end.

### Cookie Keys

All cookie keys are hashed SHA256 strings. Use the `Cookie_Key` enum — never type the raw string:

```typescript
// src/core/enum/cookie.enum.ts
Cookie_Key.ACCESS_TOKEN      // Bearer token for all API calls
Cookie_Key.REFRESH_TOKEN     // Used to get a new access token
Cookie_Key.CART_ITEMS        // Cart state persistence
Cookie_Key.ORDER_ID          // Current active order
Cookie_Key.AFFILIATE_KEY     // Affiliate tracking
Cookie_Key.LOGIN_TYPE        // How user logged in (email/wallet/google)
Cookie_Key.INFLUENCER_KEY    // Influencer discount tracking
```

### Cookie Service

```typescript
// src/core/services/cookies.service.ts
import { setCookieValue, getCookieValue, deleteCookieAttribute } from '@/core/services/cookies.service'

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

If refresh fails too, it clears all cookies and redirects to `/login`.

---

## 4. The HTTP Wrapper — api.service.ts

**Location**: `src/core/services/api.service.ts`

This is the only file that directly makes HTTP calls. All service files import from here.

### Core Functions

```typescript
// GET — authenticated (most common)
getApi(url: string, local?: boolean, cookie?: string): Promise<any>
// Example: getApi(`${CART_API}?limit=50`)

// POST — JSON body (most common)
postApi(url: string, formData: object, header?: object, type?: 'json' | 'form'): Promise<any>
// Example: postApi(CHECKOUT_API, { cartIds, paymentMethod })

// POST via Axios (typed response)
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

### Specialized Functions (also in api.service.ts)

```typescript
getCheckSession(): Promise<ReturnSessionDto>        // Validate session on app load
postRefreshToken(): Promise<any>                    // Refresh JWT tokens
logoutUserApi(url): Promise<any>                    // Logout with credentials
getStaticContent(url, contentKey): Promise<any>     // Fetch CMS static pages
getTldsContent(url, tld): Promise<any>              // Fetch TLD-specific content
getCryptoAddress(url, domainName): Promise<any>     // UD crypto address lookup
CheckCouponType(url, couponName): Promise<any>      // Validate coupon type
postRedirect(redirectDto): Promise<any>             // Auth redirect flow
```

---

## 5. Every Service File & Its Functions

### auth.service.ts
`src/core/services/auth.service.ts`

| Function | Method | Endpoint | What it does |
|---|---|---|---|
| `sendRecoveryEmail(email)` | POST | `/auth/forgot-password` | Sends password reset email |
| `resetPassword(password, token)` | POST | `/auth/reset-password` | Resets password using token from email |
| `changePassword(oldPwd, newPwd)` | PUT | `/auth/change-password` | Change password while logged in |
| `updatePassword(oldPwd, newPwd)` | PUT | `/auth/change-password` | Alias for changePassword |
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
| `checkDomainIpfsStatus(domainName)` | GET | `/ipfs/{domainName}` | Returns `{hasContent, ipfsHash, isOnChain, ...}` |
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

---

### cookies.service.ts
`src/core/services/cookies.service.ts`

Pure cookie management — no API calls. Used everywhere for reading/writing tokens.

---

## 6. All API Endpoints Reference

All constants live in `src/core/enum/api-endpoint.enum.ts`. The base URL is prepended by `api.service.ts`.

### Auth

| Constant | Path | Used In |
|---|---|---|
| `LOGIN_API` | `/auth/login` | Login page |
| `REGISTER_API` | `/auth/register` | Register page |
| `REFRESH_TOKEN_API` | `/auth/refresh-token` | error.service.ts auto-refresh |
| `FORGOT_PASSWORD_API` | `/auth/forgot-password` | auth.service |
| `RESET_PASSWORD_API` | `/auth/reset-password` | auth.service |
| `CHANGE_PASSWORD_API` | `/auth/change-password` | auth.service |
| `LOGOUT_API` | `/auth/logout` | auth.service |
| `LOGOUT_COOKIES_API` | `/auth/logout-cookies` | auth.service |
| `VERIFICATION_EMAIL_API` | `/auth/verification-email` | profile.service |
| `EMAIL_VERIFICATION_API` | `/email-verification/send` | profile.service |

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
| `PIE_CHART_DATA` | `/domain/order/pie-chart-data` |
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

---

## 7. Redux State Management

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

// After fetching from API:
const cart = await getCart()
dispatch(setCart(cart.data))
```

---

### Slice Reference

#### user — `src/core/redux/slices/user.ts`
Stores the logged-in user's access token.

```typescript
State shape: { token: string | null, init: boolean }

Actions:
  setUser(token: string)   // Call after login to store token
```

---

#### info — `src/core/redux/slices/info.ts`
Stores the full user profile loaded from `/users/user-multiple-wallet`.

```typescript
State shape: {
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
Manages the entire shopping cart state.

```typescript
State shape: {
  init: boolean
  cartInfo: DomainListItem[]         // The actual cart items
  disabled: boolean                  // Disables cart during checkout
  selectedCartItems: string[]        // IDs of items selected for checkout
  promoCode?: string
  promoCodeDiscount?: number
  promoCodeError?: string
  promoPrsentageType?: boolean       // true = percentage, false = flat
  showCongratulation?: boolean
}

Actions:
  setCart(cartItems)                          // Load cart from API response
  disableCart(boolean)                        // Lock cart during async ops
  setCartSelected(selectedIds: string[])      // Track checked items
  setPromoCode({ code, discount, error, type }) // Apply or clear promo
  setCongratulation(boolean)                  // Show success animation
```

---

#### fav — `src/core/redux/slices/fav-domain.ts`
Stores favorited domains.

```typescript
State shape: { init: boolean, favs: any[] }

Actions:
  setFavs(favoriteDomains)   // Call after getFavDomains() resolves
```

---

#### universalReducer — `src/core/redux/slices/universalLoader.ts`
Global page-level loading spinner.

```typescript
State shape: { isloading: boolean }

Actions:
  loadingtrue()    // Show full-page loader
  loadingfalse()   // Hide full-page loader
```

---

#### sync — `src/core/redux/slices/sync.ts`
Shows a cart sync error banner.

```typescript
State shape: {
  show: boolean
  errorMessage: string
  errorMessages: string[]
}

Actions:
  setSync({ show, errorMessage, errorMessages })
```

---

#### parkedDomain — `src/core/redux/slices/parkedDomainSlice.ts`
Full state machine for the parked domain page builder.

```typescript
State shape: {
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

Actions (select the ones relevant to your feature):
  setCurrentStep(number)
  setTemplate(template)
  updateHeaderInfo(data)
  updateSocialLinks(links)
  updateAboutUs(data) / toggleAboutUs(boolean)
  addWhatWeDoCard(card) / updateWhatWeDoCard(card) / removeWhatWeDoCard(id) / toggleWhatWeDo(boolean)
  upsertCommunityEntry(entry) / removeCommunityEntry(platform) / toggleCommunity(boolean)
  upsertGameEntry(entry) / removeGameEntry(platform) / toggleGaming(boolean)
  setGigapubProjectId(id)
  markAsSaved()
  toggleNFT(boolean) / upsertNFTEntry(nft) / removeNFTEntry(name) / setNFTEntries(nfts)
  resetState()
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
  setCurrency({ key, value })   // Add or update currency data
  unsetCurrency({ key })        // Remove a currency entry
```

---

#### unverifiedlogin — `src/core/redux/slices/unverifiedlogin.ts`

```typescript
State: { show: boolean }
Actions: unverifiedlogin(boolean)   // Show/hide unverified login modal
```

---

## 8. Data Models (TypeScript Interfaces)

All interfaces live in `src/core/model/`.

### User

```typescript
// src/core/model/User.type.ts
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
// src/core/model/MultipleWalletUserType.ts
interface Wallet {
  id: string
  walletAddress: string
  network: string
  userId: string
}

interface MultipleWalletUserType extends Omit<User, 'walletAddress'> {
  walletAddress: Wallet[]   // Array — one per connected wallet
}
```

### DomainListItem (cart items and domain results)

```typescript
// src/core/model/domain-list.type.ts
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
// src/core/model/order.type.ts
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
// src/core/model/domain-availability.type.ts
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
// src/core/model/pagination-info.type.ts
interface PaginationInfo {
  count: number
  currentPage: number
  lastPage: number
  nextPage: number | null
  prevPage: number | null
}
```

### Event

```typescript
// src/core/model/event.type.ts
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

### Home Content

```typescript
// src/core/model/home-type.type.ts
interface FaqsType { id: string, question: string, answer: string, position: number, isDeleted: boolean }
interface SimpleStepsType { id: string, title: string, instruction: string, position: number, isDeleted: boolean }
interface ReviewsType { id: string, name: string, role: string, company_name: string, testimonial: string, img: string, position: number, isDeleted: boolean }
```

---

## 9. The Standard Data Flow Pattern

This is how every page in the project fetches and displays real data. Follow this exactly.

### Pattern A — Load on Mount, Store in Redux

Use this when multiple components on the page (or across pages) need the same data.

```typescript
import { useEffect, useCallback } from 'react'
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

  // Now use cartItems directly — it comes from Redux
}
```

### Pattern B — Load on Mount, Store Locally

Use this when only this page needs the data and no other component cares.

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
    // handle response — route to payment, show success, etc.
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

// On page change: setPage(newPage) — triggers useEffect
```

---

## 10. Web3 / Wallet Integration

### EVM Wallets (Wagmi + Reown AppKit)

Config file: `src/config/wagmi.ts`

Supported networks: mainnet, arbitrum, polygon, base, goerli, sepolia, mumbai

```typescript
// Read connected wallet in a component
import { useAccount } from 'wagmi'
const { address, isConnected, chain } = useAccount()

// Trigger connect modal
import { useWeb3Modal } from '@web3modal/wagmi/react'
const { open } = useWeb3Modal()
open()
```

**Wallet auth flow:**
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

## 11. Session & Auto-Logout Logic

**File**: `src/lib/AutoLogoutHandler.tsx` — mounted globally in `_app.tsx`

### What it monitors:

- **Idle timeout**: 30 minutes of no mouse/keyboard activity
- **Token expiry**: Checks JWT `exp` field, warns at 5 minutes before expiry
- **Multi-tab sync**: Uses `localStorage` events to sync activity across browser tabs
- **Tab visibility**: Detects when user switches away and back

### What it does automatically:

- At 15 minutes idle: shows warning modal
- At 30 minutes idle: logs user out, clears all cookies, redirects to `/login`
- At 5 minutes before token expiry: prompts user — if confirmed, calls `postRefreshToken()` and stores new tokens
- If refresh fails: logs out immediately

You do not need to manage this — it is always running. Just make sure you dispatch `setUser(null)` on logout and the handler will coordinate the rest.

---

## 12. Real Integration Cheat Sheet

Use this as a quick lookup when you are wiring up any new page to real data.

### Import pattern for services

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

// Wallet auth
import { getNonce, connectWallet } from '@/core/services/wallet.service'

// Cookies
import { getCookieValue, setCookieValue, deleteCookieAttribute } from '@/core/services/cookies.service'
import { Cookie_Key } from '@/core/enum/cookie.enum'

// Endpoint constants
import { ApiEndpoint } from '@/core/enum/api-endpoint.enum'
```

### Import pattern for Redux

```typescript
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/core/redux/store'

// Slices
import { setCart, disableCart, setCartSelected, setPromoCode } from '@/core/redux/slices/cart'
import { setInfo } from '@/core/redux/slices/info'
import { setUser } from '@/core/redux/slices/user'
import { setFavs } from '@/core/redux/slices/fav-domain'
import { loadingtrue, loadingfalse } from '@/core/redux/slices/universalLoader'
import { setSync } from '@/core/redux/slices/sync'
```

### "I need to..." lookup table

| I need to... | Call this |
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

---

*Generated for the Endless Domains new-design-ed branch. Current API base: `https://apistage.endlessdomains.io/api/v1`*
