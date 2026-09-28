import React from 'react'
import Image from 'next/image'
import type { MarketplaceOrder } from '@/marketplace-preview/types/marketplace'
import GlassCard from '@/marketplace-preview/design-system/primitives/cards/glass-card'
import ActionTile from '@/marketplace-preview/design-system/primitives/cards/action-tile'
import { MY_DOMAINS_HREF, myDomainsListHref } from '@/marketplace-preview/helpers/marketplace/routes'
import styles from './OrderNextStepsCard.module.scss'

export interface OrderNextStepsCardProps {
  order: MarketplaceOrder
}

/**
 * Figma node 5:7690 ("What next"): three action tiles. "See it in My
 * domains" and "List it for sale" go to the My Domains preview (the second
 * with the name in `?list=`, which opens its listing drawer once the name is
 * in the portfolio). "Point it somewhere" has no records manager page yet
 * (plan §9), so it stays visually real but inert.
 */
export const OrderNextStepsCard = ({ order }: OrderNextStepsCardProps) => (
  <GlassCard variant="glass" title="What next" titleId="order-next-title" className={styles.card}>
    <div className={styles.tiles}>
      <ActionTile
        href={MY_DOMAINS_HREF}
        title="See it in My domains"
        subtitle="Manage, list or transfer it"
        icon={<Image src="/assets/img/domain-overview/next-swap.svg" alt="" width={16} height={12.57} />}
      />
      <ActionTile
        title="Point it somewhere"
        subtitle="Wallet addresses, a website, a profile"
        icon={<Image src="/assets/img/domain-overview/next-globe.svg" alt="" width={15} height={15} />}
      />
      <ActionTile
        href={myDomainsListHref(order.domain.fullName)}
        title="List it for sale"
        subtitle="Free to list, free to cancel"
        badgeSize="lg"
        icon={
          // Figma's plus is three layers: the rounded frame and its two bars.
          <span className={styles.plus}>
            <Image src="/assets/img/domain-overview/next-plus-frame.svg" alt="" width={20.41} height={20.41} />
            <Image src="/assets/img/domain-overview/next-plus-v.svg" alt="" width={1.7} height={10.21} className={styles.plusV} />
            <Image src="/assets/img/domain-overview/next-plus-h.svg" alt="" width={10.21} height={1.7} className={styles.plusH} />
          </span>
        }
      />
    </div>
  </GlassCard>
)

export default OrderNextStepsCard
