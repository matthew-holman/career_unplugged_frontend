import { defineStore } from 'pinia';
import { useMainStore as mainStore } from 'src/stores/main-store';
import { Notify } from 'quasar';
import { ApiError, JobRead, JobService, OpenAPI } from 'src/client/scraper';

OpenAPI.BASE = process.env.API_URL;

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
      remote?: boolean,
      analysed?: boolean,
    ) {
      const notification = Notify.create({
        message: 'Fetching Jobs',
        type: 'ongoing',
        color: 'primary',
      });
      try {
        const response = await JobService.listJobsJobGet(
          title,
          company,
          country,
          city,
          applied,
          remote,
          analysed,
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
