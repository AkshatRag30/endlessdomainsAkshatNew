import React from 'react'
import Image, { StaticImageData } from 'next/image'
import { BsShieldCheck } from 'react-icons/bs'
import { LuWallet } from 'react-icons/lu'
import { PiWarningCircleLight } from 'react-icons/pi'

import styles from './RegistrationLeftSection.module.scss'

interface Props {
  chainName: string
  chainLogo: StaticImageData
  chainLogoWidth?: number
  chainLogoHeight?: number
  paymentLabel: string
}

const WHAT_HAPPENS_NEXT = [
  {
    id: 'wallet',
    Icon: LuWallet,
    title: 'Your wallet will open',
    getDescription: (chain: string) =>
      `Review the transaction details and approve to broadcast the registration to ${chain}.`,
  },
  {
    id: 'confirm',
    Icon: BsShieldCheck,
    title: "One confirmation, and you're done",
    getDescription: () =>
      "Once the transaction confirms on-chain, your domain is yours. You'll land on the success screen automatically.",
  },
]

export default function RegistrationLeftSection({ chainName, chainLogo, chainLogoWidth = 44, chainLogoHeight, paymentLabel }: Props) {
  return (
    <div className={styles.leftColCard}>
      <div className={styles.registeringOn}>
        <h2 className={styles.sectionHeading}>Registering on</h2>
        <div className={styles.chainCard}>
          <span className={`${styles.dot} ${styles.dotTopLeft}`}     aria-hidden="true" />
          <span className={`${styles.dot} ${styles.dotTopRight}`}    aria-hidden="true" />
          <span className={`${styles.dot} ${styles.dotBottomLeft}`}  aria-hidden="true" />
          <span className={`${styles.dot} ${styles.dotBottomRight}`} aria-hidden="true" />
          <div className={styles.chainCardLogoRow}>
            <Image
              src={chainLogo}
              alt=""
              className={styles.chainIcon}
              width={chainLogoWidth}
              height={chainLogoHeight ?? chainLogoWidth}
            />
            <span className={styles.chainName}>{chainName}</span>
          </div>
          <p className={styles.chainPaymentLabel}>{paymentLabel}</p>
        </div>
      </div>

      <div className={styles.whatNext}>
        <h2 className={styles.sectionHeading}>What happens next</h2>
        <ul className={styles.stepsList}>
          {WHAT_HAPPENS_NEXT.map(step => (
            <li key={step.id} className={styles.stepItem}>
              <div className={styles.stepIcon} aria-hidden="true">
                <step.Icon aria-hidden="true" />
              </div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.getDescription(chainName)}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.warningBanner} role="alert">
        <PiWarningCircleLight className={styles.warningIcon} aria-hidden="true" />
        <p className={styles.warningText}>
          Keep this tab open until you see the success screen. Closing it before confirmation may delay your registration.
        </p>
      </div>
    </div>
  )
}
