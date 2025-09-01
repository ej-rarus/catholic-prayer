/** @type {import('next').NextConfig} */
const nextConfig = {
  // 정적 파일 최적화
  images: {
    domains: [],
  },
  // 기존 public 폴더의 정적 파일들을 유지
  async rewrites() {
    return [
      {
        source: '/church-bell.wav',
        destination: '/public/church-bell.wav',
      },
      {
        source: '/logo.png',
        destination: '/public/logo.png',
      },
    ];
  },
  // 성능 최적화
  compress: true,
  poweredByHeader: false,
  // SEO 최적화
  generateEtags: true,
};

module.exports = nextConfig;
