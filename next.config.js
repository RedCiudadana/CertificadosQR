/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/qr-certificate-generator',
  images: { unoptimized: true },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;