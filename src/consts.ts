import generateError from './lib/utils/error';

// List of some generic errors. Specific errors should be created on routes level.
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
  },
};
