/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '12mb',
    },
  },
  async rewrites() {
    // Hardcode to the Render backend to prevent Vercel environment variable mismatches from breaking the API proxy (which causes 404s)
    const backendUrl = 'https://sawaflix-backend.onrender.com';
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xjxbjnjspmmpfngbdihd.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        port: '',
        pathname: '/**',
      },
    ],
    // Allow private IPs for Supabase storage in development
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; img-src 'self' blob: data: https://xjxbjnjspmmpfngbdihd.supabase.co https://lh3.googleusercontent.com https://images.unsplash.com https://i.ibb.co; script-src 'none'; sandbox;",
  },
}
export default nextConfig;
