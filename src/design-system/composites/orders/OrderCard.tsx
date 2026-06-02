import React, { useCallback } from 'react'
import Image from 'next/image'
import { IoArrowForward } from 'react-icons/io5'

import { getProviderLogo, type DomainProviderKey } from '@helpers/chaincurrency/chaincurrency'
import { getDisplayCost, type OrderEntry, type OrderStatus } from './ordersData'
import styles from './OrderCard.module.scss'

const STATUS_DOT: Record<OrderStatus, string> = {
  Cancelled: styles.dot_cancel,
  Completed: styles.dot_complete,
  Pending:   styles.dot_pending,
  Processing: styles.dot_processing,
}

function getProviderIcon(provider: string) {
  return getProviderLogo(provider as DomainProviderKey) ?? '/domain/ud.svg'
}

function truncateAddress(address: string): string {
  if (address.length <= 16) return address
  return `${address.slice(0, 7)}...${address.slice(-3)}`
}

interface OrderCardProps {
  order: OrderEntry
  onView: (order: OrderEntry) => void
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onView }) => {
  const handleView = useCallback(() => onView(order), [onView, order])

  const date = new Date(order.createdDateTime).toISOString().split('T')[0]
  const cost = getDisplayCost(order)
  const domains = order.domainDetailDtoList
  const primaryDomain = domains[0]
  const providerIcon = getProviderIcon(primaryDomain?.domainProvider ?? 'UD')
  const walletAddress = primaryDomain?.ownerAddress ?? null
  const isCompleted = order.orderStatus === 'Completed'

  return (
    <div className={styles.card}>

      {/* ── Row 1: Domain name + Status ── */}
      <div className={styles.row}>
        <div className={styles.cell}>
          <div className={styles.domainRow}>
            <div className={styles.tokenCircle} aria-hidden="true">
              <Image src={providerIcon} alt="" width={26} height={26} />
            </div>
            <span className={styles.domainName}>{primaryDomain?.domainName ?? '—'}</span>
          </div>
        </div>
        <div className={styles.cell}>
          <div className={styles.statusRow}>
            <span
              className={`${styles.statusDot} ${STATUS_DOT[order.orderStatus]}`}
              aria-hidden="true"
            />
            <span className={styles.statusText}>{order.orderStatus}</span>
          </div>
        </div>
      </div>

      {/* ── Row 2: Explore + Transaction Date ── */}
      <div className={styles.row}>
        <div className={styles.cell}>
          <span className={styles.cellLabel}>Explore</span>
          <div className={isCompleted ? `${styles.walletBox} ${styles.walletBoxBlue}` : `${styles.walletBox} ${styles.walletBoxBlack}`}>
            <span className={styles.walletText}>
              {walletAddress ? truncateAddress(walletAddress) : 'N/A'}
            </span>
          </div>
        </div>
        <div className={styles.cell}>
          <span className={styles.cellLabel}>Transaction Date</span>
          <span className={styles.dateText}>{date}</span>
        </div>
      </div>

      {/* ── Row 3: Total Amount + Crypto Payments ── */}
      <div className={styles.row}>
        <div className={styles.cell}>
          <span className={styles.cellLabel}>Total Amount</span>
          <span className={styles.amountText}>${cost}</span>
        </div>
        <div className={styles.cell}>
          <div className={styles.paymentRow}>
            <span className={styles.paymentLabel}>Crypto Payments</span>
            <div className={styles.cryptoIconWrap} aria-hidden="true">
              <Image
                src="/domain/blockchain.png"
                alt=""
                width={17}
                height={9}
                className={styles.cryptoIcon}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 4: View button ── */}
      <div className={styles.actionRow}>
        <button
          type="button"
          className={styles.viewBtn}
          onClick={handleView}
          aria-label={`View order ${order.orderNumber}`}
        >
          View
          <IoArrowForward className={styles.viewBtnIcon} aria-hidden="true" />
        </button>
      </div>

    </div>
  )
}

export default OrderCard
