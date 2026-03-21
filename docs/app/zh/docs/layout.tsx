import { sourceZh } from '@/lib/source-zh';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';

export default function Layout({ children }: LayoutProps<'/zh/docs'>) {
  return (
    <DocsLayout tree={sourceZh.getPageTree()} {...baseOptions()}>
      {children}
    </DocsLayout>
  );
}
