import { useState } from 'react'
import { TbRefresh } from 'react-icons/tb'
import { FiArrowRight, FiX } from 'react-icons/fi'
import { PiSealCheckFill } from 'react-icons/pi'
import { BsCheck2 } from 'react-icons/bs'

import { PrimaryButton } from '@/design-system/primitives/button'
import styles from './BNBReverseNew.module.scss'

interface BNBReverseNewProps {
  domain: string
  currentRecord: string
}

export function BNBReverseNew({ domain, currentRecord }: BNBReverseNewProps) {
  const [showSuccess, setShowSuccess] = useState(false)
  const isAlreadySet = !!currentRecord && currentRecord === domain

  return (
    <section className={styles.section}>
      <div className={styles.titleRow}>
        <TbRefresh className={styles.syncIcon} aria-hidden="true" />
        <h2 className={styles.title}>Web3 identity</h2>
      </div>

      <p className={styles.subtitle}>
        Your primary Web3 identity is what apps and wallets display instead of your raw address.
      </p>

      <div className={styles.body}>
        {isAlreadySet ? (
          <div className={styles.card}>
            <p className={styles.cardHint}>Will Set To This Domain</p>
            <div className={styles.cardValueRow}>
              <p className={styles.cardValueBlue}>{domain}</p>
              <PiSealCheckFill className={styles.sealIcon} aria-hidden="true" />
            </div>
          </div>
        ) : (
          <>
            <div className={styles.cardRow}>
              <div className={styles.card}>
                <p className={styles.cardHint}>Your wallet is currently not associated with any domains</p>
                <p className={styles.cardValue}>No Identity Set</p>
              </div>

              <FiArrowRight className={styles.arrowIcon} aria-hidden="true" />

              <div className={styles.card}>
                <p className={styles.cardHint}>Will Set To This Domain</p>
                <p className={styles.cardValueBlue}>{domain}</p>
              </div>
            </div>

            <PrimaryButton
              className={styles.actionBtn}
              onClick={() => setShowSuccess(true)}
              icon={<FiArrowRight aria-hidden="true" />}
              iconPosition="right"
            >
              Update To {domain}
            </PrimaryButton>
          </>
        )}
      </div>

      {/* ── Success modal ──────────────────────────────────────────────────── */}
      {showSuccess && (
        <div
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-label="Update successful"
          onClick={e => { if (e.target === e.currentTarget) setShowSuccess(false) }}
        >
          <div className={styles.modal}>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={() => setShowSuccess(false)}
              aria-label="Close"
            >
              <FiX size={18} aria-hidden="true" />
            </button>

            <div className={styles.iconWrap}>
              <div className={styles.iconOuter}>
                <div className={styles.iconInner}>
                  <BsCheck2 className={styles.checkIcon} aria-hidden="true" />
                </div>
              </div>
              <div className={styles.iconShadow} aria-hidden="true" />
            </div>

            <div className={styles.modalText}>
              <p className={styles.modalTitle}>Updated Successfully</p>
              <p className={styles.modalSubtitle}>
                Your primary Web3 identity has been updated successfully.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default BNBReverseNew
