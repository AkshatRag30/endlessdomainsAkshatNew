import type { NextPage } from 'next'
import Head from 'next/head'
import React, { useCallback, useState } from 'react'
import {
  WaitlistNav,
  WaitlistHero,
  WaitlistLeaderboard,
} from '@/design-system/composites/waitlist'
import styles from './waitlist.module.scss'

const WaitlistPage: NextPage = () => {
  const [isRegistered, setIsRegistered] = useState(false)

  const handleComplete = useCallback(() => {
    setIsRegistered(true)
  }, [])

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
        <WaitlistNav />

        <main className={styles.main}>
          <WaitlistHero onComplete={handleComplete} />
          <WaitlistLeaderboard isJoined={isRegistered} />
        </main>
      </div>
    </>
  )
}

export default WaitlistPage
