# iig-admin-template

Admin dashboard cho hệ thống e-learning, xây dựng bằng **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, và **shadcn/ui**.

## Tech Stack

- Next.js 16 + React 19
- TypeScript (strict mode)
- Tailwind CSS + shadcn/ui
- Custom auth flow (cookie token + SSO OAuth2)
- next-intl (i18n: `en`, `vi`)
- Zustand + TanStack Query
- Axios
- AutoForm + Zod + React Hook Form
- pnpm

## Quick Start

### 1) Clone từ template

```bash
npx degit huancnttuet/iig-admin-template my-admin
cd my-admin
```

### 2) Cài dependencies

```bash
pnpm install
```

### 3) Tạo file môi trường

**Windows (cmd):**

```bat
copy .env.example .env.development
```

**macOS / Linux / Git Bash:**

```bash
cp .env.example .env.development
```

### 4) Chạy development

```bash
pnpm dev
```

App chạy mặc định tại `http://localhost:3000`.

## Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm format
pnpm format:check
```

## Environment Variables

Tham chiếu mẫu ở `.env.example`:

- `NEXT_PUBLIC_SSO_TOKEN_API`
- `NEXT_PUBLIC_SSO_LOGIN_PAGE`
- `NEXT_PUBLIC_SSO_LOGOUT_PAGE`
- `NEXT_PUBLIC_SSO_CHANGE_PASSWORD_PAGE`
- `NEXT_PUBLIC_SSO_CLIENT_ID`
- `NEXT_PUBLIC_SSO_REDIRECT_URI`
- `NEXT_PUBLIC_SSO_SCOPE`
- `NEXT_PUBLIC_SSO_PROFILE_URL`

### Lưu ý API base URL

Trong code hiện tại, Axios chính (`src/apis/base-api.ts`) đang đọc:

- `NEXT_PUBLIC_BASE_API_URL`

Vì vậy nếu backend chính chưa hoạt động đúng, hãy thêm biến này vào `.env.development` (ngoài các biến có sẵn trong `.env.example`).

## Kiến trúc thư mục (thực tế hiện tại)

```text
src/
├─ app/
│  ├─ (auth)/
│  │  ├─ layout.tsx
│  │  └─ sign-in/
│  ├─ admin/
│  │  ├─ layout.tsx
│  │  ├─ dashboard/
│  │  ├─ questionnaire-groups/
│  │  ├─ users/
│  │  ├─ account/
│  │  ├─ settings/
│  │  └─ errors/
│  ├─ user/login/
│  ├─ layout.tsx
│  └─ globals.css
├─ apis/
│  ├─ base-api.ts
│  └─ sso-api.ts
├─ components/
│  ├─ ui/
│  ├─ data-table/
│  ├─ layout/
│  ├─ icons/
│  └─ providers/
├─ configs/
│  ├─ routes.ts
│  ├─ sidebar.ts
│  ├─ permissions.ts
│  └─ ...
├─ features/
│  ├─ auth/
│  ├─ questionnaire-groups/
│  └─ systems/
│     ├─ users/
│     └─ permissions/
├─ hooks/
├─ i18n/
│  ├─ config.ts
│  ├─ request.ts
│  └─ messages/
├─ lib/
├─ stores/
├─ types/
└─ proxy.ts
```

## Routing & Layout

- Route constants tập trung ở `src/configs/routes.ts` (`AppRoutes`)
- Sidebar menu ở `src/configs/sidebar.ts` (`useSidebarData()`)
- `src/app/admin/layout.tsx` render sidebar + header chung
- Mỗi page admin chỉ cần bọc nội dung trong `Main`

## Authentication

Dự án hiện **không dùng NextAuth**. Authentication đang dùng flow riêng, gồm 2 luồng:

1. **SSO** (qua IIG KAPI)
2. **Credentials fallback** (dev/fallback)

Các phần chính:

- Auth API + hooks: `src/features/auth/auth.api.ts`, `src/features/auth/auth.query.ts`
- Cookie/token helpers: `src/lib/cookies.ts`, `src/lib/storage.ts`
- SSO login page: `src/app/(auth)/sign-in/page.tsx`
- OAuth callback/login processing: `src/app/user/login/page.tsx`
- API clients: `src/apis/base-api.ts`, `src/apis/sso-api.ts`
- Route protection + refresh token: `src/proxy.ts`

Token được lưu bằng cookie (`accessToken`, `refreshToken`), và `baseApi` sẽ tự động thử refresh khi gặp `401`.

## i18n

- Cấu hình locale: `src/i18n/config.ts`
- Request config: `src/i18n/request.ts`
- Messages: `src/i18n/messages/en.json`, `src/i18n/messages/vi.json`

Khi thêm text mới, luôn cập nhật cả 2 file `en.json` và `vi.json`.

## Data Table & Features

- Reusable data-table components: `src/components/data-table/`
- Hook điều phối table state + URL params: `src/hooks/use-data-table.ts`
- Domain implementations:
  - `src/features/systems/users/components/users-table.tsx`
  - `src/features/questionnaire-groups/components/questionnaire-groups-table.tsx`

## Form Pattern (AutoForm)

- Schema: `src/features/<domain>/*.schema.ts`
- Helper: `src/lib/autoform.ts`
- UI registry: `src/components/autoform/`

## Development Conventions

- Sử dụng `AppRoutes` thay vì hard-code URL
- Dùng `cn()` từ `src/lib/utils.ts` cho className condition
- `'use client'` chỉ khi cần hooks/state/browser APIs
- Giữ style theo project: single quotes, no semicolons, width 100
