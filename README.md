# SAST Link Next

SAST Link Next is the current Next.js + Tauri implementation of the SAST Link account system. It is no longer a generic starter template: the repository already contains the migrated authentication flows, account switcher, user homepage, profile editing, avatar cropping, desktop packaging, Jest tests, and GitHub Actions workflows.

[中文文档](./README_zh.md)

## What This Project Does

- Provides tourist-side flows for login, registration, password reset, and OAuth callbacks.
- Provides user-side flows for homepage overview, profile side panels, profile editing, avatar upload/cropping, and safety settings entry.
- Supports both web runtime (`pnpm dev`) and desktop runtime (`pnpm tauri dev`) from the same codebase.
- Builds as a static-exported Next.js app so Tauri can load `out/` in production.
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
- Tauri 2 desktop wrapper

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
├── src-tauri/                   # Tauri desktop shell and build config
├── store/                       # Zustand stores
├── tests/                       # Shared test helpers / higher-level tests
├── .github/workflows/           # CI/CD, test, deploy, release, and Tauri build workflows
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

### Desktop integration

- `next.config.ts` uses `output: "export"` so `pnpm build` emits `out/`.
- `src-tauri/tauri.conf.json` points `frontendDist` to `../out` and runs `pnpm dev` / `pnpm build` automatically before Tauri commands.
- `src-tauri/src/lib.rs` enables `tauri-plugin-log` in debug builds.

## Prerequisites

### Required for all development

- Node.js 20 or newer
- pnpm 10 is what CI uses; local pnpm 8+ can work, but matching CI is recommended

### Required for desktop development

- Rust toolchain (`rustup`, `cargo`, `rustc`)
- Tauri platform dependencies
  - Windows: Visual Studio C++ Build Tools + WebView2-capable environment
  - macOS: Xcode Command Line Tools
  - Linux: WebKitGTK and related packages used in `.github/workflows/build-tauri.yml`

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
| `pnpm build` | Create the static export consumed by Tauri in production |
| `pnpm start` | Start the Next.js production server |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run the Jest suite |
| `pnpm test:watch` | Run Jest in watch mode |
| `pnpm test:coverage` | Run Jest with coverage output |
| `pnpm tauri dev` | Start the desktop shell with the web app in dev mode |
| `pnpm tauri build` | Build desktop installers/bundles |
| `pnpm tauri info` | Print local Tauri environment information |

## Typical Local Workflows

### Web-only development

```bash
pnpm dev
```

Open `http://localhost:3000` and exercise:

- `/` for stored-account switching
- `/login`, `/register`, `/reset`
- `/home` after authenticating or mocking data

### Desktop development

```bash
pnpm tauri dev
```

This runs the Next.js dev server first, then launches the Tauri window that points at it.

### Production verification

```bash
pnpm lint
pnpm test
pnpm build
pnpm tauri build
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

- `ci.yml` orchestrates quality, test, and Tauri build workflows on pushes/PRs to `master` and `develop`.
- `quality.yml` runs lint, `tsc --noEmit`, `pnpm audit`, and `pnpm outdated`.
- `test.yml` runs `pnpm test:coverage`, uploads reports/artifacts, and runs `pnpm build`.
- `build-tauri.yml` builds unsigned desktop artifacts for Linux, Windows, and macOS.
- `deploy.yml` exists but is disabled by default.
- `release.yml` creates a draft GitHub release when a `v*` tag is pushed.

See [CI_CD.md](./CI_CD.md) for exact trigger and secret details.

## Notes on Accuracy

- The npm package name in `package.json` is still `react-quick-starter`, but the implemented product and runtime metadata are already SAST Link oriented in the app UI and metadata.
- The app metadata currently comes from `app/layout.tsx` and is set to `title: "SAST Link"` and `description: "OAuth of SAST"`.
- The desktop bundle metadata in `src-tauri/tauri.conf.json` is still using the starter-style product name and identifier. If those values are changed later, update this README and `README_zh.md` again.

## Related Documents

- [README_zh.md](./README_zh.md)
- [TESTING.md](./TESTING.md)
- [CI_CD.md](./CI_CD.md)
- [CONTRIBUTING.md](./CONTRIBUTING.md)
- [AGENTS.md](./AGENTS.md)
