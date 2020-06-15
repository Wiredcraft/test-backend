import type { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';

const validate = (validations: ValidationChain[]) => async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  await Promise.all(
    validations.map((validation: ValidationChain) => validation.run(req))
  );

  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  return res.status(422).json({ errors: errors.array() });
};

export default validate;
