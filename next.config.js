/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.blob.core.windows.net", pathname: "/**" },
    ],
  },
};

module.exports = nextConfig;
