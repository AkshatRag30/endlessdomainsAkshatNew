import React from 'react'
import Image from 'next/image'
import { DOMAIN_PROVIDERS } from './providersData'

import styles from './ProvidersMarquee.module.scss'

// Each provider shows its icon + name (a stand-in until designed logo+name artwork
// exists), so one set is ~2000px — 4 repeats keep the loop seam off-screen everywhere.
const REPEAT_COUNT = 4

export function ProvidersMarquee() {
  return (
    <div className={styles.wrap}>
      <div className={styles.marquee}>
        <ul className={styles.track}>
          {Array.from({ length: REPEAT_COUNT }, (_, setIndex) =>
            DOMAIN_PROVIDERS.map(provider => (
              <li key={`${provider.provider}-${setIndex}`} className={styles.token} title={setIndex === 0 ? provider.label : undefined} aria-hidden={setIndex === 0 ? undefined : 'true'}>
                <span className={styles.avatar} style={{ borderColor: `${provider.colorName}5c` }}>
                  <Image src={provider.image} alt="" width={40} height={40} className={styles.icon} />
                </span>
                <span className={styles.name}>{provider.label}</span>
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

export default ProvidersMarquee
