import React, { useCallback, useEffect } from 'react'

import OrderDetailRow from '@/components/user-orders/OrderDetailRow'
import { type OrderEntry } from '@/components/user-orders/ordersData'
import { PrimaryButton } from '@/design-system/primitives/button/PrimaryButton'
import { SecondaryButton } from '@/design-system/primitives/secondary-button/SecondaryButton'

import styles from './OrderModal.module.scss'

interface OrderModalProps {
  order: OrderEntry
  onClose: () => void
}

const OrderModal: React.FC<OrderModalProps> = ({ order, onClose }) => {
  const isPending = order.orderStatus === 'Pending'
  const isProcessingBlockchain =
    order.orderStatus === 'Processing' &&
    ['Arbitrum', 'BinanceSmartChain'].includes(order.domainDetailDtoList?.[0]?.domainProvider ?? '')

  const showActions = isPending || isProcessingBlockchain

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

  return (
    <div className={styles.overlay} onClick={handleOverlayClick} role="presentation">
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-modal-title"
      >
        <div className={styles.header}>
          <h2 id="order-modal-title" className={styles.title}>
            Order Detail
          </h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className={styles.body}>
          <p className={styles.subtitle}>
            Below are the list of domains purchased during this order.
          </p>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Domain</th>
                  <th>Mint Status</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {order.domainDetailDtoList.length > 0 ? (
                  order.domainDetailDtoList.map(domain => (
                    <OrderDetailRow
                      key={domain.id}
                      domain={domain}
                      orderStatus={order.orderStatus}
                    />
                  ))
                ) : (
                  <tr className={styles.emptyRow}>
                    <td colSpan={3}>No Orders Found!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {showActions && (
            <div className={styles.actions}>
              {isPending && (
                <SecondaryButton danger onClick={() => {}}>
                  Cancel Order
                </SecondaryButton>
              )}
              <PrimaryButton size="sm" onClick={() => {}}>
                Continue Payment
              </PrimaryButton>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrderModal
