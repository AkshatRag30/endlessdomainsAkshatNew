import React, { useState, useMemo, useCallback } from 'react'
import type { NextPage, GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { CATEGORIES } from '@/data/categories'
import { getAllBlogs, getBlogsByCategory, searchBlogs, paginateBlogs } from '@/lib/blog-utils'
import { BlogFilters } from '@/design-system/composites/blog/BlogFilters'
import { BlogGrid } from '@/design-system/composites/blog/BlogGrid'
import { DomainPagination } from '@/design-system/composites/mydomains/DomainPagination'
import type { BlogSummary } from '@/data/blogs'
import type { Category } from '@/data/categories'
import styles from './blog.module.scss'

interface BlogPageProps {
  categories: Category[]
  heroImage: string
  initialPosts: BlogSummary[]
  totalPosts: number
}

const BlogPage: NextPage<BlogPageProps> = ({ categories, heroImage }) => {
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

      <main className={styles.page}>
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className={styles.hero} aria-labelledby="blog-hero-heading">
          <div className={styles.heroInner}>
            {/* Left — text sits on its respective domain shape; description in gap above bottom shape */}
            <div className={styles.heroLeft}>
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
                <div className={styles.heroImageWrap}>
                  <Image
                    src={heroImage}
                    alt=""
                    fill
                    className={styles.heroImage}
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    priority
                  />
                </div>
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
      heroImage: allBlogs[0].image,
      initialPosts: initial.items,
      totalPosts: allBlogs.length,
    },
  }
}

export default BlogPage
