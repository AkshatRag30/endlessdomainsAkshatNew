import { useState, useCallback } from 'react'
import { TbWorld } from 'react-icons/tb'
import { FiTrash2, FiArrowRight, FiChevronsRight } from 'react-icons/fi'
import { LuPlus } from 'react-icons/lu'

import { PrimaryButton } from '@/design-system/primitives/button'
import { SecondaryButton } from '@/design-system/primitives/secondary-button'
import styles from './park-domain.module.scss'

// Demo: set to a string to show "Parked" state, undefined for "UnParked"
const DEMO_IPFS_HASH = 'QmDemo123abc'

// ── Remove confirmation modal ──────────────────────────────────────────────────

function RemoveModal({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label="Confirm removal"
      onClick={e => { if (e.target === e.currentTarget) onCancel() }}
    >
      <div className={styles.removeModal}>
        <div className={styles.modalIconWrap}>
          <div className={styles.modalIconOuter}>
            <div className={styles.modalIconInner}>
              <FiTrash2 size={28} aria-hidden="true" />
            </div>
          </div>
        </div>

        <h2 className={styles.modalTitle}>Are You Sure You Want To Remove?</h2>

        <p className={styles.modalDesc}>
          Removing this parked identity will take your profile offline immediately. Your identity will stop earning passive revenue and your public profile will no longer be discoverable.
        </p>

        <div className={styles.modalActions}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={onCancel}
            aria-label="Cancel removal"
          >
            <span>Cancel</span>
            <FiChevronsRight size={16} aria-hidden="true" />
          </button>

          <PrimaryButton
            variant="error"
            className={styles.confirmBtnFill}
            onClick={onConfirm}
            icon={<FiArrowRight size={18} aria-hidden="true" />}
            iconPosition="right"
          >
            Confirm
          </PrimaryButton>
        </div>
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

const ParkedDomains = ({ domain, provider, disabled = false }: { domain: string; provider: string; disabled?: boolean }) => {
  const [currentRecord, setCurrentRecord] = useState<string | undefined>(DEMO_IPFS_HASH)
  const [showRemoveModal, setShowRemoveModal] = useState(false)

  const handleRemoveClick = useCallback(() => setShowRemoveModal(true), [])
  const handleRemoveCancel = useCallback(() => setShowRemoveModal(false), [])

  const handleRemoveConfirm = useCallback(() => {
    setShowRemoveModal(false)
    setCurrentRecord(undefined)
  }, [])

  const handleNavigation = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    console.log(`/editor/parkdomain?domain=${domain}&provider=${provider.toLowerCase()}`)
  }, [domain, provider])

  if (!domain) {
    return (
      <div className={styles.unavailable}>
        <p>Parked domains service not available</p>
      </div>
    )
  }

  return (
    <>
      {showRemoveModal && (
        <RemoveModal onCancel={handleRemoveCancel} onConfirm={handleRemoveConfirm} />
      )}

      <div className={styles.section}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.titleRow}>
            <TbWorld className={styles.titleIcon} aria-hidden="true" />
            <h2 className={styles.title}>Park Your Identity</h2>
          </div>
          <p className={styles.description}>
            {currentRecord
              ? 'Parking your identity lets you create an on-chain profile with contact info, social links, and a description. Others can discover and view your profile using your identity name. Your identity earns passive revenue while it sits parked.'
              : 'No parked profile set. Helper text: Park this identity to make it discoverable and start earning passive revenue.'}
          </p>
        </div>

        {disabled ? (
          <p className={styles.disabledMsg}>Sorry, this feature is not available yet for this provider.</p>
        ) : (
          <div className={styles.content}>
            {/* Status badge */}
            <div className={styles.badgeOuter}>
              <div className={styles.badgeInner}>
                <span className={currentRecord ? styles.dotParked : styles.dotUnparked} aria-hidden="true" />
                <span>Status: {currentRecord ? 'Parked' : 'UnParked'}</span>
              </div>
            </div>

            {currentRecord ? (
              /* ── Parked state ─────────────────────────── */
              <div className={styles.actionRow}>
                <SecondaryButton
                  danger
                  className={styles.removeWrap}
                  onClick={handleRemoveClick}
                  icon={<FiTrash2 size={17} aria-hidden="true" />}
                  iconPosition="right"
                >
                  remove
                </SecondaryButton>

                <PrimaryButton
                  className={styles.updateBtnFill}
                  onClick={handleNavigation}
                  icon={<FiArrowRight size={22} aria-hidden="true" />}
                  iconPosition="right"
                >
                  Park Identities
                </PrimaryButton>
              </div>
            ) : (
              /* ── UnParked state ───────────────────────── */
              <div className={styles.createRow}>
                <button
                  type="button"
                  className={styles.addIconBtn}
                  onClick={handleNavigation}
                  aria-label="Create parked domain"
                >
                  <LuPlus size={22} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={styles.createBtn}
                  onClick={handleNavigation}
                >
                  create
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default ParkedDomains
