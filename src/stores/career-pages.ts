import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ApiError,
  CareerPageRead,
  CareerPageCreate,
  CareerPagesService,
} from 'src/client/scraper';
import { useMainStore as mainStore } from 'src/stores/main-store';


interface CareerPageState {
  pages: CareerPageRead[];
}

export const useCareerPagesStore = defineStore('careerPagesStore', {
  state: (): CareerPageState => ({
    pages: [],
  }),

  actions: {
    async listPages() {
      const notification = Notify.create({
        message: 'Fetching Career Pages',
        type: 'ongoing',
        color: 'primary',
      });
      try {
        const response = await CareerPagesService.listCareerPagesCareerPagesGet();
        if (response) {
          this.pages = response;
          notification({
            type: 'positive',
            message: 'Career Pages fetched',
            color: 'positive',
          });
        }
      } catch (error: ApiError | unknown) {
        await mainStore().checkApiError(error, notification);
      }
    },

    async addPage(newPage: CareerPageCreate) {
      const notification = Notify.create({
        message: 'Adding Career Page',
        type: 'ongoing',
        color: 'primary',
      });
      try {
        const response = await CareerPagesService.createCareerPageCareerPagesPost(newPage);
        this.pages.push(response);
        notification({
          type: 'positive',
          message: 'Career Page added',
          color: 'positive',
        });
      } catch (error: ApiError | unknown) {
        await mainStore().checkApiError(error, notification);
      }
    },

    async updatePage(id: number, update: CareerPageCreate) {
      const notification = Notify.create({
        message: 'Updating Career Page',
        type: 'ongoing',
        color: 'primary',
      });
      try {
        const response = await CareerPagesService.updateCareerPageCareerPagesPageIdPut(id, update);
        const index = this.pages.findIndex((p) => p.id === id);
        if (index !== -1) this.pages[index] = response;
        notification({
          type: 'positive',
          message: 'Career Page updated',
          color: 'positive',
        });
      } catch (error: ApiError | unknown) {
        await mainStore().checkApiError(error, notification);
      }
    },
  },
});
