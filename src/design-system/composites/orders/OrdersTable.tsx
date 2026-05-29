import React from 'react'

import OrderItem from '@/components/user-orders/OrderItem'
import { type OrderEntry } from '@/components/user-orders/ordersData'

import styles from './OrdersTable.module.scss'

interface OrdersTableProps {
  orders: OrderEntry[]
  onView: (order: OrderEntry) => void
}

const OrdersTable: React.FC<OrdersTableProps> = ({ orders, onView }) => (
  <div className={styles.tableWrapper}>
    <table className={styles.table}>
      <thead>
        <tr>
          <th>S. No.</th>
          <th>Order ID</th>
          <th>Status</th>
          <th>Transaction Date</th>
          <th>Amount</th>
          <th>Registration Fees</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {orders.length > 0 ? (
          orders.map((order, i) => (
            <OrderItem key={order.id} order={order} sno={i} onView={onView} />
          ))
        ) : (
          <tr className={styles.emptyRow}>
            <td colSpan={7}>No Orders Found!</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
)

export default OrdersTable
