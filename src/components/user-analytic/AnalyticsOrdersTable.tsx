import React from 'react'
import styles from './Analytics.module.scss'
import type { OrderItem, OrderStatus, MintStatus } from './analyticsData'

const STATUS_CLASS: Record<OrderStatus, string> = {
  Completed: styles.badgeCompleted,
  Cancelled: styles.badgeCancelled,
  Pending: styles.badgePending,
}

const MINT_CLASS: Record<MintStatus, string> = {
  Completed: styles.badgeCompleted,
  Failed: styles.badgeCancelled,
  Pending: styles.badgePending,
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

interface Props {
  orders: OrderItem[]
}

const AnalyticsOrdersTable: React.FC<Props> = ({ orders }) => (
  <div className={styles.tableCard}>
    <div className={styles.tableHeader}>
      <p className={styles.sectionTitle}>Order History</p>
    </div>
    <div className={styles.tableScrollWrap}>
      <table className={styles.table} aria-label="Order history">
        <thead>
          <tr>
            <th scope="col">Order</th>
            <th scope="col">Domain</th>
            <th scope="col">Provider</th>
            <th scope="col">Order Status</th>
            <th scope="col">Mint Status</th>
            <th scope="col">Price</th>
            <th scope="col">Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan={7} className={styles.tableEmptyCell}>No orders found</td>
            </tr>
          ) : (
            orders.map(order => (
              <tr key={order.id}>
                <td>
                  <span className={styles.orderNum}>#{order.orderNumber}</span>
                </td>
                <td>
                  <div className={styles.domainCell}>
                    <span className={styles.domainName}>{order.domainName}</span>
                    {order.promoApplied && order.promoValue !== null && (
                      <span className={styles.promoTag}>{order.promoValue}% off</span>
                    )}
                  </div>
                </td>
                <td>
                  <span className={styles.providerTag}>{order.domainProvider}</span>
                </td>
                <td>
                  <span className={`${styles.badge} ${STATUS_CLASS[order.orderStatus]}`}>
                    {order.orderStatus}
                  </span>
                </td>
                <td>
                  <span className={`${styles.badge} ${MINT_CLASS[order.mintStatus]}`}>
                    {order.mintStatus}
                  </span>
                </td>
                <td>
                  <span className={styles.priceCell}>${order.price}</span>
                </td>
                <td>
                  <span className={styles.dateCell}>{formatDate(order.lastChangedDateTime)}</span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
)

export default AnalyticsOrdersTable
