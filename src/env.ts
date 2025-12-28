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
