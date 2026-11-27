import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  serverExternalPackages: ['playwright'],
  distDir: process.env.NEXT_DIST_DIR || '.next',
}

export default nextConfig
