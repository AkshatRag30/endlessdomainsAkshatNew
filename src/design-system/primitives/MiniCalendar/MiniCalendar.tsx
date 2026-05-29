import React, { useState, useCallback, useEffect, useRef } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import styles from './MiniCalendar.module.scss'

const MONTHS = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December',
]

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

interface Props {
  value: string
  onChange: (date: string) => void
  placeholder?: string
  id?: string
  align?: 'left' | 'right'
}

interface DayCell {
  day: number
  date: Date
  type: 'prev' | 'current' | 'next'
}

function parseDMY(str: string): Date | null {
  if (!str) return null
  const [d, m, y] = str.split('/')
  if (!d || !m || !y) return null
  return new Date(parseInt(y), parseInt(m) - 1, parseInt(d))
}

function formatDMY(date: Date): string {
  const d = String(date.getDate()).padStart(2, '0')
  const m = String(date.getMonth() + 1).padStart(2, '0')
  return `${d}/${m}/${date.getFullYear()}`
}

function buildCells(year: number, month: number): DayCell[] {
  const firstDay = new Date(year, month, 1).getDay()
  const startOffset = firstDay === 0 ? 6 : firstDay - 1
  const lastDate = new Date(year, month + 1, 0).getDate()
  const prevLast = new Date(year, month, 0).getDate()
  const cells: DayCell[] = []

  for (let i = startOffset; i > 0; i--) {
    const d = prevLast - i + 1
    cells.push({ day: d, date: new Date(year, month - 1, d), type: 'prev' })
  }
  for (let i = 1; i <= lastDate; i++) {
    cells.push({ day: i, date: new Date(year, month, i), type: 'current' })
  }
  const fill = 42 - cells.length
  for (let i = 1; i <= fill; i++) {
    cells.push({ day: i, date: new Date(year, month + 1, i), type: 'next' })
  }
  return cells
}

const MiniCalendar: React.FC<Props> = ({ value, onChange, placeholder = 'Select date', id, align = 'left' }) => {
  const [open, setOpen] = useState(false)
  const [viewDate, setViewDate] = useState<Date>(() => parseDMY(value) ?? new Date())
  const wrapRef = useRef<HTMLDivElement>(null)

  const selectedDate = parseDMY(value)
  const today = new Date()

  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [])

  const prevMonth = useCallback(() => {
    setViewDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))
  }, [])

  const nextMonth = useCallback(() => {
    setViewDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))
  }, [])

  const handleDayClick = useCallback(
    (date: Date) => {
      onChange(formatDMY(date))
      setOpen(false)
    },
    [onChange],
  )

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const cells = buildCells(year, month)

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <button
        type="button"
        id={id}
        className={`${styles.trigger} ${open ? styles.trigger_open : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={value ? `Selected date: ${value}` : placeholder}
      >
        {value
          ? <span className={styles.triggerText}>{value}</span>
          : <span className={styles.triggerPlaceholder}>{placeholder}</span>
        }
        <FiChevronDown
          className={`${styles.triggerArrow} ${open ? styles.triggerArrow_open : ''}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          className={`${styles.calendar} ${align === 'right' ? styles.calendar_right : ''}`}
          role="dialog"
          aria-label="Pick a date"
        >
          <div className={styles.header}>
            <button
              type="button"
              className={styles.navBtn}
              onClick={prevMonth}
              aria-label="Previous month"
            >
              &#10094;
            </button>
            <span className={styles.monthYear}>{MONTHS[month]} {year}</span>
            <button
              type="button"
              className={styles.navBtn}
              onClick={nextMonth}
              aria-label="Next month"
            >
              &#10095;
            </button>
          </div>

          <div className={styles.weekdays} aria-hidden="true">
            {WEEKDAYS.map(d => (
              <span key={d} className={styles.weekday}>{d}</span>
            ))}
          </div>

          <div className={styles.days}>
            {cells.map((cell, idx) => {
              const isToday =
                cell.type === 'current' &&
                cell.day === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear()
              const isSelected =
                selectedDate !== null &&
                cell.date.getDate() === selectedDate.getDate() &&
                cell.date.getMonth() === selectedDate.getMonth() &&
                cell.date.getFullYear() === selectedDate.getFullYear()

              return (
                <button
                  key={idx}
                  type="button"
                  className={[
                    styles.day,
                    cell.type !== 'current' ? styles.day_inactive : '',
                    isSelected ? styles.day_selected : '',
                    isToday && !isSelected ? styles.day_today : '',
                  ].filter(Boolean).join(' ')}
                  onClick={() => handleDayClick(cell.date)}
                  aria-label={`${cell.day} ${MONTHS[cell.date.getMonth()]} ${cell.date.getFullYear()}`}
                  aria-pressed={isSelected}
                >
                  {cell.day}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default MiniCalendar
