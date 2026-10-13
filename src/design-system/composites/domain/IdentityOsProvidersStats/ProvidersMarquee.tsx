import React from 'react'
import Image from 'next/image'
import { DOMAIN_PROVIDERS } from './providersData'

import styles from './ProvidersMarquee.module.scss'

// Providers with full logo + name artwork show that; any provider without a `logo`
// falls back to icon + name text. One set is well over 1000px, so 4 repeats keep the seam off-screen.
const REPEAT_COUNT = 4
// Rendered wordmark height; width follows each logo's own aspect ratio.
const LOGO_HEIGHT = 30

export function ProvidersMarquee() {
  return (
    <div className={styles.wrap}>
      <div className={styles.marquee}>
        <ul className={styles.track}>
          {Array.from({ length: REPEAT_COUNT }, (_, setIndex) =>
            DOMAIN_PROVIDERS.map(provider => (
              <li key={`${provider.provider}-${setIndex}`} className={styles.token} title={setIndex === 0 ? provider.label : undefined} aria-hidden={setIndex === 0 ? undefined : 'true'}>
                {provider.logo ? (
                  <Image
                    src={provider.logo}
                    alt={setIndex === 0 ? provider.label : ''}
                    width={Math.round(LOGO_HEIGHT * (provider.logoAspect ?? 3))}
                    height={LOGO_HEIGHT}
                    className={styles.wordmark}
                    style={{ '--logo-scale': provider.logoScale ?? 1 } as React.CSSProperties}
                  />
                ) : (
                  <>
                    <span className={styles.avatar} style={{ borderColor: `${provider.colorName}5c` }}>
                      <Image src={provider.image} alt="" width={40} height={40} className={styles.icon} />
                    </span>
                    <span className={styles.name}>{provider.label}</span>
                  </>
                )}
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
