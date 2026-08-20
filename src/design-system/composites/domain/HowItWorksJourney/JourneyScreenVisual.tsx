import React from 'react'
import Image from 'next/image'

import type { CrossfadePhase } from './useCrossfade'
import type { JourneyScreen } from './journeyData'
import styles from './HowItWorksJourney.module.scss'

interface JourneyScreenVisualProps {
  screen: JourneyScreen
  phase: CrossfadePhase
}

export function JourneyScreenVisual({ screen, phase }: JourneyScreenVisualProps) {
  return (
    <div className={styles.screenVisual} data-phase={phase}>
      <div className={styles.screenImageWrap}>
        {screen.image ? (
          <Image
            src={screen.image}
            alt={screen.imageAlt}
            width={840}
            height={546}
            sizes="(max-width: 767px) 300px, (max-width: 1200px) 360px, 420px"
            className={styles.screenImage}
            unoptimized
          />
        ) : (
          <div className={styles.screenPlaceholder} aria-hidden="true">
            <span className={styles.screenPlaceholderLabel}>{screen.placeholderLabel}</span>
          </div>
        )}
      </div>

      <div className={styles.screenText}>
        <span className={styles.screenNumber}>{screen.number}</span>
        <h3 className={styles.screenTitle}>{screen.title}</h3>
        <p className={styles.screenDescription}>{screen.description}</p>
      </div>
    </div>
  )
}

export default JourneyScreenVisual
