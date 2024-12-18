// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['zh-CN'],
    defaultLocale: 'zh-CN',
  },
  reactStrictMode: true,
  images: {
    domains: ['via.placeholder.com'], // 添加你允许的图片域名
  },
}

module.exports = nextConfig
