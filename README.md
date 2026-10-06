# HosieryLab

HosieryLab is the visual intelligence database for hosiery. V1 is intentionally scoped to hosiery only: length, coverage, construction, Denier, opacity, color, material, finish, knit, pattern, toe, heel, top band, provenance and comparison.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Current V1 routes

- `/` — narrative homepage and visual experiment
- `/hosiery` — local specimen catalog with search and filters
- `/hosiery/[slug]` — specimen detail and generated prompts
- `/compare` — side-by-side comparison (up to four)
- `/history` — starter History Nodes
- `/about/sources` — provenance and source policy

The current UI uses 12 local standard specimens in `src/lib/data.ts`. PostgreSQL/pgvector, Cloudflare R2 and the data-as-code import pipeline are the next implementation layer.
