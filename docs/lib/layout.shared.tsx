import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { LanguageToggle } from '@/components/language-toggle';

export const gitConfig = {
  user: 'SAST-Link',
  repo: 'sast-link-next',
  branch: 'master',
};

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: 'SAST Link',
    },
    links: [
      {
        type: 'custom',
        children: <LanguageToggle />,
        secondary: true,
      },
    ],
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
