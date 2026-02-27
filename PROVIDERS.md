# Adding a New Provider

This guide explains how to add disposal rules for a new city or jurisdiction.

## Overview

Each provider is a single JSON file in `data/providers/`. The app auto-discovers all `.json` files in that directory — **no code changes needed** to add a new location.

## Step-by-Step

### 1. Create the JSON file

Create `data/providers/{your-city-id}.json`. The ID should be lowercase, hyphenated (e.g., `austin`, `seattle`, `miami-dade`).

### 2. Follow the schema

Your JSON must match this structure:

```json
{
  "id": "your-city-id",
  "displayName": "Your City, ST",
  "coverage": {
    "country": "US",
    "region": "TX",
    "city": "Austin",
    "zips": ["73301", "73344"],
    "aliases": ["austin texas", "atx"]
  },
  "source": {
    "name": "City of Austin Waste Services",
    "url": "https://austintexas.gov/recycling",
    "generatedAt": "2026-02-26",
    "notes": "Data from official city recycling guide",
    "license": "Public government data"
  },
  "materials": [
    {
      "id": "unique-material-id",
      "name": "Human-readable name",
      "aliases": ["synonym1", "synonym2", "common name"],
      "category": "recycle",
      "instructions": [
        "Step 1: Do this",
        "Step 2: Then this"
      ],
      "notes": ["Any additional context"],
      "commonMistakes": ["Don't do this common error"],
      "tags": ["optional", "search", "tags"],
      "examples": ["Specific example 1", "Specific example 2"]
    }
  ],
  "rulesSummary": {
    "accepted": {
      "recycle": ["Category of accepted items"],
      "compost": ["Composting categories"],
      "trash": ["What goes in trash"]
    },
    "notAccepted": {
      "recycle": ["Items NOT accepted in recycling"],
      "compost": ["Items NOT accepted in composting"]
    },
    "tips": ["General tips for residents"]
  },
  "locations": [
    {
      "name": "Drop-off Location Name",
      "address": "123 Main St, City, ST 12345",
      "phone": "555-123-4567",
      "url": "https://example.com",
      "accepts": ["Batteries", "Electronics", "Paint"],
      "hours": "Mon-Sat 8am-5pm",
      "notes": "Optional notes"
    }
  ]
}
```

### 3. Material categories

Each material must have one of these categories:

| Category | Use for |
|---|---|
| `recycle` | Curbside recyclable items |
| `trash` | Regular trash / landfill items |
| `compost` | Compostable items (food waste, yard waste) |
| `dropoff` | Items requiring special drop-off locations |
| `hazardous` | Hazardous waste requiring special handling |
| `unknown` | Items where disposal method is unclear |

### 4. Writing good materials

- **Include aliases**: Think about how people actually search. "Soda can" and "pop can" should both find "Aluminum cans".
- **Include examples**: Specific real-world items that fall under this material.
- **Add common mistakes**: What do people get wrong? This is the most valuable part.
- **Keep instructions actionable**: Step-by-step, starting with what to do first.
- **Add tags**: Broad categories like "plastic", "metal", "food" help with fuzzy matching.

### 5. Validate your provider

Run the app and check:

```bash
npm run dev
# Visit http://localhost:3000/providers to see your provider listed
# Visit http://localhost:3000/rules and select your provider to verify materials
```

You can also validate the JSON programmatically:

```typescript
import { ProviderSchema } from "./src/lib/providers/schemas";
import fs from "fs";

const data = JSON.parse(fs.readFileSync("data/providers/your-city.json", "utf-8"));
const result = ProviderSchema.safeParse(data);
console.log(result.success ? "Valid!" : result.error);
```

### 6. Creating an extraction script (optional)

If you're working from an HTML source (like a city's "What Goes Where" page), you can create a script similar to `scripts/extract-provider-orlando.ts`:

```bash
scripts/extract-provider-{city}.ts
```

This makes the provider regeneratable and CI-friendly.

## Coverage Matching

The app matches users to providers using:

1. **City name** — exact match against `coverage.city`
2. **Region** — match against `coverage.region`
3. **ZIP code** — match against `coverage.zips[]`
4. **Aliases** — match against `coverage.aliases[]`

If no provider matches, the app falls back to `general`.

## Tips

- Start with 15-20 common materials, then expand
- Focus on items that are **different** from general guidance in your area
- Include items that people frequently get wrong locally
- Add drop-off locations if your city has specific facilities
- Use the `general.json` provider as a template
