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
     * List Career Pages
     * @returns CareerPageRead Successful Response
     * @throws ApiError
     */
    public static listCareerPagesCareerPagesGet(): CancelablePromise<Array<CareerPageRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/career-pages/',
        });
    }

    /**
     * Create Career Page
     * @param requestBody
     * @returns CareerPageRead Successful Response
     * @throws ApiError
     */
    public static createCareerPageCareerPagesPost(
        requestBody: CareerPageCreate,
    ): CancelablePromise<CareerPageRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/career-pages/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Career Page
     * @param pageId
     * @returns CareerPageRead Successful Response
     * @throws ApiError
     */
    public static getCareerPageCareerPagesPageIdGet(
        pageId: number,
    ): CancelablePromise<CareerPageRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/career-pages/{page_id}',
            path: {
                'page_id': pageId,
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
     * @returns CareerPageRead Successful Response
     * @throws ApiError
     */
    public static updateCareerPageCareerPagesPageIdPut(
        pageId: number,
        requestBody: CareerPageCreate,
    ): CancelablePromise<CareerPageRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/career-pages/{page_id}',
            path: {
                'page_id': pageId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
