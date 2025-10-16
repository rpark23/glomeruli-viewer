/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/images/:path*',
        destination: '/api/images/:path*',
      },
      {
        source: '/masks/:path*',
        destination: '/api/masks/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
