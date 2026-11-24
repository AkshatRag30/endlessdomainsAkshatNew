# Profile and Settings Page: Implementation Plan

Figma: file `hq6HmB04UFUlFiJp9f9eGv` (marketplace akshat), section **"my profile and setting"** `128:14898`.
Branch: cut `profile-settings` from `marketplace-v2` (after `dark-mode` is merged, or from `dark-mode` if it isn't yet, because the page must be dark ready from day one).
Written 14 Oct 2026. Code comments cite this file as "profile plan §N.N".

> **Continuing work? Start at §14.0** (what changed on 15 Oct), §14.5 (next steps) and §14.6 (the right rail check). On 15 Oct the page was restructured to match My Domains and Watchlist and wired to the main site's profile APIs; §1.1, §3, §6, §7, §8 and §10 were rewritten the same day to describe the code as it is now. The phase prompts in §12 are the original build history.

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

### 1.1 Scope decision (updated 15 Oct): real where the backend has it, sample data elsewhere

**Decided:**
* The route is **`/profile`**.
* A first visit **follows the device's theme**.
* **15 Oct:** the page uses the **same APIs as the main Endless Domains site's profile page** (`endlessdomainsMain/webui`, `pages/profile/user`) wherever they exist: profile details, save, email verification, change password, the wallet list and wallet linking. Everything the backend doesn't serve yet stays on **sample data**, marked with a "Sample data" chip (§8.3).
* **15 Oct, data layer:** built the same way as My Domains and Watchlist (§6.3): hooks in `src/hooks/profile/` call the RTK Query endpoints in `src/core/redux/` directly, and sample data lives in `src/data/profile/`. The separate `src/services/profile/` layer from 14 Oct was deleted (§14.0).
* **15 Oct, wallets (seniors):** one EVM and one Solana wallet per account. Add Another Wallet links whichever is missing and disappears once both are linked.

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
| Profile update | `useSetProfileMutation` (PUT `/users`; accepts name, email, phoneNumber, telegram, isVerified, all optional) |
| Change password | `useChangePasswordMutation` (PUT `/auth/change-password`), added in phase 5 next to the existing endpoints |
| Resend verification | `useResendVerificationEmailMutation` (POST `/auth/verification-email`), added in phase 3 |
| Wallet linking | `src/core/services/wallet.service.ts`: `getNonce`, `buildWalletSignMessage`, `connectWallet`; Reown AppKit with `wagmiAdapter` (`src/config/wagmi.ts`) and the installed `@reown/appkit-adapter-solana`. The marketplace's `wallet-connect` component uses the **sign in** endpoints (`/web3-auth/login`, `WALLET_AUTH_API`), which can switch or create accounts, so the profile page uses the main site's **link** endpoints instead (§8.1). |
| Sample data and loading | `useMockQuery` + `QueryResult` (`src/hooks/marketplace/domain-overview/queryResult.ts`); a shared mock store with `useSyncExternalStore` (the pattern of `src/data/marketplace/watchlist.ts`) |
| Error text | `getUserFriendlyToastMessage` (`src/helpers/error-messages`) |
| Logout | `useAuth().logout()` (`src/context/AuthContext.tsx`): clears the session and goes to `/login` |
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
| `PhoneField` | `inputs/phone-field/` | A country select (flag plus dial code) and the number. Copied from the main site on 15 Oct (§14.0): every country from `libphonenumber-js` with a search box, digits only, 7 to 15 of them. |
| `PasswordField` | `inputs/password-field/` | A show/hide eye (lifted from AuthEmailFields), with an optional strength meter. |
| `PasswordStrength` | `inputs/password-field/` | Four segments plus a label (Very Weak … Strong). The rules live in `src/helpers/passwordStrength.ts` (pure, tested). |
| ~~`SelectField`~~ | `FilterDropdown variant="field"` | The form dropdown for currency, language, date and time format and the network: the existing FilterDropdown with an additive field variant (leading icon, option icons, keyboard). (Changed in phase 2: reuse instead of a new primitive.) |
| `Switch` | `toggles/switch/` | `role="switch"`, `aria-checked`, keyboard support. The Figma blue track in both themes. |
| `SettingsRow` | `cards/settings-row/` | Title, description, and a control on the right. Used by Notifications, Preferences, Default Network and Sessions. |
| `AvatarUpload` | `avatars/avatar-upload/` | Avatar with a camera badge, Upload and Remove. Accepts PNG or JPG up to 2 MB, with a local preview. Falls back to initials. |

### 5.2 New composites (`src/design-system/composites/profile/`, as built)

| Composite | Contents |
|---|---|
| `shared/ProfileSettingsHeader` | Title and subtitle card |
| `shared/ProfileTabs` | Five icon tabs, the wallet count badge, horizontal scroll on mobile, the dark white chip |
| `shared/SettingsCard` | The section card: title, subtitle, action, Sample data chip, divider, body |
| `shared/SettingsCardSkeleton` | Loading card used by every tab |
| `shared/ConfirmDrawer` | The confirm step on the right side Modal (discard edits, sign out, delete, disconnect Telegram) |
| `shared/NoteBox`, `shared/SuccessChip` | The tinted note box; the green Active / Connected / Primary chip |
| `profile/ProfileInformationForm` | Photo and all profile fields; email lock, Verify / Resend, the note about local fields |
| `profile/PublicPreviewCard` | Live preview of the draft, with stats |
| `profile/ProfileTabPanel` | The Profile tab: loading, error, Save changes, Discard |
| `rail/AccountSummaryCard`, `rail/YourDataCard`, `rail/ProfileRail` | The Account rail (on `InfoListCard`), Export and Delete, and the rail container |
| `security/SignInMethodsCard` | One card per method (email, Google, wallet); Disconnect Google coming soon |
| `security/ChangePasswordForm` | Three PasswordFields, the meter, Update Password |
| `security/ActiveSessionsList` | Session rows, Sign Out, Sign Out Everywhere Else |
| `security/SecurityTabPanel` | The Security tab |
| `wallets/ConnectedWalletsCard` | Wallet cards (address, network, Primary, copy, Disconnect coming soon) and the Add buttons |
| `wallets/DefaultNetworkCard` | Settlement network select, hide other wallets switch |
| `wallets/WalletsTabPanel` | The Wallets tab, including wallet linking |
| `notifications/NotificationSwitches`, `NotificationChannels`, `NotificationsTabPanel` | The five switches; Email and Telegram; the tab |
| `preferences/DisplayPreferencesCard`, `PrivacyPreferencesCard`, `PreferencesTabPanel` | Theme pill and four selects; two switches; the tab |
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
  canChangeEmail: boolean     // false for Google accounts and verified addresses (main site rule)
  verificationSent: boolean   // sentEmailCount > 0: "Resend verification" instead of "Verify email"
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

### 6.2 Mapper: `src/helpers/profile/mapUser.ts`

Pure functions, like `src/helpers/marketplace/watchlist.ts` for the watchlist:

| Function | Does |
|---|---|
| `mapUserToDetails(user)` | `User` → `ProfileDetails`: `name` → `fullName`, the phone string `+<dial><number>` split into country and number, `telegram`, `isEmailVerified`, `canChangeEmail` (not Google, not a verified address), `verificationSent` (`sentEmailCount > 0`). Username, bio, location, website and avatar come back empty (no backend column). |
| `toUpdateUserBody(saved, next)` | The PUT `/users` body, the same shape the main site sends: `{ name, phoneNumber: "<dial><number>" or "", telegram, isVerified, email }`. `isVerified` is `'false'` only when a verified email changes. `email` is left out when empty (the DTO checks it with `IsEmail`). |
| `mapUserToSignInMethods(user)` | Email (when not a Google account), Google, wallet (when registered with a wallet) |
| `mapUserToWallets(user)` | `walletAddress[]` without deleted or empty rows; network lowercased; the first EVM wallet is marked primary (no primary flag in the response) |
| `missingWalletNetworks(wallets)` | The networks (`'evm'`, `'solana'`) the account can still link (seniors' rule) |

Validation lives next to it in `src/helpers/profile/validation.ts` (§7).

### 6.3 Hooks: `src/hooks/profile/` (one per file, no barrel)

Built like `src/hooks/my-domains/` and `src/hooks/marketplace/watchlist/`: every data hook returns the shared `QueryResult<T>` (`data`, `isLoading`, `isError`, `refetch`) plus its actions, and an `isMock` flag where the data is sample. Going real later means replacing a hook's sample body with an RTK query; callers don't change.

| Hook | Source | Returns besides `QueryResult` |
|---|---|---|
| `useProfileDetails` | **Real**: `useGetUserProfileQuery`, `useSetProfileMutation`, `useResendVerificationEmailMutation`. Username, bio, location, website and photo: sample store (`extras`). | `save(patch)` (PUT for the account fields, the store for the rest, then a refetch), `isSaving`, `resendVerification()`, `isSending` |
| `useProfileDraft` | `useProfileDetails` | The form's draft, errors, `isDirty`, `submit`, `discard` |
| `useSignInMethods` | **Real**: from the GET | `canDisconnectGoogle: false` |
| `useChangePassword` | **Real**: `useChangePasswordMutation` | `changePassword()` (a 401 becomes "Your current password is incorrect."), `isSaving` |
| `useConnectedWallets` (+ `useWalletCount`) | **Real**: from the GET | `missing` networks, `userId` |
| `useLinkWallet` | **Real**: AppKit + `/web3-auth/generate-nonce` + `/web3-auth/verify` (EVM), `/web3-auth/solana-add-wallet` (Solana) | `link(network)`, `pending`, `isLinking` |
| `useAccountSummary` | Sample: `summary` | `isMock` |
| `useActiveSessions` | Sample: `sessions` | `signOut`, `signOutOthers`, `isMock` |
| `useWalletSettings` | Sample: `walletSettings` | `update`, `isMock` |
| `useNotificationSettings` | Sample: `notifications` | `update`, `isMock` |
| `useProfilePreferences` | Sample: `preferences` (the theme stays in ThemeContext) | `update`, `isMock` |
| `useYourData` | Sample (only waits) | `requestExport`, `deleteAccount`, `isMock` |
| `useProfileMockArea` | Helper: `useMockQuery` for the first load, then the live store value | |
| `useProfileAction` | Helper: wraps a save with `isSaving` | |

All real hooks read the same cached `getUserProfile` request, which the header and wallet connect also use. **That query has no cache tag**, so `setProfile` doesn't refresh it on its own; `useProfileDetails` refetches after a save and the Wallets tab refetches after a wallet is linked, which updates every screen.

### 6.4 Sample data: `src/data/profile/`

* `fixtures.ts`: the sample values from the Figma frames for the areas with no backend (summary, sessions, wallet settings, notifications, preferences).
* `store.ts`: one module level store shared by every hook (`useProfileMock`, `getProfileMock`, `setProfileMock`, `mockSaveDelay`), modelled on `src/data/marketplace/watchlist.ts`. It also holds `extras` (username, bio, location, website, photo), which start empty for a real account. A hard reload resets it, like the watchlist preview.

The "Sample data" chip shows on every card whose hook returns `isMock`. When an area's endpoint ships: add the RTK endpoint, replace that hook's body, and drop its slice from the store. When no hook uses `src/data/profile/`, delete it and `SampleDataChip`.

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
| Full name | Optional (wallet only accounts have none; the DTO makes it optional), up to 60 |
| Username | Optional until the backend has it; if filled, 3 to 30, lowercase letters, digits and `_` |
| Email | Optional; valid format if filled. Locked for Google accounts and verified addresses (main site rule). Verify / Resend sends `{ email }`. |
| Phone | Digits only, length per country |
| Telegram | `@handle`, 5 to 32 characters |
| Bio | Up to 160 |
| Website | `https://` URL |
| Avatar | PNG or JPG, 2 MB or less |
| Password | The backend rule (decided 14 Oct): at least 8 characters with upper case, lower case, a number and a symbol; confirmation must match; new must differ from current. A successful change signs out to `/login` (main site behaviour). |

- **Destructive actions** (Delete account, Sign Out Everywhere Else, Disconnect Telegram) always confirm in a Modal. Delete account asks you to type your username, or your email while there's no username.
- **Not available yet:** Disconnect Google and Disconnect a wallet have no endpoint, so they show disabled with "Coming soon" (decided 15 Oct, the same pattern as the 14 Oct Add Another Wallet decision).
- **Adding wallets (15 Oct, seniors):** one EVM and one Solana wallet per account. Add Another Wallet links the missing one; Add EVM Wallet and Add Solana Wallet both show when neither is linked; nothing shows when both are.
- **Theme preference (decided 14 Oct):** **System is the default.**
  - A first visit, with nothing saved, follows the device (`prefers-color-scheme`), resolved by the init script before first paint so there's no flash.
  - While System is chosen, the theme follows live OS changes (`matchMedia(...).addEventListener('change', …)`).
  - Picking Light or Dark, here or with the header toggle, saves that choice and stops following the device until System is picked again.
  - This answers the dark mode team question about the default theme.

---

## 8. Real API: what's used and what's missing

### 8.1 Used today (the main site's profile APIs, checked 15 Oct)

| What | Endpoint | Hook | Notes |
|---|---|---|---|
| Read the user | GET `/users/user-multiple-wallet` | `useGetUserProfileQuery` | name, email, phoneNumber, telegram, isEmailVerified, sentEmailCount, isRegisteredWithGoogle, isRegisteredWithWallet, `walletAddress[]`, id |
| Save the profile | PUT `/users` | `useSetProfileMutation` | `{ name, email, phoneNumber, telegram, isVerified }` (UpdateUserDto, all optional) |
| Verify / resend email | POST `/auth/verification-email` | `useResendVerificationEmailMutation` | `{ email }`, no auth guard |
| Change password | PUT `/auth/change-password` | `useChangePasswordMutation` | `{ oldPassword, newPassword }`; 401 INVALID_ATTEMPT for a wrong current password |
| Link an EVM wallet | GET `/web3-auth/generate-nonce`, POST `/web3-auth/verify` | `useLinkWallet` | Signed nonce message; tied to the session; adds or replaces the account's EVM wallet. Offered only when there's no EVM wallet. |
| Link a Solana wallet | POST `/web3-auth/solana-add-wallet` | `useLinkWallet` | `{ walletAddress, network: 'solana', userId }`, no signature; new `API_ENDPOINT.ADD_SOLANA_WALLET_USER_API` |

### 8.2 What the backend still needs to add (list for the backend team)

> **26 Oct 2026:** most of this list now exists on backend `uat` (commit `7fd28f0e`, #994), and the backend developer wired most of it into this page on frontend `uat` (`c6cda71`, merged into `dark-mode` as `39dc0f5`). See §15 for what's real now, the gaps, and what's left.

1. **Profile fields:** username (unique, with an availability check), bio, location, website, avatar upload (with an upload endpoint or a presigned URL). Telegram already exists.
2. **Account summary:** domains owned and listed already exist (`my-domains`, §14.6). Still needed: **member since** (add `createdDateTime` to the `GET /users/user-multiple-wallet` response; the column exists on the user entity), and **confirm `my-domains?status=SOLD` works on stage** for completed sales and volume sold (or a seller sales summary endpoint that doesn't need a recently verified wallet).
3. **Sign-in methods:** nothing (27 Oct: Google and wallet accounts never get a password, so no set password and no Disconnect Google).
4. **Sessions:** list, sign out one, sign out all others.
5. **Wallets:** disconnect a wallet, settlement network, hide other wallets. (No set primary: not in the design, removed 27 Oct.)
6. **Notifications:** get and set the five toggles and the channels (email, Telegram).
7. **Preferences:** get and set currency, language, date format, time format and theme (if it should follow the account across devices), plus the privacy toggles.
8. **Your data:** export (async job plus a download link or email) and delete account. Checked 15 Oct: no such endpoint exists anywhere in the backend.

Frontend follow up, optional: `getUserProfile` could provide the `profile` tag so `setProfile` refreshes it automatically. Not changed, because other screens share that query; the profile hooks refetch by hand instead.

### 8.3 What's real and what's sample, per card

| Card | Data | Waits for (§8.2) |
|---|---|---|
| Profile Information: name, email, mobile, Telegram | **Real** | |
| Profile Information: username, bio, location, website, photo | Sample (kept until reload, note under the form) | 1 |
| Public Preview stats, Account rail | Sample today. Domains owned and listed **can be real now** (`my-domains`); completed sales and volume sold after the SOLD check; member since needs the backend (§14.6) | 2 |
| How You Sign In | **Real** (Disconnect Google: coming soon) | 3 |
| Change Password | **Real** | |
| Active Sessions | Sample | 4 |
| Connected Wallets | **Real**, including adding the missing wallet (Disconnect: coming soon) | 5 |
| Default Network | Sample | 5 |
| Notification switches | Sample | 6 |
| Where To Send Them (Telegram) | **Real** (PUT `/users`) | |
| Preferences (except theme), Privacy | Sample | 7 |
| Your Data | Sample (simulated); no export or delete endpoint exists | 8 |

How a sample card goes real: §6.4.

---

## 9. Out of scope / follow ups

- The public portfolio page itself (`endless.domains/u/<username>`). This page only previews it.
- Real multi-language support (Language shows English only and says more are coming).
- Currency conversion beyond USD.
- SMS verification of the phone number.

---

## 10. File map (as built, 15 Oct)

```
pages/profile/index.tsx + profile.module.scss       the route, ?tab=, unsaved changes guard
src/helpers/marketplace/routes.ts                   PROFILE_HREF, profileHref()
src/data/marketplace/navigation.ts                  My Profile item; bottom nav Account
src/types/profile-settings/index.ts                 view model (§6.1)
src/types/Profile.ts                                telegram on the backend User
src/core/redux/userProfile.ts                       changePassword, resendVerificationEmail mutations
src/constants/Api.ts                                ChangePasswordApi, ResendVerificationEmailApi
src/core/enum/api-endpoint.enum.ts                  ADD_SOLANA_WALLET_USER_API
src/data/profile/fixtures.ts, store.ts              sample data + shared mock store (§6.4)
src/data/countries.ts                               dial codes + flag (phone field)
src/helpers/profile/mapUser.ts, validation.ts       mapper, PUT body, wallet rule; field rules (§6.2, §7)
src/helpers/passwordStrength.ts, phone.ts, displayFormat.ts   shared pure helpers
src/hooks/profile/*.ts                              one hook per file (§6.3)
src/context/ThemeContext.tsx                        'system' preference (phase 8)
src/design-system/primitives/...                    §5.1, plus SampleDataChip and the profile tab icons
src/design-system/composites/profile/...            §5.2
public/assets/img/profile/, flags/                  verified badge, sign in method icons, India flag
```

Deleted on 15 Oct: `src/services/` (the whole 14 Oct service layer), `src/hooks/profile/index.ts`, `src/hooks/profile/useProfileResource.ts`, and the profile lint rule in `eslint.config.mjs` (that file now matches `main`).

---

## 11. Verification (every phase)

1. `npx tsc --noEmit -p .` is clean. `eslint` on changed files shows no new warnings. No `!important` (CLAUDE.md §4.3).
2. Every changed stylesheet compiles. No raw colours for surfaces, text or borders (CLAUDE.md §7.1).
3. Screenshots through the running dev server (**never** `next build` while it runs) at 390, 834, 1024 and 1440, in **light and dark**. Compare with the matching Figma frames from §2.1.
4. Keyboard: Tab order, visible focus, switches toggle with Space, selects with arrows and Enter, Escape closes dropdowns and modals.
5. Update `dev-docs/profile/profile-settings-progress.html` (local only) with files, decisions, what was verified and what wasn't.

---

## 12. Build order and per phase prompts

**History:** these are the prompts phases 0 to 9 were built from on 14 Oct. Phases 1 to 9 are done; phase 0 (the backend and designer message) is still to do. Where a prompt mentions `src/services/profile`, `profileServices` or `config.ts`, that layer was replaced on 15 Oct (§14.0); follow §6 instead.

Each phase is a separate, reviewable step that's safe to merge (the page is reachable but parts can show "coming soon"). Paste the prompt as is to start a phase. Every prompt assumes this plan is at `dev-docs/profile/profile-settings-implementation-plan.md`.

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
Read dev-docs/profile/profile-settings-implementation-plan.md, sections 8 and 13.
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
Start profile settings phase 1 from dev-docs/profile/profile-settings-implementation-plan.md
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
Start profile settings phase 2 from dev-docs/profile/profile-settings-implementation-plan.md (§5.1, §7).
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
Start profile settings phase 3 from dev-docs/profile/profile-settings-implementation-plan.md
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
Start profile settings phase 4 from dev-docs/profile/profile-settings-implementation-plan.md
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
Start profile settings phase 5 from dev-docs/profile/profile-settings-implementation-plan.md
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
Start profile settings phase 6 from dev-docs/profile/profile-settings-implementation-plan.md
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
Start profile settings phase 7 from dev-docs/profile/profile-settings-implementation-plan.md
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
Start profile settings phase 8 from dev-docs/profile/profile-settings-implementation-plan.md
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
Start profile settings phase 9 from dev-docs/profile/profile-settings-implementation-plan.md (§7, §11).

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
3. ~~**PUT /users:** which fields does it accept today?~~ answered (phase 5 and 15 Oct): name, email, phoneNumber, telegram, isVerified, all optional.
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

**Status:** phases 1 to 9 are built and checked on branch `profile-settings`. **Nothing is committed.** Phase 0 (the backend and designer message) hasn't been done. Every area in `src/services/profile/config.ts` is still `'mock'`. The dev server on port 3002 stopped with the session; start it again before checking the page. Full file by file record: `dev-docs/profile/profile-settings-progress.html`. Beginner explanation of the data layer: `dev-docs/profile/profile-data-layer-guide.html`.

### 14.0 Done on 15 Oct: restructured like My Domains and Watchlist, and wired to the main site's APIs

**Asked (15 Oct):** integrate the page the way the other pages are integrated, using the existing APIs the main Endless Domains site's profile page uses (`D:\Akshat Endless\endlessdomainsMain\webui`, `pages/profile/user` with `design-system/composites/profile/user/{ProfileForm,WalletForm,AddSolanaWallet,ChangePasswordForm}`). This replaces the 14 Oct "keep every area on sample data" decision. **Wallets (seniors, 15 Oct):** one EVM and one Solana wallet per account; Add Another Wallet links whichever is missing and disappears when both are linked.

**The main site's profile APIs, all now used here:**

| What | Endpoint | Body / notes |
|---|---|---|
| Read the user | GET `/users/user-multiple-wallet` | `useGetUserProfileQuery` (existing) |
| Save the profile | PUT `/users` | `{ name, email, phoneNumber: "<dial><number>", telegram, isVerified }`; `isVerified` is `'false'` only when a verified email changes; email left out when empty (DTO `IsEmail`) |
| Send / resend verification | POST `/auth/verification-email` | `{ email }`; label "Verify email" when `sentEmailCount` is 0, else "Resend verification" |
| Change password | PUT `/auth/change-password` | `{ oldPassword, newPassword }`; 401 = wrong current password; success signs out to `/login` like the main site |
| Link an EVM wallet | GET `/web3-auth/generate-nonce`, sign, POST `/web3-auth/verify` | existing `getNonce`, `buildWalletSignMessage`, `connectWallet` |
| Link a Solana wallet | POST `/web3-auth/solana-add-wallet` | `{ walletAddress, network: 'solana', userId }`; new `API_ENDPOINT.ADD_SOLANA_WALLET_USER_API`; connects through Reown AppKit's Solana adapter (already installed, 1.8.14) |

Main site rules copied: email locked for Google accounts and verified addresses; name, email and username optional (wallet only accounts have none; the DTO makes every field optional).

**Still sample data** (no endpoint anywhere): username, bio, location, website, photo (kept in the browser until reload, with a note under the form), account summary, sessions, wallet settings, notifications, preferences (theme stays on the device), export and delete. Google disconnect and wallet disconnect show disabled with "Coming soon".

**New structure (§14.1 done):**
* `src/services/` deleted (the whole folder); `src/hooks/profile/index.ts` and `useProfileResource.ts` deleted; the profile `no-restricted-imports` rule removed, so `eslint.config.mjs` matches `main` again.
* `src/data/profile/fixtures.ts`, `store.ts` (sample values and the shared `useSyncExternalStore` store, like `data/marketplace/watchlist.ts`).
* `src/helpers/profile/mapUser.ts` (user → view model, `toUpdateUserBody`, `missingWalletNetworks`), `validation.ts` (moved from `helpers/profileValidation.ts`).
* `src/hooks/profile/`: one hook per file. Real: `useProfileDetails`, `useSignInMethods`, `useChangePassword`, `useConnectedWallets` (+ `useWalletCount`), `useLinkWallet`. Sample: `useAccountSummary`, `useActiveSessions`, `useWalletSettings`, `useNotificationSettings`, `useProfilePreferences`, `useYourData`. Helpers: `useProfileMockArea` (on the shared `useMockQuery`), `useProfileAction`, plus `useProfileDraft`.
* Errors through the existing `getUserFriendlyToastMessage`; hooks return `QueryResult` + `isMock` like the other pages.
* Types: `ProfileDetails` gains `canChangeEmail`, `verificationSent`; `ProfileArea` removed.

**Verified 15 Oct:** type check clean, lint clean, stylesheets compile, all helper tests pass (new `test9`: mapper, PUT body, wallet rule, optional fields). In headless Chrome with the profile APIs answered by a realistic user (`scratchpad/shotapi.js`): load, save (PUT body checked), verify email, wrong password (401 under the field), password change → `/login` with the cookie cleared, Telegram disconnect (PUT), Google email lock, wallets with EVM only / none / both (buttons and badge), Add opens the Reown modal; all five tabs in light and dark at 390 and 1440. **Not verified:** a real login against the stage backend, and completing a real wallet signature (EVM or Solana) in a browser wallet.

**Correction to §14.2:** `getUserProfile` has **no** `providesTags`, so `setProfile`'s `invalidatesTags: ['profile']` does not refresh it. `useProfileDetails` refetches after every save, which updates every screen that reads the profile.

**Later on 15 Oct: phone, Telegram and email copied from the main site** (`endlessdomainsMain/webui`, `composites/profile/shared/PhoneInputField` and `pages/profile/user`):
* New dependency `libphonenumber-js` (the main site's library). `src/data/countries.ts` now lists all 245 countries the main site's way (names from `Intl.DisplayNames`, emoji flags; India keeps Figma's flag file), plus `searchCountries`.
* `PhoneField` opens the main site's panel inside `FilterDropdown` (custom content): a search box (name, dial code or ISO code) over every country. The number is digits only, 7 to 15 of them (`helpers/phone.ts`, the main site's messages), with no 3-3-4 grouping. A pasted "+1 (202) 555-0123" drops its dial code. One improvement over the main site: a saved "+1…" number gets its country from `libphonenumber-js` (US, not American Samoa).
* Telegram uses the main site's exact regex (`TELEGRAM_RE` in `helpers/profile/validation.ts`): 5 to 32 letters, numbers or underscores, no leading or trailing `_`, no `__`.
* Email: as on the main site, an edited address shows **Save & verify**, which saves the form and then sends the link to the new address (`resendVerification(email)`). It stays locked for Google accounts and verified addresses.
* Checked: tsc and lint clean, stylesheet compiles; in headless Chrome, search, pick a country, paste a number, a bad Telegram blocked, and Save & verify (PUT then POST to the new address); dark at 390px.

### 14.1 Decided: restructure the data layer to match My Domains and Watchlist (done 15 Oct, see §14.0)

> **History.** This is the plan as written on 14 Oct. It was carried out on 15 Oct with three differences: the areas the main site's APIs cover went **real** instead of staying sample (the user's 15 Oct request), `useProfileAction` became its own file next to `useProfileMockArea`, and wallet linking (`useLinkWallet`) was added. §14.0 and §6 describe the result.

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
│   ├── useConnectedWallets.ts    (+ disconnect, useWalletCount)
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
9. Docs: rewrite `dev-docs/profile/profile-data-layer-guide.html` for the new structure (it describes the old service layer), update the file tables in `profile-settings-progress.html` (new and removed files), §6.3, §6.4 and §8.3 of this plan, and the memory note.

Net effect expected: about 10 fewer files, no new top level folder, `eslint.config.mjs` back to unchanged, the page built the same way as its siblings. Behaviour on screen identical, except sample edits no longer survive a hard reload.

**Ready prompt:**

```
Restructure the profile page's data layer as described in
dev-docs/profile/profile-settings-implementation-plan.md §14.1, to match how
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
2. **Everyone stays up to date after a save.** ~~`setProfile` marks the cached profile as out of date (the `profile` tag), so every screen showing the user reloads it by itself.~~ **Corrected 15 Oct:** `getUserProfile` provides no tag, so that invalidation does nothing for it; `useProfileDetails` refetches after a save instead, and because the cache is shared, every screen showing the user updates. A separate axios call would leave those screens showing the old name until a page reload.
3. **Consistency.** New endpoints live in the same place and style as the rest of the app.

Only two endpoints were added to Redux, next to the existing ones: `resendVerificationEmail` (POST `/auth/verification-email`, body `{ email }`) and `changePassword` (PUT `/auth/change-password`, body `{ oldPassword, newPassword }`).

The page's own state lives in React hooks, not the Redux store: the form draft, and the sample data in `src/data/profile/` for the areas the backend doesn't serve yet. Since 15 Oct the hooks call RTK Query directly (no service layer in between), the same as My Domains and Watchlist (§6.3).

### 14.3 How a sample area goes real (current)

The 14 Oct answer here ("only `mock/` is deleted, the service folder stays") no longer applies: the service folder was deleted on 15 Oct. A sample area goes real the same way as on My Domains and Watchlist:

1. Add the RTK Query endpoint in `src/core/redux/` (profile details, change password, verification and the wallet list are already real, §8.1).
2. In that area's hook, replace the mock body with the RTK query, mapped through `src/helpers/profile/mapUser.ts`; the hook keeps the same return shape, so components don't change. Set `isMock` to false.
3. Show errors with `getUserFriendlyToastMessage`; change password still turns a 401 into "Your current password is incorrect." inside its hook.
4. When no hook uses `src/data/profile/` any more, delete that folder and the `SampleDataChip` primitive.

Real calls share the app wide RTK cache, so the profile page and the rest of the app (header, wallet connect) stay in sync after a save (§14.2).

### 14.4 Docs (local only, never commit `dev-docs`)

* `dev-docs/profile/profile-settings-implementation-plan.md` (this file): §1.1, §3, §6, §7, §8, §10 and §13 Q3 rewritten on 15 Oct to match the code; §14.0 records the 15 Oct work; §12 kept as the build history.
* `dev-docs/profile/profile-settings-progress.html`: rewritten in full on 14 Oct, brought up to date on 15 Oct (how the page works, file tables, what's real, phase 10, before committing).
* `dev-docs/profile/profile-page-walkthrough.html`: new 15 Oct. How the page was built, start to finish, for explaining it to a senior: the 30 second version, the full story, an interactive map of all 97 pieces (primitives, composites, hooks, Redux, services, mappers, helpers, data, endpoints) generated from the real imports, guided tours of four flows plus the planned rail, likely questions.
* `dev-docs/profile/profile-data-layer-guide.html`: beginner guide, rewritten on 15 Oct for the new structure (data, helpers, one hook per file, real Redux calls, wallet linking).
* Both HTML docs checked on 15 Oct with real phone emulation (390, light and dark) and at 1100: no sideways scroll. The 14 Oct "cut off at 390" screenshot was headless Chrome's minimum window width, not the page. One long file path in the guide was made to wrap.

### 14.5 Next steps, in order

> **Branch (15 Oct):** the work now lives on **`dark-mode`**. `profile-settings` had no commits and pointed at the same commit as `dark-mode` (`de003ff`), so the uncommitted work was carried over with `git switch dark-mode` and the empty local `profile-settings` branch was deleted. Older mentions of `profile-settings` in these docs refer to the same work.

1. **Test with a real login** on the stage backend: load, save, verify email, change password (it signs you out), link a real EVM wallet and a real Solana wallet in a browser wallet.
2. **Look at the page yourself** on the dev server: `/profile`, all five tabs, light and dark, phone and desktop.
3. **Commit when ready** (only when asked): 129 new files and 20 changed files on `dark-mode` (it is pushed, so they join the dark mode review), without `dev-docs`. Shared files changed: `CLAUDE.md`, `MarketplacePageShell`, `MobileBottomNav`, `main-layout`, `FilterDropdown`, `DefaultButton`, `InfoListCard`, `SegmentedToggle`, `ThemeContext`, navigation, `routes.ts`, `userProfile.ts`, `Api.ts`, the endpoints enum, `types/Profile.ts`. A production build hasn't been run; the team should run one in CI.
4. **Phase 0:** send the backend team the §8.2 list (also §8.3 per card) and the designer the §2.9 quirks, the missing flags and the missing tablet frames. Include the §14.6 asks: `createdDateTime` in the user response, confirm `my-domains?status=SOLD` on stage, export and delete endpoints.
5. **Right rail (§14.6):** step 1 (Domains owned and Listed from `my-domains`) when the user says go; steps 2 and 3 after the backend answers.

### 14.6 Right rail: what can be real (checked 15 Oct, not built yet)

**Asked (15 Oct):** can the right rail use real APIs too? Checked the backend (`D:\Akshat Endless\backend\backend`, latest commit 2 Oct) and this repo. **Nothing changed in code yet**; step 1 below waits for the user's go ahead.

**Account card:**

| Field | Real now? | Source and notes |
|---|---|---|
| Domains owned | **Yes** | `GET /marketplacev2/orders/my-domains` (AccessTokenGuard only), LISTED + UNLISTED. The same call and hook as the My Domains page (`useMyDomainsData` → `useGetMyDomainsOrdersQuery`), so the numbers match that page and the cached answer is reused. |
| Listed | **Yes** | The same call, the LISTED count (`summary.statusCounts['for-sale']`). |
| Completed sales | **Probably, needs a check on stage** | The backend on disk accepts `my-domains?status=SOLD` (`DOMAIN_LISTING_STATUS_VALUES = ['LISTED', 'UNLISTED', 'SOLD']`, added around 28 Sep) and attaches the FILLED order to each sold row. But `useMyDomainsData`'s comment says a `status=SOLD` query "was tried and removed", probably before the backend supported it, so confirm stage serves it. Caveat from the backend's own code: a domain shows as SOLD only while its `tbl_domain_detail_bc` row is still under the seller's account. |
| Volume sold | **Same as completed sales** | Sum of the sold orders' `priceUsdt` (6 decimal minor units, as `useMyDomainsData` already handles). |
| Member since | **No** | `createdDateTime` exists on the user entity (`BaseEntity`) but `ReturnUserDtoMultipleWalleAddress` doesn't include it. One line on the backend. Approximating from the oldest linked wallet's `createdDateTime` was rejected: wrong for email accounts and for wallets linked later. |

**Ruled out:** `GET /marketplacev2/orders/my-listings?category=sold` would be the most accurate sales source, but it sits behind `RequireVerifiedWalletGuard`, which needs a wallet signature verified within the last hour (`WALLET_VERIFICATION_WINDOW_MS`). On the profile page it would usually answer 403.

**Your Data card:** no export and no delete account endpoint anywhere in the backend (user, auth and google-auth controllers checked). Stays sample (simulated).

**Plan:**
1. Make **Domains owned** and **Listed** real by reusing `useMyDomainsData` in `useAccountSummary` (no new endpoint). The card keeps its Sample data chip for the fields still sample.
2. After the backend confirms `status=SOLD` on stage: **Completed sales** and **Volume sold** from it.
3. Ask the backend for `createdDateTime` in the user response, and export and delete endpoints (§8.2 items 2 and 8).

**Ready prompt for step 1:**

```
Make the profile rail's Domains owned and Listed real, as described in
dev-docs/profile/profile-settings-implementation-plan.md §14.6 step 1: reuse
useMyDomainsData (src/hooks/my-domains) inside useAccountSummary, keep
member since, completed sales and volume sold on sample data with the
chip, check the numbers match the My Domains page, update the docs.
Don't commit.
```

---

## 15. Backend profile APIs arrived (26 Oct 2026)

**Source:** the backend developer's guide `MPV2_PROFILE_MARKETPLACE_API_GUIDE.pdf` (16 calls), checked against backend `uat` at `ebcc85b9` (APIs from commit `7fd28f0e`, #994; no newer backend commit yet) and against this repo. All 16 endpoints exist and need only `AccessTokenGuard` (never the wallet signature); the backend reads only `Authorization: Bearer`, never cookies. The readable version of this section is `dev-docs/profile/profile-api-guide-analysis.html`.

**Update, 26 Oct afternoon:** the backend developer wired most of these into the Profile page himself on frontend `uat` (commit `c6cda71`, "Implemented new profile apis", which also adds the test page `/dev/sprint1-test`). Our History work was committed first (`4e521b7`), then `uat` was merged into `dark-mode` (`39dc0f5`, not pushed). The 15 Profile files both branches had added were taken from `uat`: ours were unchanged since `db9b41d` and his are that version plus the API work, so nothing of ours was lost. His commit didn't compile (leftover `git stash` conflict markers in `api-endpoint.enum.ts` and `userProfile.ts`, plus two lost imports and two lost hook exports in `userProfile.ts`); the merge removes the markers and restores the four lines. `tsc` passes and `eslint` has no errors after the merge.

### 15.1 Endpoint map (after the merge)

| # | Endpoint | Now | Notes |
|---|---|---|---|
| 1 | GET `/users/user-multiple-wallet` | **Real** | `mapUser.ts` reads `username`, `bio`, `location`, `website`, `avatarUrl` |
| 2 | PUT `/users` | **Real** | Sends the four new fields; `isVerified` no longer sent |
| 3 | GET `/users/username/availability` | **Partly** | Checked only on Save, not while typing |
| 4 | POST `/users/avatar` | **Real** | Uploads on choose; 2 MB message |
| 5 | DELETE `/users/avatar` | **Real** | |
| 6 | POST `/auth/verification-email` | **Real** | `source: 'marketplace'` |
| 7 | POST `/auth/forgot-password` | **Real** | `source: 'marketplace'` |
| 8 | GET `/web3-auth/solana-generate-nonce` | **Real** | |
| 9 | POST `/web3-auth/solana-add-wallet` | **Real** | Signs the nonce (`helpers/profile/solana-signing.ts`, `base58.ts`) |
| 10 | POST `/auth/logout/others` | **Real** | Saves the new tokens; the session list is still sample |
| 11 | GET `/users/notifications` | **Real** | |
| 12 | PATCH `/users/notifications` | **Partly** | Switches save; email and Telegram channels live in React state only and reset on reload |
| 13 | GET `/marketplacev2/orders/summary` | **Real** | Divides by 1e6; fetched twice per page load (ProfileTabPanel and ProfileRail both call the hook) |
| 14 | POST `/users/requests` | **Real** | Delete became "Request account deletion" |
| 15 | GET `/users/requests` | **Not used** | `listDataRequests` exists but nothing calls it |
| 16 | POST `/marketplace/redirectauth/redirect` | **Partly** | Bearer added only when the body carries `access_token` |

### 15.2 Gaps and convention differences in his integration

1. **Own fetch wrapper.** The new calls go through `src/core/services/profile-settings.service.ts` (raw `fetch`), not RTK Query (§14.3) or `callBackend`. No shared cache, no automatic refresh after saves elsewhere.
2. **Double summary request** on every page load (item 13).
3. **Silent errors** in `useAccountSummary` and `useNotificationSettings` (no `[profile]` console log like the other pages).
4. **Channels don't persist** and the card no longer shows the Sample data chip for them.
5. **Username check only on Save.**
6. **Data request status never shown** (item 15).
7. **Null `memberSince`** becomes an empty string; check the card.
8. **Redirect without a body token** goes out without Bearer and gets 401.
9. **Test page in the build** (`/dev/sprint1-test`), hidden only by `NEXT_PUBLIC_MPV2_SPRINT1_TEST`.

### 15.3 Mistakes in the guide

1. Photo limit is 2 MB, not 3 MB (his frontend code uses 2 MB correctly).
2. The account summary has no "domain statuses".
3. The "where the marketplace uses it" column named files that only arrived with his commit.

### 15.4 How "sign out other sessions" really works

New tokens are issued and saved into this browser's cookies. There is one refresh token per user, so other devices fail at their next refresh; their current access token keeps working until `JWT_ACCESS_TOKEN_EXPIRATION`. Wallet verification claims carry over, so History keeps working.

### 15.5 Still no API (stays sample)

1. Active sessions list and signing out one session.
2. Wallet settings: settlement network, hide other wallets, disconnect a wallet.
3. Notification channels (email and Telegram switches).
4. Privacy toggles; display preferences (can stay in the browser).

### 15.6 Questions for the backend

1. **Broken uat build:** `c6cda71` has stash conflict markers in two files and lost four lines in `userProfile.ts`. Fix `uat`, or take the fix from our merge?
2. **Data layer:** fine to move `profile-settings.service.ts` calls into RTK Query later, to match the page and share the cache?
3. **Sessions:** a session list and single session sign out planned? Could "sign out others" revoke other devices immediately?
4. **Notification channels:** save email and Telegram switches per user? Where (for example `channels` on `/users/notifications`)?
5. **Wallet settings:** settlement network, hide other wallets, disconnect. Planned, and when?
6. **Preferences:** privacy and display saved on the account, or browser only?
7. ~~**Sign in methods:** disconnect Google, set a password.~~ Dropped 27 Oct: Google and wallet accounts are password free by design.
8. **Data requests:** which statuses can the list return, can a request be cancelled, will support email the user?
9. **Avatar:** is `avatarUrl` permanent and public, or does it expire?
10. **Account summary:** a period filter (this month, this year) planned? History needs one.
11. **Redirect:** which `source` values are accepted?
12. **Test page:** is `NEXT_PUBLIC_MPV2_SPRINT1_TEST` guaranteed off in production, or should `/dev/sprint1-test` go before release?

### 15.7 What's left to do, in order (not started; wait for the user's go ahead)

1. **Wait for the backend's next update** (the user will say when to pull), then recheck this section against it.
2. **Test with a real login** on staging: profile fields, photo, username taken, notifications, summary, export and deletion requests, sign out others, Solana link, main site hand off.
3. **Fix the gaps** in §15.2 that don't need the backend: one shared summary request, error logging, username check while typing, show data request status, the redirect Bearer fallback, the empty Member since case.
4. **Decide on the data layer** (§15.6 question 2) before moving anything into RTK Query.
5. **After the backend answers**: notification channels, sessions list, wallet settings, preferences.
6. Remove the sample data per §14.3 once no hook uses it.

Each step: check light and dark at 390, 834 and 1440, run `tsc` and `eslint`, update this file, the analysis HTML and `profile-settings-progress.html`. Don't commit unless asked.

### 15.8 What the backend still needs (send this list)

Shapes come from `src/types/profile-settings/index.ts`. Paths are suggestions. The same list, formatted, is section 10 of `profile-api-guide-analysis.html`.

**Fix first:** frontend `uat` doesn't build (commit `c6cda71`: stash markers in `api-endpoint.enum.ts` and `userProfile.ts`, four lost lines in `userProfile.ts`). Fixed in `dark-mode` merge `39dc0f5`.

**New APIs**

| # | For | Suggested API | Shape | Unlocks |
|---|---|---|---|---|
| 1 | Active sessions list | GET `/auth/sessions` | `[{ id, device, location, lastActive, current }]` | Security: real device list |
| 2 | Sign out one session | DELETE `/auth/sessions/:id` | ends that session now | Security: per row Sign out |
| 3 | Wallet settings | GET, PATCH `/users/wallet-settings` | `{ settlementChainId, hideOtherWallets }` | Wallets: Default Network |
| 4 | Disconnect a wallet | DELETE `/users/wallets/:id` | removes an EVM or Solana wallet | Wallets: Disconnect |
| 5 | Privacy | GET, PATCH `/users/privacy` | `{ publicPortfolio, showSalesHistory }` | Preferences: Privacy (affects what others see, so it must be on the account and enforced by public profile APIs) |
| 6 | Display (optional) | GET, PATCH `/users/preferences` | `{ theme, currency, language, dateFormat, timeFormat }` | Only if they should follow the user across devices |

**Updates to existing APIs**

| # | API | Change | Why |
|---|---|---|---|
| 1 | GET, PATCH `/users/notifications` | add `channels: { email, telegram }` | channel switches reset on reload |
| 2 | POST `/auth/logout/others` | revoke other access tokens immediately | today they work until expiry |
| 3 | GET `/users/requests` | document `status` values; optional DELETE `/users/requests/:id` | show and explain each request |
| 4 | GET `/marketplacev2/orders/summary` | optional `from`/`to` (or `period`) and a spent total | the History Summary card needs per period totals |
| 5 | POST `/marketplace/redirectauth/redirect` | document accepted `source` values | we send `marketplace` and other sources |
| 6 | POST `/users/avatar` | confirm `avatarUrl` is permanent and public | an expiring link breaks the photo later |
| 7 | The API guide | 2 MB photo limit; no "domain statuses" in the summary | correct the doc |

Frontend only items (not backend) stay in §15.7 step 3.

### 15.9 Backend at a glance: what exists and what doesn't (26 Oct 2026)

Checked against backend `uat` at `ebcc85b9`, every controller route searched. Covers Profile and History. Same lists, formatted, in section 11 of `profile-api-guide-analysis.html`.

**Exists**

| # | Page | API | What it does | Wired? |
|---|---|---|---|---|
| 1 | Profile | GET `/users/user-multiple-wallet` | profile fields and wallets | Yes |
| 2 | Profile | PUT `/users` | save profile fields | Yes |
| 3 | Profile | GET `/users/username/availability` | is a username free | On save only |
| 4 | Profile | POST `/users/avatar` | upload photo, PNG or JPEG, 2 MB | Yes |
| 5 | Profile | DELETE `/users/avatar` | remove photo | Yes |
| 6 | Profile | POST `/auth/verification-email` | resend verification | Yes |
| 7 | Profile | PUT `/auth/change-password` | change password | Yes |
| 8 | Profile | POST `/auth/forgot-password` | reset email | Yes |
| 9 | Profile | POST `/auth/reset-password` | new password from the link | Yes (sign in flow) |
| 10 | Profile | POST `/auth/logout/others` | sign out other devices | Yes |
| 11 | Profile | GET `/web3-auth/generate-nonce`, POST `/web3-auth/verify` | link an EVM wallet | Yes |
| 12 | Profile | GET `/web3-auth/solana-generate-nonce`, POST `/web3-auth/solana-add-wallet` | link a Solana wallet, signed | Yes |
| 13 | Profile | GET `/users/notifications` | read five alert switches | Yes |
| 14 | Profile | PATCH `/users/notifications` | save five alert switches | Yes |
| 15 | Profile | GET `/marketplacev2/orders/summary` | account summary | Yes |
| 16 | Profile | POST `/users/requests` | export or deletion request | Yes |
| 17 | Profile | GET `/users/requests` | list requests and status | **No** |
| 18 | Profile | POST `/marketplace/redirectauth/redirect` | main site hand off | Yes |
| 19 | History | GET `/marketplacev2/history/get-all` | purchases, sales, active and cancelled listings | Yes |
| 20 | History | GET `/marketplacev2/wallet-verification/wallet-nonce`, POST `.../prove-wallet` | wallet signature for History | Yes (Verify wallet) |

**Doesn't exist yet**

| # | Page | Missing | Until then |
|---|---|---|---|
| 1 | Profile | active sessions list, sign out one session | Coming soon |
| 2 | Profile | wallet settings (settlement network, hide other wallets) | Coming soon |
| 3 | Profile | disconnect a wallet | Coming soon |
| 4 | Profile | privacy settings (public portfolio, show sales history) | Coming soon |
| 5 | Profile | display preferences on the account | stay in the browser |
| 6 | Profile | email and Telegram channel switches | **ask now**: `channels` on `/users/notifications` |
| 8 | Profile | cancel a data request | not offered |
| 9 | History | summary endpoint with a period | page sums purchases and sales |
| 10 | History | several types in one request | two requests per tab |
| 11 | History | date range `from`, `to` | filters loaded rows only |
| 12 | History | renewals in the History API | not shown |
| 13 | History | offers, bids, transfers, withdrawals, account events | empty tabs, Coming soon tiles |
| 14 | History | friendly reference ID | not needed: decided 26 Oct to keep the short order hash |

### 15.10 The uat build problem (26 Oct 2026)

Frontend `uat` doesn't build since `c6cda71` (26 Oct 13:00): `git stash` conflict markers in `src/core/enum/api-endpoint.enum.ts` (line 47) and `src/core/redux/userProfile.ts` (line 58), and `userProfile.ts` lost the `ChangePasswordApi` and `ResendVerificationEmailApi` imports and the `useResendVerificationEmailMutation` and `useChangePasswordMutation` exports. `7302216` (13:56, "Resolved the conflict") only added `countries.ts`, `phone.ts` and `libphonenumber-js`, so `uat` is still broken; verified by type checking an untouched copy of `uat` (6 `TS1185` errors, then 4 more once the markers alone are removed). Cause: a stash made on top of our `dark-mode` Profile work was popped onto `uat`, which never had it. Staging still serves a build from before `c6cda71` (`/dev/sprint1-test` answers 404), most likely because the CodeDeploy build step failed. Build test: in `D:\Akshat Endless\marketplacev2UAT\endlessdomains-marketplace-frontend` run `npx tsc --noEmit` and `npm run build`. Our `dark-mode` has the fix (`39dc0f5`); on the next pull keep his version of those two files. Full write up: section 12 of `profile-api-guide-analysis.html`.

### 15.11 Frontend gaps fixed (26 Oct 2026, uncommitted)

The six §15.2 items that needed no backend, after analysing the test page and the Postman collection (`MPV2_PROFILE-Marketplace-All-Sprints`). Everything without an API was left as it was (user's decision).

1. **Data request status:** `useYourData` reads GET `/users/requests` on load and after each request; `YourDataCard` shows "Requested · our team will contact you" or "Completed" under Export and Request account deletion (statuses are only `open` and `done`).
2. **Username while typing:** new `useUsernameAvailability` (400 ms debounce, only for a changed name that passes the format rules); `useProfileDraft` shows "That username is already taken." at once and blocks Save. A 409 `USERNAME_TAKEN` from PUT `/users` (race) becomes the same message in `useProfileDetails`.
3. **One summary request:** `useAccountSummary` shares the in flight request between the Profile tab and the rail.
4. **Error logging:** `[profile]` console errors in the summary, notifications, data requests and username hooks.
5. **Redirect:** `postRedirect` falls back to the access token cookie for the Bearer header.
6. **Member since:** a dash when `memberSince` is null (was "Invalid Date").

`tsc` clean, `eslint` no errors (one existing `any` warning in `apicall.ts`). Not yet checked in the browser against staging.

From the collection: 409 `USERNAME_TAKEN`; statuses `open` and `done`; new request 201, repeat 200; WEBP and over 2 MB photos are 400; empty PATCH `/users/notifications` is 400. It says access tokens last 1 hour, the backend's `env.sample` says `3d`: ask which is real. The test page is now always on (`f92a37e` removed the env switch): remove or gate it before production.


### 15.12 Decisions on 27 Oct 2026

1. **No password for Google or wallet accounts** (product rule). No set password API, and Disconnect Google is dropped, since it would lock a password free user out. Code: `SignInMethodsCard` has no action on the Google row, `canDisconnectGoogle` is gone from `useSignInMethods`, and `ChangePasswordForm`'s note for these accounts no longer suggests "Forgot password". Uncommitted.
2. **No set primary wallet**: not in the design, removed from every backend ask. The "Primary" chip on Connected Wallets is still a frontend guess (`mapUser.ts`, first EVM wallet).
3. **Backend has no wallet removal** (checked uat `ebcc85b9`), and it is not supported anyway (item 5): the Disconnect button is commented out.
4. The backend asks are collected in `dev-docs/profile/profile-backend-needs.html`.
5. **Not supported for now** (user, 27 Oct): active sessions (with Sign out everywhere else), the Default Network card (settlement network, hide other wallets), the Telegram channel row, and disconnecting a wallet. All commented out, not deleted, marked "Not supported for now (27 Oct 2026)". Uncommitted.
6. **Not happening:** cancelling a data request, and summary totals by period (History stays lifetime totals). Nothing to ask the backend.
7. **Still planned: privacy settings** (public portfolio, show sales history). Asked of the backend on 27 Oct; waiting on the answer. Ties in with the public portfolio, which is being built now. Ask: GET, PATCH `/users/privacy` with `{ publicPortfolio, showSalesHistory }`, defaults for new users, enforced inside the public portfolio API (portfolio off gives private or not found to everyone but the owner; sales history off leaves sales out of the response), the public link (username based?) and what the public page shows. Until it lands, the Privacy card is still sample switches.

## 15.13 Right rail on mobile (29 Oct 2026)

Figma's mobile frame (128:17333) has no rail, so the rail was hidden on mobile, which left no way to export data or request account deletion on a phone. The user asked for it back: on mobile the **Account** card now sits under the page title, above the tabs (`ProfileRailAccount`, rendered by the page when `useIsMobile(767)`), and the rail, which the shell already places after the tab content (`after-main-tablet`), shows only **Your Data** (`ProfileRail showAccount={false}`). One copy of each card is mounted, so the data request status isn't fetched twice. Tablet and desktop are unchanged. As with My Domains (CLAUDE.md §5), the first paint before `useIsMobile` resolves shows the desktop order. Checked: tsc and eslint clean; headless Chrome, both themes at 390, 834 and 1440 (mobile order Account, tabs, tab content, Your Data; tablet and desktop as before). Not committed. Worth flagging to the designer so the mobile frame gets these cards.
