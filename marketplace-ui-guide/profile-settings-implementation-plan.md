# Profile and Settings Page: Implementation Plan

Figma: file `hq6HmB04UFUlFiJp9f9eGv` (marketplace akshat), section **"my profile and setting"** `128:14898`.
Branch: cut `profile-settings` from `marketplace-v2` (after `dark-mode` is merged, or from `dark-mode` if it isn't yet, because the page must be dark ready from day one).
Written 14 Oct 2026. Code comments cite this file as "profile plan §N.N".

> **Continuing work? Start at §14**: where we stopped on 14 Oct and the next steps. First job on 15 Oct is §14.1, restructuring the data layer to match My Domains and Watchlist. Until it's done, §6.3, §6.4 and §8.3 describe the old service layer.

---

## 1. Context

One page, **Profile And Settings**, replaces the two "Profile" and "Settings" placeholders in the sidebar's Account section with a single **My Profile** entry (Figma draws exactly one). The page has five tabs:

| Tab | What it does |
|---|---|
| **Profile** | Public profile: photo, full name, username, email, mobile, Telegram, bio, location, website; a live Public Preview; one Save changes button |
| **Security** | How you sign in (email and password, Google, wallet), Change password with a strength meter, Active sessions |
| **Wallets** | Connected wallets, Add another wallet, Default network, Hide domains from other wallets |
| **Notifications** | Five alert switches, and where alerts are sent (email, Telegram) |
| **Preferences** | Display (theme, currency, language, date format, time format) and Privacy (public portfolio, show sales history) |

A right rail on desktop and tablet shows **Account** (member since, domains owned, volume sold, completed sales) and **Your Data** (export my data, delete account). Figma's mobile frames leave the rail out.

### 1.1 Scope decision (updated 14 Oct): mock data now, built to be swapped out

**Decided:**
* The route is **`/profile`**.
* **Mock data** is used for now.
* A first visit **follows the device's theme**.

All the data goes through one **service layer** (§6.4). Every area of the page has a typed interface with two implementations, `mock` and `api`, and a single switch file picks which one each area uses. When a real endpoint ships, you write its `api` implementation and flip one line. When every area is real, delete the mock folder. Components and hooks never import mock data or the API directly, so neither step touches them.

Where a real endpoint already exists and works (profile GET, change password, resend verification, wallet linking), its `api` implementation is written straight away. Each area's switch still starts on `mock` until the team says otherwise (§13).

### 1.2 Dark mode from the first line

There is a **dark design for every frame** (§2.1). Every new primitive and composite uses the role tokens and follows `CLAUDE.md` §7: surfaces, text and borders from roles, `@include dark` only where a role can't express it, images swapped with CSS, and both themes checked at mobile, tablet and desktop before a phase is done. Unlike the existing pages, this one is built from **both** Figma designs, so where the dark frame changes more than colours (for example, the active tab is a white chip in dark), follow the dark frame.

---

## 2. Screen inventory

### 2.1 Frame map

| Tab | Light desktop | Light mobile | Dark desktop | Dark mobile |
|---|---|---|---|---|
| Profile | `128:14900` | `128:17333` | `128:18454` | `128:20925` |
| Security | `128:15429` | `128:17596` | `128:18991` | `128:21186` |
| Wallets | `128:15922` | `128:17825` | `128:19491` | `128:21413` |
| Notifications | `128:16414` | `128:18053` | `128:19990` | `128:21639` |
| Preferences | `128:16852` | `128:18232` | `128:20436` | `128:21816` |

Desktop frames are 1512 wide, mobile 390. Large frames return metadata only from `get_design_context`, so query their child nodes one card at a time.

### 2.2 Page chrome (every tab)

- The marketplace shell: header, sidebar, right rail. The sidebar's ACCOUNT section has one active row, **My Profile**.
- **Header card:** "Profile And Settings" and "Your public profile, how you sign in, and where we reach you."
- **Tab bar:** Profile, Security, Wallets (with a count badge, 3), Notifications, Preferences. Each has an icon. The active tab is a blue pill in light and a white chip in dark. On mobile the row scrolls horizontally.
- **Right rail (desktop and tablet only):**
  - **Account:** Member since (May 2024), Domains owned (28, View portfolio), Volume sold (28, View portfolio), Completed sales (31, drawn faded). Note: "Reputation and points live on the main Endless Domains site, not in the marketplace."
  - **Your Data:** Export my data, Delete account (red), each with a chevron. Note: "Deleting your account removes your profile and listings. Domains stay in your wallet, because we never hold them."

### 2.3 Profile tab

- **Profile Information:** "This is what buyers and sellers see on your public portfolio page."
  - **Profile photo:** "PNG or JPG, up to 2 MB. Square images look best." Upload and Remove buttons, with a camera badge on the avatar.
  - **Full name** and **Username** in two columns. Under the username: `endless.domains/u/johndoe` with a copy icon.
  - **Email address**, full width, with a **Verified** badge inside the field. Helper: "Used for order receipts, watchlist alerts and expiry reminders. Changing it sends a new verification link."
  - **Mobile number (optional):** a country flag select plus the number. Helper: "Only used for security notices. We never send marketing by SMS."
  - **Telegram (optional).** Helper: "Get watchlist and sale alerts in Telegram instead of email."
  - **Bio:** a textarea with a 77/160 counter.
  - **Location (optional)** with a pin icon, and **Website (optional)** with a globe icon.
- **Public Preview:** "Exactly what visitors see at your portfolio link." Shows the avatar, name with a verified tick, @username and bio, plus stats (Domains 28, Listed 9, Volume sold 4.25 ETH, Completed sales 31). Footnote: "Email, phone and Telegram are never shown publicly."
- **Save changes:** a primary button under the cards.

### 2.4 Security tab

- **How You Sign In:** "Any of these gets you into the same account." Three cards:
  - **Email and password** (Active), with **Change Password**.
  - **Google** (Connected), with **Disconnect** (red).
  - **Wallet** (Connected, `0xeF519A9D…b3e4ae5494`), with **Manage**.
  - Info note: "There is no KYC on this marketplace. We hold no keys and no funds, so signing in only unlocks your profile, listings and alerts, never your domains."
- **Change Password:** "Leave this alone if you sign in with Google or a wallet." Fields for the current password and the new password twice, each with a show/hide eye. A four segment strength meter ("Very Weak"). Helper: "Use at least 10 characters with a number or symbol." **Update Password** button.
- **Active Sessions:** "Signed in on these devices right now." Rows: Chrome on macOS (Bangalore, India, active now), Safari on iPhone (2 days ago, **Sign Out**). Then **Sign Out Everywhere Else** (red).

### 2.5 Wallets tab

- **Connected Wallets**, with **Add Another Wallet** at the top right: "Domains live in these wallets. Connecting one here lets us show them, never move them." Wallet cards each have Disconnect and copy. Info note: "Buying and selling runs on EVM chains today: Ethereum, Polygon, BNB Chain, Arbitrum and Base. Solana names are shown in your portfolio but cannot be listed or bought yet."
- **Default Network:** "Which chain we assume when you list or buy." Rows:
  - **Settlement network:** a chain select (Polygon), "You can still switch per listing."
  - **Hide domains from other wallets:** a switch, "Only show names held in the primary wallet above."

### 2.6 Notifications tab

- Five switch rows:
  - A domain I watch is sold
  - Price drops on my watchlist
  - My listing gets a buyer
  - A listing or domain is about to expire
  - Product news and market round ups
- **Where To Send Them:**
  - **Email** (`john.doe@example.com`), with a green **Primary** chip.
  - **Telegram:** "Not connected. Add a Telegram ID in your profile", with **Set up**.

### 2.7 Preferences tab

- **Display:**
  - **Theme:** a segmented control (System, Light, Dark), "Follows your device unless you pick one."
  - **Currency:** USD, "Prices settle in the listing token. This only changes the figure shown beside it."
  - **Language:** English, "Interface language."
  - **Date format:** 18 May 2025, "Used on receipts, listings and expiry dates."
  - **Time format:** 12 hour.
- **Privacy:**
  - **Public portfolio:** "Anyone with your link can see your listed and unlisted names."
  - **Show my sales history:** "Completed sales appear on your public profile."

### 2.8 Mobile (390)

- The header card and a tab row that scrolls horizontally.
- Cards go full width and two column fields stack.
- No right rail. The bottom nav shows, with **Account** active.

### 2.9 Figma quirks to flag in comments (do not silently fix)

1. **Wallets copies other tabs:** the Wallets frame (`128:15922`) repeats the Security tab's **Change Password** card, and its "wallet" cards show *Email and password* and *Google*. Build wallet cards from the wallet data, and leave Change Password on Security only. Confirm with the designer.
2. **Notifications subtitle:** "Where To Send Them" reuses the subtitle "Which chain we assume when you list or buy" (copied from Default Network). Proposed: "Where alerts reach you."
3. **"Websiter":** the Website label reads "Websiter" in light and dark. Use "Website".
4. **Password labels:** the fields read "Current password", "New password", "New password". The third one is the confirmation: "Confirm new password".
5. **Placeholder figures:** the stats use "4.25 ETH" while everything else on the marketplace is in USDT. Use the real token from the data.
6. **Faded rows:** the Completed sales row in the Account card is faded in light. Clarify whether that's a disabled or "coming soon" state.
7. **Sample photo:** the profile photo is a sample. Use the user's upload, or initials when there isn't one.
8. **Wallets count badge:** the tab badge says 3, but only 2 cards are drawn. Count real wallets.

---

## 3. What already exists to reuse

| Need | Existing piece |
|---|---|
| Page shell, header, sidebar, rail grid | `MainLayout`, `MarketplacePageShell` (as in `pages/watchlist`, `pages/seller-hub/my-domains`) |
| Login guard | Global: `ProtectedRoute` in `src/component/AppContent.tsx`. A new route is protected automatically unless it's added to `PUBLIC_ROUTES`. |
| Profile data | `useGetUserProfileQuery` (`src/core/redux/userProfile.ts`, GET `/users/user-multiple-wallet`). The result is `User` in `src/types/Profile.ts`. |
| Profile update | `useSetProfileMutation` (PUT `/users`, unused so far; accepted fields unknown, see §8) |
| Change password | `CHANGE_PASSWORD_API '/auth/change-password'` is in the enum, with no hook yet |
| Resend verification | `EMAIL_VERIFICATION_POST_LOGIN_API '/auth/verification-email'` is in the enum, with no hook yet |
| Wallet linking | Legacy flow in `src/component/wallet-connect/index.tsx`: `useAppKit().open` → `getNonce` → `signMessage(buildWalletSignMessage)` → `connectWallet(WALLET_AUTH_API, …)` |
| Theme | `src/context/ThemeContext.tsx` (`useTheme`, light/dark only today), `primitives/toggles/theme-toggle` |
| Cards and rows | `info-list-card` (rail), `glass-card`, `key-value-rows`, `notice-banner`, `info-note` |
| Buttons | `primary-button` (all variants), `secondary-button`, `default-buttons`, `pill-button` |
| Choice controls | `segmented-toggle` (theme), `checkbox`, `filter-dropdown` (styling reference for a form select) |
| Password field with an eye | `composites/auth/shared/AuthEmailFields` (lift its show/hide pattern) |
| Overlays and feedback | `primitives/modal` (confirm delete, sign out everywhere), `toast-message` (`ToastMessage(TOAST_TYPE.X, …)`), `tooltip` |
| Chain icons | `token-chain-icon`, `chain-badge` |
| Copy to clipboard | The pattern in ListingRow and Watchlist share |

**Missing:** a text field, textarea, phone field, form select, switch, settings row, strength meter and avatar uploader. These are new primitives in Phase 2.

---

## 4. Routing and navigation

- **Route:** `pages/profile/index.tsx`, URL `/profile`. The tab lives in the query string: `/profile?tab=security`. No `?tab=` means Profile, the same pattern as `domainOverviewHref(…, tab)`.
- **Helper:** add `PROFILE_HREF = '/profile'` and `profileHref(tab?: ProfileTab)` in `src/helpers/marketplace/routes.ts`.
- **Sidebar:** in `src/data/marketplace/navigation.ts`, replace the `profile` and `settings` placeholders with one item: `{ id: 'profile', label: 'My Profile', href: PROFILE_HREF, icon: FiUser }`.
- **Mobile bottom nav:** Account → `PROFILE_HREF`, no longer a placeholder.
- **Mobile drawer:** the same item, via the shared navigation data.
- **Right rail links:** "View portfolio" → `MY_DOMAINS_HREF` until a public portfolio page exists.
- **Tab state:** read `router.query.tab`, and validate it against the five ids. Change tabs with `router.replace({ query: { tab } }, undefined, { shallow: true, scroll: false })`, so the back button doesn't step through tabs and the page doesn't jump.

---

## 5. New components

### 5.1 New primitives (`src/design-system/primitives/`)

| Primitive | Folder | Notes |
|---|---|---|
| `TextField` | `inputs/text-field/` | Label, optional marker, helper and error text, leading icon, trailing slot (badge or action). `aria-describedby` / `aria-invalid`. |
| ~~`TextArea`~~ | folded into `TextField` | `multiline` mode: same label and helper API, with a live counter (`77/160`). Blocks typing past the max. (Changed in phase 2.) |
| `PhoneField` | `inputs/phone-field/` | A country select (flag plus dial code) and the number. Validates digits and length per country. No new dependency: a small country list in `src/data/`. |
| `PasswordField` | `inputs/password-field/` | A show/hide eye (lifted from AuthEmailFields), with an optional strength meter. |
| `PasswordStrength` | `inputs/password-field/` | Four segments plus a label (Very Weak … Strong). The rules live in `src/helpers/passwordStrength.ts` (pure, tested). |
| ~~`SelectField`~~ | `FilterDropdown variant="field"` | The form dropdown for currency, language, date and time format and the network: the existing FilterDropdown with an additive field variant (leading icon, option icons, keyboard). (Changed in phase 2: reuse instead of a new primitive.) |
| `Switch` | `toggles/switch/` | `role="switch"`, `aria-checked`, keyboard support. The Figma blue track in both themes. |
| `SettingsRow` | `cards/settings-row/` | Title, description, and a control on the right. Used by Notifications, Preferences, Default Network and Sessions. |
| `AvatarUpload` | `avatars/avatar-upload/` | Avatar with a camera badge, Upload and Remove. Accepts PNG or JPG up to 2 MB, with a local preview. Falls back to initials. |

### 5.2 New composites (`src/design-system/composites/profile/`)

| Composite | Contents |
|---|---|
| `shared/ProfileSettingsHeader` | Title and subtitle card |
| `shared/ProfileTabs` | Five icon tabs, the wallet count badge, horizontal scroll on mobile, the dark white chip |
| `shared/SettingsCard` | The section card: title, subtitle, divider, body (every tab's cards) |
| `rail/AccountSummaryCard` | The Account rail (on top of `InfoListCard`) |
| `rail/YourDataCard` | Export and Delete rows plus the note. Delete opens a confirm modal. |
| `profile/ProfileInformationForm` | All the profile fields and their validation |
| `profile/PublicPreviewCard` | Live preview of the draft, with stats |
| `security/SignInMethodCard` | One card per method (email, Google, wallet) |
| `security/ChangePasswordForm` | Three PasswordFields, the meter, Update Password |
| `security/ActiveSessionsList` | Session rows, Sign Out, Sign Out Everywhere Else |
| `wallets/ConnectedWalletCard` | Address, chain, primary flag, Disconnect, copy |
| `wallets/DefaultNetworkCard` | Settlement network select, hide other wallets switch |
| `notifications/NotificationSwitches` | The five switch rows |
| `notifications/NotificationChannels` | Email (Primary) and Telegram (Set up) |
| `preferences/DisplayPreferences` | Theme segmented control and the four selects |
| `preferences/PrivacyPreferences` | The two switches |
| `index.ts` | A curated barrel, like `marketplace/` and `my-domains/` |

### 5.3 Assets

Tab icons, sign-in method icons (mail, Google), the wallet icon, and the rail icons (calendar, user square, chart, badge, upload, trash), from the Figma nodes. Single colour icons become `currentColor` components (CLAUDE.md §7.4). The Google logo stays a multicolour SVG file.

---

## 6. Data model

### 6.1 View model: `src/types/profile-settings/index.ts`

(Not `src/types/profile`: the existing `src/types/Profile.ts` is the same path on case insensitive file systems.)

```ts
export type ProfileTab = 'profile' | 'security' | 'wallets' | 'notifications' | 'preferences'

export interface ProfileDetails {
  fullName: string
  username: string            // backend field missing (§8.2)
  email: string
  isEmailVerified: boolean
  phone: { countryCode: string; number: string } | null
  telegram: string            // '' = none
  bio: string                 // max 160
  location: string
  website: string
  avatarUrl: string | null
}

export interface AccountSummary {
  memberSince: string         // ISO
  domainsOwned: number
  volumeSold: { amount: number; token: string }
  completedSales: number
  listed: number
}

export type SignInMethod =
  | { kind: 'email'; email: string; active: boolean }
  | { kind: 'google'; email: string; connected: boolean }
  | { kind: 'wallet'; address: string; connected: boolean }

export interface ActiveSession { id: string; device: string; location: string; lastActive: string; current: boolean }

export interface ConnectedWallet { id: string; address: string; network: string; primary: boolean }

export interface WalletSettings { settlementChainId: string; hideOtherWallets: boolean }

export interface NotificationSettings {
  watchedDomainSold: boolean
  watchlistPriceDrop: boolean
  listingSold: boolean
  expiringSoon: boolean
  productNews: boolean
  channels: { email: boolean; telegram: boolean }
}

export interface DisplayPreferences {
  theme: 'system' | 'light' | 'dark'
  currency: 'USD'               // the only option until more exist
  language: 'en'
  dateFormat: 'D MMM YYYY' | 'DD/MM/YYYY' | 'MM/DD/YYYY'
  timeFormat: '12h' | '24h'
}

export interface PrivacyPreferences { publicPortfolio: boolean; showSalesHistory: boolean }
```

### 6.2 Mapper

`src/services/profile/api/mapUser.ts` maps the real `User` to `ProfileDetails`, `SignInMethod[]` and `ConnectedWallet[]`:
* `walletAddress[]` becomes the wallets.
* The `isRegisteredWithGoogle` and `isRegisteredWithWallet` flags become sign-in methods.
* `name` becomes `fullName`.

It lives with the `api` implementations because only they need it.

### 6.3 Hooks: `src/hooks/profile/`

| Hook | Service area (§6.4) | Real today? |
|---|---|---|
| `useProfileDetails()` | `details` | GET yes (name, email, phone, verified); PUT fields unknown; the rest mock |
| `useAccountSummary()` | `summary` | No |
| `useChangePassword()` | `security` | Yes: `CHANGE_PASSWORD_API` |
| `useResendVerification()` | `details` | Yes: `EMAIL_VERIFICATION_POST_LOGIN_API` |
| `useSignInMethods()` | `security` | Flags yes (from GET); disconnect no |
| `useActiveSessions()` | `sessions` | No |
| `useConnectedWallets()` | `wallets` | List yes (from GET), add yes (legacy linking flow); disconnect and primary no |
| `useWalletSettings()` | `wallets` | No |
| `useNotificationSettings()` | `notifications` | No |
| `usePrivacyPreferences()`, `useDisplayPreferences()` | `preferences` | No (theme always goes through ThemeContext) |
| `useYourData()` (export, delete) | `account` | No |

Every hook returns `{ data, isLoading, isError, save / update, isSaving }`. It gets its data only from `profileServices.<area>` (§6.4), never from RTK Query, `fetch` or a mock file directly. For areas whose `api` implementation uses RTK Query, the service's `api` implementation wraps the RTK hooks, so caching and invalidation still work.

### 6.4 Service layer: how mock data stays removable

```
src/services/profile/
  types.ts            one interface per area (ProfileDetailsService, SessionsService, …)
  config.ts           the ONE switch file: which implementation each area uses
  index.ts            exports `profileServices`, built from config.ts
  api/                real implementations, one file per area (+ mapUser.ts)
  mock/               mock implementations + fixtures, one file per area
    fixtures.ts       sample values, typed by the view model (§6.1)
    storage.ts        localStorage persistence so the demo remembers changes
```

**Contracts.** Each area's interface is async and shaped like the real API will be. Example:

```ts
export interface NotificationsService {
  get(): Promise<NotificationSettings>
  update(patch: Partial<NotificationSettings>): Promise<NotificationSettings>
}
```

Mock implementations behave like a server:
* a short delay (about 300ms), so loading states show;
* thrown errors with the same `{ message }` shape as the API, so error states can be tested;
* data persisted in localStorage under `mock:profile:<area>`.

**The switch file.**

```ts
// src/services/profile/config.ts
// Flip an area to 'api' when its endpoint ships (profile plan §8.2).
export const PROFILE_SOURCES = {
  details: 'mock', summary: 'mock', security: 'mock', sessions: 'mock',
  wallets: 'mock', notifications: 'mock', preferences: 'mock', account: 'mock',
} as const satisfies Record<ProfileArea, 'mock' | 'api'>
```

An area with no `api` implementation yet can't be set to `'api'`, which TypeScript enforces through the registry type. A visible **"Sample data"** chip shows on any card whose area is on `'mock'`, so testers and seniors don't take mock figures for real ones. It disappears on its own as areas switch.

**Replacing an area later (one endpoint ships):**
1. Add the RTK endpoint in `src/core/redux/`.
2. Write or finish `api/<area>.ts`, mapping the response to the view model.
3. Change the area's line in `config.ts` to `'api'`.
4. Run the type check. No hook or component changes.

**Removing mock data entirely (all areas real):**
1. Set every area to `'api'`.
2. Delete `src/services/profile/mock/`.
3. Remove the `'mock'` branch in `index.ts` and the `SampleDataChip`.

The type check then shows any leftover reference. Nothing outside `src/services/profile/` imports from `mock/`, so that's the full list. A lint rule (`no-restricted-imports` on `@/services/profile/mock/*` outside `src/services/profile/`) keeps it that way.

---

## 7. Page states and behaviour

- **Loading:** skeleton cards per tab. The rail has its own skeleton.
- **Error:** a NoticeBanner with Retry, per card, not for the whole page.
- **Saving:**
  - The Profile tab saves on **Save changes**. It's disabled until something changes, and shows "Saving…".
  - Switches save immediately (optimistic), with a toast on failure that rolls the switch back.
  - Selects save on change.
  - Password saves on **Update Password**.
- **Unsaved changes:** leaving the Profile tab, or the page, with unsaved edits asks for confirmation (a modal on tab change, `routeChangeStart` and `beforeunload` for the page).
- **Validation:** inline errors under fields, shown on blur and on submit.

| Field | Rule |
|---|---|
| Full name | 1 to 60 characters |
| Username | 3 to 30, lowercase letters, digits and `_`; availability check (backend) |
| Email | Valid format. A change re-sends verification (explain before saving). |
| Phone | Digits only, length per country |
| Telegram | `@handle`, 5 to 32 characters |
| Bio | Up to 160 |
| Website | `https://` URL |
| Avatar | PNG or JPG, 2 MB or less |
| Password | At least 10 characters with a number or symbol; confirmation must match; new must differ from current |

- **Destructive actions** (Delete account, Disconnect Google, Disconnect a wallet, Sign Out Everywhere Else) always confirm in a Modal. Delete account asks you to type your username.
- **Guardrails:** you can't disconnect your **last** sign-in method, and the primary wallet can't be disconnected while it's the only one.
- **Theme preference (decided 14 Oct):** **System is the default.**
  - A first visit, with nothing saved, follows the device (`prefers-color-scheme`), resolved by the init script before first paint so there's no flash.
  - While System is chosen, the theme follows live OS changes (`matchMedia(...).addEventListener('change', …)`).
  - Picking Light or Dark, here or with the header toggle, saves that choice and stops following the device until System is picked again.
  - This answers the dark mode team question about the default theme.

---

## 8. Real API: what exists and what's missing

### 8.1 Exists today

- `GET /users/user-multiple-wallet` → `User`: name, email, phoneNumber, isEmailVerified, isRegisteredWithGoogle, isRegisteredWithWallet, `walletAddress[]`.
- `PUT /users` (`useSetProfileMutation`). The accepted fields need confirming, probably name and phone.
- `POST /auth/change-password`: needs the request shape (current and new password?).
- `POST /auth/verification-email`: resend verification.
- The wallet linking flow (nonce, signature, `/web3-auth/authenticate`).

### 8.2 What the backend still needs to add (list for the backend team)

1. **Profile fields:** username (unique, with an availability check), bio, location, website, telegram, avatar upload (with an upload endpoint or a presigned URL).
2. **Account summary:** member since, domains owned, listed, volume sold (with token), completed sales.
3. **Sign-in methods:** disconnect Google, set a password for Google or wallet only accounts.
4. **Sessions:** list, sign out one, sign out all others.
5. **Wallets:** disconnect a wallet, set the primary wallet, settlement network, hide other wallets.
6. **Notifications:** get and set the five toggles and the channels (email, Telegram).
7. **Preferences:** get and set currency, language, date format, time format and theme (if it should follow the account across devices), plus the privacy toggles.
8. **Your data:** export (async job plus a download link or email) and delete account.

### 8.3 How the swap works

Through the service layer in §6.4. Ship an endpoint, write `api/<area>.ts`, and flip that area in `config.ts`. Hooks and components don't change. When the last area is real, delete `src/services/profile/mock/`.

| Area | §8.2 item it waits for |
|---|---|
| `details` | 1 (profile fields, avatar) |
| `summary` | 2 |
| `security` | 3 |
| `sessions` | 4 |
| `wallets` | 5 |
| `notifications` | 6 |
| `preferences` | 7 |
| `account` | 8 |

---

## 9. Out of scope / follow ups

- The public portfolio page itself (`endless.domains/u/<username>`). This page only previews it.
- Real multi-language support (Language shows English only and says more are coming).
- Currency conversion beyond USD.
- SMS verification of the phone number.

---

## 10. File level task list

```
pages/profile/index.tsx                       + profile.module.scss
src/helpers/marketplace/routes.ts             PROFILE_HREF, profileHref()
src/data/marketplace/navigation.ts            My Profile item; bottom nav Account
src/types/profile-settings/index.ts                    view model (§6.1)
src/services/profile/types.ts                 one interface per area (§6.4)
src/services/profile/config.ts                the switch file: 'mock' | 'api' per area
src/services/profile/index.ts                 profileServices registry
src/services/profile/api/*.ts                 real implementations + mapUser.ts
src/services/profile/mock/*.ts                mock implementations, fixtures, storage (deletable)
src/helpers/profile/validation.ts             field rules (§7)
src/helpers/passwordStrength.ts               strength score + label
src/data/countries.ts                         dial codes + flags (phone field)
src/hooks/profile/*.ts                        hooks (§6.3), only talk to profileServices
src/design-system/primitives/badges/sample-data-chip/   "Sample data" marker (removed with mocks)
src/core/redux/userProfile.ts                 changePassword, resendVerification mutations
.eslintrc / lint config                       no-restricted-imports for services/profile/mock
src/context/ThemeContext.tsx                  'system' preference (Phase 8)
src/design-system/primitives/...              §5.1
src/design-system/composites/profile/...      §5.2
public/assets/img/profile/...                 multicolour assets (Google logo)
```

---

## 11. Verification (every phase)

1. `npx tsc --noEmit -p .` is clean. `eslint` on changed files shows no new warnings. No `!important` (CLAUDE.md §4.3).
2. Every changed stylesheet compiles. No raw colours for surfaces, text or borders (CLAUDE.md §7.1).
3. Screenshots through the running dev server (**never** `next build` while it runs) at 390, 834, 1024 and 1440, in **light and dark**. Compare with the matching Figma frames from §2.1.
4. Keyboard: Tab order, visible focus, switches toggle with Space, selects with arrows and Enter, Escape closes dropdowns and modals.
5. Update `dev-docs/profile-settings-progress.html` (local only) with files, decisions, what was verified and what wasn't.

---

## 12. Build order and per phase prompts

Each phase is a separate, reviewable step that's safe to merge (the page is reachable but parts can show "coming soon"). Paste the prompt as is to start a phase. Every prompt assumes this plan is at `dev-docs/profile-settings-implementation-plan.md`.

| Phase | Scope |
|---|---|
| 0 | Backend alignment (no code) |
| 1 | Route, navigation, page shell, header card, tabs, rail slot, types, hooks scaffold |
| 2 | Form primitives |
| 3 | Profile tab |
| 4 | Right rail |
| 5 | Security tab |
| 6 | Wallets tab |
| 7 | Notifications tab |
| 8 | Preferences tab and the theme preference |
| 9 | Final QA, states, accessibility, polish |

### Phase 0: Backend alignment (no code)

```
Read dev-docs/profile-settings-implementation-plan.md, sections 8 and 13.
Turn §8.2 and the open questions in §13 into a short, plain message I can
send to the backend team and the designer: what endpoints and fields we need,
the exact request and response shapes we propose for each (TypeScript
interfaces matching §6.1), and the Figma quirks from §2.9 for the designer.
We use mock data first (§6.4), so frame it as "what to build, in which order"
rather than a blocker. Also check the real shape of PUT /users and POST /auth/change-password by
reading any backend docs or Swagger links in the repo, and list what you
found. No code changes.
```

### Phase 1: Foundations

```
Start profile settings phase 1 from dev-docs/profile-settings-implementation-plan.md
(§1, §2.1, §2.2, §2.8, §4, §6, §10). Follow CLAUDE.md, including §7 (dark mode).

Build:
1. The route pages/profile/index.tsx (+ profile.module.scss) using MainLayout and
   MarketplacePageShell like pages/watchlist, with the right rail slot (empty
   placeholder cards for now) and the mobile layout without the rail.
2. PROFILE_HREF and profileHref(tab) in src/helpers/marketplace/routes.ts.
3. Navigation: replace the Profile and Settings placeholders in
   src/data/marketplace/navigation.ts with one "My Profile" item → PROFILE_HREF;
   make the mobile bottom nav Account item link to it; check the drawer.
4. composites/profile/shared: ProfileSettingsHeader, ProfileTabs (five icon tabs,
   wallet count badge, horizontal scroll on mobile, active pill in light and white
   chip in dark per Figma 128:14900 / 128:18454 / 128:17333), SettingsCard.
   Tab state lives in ?tab= with router.replace shallow, validated (§4).
5. Types (§6.1) and the service layer exactly as §6.4 describes: types.ts
   (one interface per area), config.ts (every area on 'mock'), index.ts
   (profileServices registry typed so an area without an api implementation
   can't be switched to 'api'), mock/ (fixtures, a ~300ms delay, errors shaped
   like the API, localStorage persistence under mock:profile:<area>), api/
   with mapUser.ts and the profile GET implementation. Add the
   no-restricted-imports lint rule for services/profile/mock outside
   src/services/profile, and the SampleDataChip primitive.
6. Hook stubs (§6.3) that only call profileServices, so each tab can render a
   placeholder card with the Sample data chip.

Use get_design_context on the header card, tab bar and rail nodes inside the
frames in §2.1 (query children, the frames are too big). Verify per §11
(light and dark, 390 / 834 / 1024 / 1440) and screenshot through my dev server
on port 3002; never run next build. Don't commit.
```

### Phase 2: Form primitives

```
Start profile settings phase 2 from dev-docs/profile-settings-implementation-plan.md (§5.1, §7).
Follow CLAUDE.md including §4 and §7.

Build the primitives in §5.1: TextField, TextArea (with counter), PhoneField
(country select + number, small country list in src/data/countries.ts, no new
dependency), PasswordField (show/hide, lifted from AuthEmailFields) with
PasswordStrength (rules in src/helpers/passwordStrength.ts), SelectField
(reusing FilterDropdown's portal and positioning, form style trigger, leading
icon), Switch (role="switch", keyboard), SettingsRow and AvatarUpload (PNG/JPG
≤ 2 MB, local preview, initials fallback).

Take exact sizes, colours and states from the Figma nodes of the Profile,
Security and Preferences frames in §2.1, in light and dark. Every primitive:
role tokens only, label/helper/error wiring with aria-describedby and
aria-invalid, visible focus, disabled state, mobile sizes. Test the pure
helpers (password strength, phone validation) directly with node before the
UI. Add a temporary section on the profile page that renders every primitive in
every state so they can be screenshot in both themes, and remove it at the end
of the phase. Verify per §11. Don't commit.
```

### Phase 3: Profile tab

```
Start profile settings phase 3 from dev-docs/profile-settings-implementation-plan.md
(§2.3, §2.9, §6, §7, §8). Follow CLAUDE.md including §7.

Build the Profile tab: ProfileInformationForm (all fields from §2.3 with the
validation rules in §7, the username link with copy, the Verified badge, and
"Resend verification" when the email isn't verified, via a new RTK mutation on
EMAIL_VERIFICATION_POST_LOGIN_API) and PublicPreviewCard (live preview of the
unsaved draft, stats from useAccountSummary). Save changes: disabled until
dirty, sends the fields the real PUT /users accepts through useSetProfileMutation
and everything through useProfileDetails → profileServices.details (never the
API or mock directly), toast on success and failure, and an
unsaved changes guard (tab switch, route change, beforeunload).

Figma: light 128:14900, dark 128:18454, mobile 128:17333 / 128:20925; query the
Profile Information and Public Preview cards. Keep the §2.9 quirks as comments
(Website label, ETH figure, sample photo). Verify per §11, including validation
messages and keyboard flow. Don't commit.
```

### Phase 4: Right rail

```
Start profile settings phase 4 from dev-docs/profile-settings-implementation-plan.md
(§2.2 right rail, §6.3, §7). Follow CLAUDE.md including §5 (tablet rail) and §7.

Build AccountSummaryCard (on top of InfoListCard: member since, domains owned,
volume sold, completed sales, the reputation note, View portfolio links to
MY_DOMAINS_HREF) and YourDataCard (Export my data, Delete account in red, the
note), both through useAccountSummary / useYourData → profileServices. Export
shows a "we'll email you a download link" toast.
Delete opens a Modal that asks to type the username to confirm, then calls the
account service. On tablet, lay the two cards side by side like My Domains' rail; on mobile
leave the rail out (Figma mobile frames have none).

Figma: the rail nodes in 128:14900 (light) and 128:18454 (dark). Ask me about
§2.9 quirk 6 (faded Completed sales) before deciding its style. Verify per §11.
Don't commit.
```

### Phase 5: Security tab

```
Start profile settings phase 5 from dev-docs/profile-settings-implementation-plan.md
(§2.4, §7, §8). Follow CLAUDE.md including §7.

Build SignInMethodCard (email and password, Google, wallet with a shortened
address), the info note, ChangePasswordForm (current, new, confirm new with the
strength meter, the rules in §7, Update Password through a new RTK mutation on
CHANGE_PASSWORD_API; check its request shape first and ask me if unclear;
hide the form for accounts with no password and say why), and
ActiveSessionsList (through profileServices.sessions: current device marked
"active now" with no Sign Out;
Sign Out per other row; Sign Out Everywhere Else with a confirm Modal).
Disconnect Google and Manage wallet: Disconnect confirms in a Modal and refuses
when it's the last sign-in method; Manage switches to ?tab=wallets.

Figma: light 128:15429, dark 128:18991, mobile 128:17596 / 128:21186. Fix the
third password label to "Confirm new password" (§2.9 quirk 4) with a comment.
Verify per §11. Don't commit.
```

### Phase 6: Wallets tab

```
Start profile settings phase 6 from dev-docs/profile-settings-implementation-plan.md
(§2.5, §2.9 quirks 1 and 8, §6, §7). Follow CLAUDE.md including §7.

Build ConnectedWalletCard from the real User.walletAddress list (address
shortened, chain, primary badge, copy, Disconnect with a confirm Modal and the
last wallet guard), the EVM info note, Add Another Wallet (reuse the legacy
linking flow in src/component/wallet-connect: open AppKit, get the nonce, sign
buildWalletSignMessage, call connectWallet, then refetch the profile; wrap it in
a hook in src/hooks/profile/), and DefaultNetworkCard (settlement network
FilterDropdown (field variant) with chain icons from token-chain-icon, Hide domains from other
wallets Switch, through profileServices.wallets). The Wallets tab count badge
shows the real wallet count.

Do NOT copy the Change Password card or the email/Google cards from the Wallets
frame (§2.9 quirk 1); leave a comment pointing to the plan. Figma: light
128:15922, dark 128:19491, mobile 128:17825 / 128:21413. Verify per §11,
including the add wallet flow with a real wallet if I'm logged in, otherwise
report what couldn't be tested. Don't commit.
```

### Phase 7: Notifications tab

```
Start profile settings phase 7 from dev-docs/profile-settings-implementation-plan.md
(§2.6, §2.9 quirk 2, §6, §7). Follow CLAUDE.md including §7.

Build NotificationSwitches (the five SettingsRows with Switches; optimistic
save through useNotificationSettings with rollback and a toast on failure) and
NotificationChannels (Email row with the green Primary chip; Telegram row that
says "Not connected" with Set up linking to ?tab=profile and focusing the
Telegram field, or shows the handle and a Disconnect when set). Replace the
copied subtitle per §2.9 quirk 2 and comment it.

Figma: light 128:16414, dark 128:19990, mobile 128:18053 / 128:21639. Verify
per §11 (switch keyboard and screen reader labels too). Don't commit.
```

### Phase 8: Preferences tab and the theme preference

```
Start profile settings phase 8 from dev-docs/profile-settings-implementation-plan.md
(§2.7, §6, §7). Follow CLAUDE.md including §7.

1. Extend src/context/ThemeContext.tsx with a 'system' preference: store
   'system' | 'light' | 'dark' under the same localStorage key. System is the
   default (decided 14 Oct): update the init script in pages/_document.tsx so
   'system' and no saved value both resolve from prefers-color-scheme before
   first paint, and follow live OS changes with matchMedia while System is in
   effect. The header ThemeToggle still switches explicitly between light and
   dark and saves that choice (it stops following the device). Update
   CLAUDE.md §7 "How it works" (default is now the device theme) and the
   dark mode docs in dev-docs to match.
2. DisplayPreferences: Theme SegmentedToggle (System / Light / Dark) wired to
   ThemeContext; Currency (USD only), Language (English only, "more coming
   soon" helper), Date format and Time format selects (FilterDropdown field variant) saved through
   useDisplayPreferences → profileServices.preferences, and a small formatter helper the receipt and
   listing dates can adopt later (don't refactor other pages in this phase).
3. PrivacyPreferences: the two Switches through usePrivacyPreferences.

Figma: light 128:16852, dark 128:20436, mobile 128:18232 / 128:21816. Verify per
§11, plus: no theme flash on reload in all three modes, and 'system' follows an
emulated OS change in devtools. Don't commit.
```

### Phase 9: Final QA and polish

```
Start profile settings phase 9 from dev-docs/profile-settings-implementation-plan.md (§7, §11).

Go through all five tabs in light and dark at 390, 834, 1024 and 1440 against
every frame in §2.1, and fix mismatches (colours, spacing, states). Check:
loading skeletons, per card errors with Retry, saving states, toasts, the
unsaved changes guard, every confirm Modal, keyboard and focus order, screen
reader labels, and that the sidebar, drawer and bottom nav highlight My
Profile. Grep the new folders for raw colours and !important. Write the final
progress entry and list every area still set to 'mock' in
src/services/profile/config.ts with the backend item
from §8.2 it waits for. Don't commit.
```

---

## 13. Open questions (answers change the build)

**Answered 14 Oct:** Q1 route is `/profile` with `?tab=`; Q2 use mock data for now, built removable and replaceable (§6.4); Q7 a first visit follows the device theme (§7).

1. ~~**Route**~~ answered: `/profile`. Still open: does the public portfolio need its own URL soon (`/u/<username>`)?
2. ~~**Backend timing**~~ answered: mock first, with the "Sample data" chip on mock cards (§6.4). Still open: the order in which the backend delivers the §8.2 items.
3. **PUT /users:** which fields does it accept today?
4. **Username:** required? Can it change, and how often? Is it the portfolio URL?
5. **Avatar storage:** an upload endpoint or a presigned URL (S3)? Max size 2 MB is from Figma.
6. **Email change:** does the old email stay active until the new one is verified?
7. ~~**Theme default**~~ answered: yes, a first visit follows the device (System is the default).
8. **Save model:** OK that switches save instantly and the Profile form saves on Save changes (§7)?
9. **Figma quirks (§2.9):** confirm with the designer, especially the Wallets frame copy.
10. **Delete account:** soft delete with a grace period, or immediate? What happens to active listings (cancel on chain, or leave the orders)?
11. **Notifications:** do email alerts already exist on the backend for any of the five events?

---

## 14. Where we stopped (14 Oct, end of day) and what's next

**Status:** phases 1 to 9 are built and checked on branch `profile-settings`. **Nothing is committed.** Phase 0 (the backend and designer message) hasn't been done. Every area in `src/services/profile/config.ts` is still `'mock'`. The dev server on port 3002 stopped with the session; start it again before checking the page. Full file by file record: `dev-docs/profile-settings-progress.html`. Beginner explanation of the data layer: `dev-docs/profile-data-layer-guide.html`.

### 14.1 Decided: restructure the data layer to match My Domains and Watchlist (run on 15 Oct)

**How we got here (14 Oct).** The user asked why a new `src/services/` folder exists when the repo already has `src/core/services/`, then asked to check how My Domains and Watchlist are integrated and make this page match: "no extra duplicate folders, optimized". The first idea, moving the folder into `src/core/services/profile/`, is **dropped**. Comparing the pages showed the whole service layer is a pattern no other page uses. It should have been checked before phase 1; that was a miss.

**Decided (user, 14 Oct):** do the restructure tomorrow. **Keep every area on sample data** for now; switching areas to the real API is a separate later step.

#### How the other pages are built (checked 14 Oct)

| Concern | My Domains / Watchlist / domain overview | Profile page today (duplicates) |
|---|---|---|
| Real backend calls | Hooks call RTK Query hooks from `src/core/redux/*` directly (`useMyDomainsData` → `useGetMyDomainsOrdersQuery`) | A separate layer `src/services/profile/` (types, config, registry, `api/`, `mock/`) between hooks and Redux |
| Sample data | `src/data/<page>/` (`data/my-domains/domains.ts`, `data/marketplace/overview.ts`); shared, mutable mock state as a small store with `useSyncExternalStore` (`data/marketplace/watchlist.ts`, `useMockWatchlist`) | `src/services/profile/mock/` with `localStorage` persistence |
| Loading for sample data | The shared `useMockQuery` + `QueryResult` in `src/hooks/marketplace/domain-overview/queryResult.ts` (already reused by watchlist hooks) | My own `useProfileResource` / `useProfileAction` with a module cache |
| Going real | Replace the hook's mock body with the RTK query + a mapper, callers unchanged ("going real is a query plus a mapper here") | Flip a line in `config.ts` |
| Hooks | One file per hook (`hooks/my-domains/useMyDomainsData.ts`, `hooks/marketplace/watchlist/useWatchlistItems.ts`), no barrel | Twelve hooks in one `hooks/profile/index.ts` barrel |
| Mappers | `src/helpers/marketplace/watchlist.ts` or inside the hook | `src/services/profile/api/mapUser.ts` |
| Error text | `getUserFriendlyToastMessage(error, fallback)` from `src/helpers/error-messages` | My own `toServiceError`, `ProfileServiceError`, `messageOf` |
| Mock flag | `isMock` on the hook result (watchlist) | `isSample` |
| Lint guard | none | `no-restricted-imports` rule for the mock folder |

#### Target layout

```
src/
├── data/profile/
│   ├── fixtures.ts        ← from services/profile/mock/fixtures.ts (same values)
│   └── store.ts           ← shared mock state + update functions, useSyncExternalStore,
│                            modelled on data/marketplace/watchlist.ts (replaces mock/index.ts + runtime.ts)
├── helpers/profile/
│   ├── mapUser.ts         ← from services/profile/api/mapUser.ts (kept for going real)
│   └── validation.ts      ← from helpers/profileValidation.ts
├── hooks/profile/         ← one file per hook, no index.ts
│   ├── useProfileDetails.ts      (data + save + resend verification)
│   ├── useProfileDraft.ts        (unchanged logic, new imports)
│   ├── useAccountSummary.ts
│   ├── useSignInMethods.ts       (+ disconnect Google)
│   ├── useChangePassword.ts
│   ├── useActiveSessions.ts      (+ sign out, sign out others)
│   ├── useConnectedWallets.ts    (+ disconnect, set primary, useWalletCount)
│   ├── useWalletSettings.ts
│   ├── useNotificationSettings.ts
│   ├── useProfilePreferences.ts
│   └── useYourData.ts
└── types/profile-settings/index.ts   ← stays (a src/types/profile folder would clash with
                                        src/types/Profile.ts in imports on Windows)
```

`src/helpers/phone.ts`, `passwordStrength.ts`, `displayFormat.ts` and `src/data/countries.ts` stay where they are: primitives use them and they aren't profile specific.

#### Hook shape (every data hook)

* Returns `QueryResult<T>` from `hooks/marketplace/domain-overview/queryResult.ts` (`data`, `isLoading`, `isError`, `refetch`), plus `isMock: true` and its actions (`save`, `update`, `disconnect`…) with an `isSaving` flag, like `useWatchlistItems` returns `remove` / `restore` / `pendingId`.
* Mock body: `useMockQuery` for the first load (gives the loading state and skeletons), then the live value from the `data/profile/store.ts` snapshot via `useSyncExternalStore`, so two components on the same area agree (the Wallets tab badge and the wallet list). Mock actions update the store after a short delay and throw a plain `Error` for the test cases (`wrong-password`, last wallet, wrong username).
* A comment at the top of each hook names the real body, for example: `Real: useGetUserProfileQuery() mapped through mapUserToDetails; save via useSetProfileMutation (PUT /users: name, phoneNumber, email, telegram); resend via useResendVerificationEmailMutation. Waits for §8.2 item 1.`
* Mock state resets on a hard reload, like the watchlist preview (the `localStorage` persistence is dropped, matching the other pages).

#### Steps

1. Create `src/data/profile/fixtures.ts` and `store.ts` from the mock folder.
2. Create `src/helpers/profile/mapUser.ts` and `validation.ts` (move, update imports in `ProfileInformationForm`, `ProfileTabPanel`, `useProfileDraft`, `pages/profile/index.tsx`).
3. Split the hooks into one file each with the shape above; delete `hooks/profile/index.ts` and `useProfileResource.ts`.
4. Update the users of each hook (all inside `composites/profile`, checked 14 Oct):

   | Hook | Used by |
   |---|---|
   | `useProfileDetails` | NotificationsTabPanel, ProfileRail |
   | `useResendVerification` (fold into `useProfileDetails`) | ProfileTabPanel |
   | `useAccountSummary` | ProfileTabPanel, ProfileRail |
   | `useSignInMethods`, `useChangePassword`, `useActiveSessions` | SecurityTabPanel |
   | `useConnectedWallets`, `useWalletSettings` | WalletsTabPanel |
   | `useWalletCount` | `pages/profile/index.tsx` |
   | `useNotificationSettings` | NotificationsTabPanel |
   | `useProfilePreferences` | PreferencesTabPanel |
   | `useYourData` | ProfileRail |
   | `useProfileDraft` | ProfileTabPanel |

   Renames in those files: `reload` → `refetch`, `isSample` → `isMock`, `messageOf(error, …)` → `getUserFriendlyToastMessage(error, …)`. `QueryResult` has no `error` string, so error banners use their fixed fallback sentence ("Please try again.").
5. Delete `src/services/` entirely (the folder is new on this branch, so the top level `src/services/` disappears). Remove the `no-restricted-imports` block from `eslint.config.mjs` (no other page has one; `eslint.config.mjs` then matches `main` again).
6. Remove now unused types: `ProfileArea` in `types/profile-settings` if nothing else uses it.
7. Update comments that mention `src/services/profile` (`pages/profile/index.tsx`, `types/profile-settings/index.ts`, `ProfileTabPanel.tsx`, `SampleDataChip.tsx`).
8. Verify: `npx tsc --noEmit`, lint on changed files, `scsscheck.js` not needed (no styles change), grep that `services/profile`, `useProfileResource` and `isSample` are gone, then on the dev server click through all five tabs in light and dark: skeletons, every save, the `wrong-password` error, disconnect down to the last wallet (badge follows), delete account username check, Telegram set up and disconnect, unsaved changes guard.
9. Docs: rewrite `dev-docs/profile-data-layer-guide.html` for the new structure (it describes the old service layer), update the file tables in `profile-settings-progress.html` (new and removed files), §6.3, §6.4 and §8.3 of this plan, and the memory note.

Net effect expected: about 10 fewer files, no new top level folder, `eslint.config.mjs` back to unchanged, the page built the same way as its siblings. Behaviour on screen identical, except sample edits no longer survive a hard reload.

**Ready prompt:**

```
Restructure the profile page's data layer as described in
dev-docs/profile-settings-implementation-plan.md §14.1, to match how
My Domains and Watchlist are built: sample data in src/data/profile/,
one hook per file in src/hooks/profile/ on QueryResult and useMockQuery,
mappers and validation in src/helpers/profile/, errors through
getUserFriendlyToastMessage, delete src/services/ and useProfileResource,
remove the profile lint rule. Keep every area on sample data. Then run
the checks in step 8 and update the docs in step 9. Don't commit.
```

### 14.2 Why the page uses Redux (asked 14 Oct, recorded for reference)

Redux wasn't added by this work. The app already had it, and the profile endpoints were already written there, so they were reused.

* `src/core/redux/api.ts` sets up `myApi`, the app's RTK Query instance (RTK Query is the data fetching part of Redux Toolkit). It already attaches the login token from the cookie to every request, so the profile page didn't need its own auth handling.
* `src/core/redux/userProfile.ts` already had `getUserProfile` (the GET that reads the user) and `setProfile` (the PUT that saves it): the two calls the page needs most.
* It's the main way this app talks to the backend: 39 files import from `core/redux`, against 11 that use the older axios helpers in `core/services/api.service.ts`.

Reusing it bought three things:

1. **No duplicate profile request.** Other parts of the app (the wallet connect flow, the domain page) already load the user through `getUserProfile`; the profile page shares the same cached answer instead of asking the server again.
2. **Everyone stays up to date after a save.** `setProfile` marks the cached profile as out of date (the `profile` tag), so every screen showing the user reloads it by itself. A separate axios call would leave those screens showing the old name until a page reload.
3. **Consistency.** New endpoints live in the same place and style as the rest of the app.

Only two endpoints were added to Redux, next to the existing ones: `resendVerificationEmail` (POST `/auth/verification-email`, body `{ email }`) and `changePassword` (PUT `/auth/change-password`, body `{ oldPassword, newPassword }`).

The page's own state lives in React hooks, not the Redux store: loading, the per area cache, the form draft and the sample data. That's why the service layer sits on top: RTK Query only covers endpoints that exist, while the page also needs sample data for the missing ones and a way to swap between the two (§6.4).

### 14.3 Going real after the restructure (replaces the 14 Oct answer about the service layer)

The earlier answer here ("only `mock/` is deleted, the service folder stays") is **superseded by §14.1**: the service folder goes away tomorrow. After the restructure, an area goes real the same way as on My Domains and Watchlist:

1. Make sure the RTK Query endpoint exists in `src/core/redux/` (for profile details, change password and resend verification it already does: `useGetUserProfileQuery`, `useSetProfileMutation`, `useChangePasswordMutation`, `useResendVerificationEmailMutation`).
2. In that area's hook, replace the mock body with the RTK query, mapped through `src/helpers/profile/mapUser.ts`; the hook keeps the same return shape, so components don't change. Set `isMock` to false.
3. Show errors with `getUserFriendlyToastMessage`; change password still turns a 401 into "Your current password is incorrect." inside its hook.
4. When no hook uses `src/data/profile/` any more, delete that folder and the `SampleDataChip` primitive.

Real calls share the app wide RTK cache, so the profile page and the rest of the app (header, wallet connect) stay in sync after a save (§14.2).

### 14.4 Docs written on 14 Oct (local only, never commit `dev-docs`)

* `dev-docs/profile-settings-progress.html`: rewritten in full. Every phase, all 123 new files by folder, all 20 changed files with what changed, why and the effect on other pages, things removed along the way, decisions, Figma quirks, backend findings, the sample data table, verification. A broken leftover script at the top was removed and the theme toggle fixed. Not checked at phone width in a real browser (the headless screenshot at 390 looked cut off on the right; probably headless Chrome's minimum window width, not confirmed).
* `dev-docs/profile-data-layer-guide.html`: new. Beginner friendly explanation of types, contracts, mock data, the api folder, the switch, the hooks and the components, with real code snippets, a full journey of one switch flip, and recipes for switching an area to real data and deleting the mock data. Not checked at phone width either.

### 14.5 Next steps, in order

1. **Run §14.1** (restructure to match My Domains and Watchlist, all areas on sample data). Use its ready prompt. Start the dev server first.
2. **Look at the page yourself** on the dev server: `/profile`, all five tabs, light and dark, phone and desktop.
3. **Commit when ready** (only when asked): the 123 new files and 20 changed files on `profile-settings`, without `dev-docs`. Shared files changed: `CLAUDE.md`, `MarketplacePageShell`, `FilterDropdown`, `DefaultButton`, `InfoListCard`, `SegmentedToggle`, `ThemeContext`, navigation. A production build hasn't been run; the team should run one in CI.
4. **Phase 0:** send the backend team the §8.2 list (also in the progress file's sample data table) and the designer the §2.9 quirks, the missing flags and the missing tablet frames.
5. **Update §13:** Q3 is answered by the phase 5 backend check (PUT `/users` accepts name, phoneNumber, email and telegram); mark it.
