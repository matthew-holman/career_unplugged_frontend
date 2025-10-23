const env = import.meta.env.VITE_APP_ENV;

let envApiUrl;

if (env === 'production') {
  envApiUrl = 'http://localhost:5000';
} else if (env === 'staging') {
  envApiUrl = 'http://localhost:5000';
} else {
  envApiUrl = 'http://localhost:5000';
}

export const apiUrl = envApiUrl;
