import React from 'react'
import Image from 'next/image'
import { getAllDomainProviders } from '@helpers/chaincurrency/chaincurrency'

import styles from './DomainProviders.module.scss'

const PROVIDERS = getAllDomainProviders()

// design-specific: the provider list is short (11 icons), so it's repeated 8x to build a track
// long enough that the loop seam never sits inside the visible viewport
const REPEAT_COUNT = 8

export function DomainProviders() {
  return (
    <div className={styles.wrap}>
      <div className={styles.marquee}>
        <ul className={styles.track}>
          {Array.from({ length: REPEAT_COUNT }, (_, setIndex) =>
            PROVIDERS.map(provider => (
              <li key={`${provider.provider}-${setIndex}`} className={styles.token} title={setIndex === 0 ? provider.label : undefined} aria-hidden={setIndex === 0 ? undefined : 'true'}>
                <span className={styles.avatar} style={{ borderColor: `${provider.colorName}5c` }}>
                  <Image src={provider.image} alt={setIndex === 0 ? provider.label : ''} width={26} height={26} className={styles.icon} />
                </span>
              </li>
            )),
          )}
        </ul>
        <span className={styles.fadeLeft} aria-hidden="true" />
        <span className={styles.fadeRight} aria-hidden="true" />
      </div>
    </div>
  )
}

export default DomainProviders
