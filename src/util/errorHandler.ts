import mongoose from 'mongoose';

import { getLogger } from './logger';

const logger = getLogger(__filename.slice(__dirname.length + 1, -3));

export const errorHandler = (fn: (...args: any[]) => any) => async (
  ...args: any[]
): Promise<any> => {
  try {
    await fn(...args);
  } catch (err) {
    logger.error(err.stack || err);
    // find if it's express function
    let resFn;
    if (args && args.length >= 2) {
      if (typeof args[1] === 'object' && args[1].constructor.name === 'ServerResponse') {
        [, resFn] = args;
      }
    }

    if (resFn) {
      let errors = {
        message: 'Internal Sever Error',
        error: err,
      };

      if (err instanceof mongoose.Error.ValidationError) {
        errors = {
          message: 'Mongoose Model Validation Error',
          error: err,
        };
      }
      if (err instanceof mongoose.mongo.MongoError) {
        errors = {
          message: 'MongDB Error',
          error: err,
        };
      }
      resFn.status(500).json(errors);
    }
  }
};
