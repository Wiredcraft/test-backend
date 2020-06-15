/**
 * ModelBuilder target for mongoose model
 */

import mongoose, { Schema, model } from 'mongoose';
import ModelBuilderInterface from './modelBuilder';
import { AccessInterface, predefinedAccess } from '../models/access';
import ShuttleModel, {
  isShuttleModel,
  shuttleModelConsts,
  supportedInterface,
  ShuttleModelInterface,
  ShuttleModelProperty,
} from '../models/shuttleModel';
import importHandler from '../util/importHandler';
import getLogger from '../util/logger';

const logger = getLogger('MongooseBuilder');
export class MongooseBuilder
  implements
    ModelBuilderInterface<
      ShuttleModelInterface | mongoose.Model<any>,
      mongoose.Model<any> | null
    > {
  constructor() {
    this.storedModels = {};
    this.acl = {};
  }

  /**
   * Stored models
   * models that have been built will be stored here
   */
  storedModels: { [modelName: string]: mongoose.Model<any> };

  /**
   * ACL
   * access control list
   * map model to its access control
   */
  acl: { [modelName: string]: AccessInterface };

  /**
   * Parse one ShuttleModelProperty
   * @param property ShuttleModelProperty
   */
  static parseProperty(property: ShuttleModelProperty): any {
    // change this into recursive type when typescript 3.7 relases

    // recursive array mapping
    if (Array.isArray(property)) {
      return property.map((v) => MongooseBuilder.parseProperty(v));
    }

    // schema string parsing
    const matches = shuttleModelConsts.regex.exec(property);
    if (!matches) {
      logger.error(`Invalid property: ${property}`);
      return null;
    }

    if (shuttleModelConsts.supportedTypes.includes(matches.groups.type)) {
      const schemaItem = {} as any;
      if (matches.groups.type === 'Id') {
        // ObjectId
        matches.groups.type = 'ObjectId';
      }

      // find the according type
      schemaItem.type = Schema.Types[matches.groups.type as supportedInterface];

      // ref can only be used on ObjectId
      if (matches.groups.ref && matches.groups.type === 'ObjectId') {
        schemaItem.ref = matches.groups.ref;
      } else if (matches.groups.ref) {
        logger.error(`Invalid ref on property ${matches.groups.type} detected`);
      }
      if (matches.groups.required) {
        schemaItem.required = true;
      }
      if (matches.groups.default) {
        schemaItem.default = !!matches.groups.default;
      }
      return schemaItem;
    }
    logger.error(`Unkown property type: ${matches.groups.type}`);
    return null;
  }

  build(
    input: ShuttleModelInterface | mongoose.Model<any>
  ): mongoose.Model<any> | null {
    let result: mongoose.Model<any> | null = null;
    try {
      if (isShuttleModel(input)) {
        // shuttle models
        const coreSchema = {} as any;

        // owner
        if (input.hasOwner) {
          coreSchema.owner = { type: Schema.Types.ObjectId, ref: 'User' };
        }

        // everything else
        Object.entries(input.content).forEach(([key, value]) => {
          coreSchema[key] = MongooseBuilder.parseProperty(
            value as ShuttleModelProperty
          );
        });

        result = model(
          input.name,
          new Schema(coreSchema, { timestamps: true, collection: input.name })
        );
      } else if (input.prototype instanceof mongoose.Model) {
        result = input;
      } else {
        logger.error(`Unsupported model dectected: ${input}`);
      }
    } catch (err) {
      logger.error(err);
    }
    // store the built model
    if (result && !this.storedModels[input.name]) {
      this.storedModels[input.name] = result;
    }
    return result;
  }

  /**
   * getModel
   * return a mongoose model
   */
  async getModel(modelName: string): Promise<mongoose.Model<any> | null> {
    let result: mongoose.Model<any> | null;

    if (this.storedModels[modelName]) {
      // In memeory
      result = this.storedModels[modelName];
    } else {
      const imported: any = await importHandler.importOne(
        `../model/${modelName}`
      );

      if (imported) {
        // static
        result = this.build(imported);
        if (!imported.access) {
          this.acl[modelName] = predefinedAccess.adminOnly;
        } else {
          this.acl[modelName] = imported.access;
        }
        this.storedModels[modelName] = result;
      } else {
        // dynamic
        const found = await ShuttleModel.findOne({ name: modelName });

        if (found) {
          result = this.build({
            name: modelName,
            access: found.access,
            hasOwner: found.hasOwner,
            content: found.content,
          } as ShuttleModelInterface);

          if (!found.access) {
            this.acl[modelName] = predefinedAccess.adminOnly;
          } else {
            this.acl[modelName] = found.access;
          }
          this.storedModels[modelName] = result;
        } else {
          logger.error(`Unable to find model ${modelName}`);
          result = null;
        }
      }
    }
    return result;
  }
}

let builder: MongooseBuilder | null = null;

const getBuilder = (): MongooseBuilder => {
  if (!builder) {
    builder = new MongooseBuilder();
  }
  return builder;
};

export default getBuilder();
