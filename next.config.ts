/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config:any) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };
    return config;
  },
  // Pour éviter les problèmes avec les librairies de scan
  experimental: {
    esmExternals: 'loose'
  }
}

module.exports = nextConfig