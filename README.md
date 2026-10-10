# Xychen OS

Public website release of Xychen OS. Visitors can browse the site and submit bug reports, feature requests, and support requests without creating an account or signing in.

## Included
- Public website pages
- Anonymous bug reports, feature requests, and support submissions
- Public announcements
- Health/status endpoint
- SQLite storage for community submissions

Account registration, login, user sessions, the personal dashboard, and admin endpoints are not enabled in the running app. Community submissions are stored under an internal non-login record; do not use it as an authentication account.

## Run
Requires Node.js 18.17+.

1. Run `npm install`.
2. Run `npm start`.
3. Open `http://localhost:3000`.

For deployments that seed sample/admin data, the seed command is no longer required to run the public website.

Discord, Roblox/game integrations, external APIs, payments, and real toolkit utilities are not implemented in this release.
