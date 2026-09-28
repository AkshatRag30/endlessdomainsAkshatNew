import Link from 'next/link'
import { useRouter } from 'next/router'
import Breadcrumb from '@/marketplace-preview/design-system/primitives/navigation/breadcrumb'
import {
  DomainOverviewShell,
  OrderHeaderCard,
  OrderNextStepsCard,
  OrderReceiptCard,
  OrderTimelineCard,
} from '@/marketplace-preview/design-system/composites/marketplace'
import { useMarketplaceOrder } from '@/marketplace-preview/hooks/marketplace/domain-overview/useMarketplaceOrder'
import { MARKETPLACE_HREF } from '@/marketplace-preview/helpers/marketplace/routes'
import ToastMessage from '@/design-system/primitives/toast-message'
import { TOAST_TYPE } from '@/core/enum/toast-type.enum'
import styles from './order-receipt.module.scss'

/**
 * Temporary preview route for an order receipt (domain-overview plan Phase
 * E, Figma 5:7438 / 5:7965). Reached from the buy flow's "View receipt" or
 * a Sold domain's hero; ED-2026-0918-00123 is the seeded Figma order. Orders
 * placed this session live in memory, so a hard reload of one shows the not
 * found state (plan §6.5).
 */
export default function OrderReceiptPreview() {
  const router = useRouter()
  const orderId = router.isReady && typeof router.query.orderId === 'string' ? router.query.orderId : null
  const { data: order, isLoading } = useMarketplaceOrder(orderId)

  const handleBack = () => {
    if (window.history.length > 1) router.back()
    else router.push(MARKETPLACE_HREF)
  }

  // Same crumbs as the domain overview, as Figma draws them (plan O2).
  const breadcrumb = (
    <Breadcrumb
      onBack={handleBack}
      backLabel="Go back"
      items={[
        { label: 'Back to Home', href: MARKETPLACE_HREF },
        { label: 'Listings', href: MARKETPLACE_HREF },
      ]}
    />
  )

  // Mock "Download receipt": the browser's print dialog (save as PDF), with
  // the site chrome hidden by print styles. Real version: a server PDF (plan §8.3).
  const handleDownload = () => window.print()

  const handleShare = async () => {
    if (!order) return
    const url = window.location.href
    const title = `Order #${order.id}`
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title, url })
      } catch {
        // Dismissed share sheet; nothing to do.
      }
      return
    }
    try {
      await navigator.clipboard.writeText(url)
      ToastMessage(TOAST_TYPE.SUCCESS, 'Receipt link copied', 'Paste it anywhere to share this order.')
    } catch {
      ToastMessage(TOAST_TYPE.ERROR, "Couldn't copy the link", 'Copy it from the address bar instead.')
    }
  }

  if (!order) {
    const stillLoading = !router.isReady || isLoading
    return (
      <DomainOverviewShell breadcrumb={breadcrumb} contentLayout="wide">
        {stillLoading ? (
          <div className={styles.skeleton} aria-busy="true" aria-label="Loading order">
            <div className={styles.skeletonHeader} />
            <div className={styles.grid}>
              <div className={styles.skeletonCard} />
              <div className={styles.skeletonCard} />
            </div>
          </div>
        ) : (
          // Not in Figma (plan §7 item 2).
          <div className={styles.notFound}>
            <h1 className={styles.notFoundTitle}>We couldn&apos;t find that order</h1>
            <p className={styles.notFoundText}>
              Check the order number, or open it again from your purchase. Orders from this preview session are cleared when the page reloads.
            </p>
            <Link href={MARKETPLACE_HREF} className={styles.notFoundLink}>
              Back to marketplace
            </Link>
          </div>
        )}
      </DomainOverviewShell>
    )
  }

  return (
    <DomainOverviewShell breadcrumb={breadcrumb} contentLayout="wide">
      <OrderHeaderCard order={order} onDownload={handleDownload} onShare={handleShare} />
      <div className={styles.grid}>
        <OrderReceiptCard order={order} />
        <OrderTimelineCard timeline={order.timeline} status={order.status} />
      </div>
      <div className={styles.nextSteps}>
        <OrderNextStepsCard order={order} />
      </div>
    </DomainOverviewShell>
  )
}
