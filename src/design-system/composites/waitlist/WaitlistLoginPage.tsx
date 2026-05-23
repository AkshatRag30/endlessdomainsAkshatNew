import React, { useCallback } from 'react'
import { WaitlistNav } from './WaitlistNav'
import { WaitlistHero } from './WaitlistHero'
import { WaitlistLoginCard } from './WaitlistLoginCard'
import { WaitlistLeaderboard } from './WaitlistLeaderboard'

export interface WaitlistLoginPageProps {
  onComplete: () => void
  onBackToHome?: () => void
  onLogout?: () => void
}

export function WaitlistLoginPage({ onComplete, onBackToHome, onLogout }: WaitlistLoginPageProps) {
  const renderLoginCard = useCallback(() => <WaitlistLoginCard onComplete={onComplete} />, [onComplete])

  return (
    <>
      <WaitlistNav isRegistered={false} onAlreadyRegistered={onBackToHome} />
      <main>
        <WaitlistHero renderCard={renderLoginCard} />
        <WaitlistLeaderboard isJoined={false} onLogout={onLogout} />
      </main>
    </>
  )
}

export default WaitlistLoginPage
