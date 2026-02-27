# Is this recyclable?

A camera-first web app that tells you how to dispose of any item correctly — **Recycle / Trash / Compost / Drop-off / Hazardous** — based on your local jurisdiction's rules.

**Live at:** [isthisrecyclable.com](https://isthisrecyclable.com)

## Features

- **Camera scanning** — Snap a photo on your phone for instant AI-powered identification
- **Smart search** — Type any item name with fuzzy matching and synonym support
- **Local rules** — Disposal instructions specific to your city, not generic advice
- **Confidence scoring** — Know how sure we are about each result
- **Offline support** — Text search works offline with cached provider data (PWA)
- **Dark mode** — Automatic or manual theme switching
- **Privacy-first** — No accounts, no photo storage, no tracking

## Tech Stack

- **Next.js 16** (App Router) + TypeScript (strict)
- **TailwindCSS** + **shadcn/ui** for UI components
- **TanStack Query** for client-side caching
- **Zod** for schema validation everywhere
- **OpenAI** (GPT-4o vision + GPT-4o-mini text) for image scanning
- **Framer Motion** for animations
- **Vitest** for unit tests + **Playwright** for e2e
- **PWA** support with service worker

## Quick Start

```bash
# Clone and install
git clone <repo-url>
cd isthisrecyclable.com
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local and add your OPENAI_API_KEY

# Generate Orlando provider data
npm run extract:orlando

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `OPENAI_API_KEY` | Yes (for scan) | — | OpenAI API key for image scanning |
| `OPENAI_MODEL_VISION` | No | `gpt-4o` | Model for image identification |
| `OPENAI_MODEL_TEXT` | No | `gpt-4o-mini` | Model for text-based resolve |
| `NEXT_PUBLIC_DEFAULT_PROVIDER` | No | `general` | Default provider when no location selected |
| `NEXT_PUBLIC_APP_NAME` | No | `Is this recyclable?` | App display name |

> **Note:** The app works without `OPENAI_API_KEY` — text search is fully functional. Only photo scanning requires the key.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |
| `npm run test` | Run unit tests (Vitest) |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:e2e` | Run Playwright e2e tests |
| `npm run extract:orlando` | Regenerate Orlando provider from HTML source |

## Architecture

### Provider System

The app uses a **pluggable provider system** where each city/jurisdiction has a JSON data file:

```
data/providers/
├── general.json    # US-wide conservative guidance (fallback)
└── orlando.json    # Orlando, FL specific rules
```

Providers are auto-discovered — drop a JSON file in `data/providers/` and it's available immediately. See [PROVIDERS.md](PROVIDERS.md) for the full guide.

### Matching Engine

A deterministic search engine matches user queries to provider materials:

1. **Exact name match** (score: 1.0)
2. **Exact alias match** (score: 0.95)
3. **Partial / contains match** (score: 0.7-0.9)
4. **Token overlap** (score: up to 0.85)
5. **Trigram similarity** (score: 0.3-0.7)

### OpenAI Integration

OpenAI is used **server-side only** for two purposes:

1. **Vision** (`/api/scan`) — Identifies waste items from photos
2. **Text resolve** (`/api/resolve`) — Helps map ambiguous labels to provider materials

The final disposal decision is always based on the provider's deterministic rules, with AI providing item identification assistance.

## Project Structure

```
src/
├── app/              # Next.js pages and API routes
├── components/       # React components (ui/, layout/, scan/, search/, result/)
├── lib/
│   ├── providers/    # Provider types, schemas, registry, loader
│   ├── matching/     # Deterministic search engine
│   ├── openai/       # OpenAI client, scan, resolve
│   ├── location/     # Location store
│   └── utils/        # Confidence blending, category metadata
├── hooks/            # React hooks (camera, location, provider)
└── __tests__/        # Unit tests
```

## Open Graph / Social Sharing

When links are shared on iMessage, X/Twitter, Discord, Slack, etc., they unfurl into rich preview cards with:

- Category-themed background (blue for Recycle, gray for Trash, green for Compost, etc.)
- Bold item name and disposal decision
- Location and confidence score
- Optional warning pill for common mistakes
- Brand mark

### Dynamic OG Images

Every result page generates a unique share image via `/api/og` (edge runtime, `ImageResponse`):

```
/api/og?category=trash&item=Plastic+Bag&loc=Orlando,+FL&confidence=92&warning=Never+put+in+recycling
```

### Static Fallbacks

Pre-generated fallback images live in `/public/og/` for reliability on Netlify or when the edge function is unavailable. Generate them with:

```bash
npm run dev &   # Dev server must be running
npm run generate:og
```

### Debug / QA

Visit `/debug/og` in the app to preview all category variants and build custom OG cards.

### Validating Unfurls

| Platform | Tool |
|---|---|
| Facebook | [Sharing Debugger](https://developers.facebook.com/tools/debug/) — paste URL, click "Scrape Again" |
| X/Twitter | Share a link in a draft post to preview the card |
| LinkedIn | [Post Inspector](https://www.linkedin.com/post-inspector/) |
| Discord | Paste link in any channel (cache: edit message, re-paste) |
| Slack | Paste link (to refresh cache: `/unfurl <url>`) |
| iMessage | Send the link to yourself — iOS fetches OG automatically |

### Common Pitfalls

- **Relative `og:image` URLs** — Crawlers need absolute URLs. We always use `${SITE_URL}/api/og?...`
- **Blocked by robots.txt** — Ensure `/api/og` is not disallowed
- **Missing Content-Type** — Our route returns `image/png` correctly
- **Platform caching** — Facebook/Discord/Slack cache aggressively. Use their debug tools to force a re-fetch after changes
- **SITE_URL mismatch** — Set `NEXT_PUBLIC_SITE_URL` in production to match your actual domain

## License

MIT
