const withMDX = require('@next/mdx')({
    extension: /\.mdx?$/
  })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const publicSupabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
let publicKeyRole
try {
  publicKeyRole = JSON.parse(Buffer.from(publicSupabaseKey.split('.')[1], 'base64url').toString()).role
} catch {}
if (publicSupabaseKey.startsWith('sb_secret_') || publicKeyRole === 'service_role') {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY must be a publishable/anon key, never a Supabase secret or service-role key.')
}
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

