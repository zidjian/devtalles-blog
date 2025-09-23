import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    async redirects() {
        return [
            {
                source: '/',
                destination: '/landing',
                permanent: true,
            },
        ];
    },
    images: {
        domains: ['res.cloudinary.com'],
    },
};

export default nextConfig;
