import withFlowbiteReact from "flowbite-react/plugin/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimizaciones básicas
  experimental: {
    optimizePackageImports: ['flowbite-react'],
  },
  
  // Optimizaciones de imágenes
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 año
  },
  
  // Headers de seguridad y rendimiento
  async headers() {
    return [
      {
        source: '/api/archivo/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  
  // Configuración de webpack simplificada
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    
    // Configuración básica para reducir warnings en desarrollo
    if (config.mode === 'development') {
      config.stats = {
        ...config.stats,
        warningsFilter: [
          /Critical dependency: the request of a dependency is an expression/,
          /Module not found: Error: Can't resolve/
        ]
      };
    }
    
    return config;
  },
};

export default withFlowbiteReact(nextConfig);