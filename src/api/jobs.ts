import {
  OpenAPI,
  type JobWithUserStateRead,
  type RemoteStatus,
  type Source,
  type UserJobStateRead,
  type UserJobStateUpdate,
  JobService,
} from 'src/client/scraper';
import { request as apiRequest } from 'src/client/scraper/core/request';
import { getDefaultUserId } from 'src/api/openapi-client';

export interface JobListParams {
  title?: string;
  company?: string;
  country?: string;
  city?: string;
  careerPageId?: number;
  applied?: boolean;
  ignored?: boolean;
  trueRemote?: boolean;
  positiveKeywordMatch?: boolean;
  negativeKeywordMatch?: boolean;
  analysed?: boolean;
  listingRemote?: RemoteStatus;
  source?: Source | Source[];
  createdAtGte?: string;
  createdAtLte?: string;
  listingDateGte?: string;
  listingDateLte?: string;
  euRemote?: boolean;
  recentDays?: number;
}

export function listJobs(params: JobListParams): Promise<JobWithUserStateRead[]> {
  const userId = getDefaultUserId();
  const sourceParam = Array.isArray(params.source)
    ? params.source.join(',')
    : params.source;
  const applied = params.applied ?? false;
  const ignored = params.ignored ?? false;
  return apiRequest(OpenAPI, {
    method: 'GET',
    url: '/job/',
    headers: {
      'X-User-Id': userId,
    },
    query: {
      title: params.title,
      company: params.company,
      country: params.country,
      city: params.city,
      career_page_id: params.careerPageId,
      applied,
      ignored,
      positive_keyword_match: params.positiveKeywordMatch,
      negative_keyword_match: params.negativeKeywordMatch,
      true_remote: params.trueRemote,
      analysed: params.analysed,
      listing_remote: params.listingRemote,
      source: sourceParam as Source | undefined,
      created_at_gte: params.createdAtGte,
      created_at_lte: params.createdAtLte,
      listing_date_gte: params.listingDateGte,
      listing_date_lte: params.listingDateLte,
      eu_remote: params.euRemote,
      recent_days: params.recentDays,
    },
  });
}

export function updateJobState(
  jobId: number,
  update: UserJobStateUpdate
): Promise<UserJobStateRead> {
  const userId = getDefaultUserId();
  return JobService.upsertJobStateJobJobIdStatePut(jobId, update, userId);
}
