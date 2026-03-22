# Repository Guidelines

## Project Structure & Module Organization

- `app/` contains the Next.js App Router implementation, including:
  - root account-switch route in `app/page.tsx`
  - tourist routes under `app/(tourist)`
  - authenticated routes under `app/(user)`
  - global styles in `app/globals.css`
  - runtime providers in `app/providers.tsx`
- `components/` contains shared UI and feature components; `components/ui/` is the reusable primitive layer.
- `hooks/` contains shared hooks such as `use-fetch-profile.ts`.
- `lib/` contains shared runtime logic, especially `lib/api/`, validation helpers, token helpers, and message helpers.
- `store/` contains Zustand state stores.
- `public/` contains static assets and the generated MSW worker.
- Root configs include `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`, `components.json`, and `jest.config.ts`.

## Build, Test, and Development Commands

- `pnpm dev` — Run Next.js in development.
- `pnpm build` — Create the static-export production build.
- `pnpm start` — Serve the production build through Next.js.
- `pnpm lint` — Run ESLint.
- `pnpm test` — Run the Jest suite.
- `pnpm test:watch` — Run Jest in watch mode.
- `pnpm test:coverage` — Run Jest with coverage output.
- `pnpm exec tsc --noEmit` — Run TypeScript type checking.

## Coding Style & Naming Conventions

- Language: TypeScript with React 19 and Next.js 16.
- Linting: `eslint.config.mjs` is the source of truth.
- Styling: Tailwind CSS v4 with shared tokens in `app/globals.css`.
- Components: PascalCase names/exports; keep reusable primitives in `components/ui/`.
- Routes: Next app files stay lowercase (`page.tsx`, `layout.tsx`).
- Code: camelCase variables/functions; hooks start with `use*`.
- Imports: prefer `@/` aliases for internal modules.

## Testing Guidelines

- Jest is already configured and should be treated as the active test runner.
- Tests use `*.test.ts` / `*.test.tsx` and are mostly colocated with source.
- Current coverage spans `app/`, `components/`, `hooks/`, `lib/`, and `store/`.
- Prefer React Testing Library + `userEvent` for UI behavior.
- When changing runtime behavior, update or add the closest colocated test where practical.

## Commit & Pull Request Guidelines

- Prefer Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`, `ci:`.
- Link issues in the footer: `Closes #123`.
- PRs should include a short scope/intent summary, screenshots for UI changes, and the validation steps actually run.
- Keep changes focused; avoid unrelated refactors.

## Security & Configuration Tips

- Use `.env.local` for local secrets; do not commit `.env*` files.
- Only expose safe client values via `NEXT_PUBLIC_*`.
- `NEXT_PUBLIC_API_BASE_URL` configures the backend base URL.
- `NEXT_PUBLIC_API_MOCKING=true` enables MSW-backed API mocking in the app provider layer.
