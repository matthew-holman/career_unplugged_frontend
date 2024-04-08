/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { RemoteStatus } from './RemoteStatus';

export type Job = {
  createdAt?: string;
  updatedAt?: string | null;
  deletedAt?: string | null;
  title?: string;
  company: string;
  country: string;
  city?: string | null;
  linkedinUrl: string;
  applied?: boolean;
  listingRemote?: RemoteStatus | null;
  listingDate?: string | null;
  trueRemote?: boolean | null;
  analysed?: boolean;
  positiveKeywordMatch?: boolean;
  negativeKeywordMatch?: boolean;
  id?: number;
};
