const withMDX = require('@next/mdx')({
    extension: /\.mdx?$/
  })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseHostname = supabaseUrl
  ? new URL(supabaseUrl).hostname
  : null
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include MDX files
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  images: {
    domains: supabaseHostname ? [supabaseHostname] : [],
  },
  // Optionally, add any other Next.js config below
}
 
module.exports = withMDX(nextConfig)

