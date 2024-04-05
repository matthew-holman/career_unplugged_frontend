import { defineStore } from 'pinia';
import { useMainStore as mainStore } from 'src/stores/main-store';
import { Notify } from 'quasar';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ApiError, JobRead, JobService, OpenAPI } from 'src/client/scraper';
import { apiUrl } from 'src/env';

OpenAPI.BASE = apiUrl;

interface JobState {
  jobs: JobRead[];
}

export const useJobStore = defineStore('jobStore', {
  state: () => {
    return {
      jobs: [],
    } as JobState;
  },
  getters: {},
  actions: {
    async listJobs(
      title?: string,
      company?: string,
      country?: string,
      city?: string,
      applied?: boolean,
      true_remote?: boolean,
      analysed?: boolean
    ) {
      const notification = Notify.create({
        message: 'Fetching Jobs',
        type: 'ongoing',
        color: 'primary',
      });
      try {
        console.log(process.env);

        const response = await JobService.listJobsJobGet(
          title,
          company,
          country,
          city,
          applied,
          true_remote,
          analysed
        );
        if (response) {
          this.jobs = response;
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
