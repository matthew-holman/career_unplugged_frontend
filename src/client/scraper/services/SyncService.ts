/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AtsSyncRequest } from '../models/AtsSyncRequest';
import type { LinkedinSyncRequest } from '../models/LinkedinSyncRequest';
import type { SyncAllRequest } from '../models/SyncAllRequest';
import type { WorkerRunRead } from '../models/WorkerRunRead';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SyncService {

    /**
     * Sync Ats
     * @param requestBody
     * @param xUserId
     * @returns WorkerRunRead Successful Response
     * @throws ApiError
     */
    public static syncAtsSyncAtsPost(
        requestBody: AtsSyncRequest,
        xUserId?: (number | null),
    ): CancelablePromise<WorkerRunRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/sync/ats',
            headers: {
                'X-User-Id': xUserId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Sync Linkedin
     * @param requestBody
     * @param xUserId
     * @returns WorkerRunRead Successful Response
     * @throws ApiError
     */
    public static syncLinkedinSyncLinkedinPost(
        requestBody: LinkedinSyncRequest,
        xUserId?: (number | null),
    ): CancelablePromise<WorkerRunRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/sync/linkedin',
            headers: {
                'X-User-Id': xUserId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Sync All
     * @param requestBody
     * @param xUserId
     * @returns WorkerRunRead Successful Response
     * @throws ApiError
     */
    public static syncAllSyncAllPost(
        requestBody: SyncAllRequest,
        xUserId?: (number | null),
    ): CancelablePromise<WorkerRunRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/sync/all',
            headers: {
                'X-User-Id': xUserId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
