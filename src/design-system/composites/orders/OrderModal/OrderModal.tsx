import React, { useCallback, useEffect } from 'react'
import Image from 'next/image'
import { IoArrowForward } from 'react-icons/io5'
import { AiOutlineInfoCircle } from 'react-icons/ai'

import { getProviderLogo, type DomainProviderKey } from '@helpers/chaincurrency/chaincurrency'
import { PrimaryButton } from '@/design-system/primitives/button/PrimaryButton'
import { SecondaryButton } from '@/design-system/primitives/secondary-button/SecondaryButton'
import { type OrderEntry, type OrderStatus } from '../ordersData'

import styles from './OrderModal.module.scss'

// ── Helpers ───────────────────────────────────────────────────────────────────

function computeTotal(order: OrderEntry): string {
  const sum = order.domainDetailDtoList.reduce((acc, d) => acc + (d.price ?? 0), 0)
  return sum.toFixed(2)
}

// ── Variant config ────────────────────────────────────────────────────────────

const SEPARATOR_CLASS: Record<OrderStatus, string> = {
  Pending:    styles.separatorPending,
  Processing: styles.separatorProcessing,
  Completed:  styles.separatorCompleted,
  Cancelled:  styles.separatorCancelled,
}

// ── Props ─────────────────────────────────────────────────────────────────────

export interface OrderModalProps {
  order: OrderEntry
  variant: OrderStatus
  onClose: () => void
  onCancelOrder?: () => void
  onCheckout?: () => void
}

// ── Component ─────────────────────────────────────────────────────────────────

const OrderModal: React.FC<OrderModalProps> = ({
  order,
  variant,
  onClose,
  onCancelOrder,
  onCheckout,
}) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [onClose])

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose()
    },
    [onClose],
  )

  const grandTotal = computeTotal(order)
  const isPending = variant === 'Pending'
  const isCompleted = variant === 'Completed'

  return (
    <div className={styles.overlay} onClick={handleOverlayClick} role="presentation">
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-modal-title"
      >
        {/* ── Top: header + close corner ── */}
        <div className={styles.modalTop}>
          <div className={styles.headerContent}>
            <h2 id="order-modal-title" className={styles.title}>
              Order Details
            </h2>
            <p className={styles.subtitle}>
              Below are the list of domains purchased during this order.
            </p>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* ── Separator — color driven by variant ── */}
        <div className={`${styles.separator} ${SEPARATOR_CLASS[variant]}`} aria-hidden="true" />
        <div className={styles.separatorLine} aria-hidden="true" />

        {/* ── Domain table ── */}
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead className={styles.tableHead}>
              <tr>
                <th scope="col" className={styles.th}>Domain</th>
                <th scope="col" className={`${styles.th} ${styles.thAmount}`}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {order.domainDetailDtoList.length > 0 ? (
                order.domainDetailDtoList.map(domain => {
                  const icon = getProviderLogo(domain.domainProvider as DomainProviderKey) ?? '/domain/ud.svg'
                  return (
                    <tr key={domain.id}>
                      <td className={styles.td}>
                        <div className={styles.domainCell}>
                          <div className={styles.tokenCircle} aria-hidden="true">
                            <Image src={icon} alt="" width={26} height={26} />
                          </div>
                          <span className={styles.domainName}>{domain.domainName}</span>
                          {isCompleted && (
                            <a href="#" className={styles.manageLink} aria-label={`Manage ${domain.domainName}`}>
                              Manage
                              <IoArrowForward className={styles.manageLinkIcon} aria-hidden="true" />
                            </a>
                          )}
                        </div>
                      </td>
                      <td className={`${styles.td} ${styles.tdAmount}`}>
                        ${domain.price?.toFixed(2) ?? '0.00'}
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr className={styles.emptyRow}>
                  <td colSpan={2}>No domains found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── Grand total ── */}
        <div className={styles.grandTotal}>
          <span className={styles.grandTotalLabel}>Grand Total</span>
          <span className={styles.grandTotalAmount}>${grandTotal}</span>
        </div>

        {/* ── Footer: pending shows buttons, all others show contact support ── */}
        {isPending ? (
          <div className={styles.footer}>
            <SecondaryButton type="button" danger onClick={onCancelOrder ?? (() => {})}>
              Cancel Order
            </SecondaryButton>
            <PrimaryButton
              type="button"
              icon={<IoArrowForward />}
              iconPosition="right"
              onClick={onCheckout ?? (() => {})}
            >
              Checkout
            </PrimaryButton>
          </div>
        ) : (
          <div className={styles.contactSupportRow}>
            <a href="mailto:support@endlessdomains.io" className={styles.contactSupportLink}>
              <AiOutlineInfoCircle className={styles.contactSupportIcon} aria-hidden="true" />
              Contact Support
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderModal
