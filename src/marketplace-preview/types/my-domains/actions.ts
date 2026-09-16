/**
 * The right-rail "Quick Actions" panel (Figma node 50:6452). Three of the
 * four actions map to modals that already exist and work today, inside
 * src/component/domain-self-item — see the implementation plan, section 03.
 * "Transfer" has no existing mutation or modal anywhere in the codebase; it's
 * a confirmed gap, tracked in the plan's risks section.
 */

export type QuickActionKind = 'list' | 'bulk-list' | 'appraise' | 'transfer'

export interface QuickAction {
  id: QuickActionKind
  label: string
  description: string
}
