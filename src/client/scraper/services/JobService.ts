/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Job } from '../models/Job';
import type { JobRead } from '../models/JobRead';
import type { RemoteStatus } from '../models/RemoteStatus';
import type { Source } from '../models/Source';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class JobService {

    /**
     * Get Job
     * @param jobId
     * @returns JobRead Successful Response
     * @throws ApiError
     */
    public static getJobJobJobIdGet(
        jobId: number,
    ): CancelablePromise<JobRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/job/{job_id}',
            path: {
                'job_id': jobId,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * List Jobs
     * @param title
     * @param company
     * @param country
     * @param city
     * @param applied
     * @param positiveKeywordMatch
     * @param negativeKeywordMatch
     * @param trueRemote
     * @param analysed
     * @param listingRemote
     * @param source
     * @param createdAtGte
     * @param createdAtLte
     * @param listingDateGte
     * @param listingDateLte
     * @param euRemote
     * @param recentDays
     * @returns Job Successful Response
     * @throws ApiError
     */
    public static listJobsJobGet(
        title?: (string | null),
        company?: (string | null),
        country?: (string | null),
        city?: (string | null),
        applied?: (boolean | null),
        positiveKeywordMatch?: (boolean | null),
        negativeKeywordMatch?: (boolean | null),
        trueRemote?: (boolean | null),
        analysed?: (boolean | null),
        listingRemote?: (RemoteStatus | null),
        source?: (Source | null),
        createdAtGte?: (string | null),
        createdAtLte?: (string | null),
        listingDateGte?: (string | null),
        listingDateLte?: (string | null),
        euRemote?: (boolean | null),
        recentDays?: (number | null),
    ): CancelablePromise<Array<Job>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/job/',
            query: {
                'title': title,
                'company': company,
                'country': country,
                'city': city,
                'applied': applied,
                'positive_keyword_match': positiveKeywordMatch,
                'negative_keyword_match': negativeKeywordMatch,
                'true_remote': trueRemote,
                'analysed': analysed,
                'listing_remote': listingRemote,
                'source': source,
                'created_at_gte': createdAtGte,
                'created_at_lte': createdAtLte,
                'listing_date_gte': listingDateGte,
                'listing_date_lte': listingDateLte,
                'eu_remote': euRemote,
                'recent_days': recentDays,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }

}
