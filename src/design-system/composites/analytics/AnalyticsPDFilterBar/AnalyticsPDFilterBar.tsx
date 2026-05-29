import React, { useCallback } from 'react'
import styles from '../Analytics.module.scss'
import MiniCalendar from '@/design-system/primitives/MiniCalendar'
import type { PDFilterState } from '../data/mockAnalyticsData'
import { DEFAULT_PD_FILTER_STATE } from '../data/mockAnalyticsData'

interface Props {
  value: PDFilterState
  onChange: (state: PDFilterState) => void
}

const AnalyticsPDFilterBar: React.FC<Props> = ({ value, onChange }) => {
  const set = useCallback(
    (patch: Partial<PDFilterState>) => onChange({ ...value, ...patch }),
    [value, onChange],
  )

  const handleReset = useCallback(() => onChange(DEFAULT_PD_FILTER_STATE), [onChange])

  return (
    <div className={styles.filterBar} role="search" aria-label="Provider distribution filters">
      {/* Start Date — nth-child(1), row 2 col 1 on tablet/mobile */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel} htmlFor="pd-start-date">Start Date</label>
        <MiniCalendar
          id="pd-start-date"
          value={value.startDate}
          onChange={date => set({ startDate: date })}
          placeholder="Start Date"
        />
      </div>

      {/* End Date — nth-child(2), row 2 col 2 on tablet/mobile */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel} htmlFor="pd-end-date">End Date</label>
        <MiniCalendar
          id="pd-end-date"
          value={value.endDate}
          onChange={date => set({ endDate: date })}
          placeholder="End Date"
          align="right"
        />
      </div>

      {/* nth-child(3) → row 3 col 1 */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel} htmlFor="pd-order-status">Order Status</label>
        <select
          id="pd-order-status"
          className={styles.filterSelect}
          value={value.orderStatus}
          onChange={e => set({ orderStatus: e.target.value as PDFilterState['orderStatus'] })}
        >
          <option value="All Status">All Status</option>
          <option value="Active">Active</option>
          <option value="Expired">Expired</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      {/* nth-child(4) → row 3 col 2 */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel} htmlFor="pd-time-period">Time Period</label>
        <select
          id="pd-time-period"
          className={styles.filterSelect}
          value={value.timePeriod}
          onChange={e => set({ timePeriod: e.target.value as PDFilterState['timePeriod'] })}
        >
          <option value="All Time">All Time</option>
          <option value="This Week">This Week</option>
          <option value="This Month">This Month</option>
          <option value="This Year">This Year</option>
        </select>
      </div>

      <div className={styles.filterDivider} aria-hidden="true" />

      <button
        type="button"
        className={styles.filterReset}
        onClick={handleReset}
        aria-label="Reset all filters"
      >
        Reset
      </button>
    </div>
  )
}

export default AnalyticsPDFilterBar

