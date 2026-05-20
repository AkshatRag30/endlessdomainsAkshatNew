import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { hostname: 'cryptologos.cc' },
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
        } else {
          done(null)
        }
      },
    ],
  },
}

export default nextConfig
