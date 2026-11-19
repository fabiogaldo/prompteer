# Product Requirements Document (PRD) — Prompteer (v1.0 MVP)

## 1. Overview & Vision

**Prompteer** is an open-source, zero-friction, intention-based prompt generator designed for everyday users and non-technical professionals. Instead of exposing users to complex prompt engineering jargon (e.g., few-shot, chain-of-thought) or overwhelming them with static prompt libraries, Prompteer guides them through a linear 4-step Wizard with concrete examples at every step, producing a structured, fact-checked prompt and routing them to the best AI agent for the task.

## 2. Target Audience & Core Principles

- **Audience:** Everyday users, corporate professionals (HR, Ops, Sales), freelancers, and small business owners.
- **Zero Ambiguity UX:** Never assume technical familiarity. Every wizard step must show a clear example of what the choice produces.
- **Built-in Fact-Checking Awareness:** Users must explicitly choose the tone and factuality rigor, educating them that AI can hallucinate and that their own input premises may contain errors.
- **Client-Side & Zero-Auth (v1.0):** No login, no database, and no backend required for the MVP.

## 3. User Flow (4-Step Wizard)

### Step 1: Category Selection

Users pick 1 high-level context from visual cards (each showing a short description and example use cases):

1. **Corporate & Workplace** (e.g., internal announcements, job postings)
2. **Sales & Freelance** (e.g., classified ads, freelance service pitches)
3. **Visuals, Invites & Campaigns** (e.g., birthday party invites, restaurant banners, NGO campaigns)

### Step 2: Specific Objective Selection

Based on Step 1, users pick 1 specific objective (2 per category in v1.0, each displaying a concrete output preview snippet):

- _Corporate & Workplace:_
  1. **Holiday / Schedule Announcement** (e.g., bridging a Friday holiday)
  2. **Job Opening Post** (e.g., LinkedIn or group hiring post)
- _Sales & Freelance:_
  1. **Product Listing Ad** (e.g., eBay, Facebook Marketplace, handmade goods)
  2. **Freelance Service Pitch** (e.g., social media or WhatsApp service promo)
- _Visuals, Invites & Campaigns:_
  1. **Event / Birthday Invitation** (generates both invite copy and an image generation prompt)
  2. **Promotional / NGO Campaign Banner** (generates headline copy and visual layout/image prompt)

### Step 3: Quick Context Details

Users fill in 2 to 3 short, objective-specific inputs (with clear placeholders/examples). Optional fields fall back gracefully to bracketed placeholders (e.g., `[INSERT DATE]`) if left blank.

### Step 4: Tone & Fact-Checking Rigor (Mandatory)

Users must confirm two explicit settings before generating the prompt:

1. **Tone of Voice:** `Formal & Corporate` | `Direct & Clear` | `Warm & Friendly` | `Persuasive` (pre-selected smartly based on the objective, but always visible for confirmation).
2. **Factuality & Verification Level:**
   - **Creative / Open:** AI can brainstorm and embellish details freely.
   - **Balanced (Default):** Stick strictly to provided facts without inventing data.
   - **Strict Fact-Check (High Rigor):** Displays an educational notice warning that AI can hallucinate or amplify inaccurate user inputs. Injects strict system instructions forcing the AI to verify premises, flag inconsistencies (e.g., mismatched dates/weekdays), avoid assumptions, and cite sources.

### Final Output Screen

- **Generated Prompt Box:** Clean, readable prompt output.
- **Recommended Agent Card:** Displays the best AI tool for the chosen task (`ChatGPT`, `Claude`, `Perplexity`, or `Gemini`) with a 1-sentence explanation of why.
- **Primary Action Button:** Dynamic CTA based on the recommended agent:
  - For agents supporting URL query params (`ChatGPT`, `Claude`, `Perplexity`) when prompt length <= 2000 chars: **"Open in [Agent] ↗"** (simultaneously copies prompt to clipboard as backup and opens `agentUrl?q=encodedPrompt` in a new tab).
  - For `Gemini` or prompts > 2000 chars: **"Copy Prompt & Open [Agent] ↗"** (copies to clipboard, triggers a toast notification, and opens the agent URL).
- **Secondary Action:** **"Copy Prompt"** button/link with instant visual confirmation.

## 4. Bilingual Support & Usability Test Features

### A. Bilingual Localization (English & Brazilian Portuguese)
- Seamless switching between English (`en`) and Brazilian Portuguese (`pt-BR`).
- Language toggle available in the header (`EN | PT`), supporting URL query parameter `?lang=pt` or `?lang=en` (defaulting to `en`).
- Localized UI dictionary (`src/i18n/pt.ts`) and localized prompt catalog (`src/core/catalog/pt.ts`) featuring natural Brazilian cultural conventions (e.g., Mercado Livre / OLX / Enjoei for classifieds; holiday schedule notices adapted to Brazilian workplace customs like *emenda de feriado*).
- Generated prompts are rendered in the selected language with matching localized instructions for tone, factuality, and execution guidelines.

### B. Usability Test Onboarding (?onboarding=1)
- Triggered automatically via URL query parameter `?onboarding=1` or manually via a header button ("How it works?" / "Como funciona?").
- **Onboarding Modal:** An interactive dialog clarifying the core paradigm of Prompteer.
- **Persistent Information Banner:** Prominently explains that Prompteer is NOT an AI chat itself, but a prompt builder that structures, fact-checks, and routes optimized instructions to external AI models (ChatGPT, Claude, Gemini, Perplexity).

## 5. Roadmap (Out of Scope for Current Version)

- **v1.2:** Local history & favorites via `localStorage`.
- **v1.3:** Additional categories (Career/Resume snippets, Study/Academic Research) and full URL state sharing.
- **v2.0:** Decoupled `@prompteer/core` NPM package + interactive CLI (`npx prompteer`) for developers.
- **v3.0:** Chrome/Edge Side Panel browser extension + lightweight backend for community-submitted templates.
