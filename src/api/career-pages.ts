import {
  CareerPagesService,
  type CareerPageCreate,
  type CareerPageRead,
} from 'src/client/scraper';
import { getDefaultUserId } from 'src/api/openapi-client';

export interface CareerPageListParams {
  companyName?: string;
  url?: string;
  active?: boolean;
  lastSyncedAtGte?: string;
  lastSyncedAtLte?: string;
  deactivatedAtGte?: string;
  deactivatedAtLte?: string;
  lastStatusCode?: number;
}

export function listCareerPages(
  params: CareerPageListParams = {}
): Promise<CareerPageRead[]> {
  const userId = getDefaultUserId();
  return CareerPagesService.listCareerPagesCareerPagesGet(
    params.companyName,
    params.url,
    params.active,
    params.lastSyncedAtGte,
    params.lastSyncedAtLte,
    params.deactivatedAtGte,
    params.deactivatedAtLte,
    params.lastStatusCode,
    userId
  );
}

export function createCareerPage(
  newPage: CareerPageCreate
): Promise<CareerPageRead> {
  const userId = getDefaultUserId();
  return CareerPagesService.createCareerPageCareerPagesPost(newPage, userId);
}

export function updateCareerPage(
  id: number,
  update: CareerPageCreate
): Promise<CareerPageRead> {
  const userId = getDefaultUserId();
  return CareerPagesService.updateCareerPageCareerPagesPageIdPut(id, update, userId);
}

export function getCareerPage(id: number): Promise<CareerPageRead> {
  const userId = getDefaultUserId();
  return CareerPagesService.getCareerPageCareerPagesPageIdGet(id, userId);
}
