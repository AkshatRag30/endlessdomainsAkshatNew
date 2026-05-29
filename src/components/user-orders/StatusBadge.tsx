import React from 'react'
import { BsCircleFill } from 'react-icons/bs'

import { type OrderStatus } from './ordersData'
import styles from './StatusBadge.module.scss'

interface StatusBadgeProps {
  status: OrderStatus
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => (
  <span className={styles.badge} data-status={status.toLowerCase()}>
    <BsCircleFill size={10} aria-hidden="true" />
    {status}
  </span>
)

export default StatusBadge
