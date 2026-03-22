# SAST Link Next

SAST Link Next is the current Next.js implementation of the SAST Link account system. It is no longer a generic starter template: the repository already contains the migrated authentication flows, account switcher, user homepage, profile editing, avatar cropping, Jest tests, and GitHub Actions workflows.

[中文文档](./README_zh.md)

## What This Project Does

- Provides tourist-side flows for login, registration, password reset, and OAuth callbacks.
- Provides user-side flows for homepage overview, profile side panels, profile editing, avatar upload/cropping, and safety settings entry.
- Uses web runtime (`pnpm dev`) and static-export build (`pnpm build`) as the main delivery model.
- Uses the existing SAST Link backend through `NEXT_PUBLIC_API_BASE_URL`, with optional MSW mocking for local development.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript (strict mode)
- Tailwind CSS v4
- shadcn/ui + Radix primitives
- Zustand for client-side state
- SWR for client-side data fetching defaults
- Axios for API access
- React Hook Form + validation helpers
- Jest 30 + Testing Library + MSW

## Current Product Flows

### Tourist routes

- `/` account switcher / quick-login entry
- `/login` two-step password login
- `/register` four-step registration flow
- `/reset` four-step password reset flow
- `/callback/feishu` Feishu OAuth callback
- `/callback/github` GitHub OAuth callback

### User routes

- `/home` homepage overview with profile summary, quick actions, and app links
- `/home/edit` profile editing and avatar cropping/upload
- `/home/edit/safety` safety settings page

### Layout and access model

- `app/(tourist)/layout.tsx` wraps unauthenticated pages with the shared background layout.
- `app/(user)/layout.tsx` redirects to `/login` when no token is present.
- `app/(user)/home/layout.tsx` fetches profile state and composes the top bar plus side panels.

## Repository Structure

```text
sast-link-next/
├── app/                         # App Router routes, layouts, providers, page tests
│   ├── page.tsx                 # Account switcher / root entry
│   ├── providers.tsx            # SWR config + optional MSW bootstrap + global message panel
│   ├── (tourist)/               # Login / register / reset / OAuth callback flows
│   └── (user)/                  # Authenticated homepage and edit flows
├── components/
│   ├── account/                 # Account switcher UI
│   ├── animation/               # Page transition helpers
│   ├── auth/                    # Auth-related reusable inputs/widgets
│   ├── feedback/                # Global message panel
│   ├── icons/                   # Brand/logo icons
│   ├── layout/                  # Shared backgrounds, footer, top bar
│   ├── navigation/              # Back button
│   ├── profile/                 # Profile bind items
│   └── ui/                      # shadcn/ui-style primitives
├── hooks/
│   └── use-fetch-profile.ts     # Loads and syncs authenticated profile data
├── lib/
│   ├── api/                     # Axios client and auth/user/oauth API wrappers
│   ├── constants/               # Shared constants
│   ├── validations/             # Form validation rules
│   ├── token.ts                 # Token persistence helpers
│   └── message.ts               # Global toast/message facade
├── mocks/                       # MSW setup used when NEXT_PUBLIC_API_MOCKING=true
├── public/                      # Static assets and generated MSW worker
├── store/                       # Zustand stores
├── tests/                       # Shared test helpers / higher-level tests
├── .github/workflows/           # CI/CD, test, deploy, and release workflows
├── TESTING.md                   # Test strategy and commands
├── CI_CD.md                     # GitHub Actions workflow guide
└── CONTRIBUTING.md              # Contribution workflow
```

## Important Runtime Modules

### State stores

- `store/use-auth-store.ts`: logged-in user identity, login ticket, redirect target, logout behavior.
- `store/use-user-list-store.ts`: remembered accounts for root-page switching.
- `store/use-user-profile-store.ts`: editable profile state used on homepage and edit pages.
- `store/use-panel-store.ts`: homepage side-panel open state.

### API modules

- `lib/api/client.ts`: shared Axios instance, reads `NEXT_PUBLIC_API_BASE_URL`, injects `Token` header automatically.
- `lib/api/auth.ts`: verify account, send mail, captcha verification, register, reset password, OAuth callbacks.
- `lib/api/user.ts`: login, logout, profile retrieval/update, avatar upload, bind status.

### Build integration

- `next.config.ts` uses `output: "export"` so `pnpm build` emits `out/`.

## Prerequisites

### Required for all development

- Node.js 20 or newer
- pnpm 10 is what CI uses; local pnpm 8+ can work, but matching CI is recommended

## Installation

```bash
pnpm install
```

Create a local environment file if you need to point at a backend or enable mocks:

```env
NEXT_PUBLIC_API_BASE_URL=http://118.25.23.101:8081/api/v1
NEXT_PUBLIC_API_MOCKING=false
```

Notes:

- `.env*` files are ignored by git.
- Set `NEXT_PUBLIC_API_MOCKING=true` to bootstrap MSW from `app/providers.tsx`.
- The checked-in `.env.example` documents the two supported public env vars today.

## Development Commands

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start the Next.js web app on port 3000 |
| `pnpm build` | Create the static export in `out/` |
| `pnpm start` | Start the Next.js production server |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run the Jest suite |
| `pnpm test:watch` | Run Jest in watch mode |
| `pnpm test:coverage` | Run Jest with coverage output |

## Typical Local Workflows

### Web-only development

```bash
pnpm dev
```

Open `http://localhost:3000` and exercise:

- `/` for stored-account switching
- `/login`, `/register`, `/reset`
- `/home` after authenticating or mocking data

### Production verification

```bash
pnpm lint
pnpm test
pnpm build
```

## Testing

The repository already has an active Jest setup. Tests live next to source files and cover `app/`, `components/`, `hooks/`, `lib/`, and `store/`.

Examples in the current tree:

- `app/page.test.tsx`
- `app/(tourist)/login/page.test.tsx`
- `app/(user)/home/homepage.test.tsx`
- `components/layout/top-bar.test.tsx`
- `hooks/use-fetch-profile.test.tsx`
- `lib/api/auth.test.ts`
- `store/use-auth-store.test.ts`

See [TESTING.md](./TESTING.md) for the full testing guide.

## CI/CD Summary

GitHub Actions are already configured:

- `ci.yml` orchestrates quality and test workflows on pushes/PRs to `master` and `develop`.
- `quality.yml` runs lint, `tsc --noEmit`, `pnpm audit`, and `pnpm outdated`.
- `test.yml` runs `pnpm test:coverage`, uploads reports/artifacts, and runs `pnpm build`.
- `deploy.yml` exists but is disabled by default.
- `release.yml` creates a draft GitHub release when a `v*` tag is pushed.

See [CI_CD.md](./CI_CD.md) for exact trigger and secret details.

## Notes on Accuracy

- The npm package name in `package.json` is still `react-quick-starter`, but the implemented product and runtime metadata are already SAST Link oriented in the app UI and metadata.
- The app metadata currently comes from `app/layout.tsx` and is set to `title: "SAST Link"` and `description: "OAuth of SAST"`.

## Related Documents

- [README_zh.md](./README_zh.md)
- [TESTING.md](./TESTING.md)
- [CI_CD.md](./CI_CD.md)
- [CONTRIBUTING.md](./CONTRIBUTING.md)
- [AGENTS.md](./AGENTS.md)
