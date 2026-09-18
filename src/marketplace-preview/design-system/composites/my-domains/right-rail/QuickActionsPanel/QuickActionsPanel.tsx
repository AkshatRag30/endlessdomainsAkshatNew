import React from 'react'
import InfoListCard from '@/marketplace-preview/design-system/primitives/cards/info-list-card'
import { quickActions } from '@/marketplace-preview/data/my-domains/actions'

const ICON_BY_ACTION: Record<string, string> = {
  list: '/assets/img/my-domains/action-list.svg',
  'bulk-list': '/assets/img/my-domains/action-bulk-list.svg',
  appraise: '/assets/img/my-domains/action-appraise.svg',
  transfer: '/assets/img/my-domains/action-transfer.svg',
}

/**
 * Figma node 50:6452. Static list — no props, same self-contained pattern
 * LiveActivityPanel/PromotedDomainsSection already use for data that doesn't
 * vary per page. Rows are visually present but inert; see the implementation
 * plan section 08 — three of these four already have real modals to wire up
 * once the Phase 04 checkpoint resolves, "Transfer" has none yet.
 */
export const QuickActionsPanel = () => (
  <InfoListCard
    title="Quick actions"
    iconVariant="dark"
    rows={quickActions.map((action) => ({
      id: action.id,
      iconSrc: ICON_BY_ACTION[action.id],
      title: action.label,
      subtitle: action.description,
    }))}
  />
)

export default QuickActionsPanel
