import { BLOGS, type BlogSummary } from '@/data/blogs'
import { FEATURED_BLOG } from '@/data/featuredBlog'
import { PAGINATION_CONFIG } from '@/data/pagination'

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export function getAllBlogs(): BlogSummary[] {
  return BLOGS.slice().sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
}

export function getFeaturedBlog(): BlogSummary {
  return FEATURED_BLOG
}

export function getBlogBySlug(slug: string): BlogSummary | undefined {
  return BLOGS.find(b => b.slug === slug)
}

export function getBlogsByCategory(category: string): BlogSummary[] {
  if (!category || category.toLowerCase() === 'all') return getAllBlogs()
  return BLOGS.filter(b => b.category.toLowerCase() === category.toLowerCase()).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
}

export function searchBlogs(query: string): BlogSummary[] {
  const q = query.toLowerCase().trim()
  if (!q) return getAllBlogs()
  return BLOGS.filter(
    b =>
      b.title.toLowerCase().includes(q) ||
      b.excerpt.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q)
  ).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

export function paginateBlogs(
  blogs: BlogSummary[],
  page: number,
  pageSize: number = PAGINATION_CONFIG.pageSize
): PaginatedResult<BlogSummary> {
  const total = blogs.length
  const totalPages = Math.ceil(total / pageSize)
  const safePage = Math.max(1, Math.min(page, totalPages || 1))
  const start = (safePage - 1) * pageSize
  const items = blogs.slice(start, start + pageSize)

  return {
    items,
    total,
    page: safePage,
    pageSize,
    totalPages,
    hasNext: safePage < totalPages,
    hasPrev: safePage > 1,
  }
}

export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
