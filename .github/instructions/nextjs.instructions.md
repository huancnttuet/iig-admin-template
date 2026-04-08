---
description: 'Best practices for building the b2b-admin-v2 Next.js (App Router) application.'
applyTo: '**/*.tsx, **/*.ts, **/*.jsx, **/*.js, **/*.css'
---

# Next.js Best Practices — b2b-admin-v2

## 1. Project Structure & Organization

- Use `src/app/` (App Router) for all routing
- Route groups/folders in this repo:
  - `src/app/(auth)/` — authentication pages
  - `src/app/admin/` — authenticated admin pages
- Keep route/navigation config centralized:
  - `src/configs/routes.ts` for `AppRoutes`
  - `src/configs/sidebar.ts` for `useSidebarData()`
- Prefer existing shared folders before creating new ones:
  - `src/components/`, `src/features/`, `src/apis/`, `src/services/`, `src/stores/`, `src/hooks/`, `src/lib/`, `src/types/`, `src/i18n/`

## 2. Server and Client Components

- Server Components by default
- Add `'use client'` only when hooks/state/browser APIs are required
- Keep client-only behavior in small leaf components

## 3. Component Best Practices

- `src/components/ui/` contains shadcn/ui primitives (do not modify directly)
- Reuse layout primitives from `src/components/layout/` and its `index.ts` exports
- Keep props strictly typed
- Use `cn()` from `@/lib/utils` for conditional class names

## 4. Naming Conventions

- Folders/files: `kebab-case`
- Variables/functions: `camelCase`
- Types/interfaces/components: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`

## 5. Route Definitions

- Always use `AppRoutes` from `@/configs/routes`
- Never hardcode route strings in components
- When adding an admin page:
  1. Add route to `src/configs/routes.ts`
  2. Create `src/app/admin/<route>/page.tsx`
  3. Wrap page content in `<Main>`
  4. Update `src/configs/sidebar.ts` if it needs navigation entry

## 6. State Management

- Zustand for client-only global state
- TanStack Query for server state (fetch/cache/mutation)
- Do not duplicate server state in Zustand

## 7. API Integration Pattern

- Reuse Axios clients in `src/apis/`:
  - `base-api.ts` for main requests
  - `sso-api.ts` for SSO requests
- Organize domain code in `src/services/<domain>/`:
  - `<domain>.type.ts`, `<domain>.schema.ts`, `<domain>.api.ts`, `<domain>.query.ts`, `index.ts`
- Add new base URLs via `NEXT_PUBLIC_*` env vars, read directly in client files with sane local fallbacks

## 8. Authentication

- NextAuth v4 (JWT strategy) configuration is in `src/lib/auth.ts`
- SSO and credentials login are supported
- Use `getServerSession()` in server contexts and `useSession()` in client contexts

## 9. Internationalization

- Locale messages: `src/i18n/messages/en.json` and `src/i18n/messages/vi.json`
- Add translation keys to both locale files
- Use `useTranslations()` for UI text

## 10. Forms (AutoForm)

- Define Zod schemas in `src/services/<domain>/<domain>.schema.ts`
- Use `fieldConfig()` from `@/lib/autoform`
- Wrap schemas using `new ZodProvider(schema)` for `<AutoForm>`
- Use `defaultValues` for edit forms

## 11. Styling & Code Quality

- Tailwind utility-first styling + shared CSS variables from `src/app/globals.css`
- Code style: single quotes, no semicolons, 100-char print width
- Keep loading/error states for async UI
- Avoid creating demo/example files unless explicitly requested
