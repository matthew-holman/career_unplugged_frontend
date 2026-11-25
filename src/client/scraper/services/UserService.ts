/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { JobWithUserStateRead } from '../models/JobWithUserStateRead';
import type { RemoteStatus } from '../models/RemoteStatus';
import type { Source } from '../models/Source';
import type { TagCategory } from '../models/TagCategory';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class UserService {

    /**
     * List User Activity
     * @param title
     * @param company
     * @param country
     * @param city
     * @param applied
     * @param ignored
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
     * @param tags
     * @param tagCategory
     * @param minRemoteScore
     * @param activity
     * @param xUserId
     * @returns JobWithUserStateRead Successful Response
     * @throws ApiError
     */
    public static listUserActivityUserActivityGet(
        title?: (string | null),
        company?: (string | null),
        country?: (string | null),
        city?: (string | null),
        applied?: (boolean | null),
        ignored?: (boolean | null),
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
        tags?: (Array<string> | null),
        tagCategory?: (TagCategory | null),
        minRemoteScore?: (number | null),
        activity: 'applied' | 'ignored' | 'both' = 'both',
        xUserId?: (number | null),
    ): CancelablePromise<Array<JobWithUserStateRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/activity',
            headers: {
                'X-User-Id': xUserId,
            },
            query: {
                'title': title,
                'company': company,
                'country': country,
                'city': city,
                'applied': applied,
                'ignored': ignored,
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
                'tags': tags,
                'tag_category': tagCategory,
                'min_remote_score': minRemoteScore,
                'activity': activity,
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
