# Xychen OS

Xychen OS is a personal digital platform for projects, browser-based utilities, and useful online resources.

## Current website

- Home, About, Projects, Tools, and Links pages
- Shared header and footer components rendered by a small browser-side script
- Shared light/dark theme tokens and responsive glass-inspired styling
- Theme preference remembered in the visitor's browser
- Text counter with word, character, and line counts
- JSON formatter and minifier with validation feedback
- Lightweight health and site-metadata API endpoints
- No account, login, support-ticket, or community-submission system

## Run locally

Requires Node.js 22.x and npm.

1. Install dependencies with `npm install`.
2. Start the site with `npm start`.
3. Open `http://localhost:3000`.

## API endpoints

- `GET /api/health` — service health and version
- `GET /api/site` — public site name, version, feature flags, and page links

## Project structure

- `public/*.html` — website pages
- `public/css/tokens.css` — shared theme and design tokens
- `public/css/styles.css` — shared layout and component styling
- `public/js/components.js` — shared header and footer
- `public/js/theme.js` — theme preference and footer year
- `src/routes/` — small public API routes
- `server.js` — Express app and static file serving

The shared shell is intentionally dependency-free. Pages keep their content in HTML, while the header and footer are generated from one shared source to avoid navigation drift.

## Design and scope

Tools run in the visitor's browser and do not require a database. New pages and utilities should be added only when they serve a real purpose. Avoid fake project entries, dead buttons, unnecessary backend services, and features that are not ready to work.

## Not included

User accounts, admin dashboards, public bug reports, feature-request submissions, support tickets, database storage, Playground, and external Discord/Roblox integrations are not part of the current release.
