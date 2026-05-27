import { useState, useCallback } from 'react'
import { TbRefresh } from 'react-icons/tb'
import { FiArrowRight, FiX, FiCheck } from 'react-icons/fi'
import { PiSealCheck } from 'react-icons/pi'
import { GoArrowRight } from 'react-icons/go'

import { PrimaryButton } from '@/design-system/primitives/button'
import styles from './ARBReverseNew.module.scss'

interface ARBReverseNewProps {
  domain: string
  currentRecord: string
}

export function ARBReverseNew({ domain, currentRecord }: ARBReverseNewProps) {
  const [showSuccess, setShowSuccess] = useState(false)
  const [saved, setSaved] = useState(!!currentRecord)

  const handleSet = useCallback(() => {
    setShowSuccess(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setShowSuccess(false)
    setSaved(true)
  }, [])

  return (
    <>
      <section className={styles.section}>
        <div className={styles.titleRow}>
          <TbRefresh className={styles.syncIcon} aria-hidden="true" />
          <h2 className={styles.title}>Web3 Identity - Onchain Identity</h2>
        </div>

        <p className={styles.subtitle}>
          Your primary on-chain identity is what apps and wallets display instead of your raw address.
        </p>

        <div className={styles.body}>
          {saved ? (
            /* ── Already-set state: show domain with seal ── */
            <div className={`${styles.card} ${styles.cardStandalone}`}>
              <p className={styles.cardHint}>Will set to this identity</p>
              <div className={styles.cardValueRow}>
              <p className={styles.cardValueBlue}>{domain}</p>
              <PiSealCheck className={styles.sealIcon} aria-hidden="true" />
            </div>
            </div>
          ) : (
            /* ── Not-set state: before / after cards ── */
            <div className={styles.cardRow}>
              <div className={styles.card}>
                <p className={styles.cardHint}>Your wallet is currently not associated with any identity.</p>
                <p className={styles.cardValue}>No Identity Set</p>
              </div>

              <GoArrowRight className={styles.arrowIcon} aria-hidden="true" />

              <div className={styles.card}>
                <p className={styles.cardHint}>Will set to this identity</p>
                <p className={styles.cardValueBlue}>{domain}</p>
              </div>
            </div>
          )}

          {!saved && (
            <PrimaryButton
              className={styles.actionBtn}
              onClick={handleSet}
              icon={<FiArrowRight aria-hidden="true" />}
              iconPosition="right"
            >
              Set to {domain}
            </PrimaryButton>
          )}
        </div>
      </section>

      {showSuccess && (
        <div
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="arb-reverse-modal-title"
          onClick={e => { if (e.target === e.currentTarget) handleCloseModal() }}
        >
          <div className={styles.modal}>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={handleCloseModal}
              aria-label="Close"
            >
              <FiX size={18} />
            </button>

            <div className={styles.iconWrap} aria-hidden="true">
              <div className={styles.iconOuter}>
                <div className={styles.iconInner}>
                  <FiCheck className={styles.checkIcon} />
                </div>
              </div>
              <span className={styles.iconShadow} />
            </div>

            <div className={styles.modalText}>
              <h3 id="arb-reverse-modal-title" className={styles.modalTitle}>
                Updated Successfully.
              </h3>
              <p className={styles.modalSubtitle}>
                Your primary on-chain identity has been updated. Apps and wallets will now display your identity instead of your raw wallet address. Changes may take a few minutes to propagate across all integrated protocols.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ARBReverseNew
