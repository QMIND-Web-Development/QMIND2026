const withMDX = require('@next/mdx')({
    extension: /\.mdx?$/
  })
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include MDX files
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  images: {
    domains: [process.env.NEXT_PUBLIC_SUPABASE_URL],
  },
  // Optionally, add any other Next.js config below
}
 
module.exports = withMDX(nextConfig)

