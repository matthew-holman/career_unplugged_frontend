/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CareerPageCreate } from '../models/CareerPageCreate';
import type { CareerPageRead } from '../models/CareerPageRead';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class CareerPagesService {

    /**
     * Create Career Page
     * @param requestBody
     * @param xUserId
     * @returns CareerPageRead Successful Response
     * @throws ApiError
     */
    public static createCareerPageCareerPagesPost(
        requestBody: CareerPageCreate,
        xUserId?: (number | null),
    ): CancelablePromise<CareerPageRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/career-pages/',
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
     * List Career Pages
     * @param companyName
     * @param url
     * @param active
     * @param lastSyncedAtGte
     * @param lastSyncedAtLte
     * @param deactivatedAtGte
     * @param deactivatedAtLte
     * @param lastStatusCode
     * @param xUserId
     * @returns CareerPageRead Successful Response
     * @throws ApiError
     */
    public static listCareerPagesCareerPagesGet(
        companyName?: (string | null),
        url?: (string | null),
        active?: (boolean | null),
        lastSyncedAtGte?: (string | null),
        lastSyncedAtLte?: (string | null),
        deactivatedAtGte?: (string | null),
        deactivatedAtLte?: (string | null),
        lastStatusCode?: (number | null),
        xUserId?: (number | null),
    ): CancelablePromise<Array<CareerPageRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/career-pages/',
            headers: {
                'X-User-Id': xUserId,
            },
            query: {
                'company_name': companyName,
                'url': url,
                'active': active,
                'last_synced_at_gte': lastSyncedAtGte,
                'last_synced_at_lte': lastSyncedAtLte,
                'deactivated_at_gte': deactivatedAtGte,
                'deactivated_at_lte': deactivatedAtLte,
                'last_status_code': lastStatusCode,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Career Page
     * @param pageId
     * @param xUserId
     * @returns CareerPageRead Successful Response
     * @throws ApiError
     */
    public static getCareerPageCareerPagesPageIdGet(
        pageId: number,
        xUserId?: (number | null),
    ): CancelablePromise<CareerPageRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/career-pages/{page_id}',
            path: {
                'page_id': pageId,
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
     * Update Career Page
     * @param pageId
     * @param requestBody
     * @param xUserId
     * @returns CareerPageRead Successful Response
     * @throws ApiError
     */
    public static updateCareerPageCareerPagesPageIdPut(
        pageId: number,
        requestBody: CareerPageCreate,
        xUserId?: (number | null),
    ): CancelablePromise<CareerPageRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/career-pages/{page_id}',
            path: {
                'page_id': pageId,
            },
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
