import React from 'react'
import type { AppProps } from 'next/app'
import '../src/design-system/styles/main.scss'
import '../styles/globals.css'
// Marketplace preview's own design tokens — every custom property and
// element reset in here is scoped under [data-marketplace-preview] (see
// src/marketplace-preview/design-system/styles/tokens.scss), so this can't
// affect any other page even though it's loaded globally (Next.js only
// allows global, non-module CSS to be imported from _app.tsx).
import '../src/marketplace-preview/design-system/styles/main.scss'
import { useSmoothScroll } from '@/hooks/useSmoothScroll'

function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useSmoothScroll()
  return <>{children}</>
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SmoothScrollProvider>
      <Component {...pageProps} />
    </SmoothScrollProvider>
  )
}
