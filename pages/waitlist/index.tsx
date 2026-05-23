import type { NextPage } from 'next'
import Head from 'next/head'
import React, { useCallback, useState } from 'react'
import {
  WaitlistNav,
  WaitlistHero,
  WaitlistSuccessHero,
  WaitlistLeaderboard,
  WaitlistLoginPage,
} from '@/design-system/composites/waitlist'
import styles from './waitlist.module.scss'

type View = 'home' | 'login' | 'dashboard'

const WaitlistPage: NextPage = () => {
  const [view, setView] = useState<View>('home')

  const handleRegistered = useCallback(() => setView('dashboard'), [])
  const handleAlreadyRegistered = useCallback(() => setView('login'), [])
  const handleLoginComplete = useCallback(() => setView('dashboard'), [])
  const handleLogout = useCallback(() => setView('login'), [])

  return (
    <>
      <Head>
        <title>Join the Waitlist — Endless Domains Identity OS</title>
        <meta
          name="description"
          content="Secure your spot in the Endless Domains Identity OS. Your on-chain history across multiple chains and wallets, collapsed into a single reputation score. Permanently yours."
        />
        <meta property="og:title" content="Join the Waitlist — Endless Domains Identity OS" />
        <meta
          property="og:description"
          content="One identity. Multiple chains, multiple wallets, multiple actions. Join before it fills."
        />
        <meta name="robots" content="index, follow" />
      </Head>

      <div className={styles.page}>
        {view === 'home' && (
          <>
            <WaitlistNav onAlreadyRegistered={handleAlreadyRegistered} />
            <main className={styles.main}>
              <WaitlistHero onComplete={handleRegistered} />
              <WaitlistLeaderboard isJoined={false} onLogout={handleLogout} />
            </main>
          </>
        )}

        {view === 'login' && (
          <WaitlistLoginPage
            onComplete={handleLoginComplete}
            onBackToHome={() => setView('home')}
            onLogout={handleLogout}
          />
        )}

        {view === 'dashboard' && (
          <>
            <WaitlistNav isRegistered onLogout={handleLogout} />
            <main className={styles.main}>
              <WaitlistSuccessHero />
              <WaitlistLeaderboard isJoined onLogout={handleLogout} />
            </main>
          </>
        )}
      </div>
    </>
  )
}

export default WaitlistPage
