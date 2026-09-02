import React from 'react'
import Image from 'next/image'
import { NODES } from './OnchainIdentityNetwork'
import styles from './OnchainIdentityNetworkMobile.module.scss'

// Figma's mobile reference lists every identity sequentially instead of the desktop's
// left/right paired rows — reordered here without touching NODES itself, so both
// breakpoints keep reading from the same source of truth.
const MOBILE_ORDER = ['social', 'mail', 'brand', 'wallet', 'dapp', 'login']
const MOBILE_NODES = MOBILE_ORDER.map(id => NODES.find(n => n.id === id)).filter(
  (n): n is (typeof NODES)[number] => Boolean(n),
)

// One discrete piece of the connector thread, sized to exactly the gap it occupies —
// from the logo down to the first card, or between one card and the next — so it
// starts and ends at the surrounding element's edge instead of running underneath it.
// Same 3-layer stroke recipe as the desktop paths (colored gradient + white glow), but
// fading in and out at both ends: the desktop curves run core-to-hex uninterrupted,
// while each of these sits isolated in a gap between two solid elements.
//
// A plain function returning JSX, not a component invoked as a JSX tag — this project's
// React/TS type setup rejects a `key` prop on any custom component (confirmed earlier
// with OwnershipComparisonMobile's card component), so `key` is set here directly on
// the wrapping intrinsic <div>, called as a normal function instead of `<Connector .../>`.
function renderConnectorSegment(key: string, gradientId: string, variant?: 'core') {
  return (
    <div key={key} className={styles.connector} data-variant={variant} aria-hidden="true">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradientId} gradientUnits="userSpaceOnUse" x1="50" y1="0" x2="50" y2="100">
            <stop offset="0%" stopColor="var(--color-purple-glow-0)" />
            <stop offset="50%" stopColor="var(--color-blue-primary-alpha-30)" />
            <stop offset="100%" stopColor="var(--color-purple-glow-0)" />
          </linearGradient>
        </defs>
        <path d="M 50 0 L 50 100" stroke={`url(#${gradientId})`} strokeWidth={9} strokeLinecap="round" vectorEffect="non-scaling-stroke" fill="none" />
        <path d="M 50 0 L 50 100" stroke="var(--color-white-alpha-70)" strokeWidth={4.5} strokeLinecap="round" vectorEffect="non-scaling-stroke" fill="none" />
      </svg>
    </div>
  )
}

// Mobile-only recomposition of OnchainIdentityNetwork — below tablet, the desktop's
// sticky, scroll-scrubbed path-drawing reveal has no scroll runway or room to work
// with, so this renders the same identities as a single flowing vertical list instead.
export function OnchainIdentityNetworkMobile() {
  return (
    <section className={styles.section} aria-labelledby="onchain-identity-mobile-heading">
      <header className={styles.header}>
        <div className={styles.eyebrowWrap}>
          <span className={styles.eyebrowBracketL} aria-hidden="true" />
          <span className={styles.eyebrowText}>One Domain, Every Identity</span>
          <span className={styles.eyebrowBracketR} aria-hidden="true" />
        </div>
        <h2 id="onchain-identity-mobile-heading" className={styles.heading}>
          <span className={styles.headingLine1}>One Domain Becomes Your</span>
          <span className={styles.headingLine2}>Whole Onchain Identity</span>
        </h2>
        <p className={styles.description}>
          Your onchain domain sits at the center. Every ray is something it becomes: one name radiating out into your whole
          presence on the internet.
        </p>
      </header>

      <div className={styles.diagram}>
        <div className={styles.core}>
          <Image
            src="/landing/centerlogo2.svg"
            alt="Onchain Domains identity mark"
            width={560}
            height={560}
            className={styles.coreLogo}
            unoptimized
          />
        </div>

        <div className={styles.list} role="list">
          {renderConnectorSegment('connector-core', 'onchainMobileConnector-core', 'core')}

          {MOBILE_NODES.flatMap((node, i) => {
            const itemEl = (
              <div key={node.id} className={styles.item} role="listitem">
                <span className={styles.itemHex} aria-hidden="true">
                  <node.Icon size={22} />
                </span>
                <h3 className={styles.itemTitle}>{node.title}</h3>
                <p className={styles.itemDesc}>{node.desc}</p>
              </div>
            )

            if (i === MOBILE_NODES.length - 1) return [itemEl]

            return [itemEl, renderConnectorSegment(`connector-${node.id}`, `onchainMobileConnector-${node.id}`)]
          })}
        </div>
      </div>
    </section>
  )
}

export default OnchainIdentityNetworkMobile
