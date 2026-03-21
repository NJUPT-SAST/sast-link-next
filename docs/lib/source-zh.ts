import { docsZh } from 'collections/server';
import { type InferPageType, loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';

export const sourceZh = loader({
  baseUrl: '/zh/docs',
  source: docsZh.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export function getPageImageZh(page: InferPageType<typeof sourceZh>) {
  const segments = [...page.slugs, 'image.webp'];
  return {
    segments,
    url: `/og/zh/docs/${segments.join('/')}`,
  };
}

export async function getLLMTextZh(page: InferPageType<typeof sourceZh>) {
  const processed = await page.data.getText('processed');
  return `# ${page.data.title}\n\n${processed}`;
}
