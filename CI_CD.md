# CI/CD Guide

This repository already contains a working GitHub Actions layout. The workflows are modular, mostly reusable, and intentionally keep optional integrations disabled until the repository owner wires in the required secrets.

## Workflow Files

| File | Purpose |
| --- | --- |
| `.github/workflows/ci.yml` | Main orchestrator for push / PR CI |
| `.github/workflows/quality.yml` | Lint, type-check, audit, dependency freshness |
| `.github/workflows/test.yml` | Jest coverage run, coverage/test artifact upload, Next.js build |
| `.github/workflows/build-tauri.yml` | Multi-platform Tauri desktop build |
| `.github/workflows/deploy.yml` | Preview / production deployment scaffold, disabled by default |
| `.github/workflows/release.yml` | Tag-triggered release pipeline that drafts a GitHub Release |

## Current Triggers

### `ci.yml`

Runs on:

- push to `master`
- push to `develop`
- pull request targeting `master`
- pull request targeting `develop`

It then calls:

1. `quality.yml`
2. `test.yml`
3. `build-tauri.yml` after both previous jobs succeed

### `quality.yml`

Runs on:

- `workflow_call`
- `workflow_dispatch`

### `test.yml`

Runs on:

- `workflow_call`
- `workflow_dispatch`

### `build-tauri.yml`

Runs on:

- `workflow_call`
- `workflow_dispatch`

### `deploy.yml`

Runs on:

- `workflow_call`
- `workflow_dispatch`

But deployments are short-circuited unless `DEPLOY_ENABLED` is changed from `false` to `true`.

### `release.yml`

Runs on:

- push tags matching `v*`

## What Each Workflow Actually Does

### Quality workflow

`quality.yml` runs on Ubuntu and performs:

1. checkout
2. pnpm setup
3. Node 20 setup with pnpm cache
4. `pnpm install --frozen-lockfile`
5. `pnpm lint`
6. `pnpm exec tsc --noEmit`
7. `pnpm audit --audit-level=moderate`
8. `pnpm outdated`

Notes:

- `pnpm lint`, `pnpm audit`, and `pnpm outdated` currently use `continue-on-error: true`.
- Type-checking is the strict blocking step in this workflow.

### Test workflow

`test.yml` runs on Ubuntu with Node 20 and performs:

1. checkout with full history
2. pnpm setup
3. Node setup with pnpm cache
4. Next.js cache restore for `.next/cache`
5. `pnpm install --frozen-lockfile`
6. `pnpm test:coverage`
7. upload `coverage/junit.xml` as `test-results`
8. upload `coverage/` as `coverage-report`
9. optionally publish pull-request test results
10. `pnpm build`
11. upload `out/` as `nextjs-build`

Additional details:

- The workflow expects Jest coverage output in `coverage/`.
- The pull-request-only summary and bundle-size steps are additive, not required for the build to pass.

### Tauri build workflow

`build-tauri.yml` builds unsigned desktop artifacts for four targets:

- Linux `x86_64-unknown-linux-gnu`
- Windows `x86_64-pc-windows-msvc`
- macOS Intel `x86_64-apple-darwin`
- macOS Apple Silicon `aarch64-apple-darwin`

For each matrix entry it performs:

1. checkout
2. pnpm setup
3. Node 20 setup
4. Rust toolchain setup for the target
5. Rust cache restore
6. Linux-only system dependency install
7. `pnpm install --frozen-lockfile`
8. `pnpm tauri build --target <target>`
9. upload platform-specific artifacts

Uploaded artifact names:

- `tauri-linux-amd64-appimage`
- `tauri-linux-amd64-deb`
- `tauri-windows-x64-msi`
- `tauri-windows-x64-nsis`
- `tauri-macos-x64-dmg`
- `tauri-macos-x64-app`
- `tauri-macos-arm64-dmg`
- `tauri-macos-arm64-app`

### Deploy workflow

`deploy.yml` is present as a scaffold for Vercel-based preview / production deployment, but today:

- `DEPLOY_ENABLED` is set to `false`
- the actual Vercel action steps are commented out
- the jobs exit successfully with explanatory messages instead of deploying

That means the repository currently has deployment documentation and structure, but not an active deployment pipeline.

### Release workflow

`release.yml` does the following when a `v*` tag is pushed:

1. runs `quality.yml`
2. runs `test.yml`
3. runs `build-tauri.yml`
4. downloads all artifacts
5. creates a draft GitHub Release
6. attaches desktop build artifacts such as `.AppImage`, `.deb`, `.msi`, `.exe`, `.dmg`

The release is created as a draft, so a maintainer still reviews it before publishing.

## Caching and Concurrency

### Concurrency

- `ci.yml` uses `group: ${{ github.workflow }}-${{ github.ref }}`
- `quality.yml` uses `group: quality-${{ github.ref }}`
- `test.yml` uses `group: test-${{ github.ref }}`
- `release.yml` uses `group: release-${{ github.ref }}`

This prevents stale duplicate runs from consuming CI time.

### Caching

The workflows currently cache:

- pnpm dependencies through `actions/setup-node`
- Next.js cache in `.next/cache`
- Rust artifacts through `swatinem/rust-cache`

## Secrets and Optional Integrations

### No secrets required for baseline CI

The default CI path works without any repository secrets:

- quality checks
- tests and coverage artifacts
- Next.js build
- unsigned Tauri desktop builds
- draft release creation with `GITHUB_TOKEN`

### Optional Vercel deployment secrets

Needed only if you enable deployment steps:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

### Optional Codecov integration

The Codecov steps in `test.yml` are commented out. To enable them, add:

- `CODECOV_TOKEN`

and uncomment the Codecov-related blocks.

### Optional code-signing secrets

Windows:

- `WINDOWS_CERTIFICATE`
- `WINDOWS_CERTIFICATE_PASSWORD`

macOS:

- `APPLE_CERTIFICATE`
- `APPLE_CERTIFICATE_PASSWORD`
- `APPLE_SIGNING_IDENTITY`
- `APPLE_ID`
- `APPLE_PASSWORD`
- `APPLE_TEAM_ID`

These are not active in the current workflow because the env section is commented out.

## Relationship to the Application Build

The CI workflows align with the actual implementation:

- `pnpm build` works with `next.config.ts` using `output: "export"`
- Tauri loads `../out` because `src-tauri/tauri.conf.json` sets `frontendDist` to that location
- `pnpm tauri build` therefore depends on the static-export flow already configured in the repo

## Recommended Maintenance Rules

- Update this file whenever workflow triggers, required secrets, or deployment behavior change.
- If `productName`, release packaging, or deployment target changes, update both this file and `README.md`.
- If you make coverage thresholds stricter or remove `continue-on-error` from quality steps, document that here so contributors know what now blocks CI.
