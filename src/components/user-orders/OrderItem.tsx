import React, { useCallback } from 'react'

import { getDisplayCost, type OrderEntry } from './ordersData'
import StatusBadge from './StatusBadge'
import styles from './OrderItem.module.scss'

interface OrderItemProps {
  order: OrderEntry
  sno: number
  onView: (order: OrderEntry) => void
}

const OrderItem: React.FC<OrderItemProps> = ({ order, sno, onView }) => {
  const date = new Date(order.createdDateTime).toISOString().split('T')[0]
  const cost = getDisplayCost(order)

  const handleView = useCallback(() => {
    onView(order)
  }, [onView, order])

  return (
    <tr>
      <td>{sno + 1}</td>
      <td className={styles.orderId} title={order.id}>{order.id}</td>
      <td>
        <StatusBadge status={order.orderStatus} />
      </td>
      <td>{date}</td>
      <td>
        <span className="notranslate">$</span> {cost}
      </td>
      <td>
        <span className="notranslate">$</span> {order.txnFee || '0.00'}
      </td>
      <td>
        <button
          type="button"
          className={styles.viewBtn}
          onClick={handleView}
          aria-label={`View order ${order.id}`}
        >
          View
        </button>
      </td>
    </tr>
  )
}

export default OrderItem
