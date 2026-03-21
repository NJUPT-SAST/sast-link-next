# SAST Link Migration Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the core SAST Link frontend flows from `tmp/sast-link` into this Next.js 16 + Tauri starter, using freshly installed latest `shadcn/ui` primitives as the UI base and preserving the source project's business behavior.

**Architecture:** Keep the current root `app/layout.tsx` as the single root layout and merge the source app's global providers into it. Rebuild UI foundations on top of the current Tailwind v4 + shadcn setup, then port source business flows in layers: config/providers, shared state and API clients, tourist flows, and user flows. Preserve the source route-group and parallel-route structure where it carries product behavior.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Jest + Testing Library, Redux Toolkit, Axios, SWR, Tailwind CSS v4, shadcn/ui, Tauri 2, pnpm.

---

## File Map

### Root config and providers

- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Modify: `next.config.ts`
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`
- Create: `app/providers.tsx`
- Create: `lib/env.ts`

### Shared business layer

- Create: `lib/api/client.ts`
- Create: `lib/api/types.ts`
- Create: `lib/api/global.ts`
- Create: `lib/api/user.ts`
- Create: `lib/api/auth.ts`
- Create: `lib/contexts/auth-flow-context.tsx`
- Create: `lib/links.ts`
- Create: `lib/errors.ts`
- Create: `store/index.ts`
- Create: `store/provider.tsx`
- Create: `store/features/login.ts`
- Create: `store/features/message.ts`
- Create: `store/features/panel-state.ts`
- Create: `store/features/user-basic-info.ts`
- Create: `store/features/user-list.ts`
- Create: `store/features/user-profile.ts`

### Shared UI

- Modify: `components/ui/button.tsx` if latest shadcn add updates it
- Create via shadcn CLI: `components/ui/input.tsx`
- Create via shadcn CLI: `components/ui/card.tsx`
- Create via shadcn CLI: `components/ui/avatar.tsx`
- Create via shadcn CLI: `components/ui/label.tsx`
- Create via shadcn CLI: `components/ui/textarea.tsx`
- Create via shadcn CLI: `components/ui/alert.tsx`
- Create via shadcn CLI: `components/ui/separator.tsx`
- Create via shadcn CLI: `components/ui/dialog.tsx`
- Create: `components/app-shell/backdrop.tsx`
- Create: `components/app-shell/page-frame.tsx`
- Create: `components/app-shell/page-footer.tsx`
- Create: `components/auth/account-panel.tsx`
- Create: `components/auth/other-login-list.tsx`
- Create: `components/forms/labeled-field.tsx`
- Create: `components/feedback/global-message-panel.tsx`
- Create: `components/feedback/message-item.tsx`
- Create: `components/navigation/top-bar.tsx`
- Create: `components/navigation/back-link.tsx`
- Create: `components/profile/profile-panel.tsx`
- Create: `components/profile/info-panel.tsx`
- Create: `components/profile/app-panel.tsx`
- Create: `components/effects/page-transition.tsx`
- Create: `components/effects/magic-card.tsx`

### Routes

- Modify: `app/page.tsx`
- Create: `app/(tourist)/layout.tsx`
- Create: `app/(tourist)/login/page.tsx`
- Create: `app/(tourist)/login/step-1.tsx`
- Create: `app/(tourist)/login/2/page.tsx`
- Create: `app/(tourist)/regist/layout.tsx`
- Create: `app/(tourist)/regist/page.tsx`
- Create: `app/(tourist)/reset/layout.tsx`
- Create: `app/(tourist)/reset/page.tsx`
- Create: `app/(tourist)/callback/feishu/page.tsx`
- Create: `app/(tourist)/callback/github/page.tsx`
- Create: `app/(user)/layout.tsx`
- Create: `app/(user)/auth/page.tsx`
- Create: `app/(user)/home/layout.tsx`
- Create: `app/(user)/home/page.tsx`
- Create: `app/(user)/home/@appPanel/default.tsx`
- Create: `app/(user)/home/@getInfo/default.tsx`
- Create: `app/(user)/home/@infoPanel/default.tsx`
- Create: `app/(user)/home/@profilePanel/default.tsx`
- Create: `app/(user)/home/edit/layout.tsx`
- Create: `app/(user)/home/edit/page.tsx`

### Tests

- Modify: `jest.setup.ts`
- Create: `app/providers.test.tsx`
- Create: `app/page.test.tsx`
- Create: `lib/api/client.test.ts`
- Create: `store/features/user-list.test.ts`
- Create: `app/(tourist)/login/page.test.tsx`
- Create: `app/(tourist)/login/2/page.test.tsx`
- Create: `app/(tourist)/callback/feishu/page.test.tsx`
- Create: `app/(tourist)/callback/github/page.test.tsx`
- Create: `app/(user)/auth/page.test.tsx`
- Create: `app/(user)/home/layout.test.tsx`
- Create: `app/(user)/home/page.test.tsx`
- Create: `app/(user)/home/edit/page.test.tsx`

## Chunk 1: Config, Providers, and UI Base

### Task 1: Add the initial failing tests for the new app shell

**Files:**
- Create: `app/providers.test.tsx`
- Modify: `app/layout.test.tsx`

- [ ] **Step 1: Write the failing tests**

```tsx
it("wraps children with the migration providers", () => {
  render(<Providers><div>child</div></Providers>)
  expect(screen.getByText("child")).toBeInTheDocument()
  expect(screen.getByTestId("global-message-panel")).toBeInTheDocument()
})

it("exports SAST Link metadata", () => {
  expect(metadata).toMatchObject({
    title: "SAST Link",
    description: "OAuth of SAST",
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- --runInBand app/providers.test.tsx app/layout.test.tsx`
Expected: FAIL because `Providers` and new metadata do not exist yet.

- [ ] **Step 3: Write minimal implementation**

Create `app/providers.tsx` and update `app/layout.tsx` to:
- mount store provider
- mount message panel
- set `lang="zh-CN"`
- keep current root layout shape compatible with Next.js 16

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test -- --runInBand app/providers.test.tsx app/layout.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/layout.tsx app/layout.test.tsx app/providers.tsx app/providers.test.tsx
git commit -m "feat: add shared app providers for sast link migration"
```

### Task 2: Reconfigure Next.js and environment seams

**Files:**
- Modify: `next.config.ts`
- Create: `lib/env.ts`
- Test: `lib/api/client.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
it("builds api base configuration from environment defaults", () => {
  expect(getPublicAppConfig().apiRewritePath).toBe("/apis")
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- --runInBand lib/api/client.test.ts`
Expected: FAIL because config helper does not exist.

- [ ] **Step 3: Write minimal implementation**

Add:
- environment helpers for backend origin and OAuth origin
- rewrite from `/apis/:path*` to the configured backend base
- remote image host entries needed by migrated profile/app assets
- preserve Tauri export settings

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test -- --runInBand lib/api/client.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add next.config.ts lib/env.ts lib/api/client.test.ts
git commit -m "feat: add backend configuration seams for sast link migration"
```

### Task 3: Install latest shadcn primitives and align test setup

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Modify: `jest.setup.ts`
- Create via CLI: `components/ui/input.tsx`
- Create via CLI: `components/ui/card.tsx`
- Create via CLI: `components/ui/avatar.tsx`
- Create via CLI: `components/ui/label.tsx`
- Create via CLI: `components/ui/textarea.tsx`
- Create via CLI: `components/ui/alert.tsx`
- Create via CLI: `components/ui/separator.tsx`
- Create via CLI: `components/ui/dialog.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
it("renders the login page fields with shadcn inputs", () => {
  render(<LoginPage />)
  expect(screen.getByLabelText("账户")).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- --runInBand app/(tourist)/login/page.test.tsx`
Expected: FAIL because the page and required primitives do not exist yet.

- [ ] **Step 3: Write minimal implementation**

Use `pnpm dlx shadcn@latest add ...` to install the required primitives, then update `jest.setup.ts` mocks only as needed for new component internals.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test -- --runInBand app/(tourist)/login/page.test.tsx`
Expected: PASS once the login page exists and can render.

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml jest.setup.ts components/ui
git commit -m "feat: add shadcn ui primitives for migrated auth flows"
```

## Chunk 2: Shared State, API, and Feedback

### Task 4: Port the API client and response types

**Files:**
- Create: `lib/api/types.ts`
- Create: `lib/api/client.ts`
- Create: `lib/api/global.ts`
- Create: `lib/api/user.ts`
- Create: `lib/api/auth.ts`
- Test: `lib/api/client.test.ts`

- [ ] **Step 1: Write the failing tests**
- [ ] **Step 2: Run test to verify they fail**
- [ ] **Step 3: Implement the minimal API modules**
- [ ] **Step 4: Run test to verify they pass**
- [ ] **Step 5: Commit**

Run: `pnpm test -- --runInBand lib/api/client.test.ts`

Implementation notes:
- keep source header names like `LOGIN-TICKET`, `REGISTER-TICKET`, `RESETPWD-TICKET`, `Token`, `OAUTH-TICKET`
- isolate `localStorage` reads behind helpers so tests stay deterministic
- keep OAuth redirect URL generation out of route components

### Task 5: Port Redux slices and provider

**Files:**
- Create: `store/index.ts`
- Create: `store/provider.tsx`
- Create: `store/features/login.ts`
- Create: `store/features/message.ts`
- Create: `store/features/panel-state.ts`
- Create: `store/features/user-basic-info.ts`
- Create: `store/features/user-list.ts`
- Create: `store/features/user-profile.ts`
- Test: `store/features/user-list.test.ts`

- [ ] **Step 1: Write the failing test**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement the minimal slices and hydration-safe persistence**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit**

Run: `pnpm test -- --runInBand store/features/user-list.test.ts`

Implementation notes:
- preserve source semantics for `userList`, current profile, panel state, and login ticket
- do not read `localStorage` at module top-level without a browser guard
- type exports should replace the source repo’s loose `any` usage

### Task 6: Rebuild the message system and common wrappers

**Files:**
- Create: `components/feedback/global-message-panel.tsx`
- Create: `components/feedback/message-item.tsx`
- Create: `components/app-shell/backdrop.tsx`
- Create: `components/app-shell/page-frame.tsx`
- Create: `components/app-shell/page-footer.tsx`
- Create: `components/effects/page-transition.tsx`
- Test: `app/providers.test.tsx`

- [ ] **Step 1: Write the failing test**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement minimal message shell and wrappers**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit**

Run: `pnpm test -- --runInBand app/providers.test.tsx`

## Chunk 3: Tourist Flows

### Task 7: Port the account chooser landing page

**Files:**
- Modify: `app/page.tsx`
- Create: `app/page.test.tsx`
- Create: `components/auth/account-panel.tsx`

- [ ] **Step 1: Write the failing test**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement minimal account chooser behavior**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit**

Run: `pnpm test -- --runInBand app/page.test.tsx`

### Task 8: Port login step 1 and login step 2

**Files:**
- Create: `app/(tourist)/layout.tsx`
- Create: `app/(tourist)/login/page.tsx`
- Create: `app/(tourist)/login/step-1.tsx`
- Create: `app/(tourist)/login/2/page.tsx`
- Create: `components/auth/other-login-list.tsx`
- Create: `components/forms/labeled-field.tsx`
- Create: `app/(tourist)/login/page.test.tsx`
- Create: `app/(tourist)/login/2/page.test.tsx`

- [ ] **Step 1: Write the failing tests**
- [ ] **Step 2: Run tests to verify they fail**
- [ ] **Step 3: Implement minimal login step behavior**
- [ ] **Step 4: Run tests to verify they pass**
- [ ] **Step 5: Commit**

Run: `pnpm test -- --runInBand "app/(tourist)/login/page.test.tsx" "app/(tourist)/login/2/page.test.tsx"`

Implementation notes:
- preserve base64 redirect semantics from source
- preserve third-party callback entry URLs
- use shadcn `Button` and `Input`, not the source `components/button` or `components/input`

### Task 9: Port registration and password reset

**Files:**
- Create: `app/(tourist)/regist/layout.tsx`
- Create: `app/(tourist)/regist/page.tsx`
- Create: `app/(tourist)/reset/layout.tsx`
- Create: `app/(tourist)/reset/page.tsx`

- [ ] **Step 1: Write the failing tests**
- [ ] **Step 2: Run tests to verify they fail**
- [ ] **Step 3: Implement minimal multi-step registration and reset flows**
- [ ] **Step 4: Run tests to verify they pass**
- [ ] **Step 5: Commit**

Run: `pnpm test -- --runInBand "app/(tourist)/regist/page.test.tsx" "app/(tourist)/reset/page.test.tsx"`

### Task 10: Port GitHub and Feishu callback routes

**Files:**
- Create: `app/(tourist)/callback/feishu/page.tsx`
- Create: `app/(tourist)/callback/github/page.tsx`
- Create: `app/(tourist)/callback/feishu/page.test.tsx`
- Create: `app/(tourist)/callback/github/page.test.tsx`

- [ ] **Step 1: Write the failing tests**
- [ ] **Step 2: Run tests to verify they fail**
- [ ] **Step 3: Implement minimal callback handling**
- [ ] **Step 4: Run tests to verify they pass**
- [ ] **Step 5: Commit**

Run: `pnpm test -- --runInBand "app/(tourist)/callback/feishu/page.test.tsx" "app/(tourist)/callback/github/page.test.tsx"`

## Chunk 4: User Flows

### Task 11: Port the user route layout and parallel routes

**Files:**
- Create: `app/(user)/layout.tsx`
- Create: `app/(user)/home/layout.tsx`
- Create: `app/(user)/home/@appPanel/default.tsx`
- Create: `app/(user)/home/@getInfo/default.tsx`
- Create: `app/(user)/home/@infoPanel/default.tsx`
- Create: `app/(user)/home/@profilePanel/default.tsx`
- Create: `app/(user)/home/layout.test.tsx`

- [ ] **Step 1: Write the failing test**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement minimal layout and slot rendering**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit**

Run: `pnpm test -- --runInBand "app/(user)/home/layout.test.tsx"`

Implementation notes:
- keep source parallel-route behavior
- ensure each slot has a default file to satisfy Next.js parallel route behavior

### Task 12: Port home/dashboard content and profile data fetch slot

**Files:**
- Create: `app/(user)/home/page.tsx`
- Create: `components/profile/profile-panel.tsx`
- Create: `components/profile/info-panel.tsx`
- Create: `components/profile/app-panel.tsx`
- Create: `components/navigation/top-bar.tsx`
- Create: `app/(user)/home/page.test.tsx`

- [ ] **Step 1: Write the failing test**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement minimal dashboard and info fetch behavior**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit**

Run: `pnpm test -- --runInBand "app/(user)/home/page.test.tsx"`

### Task 13: Port profile edit page

**Files:**
- Create: `app/(user)/home/edit/layout.tsx`
- Create: `app/(user)/home/edit/page.tsx`
- Create: `components/navigation/back-link.tsx`
- Create: `app/(user)/home/edit/page.test.tsx`

- [ ] **Step 1: Write the failing test**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement minimal edit form and avatar flow**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit**

Run: `pnpm test -- --runInBand "app/(user)/home/edit/page.test.tsx"`

### Task 14: Port OAuth authorization page

**Files:**
- Create: `app/(user)/auth/page.tsx`
- Create: `app/(user)/auth/page.test.tsx`

- [ ] **Step 1: Write the failing test**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement minimal OAuth authorization flow**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit**

Run: `pnpm test -- --runInBand "app/(user)/auth/page.test.tsx"`

## Chunk 5: Verification

### Task 15: Run focused and broader verification

**Files:**
- Modify any files necessary to fix discovered issues

- [ ] **Step 1: Run focused route and state tests**

Run:
```bash
pnpm test -- --runInBand app/providers.test.tsx app/page.test.tsx "app/(tourist)/login/page.test.tsx" "app/(tourist)/login/2/page.test.tsx" "app/(user)/home/layout.test.tsx" "app/(user)/home/page.test.tsx" "app/(user)/home/edit/page.test.tsx" "app/(user)/auth/page.test.tsx"
```

- [ ] **Step 2: Run lint**

Run: `pnpm lint`
Expected: PASS.

- [ ] **Step 3: Run production build**

Run: `pnpm build`
Expected: PASS with static export output for Tauri.

- [ ] **Step 4: Optional runtime verification**

Run: `pnpm dev`
Then verify `/`, `/login`, `/login/2`, `/regist`, `/reset`, `/home`, `/home/edit`, and `/auth` in a browser.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: migrate core sast link flows into next tauri starter"
```
