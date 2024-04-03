/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { JobRead } from '../models/JobRead';

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

}
