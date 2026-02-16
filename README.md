# Cravey Web

Cravey Web is a Next.js app for cannabis cessation tracking, inspired by the iOS Cravey app.

## Stack

- Next.js (App Router, TypeScript)
- Tailwind + shadcn-style UI primitives
- Neon serverless Postgres (`@neondatabase/serverless`)
- NextAuth magic-link auth (email provider + Resend send function)
- Recharts for dashboard visuals
- jsPDF for patient-facing PDF export

## Implemented (Phase 1 baseline)

- Magic-link login at `/login` with protected routes
- Dashboard at `/dashboard` with streak, weekly summary, and charts
- Craving log at `/log/craving`
- Usage log at `/log/usage`
- Combined history feed at `/history` with type filter + pagination
- Settings at `/settings` with export + delete-all-data
- Export page at `/settings/export` (JSON, CSV, PDF)

## Environment Variables

Create `.env.local` with:

```bash
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
RESEND_API_KEY=
EMAIL_FROM=
BLOB_READ_WRITE_TOKEN=
```

## Database Setup

Apply SQL in `db/migrations/001_init.sql` to your Neon database.

## Run Locally

```bash
npm install
npm run dev
```

## Quality Checks

- Lint: `npm run lint`
- Unit tests: `npm run test`
- Build: `npm run build`
- Full check (lint + tests + build): `npm run check`

## Unit Testing

Vitest is configured via `vitest.config.ts`. Current tests cover:

- Export utilities (`tests/export-utils.test.ts`)
- Validation schemas (`tests/validation.test.ts`)
- Domain constants (`tests/schema.test.ts`)
