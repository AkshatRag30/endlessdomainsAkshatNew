import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Breadcrumb from '@/marketplace-preview/design-system/primitives/navigation/breadcrumb'
import {
  BuyFlowModal,
  ComparableSalesPanel,
  DomainActivityCard,
  DomainHeroCard,
  DomainOverviewShell,
  DomainOverviewTabs,
  DomainSummaryTiles,
  InterestCard,
  NameFactsCard,
  PriceHistoryPanel,
  SellerCard,
} from '@/marketplace-preview/design-system/composites/marketplace'
import type { DomainOverviewTab, MarketplaceListing } from '@/marketplace-preview/types/marketplace'
import { useDomainOverview } from '@/marketplace-preview/hooks/marketplace/domain-overview/useDomainOverview'
import { useDomainActivity } from '@/marketplace-preview/hooks/marketplace/domain-overview/useDomainActivity'
import { useDomainPriceHistory } from '@/marketplace-preview/hooks/marketplace/domain-overview/useDomainPriceHistory'
import { useComparableSales } from '@/marketplace-preview/hooks/marketplace/domain-overview/useComparableSales'
import { useMockWatchlist } from '@/marketplace-preview/data/marketplace/watchlist'
import { MARKETPLACE_HREF, domainOverviewHref } from '@/marketplace-preview/helpers/marketplace/routes'
import styles from './domain-overview.module.scss'

// Offers is a disabled "Soon" tab, so it's never a valid ?tab= value.
const SELECTABLE_TABS: DomainOverviewTab[] = ['overview', 'price-history', 'comparable-sales']

const parseTab = (value: string | string[] | undefined): DomainOverviewTab =>
  SELECTABLE_TABS.find((tab) => tab === value) ?? 'overview'

/**
 * Temporary preview route for one domain's overview page (domain-overview
 * plan Phases A to D: breadcrumb, hero, summary tiles, and the Overview,
 * Price history and Comparable sales tabs). Reached by clicking a domain
 * name in the marketplace preview's tables or a comparable sale row;
 * banking.ud is the Figma 5:3570 fixture and qi.ud has no sales history.
 */
export default function DomainOverviewPreview() {
  const router = useRouter()
  const fullName = router.isReady && typeof router.query.domain === 'string' ? router.query.domain : null
  const activeTab = parseTab(router.query.tab)
  const { data: overview, isLoading, refetch: refetchOverview } = useDomainOverview(fullName)
  // Each tab's data loads the first time that tab is shown, then stays
  // cached, the way RTK Query's `skip` behaves (plan §6.6).
  const [seenTabs, setSeenTabs] = useState<ReadonlySet<DomainOverviewTab>>(() => new Set())
  if (router.isReady && !seenTabs.has(activeTab)) setSeenTabs(new Set(seenTabs).add(activeTab))
  const activity = useDomainActivity(fullName, { skip: !seenTabs.has('overview') })
  const priceHistory = useDomainPriceHistory(fullName, { skip: !seenTabs.has('price-history') })
  const comparableSales = useComparableSales(fullName, { skip: !seenTabs.has('comparable-sales') })
  const watchlist = useMockWatchlist()

  // The tab lives in the query string so it can be deep linked and survives
  // a reload; replace (not push) so Back leaves the page instead of
  // stepping through tabs (plan §4.1).
  const changeTab = (tab: DomainOverviewTab) => {
    if (!fullName) return
    router.replace(domainOverviewHref(fullName, tab), undefined, { shallow: true, scroll: false })
  }

  // Kept (not cleared) on close so the drawer's slide-out animation still
  // has a listing to render, same as the marketplace preview.
  const [buyModal, setBuyModal] = useState<{ isOpen: boolean; listing: MarketplaceListing } | null>(null)

  const handleBack = () => {
    // A deep link opened in a fresh tab has nothing to go back to.
    if (window.history.length > 1) router.back()
    else router.push(MARKETPLACE_HREF)
  }

  // Figma quirk (plan §2.7 Q8, open question O2): the current crumb reads
  // "Listings" rather than the domain name. Kept as drawn.
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

  if (!overview) {
    const stillLoading = !router.isReady || isLoading
    return (
      <DomainOverviewShell breadcrumb={breadcrumb}>
        {stillLoading ? (
          <div className={styles.skeleton} aria-busy="true" aria-label="Loading domain">
            <div className={styles.skeletonHero} />
            <div className={styles.skeletonTiles}>
              {[0, 1, 2, 3].map((tile) => (
                <div key={tile} className={styles.skeletonTile} />
              ))}
            </div>
          </div>
        ) : (
          // Not in Figma (plan §7 item 2): a malformed name in the URL.
          <div className={styles.notFound}>
            <h1 className={styles.notFoundTitle}>We couldn&apos;t find that domain</h1>
            <p className={styles.notFoundText}>Check the name in the address bar, or go back to the listings.</p>
            <Link href={MARKETPLACE_HREF} className={styles.notFoundLink}>
              Back to marketplace
            </Link>
          </div>
        )}
      </DomainOverviewShell>
    )
  }

  // The mock watchlist is keyed by listing id, like the listings table's
  // hearts. A name with no listing falls back to its full name so its heart
  // still toggles; the real watchlist API keys on the domain (plan §8.3).
  const watchKey = overview.listing?.id ?? overview.facts.fullName
  const listing = overview.listing

  return (
    <DomainOverviewShell breadcrumb={breadcrumb}>
      <DomainHeroCard
        overview={overview}
        favorited={watchlist.isWatched(watchKey)}
        onToggleFavorite={() => watchlist.toggle(watchKey)}
        onBuyNow={() => listing && setBuyModal({ isOpen: true, listing })}
      />
      <DomainSummaryTiles overview={overview} viewerWatching={watchlist.isWatched(watchKey)} />

      <DomainOverviewTabs active={activeTab} onChange={changeTab}>
        {activeTab === 'overview' ? (
          <div className={styles.overviewGrid}>
            <NameFactsCard facts={overview.facts} />
            {/* No portfolio slug on listings yet (plan O5), so View Portfolio stays inert. */}
            <SellerCard seller={overview.seller} expiresAt={overview.expiresAt} />
            <InterestCard interest={overview.interest} />
            <DomainActivityCard
              fullName={overview.facts.fullName}
              events={activity.data}
              isLoading={activity.isLoading}
              isError={activity.isError}
              onRetry={activity.refetch}
            />
          </div>
        ) : activeTab === 'price-history' ? (
          <PriceHistoryPanel
            history={priceHistory.data}
            isLoading={priceHistory.isLoading}
            isError={priceHistory.isError}
            onRetry={priceHistory.refetch}
          />
        ) : (
          <ComparableSalesPanel
            sales={comparableSales.data}
            isLoading={comparableSales.isLoading}
            isError={comparableSales.isError}
            onRetry={comparableSales.refetch}
          />
        )}
      </DomainOverviewTabs>

      {buyModal && (
        <BuyFlowModal
          isOpen={buyModal.isOpen}
          listing={buyModal.listing}
          onWatch={(watched) => watchlist.add(watched.id)}
          // Refetch so the hero flips to Sold with a receipt link (plan §7).
          onPurchased={refetchOverview}
          onClose={() => setBuyModal((prev) => (prev ? { ...prev, isOpen: false } : prev))}
        />
      )}
    </DomainOverviewShell>
  )
}
