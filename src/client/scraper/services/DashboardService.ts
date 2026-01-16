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
     * @returns JobSummary Successful Response
     * @throws ApiError
     */
    public static jobsSummaryDashboardJobsSummaryGet(): CancelablePromise<JobSummary> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/dashboard/jobs/summary',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

}
