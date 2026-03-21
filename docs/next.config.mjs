import { createMDX } from 'fumadocs-mdx/next';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// The pnpm workspace root is one level above docs/.
// Pointing turbopack.root here ensures Turbopack resolves the single
// pnpm-lock.yaml at the repository root instead of treating docs/ as a
// separate workspace and emitting the "multiple lockfiles" warning.
const workspaceRoot = join(__dirname, '..');

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  serverExternalPackages: ['@takumi-rs/image-response'],
  reactStrictMode: true,
  turbopack: {
    root: workspaceRoot,
  },
  async rewrites() {
    return [
      {
        source: '/docs/:path*.mdx',
        destination: '/llms.mdx/docs/:path*',
      },
    ];
  },
};

export default withMDX(config);
