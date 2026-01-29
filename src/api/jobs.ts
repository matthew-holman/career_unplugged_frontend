import {
  JobService,
  type JobWithUserStateRead,
  type RemoteStatus,
  type Source,
  type UserJobStateRead,
  type UserJobStateUpdate,
} from 'src/client/scraper';
import { getDefaultUserId } from 'src/api/openapi-client';

export interface JobListParams {
  title?: string;
  company?: string;
  country?: string;
  city?: string;
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
  return JobService.listJobsJobGet(
    params.title,
    params.company,
    params.country,
    params.city,
    params.applied,
    params.ignored,
    params.positiveKeywordMatch,
    params.negativeKeywordMatch,
    params.trueRemote,
    params.analysed,
    params.listingRemote,
    sourceParam as Source | undefined,
    params.createdAtGte,
    params.createdAtLte,
    params.listingDateGte,
    params.listingDateLte,
    params.euRemote,
    params.recentDays,
    userId
  );
}

export function updateJobState(
  jobId: number,
  update: UserJobStateUpdate
): Promise<UserJobStateRead> {
  const userId = getDefaultUserId();
  return JobService.upsertJobStateJobJobIdStatePut(jobId, update, userId);
}
