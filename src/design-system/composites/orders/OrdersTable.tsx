import React from 'react'

import OrderCard from './OrderCard'
import OrderItem from './OrderItem'
import { type OrderEntry } from './ordersData'

import styles from './OrdersTable.module.scss'

interface OrdersTableProps {
  orders: OrderEntry[]
  onView: (order: OrderEntry) => void
}

const OrdersTable: React.FC<OrdersTableProps> = ({ orders, onView }) => (
  <>
    {/* ── Desktop: full table ── */}
    <div className={styles.tableWrapper}>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.headerRow}>
              <th scope="col" className={styles.th}>Domain Name</th>
              <th scope="col" className={`${styles.th} ${styles.thDivider}`}>Status</th>
              <th scope="col" className={`${styles.th} ${styles.thDivider}`}>Explore</th>
              <th scope="col" className={`${styles.th} ${styles.thDivider}`}>Transaction Date</th>
              <th scope="col" className={`${styles.th} ${styles.thDivider}`}>Total Amount</th>
              <th scope="col" className={`${styles.th} ${styles.thDivider}`}>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map(order => (
                <OrderItem key={order.id} order={order} onView={onView} />
              ))
            ) : (
              <tr className={styles.emptyRow}>
                <td colSpan={6}>No Orders Found!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>

    {/* ── Tablet + Mobile: card list ── */}
    <div className={styles.cardList}>
      {orders.length > 0 ? (
        orders.map(order => (
          <OrderCard key={order.id} order={order} onView={onView} />
        ))
      ) : (
        <p className={styles.cardListEmpty}>No Orders Found!</p>
      )}
    </div>
  </>
)

export default OrdersTable
