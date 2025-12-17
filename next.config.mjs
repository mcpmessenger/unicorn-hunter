/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Set workspace root to silence lockfile warning
  experimental: {
    turbo: {
      root: process.cwd(),
    },
  },
}

export default nextConfig