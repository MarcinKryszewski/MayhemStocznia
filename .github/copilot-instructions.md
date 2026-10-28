# Repository instructions

## Project shape

- This is a Polish-language Astro starter for a site that will compare GitHub contribution graphs in a shipyard-themed arena. The current home page (`src/pages/index.astro`) is a placeholder.
- Astro file-based routing maps `src/pages/index.astro` to `/` and `src/pages/api/contributions/[username].ts` to `/api/contributions/:username`. The API route is currently a `501` stub; its TODO describes fetching contribution data from `https://github.com/{username}.contribs`.
- `astro.config.mjs` uses server output and the Node adapter in standalone mode so API routes can run. A static host such as GitHub Pages cannot serve these dynamic routes; see the deployment notes in `README.md`.
- TypeScript extends Astro's strict configuration (`tsconfig.json`). API handlers use Astro's `APIRoute` type, and dynamic server routes opt out of prerendering.

## Commands

- `npm run dev` — start the local development server.
- `npm run build` — build the application.
- `npm run preview` — preview the production build.

There are no test or lint scripts or test runner configured in `package.json`, so there is no single-test command.

## Repository conventions

- Keep user-facing page text in Polish, consistent with the existing page and README.
- Put pages and endpoints under `src/pages` and use Astro's file-based routing; keep server-only behavior in API routes.
- Keep API route exports explicitly typed with `APIRoute`. Dynamic endpoints should remain non-prerendered when they depend on request-time input.
- Preserve the server/Node deployment setup when changing API behavior. If intentionally targeting static hosting, follow the README's required config and deployment changes and account for the API no longer running there.
