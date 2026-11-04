# Content directory

This directory stores editorial content managed through Git and served by the public Explore pages and content API.

- `categories.json` is the canonical category registry, including each category's public description and display order.
- `articles/<slug>/metadata.json` stores validated article metadata.
- `articles/<slug>/content.md` stores the English article body.
- `articles/<slug>/content.fil.md` is optional Filipino content when the metadata lists `fil` as an available language.

No example or placeholder article is published. Add an article only when its content, sources, verification status, and publication details are ready.

## Article metadata

Required fields:

- `id`: stable unique identifier using lowercase letters, numbers, and hyphens.
- `title`: human-readable English title.
- `titleFil`: optional Filipino title; English is used when it is unavailable.
- `slug`: URL-safe identifier; must match the article directory.
- `category`: an ID from `categories.json`.
- `tags`: unique lowercase tags.
- `type`: `article`, `guide`, `reference`, `tutorial`, or `data`.
- `languages`: available language codes (`en`, `fil`); English is required as the fallback.
- `verificationStatus`: `verified`, `preliminary`, or `needs-review`.
- `status`: `draft`, `published`, or `archived`.
- `updatedAt`: date in `YYYY-MM-DD` format.

Optional fields include `summary`, `summaryFil`, `sources`, `publishedAt`, `reviewAt`, and `relatedContent`. Filipino article text is stored in `content.fil.md` and is used only when the article metadata lists `fil` as an available language.

A published article must have a publication date. Source URLs must use HTTP or HTTPS. Dates are calendar dates, not timestamps.

## Validation and rendering

The content loader validates category and article metadata before returning content. Category descriptions are required so the public interface never falls back to generic placeholder copy. Markdown is rendered with HTML input disabled; raw HTML in article files is escaped rather than executed. Markdown links are subject to the renderer's protocol validation.

The public website reads categories and published articles through `/api/content/categories` and `/api/content/articles`. The article endpoint serves published content only.
