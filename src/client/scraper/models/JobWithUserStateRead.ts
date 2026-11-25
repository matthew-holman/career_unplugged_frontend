/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { JobTagRead } from './JobTagRead';
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
    /**
     * Remote eligibility score 0-5. 5=remote-first, 4=EU remote, 3=likely remote, 2=hybrid/weak, 1=unclear, 0=onsite.
     */
    remoteScore?: number;
    analysed?: boolean;
    /**
     * Reason this job was flagged as remote (pattern match, location, etc.)
     */
    remoteFlagReason?: (string | null);
    source?: Source;
    atsSourceUrl?: (string | null);
    linkedinSourceUrl?: (string | null);
    careerPageId?: (number | null);
    id: number;
    applied?: boolean;
    ignored?: boolean;
    tags?: Array<JobTagRead>;
};

