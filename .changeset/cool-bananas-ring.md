---
"loopdev-os": minor
"@loopdev/ui": minor
---

feat(ui): Add `Input` & `QualityShield` components with double certification (Front 🔵 + Infra 🔵)
- `Input`: Industrial-grade input with multi-tenant branding, A11y compliance, and stress-tested resilience.
- `QualityShield`: New governance component to visualize QA metrics in Storybook.
- `Button`: Recertified to v1 by adding `role="status"` for loading state, improving A11y.

feat(apps/login): Implement industrial login UI & E2E tests
- `LoginPage`: New page with generative background (Blobs) and Glassmorphism.
- `useAuth`: Brain hook for Supabase authentication logic.
- `Playwright`: E2E Flow Shield activated for login and redirection flows.