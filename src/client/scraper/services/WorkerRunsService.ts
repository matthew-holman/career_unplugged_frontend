/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { WorkerRunRead } from '../models/WorkerRunRead';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class WorkerRunsService {

    /**
     * Get Worker Run
     * @param workerRunId
     * @param xUserId
     * @returns WorkerRunRead Successful Response
     * @throws ApiError
     */
    public static getWorkerRunWorkerRunsWorkerRunIdGet(
        workerRunId: number,
        xUserId?: (number | null),
    ): CancelablePromise<WorkerRunRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/worker-runs/{worker_run_id}',
            path: {
                'worker_run_id': workerRunId,
            },
            headers: {
                'X-User-Id': xUserId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * List Worker Runs
     * @param status
     * @param workerName
     * @param startedAtGte
     * @param startedAtLte
     * @param xUserId
     * @returns WorkerRunRead Successful Response
     * @throws ApiError
     */
    public static listWorkerRunsWorkerRunsGet(
        status?: (string | null),
        workerName?: (string | null),
        startedAtGte?: (string | null),
        startedAtLte?: (string | null),
        xUserId?: (number | null),
    ): CancelablePromise<Array<WorkerRunRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/worker-runs',
            headers: {
                'X-User-Id': xUserId,
            },
            query: {
                'status': status,
                'worker_name': workerName,
                'started_at_gte': startedAtGte,
                'started_at_lte': startedAtLte,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
