# Repository Guidelines

# importent use privilage base authorization system

## Project Structure & Module Organization

This repository is a Next.js App Router application for salon management. Put pages, layouts, global styles, and HTTP handlers in `app/`; API handlers follow `app/api/<resource>/route.ts`. Shared database setup is in `lib/prisma.ts`, authentication and pagination helpers are in `utils/`, and request and DTO types are in `types/`. Prisma schema, migrations, and seed data live in `prisma/`. Static assets belong in `public/`. Keep route-specific logic with its route and reusable logic in shared directories.

## Build, Test, and Development Commands

- `npm run dev` starts the local Next.js development server.
- `npm run build` creates a production build and checks application compilation.
- `npm start` serves the production build; run it after `npm run build`.
- `npx prisma generate` regenerates Prisma Client after schema changes.

There is no test or lint script in `package.json`. When adding tests, document the framework and command in package scripts. Database work may need the environment configuration referenced by `prisma7.config.ts`; never commit credentials from `.env`.

## Coding Style & Naming Conventions

Use TypeScript and follow existing App Router patterns. Use two-space indentation and match nearby files for quotes, semicolons, and formatting. Name React components and types in `PascalCase`; use `camelCase` for functions, variables, and utilities. Keep API route files named `route.ts` and use descriptive DTO filenames such as `productsCreationRequest.ts`. Validate incoming data with the existing Zod schemas and access Prisma through the shared client where practical.

## Testing Guidelines

No automated tests or coverage threshold are configured. For API route changes, verify success, validation, authorization, and error cases locally. For UI changes, check the affected page in the development server. Run `npm run build` before submitting when feasible, and list manual verification steps in the pull request.

## Commit & Pull Request Guidelines

Recent commits use short Conventional Commit prefixes, especially `feat:` and `fix:` (for example, `feat: add product lookup by ID`). Keep commits focused. Pull requests should summarize behavior changes, note migrations or configuration requirements, link related issues when available, and include screenshots for visible UI changes. State the checks run and any known gaps.
