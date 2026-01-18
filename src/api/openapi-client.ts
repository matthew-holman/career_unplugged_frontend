import { OpenAPI } from 'src/client/scraper';
import { apiUrl, authHeader, authToken, defaultUserId } from 'src/env';

const missingUserIdMessage =
  'Missing VITE_DEFAULT_USER_ID; set it to an integer to enable API calls.';

let configured = false;

const resolveAuthHeader = (): Record<string, string> => {
  if (authHeader) {
    return { Authorization: authHeader };
  }
  if (authToken) {
    return { Authorization: `Bearer ${authToken}` };
  }
  return {};
};

export function getDefaultUserId(): number {
  if (defaultUserId == null) {
    throw new Error(missingUserIdMessage);
  }
  return defaultUserId;
}

export function configureOpenApiClient(): void {
  if (configured) return;
  configured = true;

  if (defaultUserId == null) {
    console.error(missingUserIdMessage);
  }

  OpenAPI.BASE = apiUrl;
  OpenAPI.HEADERS = async () => resolveAuthHeader();
}
