import { DashboardService, type JobSummary } from 'src/client/scraper';
import { getDefaultUserId } from 'src/api/openapi-client';

export function fetchJobsSummary(): Promise<JobSummary> {
  const userId = getDefaultUserId();
  return DashboardService.jobsSummaryDashboardJobsSummaryGet(userId);
}
