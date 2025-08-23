
/** @type {import('next').NextConfig} */

const nextConfig = {
    reactStrictMode: true,
    serverExternalPackages: ['faiss-node'],
     images: {
        remotePatterns: [
          {
            protocol: 'https', // or 'http'
            hostname: 'static.scientificamerican.com', // Replace with the actual hostname of your image source
          },
          // Add more objects for other allowed domains
        ],
      },
};

export default nextConfig;
