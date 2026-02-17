import { SyncService, type AtsSyncRequest, type WorkerRunRead } from 'src/client/scraper';
import { getDefaultUserId } from 'src/api/openapi-client';

export function syncAts(request: AtsSyncRequest): Promise<WorkerRunRead> {
  const userId = getDefaultUserId();
  return SyncService.syncAtsSyncAtsPost(request, userId);
}
