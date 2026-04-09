# Copilot Instructions for b2b-admin-v2

## Project Overview

This is an e-learning admin dashboard built with Next.js 16 (App Router), TypeScript, Tailwind CSS, and shadcn/ui.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack default)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS + shadcn/ui
- **State:** Zustand 5 (client) + TanStack Query 5 (server)
- **Forms:** AutoForm (Zod → auto-generated forms) + React Hook Form + Zod
- **HTTP:** Axios
- **i18n:** next-intl
- **Theme:** next-themes

## Key Patterns

### Adding a New Admin Page

1. Add route constant to `src/configs/routes.ts`
2. Create page at `src/app/admin/<route>/page.tsx`
3. Wrap page content in `<Main>` from `@/components/layout/main` (header is already rendered in `src/app/admin/layout.tsx`)
4. Add sidebar entry in `src/configs/sidebar.ts` (uses `useSidebarData()` hook with i18n)
5. Add translation keys to both `en.json` and `vi.json`

### Component Organization

- `src/components/ui/` — shadcn/ui primitives (do NOT modify directly)
- `src/components/icons/` — custom icon components (e.g., `iig-icon.tsx`)
- `src/components/layout/` — layout & toolbar components (barrel-exported via `index.ts`)
- `src/components/providers/` — React context providers
- `src/configs/` — app configs (`routes.ts`, `sidebar.ts`, permissions, search)
- `src/types/` — shared TypeScript types

### Adding a New API Integration

1. Put shared Axios setup in `src/apis/` (reuse `base-api.ts` or create dedicated client if needed)
2. Create `src/services/<domain>/<domain>.type.ts` for API response types
3. Create `src/services/<domain>/<domain>.schema.ts` for Zod form schemas (AutoForm)
4. Create `src/services/<domain>/<domain>.api.ts` for API calls using clients from `src/apis/`
5. Create `src/services/<domain>/<domain>.query.ts` for TanStack Query hooks
6. Create `src/services/<domain>/index.ts` barrel file

### Adding a New API Endpoint

1. Add `NEXT_PUBLIC_<NAME>_API_URL` env variable to `.env.*` files
2. Read the variable from the corresponding Axios client in `src/apis/`
3. Keep fallback URL values local to the client file when needed

### Adding a New Translation

1. Add keys to `src/i18n/messages/en.json`
2. Add corresponding keys to `src/i18n/messages/vi.json`
3. Use `useTranslations()` in components

### Adding a Create/Edit Form (AutoForm)

Forms are auto-generated from Zod schemas via [AutoForm](https://github.com/vantezzen/autoform).

1. Define a schema function in `services/<domain>/<domain>.schema.ts` that accepts `t` (i18n translator)
2. Use `fieldConfig()` from `@/lib/autoform` with `.superRefine()` on each field for labels/placeholders
3. In the dialog component, wrap the schema with `new ZodProvider(schema)` and pass to `<AutoForm>`
4. Use `children` of `<AutoForm>` for custom submit buttons
5. For edit dialogs, pass `defaultValues` prop with existing data

## Code Style

- Single quotes, no semicolons
- 100 character print width
- Tailwind classes sorted by prettier plugin
- `cn()` for conditional class merging
- `AppRoutes` for all route references
