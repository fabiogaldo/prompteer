# Technical Architecture & Engineering Rules — Prompteer (v1.0)

## 1. Tech Stack

- **Framework:** Next.js (App Router) with React & TypeScript (strict mode).
- **Styling & UI:** Tailwind CSS + `shadcn/ui` (`Card`, `Button`, `Input`, `Textarea`, `RadioGroup`, `Progress`, `Badge`, `Sonner` toast) + `lucide-react`.
- **Deployment:** Vercel Hobby Plan (100% static/client-side execution, zero serverless functions or external DB in v1.0).

## 2. Core Architectural Principles

### A. Strict Separation of Core Engine and UI (`src/core` vs `src/components`)

- `src/core/` MUST contain pure TypeScript only. **Zero imports from `react`, `next`, or DOM APIs** are allowed inside `src/core/`.
- This guarantees effortless unit testing and direct reuse for the v2.0 Node.js CLI.

### B. Data-Driven UI Catalog (`src/core/catalog/`)

- Wizard steps must never hardcode category-specific `if/else` branches.
- All categories, objectives, dynamic input fields, examples, and prompt assembly functions live in a declarative, strongly typed catalog structure.

### C. i18n-Ready Dictionary Structure (`src/i18n/`)

- v1.0 ships in English (`en`) only, but **no UI labels or system strings may be hardcoded inside JSX components**.
- All UI copy must be sourced from `src/i18n/en.ts` so adding `src/i18n/pt.ts` in v1.1 requires zero component refactoring.

## 3. Directory Structure

```text
src/
├── app/
│   ├── layout.tsx          # Root layout, metadata, Toaster provider
│   └── page.tsx            # Main Wizard container
├── components/
│   ├── ui/                 # shadcn/ui primitives
│   └── wizard/             # Stepper, StepCategory, StepObjective, StepDetails, StepRigor, StepResult
├── core/
│   ├── types.ts            # Domain interfaces (Category, Objective, Tone, RigorLevel, AgentId)
│   ├── agents.ts           # Agent metadata, recommendation rules & deep-link URL builders
│   ├── builder.ts          # Pure buildPrompt() engine + fact-checking instruction injector
│   └── catalog/
│       └── en.ts           # v1.0 English prompt catalog (3 categories x 2 objectives)
└── i18n/
    └── en.ts               # UI strings dictionary
```
