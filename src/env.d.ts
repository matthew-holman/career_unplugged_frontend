/* eslint-disable */

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined;
    VUE_ROUTER_BASE: string | undefined;
  }
}

interface ImportMetaEnv {
  readonly VITE_DEFAULT_USER_ID?: string;
  readonly VITE_AUTH_TOKEN?: string;
  readonly VITE_AUTH_HEADER?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
