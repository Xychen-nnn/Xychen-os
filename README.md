# Xychen OS

Xychen OS is a personal digital platform for projects, useful browser-based tools, curated links, and small interactive experiments.

## Current website

- Multi-page Home, About, Projects, Tools, Playground, and Links sections
- Responsive glass-inspired interface with jelly-like controls
- Light and dark themes, with the selected theme remembered in the browser
- Text counter with word, character, and line counts
- JSON formatter and minifier with validation feedback
- Playground toys: random discovery, coin flip, dice roller, and creative prompt generator
- Lightweight health and site-metadata API endpoints
- No account, login, support-ticket, or community-submission system

## Run locally

Requires Node.js 22.x and npm.

1. Install dependencies with `npm install`.
2. Start the site with `npm start`.
3. Open `http://localhost:3000`.

## API endpoints

- `GET /api/health` — simple service health response
- `GET /api/site` — public site name, version, feature flags, and page links

## Design and scope

The site uses a shared CSS design system and a browser-side theme preference. Tools run in the visitor's browser and do not need a database. New pages and utilities should be added when they serve a real purpose; avoid fake project entries, dead buttons, and unnecessary backend services.

## Not included

User accounts, admin dashboards, public bug reports, feature-request submissions, support tickets, database storage, and external Discord/Roblox integrations are not part of the current release.
