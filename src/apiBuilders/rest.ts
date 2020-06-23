import { RequestUser } from 'customUser';
import express, { Request, Response, Router } from 'express';
import { param } from 'express-validator';
import mongoose from 'mongoose';

import authorize from '../auth/authorize';
import { AccessType } from '../models/access';
import { Roles } from '../models/user';
import validate from '../util/apiValidator';
import { errorHandler } from '../util/errorHandler';
import { getLogger } from '../util/logger';
import { getModel, getModelList } from '../util/modelScanner';

const logger = getLogger(__filename.slice(__dirname.length + 1, -3));

export const getRestRouters = async (): Promise<Router[]> => {
  let restRouters: (Router | undefined)[] = [];
  try {
    // Import the models
    const modelList = await getModelList();
    restRouters = await Promise.all(
      modelList.map(async (modelName) => {
        const Model = await getModel(modelName);
        let router;
        if (Model) {
          router = express.Router();

          router
            .route(`/${modelName}`)
            .get(
              authorize(modelName, AccessType.readOnly),
              errorHandler(async (req: Request, res: Response) => {
                const allModels = await Model.find({});
                if (allModels) {
                  res.send(allModels);
                } else {
                  res.status(204).end();
                }
              })
            )
            .post(
              authorize(modelName, AccessType.fullAccess),
              errorHandler(async (req: Request, res: Response) => {
                if (req.body.owner) {
                  // only admin can set different owner
                  if ((<RequestUser>req.user).role !== Roles.admin) {
                    req.body.owner = (<RequestUser>req.user).id;
                  }
                } else {
                  req.body.owner = (<RequestUser>req.user).id;
                }

                const model = await new Model(req.body).save();
                // eslint-disable-next-line no-underscore-dangle
                res.status(201).send({ Location: `${req.url}/${model._id}` });
              })
            )
            .put(
              authorize(modelName, AccessType.fullAccess),
              errorHandler(async (req: Request, res: Response) => {
                const allModels = req.body as mongoose.Document[];
                const bulkOperation = Model.collection.initializeUnorderedBulkOp();
                allModels.forEach((model) => {
                  // eslint-disable-next-line no-underscore-dangle
                  const id = mongoose.Types.ObjectId(model._id);
                  bulkOperation.find({ _id: id }).updateOne({
                    $set: model,
                  });
                });
                await bulkOperation.execute();
                res.status(204).end();
              })
            )
            .patch((req: Request, res: Response) => {
              res.status(405).end();
            })
            .delete(
              authorize(modelName, AccessType.fullAccess),
              errorHandler(async (req: Request, res: Response) => {
                await Model.deleteMany({});
                res.status(204).end();
              })
            );

          router
            .route(`/${modelName}/:${modelName}Id`)
            .all(
              validate([
                param(`${modelName}Id`)
                  .matches(/^[a-fA-F0-9]{24}$/)
                  .withMessage(`Invalid ${modelName}Id`),
              ])
            )
            .get(
              authorize(modelName, AccessType.readOnly),
              errorHandler(async (req: Request, res: Response) => {
                const model = await Model.findOne({
                  _id: req.params[`${modelName}Id`],
                });
                if (model) {
                  res.send(model);
                } else {
                  res.status(404).end();
                }
              })
            )
            .put(
              authorize(modelName, AccessType.fullAccess),
              errorHandler(async (req: Request, res: Response) => {
                if (req.body.owner) {
                  // only admin can set different owner
                  if ((<RequestUser>req.user).role !== Roles.admin) {
                    req.body.owner = (<RequestUser>req.user).id;
                  }
                } else {
                  req.body.owner = (<RequestUser>req.user).id;
                }
                const model = await Model.findByIdAndUpdate(req.params[`${modelName}Id`], req.body);
                model.save();
                res.status(204).end();
              })
            )
            .patch(
              authorize(modelName, AccessType.fullAccess),
              errorHandler(async (req: Request, res: Response) => {
                if ((<RequestUser>req.user).role !== Roles.admin) {
                  // only admin can change ownership
                  if (Object.prototype.hasOwnProperty.call(req.body, 'owner')) {
                    delete req.body.owner;
                  }
                }
                const model = await Model.findByIdAndUpdate(req.params[`${modelName}Id`], {
                  $set: req.body,
                });
                model.save();
                res.status(204).end();
              })
            )
            .delete(
              authorize(modelName, AccessType.fullAccess),
              errorHandler(async (req: Request, res: Response) => {
                await Model.findByIdAndRemove(req.params[`${modelName}Id`]);
                res.status(204).end();
              })
            );

          logger.debug(`Generated rest api for ${modelName}`);
        }
        return router;
      })
    );
  } catch (err) {
    logger.error(err);
  }
  // prevent undefined from hitting the list;
  return restRouters.filter((router): router is Router => router !== undefined);
};
