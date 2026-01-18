/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { JobSummary } from '../models/JobSummary';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class DashboardService {

    /**
     * Jobs Summary
     * @param xUserId
     * @returns JobSummary Successful Response
     * @throws ApiError
     */
    public static jobsSummaryDashboardJobsSummaryGet(
        xUserId?: (number | null),
    ): CancelablePromise<JobSummary> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/dashboard/jobs/summary',
            headers: {
                'X-User-Id': xUserId,
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
