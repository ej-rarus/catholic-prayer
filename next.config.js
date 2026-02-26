/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
};

module.exports = nextConfig;
