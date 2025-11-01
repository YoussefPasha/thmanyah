/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'is1-ssl.mzstatic.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'is2-ssl.mzstatic.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'is3-ssl.mzstatic.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'is4-ssl.mzstatic.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'is5-ssl.mzstatic.com',
        pathname: '**',
      },
    ],
  },
};

module.exports = nextConfig;

