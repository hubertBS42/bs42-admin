/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	// output: 'standalone',
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'bs42shopstorage.blob.core.windows.net',
				port: '',
			},
		],
	},
}

module.exports = nextConfig
