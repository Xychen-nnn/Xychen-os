# Xychen OS

Xychen OS is a personal digital platform for projects, selected public links, and an editorial library of topics worth exploring.

## Current website

- Home, About, Projects, Explore, Article, and Links pages
- Shared responsive navigation and footer
- Light and dark themes with a saved visitor preference
- Category-based content discovery
- Git-managed article content with metadata and source validation
- Lightweight health, site metadata, and content API endpoints
- No user accounts, community submissions, or external integrations

## Run locally

Requires Node.js 22.x and npm.

1. Install dependencies with `npm install`.
2. Start the site with `npm start`.
3. Open `http://localhost:3000`.

## API endpoints

- `GET /api/health` — service health and version
- `GET /api/site` — public site name, version, feature flags, and page links
- `GET /api/content/categories` — category registry
- `GET /api/content/articles` — published article metadata
- `GET /api/content/articles/:slug` — one published article

## Project structure

- `public/*.html` — website pages
- `public/css/tokens.css` — shared design tokens and theme values
- `public/css/styles.css` — shared layout and component styling
- `public/js/components.js` — shared header and footer
- `public/js/pages/` — page-specific browser behavior
- `content/categories.json` — canonical category registry
- `content/articles/` — reviewed article content and metadata
- `src/content/` — content validation and rendering
- `src/routes/` — public API routes
- `server.js` — Express app and static file serving

## Content standards

Do not publish placeholder articles or unsupported claims. Each article should have a clear purpose, accurate information, source links, a review status, and publication details. The public library only displays content marked as published.

## Scope

This release is a website, not a full operating system or connected app ecosystem. Features should be added only when they serve a real visitor need and can be maintained properly. Do not add dead buttons, invented project entries, or integrations that are not configured.

User accounts, dashboards, public submissions, database-backed community features, and external Discord integrations are not part of the current release.
