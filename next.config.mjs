/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/portfolio.me',
  assetPrefix: '/portfolio.me/',
  env: {
    NEXT_PUBLIC_BASE_PATH: '/portfolio.me',
    // Portfolio fetches live Spotify data from this GitHub Gist (updated weekly by n8n).
    // Override via environment variable if needed.
    NEXT_PUBLIC_MUSIC_DATA_URL: process.env.NEXT_PUBLIC_MUSIC_DATA_URL ||
      'https://gist.githubusercontent.com/srygnk-jpg/e93cf6c8e5a1425bfc4b354485ad8bd9/raw/music-data.json',
  },
  images: {
    unoptimized: true,
  },
  devIndicators: false,
}

export default nextConfig
