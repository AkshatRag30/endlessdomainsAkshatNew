import React, { useState, useMemo, useCallback } from 'react'
import type { NextPage, GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { FiEye, FiClock, FiMapPin } from 'react-icons/fi'
import { CATEGORIES } from '@/data/categories'
import { getAllBlogs, getBlogsByCategory, searchBlogs, paginateBlogs, formatDate } from '@/lib/blog-utils'
import { getAuthorById } from '@/data/authors'
import { BlogFilters } from '@/design-system/composites/blog/BlogFilters'
import { BlogGrid } from '@/design-system/composites/blog/BlogGrid'
import { DomainPagination } from '@/design-system/composites/mydomains/DomainPagination'
import { PerksNavBar } from '@/design-system/composites/reputation/perks/PerksNavBar/PerksNavBar'
import type { BlogSummary } from '@/data/blogs'
import type { Category } from '@/data/categories'
import styles from './blog.module.scss'

interface BlogPageProps {
  categories: Category[]
  heroPost: BlogSummary
  initialPosts: BlogSummary[]
  totalPosts: number
}

const BlogPage: NextPage<BlogPageProps> = ({ categories, heroPost }) => {
  const heroAuthor = getAuthorById(heroPost.authorId)
  const [heroTooltipVisible, setHeroTooltipVisible] = useState(false)
  const [heroTooltipPos, setHeroTooltipPos] = useState({ x: 0, y: 0 })

  const handleHeroMouseEnter = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setHeroTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    setHeroTooltipVisible(true)
  }, [])

  const handleHeroMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setHeroTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }, [])

  const handleHeroMouseLeave = useCallback(() => {
    setHeroTooltipVisible(false)
  }, [])
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('newest')

  const filteredPosts = useMemo(() => {
    if (searchQuery.trim()) return searchBlogs(searchQuery)
    return getBlogsByCategory(activeCategory)
  }, [activeCategory, searchQuery])

  const paginated = useMemo(
    () => paginateBlogs(filteredPosts, currentPage),
    [filteredPosts, currentPage]
  )

  const handleCategoryChange = useCallback((slug: string) => {
    setActiveCategory(slug)
    setCurrentPage(1)
    setSearchQuery('')
  }, [])

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
    if (query) setActiveCategory('all')
  }, [])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <>
      <Head>
        <title>Blog | Endless Domains — Insights on Web3, Identity & Domains</title>
        <meta
          name="description"
          content="Deep dives, tutorials, and news from the frontlines of on-chain identity and multi-chain domain infrastructure."
        />
        <meta property="og:title" content="Blog | Endless Domains" />
        <meta
          property="og:description"
          content="Deep dives, tutorials, and news from the frontlines of on-chain identity and multi-chain domain infrastructure."
        />
        <meta property="og:type" content="website" />
      </Head>

      <PerksNavBar onGoldClick={() => {}} goldButtonVariant="gold" />
      <main className={styles.page}>
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className={styles.hero} aria-labelledby="blog-hero-heading">
          <div className={styles.heroInner}>
            {/* Left — text sits on its respective domain shape; description in gap above bottom shape */}
            <div className={styles.heroLeft}>
              <div className={styles.angledBorderTop} aria-hidden="true" />
              <div className={styles.shapeRow}>
                <div className={styles.domainShape} aria-hidden="true"><div className={styles.domainShapeAccent} /></div>
                <p className={styles.heroLabel}>
                  <span className={styles.bracketTL} aria-hidden="true" />
                  <span className={styles.bracketTR} aria-hidden="true" />
                  <span className={styles.bracketBL} aria-hidden="true" />
                  <span className={styles.bracketBR} aria-hidden="true" />
                  News Feed
                </p>
              </div>
              <div className={styles.heroLeftBottom}>
                <div className={styles.shapeRow}>
                  <div className={styles.domainShape} aria-hidden="true"><div className={styles.domainShapeAccent} /></div>
                  <h1 id="blog-hero-heading" className={styles.heroHeading}>Blog</h1>
                </div>
                <p className={styles.heroDescription}>
                  Insights on Web3 identity, decentralized domains, and the open web.
                </p>
                <div className={styles.domainShape} aria-hidden="true"><div className={styles.domainShapeAccent} /></div>
              </div>
            </div>

            {/* Right — latest blog thumbnail inside polygon clip + diagonal strip below */}
            <div className={styles.heroRight}>
              <div className={styles.heroRightInner}>
                <Link
                  href={`/blog/${heroPost.slug}`}
                  className={styles.heroImageWrap}
                  aria-label={heroPost.title}
                  onMouseEnter={handleHeroMouseEnter}
                  onMouseMove={handleHeroMouseMove}
                  onMouseLeave={handleHeroMouseLeave}
                >
                  {/* Tooltip — follows cursor */}
                  <span
                    className={`${styles.heroTooltip} ${heroTooltipVisible ? styles.heroTooltipVisible : ''}`}
                    style={{ '--tx': `${heroTooltipPos.x}px`, '--ty': `${heroTooltipPos.y}px` } as React.CSSProperties}
                    aria-hidden="true"
                  >Read whole blog</span>
                  <Image
                    src={heroPost.image}
                    alt={heroPost.title}
                    fill
                    className={styles.heroImage}
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    priority
                  />
                  {/* Category pill — top left */}
                  <span className={styles.heroCategoryBadge}>{heroPost.category}</span>
                  {/* Meta pill — top right */}
                  <div className={styles.heroMetaBadge} aria-hidden="true">
                    <span className={styles.heroMetaItem}>
                      <FiEye size={9} />
                      {heroPost.views >= 1000 ? `${(heroPost.views / 1000).toFixed(1)}k` : heroPost.views}
                    </span>
                    <span className={styles.heroMetaDivider} />
                    <span className={styles.heroMetaItem}>
                      <FiClock size={9} />
                      {formatDate(heroPost.publishedAt)} · {heroPost.readingTime} Min
                    </span>
                  </div>
                  {/* Bottom pill — author + location */}
                  <div className={styles.heroBottomPill} aria-hidden="true">
                    {heroAuthor?.avatar && (
                      <div className={styles.heroAuthorAvatar}>
                        <Image src={heroAuthor.avatar} alt={heroAuthor.name} fill className={styles.heroAuthorAvatarImg} />
                      </div>
                    )}
                    <span className={styles.heroBottomPillText}>{heroAuthor?.name ?? 'Endless Domains'}</span>
                    <span className={styles.heroMetaDivider} />
                    <FiMapPin size={10} />
                    <span className={styles.heroBottomPillText}>{heroPost.location ?? 'Global'}</span>
                  </div>
                </Link>
                {/* Diagonal lines strip — sits directly below the thumbnail */}
                <div className={styles.heroDiagStrip} aria-hidden="true" />
              </div>
            </div>
          </div>
        </section>


        {/* ── Filters ───────────────────────────────────────────────────── */}
        <BlogFilters
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* ── Grid ──────────────────────────────────────────────────────── */}
        <section className={styles.gridSection} aria-label="Blog articles">
          <div className={styles.gridInner}>
            <BlogGrid
              posts={paginated.items}
              emptyMessage={
                searchQuery
                  ? `No articles found for "${searchQuery}"`
                  : `No articles in ${activeCategory === 'all' ? 'this category' : activeCategory} yet.`
              }
            />

            {/* ── Pagination ────────────────────────────────────────────── */}
            <DomainPagination
              current={currentPage}
              total={paginated.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </section>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps<BlogPageProps> = async () => {
  const allBlogs = getAllBlogs()
  const initial = paginateBlogs(allBlogs, 1)

  return {
    props: {
      categories: CATEGORIES,
      heroPost: allBlogs[0],
      initialPosts: initial.items,
      totalPosts: allBlogs.length,
    },
  }
}

export default BlogPage
