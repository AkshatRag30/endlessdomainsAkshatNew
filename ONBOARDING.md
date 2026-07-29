# Endless Domains Marketplace Frontend, Full Onboarding Guide

This document explains the entire frontend repo in plain language, how the code is organized, how data and auth actually flow through the app, and gives you a concrete order to start working in it. It was written by reading through the real files in this repo, so it reflects what is actually here today, including a few rough edges you should know about up front.

## What this repo actually is

This is a Next.js frontend only. There is no backend code living in this repository. Everything you see here talks to an external REST API hosted elsewhere, currently pointing at a staging environment at apistage.endlessdomains.io. So when people say "the backend," they mean that separate API service, not anything in this folder.

The app itself is a marketplace for web3 domains, ENS names and similar. Users can browse listings, connect a crypto wallet or log in with email or Google, buy and sell domains, list domains in bulk, watch domains they're interested in, and view their transaction history and analytics.

## The technology stack, in practice

It's built on Next.js 15 using the older Pages Router, meaning routes are just files under the pages folder, not the newer app folder convention. React is pinned to version 18.3.1 across the board. TypeScript is used everywhere with strict mode turned on, and there's a path alias so anything imported as "@/something" actually means src slash something.

For state and data fetching, Redux Toolkit is the real workhorse, specifically RTK Query for almost all API calls. React Query is also installed and wired into the app, but in practice nothing seems to actually use it for fetching data, it looks like it's only there because a wallet library needs it as a dependency. So don't go looking for React Query calls when tracing data flow, look for RTK Query instead.

For wallet and web3 functionality, the app uses wagmi and viem together with Reown AppKit, formerly known as Web3Modal, for the connect wallet popup, and ethers version 5 for lower level signing and address work.

For UI, this is a Bootstrap 5 driven app. Most of what you see styled comes from Bootstrap classes and large global stylesheets, not from any component library like Material UI. Icons come from lucide-react and react-icons, charts are done with recharts, carousels use react-slick, and toast notifications go through react-toastify with some custom wrapper components on top.

One important thing to know right away, Tailwind CSS is configured in this project but is not actually active. Both the tailwind config file and the postcss config file have their entire contents commented out. So if you ever see a Tailwind-looking class name somewhere, know that it will not do anything, the styling is coming from somewhere else.

The dev server always runs on port 3002, not the usual 3000, both in local development and in production. That's set directly in the npm scripts.

## How the app boots up

Everything starts in pages/_app.tsx, which is the single wrapper around every page in the app. Here's the order things get set up in, which matters if you ever need to add something new that depends on auth, wallet state, or Redux.

First comes the Google OAuth provider, so Google sign in is available everywhere. Then comes a custom AuthContext provider, which is the app's source of truth for whether someone is logged in. Then comes the Wagmi provider for wallet connectivity, then the React Query provider, even though it's mostly unused, then the Redux store provider. Inside all of that, a handful of components get mounted globally, an auto logout handler that watches for session expiry and inactivity, an init provider that hooks up the wallet's raw provider into an ethers object, the main app content, and the toast notification container.

There's also a background timer running every sixty seconds in _app.tsx that checks whether your login token has expired, and if it has, forces a page reload after clearing cookies. So session expiry is being actively policed in the background the whole time the app is open.

## Routing and pages

Since this uses the Pages Router, every file under the pages folder becomes a URL automatically. Here's what exists today.

The homepage lives at pages/index.tsx and is the main marketing and browsing landing page, pulling in recent sales, domain listings matching search, trending domains and live crypto prices.

Login, register, forgot password and reset password success pages handle the traditional auth flows. Slightly oddly, there are two copies of the login page, one at pages/login and one at pages/(auth)/login, both rendering the exact same component. The parenthesized folder is a Next.js App Router convention that doesn't actually do anything meaningful in the Pages Router, so this looks like a leftover from an earlier experiment rather than something intentional. If you're hunting for the real login page to edit, either one works today since they render identical code, but this duplication is worth cleaning up eventually.

The profile section, under pages/profile, is where a logged in user manages their account, their owned domains, their watchlist, their analytics dashboard, and a couple of confirmation pages shown after certain actions. The domains page here is the most complex page in the app, handling pagination, tab switching between listed and unlisted domains, TLD filtering, and search.

Seller portfolio, at a dynamic route keyed by a hash in the URL, is a public storefront page for a given seller, no login required to view it, though buying still requires being logged in and having a wallet connected.

Transaction history shows a full filterable and sortable table of everything the user has bought, sold, listed or delisted.

The web3-domain-item page and the ens-marketplace page are both storefronts showing all domain listings, with ens-marketplace specifically filtered down to just .eth domains and styled as its own dedicated experience.

The redirect page is a quiet, invisible page with no UI of its own, it exists purely to hand off a login session between this marketplace app and what looks like a separate main company website, using shared cookies.

About us, contact us, and privacy policy are static informational pages, and coming soon and the 404 page round out the rest.

## The src folder, piece by piece

The src/component folder is where almost all UI lives, organized loosely by feature area rather than strict atomic design. You'll find a large modals folder covering everything from buying a domain to bulk listing to date pickers, a toast-message folder with pre-built success, error, warning and info toast variants you're expected to reuse rather than building your own, a web3 folder holding raw contract ABI JSON files for each supported blockchain, and then a long list of feature-specific component folders like header, footer, domain-search, wallet-connect, and profile.

src/config holds one important file, the wagmi configuration, which defines every blockchain network the wallet connector supports.

src/constants holds the base URL for the API and a big list of fully built endpoint URLs, one per backend route. Worth flagging directly, there's an API key constant hardcoded in plaintext in this folder, which is a security issue you should be aware of and probably want to fix at some point.

src/context holds the AuthContext, which is the single place the whole app checks to know if a user is logged in.

src/core is really the backbone of the app's logic. Inside it, the enum folder has the master list of every backend API path as well as the cookie key names used for storing tokens, the model folder has shared TypeScript types, the services folder has the actual HTTP calling code, and the redux folder has the whole Redux Toolkit setup including all the RTK Query endpoint definitions split out by feature, like domain listings, user profile, watchlist, crypto prices and payments.

src/data holds static reference lists, most notably the full list of supported domain extensions the platform recognizes.

src/helpers has small utilities like turning any thrown error into a user-friendly message array, and basic email validation.

src/hooks and src/utils both hold custom hooks, split inconsistently between the two folders, so when looking for a hook check both places.

src/lib has two important files, the auto logout handler mentioned earlier, and a small singleton that holds onto the current wallet provider so any part of the app can grab it without needing to be nested inside a specific React context.

src/template holds the shared page layout component that every page wraps itself in, handling the header, footer, and loading of some global scripts and stylesheets.

src/types is a large collection of plain TypeScript interfaces describing the shapes of data coming back from the API.

## How the app talks to the backend

This is one of the more important things to understand, because there are actually two different mechanisms doing this job side by side, for historical reasons.

The newer, and now dominant, mechanism is RTK Query. Most of what you'll touch day to day, domain listings, user profile, watchlist, analytics, transaction history, goes through RTK Query endpoints that generate ready to use hooks, so you'll see calls like fetching domain listings or fetching a user profile done as a simple hook call inside a component, with loading and error states handled for you automatically.

The older mechanism is a hand rolled set of functions built on both raw fetch and axios, living in the services folder inside src/core. This is mostly used for one-off calls like logging in, registering, wallet authentication, and logging out, rather than for the bulk data fetching. It also has its own error handling and token refresh logic that operates somewhat independently from the RTK Query side, so if you're debugging an auth related network issue, know there are genuinely two separate code paths that could be involved depending on which action you're looking at.

Every request, regardless of which mechanism sends it, gets the user's access token attached as an authorization header, read from a cookie. Every backend URL that gets called is built the same way, the base API URL from configuration, plus a path defined in that master enum of endpoint strings.

## How wallet connection works

When a user clicks connect wallet, a modal from Reown AppKit opens up, letting them pick a wallet like MetaMask or WalletConnect. Once connected, the app doesn't just treat that as being logged in, it goes through a proper challenge flow. It asks the backend for a one-time nonce tied to that wallet address, has the user sign that nonce as a message using their wallet, and then sends that signature back to the backend to prove they actually control that address. If that checks out, the backend treats it as a real login, exactly the same as an email and password login would.

Separately from that authentication flow, the wallet's underlying connection also gets wrapped in an ethers.js provider object and stashed in a simple shared holder, so that when a user actually buys or sells a domain and the app needs to send a real blockchain transaction, any component can reach in and grab that active wallet connection without needing to be specially wired up for it.

The wallet configuration currently lists quite a few blockchain networks together, including some production networks and some old test networks side by side, which is a bit unusual for a live product and worth asking the team about if you're not sure which ones are actually meant to be live right now.

## How login and session state work

There are three ways to log in, plain email and password, Google sign in, and the wallet signature flow described above. All three of them end up doing the exact same thing once they succeed, they store an access token and a refresh token in cookies, and they tell the shared AuthContext that the user is now logged in.

From that point on, the entire app treats that AuthContext as the single source of truth for whether someone is logged in. A wrapper component checks this on every page render and will redirect people away from account pages if they aren't logged in, or away from the login page if they already are.

Session expiry is handled proactively, not just reactively. There's a component mounted globally that watches the token's expiry time and will prompt the user to stay logged in a few minutes before it actually expires, that also logs people out automatically after thirty minutes of inactivity, and that keeps login state in sync across multiple open browser tabs.

Worth knowing, the middleware file that Next.js would normally use for server level route protection isn't actually doing anything right now, it used to have logic to restrict access by IP address but that's all commented out. So all of the access control you see today is happening in the browser, in React state, not on the server.

## Environment configuration, and a couple of things to double check

The app expects its backend URL and various other settings to come in through environment variables at build time. Right now, looking at the committed environment file in this repo, the variable name it defines doesn't actually match the variable name the app's configuration is expecting to read, which likely means either there's a separate local environment file on your machine that has the correct one, or this is worth flagging to a teammate since as committed it wouldn't point the app at the right backend. It would be worth confirming with whoever owns deployment that this isn't causing confusion for other new developers too.

In real deployments, the actual environment file gets pulled down fresh from a private cloud storage bucket as part of the deployment process, rather than living in the repo, so production secrets are never actually committed here, just this one local development file.

## How this gets deployed

This app does not deploy through Vercel, even though the generated readme file still mentions it. It deploys through AWS CodeDeploy onto a regular server, managed by a process manager called PM2. When a deployment runs, it copies the whole repo onto the server, pulls down the correct environment file for that environment from cloud storage, installs dependencies, builds the app, and then restarts it under PM2, still listening on that same port 3002. There's no containerization involved, and no automated test step as part of this pipeline today.

## Rough edges worth knowing about, so they don't surprise you later

There's a hardcoded API key sitting in plaintext in the constants folder, which shouldn't really be committed to source control.

There are two parallel HTTP calling mechanisms as described above, which can make tracing a network request take a bit longer than you'd expect until you get used to which one handles which kind of call.

There's an unused, empty Redux slice sitting in the codebase that isn't wired into anything, safe to ignore, and likely fine to delete once you're comfortable in the codebase.

A couple of files in the repo have literal typos in their filenames, including a stray trailing space, which can be easy to trip over if you're typing out an import path by hand instead of letting your editor autocomplete it.

Bootstrap's CSS actually gets loaded twice, once through a normal import and once through a separate tag in the page layout, which is redundant but not currently breaking anything.

## Where to actually start working

Given all of the above, here's the order I'd suggest if you're brand new to this codebase and want to get productive quickly rather than trying to absorb everything at once.

Start by just running the app locally and clicking through it as a regular user would, browse the homepage, try the search, open a few domain listings, and try connecting a test wallet if you have one set up. Seeing the real behavior first will make everything else click faster than reading code cold.

Next, open pages/_app.tsx and read it slowly. It's not long, and understanding the order providers are set up in will make every other file's behavior make sense, especially anything involving auth or wallet state.

After that, open src/context/AuthContext.tsx and src/component/ProtectedRoute.tsx together. These two files define the entire logic of who is allowed to see what, and you'll refer back to this mental model constantly.

Then pick one simple page you understand conceptually, the about us or contact us page are good choices, and trace it end to end, from the file under pages, to the component it renders, to any RTK Query hook it calls, to the endpoint definition that hook comes from, to the raw path string in the endpoint enum. Doing this once by hand for a simple page will teach you the whole data fetching pattern faster than reading the Redux folder in isolation.

Once that clicks, move to a page that touches wallet functionality, like the buy now flow on the homepage or a domain listing page, and trace how connecting a wallet, signing a nonce, and eventually sending a blockchain transaction all fit together, using src/component/wallet-connect and pages/initProvider.tsx as your anchor points.

From there you'll have enough context to comfortably pick up real tickets, whether that's a new page, a new component, or a bug fix, since you'll already understand where routing lives, where state lives, where API calls are made, and how auth and wallet connection gate access to things.

If you get stuck on anything specific, the fastest way to find your footing is to search for the exact text you see on screen inside src/component, since almost everything is organized by feature folder with a name that matches what you'd expect.
