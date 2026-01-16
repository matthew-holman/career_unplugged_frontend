/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RegionsResponse } from '../models/RegionsResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class RegionsService {

    /**
     * List Regions
     * @returns RegionsResponse Successful Response
     * @throws ApiError
     */
    public static listRegionsRegionsGet(): CancelablePromise<RegionsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/regions',
        });
    }

}
