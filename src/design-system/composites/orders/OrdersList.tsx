import React, { useCallback, useState } from 'react'

import { filterOrders, ORDERS_DATA, type OrderEntry, type OrderTab } from '@/components/user-orders/ordersData'

import OrderModal from './OrderModal'
import OrdersEmptyState from './OrdersEmptyState'
import OrdersTable from './OrdersTable'
import styles from './OrdersList.module.scss'

const TABS: { id: OrderTab; label: string }[] = [
  { id: 'ALL', label: 'All' },
  { id: 'PROCESSING', label: 'Processing' },
  { id: 'COMPLETED', label: 'Complete' },
]

const ITEMS_PER_PAGE = 5

function buildPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | '...')[] = [1, 2, 3]
  if (total > 4) pages.push('...')
  if (total !== 3) pages.push(total)
  return pages
}

const OrdersList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<OrderTab>('ALL')
  const [selectedOrder, setSelectedOrder] = useState<OrderEntry | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const allFiltered = filterOrders(ORDERS_DATA, activeTab)
  const totalPages = Math.max(1, Math.ceil(allFiltered.length / ITEMS_PER_PAGE))
  const safePage = Math.min(currentPage, totalPages)
  const start = (safePage - 1) * ITEMS_PER_PAGE
  const orders = allFiltered.slice(start, start + ITEMS_PER_PAGE)

  const handleTabClick = useCallback((tab: OrderTab) => {
    setActiveTab(tab)
    setCurrentPage(1)
  }, [])

  const handleView = useCallback((order: OrderEntry) => {
    setSelectedOrder(order)
  }, [])

  const handleCloseModal = useCallback(() => {
    setSelectedOrder(null)
  }, [])

  const goToPrev = useCallback(() => setCurrentPage(p => Math.max(1, p - 1)), [])
  const goToNext = useCallback(() => setCurrentPage(p => Math.min(totalPages, p + 1)), [totalPages])

  const pageNumbers = buildPageNumbers(safePage, totalPages)

  // When the user has no orders at all, show the empty state
  if (ORDERS_DATA.length === 0) {
    return <OrdersEmptyState />
  }

  return (
    <>
      {/* ── Tab section ── */}
      <div className={styles.tabSection}>
        <nav className={styles.tabGroup} aria-label="Order status filter">
          {TABS.map(tab => (
            <button
              key={tab.id}
              type="button"
              className={activeTab === tab.id ? `${styles.tabBtn} ${styles.tabBtnActive}` : styles.tabBtn}
              onClick={() => handleTabClick(tab.id)}
              aria-pressed={activeTab === tab.id}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* ── Table section ── */}
      <div className={styles.tableSection}>
        <OrdersTable orders={orders} onView={handleView} />

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <nav className={styles.pagination} aria-label="Orders pages">
            <div className={styles.paginationGroup}>
              <button
                type="button"
                className={styles.pageNavBtn}
                onClick={goToPrev}
                disabled={safePage === 1}
                aria-label="Previous page"
              >
                <span className={styles.pageNavChevron} aria-hidden="true">«</span>
                Previous
              </button>
              <div className={styles.pageDivider} aria-hidden="true" />

              {pageNumbers.map((p, i) =>
                p === '...' ? (
                  React.createElement(React.Fragment, { key: `dots-${i}` },
                    <span className={styles.pageDots} aria-hidden="true">•••</span>,
                    <div className={styles.pageDivider} aria-hidden="true" />
                  )
                ) : (
                  React.createElement(React.Fragment, { key: p },
                    <button
                      type="button"
                      className={safePage === p ? `${styles.pageNum} ${styles.pageNumActive}` : styles.pageNum}
                      onClick={() => setCurrentPage(p)}
                      aria-current={safePage === p ? 'page' : undefined}
                    >
                      {p}
                    </button>,
                    <div className={styles.pageDivider} aria-hidden="true" />
                  )
                )
              )}

              <button
                type="button"
                className={styles.pageNavBtn}
                onClick={goToNext}
                disabled={safePage === totalPages}
                aria-label="Next page"
              >
                Next
                <span className={styles.pageNavChevron} aria-hidden="true">»</span>
              </button>
            </div>
          </nav>
        )}
      </div>

      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          variant={selectedOrder.orderStatus}
          onClose={handleCloseModal}
        />
      )}
    </>
  )
}

export default OrdersList
