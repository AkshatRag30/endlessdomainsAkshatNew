# Wallet Login Page — Developer Reference

This document maps every file involved in the `/wallet-login` page so you can navigate the codebase quickly.

---

## Page Entry Point

| File | Purpose |
|------|---------|
| [pages/wallet-login.tsx](pages/wallet-login.tsx) | Main page component. Renders a two-panel layout — left branding section and right login section. |
| [pages/wallet-login.module.scss](pages/wallet-login.module.scss) | Page-level styles. Defines the two-panel split and responsive breakpoints. |

---

## Layout Components

### Left Panel

| File | Purpose |
|------|---------|
| [src/design-system/composites/auth/login_left_section.tsx](src/design-system/composites/auth/login_left_section.tsx) | Left panel component. Renders the 3D logo, floating coin arc, and decorative design elements. |
| [src/design-system/composites/auth/LoginLeftSection.module.scss](src/design-system/composites/auth/LoginLeftSection.module.scss) | Styles for floating coin animations, gradient diamond, and border overlays. |

### Right Panel

| File | Purpose |
|------|---------|
| [src/components/login_right_section/LoginRightSection.tsx](src/components/login_right_section/LoginRightSection.tsx) | Right panel container. Manages tab state and switches between the Web3 wallet view and Email login view. |
| [src/components/login_right_section/LoginRightSection.module.scss](src/components/login_right_section/LoginRightSection.module.scss) | Styles for the right panel layout, button stacks, and footer. |
| [src/components/login_right_section/EmailLoginView.tsx](src/components/login_right_section/EmailLoginView.tsx) | Email login form view. Contains the Google button, email input, password input, and remember me row. |
| [src/components/login_right_section/EmailLoginView.module.scss](src/components/login_right_section/EmailLoginView.module.scss) | Spacing and layout styles for the email form. |

---

## UI Components (src/components/ui/)

| File | Purpose |
|------|---------|
| [src/components/ui/LoginTabSwitcher.tsx](src/components/ui/LoginTabSwitcher.tsx) | Tab switcher for toggling between "Web3 Wallet" and "Email" login modes. |
| [src/components/ui/LoginTabSwitcher.module.scss](src/components/ui/LoginTabSwitcher.module.scss) | Active/inactive tab styles with crosshair frame overlay. |
| [src/components/ui/MultiChainWalletButton.tsx](src/components/ui/MultiChainWalletButton.tsx) | CTA button for multi-chain wallet login. Uses `coingroupbutton.svg` as its icon. |
| [src/components/ui/MultiChainWalletButton.module.scss](src/components/ui/MultiChainWalletButton.module.scss) | Colored frame background with white content area. |
| [src/components/ui/SolanaWalletButton.tsx](src/components/ui/SolanaWalletButton.tsx) | CTA button for Solana-specific wallet login. Uses `coinicon.svg` as its icon. |
| [src/components/ui/SolanaWalletButton.module.scss](src/components/ui/SolanaWalletButton.module.scss) | White background with crosshair frame overlay. |
| [src/components/ui/ContinueWithGoogleButton.tsx](src/components/ui/ContinueWithGoogleButton.tsx) | Google OAuth button shown in the Email login view. |
| [src/components/ui/ContinueWithGoogleButton.module.scss](src/components/ui/ContinueWithGoogleButton.module.scss) | Button styles with Google icon and label. |
| [src/components/ui/RememberMeForgotRow.tsx](src/components/ui/RememberMeForgotRow.tsx) | Row with "Remember me" checkbox and "Forgot password?" link. |
| [src/components/ui/RememberMeForgotRow.module.scss](src/components/ui/RememberMeForgotRow.module.scss) | Flex layout styles for this row. |

---

## Design System Primitives (src/design-system/primitives/)

| File | Purpose |
|------|---------|
| [src/design-system/primitives/TextInput.tsx](src/design-system/primitives/TextInput.tsx) | Reusable text input — used for the email field. |
| [src/design-system/primitives/TextInput.module.scss](src/design-system/primitives/TextInput.module.scss) | Text input styles. |
| [src/design-system/primitives/PasswordInput.tsx](src/design-system/primitives/PasswordInput.tsx) | Password input with show/hide toggle. Uses `eye-icon.svg`. |
| [src/design-system/primitives/PasswordInput.module.scss](src/design-system/primitives/PasswordInput.module.scss) | Password input styles including the toggle button. |

---

## Public Assets

All assets live under `public/wallet-login/` and are served at `/wallet-login/` at runtime.

### Coin Icons — `public/wallet-login/coin_icons/`

These are used by the left panel to render the floating coin arc.

| File | Chain / Brand |
|------|--------------|
| [public/wallet-login/coin_icons/Avatar.png](public/wallet-login/coin_icons/Avatar.png) | Unstoppable Domains |
| [public/wallet-login/coin_icons/Avatar (1).png](<public/wallet-login/coin_icons/Avatar (1).png>) | Arbitrum |
| [public/wallet-login/coin_icons/token.png](public/wallet-login/coin_icons/token.png) | ENS |
| [public/wallet-login/coin_icons/token (1).png](<public/wallet-login/coin_icons/token (1).png>) | Starknet |
| [public/wallet-login/coin_icons/token (2).png](<public/wallet-login/coin_icons/token (2).png>) | BNB |
| [public/wallet-login/coin_icons/token (3).png](<public/wallet-login/coin_icons/token (3).png>) | Generic / Dark token |
| [public/wallet-login/coin_icons/Tezos.png](public/wallet-login/coin_icons/Tezos.png) | Tezos |

### Logos and Design Elements — `public/wallet-login/logoanddesigns/`

Used by the left panel for decorative and branding elements.

| File | Used For |
|------|---------|
| [public/wallet-login/logoanddesigns/endless-3d-logo.png](public/wallet-login/logoanddesigns/endless-3d-logo.png) | 3D Endless Domains logo displayed prominently on the left panel. |
| [public/wallet-login/logoanddesigns/border.svg](public/wallet-login/logoanddesigns/border.svg) | Crosshair / corner-frame border overlay. Reused across multiple elements. |
| [public/wallet-login/logoanddesigns/gradientdiamond.svg](public/wallet-login/logoanddesigns/gradientdiamond.svg) | Blue gradient chevron shape rendered behind the coin arc. |
| [public/wallet-login/logoanddesigns/greyrectangles.svg](public/wallet-login/logoanddesigns/greyrectangles.svg) | Grey vertical bar used as a column indicator below the coin arc. |
| [public/wallet-login/logoanddesigns/lastdesigngroup.svg](public/wallet-login/logoanddesigns/lastdesigngroup.svg) | Bottom platform / ground decorative element on the left panel. |

### Right Section Assets — `public/wallet-login/right_side_assets/`

| File | Used In |
|------|--------|
| [public/wallet-login/right_side_assets/endlesslogo.svg](public/wallet-login/right_side_assets/endlesslogo.svg) | Endless Domains wordmark at the top of the right panel. |
| [public/wallet-login/right_side_assets/coingroupbutton.svg](public/wallet-login/right_side_assets/coingroupbutton.svg) | Icon inside `MultiChainWalletButton`. |
| [public/wallet-login/right_side_assets/coinicon.svg](public/wallet-login/right_side_assets/coinicon.svg) | Icon inside `SolanaWalletButton`. |
| [public/wallet-login/right_side_assets/eye-icon.svg](public/wallet-login/right_side_assets/eye-icon.svg) | Show/hide toggle icon inside `PasswordInput`. |
| [public/wallet-login/right_side_assets/google-g-icon.png](public/wallet-login/right_side_assets/google-g-icon.png) | Google logo inside `ContinueWithGoogleButton`. |

### Reference

| File | Purpose |
|------|---------|
| [public/wallet-login/left-panel-reference.png](public/wallet-login/left-panel-reference.png) | Design reference image for the left panel layout. Not rendered in production. |

---

## Component Tree (at a glance)

```
pages/wallet-login.tsx
├── login_left_section          (composites/auth/)
│   ├── endless-3d-logo.png
│   ├── coin_icons/             (7 chain icons)
│   ├── gradientdiamond.svg
│   ├── greyrectangles.svg
│   ├── border.svg
│   └── lastdesigngroup.svg
└── LoginRightSection           (components/login_right_section/)
    ├── endlesslogo.svg
    ├── LoginTabSwitcher        (components/ui/)
    ├── [Web3 view]
    │   ├── MultiChainWalletButton  (components/ui/)
    │   └── SolanaWalletButton      (components/ui/)
    └── [Email view — EmailLoginView]
        ├── ContinueWithGoogleButton  (components/ui/)
        ├── TextInput                 (design-system/primitives/)
        ├── PasswordInput             (design-system/primitives/)
        └── RememberMeForgotRow       (components/ui/)
```
