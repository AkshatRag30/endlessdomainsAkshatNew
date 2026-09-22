import React from 'react'
import { FiAlertCircle } from 'react-icons/fi'
import PrimaryButton from '@/marketplace-preview/design-system/primitives/buttons/primary-button'
import styles from './WalletPendingStep.module.scss'

export interface WalletPendingStepProps {
  status: 'pending' | 'error'
  heading: string
  subtext: string
}

// Ported from endlessdomainsAkshatNew's ScoreLoading composite (its own
// "wave" wallet-round-trip loader) rather than rebuilt — same two-layer
// animated wave inside a masked circle, sized down for this drawer's
// smaller icon. Kept as plain inline SVG (no external asset) exactly like
// that source component.
const WaveLoader = () => (
  <svg className={styles.waveSvg} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" fill="none" aria-hidden="true">
    <circle cx="21.6471" cy="21.6471" r="20.2941" stroke="white" strokeWidth="2.70588" />
    <mask id="listing-wallet-pending-wave-mask">
      <circle cx="21.6471" cy="21.6471" r="16.2353" fill="white" />
    </mask>
    <g mask="url(#listing-wallet-pending-wave-mask)">
      <g className={styles.waveBack}>
        <path
          d="M-200 24 C-189 18 -178 18 -167 24 C-156 30 -145 30 -134 24 C-123 18 -112 18 -101 24 C-90 30 -79 30 -68 24 C-57 18 -46 18 -35 24 C-24 30 -13 30 -2 24 C9 18 20 18 31 24 C42 30 53 30 64 24 C75 18 86 18 97 24 C108 30 119 30 130 24 C141 18 152 18 163 24 C174 30 185 30 196 24 V60 H-200 Z"
          fill="white"
          opacity={0.35}
        />
      </g>
      <g className={styles.waveFront}>
        <path
          d="M-200 26 C-189 20 -178 20 -167 26 C-156 32 -145 32 -134 26 C-123 20 -112 20 -101 26 C-90 32 -79 32 -68 26 C-57 20 -46 20 -35 26 C-24 32 -13 32 -2 26 C9 20 20 20 31 26 C42 32 53 32 64 26 C75 20 86 20 97 26 C108 32 119 32 130 26 C141 20 152 20 163 26 C174 32 185 32 196 26 V60 H-200 Z"
          fill="white"
        />
      </g>
    </g>
  </svg>
)

/**
 * Figma node 1:8505 ("Signing" / "Confirm the approval") for the pending
 * look, node 1:8101 ("Insufficient funds") for the error look — same shared
 * shell reused for confirm-approval / sign-order / insufficient-funds.
 * Figma keeps "Waiting on your wallet" visible even on the error frame (the
 * three states share one template rather than each getting bespoke copy),
 * so it's rendered unconditionally here rather than gated to status==='pending'.
 */
export const WalletPendingStep = ({ status, heading, subtext }: WalletPendingStepProps) => (
  <div className={styles.wrap}>
    {status === 'pending' ? (
      <div className={styles.outerRing}>
        <div className={styles.innerCircle}>
          <WaveLoader />
        </div>
      </div>
    ) : (
      <div className={styles.outerRing}>
        <FiAlertCircle size={52} aria-hidden="true" className={styles.errorIcon} />
      </div>
    )}

    <h3 className={styles.heading}>{heading}</h3>
    <p className={styles.subtext}>{subtext}</p>

    <div className={styles.waitingRow}>
      {status === 'pending' && <span className={styles.spinner} aria-hidden="true" />}
      Waiting on your wallet
    </div>
  </div>
)

export default WalletPendingStep

export const WalletPendingFooter = () => (
  <div className={styles.footer}>
    <PrimaryButton fullWidth disabled>
      Cancel in wallet
    </PrimaryButton>
  </div>
)
