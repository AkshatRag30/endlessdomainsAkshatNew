import React from 'react'
import type { NextPage, GetStaticProps, GetStaticPaths } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { BLOGS } from '@/data/blogs'
import { BLOG_DETAILS } from '@/data/blogDetails'
import { AUTHORS, getAuthorById } from '@/data/authors'
import { getBlogBySlug, paginateBlogs, getAllBlogs, formatDate } from '@/lib/blog-utils'
import { BlogPostHeader } from '@/design-system/composites/blog/BlogPostHeader'
import { BlogPostBody } from '@/design-system/composites/blog/BlogPostBody'
import { BlogGrid } from '@/design-system/composites/blog/BlogGrid'
import type { BlogSummary } from '@/data/blogs'
import type { BlogDetail } from '@/data/blogDetails'
import type { Author } from '@/data/authors'
import styles from './slug.module.scss'

export interface TocItem {
  id: string
  text: string
}

interface BlogPostPageProps {
  post: BlogSummary
  detail: BlogDetail
  author: Author
  relatedPosts: BlogSummary[]
  toc: TocItem[]
  popularPosts: BlogSummary[]
}

function extractToc(html: string): TocItem[] {
  const matches = [...html.matchAll(/<h2[^>]*>(.*?)<\/h2>/gi)]
  return matches.map((m, i) => ({
    id: `heading-${i + 1}`,
    text: m[1].replace(/<[^>]+>/g, '').trim(),
  }))
}

function injectHeadingIds(html: string, toc: TocItem[]): string {
  if (!toc?.length) return html
  let idx = 0
  return html.replace(/<h2([^>]*)>/gi, () => {
    const id = toc[idx]?.id ?? `heading-${idx + 1}`
    idx++
    return `<h2$1 id="${id}">`
  })
}

const BlogPostPage: NextPage<BlogPostPageProps> = ({ post, detail, author, relatedPosts, toc = [], popularPosts = [] }) => {
  const contentWithIds = injectHeadingIds(detail.content, toc)

  return (
    <>
      <Head>
        <title>{detail.seo.title}</title>
        <meta name="description" content={detail.seo.description} />
        <meta name="keywords" content={detail.seo.keywords.join(', ')} />
        <meta property="og:title" content={detail.seo.title} />
        <meta property="og:description" content={detail.seo.description} />
        <meta property="og:image" content={detail.heroImage} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.publishedAt} />
        <meta property="article:author" content={author.name} />
        <meta property="article:section" content={post.category} />
        {detail.seo.keywords.map(kw => (
          <meta key={kw} property="article:tag" content={kw} />
        ))}
        <link rel="canonical" href={`https://endlessdomains.io/blog/${post.slug}`} />
      </Head>

      <main className={styles.page}>
        <BlogPostHeader post={post} author={author} />
        <BlogPostBody
          content={contentWithIds}
          author={author}
          toc={toc}
          popularPosts={popularPosts}
          formatDate={formatDate}
        />

        {relatedPosts.length > 0 && (
          <section className={styles.related} aria-labelledby="related-heading">
            <div className={styles.relatedInner}>
              <div className={styles.relatedHeader}>
                <h2 id="related-heading" className={styles.relatedTitle}>More Articles</h2>
                <Link href="/blog" className={styles.relatedViewAll}>
                  View all
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
              <BlogGrid posts={relatedPosts} />
            </div>
          </section>
        )}

        {/* Dark footer CTA banner */}
        <div className={styles.footerBanner}>
          <div className={styles.footerBannerBg} aria-hidden="true" />
          <div className={styles.footerBannerInner}>
            <div className={styles.footerBannerText}>
              <p className={styles.footerBannerEyebrow}>Endless Domains</p>
              <h2 className={styles.footerBannerTitle}>Take control of your crypto.</h2>
            </div>
            <Link href="/" className={styles.footerBannerBtn}>
              Get your domain
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = BLOGS.map(blog => ({ params: { slug: blog.slug } }))
  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps<BlogPostPageProps> = async ({ params }) => {
  const slug = params?.slug as string
  const post = getBlogBySlug(slug)
  const detail = BLOG_DETAILS.find(d => d.slug === slug)

  if (!post || !detail) return { notFound: true }

  const author = getAuthorById(post.authorId) ?? AUTHORS[5]
  const allBlogs = getAllBlogs()

  const sameCategory = allBlogs.filter(b => b.category === post.category && b.slug !== slug)
  const relatedPosts = sameCategory.length >= 3
    ? sameCategory.slice(0, 3)
    : paginateBlogs(allBlogs.filter(b => b.slug !== slug), 1, 3).items

  const toc = extractToc(detail.content)
  const popularPosts = [...allBlogs]
    .filter(b => b.slug !== slug)
    .sort((a, b) => b.views - a.views)
    .slice(0, 3)

  return {
    props: { post, detail, author, relatedPosts, toc, popularPosts },
  }
}

export default BlogPostPage
