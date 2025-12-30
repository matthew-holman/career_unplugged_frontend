import { defineStore } from 'pinia';
import { useMainStore as mainStore } from 'src/stores/main-store';
import { Notify } from 'quasar';
import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ApiError,
  JobRead,
  JobService,
  OpenAPI,
  RemoteStatus,
  Source,
} from 'src/client/scraper';
import { apiUrl } from 'src/env';

OpenAPI.BASE = apiUrl;

interface JobState {
  jobs: JobRead[];
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
  recent?: boolean;
  listingRemote?: RemoteStatus;
  source?: Source
  offset?: number;
  limit?: number;
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
          listParams.recent,
          listParams.listingRemote,
          listParams.source,
      );
        if (response) {
          this.jobs = response as JobRead[];
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
