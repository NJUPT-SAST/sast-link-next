'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GlobeIcon } from 'lucide-react';

export function LanguageToggle() {
  const pathname = usePathname();
  const isZh = pathname.startsWith('/zh');

  const href = isZh ? pathname.replace(/^\/zh/, '') || '/' : `/zh${pathname}`;
  const label = isZh ? 'English' : '中文';

  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
    >
      <GlobeIcon className="size-4" />
      {label}
    </Link>
  );
}
