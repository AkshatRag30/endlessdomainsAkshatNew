import React from 'react'
import type { IconType } from 'react-icons'
import { FiTag, FiGrid, FiSearch, FiRepeat } from 'react-icons/fi'
import InfoListCard from '@/marketplace-preview/design-system/primitives/cards/info-list-card'
import { quickActions } from '@/marketplace-preview/data/my-domains/actions'

const ICON_BY_ACTION: Record<string, IconType> = {
  list: FiTag,
  'bulk-list': FiGrid,
  appraise: FiSearch,
  transfer: FiRepeat,
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
      icon: ICON_BY_ACTION[action.id],
      title: action.label,
      subtitle: action.description,
    }))}
  />
)

export default QuickActionsPanel
