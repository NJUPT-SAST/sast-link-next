# CI/CD Guide

This document summarizes the current GitHub Actions setup for `sast-link-next`.

## Workflow Files

| File | Purpose |
| --- | --- |
| `.github/workflows/ci.yml` | Main orchestrator for push / PR CI |
| `.github/workflows/quality.yml` | Lint, type-check, audit, dependency freshness |
| `.github/workflows/test.yml` | Jest coverage run, test/coverage artifact upload, Next.js build |
| `.github/workflows/deploy.yml` | Deployment scaffold (disabled by default) |
| `.github/workflows/release.yml` | Tag-triggered release pipeline that drafts a GitHub Release |

## Triggers

### `ci.yml`

Runs on:

- push to `master`
- push to `develop`
- pull request targeting `master`
- pull request targeting `develop`

Then calls:

1. `quality.yml`
2. `test.yml`

### `quality.yml`

Runs on:

- `workflow_call`
- `workflow_dispatch`

Checks:

1. `pnpm lint`
2. `pnpm exec tsc --noEmit`
3. `pnpm audit --audit-level=moderate`
4. `pnpm outdated` (non-blocking)

### `test.yml`

Runs on:

- `workflow_call`
- `workflow_dispatch`

Main steps:

1. setup pnpm + Node.js
2. `pnpm install --frozen-lockfile`
3. `pnpm test:coverage`
4. upload `coverage/junit.xml` as `test-results`
5. upload `coverage/` as `coverage-report`
6. `pnpm build`
7. upload `out/` as `nextjs-build`

### `deploy.yml`

Deployment scaffold. Keep disabled until deployment target, credentials, and rollout strategy are confirmed.

### `release.yml`

Triggered when pushing tags matching `v*`.

Pipeline:

1. run `quality.yml`
2. run `test.yml`
3. download artifacts
4. create draft GitHub Release
5. attach `nextjs-build` artifacts

## Build Relationship

Current build output flow:

- `pnpm build` uses `next.config.ts` with `output: "export"`
- static files are generated in `out/`
- CI and release workflows both consume `out/` artifacts

## Caches And Artifacts

Current workflows use:

- pnpm cache via `actions/setup-node`
- Next.js cache in `.next/cache`
- test artifacts (`coverage/junit.xml`, `coverage/`)
- static build artifact (`out/`)

## Optional Secrets

By default, current workflows run without custom secrets.

If you later enable deployment or third-party integrations, document required secrets in this file and in the target workflow comments.

## Maintenance Checklist

When editing CI behavior, keep these in sync:

1. `.github/workflows/*.yml`
2. this file (`CI_CD.md`)
3. top-level docs (`README.md`, `README_zh.md`, `CONTRIBUTING.md`)
