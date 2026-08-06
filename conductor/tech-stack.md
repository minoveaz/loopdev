# Tech Stack: loop.dev

## Core Architecture
- **Monorepo Management:** [pnpm Workspaces](https://pnpm.io/workspaces) + [Turbo](https://turbo.build/) for high-performance builds and task orchestration.
- **Programming Language:** [TypeScript](https://www.typescriptlang.org/) (Strict Mode) for type-safe industrial-grade engineering.

## Frontend (The OS Shell)
- **Framework:** [Next.js 16.1 (React 19)](https://nextjs.org/) using App Router for modern server-side rendering and routing.
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) with a custom, theme-aware Design System token architecture (v3.9+).
- **Icons:** [Lucide React](https://lucide.dev/) + [Material Symbols Outlined](https://fonts.google.com/icons).
- **Components:** Internal `@loopdev/ui` library following the Atoms/Composites/Layouts hierarchy.

## Backend & Infrastructure (The Spine)
- **Platform:** [Supabase](https://supabase.com/) for a unified backend experience.
- **Authentication:** Supabase Auth with SSR support.
- **Authorization:** Row Level Security (RLS) for multi-tenant data isolation.
- **Data Management:** [TanStack Query v5](https://tanstack.com/query/latest) for robust server-state synchronization and caching.

## Quality & Reliability (The Shield)
- **Testing Runner:** [Vitest](https://vitest.dev/) for fast, modern unit and integration testing.
- **Testing Library:** [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) + JSDOM for UI validation.
- **Linting:** [ESLint](https://eslint.org/) with custom LoopDev rules for code consistency.

## Development Environments
- **The OS (loopdev-os):** The main production-ready SaaS environment.
- **The Lab (labdev):** A dedicated [Vite](https://vitejs.dev/) environment for rapid UI/UX prototyping and iteration.

## Repository boundaries and conventions
- **Suite isolation:** Health OS, Sales CRM, Quant Ops and Marketing Studio own their routes, layouts and domain modules. Cross-suite reuse must go through `components/layout`, `@loopdev/contracts` or `@loopdev/ui`.
- **Mock data policy:** fixtures and demo data live under `src/data`, `fixtures` or explicitly named demo contexts. They are never treated as authoritative persistence.
- **Quant Ops boundary:** frontend code lives under `src/app/quant-ops`; Python execution code lives under `modules/mod-quant-core` and integrates through explicit contracts.
- **Quality baseline:** run `pnpm format:check`, `pnpm classes:check`, `pnpm duplication:check`, `pnpm knip --no-exit-code --reporter compact`, `pnpm typecheck` and the Vitest suite before merging.
