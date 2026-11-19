/**
 * Unified catalog resolver for Prompteer.
 * Pure TypeScript only — Zero dependencies on React, Next.js, or DOM APIs.
 */

import { Category, Locale, Objective } from '../types';
import { CATALOG_EN } from './en';
import { CATALOG_PT } from './pt';

export { CATALOG_EN } from './en';
export { CATALOG_PT } from './pt';

export function getCatalog(locale: Locale = 'en'): Category[] {
  return locale === 'pt' ? CATALOG_PT : CATALOG_EN;
}

export function getCategoryById(id: string, locale: Locale = 'en'): Category | undefined {
  const catalog = getCatalog(locale);
  return catalog.find((category) => category.id === id);
}

export function getObjectiveById(
  categoryId: string,
  objectiveId: string,
  locale: Locale = 'en'
): Objective | undefined {
  const category = getCategoryById(categoryId, locale);
  if (!category) return undefined;
  return category.objectives.find((obj) => obj.id === objectiveId);
}

