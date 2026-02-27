# CLAUDE.md — Project Rules for AI Assistants

## Project Overview

**isthisrecyclable.com** — A camera-first consumer web app for waste disposal guidance. Users snap/upload a photo or search an item, and the app tells them how to dispose of it (Recycle / Trash / Compost / Drop-off / Hazardous) based on local jurisdiction rules.

## Tech Stack

- Next.js 16 App Router + TypeScript (strict mode)
- TailwindCSS + shadcn/ui
- TanStack Query (client caching)
- Zod (all schemas + validation)
- OpenAI API (server-side only, vision + text)
- Framer Motion (animations)
- Vitest (unit tests) + Playwright (e2e)

## Key Architecture Rules

1. **Provider system**: All disposal rules come from JSON files in `data/providers/`. Never hardcode rules in UI components.
2. **Deterministic-first**: The matching engine uses deterministic scoring. OpenAI is only used for image identification and ambiguous label resolution.
3. **Server-side AI only**: OpenAI API key must never be exposed to the browser. All AI calls happen in Next.js route handlers.
4. **Zod everywhere**: All API inputs, outputs, and provider data must be validated with Zod schemas.
5. **Privacy**: Never store user images. No PII collection. Analytics are anonymous only.

## File Structure

- `src/lib/providers/` — Provider types, schemas, registry, loader
- `src/lib/matching/` — Deterministic search engine (tokenizer, scorer, engine)
- `src/lib/openai/` — OpenAI client, scan, resolve (server-side only)
- `src/components/` — React components organized by feature
- `data/providers/` — Provider JSON files (auto-discovered)
- `scripts/` — Provider extraction scripts

## Adding Features

- New providers: Drop JSON in `data/providers/`, no code changes needed
- New UI components: Use shadcn/ui primitives, follow existing patterns
- New API endpoints: Create route handlers in `src/app/api/`, validate with Zod
- Tests: Unit tests in `src/__tests__/`, e2e in `e2e/`

## Commands

```
npm run dev          # Development server
npm run build        # Production build
npm run test         # Unit tests
npm run test:e2e     # E2E tests
npm run extract:orlando  # Regenerate Orlando provider
```

## Environment

Required: `OPENAI_API_KEY` (for scan feature only — text search works without it)
Optional: `OPENAI_MODEL_VISION`, `OPENAI_MODEL_TEXT`, `NEXT_PUBLIC_DEFAULT_PROVIDER`
