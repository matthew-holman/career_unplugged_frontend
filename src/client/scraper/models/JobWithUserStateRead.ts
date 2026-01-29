/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { RemoteStatus } from './RemoteStatus';
import type { Source } from './Source';

export type JobWithUserStateRead = {
    createdAt?: string;
    updatedAt?: (string | null);
    deletedAt?: (string | null);
    title?: string;
    company: string;
    country: (string | null);
    city?: (string | null);
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
    source?: Source;
    sourceUrl: string;
    careerPageId?: (number | null);
    id: number;
    applied?: boolean;
    ignored?: boolean;
};

