import React from 'react'
import styles from './AuthPanel.module.scss'

export interface AuthPanelProps {
  id: string
  labelledBy: string
  /** Hidden rather than unmounted, so a wallet or Google sign in already in progress keeps its state when the other tab is opened. */
  hidden?: boolean
  children: React.ReactNode
}

/**
 * The open tab's content under AuthMethodTabs: the provider buttons (Figma
 * 16:1042, 18px apart, 44px below the tabs) or the email form.
 */
export const AuthPanel = ({ id, labelledBy, hidden = false, children }: AuthPanelProps) => (
  <div id={id} role="tabpanel" aria-labelledby={labelledBy} hidden={hidden} className={styles.panel}>
    {children}
  </div>
)

export default AuthPanel
