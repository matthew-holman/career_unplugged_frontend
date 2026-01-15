import { Source } from 'src/client/scraper';

export type JobQueryFilters = {
  title?: string;
  company?: string;
  country?: string;
  city?: string;
  applied?: boolean;
  trueRemote?: boolean;
  analysed?: boolean;
  positiveKeywordMatch?: boolean;
  negativeKeywordMatch?: boolean;
  source?: Source;
  listingRemote?: number;
  createdAtGte?: string;
  createdAtLte?: string;
  listingDateGte?: string;
  listingDateLte?: string;
  euRemote?: boolean;
};

type QueryValue = string | string[] | null | undefined;

const KEY_ALIASES: Record<keyof JobQueryFilters, string[]> = {
  title: ['title'],
  company: ['company'],
  country: ['country'],
  city: ['city'],
  applied: ['applied'],
  trueRemote: ['trueRemote', 'true_remote'],
  analysed: ['analysed'],
  positiveKeywordMatch: ['positiveKeywordMatch', 'positive_keyword_match'],
  negativeKeywordMatch: ['negativeKeywordMatch', 'negative_keyword_match'],
  source: ['source'],
  listingRemote: ['listingRemote', 'listing_remote'],
  createdAtGte: ['createdAtGte', 'created_at_gte'],
  createdAtLte: ['createdAtLte', 'created_at_lte'],
  listingDateGte: ['listingDateGte', 'listing_date_gte'],
  listingDateLte: ['listingDateLte', 'listing_date_lte'],
  euRemote: ['euRemote', 'eu_remote'],
};

const SERIALIZE_KEYS: Record<keyof JobQueryFilters, string> = {
  title: 'title',
  company: 'company',
  country: 'country',
  city: 'city',
  applied: 'applied',
  trueRemote: 'true_remote',
  analysed: 'analysed',
  positiveKeywordMatch: 'positive_keyword_match',
  negativeKeywordMatch: 'negative_keyword_match',
  source: 'source',
  listingRemote: 'listing_remote',
  createdAtGte: 'created_at_gte',
  createdAtLte: 'created_at_lte',
  listingDateGte: 'listing_date_gte',
  listingDateLte: 'listing_date_lte',
  euRemote: 'eu_remote',
};

const BOOLEAN_KEYS = new Set<keyof JobQueryFilters>([
  'applied',
  'trueRemote',
  'analysed',
  'positiveKeywordMatch',
  'negativeKeywordMatch',
  'euRemote',
]);

function getQueryValue(value: QueryValue): string | undefined {
  if (Array.isArray(value)) return value[0];
  if (typeof value === 'string') return value;
  return undefined;
}

function parseBoolean(value: string | undefined): boolean | undefined {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return undefined;
}

function parseNumber(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function parseSource(value: string | undefined): Source | undefined {
  if (!value) return undefined;
  const allowed = Object.values(Source) as string[];
  return allowed.includes(value) ? (value as Source) : undefined;
}

function getAliasedValue(
  query: Record<string, QueryValue>,
  aliases: string[]
): string | undefined {
  for (const alias of aliases) {
    const value = getQueryValue(query[alias]);
    if (value !== undefined) return value;
  }
  return undefined;
}

export function parseJobQuery(
  query: Record<string, QueryValue>
): JobQueryFilters {
  const filters: JobQueryFilters = {};
  const setFilter = <K extends keyof JobQueryFilters>(
    key: K,
    value: JobQueryFilters[K]
  ) => {
    (
      filters as Record<keyof JobQueryFilters, JobQueryFilters[keyof JobQueryFilters]>
    )[key] = value;
  };

  (Object.keys(KEY_ALIASES) as (keyof JobQueryFilters)[]).forEach((key) => {
    const aliases = KEY_ALIASES[key];
    const raw = getAliasedValue(query, aliases);
    if (raw === undefined || raw === '') return;

    if (key === 'listingRemote') {
      const parsed = parseNumber(raw);
      if (parsed !== undefined) setFilter('listingRemote', parsed);
      return;
    }

    if (key === 'source') {
      const parsed = parseSource(raw);
      if (parsed) setFilter('source', parsed);
      return;
    }

    if (BOOLEAN_KEYS.has(key)) {
      const parsed = parseBoolean(raw);
      if (parsed !== undefined) {
        setFilter(key, parsed as JobQueryFilters[typeof key]);
      }
      return;
    }

    setFilter(key, raw as JobQueryFilters[typeof key]);
  });

  return filters;
}

export function serializeJobQuery(filters: JobQueryFilters): Record<string, string> {
  const query: Record<string, string> = {};

  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    const serializedKey = SERIALIZE_KEYS[key as keyof JobQueryFilters];
    if (typeof value === 'boolean') {
      query[serializedKey] = value ? 'true' : 'false';
      return;
    }
    query[serializedKey] = String(value);
  });

  return query;
}
