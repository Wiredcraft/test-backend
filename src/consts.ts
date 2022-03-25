import generateError from "./lib/utils/error";

export const ERRORS: { [key: string]: any } = {
    generic: {
        not: {
            found: generateError(404, 'not_found'),
        },
        forbidden: generateError(403, 'forbidden'),
        validation: {
            failed: generateError(
                422,
                'validation_failed',
            ),
        },
        server: {
            error: generateError(500, 'internal_server_error'),
            unavailable: generateError(503, 'server_unavailable'),
        },
        too: {
            many: {
                requests: generateError(
                    429,
                    'too_many_requests',
                ),
            },
        },
    },
}
