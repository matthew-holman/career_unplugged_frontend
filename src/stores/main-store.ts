import { defineStore } from 'pinia';
import { Notify, QNotifyCreateOptions } from 'quasar';
import { AxiosError } from 'axios';
import { ApiError } from 'src/client/scraper';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MainState {}
type NotificationFunction = (options: QNotifyCreateOptions) => void;
export const useMainStore = defineStore('mainStore', {
  state: () => {
    return {} as MainState;
  },
  actions: {
    async checkApiError(
      error: ApiError | AxiosError | unknown,
      notification?: NotificationFunction
    ) {
      if ((error as ApiError).name === 'ApiError') {
        const notificationOptions = {
          type: 'negative',
          color: 'negative',
          message: (error as ApiError).message,
        };
        if (typeof notification !== 'undefined') {
          notification(notificationOptions);
        } else {
          Notify.create(String(notificationOptions));
        }
      } else {
        if (notification) {
          notification({
            type: 'negative',
            color: 'negative',
            message: (error as ApiError).message
          });
        }
      }
    },
  },
});
