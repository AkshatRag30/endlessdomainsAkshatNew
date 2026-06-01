import React from 'react'
import { IoArrowForward } from 'react-icons/io5'

import PrimaryButton from '@/design-system/primitives/button'

import styles from './OrdersEmptyState.module.scss'

interface OrdersEmptyStateProps {
  onExplore?: () => void
}

const OrdersEmptyState: React.FC<OrdersEmptyStateProps> = ({ onExplore }) => (
  <div className={styles.wrap}>
    {/* ── Top decorative line ── */}
    <div className={styles.hLine} aria-hidden="true" />

    {/* ── Card ── */}
    <div className={styles.card}>
      {/* Left decorative barcode strip */}
      <div className={styles.sideBar} aria-hidden="true" />

      {/* Center content */}
      <div className={styles.content}>
        <div className={styles.textGroup}>
          <h2 className={styles.title}>No Domain Yet</h2>
          <p className={styles.subtitle}>
            Set up your on-chain identity in minutes. One transaction. Permanent ownership.
            Your blockchain domain resolves across every supported chain.
          </p>
        </div>
        <PrimaryButton
          type="button"
          icon={<IoArrowForward />}
          iconPosition="right"
          onClick={onExplore}
        >
          Explore Domains
        </PrimaryButton>
      </div>

      {/* Right decorative barcode strip */}
      <div className={styles.sideBar} aria-hidden="true" />
    </div>

    {/* ── Bottom decorative line ── */}
    <div className={styles.hLine} aria-hidden="true" />
  </div>
)

export default OrdersEmptyState
