import { defineStore } from 'pinia';
import { useMainStore as mainStore } from 'src/stores/main-store';
import { Notify } from 'quasar';
import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ApiError,
  Job,
  JobService,
  OpenAPI,
  RemoteStatus,
  Source,
} from 'src/client/scraper';
import { apiUrl } from 'src/env';

OpenAPI.BASE = apiUrl;

interface JobState {
  jobs: Job[];
}

export interface JobListParams {
  title?: string;
  company?: string;
  country?: string;
  city?: string;
  applied?: boolean;
  trueRemote?: boolean;
  positiveKeywordMatch?: boolean;
  negativeKeywordMatch?: boolean;
  analysed?: boolean;
  listingRemote?: RemoteStatus;
  source?: Source;
  createdAtGte?: string;
  createdAtLte?: string;
  listingDateGte?: string;
  listingDateLte?: string;
  euRemote?: boolean;
  recentDays?: number;
}

export const useJobStore = defineStore('jobStore', {
  state: () => {
    return {
      jobs: [],
    } as JobState;
  },
  getters: {},
  actions: {
    async listJobs(listParams: JobListParams) {
      const notification = Notify.create({
        message: 'Fetching Jobs',
        type: 'ongoing',
        color: 'primary',
      });
      try {
        const response = await JobService.listJobsJobGet(
          listParams.title,
          listParams.company,
          listParams.country,
          listParams.city,
          listParams.applied,
          listParams.positiveKeywordMatch,
          listParams.negativeKeywordMatch,
          listParams.trueRemote,
          listParams.analysed,
          listParams.listingRemote,
          listParams.source,
          listParams.createdAtGte,
          listParams.createdAtLte,
          listParams.listingDateGte,
          listParams.listingDateLte,
          listParams.euRemote,
          listParams.recentDays,
      );
        if (response) {
          this.jobs = response as Job[];
          notification({
            type: 'positive',
            message: 'Finished fetching Jobs',
            color: 'positive',
          });
        }
      } catch (error: ApiError | unknown) {
        await mainStore().checkApiError(error, notification);
      }
    },
  },
});
