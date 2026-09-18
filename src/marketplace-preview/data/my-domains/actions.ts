import { QuickAction } from '@/types/my-domains'

/**
 * STATIC MOCK DATA — copy taken verbatim from the Figma reference (node
 * 50:6452, "Quick actions"). Not data-driven; this list doesn't change per
 * user, so it's a fixture rather than something a hook needs to fetch.
 */
export const quickActions: QuickAction[] = [
  { id: 'list', label: 'List a domain', description: 'Set a price and publish on chain' },
  { id: 'bulk-list', label: 'Bulk list', description: 'Price many names in one approval' },
  { id: 'appraise', label: 'Appraise a domain', description: 'Signals free, valuation paid' },
  { id: 'transfer', label: 'Transfer', description: 'Send a domain to another wallet' },
]
