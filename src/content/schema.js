'use strict';

const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const CONTENT_TYPES = new Set(['article', 'guide', 'reference', 'tutorial', 'data']);
const LANGUAGES = new Set(['en', 'fil']);
const VERIFICATION_STATUSES = new Set(['verified', 'preliminary', 'needs-review']);
const PUBLICATION_STATUSES = new Set(['draft', 'published', 'archived']);

class ContentValidationError extends Error {
  constructor(message, details = []) {
    super(message);
    this.name = 'ContentValidationError';
    this.details = details;
  }
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isCalendarDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value + 'T00:00:00.000Z');
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function validateCategories(input) {
  const errors = [];
  const categories = input && input.categories;

  if (!Array.isArray(categories) || categories.length === 0) {
    throw new ContentValidationError('Category configuration must contain a non-empty categories array.');
  }

  const ids = new Set();
  const orders = new Set();
  categories.forEach((category, index) => {
    const prefix = 'categories[' + index + ']';
    if (!isPlainObject(category)) {
      errors.push(prefix + ' must be an object.');
      return;
    }

    if (typeof category.id !== 'string' || !ID_PATTERN.test(category.id)) {
      errors.push(prefix + '.id must be a lowercase URL-safe identifier.');
    } else if (ids.has(category.id)) {
      errors.push(prefix + '.id must be unique.');
    } else {
      ids.add(category.id);
    }

    for (const field of ['name', 'nameFil', 'description', 'descriptionFil']) {
      const maxLength = field.startsWith('description') ? 180 : 80;
      if (typeof category[field] !== 'string' ||
          !category[field].trim() ||
          category[field].length > maxLength) {
        errors.push(prefix + '.' + field + ' must be a non-empty string of at most ' + maxLength + ' characters.');
      }
    }

    if (!Number.isInteger(category.order) || category.order < 1) {
      errors.push(prefix + '.order must be a positive integer.');
    } else if (orders.has(category.order)) {
      errors.push(prefix + '.order must be unique.');
    } else {
      orders.add(category.order);
    }
  });

  if (errors.length) throw new ContentValidationError('Invalid category configuration.', errors);
  return categories.slice().sort((a, b) => a.order - b.order);
}

function validateArticleMetadata(metadata, options = {}) {
  const errors = [];
  const categoryIds = options.categoryIds || new Set();
  const expectedSlug = options.expectedSlug;

  if (!isPlainObject(metadata)) {
    throw new ContentValidationError('Article metadata must be a JSON object.');
  }

  for (const field of ['id', 'slug']) {
    if (typeof metadata[field] !== 'string' || !ID_PATTERN.test(metadata[field])) {
      errors.push(field + ' must be a lowercase URL-safe identifier.');
    }
  }

  if (typeof metadata.title !== 'string' || !metadata.title.trim() || metadata.title.length > 160) {
    errors.push('title must be a non-empty string of at most 160 characters.');
  }
  if (metadata.titleFil !== undefined &&
      (typeof metadata.titleFil !== 'string' || !metadata.titleFil.trim() || metadata.titleFil.length > 160)) {
    errors.push('titleFil must be a non-empty string of at most 160 characters.');
  }

  if (expectedSlug && metadata.slug !== expectedSlug) {
    errors.push('slug must match its article directory name.');
  }

  if (typeof metadata.category !== 'string' || !categoryIds.has(metadata.category)) {
    errors.push('category must reference an ID from content/categories.json.');
  }

  if (!Array.isArray(metadata.tags) || metadata.tags.some((tag) =>
    typeof tag !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(tag)
  ) || new Set(metadata.tags).size !== metadata.tags.length) {
    errors.push('tags must be an array of unique lowercase URL-safe strings.');
  }

  if (!CONTENT_TYPES.has(metadata.type)) {
    errors.push('type must be article, guide, reference, tutorial, or data.');
  }

  if (!Array.isArray(metadata.languages) ||
      metadata.languages.length === 0 ||
      metadata.languages.some((language) => !LANGUAGES.has(language)) ||
      new Set(metadata.languages).size !== metadata.languages.length ||
      !metadata.languages.includes('en')) {
    errors.push('languages must contain unique supported codes and include en.');
  }

  if (!VERIFICATION_STATUSES.has(metadata.verificationStatus)) {
    errors.push('verificationStatus must be verified, preliminary, or needs-review.');
  }

  if (!PUBLICATION_STATUSES.has(metadata.status)) {
    errors.push('status must be draft, published, or archived.');
  }

  if (!isCalendarDate(metadata.updatedAt)) {
    errors.push('updatedAt must be a valid YYYY-MM-DD calendar date.');
  }

  if (metadata.publishedAt !== undefined && !isCalendarDate(metadata.publishedAt)) {
    errors.push('publishedAt must be a valid YYYY-MM-DD calendar date.');
  }

  if (metadata.reviewAt !== undefined && !isCalendarDate(metadata.reviewAt)) {
    errors.push('reviewAt must be a valid YYYY-MM-DD calendar date.');
  }

  if (metadata.status === 'published' && !isCalendarDate(metadata.publishedAt)) {
    errors.push('published articles must have a valid publishedAt date.');
  }

  if (metadata.summary !== undefined &&
      (typeof metadata.summary !== 'string' || metadata.summary.length > 320)) {
    errors.push('summary must be a string of at most 320 characters.');
  }
  if (metadata.summaryFil !== undefined &&
      (typeof metadata.summaryFil !== 'string' || metadata.summaryFil.length > 320)) {
    errors.push('summaryFil must be a string of at most 320 characters.');
  }

  if (metadata.sources !== undefined) {
    if (!Array.isArray(metadata.sources)) {
      errors.push('sources must be an array.');
    } else {
      metadata.sources.forEach((source, index) => {
        if (!isPlainObject(source) || typeof source.title !== 'string' || !source.title.trim()) {
          errors.push('sources[' + index + '] must include a title.');
          return;
        }

        try {
          const url = new URL(source.url);
          if (!['http:', 'https:'].includes(url.protocol)) {
            errors.push('sources[' + index + '].url must use HTTP or HTTPS.');
          }
        } catch {
          errors.push('sources[' + index + '].url must be a valid HTTP or HTTPS URL.');
        }
      });
    }
  }

  if (metadata.relatedContent !== undefined &&
      (!Array.isArray(metadata.relatedContent) ||
       metadata.relatedContent.some((slug) => typeof slug !== 'string' || !ID_PATTERN.test(slug)) ||
       new Set(metadata.relatedContent).size !== metadata.relatedContent.length)) {
    errors.push('relatedContent must contain unique URL-safe article slugs.');
  }

  if (errors.length) throw new ContentValidationError('Invalid article metadata.', errors);
  return metadata;
}

module.exports = {
  ContentValidationError,
  validateCategories,
  validateArticleMetadata
};
