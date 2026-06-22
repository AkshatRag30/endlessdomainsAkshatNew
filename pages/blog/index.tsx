import React, { useState, useMemo, useCallback, useEffect } from 'react'
import type { NextPage, GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { FiClock, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
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
  featuredPosts: BlogSummary[]
}

const BlogPage: NextPage<BlogPageProps> = ({ categories, featuredPosts }) => {
  // ── Featured slide tooltip state ────────────────────────────────────────
  const [slideHovered, setSlideHovered] = useState(false)
  const [slidePos, setSlidePos] = useState({ x: 0, y: 0 })

  const handleSlideMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setSlidePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }, [])

  const handleSlideMouseEnter = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setSlidePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    setSlideHovered(true)
  }, [])

  const handleSlideMouseLeave = useCallback(() => setSlideHovered(false), [])

  // ── Featured slider state ────────────────────────────────────────────────
  const [featuredIdx, setFeaturedIdx] = useState(0)
  const featuredPost = featuredPosts[featuredIdx]
  const featuredAuthor = getAuthorById(featuredPost.authorId)

  const prevFeatured = useCallback(() => {
    setFeaturedIdx(i => (i - 1 + featuredPosts.length) % featuredPosts.length)
  }, [featuredPosts.length])

  const nextFeatured = useCallback(() => {
    setFeaturedIdx(i => (i + 1) % featuredPosts.length)
  }, [featuredPosts.length])

  // Autoplay featured slider
  useEffect(() => {
    const t = setInterval(nextFeatured, 5000)
    return () => clearInterval(t)
  }, [nextFeatured])

  // ── Grid state ───────────────────────────────────────────────────────────
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

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section className={styles.hero} aria-labelledby="blog-hero-heading">
          <div className={styles.heroInner}>

            {/* Left — label, heading, description, trending slider */}
            <div className={styles.heroLeft}>
              <p className={styles.heroLabel}>
                <span className={styles.bracketTL} aria-hidden="true" />
                <span className={styles.bracketTR} aria-hidden="true" />
                <span className={styles.bracketBL} aria-hidden="true" />
                <span className={styles.bracketBR} aria-hidden="true" />
                News Feed
              </p>

              <h1 id="blog-hero-heading" className={styles.heroHeading}>Blog</h1>

              <p className={styles.heroDescription}>
                Insights on Web3 identity, decentralized domains, and the open web.
              </p>

            </div>

            {/* Right — featured post slider */}
            <div className={styles.heroRight}>
              <div className={styles.featuredSlider}>
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className={styles.featuredSlide}
                  aria-label={featuredPost.title}
                  onMouseEnter={handleSlideMouseEnter}
                  onMouseMove={handleSlideMouseMove}
                  onMouseLeave={handleSlideMouseLeave}
                >
                  <Image
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    fill
                    className={styles.featuredSlideImg}
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    priority
                  />
                  {/* Top badges */}
                  <span className={styles.featuredBadgeLatest}>Latest</span>
                  <span className={styles.featuredBadgeMeta}>
                    <FiClock size={10} aria-hidden="true" />
                    {featuredPost.readingTime} Min
                  </span>
                  {/* Bottom content overlay */}
                  <div className={styles.featuredOverlay}>
                    <p className={styles.featuredOverlayCat}>{featuredPost.category}</p>
                    <h2 className={styles.featuredOverlayTitle}>{featuredPost.title}</h2>
                    <p className={styles.featuredOverlayExcerpt}>{featuredPost.excerpt}</p>
                    <div className={styles.featuredOverlayMeta}>
                      <span className={styles.featuredOverlayMetaItem}>
                        {formatDate(featuredPost.publishedAt)}
                      </span>
                      <span className={styles.featuredOverlayMetaDot} aria-hidden="true" />
                      <span className={styles.featuredOverlayMetaItem}>
                        {featuredPost.views >= 1000 ? `${(featuredPost.views / 1000).toFixed(1)}k` : featuredPost.views} views
                      </span>
                      {featuredAuthor && (
                        <div className={styles.featuredOverlayAuthor}>
                          {featuredAuthor.avatar && (
                            <div className={styles.featuredOverlayAvatar}>
                              <Image src={featuredAuthor.avatar} alt={featuredAuthor.name} width={18} height={18} className={styles.featuredOverlayAvatarImg} />
                            </div>
                          )}
                          <span className={styles.featuredOverlayAuthorName}>{featuredAuthor.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>

                {/* Cursor-follower tooltip — outside the clip-path Link so it never gets clipped */}
                <span
                  className={`${styles.slideTooltip} ${slideHovered ? styles.slideTooltipVisible : ''}`}
                  style={{ '--tx': `${slidePos.x}px`, '--ty': `${slidePos.y}px` } as React.CSSProperties}
                  aria-hidden="true"
                >Read whole blog</span>

                {/* Slider controls */}
                <div className={styles.sliderControls}>
                  <button
                    className={styles.sliderBtn}
                    onClick={prevFeatured}
                    disabled={featuredIdx === 0}
                    aria-label="Previous featured post"
                  >
                    <FiChevronLeft size={18} aria-hidden="true" />
                  </button>
                  <div className={styles.sliderProgress} aria-hidden="true">
                    <div
                      className={styles.sliderProgressFill}
                      style={{ width: `${(featuredIdx / (featuredPosts.length - 1)) * 100}%` }}
                    />
                  </div>
                  <button
                    className={styles.sliderBtn}
                    onClick={nextFeatured}
                    disabled={featuredIdx === featuredPosts.length - 1}
                    aria-label="Next featured post"
                  >
                    <FiChevronRight size={18} aria-hidden="true" />
                  </button>
                </div>
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

  const featuredPosts = allBlogs.slice(0, 5)

  return {
    props: {
      categories: CATEGORIES,
      featuredPosts,
    },
  }
}

export default BlogPage
