import { useState, useCallback } from 'react'
import { TbRefresh } from 'react-icons/tb'
import { FiArrowRight, FiX, FiCheck } from 'react-icons/fi'
import { MdVerified } from 'react-icons/md'
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
    setSaved(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setShowSuccess(false)
  }, [])

  return (
    <>
      <section className={styles.section}>
        <div className={styles.titleRow}>
          <TbRefresh className={styles.syncIcon} aria-hidden="true" />
          <h2 className={styles.title}>Reverse Resolution</h2>
        </div>

        <p className={styles.subtitle}>
          Reverse resolution links your domain name to an address on the blockchain, letting apps show your domain instead of your wallet address.
        </p>

        <div className={styles.body}>
          {saved ? (
            /* ── Already-set state: show domain with seal ── */
            <div className={styles.cardRow}>
              <div className={styles.card}>
                <p className={styles.cardHint}>Primary Domain</p>
                <div className={styles.cardValueRow}>
                  <MdVerified className={styles.sealIcon} aria-hidden="true" />
                  <p className={styles.cardValueBlue}>{domain}</p>
                </div>
              </div>
            </div>
          ) : (
            /* ── Not-set state: before / after cards ── */
            <div className={styles.cardRow}>
              <div className={styles.card}>
                <p className={styles.cardHint}>Current reverse record</p>
                <p className={styles.cardValue}>{currentRecord || 'Not set'}</p>
              </div>

              <GoArrowRight className={styles.arrowIcon} aria-hidden="true" />

              <div className={styles.card}>
                <p className={styles.cardHint}>Will resolve to</p>
                <p className={styles.cardValue}>{domain}</p>
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
              Set Reverse Record
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
                Reverse Record Set
              </h3>
              <p className={styles.modalSubtitle}>
                Your ARB domain is now set as the primary reverse record for your wallet address.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ARBReverseNew
