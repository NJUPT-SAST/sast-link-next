import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center flex-1 px-6 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">SAST Link</h1>
      <p className="text-fd-muted-foreground text-lg mb-2 max-w-xl">
        Identity and account management platform for the Software Association of Science and Technology.
      </p>
      <p className="text-fd-muted-foreground mb-8 max-w-xl">
        This documentation covers the <code>sast-link-next</code> implementation: a Next.js 16 application with Tauri 2 desktop packaging.
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <Link
          href="/docs/getting-started"
          className="inline-flex items-center rounded-md bg-fd-primary px-5 py-2.5 text-sm font-medium text-fd-primary-foreground hover:bg-fd-primary/90 transition-colors"
        >
          Get Started
        </Link>
        <Link
          href="/docs"
          className="inline-flex items-center rounded-md border border-fd-border px-5 py-2.5 text-sm font-medium hover:bg-fd-accent transition-colors"
        >
          Browse Documentation
        </Link>
      </div>
    </main>
  );
}
