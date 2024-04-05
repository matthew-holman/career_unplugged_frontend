import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import { AxiosError } from 'axios';
import { ApiError } from 'src/client/scraper';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MainState {}

export const useMainStore = defineStore('mainStore', {
  state: () => {
    return {} as MainState;
  },
  actions: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async checkApiError(
      error: ApiError | AxiosError | unknown,
      notification?: any
    ) {
      if (error instanceof ApiError || error.name === 'ApiError') {
        const notificationOptions = {
          type: 'negative',
          color: 'negative',
          message: error,
        };
        if (typeof notification !== 'undefined') {
          notification(notificationOptions);
        } else {
          Notify.create(String(notificationOptions));
        }
      } else {
        notification({
          type: 'negative',
          color: 'negative',
          message: error.message,
        });
      }
    },
  },
});
