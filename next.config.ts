import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Sitio 100 % estático: se sirve desde Vercel, Netlify, Hostinger o cualquier hosting.
  output: 'export',
  trailingSlash: true,
  // Las imágenes y el video se optimizan antes del build (npm run assets -> AVIF/WebP/AV1).
  images: { unoptimized: true },
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    // CSS dentro del HTML: sin petición que bloquee el primer pintado
    inlineCss: true,
  },
}

export default nextConfig
