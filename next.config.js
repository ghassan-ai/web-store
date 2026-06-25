/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['three', 'postprocessing'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vbongyscfjlinzjjfjpr.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

module.exports = nextConfig;
