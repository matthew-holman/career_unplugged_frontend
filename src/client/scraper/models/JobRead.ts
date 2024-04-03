/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type JobRead = {
    createdAt?: (string | null);
    updatedAt?: (string | null);
    deletedAt?: (string | null);
    deleted?: boolean;
    title?: string;
    company: string;
    country: string;
    city: (string | null);
    linkedinUrl: string;
    applied?: boolean;
    swedenRemote?: (boolean | null);
    analysed?: boolean;
    id: number;
};

