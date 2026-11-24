# Security Tab Crash on Profile

4 Nov 2026 · Online copy: https://claude.ai/artifact/VBVeiosnN2RnGeNocWYi7d

## What users see

Some users who open Profile and click the Security tab (marketplace.endlessdomains.io/profile?tab=security) get a fully black page with the message "Application error: a client side exception has occurred". The rest of the site works for them; only this tab breaks, and it breaks every time for the same account.

## The exact issue, in simple words

The Security tab shows a card called "How You Sign In". For wallet users it shows the wallet address, shortened like 0xeF519A9D…b3e4ae5494. To shorten it, the code first checks how long the address is.

The affected account has a wallet saved in the database that is not deleted but has **no address** (the value is empty, null). When the page builds the card, it picks the first wallet that is not deleted, which is this empty one, without checking that it actually has an address. Then it asks "how long is this address?" about something that does not exist, and that question crashes the page.

In a React app, a crash while drawing the page takes down the whole page, so instead of one broken card the user sees the black error screen.

The Wallets tab does not have this problem because its code already skips wallets with no address. The Security tab was simply missing that same check.

The code involved is `mapUserToSignInMethods` in `src/helpers/profile/mapUser.ts` (picks the wallet) and `shortWalletAddress` in `SignInMethodsCard.tsx` (shortens it and crashes on an empty value).

## Why the empty wallet exists

The empty wallet row is not a database error. The backend creates empty wallet rows on purpose, as placeholders: it reserves a slot now and fills in the address later, when the user connects that wallet (`updateUserWallet` writes the address into the existing empty row).

Think of each user as having a small list of wallets in the `tbl_wallet_address` table. Each row has a `network` (which chain, for example `evm_network` or `solana`), a `walletAddress` (the actual address) and `isDeleted` (whether it was removed). The `walletAddress` column is allowed to be empty (`nullable: true` in `wallet-address.entity.ts`). An empty value is stored as null, which simply means "nothing is saved here yet".

These are the places in the backend (`user.service.ts`) that create an empty row:

| When it happens | Function | Empty row created |
| --- | --- | --- |
| User signs up with email and password | `create` | EVM wallet, no address |
| User signs up with Google | `createWithGoogle` | EVM wallet, no address |
| User signs up with a Solana wallet | `createSolanWithWallet` | EVM wallet, no address |
| User starts linking a Solana wallet | `setSolanaNonceForUser`, called by `generateSolanaNonce` in `web3-auth.service.ts` | Solana wallet, no address |

The backend code itself says this is intended: the Solana row "can exist with a null walletAddress", created "before the user has linked a Solana address, the same way the signup flow creates an empty EVM row".

### What most likely happened on the affected account

1. The user signed up with an EVM wallet (for example MetaMask), so they have a proper EVM row with an address.
2. They started adding a Solana wallet. The backend first creates a Solana row holding a nonce (a one time code the wallet must sign) and leaves the address empty until the signing is done.
3. They did not finish, for example they rejected the signature request in Phantom or the final add wallet call failed, so the empty Solana row stayed.
4. When the profile loads (`GET /users/user-multiple-wallet`), the backend sorts the wallet list so Solana wallets come first, which puts the empty Solana row at the top.
5. The Security tab takes the first wallet that is not deleted, which is that empty Solana row, tries to shorten its address and crashes.

This is why only some users hit it: the account must be registered with a wallet and must have started a Solana link without completing it. Email and Google users are not affected, because the Security tab only shows a wallet for accounts registered with a wallet.

### Why a user with MetaMask linked still hits it

The MetaMask wallet and the empty wallet are two different rows. Linking MetaMask (`verifyAndUpdateWalletAddress` then `updateUserWallet`) fills the EVM row correctly. The empty row is the Solana slot. Our own Wallets tab creates it: Add Another Wallet, Solana, runs `useLinkWallet.ts`. Once Phantom is connected and has given an address, it calls `/web3-auth/solana-generate-nonce` (the backend creates the Solana row right away with only the one time code), then asks Phantom to sign, and only after the signature is sent does the backend save the Solana address. Closing the Phantom connect popup does not create the row, because the code is only requested after Phantom connects. The row stays empty when the user connects Phantom and then rejects the signature request, or when the final add wallet call fails (for example because that Solana wallet is already on another account). Because the backend lists Solana first, the Security tab picks that empty row and never reaches the MetaMask wallet.

To confirm on a given account, someone with database access can run `SELECT network, "walletAddress", "isDeleted" FROM tbl_wallet_address WHERE "userId" = '<user id>';` and expect an `evm_network` row with the 0x address and a `solana` row with null.

## Who is affected

Not having a Solana wallet linked is fine. Only users who started linking a Solana wallet and did not finish get the crash.

| User | Solana row in the database | Security tab |
| --- | --- | --- |
| MetaMask user who never touched Solana | No Solana row at all | Works |
| MetaMask user who linked Solana successfully | Solana row with an address | Works |
| MetaMask user who started linking Solana, connected Phantom, then rejected the signature (or the final add wallet call failed) | Solana row with no address | Crashes |
| MetaMask user who abandoned once, then retried and finished | Same row, now filled in | Works again |
| Email or Google user | Does not matter | Works (the card shows no wallet for them) |
| User who signed up with Solana | Solana row filled; the empty slot is EVM, which sorts after it | Works |

The empty Solana row is only created after someone adding a Solana wallet has connected Phantom and the backend hands out the code to sign, so this hits a few people, not everyone. Anyone who abandons a Solana link from now on will hit it too until the fix ships.

**Workaround today:** an affected user can open the Wallets tab and finish linking their Solana wallet. That fills the empty row and the Security tab loads again.

## What is confirmed and what is not

The crash and its cause in the code are confirmed. What sits in the affected account's database rows is inferred, because nobody has looked at them yet.

| Claim | Status | How it was checked |
| --- | --- | --- |
| The crash is `null.length` while drawing the sign in methods | Confirmed | The affected user's console error, plus the code it points to |
| Production frontend has the line without the address check | Confirmed | `origin/prod` of the frontend, `mapUser.ts` line 63 |
| The profile loads from `/users/user-multiple-wallet` | Confirmed | `api-endpoint.enum.ts` in the frontend |
| Production backend creates empty wallet rows on purpose | Confirmed | `origin/prod-new` of the backend, `user.service.ts`, including `setSolanaNonceForUser` |
| Production backend lists Solana wallets first | Confirmed | Same file, the sort in `toReturnUserDtoWithMultipleWalltAddress` |
| A wallet only shows on the Security tab for wallet signup accounts | Confirmed | `mapUserToSignInMethods` checks `isRegisteredWithWallet` |
| Finishing the Solana link fills the same row | Confirmed | `setSolanaNonceForUser` reuses the existing row; `updateUserWallet` writes the address into it |
| The affected account's empty row is the Solana one | Inferred | Best fit for a MetaMask user; prove it with the SQL query above. Another flow (the main site, an older backend version) could also have left an empty row |
| Each user type in the "Who is affected" table behaves as listed | Inferred | Read from the code, not tested with real accounts |

## Proof from the browser console

The console on the affected account shows the real error:

```
TypeError: Cannot read properties of null (reading 'length')
    at Array.map (<anonymous>)
```

This is exactly the empty address being measured inside the loop that draws each sign in method. The other red lines are side effects, not separate bugs:

| Console line | What it means |
| --- | --- |
| Minified React error #418 and #423 | React gave up drawing the page after the crash above |
| 401 on redirectauth/session | Normal check for a user not signed in through the main site; it was there before this crash |

## The fix

**Frontend (one line).** In `src/helpers/profile/mapUser.ts`, inside `mapUserToSignInMethods`, only pick a wallet that actually has an address, the same check the Wallets tab already uses:

```ts
// before
const wallet = user.walletAddress?.find((w) => !w.isDeleted)

// after
const wallet = user.walletAddress?.find((w) => !w.isDeleted && w.walletAddress)
```

After this, an account with an empty wallet row simply does not show that wallet in "How You Sign In", and the rest of the Security tab (email, Google, Change Password) loads normally. Nothing changes for accounts with valid data. The fix is not applied yet; it should go on a hotfix branch so it can reach production without waiting for other work.

**Backend (no clean up needed).** The empty wallet row is a placeholder the backend creates on purpose (see "Why the empty wallet exists"), so the database does not need fixing. The fix belongs in the frontend: skip wallet slots that have not been filled in yet. Optionally, the backend team could leave unfinished placeholder rows out of the `user-multiple-wallet` response, which would protect any other screen that reads this list.

**How to check the fix:** sign in with the affected account, open Profile, click Security. The page loads, and the console shows no `reading 'length'` error.
