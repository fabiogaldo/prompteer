# Execution Plan & Tasks — Prompteer (v1.0 MVP)

Execute tasks strictly in order. Do NOT move to the next task until the current task passes `npm run typecheck`, `npm run lint`, and `npm test` (where applicable).

## Task 1: Project Initialization & Tooling

- Initialize Next.js (App Router, TypeScript strict, Tailwind CSS, ESLint, `src/` directory).
- Initialize `shadcn/ui` and add only: `card`, `button`, `input`, `textarea`, `radio-group`, `progress`, `badge`, `sonner`.
- Install `vitest` and configure `"test": "vitest run"` and `"typecheck": "tsc --noEmit"` in `package.json`.
- **Acceptance Criteria:** Clean build (`npm run build`) with default Next.js page.

## Task 2: Core Engine & Unit Tests (`src/core` & `src/i18n`)

- Create `src/i18n/en.ts` with all UI copy and educational notices.
- Implement `src/core/types.ts`, `src/core/agents.ts`, `src/core/builder.ts`, and `src/core/catalog/en.ts` (3 categories x 2 objectives with concrete examples).
- Enforce zero `react`/`next`/DOM imports inside `src/core/`.
- Write unit tests in `src/core/__tests__/builder.test.ts` covering prompt assembly, strict fact-check injection, bracket fallbacks, agent routing, and the 2000-char URL fallback.
- **Acceptance Criteria:** `npm test` and `npm run typecheck` pass 100%.

## Task 3: 4-Step Wizard UI (`src/components/wizard`)

- Build the mobile-first Wizard container and progress stepper (`Step 1 of 4`).
- Implement `StepCategory`, `StepObjective` (with output preview snippet), `StepDetails` (dynamic fields from catalog), and `StepRigor` (Tone + Fact-Checking level with explicit educational warning on Strict mode).
- **Acceptance Criteria:** Full navigation (Next/Back/Reset) works smoothly using only dictionary strings from `src/i18n/en.ts`.

## Task 4: Output Screen, Clipboard & Deep-Linking

- Implement `StepResult` showing the generated prompt, the Recommended Agent card with rationale, the dynamic primary CTA (`Open in [Agent]` vs `Copy Prompt & Open [Agent]`), and the secondary `Copy Prompt` button.
- Ensure clicking the primary CTA always copies the prompt to clipboard in the background and shows a toast notification.
- **Acceptance Criteria:** End-to-end visual verification in browser; `npm run lint`, `npm test`, and `npm run build` pass with zero errors.
