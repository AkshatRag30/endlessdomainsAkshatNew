import React, { useCallback, useState } from 'react'

import { filterOrders, ORDERS_DATA, type OrderEntry, type OrderTab } from '@/components/user-orders/ordersData'

import OrderModal from './OrderModal'
import OrdersTable from './OrdersTable'
import styles from './OrdersList.module.scss'

const TABS: { id: OrderTab; label: string }[] = [
  { id: 'ALL', label: 'All' },
  { id: 'PROCESSING', label: 'Processing' },
  { id: 'COMPLETED', label: 'Completed' },
]

const OrdersList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<OrderTab>('ALL')
  const [selectedOrder, setSelectedOrder] = useState<OrderEntry | null>(null)

  const orders = filterOrders(ORDERS_DATA, activeTab)

  const handleTabClick = useCallback((tab: OrderTab) => {
    setActiveTab(tab)
  }, [])

  const handleView = useCallback((order: OrderEntry) => {
    setSelectedOrder(order)
  }, [])

  const handleCloseModal = useCallback(() => {
    setSelectedOrder(null)
  }, [])

  return (
    <>
      <nav className={styles.tabGroup} aria-label="Order status filter">
        {TABS.map(tab => (
          <button
            key={tab.id}
            type="button"
            className={`${styles.tabBtn}${activeTab === tab.id ? ` ${styles.tabBtnActive}` : ''}`}
            onClick={() => handleTabClick(tab.id)}
            aria-pressed={activeTab === tab.id}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <OrdersTable orders={orders} onView={handleView} />

      {selectedOrder && <OrderModal order={selectedOrder} onClose={handleCloseModal} />}
    </>
  )
}

export default OrdersList
