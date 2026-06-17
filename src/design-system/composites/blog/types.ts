export interface BlogAuthor {
  name: string
  avatar: string
}

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  category: string
  publishedAt: string
  readTime: string
  coverImage: string
  author: BlogAuthor
  content?: string
  featured?: boolean
}
