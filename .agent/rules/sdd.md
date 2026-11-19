# Project Rules — Prompteer (Spec-Driven Development)

1. **Source of Truth:** Always read `/specs/01-product-prd.md`, `/specs/02-architecture.md`, and `/specs/03-tasks.md` before writing or modifying code.
2. **Language:** All code, comments, commit messages, and v1.0 UI strings must be in English.
3. **Architecture Boundaries:**
   - `src/core/` must remain 100% pure TypeScript (no React, Next.js, or browser DOM dependencies).
   - No hardcoded UI text inside JSX components; read everything from `src/i18n/en.ts`.
   - No backend, database, or external API calls in v1.0.
4. **Workflow:** Implement one task at a time from `specs/03-tasks.md`, verify the Acceptance Criteria, and stop to report completion before starting the next task.
