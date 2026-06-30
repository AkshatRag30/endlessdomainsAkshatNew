import React, { useState, useCallback } from 'react'
import { FiSearch } from 'react-icons/fi'
import { EventCard } from '../EventCard'
import type { EventCardData } from '../EventCard'
import styles from './EventsGrid.module.scss'

type FilterTab = 'all' | 'upcoming' | 'past'

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
    href: '#',
  },
  {
    id: '2',
    title: 'TOKEN2049 Dubai',
    excerpt: 'Connect with the largest Web3 ecosystem builders, domain innovators, and on-chain identity pioneers at the most anticipated crypto conference of the year.',
    image: '/events/Frame 2.jpg',
    category: 'global',
    date: '01/5/25',
    location: 'Dubai',
    href: '#',
  },
  {
    id: '3',
    title: 'ETHGlobal New Delhi',
    excerpt: 'Hack, build, and innovate on Ethereum with a global community of developers. Endless Domains will be sponsoring prizes for the best Web3 identity projects.',
    image: '/events/Frame 3.jpg',
    category: 'hackathon',
    date: '14/4/25',
    location: 'New Delhi',
    href: '#',
  },
  {
    id: '4',
    title: 'India Blockchain Week',
    excerpt: 'India\'s biggest blockchain event brings together founders, investors, and developers to accelerate the adoption of decentralised technology across South Asia.',
    image: '/events/Frame 4.jpg',
    category: 'regional',
    date: '22/6/25',
    location: 'Mumbai',
    href: '#',
  },
  {
    id: '5',
    title: 'Domain Days Dubai',
    excerpt: 'A dedicated summit for the domain industry — connect with registrars, investors, and platform builders shaping the next generation of digital identity.',
    image: '/events/Frame 6.jpg',
    category: 'global',
    date: '10/7/25',
    location: 'Dubai',
    href: '#',
  },
  {
    id: '6',
    title: 'Web3 Identity Summit',
    excerpt: 'Explore the intersection of blockchain identity, NFT domains, and decentralised naming systems at this dedicated summit for Web3 identity innovators.',
    image: '/events/Frame 1.jpg',
    category: 'summit',
    date: '18/8/25',
    location: 'Singapore',
    href: '#',
  },
]

export function EventsGrid({ events = PLACEHOLDER_EVENTS }: EventsGridProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>('upcoming')
  const [searchQuery, setSearchQuery] = useState('')

  const handleTabClick = useCallback((tab: FilterTab) => setActiveTab(tab), [])

  const filteredEvents = events.filter(e =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <section className={styles.section} aria-labelledby="events-grid-heading">

      {/* ── Section header ── */}
      <div className={styles.sectionHeader}>

        {/* Left — eyebrow + heading */}
        <div className={styles.headerLeft}>
          <div className={styles.eyebrowWrap} aria-hidden="true">
            <span className={styles.bracketTL} />
            <span className={styles.bracketTR} />
            <span className={styles.bracketBL} />
            <span className={styles.bracketBR} />
            <p className={styles.eyebrow}>Our Events</p>
          </div>
          <h2 id="events-grid-heading" className={styles.heading}>
            Events <span className={styles.headingLight}>we attend</span>
          </h2>
        </div>

        {/* Right — search + filter tabs */}
        <div className={styles.headerRight}>
          {/* Search input */}
          <div className={styles.searchWrap}>
            <FiSearch className={styles.searchIcon} size={16} aria-hidden="true" />
            <input
              type="search"
              className={styles.searchInput}
              placeholder="Search events"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              aria-label="Search events"
            />
          </div>

          {/* Filter tabs */}
          <nav className={styles.tabsWrap} aria-label="Event filters">
            <div className={styles.tabsBg}>
              {(['all', 'upcoming', 'past'] as FilterTab[]).map(tab => (
                <button
                  key={tab}
                  type="button"
                  className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
                  onClick={() => handleTabClick(tab)}
                  aria-pressed={activeTab === tab}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </nav>
        </div>

      </div>

      {/* ── Dashed full-width divider ── */}
      <div className={styles.fullDivider} aria-hidden="true" />

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
