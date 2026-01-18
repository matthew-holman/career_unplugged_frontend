import { defineStore } from 'pinia';
import { useMainStore as mainStore } from 'src/stores/main-store';
import { Notify } from 'quasar';
import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ApiError,
  JobWithUserStateRead,
  UserJobStateRead,
  UserJobStateUpdate,
} from 'src/client/scraper';
import { listJobs, updateJobState, type JobListParams } from 'src/api/jobs';

interface JobState {
  jobs: JobWithUserStateRead[];
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
        const response = await listJobs(listParams);
        if (response) {
          this.jobs = response as JobWithUserStateRead[];
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
    async updateJobState(
      jobId: number,
      update: UserJobStateUpdate
    ): Promise<UserJobStateRead | null> {
      const notification = Notify.create({
        message: 'Updating job status',
        type: 'ongoing',
        color: 'primary',
      });
      try {
        const response = await updateJobState(jobId, update);
        notification({
          type: 'positive',
          message: 'Job status updated',
          color: 'positive',
        });
        return response;
      } catch (error: ApiError | unknown) {
        await mainStore().checkApiError(error, notification);
        return null;
      }
    },
  },
});
