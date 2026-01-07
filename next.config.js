/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  output: 'standalone',
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Disabled optimizeCss until critters package is installed
  // experimental: {
  //   optimizeCss: true,
  // },
}

module.exports = nextConfig
