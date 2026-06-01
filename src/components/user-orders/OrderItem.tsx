import React, { useCallback, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import Image from 'next/image'
import { FiChevronDown } from 'react-icons/fi'
import { IoArrowForward } from 'react-icons/io5'
import { getProviderLogo, type DomainProviderKey } from '@helpers/chaincurrency/chaincurrency'
import PrimaryButton from '@/design-system/primitives/button'
import { getDisplayCost, type OrderEntry, type OrderStatus } from './ordersData'
import styles from './OrderItem.module.scss'

interface PopupCoords {
  top: number
  left: number
  width: number
}

function getProviderIcon(provider: string) {
  return getProviderLogo(provider as DomainProviderKey) ?? '/domain/ud.svg'
}

function truncateAddress(address: string): string {
  if (address.length <= 16) return address
  return `${address.slice(0, 7)}...${address.slice(-3)}`
}

const STATUS_DOT: Record<OrderStatus, string> = {
  Cancelled: styles.dot_cancel,
  Completed: styles.dot_complete,
  Pending: styles.dot_pending,
  Processing: styles.dot_processing,
}

interface OrderItemProps {
  order: OrderEntry
  onView: (order: OrderEntry) => void
}

const OrderItem: React.FC<OrderItemProps> = ({ order, onView }) => {
  const [expanded, setExpanded] = useState(false)
  const [popupCoords, setPopupCoords] = useState<PopupCoords | null>(null)
  const anchorRef = useRef<HTMLDivElement>(null)
  const popupRef = useRef<HTMLDivElement>(null)

  const closePopup = useCallback(() => setExpanded(false), [])

  const toggleExpand = useCallback(() => {
    if (!expanded && anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect()
      setPopupCoords({
        top: rect.bottom + 6,
        left: rect.left,
        width: Math.max(220, rect.width),
      })
      setExpanded(true)
    } else {
      closePopup()
    }
  }, [expanded, closePopup])

  useEffect(() => {
    if (!expanded) return
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      const outsideAnchor = !anchorRef.current || !anchorRef.current.contains(target)
      const outsidePopup = !popupRef.current || !popupRef.current.contains(target)
      if (outsideAnchor && outsidePopup) closePopup()
    }
    const handleCloseOnChange = () => closePopup()
    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('scroll', handleCloseOnChange, true)
    window.addEventListener('resize', handleCloseOnChange)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('scroll', handleCloseOnChange, true)
      window.removeEventListener('resize', handleCloseOnChange)
    }
  }, [expanded, closePopup])

  const date = new Date(order.createdDateTime).toISOString().split('T')[0]
  const cost = getDisplayCost(order)
  const domains = order.domainDetailDtoList
  const primaryDomain = domains[0]
  const isBulk = domains.length > 1
  const extraCount = domains.length - 1
  const providerIcon = getProviderIcon(primaryDomain?.domainProvider ?? 'UD')
  const walletAddress = primaryDomain?.ownerAddress ?? null
  const isCompleted = order.orderStatus === 'Completed'

  const handleView = useCallback(() => onView(order), [onView, order])

  return (
    <>
      <tr className={styles.row}>
        {/* Domain Name */}
        <td className={styles.td}>
          <div className={styles.domainCell}>
            <div className={styles.domainTopRow}>
              <div className={styles.tokenCircle} aria-hidden="true">
                <Image
                  src={providerIcon}
                  alt=""
                  width={26}
                  height={26}
                  className={styles.tokenIcon}
                />
              </div>
              <span className={styles.domainName}>{primaryDomain?.domainName ?? '—'}</span>
              {isBulk && (
                <button
                  type="button"
                  className={styles.bulkBadge}
                  onClick={toggleExpand}
                  aria-expanded={expanded}
                  aria-label={`${expanded ? 'Collapse' : 'Expand'} ${extraCount} more domains`}
                >
                  +{extraCount}
                </button>
              )}
            </div>
            {isBulk && (
              <div ref={anchorRef} className={styles.popupAnchor}>
                <button
                  type="button"
                  className={styles.viewAllBtn}
                  onClick={toggleExpand}
                  aria-expanded={expanded}
                >
                  View All Domain
                  <FiChevronDown
                    className={expanded ? `${styles.chevron} ${styles.chevronOpen}` : styles.chevron}
                    aria-hidden="true"
                  />
                </button>
              </div>
            )}
          </div>
        </td>

        {/* Status */}
        <td className={styles.td}>
          <div className={styles.statusCell}>
            <span
              className={`${styles.statusDot} ${STATUS_DOT[order.orderStatus]}`}
              aria-hidden="true"
            />
            <span className={styles.statusText}>{order.orderStatus}</span>
          </div>
        </td>

        {/* Explore (wallet / blockchain explorer address) */}
        <td className={styles.td}>
          <div className={isCompleted ? `${styles.walletBox} ${styles.walletBoxBlue}` : `${styles.walletBox} ${styles.walletBoxBlack}`}>
            <span className={styles.walletText}>
              {walletAddress ? truncateAddress(walletAddress) : 'N/A'}
            </span>
          </div>
        </td>

        {/* Transaction Date */}
        <td className={styles.td}>
          <span className={styles.dateText}>{date}</span>
        </td>

        {/* Total Amount */}
        <td className={styles.td}>
          <div className={styles.amountCell}>
            <span className={styles.amountText}>${cost}</span>
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
        </td>

        {/* Action */}
        <td className={styles.tdAction}>
          <PrimaryButton
            type="button"
            size="sm"
            className={styles.viewBtn}
            onClick={handleView}
            aria-label={`View order ${order.orderNumber}`}
            icon={<IoArrowForward />}
            iconPosition="right"
          >
            View
          </PrimaryButton>
        </td>
      </tr>

      {/* Portal popup — rendered at document.body to escape clip-path/overflow on the card */}
      {expanded && popupCoords && typeof document !== 'undefined' && ReactDOM.createPortal(
        <div
          ref={popupRef}
          className={styles.popup}
          style={{
            '--popup-top': `${popupCoords.top}px`,
            '--popup-left': `${popupCoords.left}px`,
            '--popup-width': `${popupCoords.width}px`,
          } as React.CSSProperties}
          role="list"
          aria-label="All domains in this order"
        >
          {domains.map(domain => (
            <div key={domain.id} className={styles.popupItem} role="listitem">
              <div className={styles.popupTokenCircle} aria-hidden="true">
                <Image src={getProviderIcon(domain.domainProvider)} alt="" width={26} height={26} />
              </div>
              <span className={styles.popupDomainName}>{domain.domainName}</span>
            </div>
          ))}
        </div>,
        document.body
      )}
    </>
  )
}

export default OrderItem
