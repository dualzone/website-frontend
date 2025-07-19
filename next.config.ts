import type { NextConfig } from "next";


const nextConfig: NextConfig = {
    images: {
        domains: ["avatars.steamstatic.com"], // ← ici tu autorises le domaine externe
    },
    /* config options here */
}

export default nextConfig;
