import { useState } from 'react'
import { TbRefresh } from 'react-icons/tb'
import { FiArrowRight, FiX } from 'react-icons/fi'
import { PiSealCheck } from 'react-icons/pi'
import { BsCheck2 } from 'react-icons/bs'

import { PrimaryButton } from '@/design-system/primitives/button'
import styles from './UDReverseNew.module.scss'

interface UDReverseNewProps {
  domain: string
  currentRecord: string
}

export function UDReverseNew({ domain, currentRecord }: UDReverseNewProps) {
  const [showSuccess, setShowSuccess] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const isAlreadySet = confirmed || (!!currentRecord && currentRecord === domain)

  const handleModalClose = () => {
    setShowSuccess(false)
    setConfirmed(true)
  }

  return (
    <section className={styles.section}>
      <div className={styles.titleRow}>
        <TbRefresh className={styles.syncIcon} aria-hidden="true" />
        <h2 className={styles.title}>Web3 Identity - Onchain identity</h2>
      </div>

      <p className={styles.subtitle}>
        Your primary on-chain identity is what apps and wallets display instead of your raw address.
      </p>

      <div className={styles.body}>
        {isAlreadySet ? (
          <div className={`${styles.card} ${styles.cardStandalone}`}>
            <p className={styles.cardHint}>Will Set To This Identity</p>
            <div className={styles.cardValueRow}>
              <p className={styles.cardValueBlue}>{domain}</p>
              <PiSealCheck className={styles.sealIcon} aria-hidden="true" />
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
                <p className={styles.cardHint}>Will Set To This Identity</p>
                <p className={styles.cardValueBlue}>{domain}</p>
              </div>
            </div>

            <PrimaryButton
              className={styles.actionBtn}
              onClick={() => setShowSuccess(true)}
              icon={<FiArrowRight aria-hidden="true" />}
              iconPosition="right"
            >
              Set To {domain}
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
          onClick={e => { if (e.target === e.currentTarget) handleModalClose() }}
        >
          <div className={styles.modal}>
            {/* Close button */}
            <button
              type="button"
              className={styles.closeBtn}
              onClick={handleModalClose}
              aria-label="Close"
            >
              <FiX size={18} aria-hidden="true" />
            </button>

            {/* Green check icon */}
            <div className={styles.iconWrap}>
              <div className={styles.iconOuter}>
                <div className={styles.iconInner}>
                  <BsCheck2 className={styles.checkIcon} aria-hidden="true" />
                </div>
              </div>
              <div className={styles.iconShadow} aria-hidden="true" />
            </div>

            {/* Text */}
            <div className={styles.modalText}>
              <p className={styles.modalTitle}>Updated Successfully</p>
              <p className={styles.modalSubtitle}>
                Your primary on-chain identity has been updated. Apps and wallets will now display your identity instead of your raw wallet address. Changes may take a few minutes to propagate across all integrated protocols.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default UDReverseNew
