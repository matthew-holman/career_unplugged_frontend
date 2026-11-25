/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type WorkerRunRead = {
    id: number;
    run_id: string;
    worker_name: string;
    status: string;
    started_at: string;
    finished_at?: (string | null);
    summary?: (Record<string, any> | null);
    errors?: (Array<string> | null);
};

