import React, { useState, useCallback, useEffect, useRef } from 'react'
import { FiSearch, FiX, FiChevronDown } from 'react-icons/fi'
import { EventCard } from '../EventCard'
import type { EventCardData } from '../EventCard'
import styles from './EventsGrid.module.scss'

type FilterTab = 'all' | 'global' | 'regional' | 'virtual'

const LOCATION_OPTIONS = ['All Location', 'India', 'Dubai', 'Singapore', 'New Delhi', 'Mumbai', 'Bangalore']

interface EventsGridProps {
  events?: EventCardData[]
}

const PLACEHOLDER_EVENTS: EventCardData[] = [
  {
    id: '1',
    title: 'Domainer Conference and Expo',
    excerpt: "The world's premier domain industry gathering — TOKEN2049 Dubai brings together global blockchain leaders, NFT pioneers, and Web3 builders to shape the future of digital identity.",
    image: '/events/Frame 1.jpg',
    category: 'global',
    date: '12/3/25',
    location: 'Bangalore',
    href: '/events/domainer-conference-expo',
  },
  {
    id: '2',
    title: 'TOKEN2049 Dubai',
    excerpt: 'Connect with the largest Web3 ecosystem builders, domain innovators, and on-chain identity pioneers at the most anticipated crypto conference of the year.',
    image: '/events/Frame 2.jpg',
    category: 'global',
    date: '01/5/25',
    location: 'Dubai',
    href: '/events/token2049-dubai',
  },
  {
    id: '3',
    title: 'ETHGlobal New Delhi',
    excerpt: 'Hack, build, and innovate on Ethereum with a global community of developers. Endless Domains will be sponsoring prizes for the best Web3 identity projects.',
    image: '/events/Frame 3.jpg',
    category: 'hackathon',
    date: '14/4/25',
    location: 'New Delhi',
    href: '/events/ethglobal-new-delhi',
  },
  {
    id: '4',
    title: 'India Blockchain Week',
    excerpt: 'India\'s biggest blockchain event brings together founders, investors, and developers to accelerate the adoption of decentralised technology across South Asia.',
    image: '/events/Frame 4.jpg',
    category: 'regional',
    date: '22/6/25',
    location: 'Mumbai',
    href: '/events/india-blockchain-week',
  },
  {
    id: '5',
    title: 'Domain Days Dubai',
    excerpt: 'A dedicated summit for the domain industry — connect with registrars, investors, and platform builders shaping the next generation of digital identity.',
    image: '/events/Frame 6.jpg',
    category: 'global',
    date: '10/7/25',
    location: 'Dubai',
    href: '/events/domain-days-dubai',
  },
  {
    id: '6',
    title: 'Web3 Identity Summit',
    excerpt: 'Explore the intersection of blockchain identity, NFT domains, and decentralised naming systems at this dedicated summit for Web3 identity innovators.',
    image: '/events/Frame 1.jpg',
    category: 'summit',
    date: '18/8/25',
    location: 'Singapore',
    href: '/events/web3-identity-summit',
  },
]

const TABS: { key: FilterTab; label: string }[] = [
  { key: 'all',      label: 'All'      },
  { key: 'global',   label: 'Global'   },
  { key: 'regional', label: 'Regional' },
  { key: 'virtual',  label: 'Virtual'  },
]

export function EventsGrid({ events = PLACEHOLDER_EVENTS }: EventsGridProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState('All Location')
  const [locationOpen, setLocationOpen] = useState(false)
  const locationRef = useRef<HTMLDivElement>(null)

  const handleTabClick = useCallback((tab: FilterTab) => setActiveTab(tab), [])
  const handleClear = useCallback(() => setSearchQuery(''), [])
  const handleLocationToggle = useCallback(() => setLocationOpen(prev => !prev), [])
  const handleLocationSelect = useCallback((opt: string) => { setLocation(opt); setLocationOpen(false) }, [])

  useEffect(() => {
    if (!locationOpen) return
    const handler = (e: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) setLocationOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [locationOpen])

  const filteredEvents = events.filter(e => {
    const matchSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) || e.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchTab = activeTab === 'all' || e.category === activeTab
    const matchLocation = location === 'All Location' || e.location.toLowerCase() === location.toLowerCase()
    return matchSearch && matchTab && matchLocation
  })

  return (
    <section id="browse" className={styles.section} aria-labelledby="events-grid-heading">

      {/* ── Title block ── */}
      <div className={styles.titleBlock}>
        <div className={styles.eyebrowWrap} aria-hidden="true">
          <span className={styles.bracketTL} />
          <span className={styles.bracketTR} />
          <span className={styles.bracketBL} />
          <span className={styles.bracketBR} />
          <p className={styles.eyebrow}>BROWSE</p>
        </div>
        <h2 id="events-grid-heading" className={styles.heading}>
          All Events
        </h2>
        <p className={styles.headingBlue}>100+ Gatherings</p>
      </div>

      {/* ── Controls row — search left, tabs + dropdown right ── */}
      <div className={styles.controlsRow}>

        {/* Search — GM style */}
        <div className={styles.searchForm}>
          <div className={styles.searchInputWrap}>
            <input
              type="search"
              className={styles.searchInput}
              placeholder="Search"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              aria-label="Search events"
            />
            {searchQuery && (
              <div className={styles.clearWrap}>
                <button className={styles.clearBtn} onClick={handleClear} aria-label="Clear search">
                  <FiX size={14} />
                </button>
              </div>
            )}
          </div>
          <div className={styles.searchDivider} aria-hidden="true" />
          <button className={styles.searchBtn} aria-label="Search events">
            <FiSearch size={18} aria-hidden="true" />
            <span>Search Events</span>
          </button>
        </div>

        {/* Filter tabs and location — two visually separate controls */}
        <div className={styles.filtersRight}>
          <nav className={styles.tabs} role="tablist" aria-label="Filter events by type">
            {TABS.map((tab, index) =>
              React.createElement(
                React.Fragment,
                { key: tab.key },
                index > 0 && <span className={styles.tabSep} aria-hidden="true" />,
                <button
                  role="tab"
                  type="button"
                  aria-selected={activeTab === tab.key}
                  className={`${styles.tab} ${styles[`tab_${tab.key}`]} ${activeTab === tab.key ? styles.tabActive : ''}`}
                  onClick={() => handleTabClick(tab.key)}
                >
                  <span>{tab.label}</span>
                </button>,
              )
            )}
          </nav>

          {/* Location dropdown — its own separate control, not part of the tabs bar */}
          <div className={styles.locationWrap} ref={locationRef}>
            <button
              type="button"
              className={styles.locationTrigger}
              onClick={handleLocationToggle}
              aria-expanded={locationOpen}
              aria-haspopup="listbox"
            >
              <span>{location}</span>
              <FiChevronDown
                size={14}
                aria-hidden="true"
                className={`${styles.locationChevron} ${locationOpen ? styles.locationChevronOpen : ''}`}
              />
            </button>
            {locationOpen && (
              <ul className={styles.locationPanel} role="listbox" aria-label="Location options">
                {LOCATION_OPTIONS.map(opt => (
                  <li key={opt} role="option" aria-selected={opt === location}>
                    <button
                      type="button"
                      className={`${styles.locationOption} ${opt === location ? styles.locationOptionSelected : ''}`}
                      onClick={() => handleLocationSelect(opt)}
                    >
                      {opt}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

      </div>

      {/* ── Dashed divider + hatched band — no gap between them ── */}
      <div className={styles.dividerGroup} aria-hidden="true">
        <div className={styles.fullDivider} />
        <div className={styles.hatchBand} />
      </div>

      {/* ── Card grid ── */}
      <div className={styles.grid}>
        {filteredEvents.map(event => (
          <div key={event.id} className={styles.gridItem}>
            <EventCard event={event} />
          </div>
        ))}
        {filteredEvents.length === 0 && (
          <p className={styles.emptyState}>No events found.</p>
        )}
      </div>

    </section>
  )
}

export default EventsGrid
