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
- All categories, objectives, dynamic input fields, examples, and prompt assembly functions live in declarative, strongly typed catalog files per locale (`en.ts` and `pt.ts`).

### C. i18n-Ready Dictionary Structure (`src/i18n/`)

- Supports English (`en`) and Brazilian Portuguese (`pt`).
- **No UI labels or system strings may be hardcoded inside JSX components**.
- All UI copy is sourced from `src/i18n/en.ts` and `src/i18n/pt.ts`.

## 3. Directory Structure

```text
src/
├── app/
│   ├── layout.tsx          # Root layout, metadata, Toaster provider
│   └── page.tsx            # Main Wizard container with ?lang and ?onboarding handlers
├── components/
│   ├── ui/                 # shadcn/ui primitives (including dialog, card, button, etc.)
│   └── wizard/             # Stepper, StepCategory, StepObjective, StepDetails, StepRigor, StepResult, OnboardingModal
├── core/
│   ├── types.ts            # Domain interfaces (Locale, Category, Objective, Tone, RigorLevel, AgentId)
│   ├── agents.ts           # Agent metadata, recommendation rules & deep-link URL builders
│   ├── builder.ts          # Pure buildPrompt() engine + localized fact-checking instruction injector
│   └── catalog/
│       ├── index.ts        # getCatalog(locale) resolver
│       ├── en.ts           # English prompt catalog
│       └── pt.ts           # Brazilian Portuguese prompt catalog
└── i18n/
    ├── index.ts            # getI18n(locale) helper
    ├── en.ts               # English UI strings dictionary
    └── pt.ts               # Brazilian Portuguese UI strings dictionary
```
