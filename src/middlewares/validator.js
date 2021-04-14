import mongoose from 'mongoose';

/**
 * Validate whether the id provided in the request parameter is a valid ObjectId.
 * If it's not, send 404 response.
 * 
 * @param {string} resource 
 * @returns 
 */
export const validateId = (resource) => {
  return async (req, res, next) => {
    if(mongoose.Types.ObjectId.isValid(req.params.id)){
      return next();
    }
    res.status(404).json({'message': `${resource} not found`});
  }; 
};
