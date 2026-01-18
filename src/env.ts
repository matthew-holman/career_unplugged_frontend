const env = import.meta.env.VITE_APP_ENV;

let envApiUrl;

if (env === 'production') {
  envApiUrl = 'http://localhost:5005';
} else if (env === 'staging') {
  envApiUrl = 'http://localhost:5005';
} else {
  envApiUrl = 'http://localhost:5005';
}

export const apiUrl = envApiUrl;

const rawUserId = import.meta.env.VITE_DEFAULT_USER_ID;
const parsedUserId = rawUserId ? Number(rawUserId) : NaN;
export const defaultUserId = Number.isFinite(parsedUserId)
  ? parsedUserId
  : undefined;

const rawAuthToken = import.meta.env.VITE_AUTH_TOKEN;
export const authToken = rawAuthToken?.trim() ? rawAuthToken.trim() : undefined;

const rawAuthHeader = import.meta.env.VITE_AUTH_HEADER;
export const authHeader = rawAuthHeader?.trim() ? rawAuthHeader.trim() : undefined;
