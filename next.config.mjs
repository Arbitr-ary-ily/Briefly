/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
      NEWS_API_KEY: process.env.NEWS_API_KEY,
      GUARDIAN_API_KEY: process.env.GUARDIAN_API_KEY,
      NYT_API_KEY: process.env.NYT_API_KEY,
    },
  }
  
export default nextConfig;
