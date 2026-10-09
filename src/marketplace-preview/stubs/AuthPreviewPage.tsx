import React, { useState } from 'react'
import PrimaryButton from '@/marketplace-preview/design-system/primitives/buttons/primary-button'
import { ThemeProvider } from '@/marketplace-preview/context/ThemeContext'
import {
  AuthDivider,
  AuthEmailForm,
  AuthFooterLink,
  AuthHeader,
  AuthMethodTabs,
  AuthPanel,
  AuthProviderButton,
  AuthRememberRow,
  AuthShell,
  AuthTextField,
  authPanelId,
  authTabId,
  type AuthMethod,
} from '@/marketplace-preview/design-system/composites/auth'

/**
 * Design-only stand-in for the source project's login and sign up pages
 * (src/component/auth-component and signup-component there). This project
 * has no auth backend, Google OAuth or wallet setup, so the buttons do
 * nothing and the email form only runs the same field checks and a short
 * fake "loading" state, to show the error and busy looks.
 */

const WALLET_ICONS = [
  { src: '/assets/img/Login/1.svg', alt: 'MetaMask' },
  { src: '/assets/img/Login/BinanceW.svg', alt: 'Binance Wallet' },
  { src: '/assets/img/Login/coinbaseW.svg', alt: 'Coinbase Wallet' },
  { src: '/assets/img/Login/walletconnectW.svg', alt: 'WalletConnect' },
  { src: '/assets/img/Login/TP.svg', alt: 'TokenPocket' },
]
const GOOGLE_ICON = [{ src: '/assets/img/Login/google.svg', alt: 'Google' }]

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const COPY = {
  login: {
    heading: 'Login to your Account',
    subtext: 'We’re thrilled to see you again! Please login to your account to continue.',
    tabsLabel: 'Login method',
    wallet: 'Login With Multi-Chain Wallet',
    google: 'Login With Google',
    submit: 'Login',
    footerPrompt: 'Don’t have an account?',
    footerLink: 'Signup',
    footerHref: '/design-preview/register',
  },
  signup: {
    heading: 'Get Started Now!',
    subtext: 'Join us now and start your journey into the decentralized web—discover, buy, and sell Web3 domains with ease.',
    tabsLabel: 'Sign up method',
    wallet: 'Sign Up With Multi-Chain Wallet',
    google: 'Sign Up With Google',
    submit: 'Create Account',
    footerPrompt: 'Already have an account?',
    footerLink: 'Login',
    footerHref: '/design-preview/login',
  },
} as const

export const AuthPreviewPage = ({ mode }: { mode: 'login' | 'signup' }) => {
  const copy = COPY[mode]
  const [activeTab, setActiveTab] = useState<AuthMethod>('wallet')
  const [values, setValues] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const check = (name: 'email' | 'password', value: string) => {
    if (name === 'email') return !value ? 'Email is required!' : EMAIL_PATTERN.test(value) ? '' : 'Please input valid email!'
    if (!value) return 'Password is required!'
    return mode === 'signup' && value.length < 8 ? 'Password must be at least 8 characters' : ''
  }

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name as 'email' | 'password'
    setValues((prev) => ({ ...prev, [name]: event.target.value }))
    setErrors((prev) => ({ ...prev, [name]: check(name, event.target.value) }))
  }

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const next = { email: check('email', values.email), password: check('password', values.password) }
    setErrors(next)
    if (next.email || next.password) return
    setLoading(true)
    window.setTimeout(() => setLoading(false), 1200)
  }

  const noop = (event: React.MouseEvent) => event.preventDefault()

  return (
    // data-marketplace-preview: this project scopes the preview's tokens to that attribute.
    <ThemeProvider>
    <div data-marketplace-preview>
      <AuthShell>
        <AuthHeader heading={copy.heading} subtext={copy.subtext} />
        <AuthMethodTabs idPrefix={mode} label={copy.tabsLabel} value={activeTab} onChange={setActiveTab} />

        <AuthPanel id={authPanelId(mode, 'wallet')} labelledBy={authTabId(mode, 'wallet')} hidden={activeTab !== 'wallet'}>
          <AuthProviderButton label={copy.wallet} tone="tinted" icons={WALLET_ICONS} onClick={noop} />
        </AuthPanel>

        <AuthPanel id={authPanelId(mode, 'email')} labelledBy={authTabId(mode, 'email')} hidden={activeTab !== 'email'}>
          <AuthProviderButton label={copy.google} icons={GOOGLE_ICON} onClick={noop} />
          <AuthDivider />
          <AuthEmailForm onSubmit={onSubmit}>
            <AuthTextField
              id={`${mode}-email`}
              label="Email Address"
              name="email"
              type="email"
              placeholder="Enter email"
              value={values.email}
              onChange={onChange}
              error={errors.email || undefined}
              autoComplete="email"
            />
            <AuthTextField
              id={`${mode}-password`}
              label="Password"
              name="password"
              type="password"
              placeholder="Enter password"
              value={values.password}
              onChange={onChange}
              error={errors.password || undefined}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
            {mode === 'login' && <AuthRememberRow checkboxId="login-remember" />}
            <PrimaryButton type="submit" fullWidth loading={loading}>
              {copy.submit}
            </PrimaryButton>
          </AuthEmailForm>
        </AuthPanel>

        <AuthFooterLink prompt={copy.footerPrompt} linkLabel={copy.footerLink} href={copy.footerHref} />
      </AuthShell>
    </div>
    </ThemeProvider>
  )
}

export default AuthPreviewPage
