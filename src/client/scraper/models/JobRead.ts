/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { RemoteStatus } from './RemoteStatus';

export type JobRead = {
    createdAt?: string;
    updatedAt?: (string | null);
    deletedAt?: (string | null);
    title?: string;
    company: string;
    country: string;
    city?: (string | null);
    linkedinUrl: string;
    applied?: boolean;
    listingRemote?: (RemoteStatus | null);
    listingDate?: (string | null);
    trueRemote?: (boolean | null);
    analysed?: boolean;
    /**
     * Reason this job was flagged as remote (pattern match, location, etc.)
     */
    remoteFlagReason?: (string | null);
    positiveKeywordMatch?: boolean;
    negativeKeywordMatch?: boolean;
    id: number;
};

