import React from 'react'
import type { IconType } from 'react-icons'
import { FiTag, FiGrid, FiSearch, FiRepeat } from 'react-icons/fi'
import InfoListCard from '@/marketplace-preview/design-system/primitives/cards/info-list-card'
import { quickActions } from '@/marketplace-preview/data/my-domains/actions'
import type { QuickActionKind } from '@/marketplace-preview/types/my-domains'

const ICON_BY_ACTION: Record<string, IconType> = {
  list: FiTag,
  'bulk-list': FiGrid,
  appraise: FiSearch,
  transfer: FiRepeat,
}

export interface QuickActionsPanelProps {
  /** "List a domain" is wired to the listing flow modal (listing-flow-implementation-plan.md); the other three stay inert until they each get a real destination. */
  onAction?: (id: QuickActionKind) => void
}

/**
 * Figma node 50:6452. Same self-contained data pattern as
 * LiveActivityPanel/PromotedDomainsSection — only the click handler is a
 * prop, the row content itself doesn't vary per page. See the
 * implementation plan section 08 — three of these four already have real
 * modals to wire up, "Transfer" has none yet.
 */
export const QuickActionsPanel = ({ onAction }: QuickActionsPanelProps) => (
  <InfoListCard
    title="Quick actions"
    iconVariant="dark"
    rows={quickActions.map((action) => ({
      id: action.id,
      icon: ICON_BY_ACTION[action.id],
      title: action.label,
      subtitle: action.description,
      onClick: () => onAction?.(action.id),
    }))}
  />
)

export default QuickActionsPanel
