/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  // Para publicar em subpasta, defina NEXT_PUBLIC_BASE_PATH
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  trailingSlash: true,
  // build para hospedagem em pasta relativa (ex.: prévia publicada)
  ...(process.env.RELATIVE_ASSETS ? { assetPrefix: '.' } : {}),
};
export default nextConfig;
