import React from 'react'
import Link from 'next/link'
import type { MarketplaceOrder } from '@/marketplace-preview/types/marketplace'
import GlassCard from '@/marketplace-preview/design-system/primitives/cards/glass-card'
import KeyValueRows from '@/marketplace-preview/design-system/primitives/cards/key-value-rows'
import TokenSuffix from '@/marketplace-preview/design-system/primitives/token-suffix'
import InfoNote from '@/marketplace-preview/design-system/primitives/banners/info-note'
import { formatToken, PLATFORM_FEE_RATE, truncateHash } from '@/marketplace-preview/helpers/token-format/tokenFormat'
import { txExplorerHref } from '@/marketplace-preview/helpers/marketplace/routes'
import DomainPriceHeader from '../../shared/DomainPriceHeader'
import styles from './OrderReceiptCard.module.scss'

export interface OrderReceiptCardProps {
  order: MarketplaceOrder
}

const Amount = ({ value }: { value: number }) => (
  <span className={styles.amount}>
    {formatToken(value)}
    <TokenSuffix iconSize={15} className={styles.token} />
  </span>
)

/**
 * Figma node 5:7492: the name as bought, then what was paid and where it
 * went.
 *
 * Figma quirks (plan §2.7 Q9/Q10): the frame shows "Seller received" and the
 * marketplace fee both as 8,460.00; here both come from computeFeeBreakdown
 * (8,248.50 and 211.50 at 2.5%). Its transaction reads
 * "0x7f3a…9e2d1c7b8aaf456e8" with the ellipsis mid-string; this uses the
 * buy flow's own 6 + 5 truncation ("0x7f3a…456e8").
 */
export const OrderReceiptCard = ({ order }: OrderReceiptCardProps) => {
  const { domain } = order
  const feePercent = `${(PLATFORM_FEE_RATE * 100).toFixed(1).replace(/\.0$/, '')}%`
  const explorerHref = order.txHash ? txExplorerHref(domain.chain.id, order.txHash) : null

  return (
    <GlassCard variant="glass" title="Receipt" titleId="order-receipt-title" className={styles.card}>
      <DomainPriceHeader
        label={domain.label}
        extension={domain.extension}
        chain={domain.chain}
        characterCount={domain.characterCount}
        oneTimePurchase={domain.renewal === 'one-time'}
        priceUsd={order.pricePaidUsd}
        className={styles.domain}
      />

      <KeyValueRows
        variant="ruled"
        className={styles.rows}
        rows={[
          { label: 'You paid', value: <Amount value={order.pricePaidUsd} /> },
          ...(order.networkFeeUsd != null ? [{ label: 'Network fee', value: `${formatToken(order.networkFeeUsd)} USDT equivalent` }] : []),
          { label: 'Seller received', value: <Amount value={order.sellerReceivedUsd} /> },
          { label: 'Marketplace fee, paid by seller', value: <Amount value={order.marketplaceFeeUsd} /> },
          { label: 'Order ID', value: order.id.startsWith('0x') ? <span className={styles.tx}>{truncateHash(order.id)}</span> : `#${order.id}` },
          {
            label: 'Transaction',
            value: order.txHash ? (
              explorerHref ? (
                <Link href={explorerHref} target="_blank" rel="noopener noreferrer" className={styles.tx}>
                  {truncateHash(order.txHash)}
                </Link>
              ) : (
                <span className={styles.tx}>{truncateHash(order.txHash)}</span>
              )
            ) : (
              <span className={styles.tx}>Not available yet</span>
            ),
          },
        ]}
      />

      <InfoNote className={styles.note}>
        The {feePercent} marketplace fee was deducted from the seller&apos;s proceeds, not added to your price.
      </InfoNote>
    </GlassCard>
  )
}

export default OrderReceiptCard
