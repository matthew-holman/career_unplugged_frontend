# AGENTS

Local instructions for coding agents working in this repo.

## Repo context
- Quasar + Vue 3 + TypeScript frontend in `src/`.
- API client is generated via `openapi-typescript-codegen`.

## Non-negotiables
- Do NOT edit generated files under `src/client/**`.
- Create thin wrappers in `src/api/**` to call generated services (e.g. `listJobs(filters)`).

## Product goal
Make the app feel like a fast “job inbox”:
- master–detail browsing (list + details)
- fast filtering (country, trueRemote, recency/listingDate, title/company)
- keyboard-friendly triage
- consistent theme/spacing/typography

## Backend reality
- Jobs: mostly read/query via `GET /job/` with query params.
- Career pages: CRUD via `/career-pages/`.
- Login and user config may not exist in the backend yet:
  - Implement UI + local persistence (LocalStorage) behind an adapter/feature flag.
  - Avoid inventing backend endpoints.

## UX/State rules
- Filters must round-trip through URL query params (shareable views).
- Persist user-only state locally: saved views, triage labels, last-visited timestamp, settings.

## Workflow
- Prefer small, focused changes; avoid unrelated refactors.
- Use `rg` for search.
- Favor minimal diffs; explain intent only when needed.
- Avoid introducing new dependencies unless necessary.

## Quality
- Run `npm run lint` when practical.
- Ensure `npm run dev` and `npm run build` still work after changes.
- Summarize changes and list touched files in the output.
