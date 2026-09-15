import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { hostname: 'cryptologos.cc' },
      { hostname: 'raw.githubusercontent.com' },
      { hostname: 'assets.coingecko.com' },
      { hostname: 'icons.llamao.fi' },
      // Landing page blog teaser — static Ghost CMS content snapshot (see
      // src/data/landingBlogSummary.ts); this project has no Ghost credentials of
      // its own, so the images are still served straight from Ghost's own hosts.
      { hostname: 'endless-domains.ghost.io' },
      { hostname: 'storage.ghost.io' },
    ],
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'src/design-system/styles')],
    additionalData: `@use 'sass:math';`,
    loadPaths: [path.join(__dirname, 'src/design-system/styles')],
    importer: [
      (url, _prev, done) => {
        if (url.startsWith('@newstyles/')) {
          const file = url.replace('@newstyles/', '')
          done({ file: path.join(__dirname, 'src/design-system/styles', file) })
        } else if (url.startsWith('@mpstyles/')) {
          // Marketplace preview's own tokens/mixins (copied from the source
          // project under src/marketplace-preview/) — a separate alias so it
          // never resolves against this project's own design-system/styles.
          const file = url.replace('@mpstyles/', '')
          done({ file: path.join(__dirname, 'src/marketplace-preview/design-system/styles', file) })
        } else {
          done(null)
        }
      },
    ],
  },
}

export default nextConfig
