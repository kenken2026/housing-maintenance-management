/** @type {import('next').NextConfig} */

const nextConfig = {
  output: "export",
  basePath:
    process.env.NODE_ENV === "production"
      ? "/housing-maintenance-management"
      : "",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}

export default nextConfig
