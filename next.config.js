// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['zh-CN'],
    defaultLocale: 'zh-CN',
  },
  reactStrictMode: true,
  images: {
    domains: [
      'via.placeholder.com',
      'assets.website-files.com',
      'images.unsplash.com',
      'source.unsplash.com',
      'xsgames.co'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
        port: '',
        pathname: '**',
      },
    ],
  },
}

module.exports = nextConfig
