/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: true
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'randomuser.me',
            },
        ],
    },

    experimental: {
        serverActions: {
            bodySizeLimit: '5mb', // Set the body size limit to 5 megabytes
        },
    },
};

export default nextConfig;
