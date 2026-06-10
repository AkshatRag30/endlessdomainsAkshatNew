import React from 'react'
import type { AppProps } from 'next/app'
import '../src/design-system/styles/main.scss'
import '../styles/globals.css'
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
